import { createPublicClient } from '@/lib/supabase/public';
import type { Product, ProductColor } from '@/types';

const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size', 'Standard'];

const PRODUCT_SELECT = `
  id, name, slug, badge, product_type, color, fabric, occasion, fit_type, care_instructions, description, short_description,
  featured_image_url, video_url, average_rating, review_count, colors, details, is_featured, created_at,
  categories ( slug ),
  product_images ( image_url, sort_order ),
  product_variants ( variant_name, color, price, original_price, stock_quantity, is_active )
`;

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  badge: string | null;
  product_type: string | null;
  color: string | null;
  fabric: string | null;
  occasion: string | null;
  fit_type: string | null;
  care_instructions: string | null;
  description: string | null;
  short_description: string | null;
  featured_image_url: string | null;
  video_url: string | null;
  average_rating: number | null;
  review_count: number | null;
  colors: ProductColor[] | null;
  details: Product['details'] | null;
  is_featured: boolean;
  created_at: string;
  categories: { slug: string } | { slug: string }[] | null;
  product_images: { image_url: string; sort_order: number }[] | null;
  product_variants: { variant_name: string; color: string | null; price: number; original_price: number | null; stock_quantity: number; is_active: boolean }[] | null;
};

// An MRP only counts as a "cut price" when it is above the selling price; a lower or equal
// one is a data-entry slip and must never show as a strike-through or a discount.
const validMrp = (price: number, mrp: number | null | undefined) => (mrp != null && mrp > price ? mrp : undefined);

function mapRow(row: ProductRow): Product {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  const activeVariants = (row.product_variants ?? []).filter((v) => v.is_active);
  const cheapest = [...activeVariants].sort((a, b) => a.price - b.price)[0];
  const sizes = [...new Set(activeVariants.map((v) => v.variant_name))].sort(
    (a, b) => {
      const ia = SIZE_ORDER.indexOf(a);
      const ib = SIZE_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }
  );
  // Per-size stock: a size is "out of stock" when ALL active variants for it have stock_quantity = 0
  const sizeStockTotals = new Map<string, number>();
  for (const v of activeVariants) {
    sizeStockTotals.set(v.variant_name, (sizeStockTotals.get(v.variant_name) ?? 0) + v.stock_quantity);
  }
  const sizesOutOfStock = sizes.filter((s) => (sizeStockTotals.get(s) ?? 0) === 0);

  // Per-size pricing: for each size, pick the lowest price across all color variants
  const sizePriceMap = new Map<string, { price: number; originalPrice?: number }>();
  for (const v of activeVariants) {
    const existing = sizePriceMap.get(v.variant_name);
    if (!existing || v.price < existing.price) {
      sizePriceMap.set(v.variant_name, {
        price: v.price,
        originalPrice: validMrp(v.price, v.original_price),
      });
    }
  }
  const variantPrices = sizes.map((s) => ({ size: s, ...sizePriceMap.get(s)! })).filter((s) => s.price != null);
  const variants = activeVariants.map((v) => ({
    size: v.variant_name,
    color: v.color ?? '',
    price: v.price,
    originalPrice: validMrp(v.price, v.original_price),
    stock: v.stock_quantity,
  }));
  const images = (row.product_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.image_url);

  return {
    id: row.slug,
    name: row.name,
    price: cheapest?.price ?? 0,
    originalPrice: cheapest ? validMrp(cheapest.price, cheapest.original_price) : undefined,
    rating: row.average_rating ?? 0,
    reviewCount: row.review_count ?? 0,
    image: row.featured_image_url ?? images[0] ?? '',
    images: images.length ? images : undefined,
    category: category?.slug ?? 'all',
    productType: row.product_type ?? undefined,
    tag: row.badge ?? undefined,
    colors: row.colors ?? [],
    sizes,
    sizesOutOfStock: sizesOutOfStock.length > 0 ? sizesOutOfStock : undefined,
    variantPrices: variantPrices.length > 0 ? variantPrices : undefined,
    variants: variants.length > 0 ? variants : undefined,
    description: row.description ?? '',
    fabric: row.fabric ?? '',
    inStock: activeVariants.some((v) => v.stock_quantity > 0),
    videoUrl: row.video_url ?? undefined,
    details: mergeDetails(row),
  };
}

// The admin form saves fabric/color/occasion/fit/care in their own columns and
// only set-includes/work in the `details` JSON, while the product page reads
// everything from `details`. Columns win when filled in (that's what an admin
// edits today); older seeded products fall back to what's in `details`.
function mergeDetails(row: ProductRow): Product['details'] {
  const base = row.details ?? {};
  const pick = (column: string | null, fallback?: string) => column?.trim() || fallback || undefined;
  const merged = {
    ...base,
    material: pick(row.fabric, base.material),
    color: pick(row.color, base.color),
    occasion: pick(row.occasion, base.occasion),
    fit: pick(row.fit_type, base.fit),
    care: pick(row.care_instructions, base.care),
  };
  return merged;
}

// Picks the right photo for a chosen color (photos vary by color, not size —
// a Small and a Medium of the same Red kurta use the same picture). Falls
// back to the product's default image when that color has none of its own.
// Used wherever a selected color needs to show a matching picture — product
// page, cart, wishlist, checkout. The `size` parameter is accepted but
// unused, kept so call sites don't need to change if size-level photos are
// ever reintroduced.
export function getVariantImage(product: Product, _size?: string, color?: string): string {
  if (color) {
    const colorMatch = product.colors.find((c) => c.name === color);
    if (colorMatch?.image) return colorMatch.image;
  }
  return product.image;
}

// The full photo set for a color (for swapping the whole gallery/thumbnail
// strip when a customer picks a color on the product page), falling back to
// the product's general gallery when that color has no photos of its own.
export function getColorGallery(product: Product, color?: string): string[] {
  if (color) {
    const colorMatch = product.colors.find((c) => c.name === color);
    if (colorMatch?.images?.length) return colorMatch.images;
    if (colorMatch?.image) return [colorMatch.image];
  }
  return product.images?.length ? product.images : [product.image];
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as unknown as ProductRow[]).map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select(`${PRODUCT_SELECT}, product_faqs ( question, answer, display_order )`)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = data as unknown as ProductRow & {
    product_faqs: { question: string; answer: string; display_order: number }[] | null;
  };
  const product = mapRow(row);

  product.faqs = (row.product_faqs ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((f) => ({ question: f.question, answer: f.answer }));

  return product;
}

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  parentId: string | null;
};

export async function getActiveCategories(options?: { topLevelOnly?: boolean; homepageOnly?: boolean }): Promise<CategoryItem[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from('categories')
    .select('id, name, slug, image_url, parent_id')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (options?.topLevelOnly) query = query.is('parent_id', null);
  if (options?.homepageOnly) query = query.eq('show_on_homepage', true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((c) => ({ id: c.id, name: c.name, slug: c.slug, image: c.image_url, parentId: c.parent_id ?? null }));
}

export type ProductTypeShowcaseItem = {
  productType: string;
  count: number;
  image: string;
};

// One representative real product image + count per product_type, in the
// fixed PRODUCT_TYPES order (src/lib/productConstants.ts) — powers the big
// "shop by category" block grid on the homepage. Types with zero visible
// products are skipped rather than shown empty.
export async function getProductTypeShowcase(): Promise<ProductTypeShowcaseItem[]> {
  const { PRODUCT_TYPES } = await import('@/lib/productConstants');
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select('product_type, featured_image_url, is_featured, created_at')
    .eq('is_active', true)
    .not('product_type', 'is', null)
    .not('featured_image_url', 'is', null);
  if (error) throw error;

  const byType = new Map<string, { count: number; image: string; isFeatured: boolean; createdAt: string }>();
  for (const row of data ?? []) {
    const type = row.product_type as string;
    const existing = byType.get(type);
    if (!existing) {
      byType.set(type, { count: 1, image: row.featured_image_url as string, isFeatured: row.is_featured, createdAt: row.created_at });
    } else {
      existing.count += 1;
      // Prefer a featured product's image, otherwise the most recently added.
      if (row.is_featured && !existing.isFeatured) {
        existing.image = row.featured_image_url as string;
        existing.isFeatured = true;
      }
    }
  }

  return PRODUCT_TYPES.filter((t) => byType.has(t)).map((t) => {
    const entry = byType.get(t)!;
    return { productType: t, count: entry.count, image: entry.image };
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as unknown as ProductRow[]).map(mapRow);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .neq('slug', product.id)
    .limit(limit);
  const { data: catRows } = await supabase.from('categories').select('id').eq('slug', product.category).maybeSingle();
  if (catRows?.id) query = query.eq('category_id', catRows.id);
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as ProductRow[]).map(mapRow);
}

export async function searchProducts(q: string, limit = 8): Promise<Product[]> {
  if (!q.trim()) return getFeaturedProducts();
  // Strip characters that have meaning inside a PostgREST .or() filter.
  const term = q.replace(/[,()%*\\]/g, ' ').trim();
  if (!term) return getFeaturedProducts();
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .or(`name.ilike.%${term}%,description.ilike.%${term}%,fabric.ilike.%${term}%`)
    .limit(limit);
  if (error) throw error;
  return (data as unknown as ProductRow[]).map(mapRow);
}

export type NavMenuGroup = {
  label: string;
  href: string;
  image: string | null;
};

export type NavMenuData = {
  groups: NavMenuGroup[];
};

// The Navbar's Shop menu shows every active top-level (parent) category,
// straight from the database — no product counts, no fabrics, no promo,
// nothing invented. Links use the category slug, which is what the shop
// page's category filter matches on (a parent slug also matches its children).
export async function getNavMenuData(): Promise<NavMenuData> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('categories')
    .select('name, slug, image_url, parent_id')
    .eq('is_active', true)
    .is('parent_id', null)
    .order('sort_order', { ascending: true });
  if (error) throw error;

  const groups: NavMenuGroup[] = (data ?? []).map((c) => ({
    label: c.name,
    href: `/shop?category=${encodeURIComponent(c.slug)}`,
    image: c.image_url,
  }));

  return { groups };
}

// Price/stock for the exact size + color a customer picked. Falls back to the
// cheapest variant of that size (or the product's overall price) when the
// exact combination isn't found, so a price is always shown.
export function getVariantPricing(
  product: Product,
  size?: string,
  color?: string
): { price: number; originalPrice?: number; stock: number | null } {
  const rows = product.variants ?? [];
  const exact = rows.find((v) => v.size === size && (v.color || '') === (color || ''));
  const bySize = rows.filter((v) => v.size === size).sort((a, b) => a.price - b.price)[0];
  const hit = exact ?? bySize;
  if (hit) return { price: hit.price, originalPrice: hit.originalPrice, stock: exact ? hit.stock : null };
  return { price: product.price, originalPrice: product.originalPrice, stock: null };
}

// Lowest price among a color's in-stock-or-not variants, for "from" prices on cards.
export function getColorStartPrice(product: Product, color?: string): { price: number; originalPrice?: number } {
  const rows = (product.variants ?? []).filter((v) => (v.color || '') === (color || ''));
  const cheapest = rows.sort((a, b) => a.price - b.price)[0];
  return cheapest ? { price: cheapest.price, originalPrice: cheapest.originalPrice } : { price: product.price, originalPrice: product.originalPrice };
}
