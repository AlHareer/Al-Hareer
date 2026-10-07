'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type ProductColor = { name: string; hex: string; image: string | null; images?: string[] };
export type ProductDetails = Record<string, string>;

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getAllProductsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('products')
    .select(
      'id, name, slug, featured_image_url, is_active, is_featured, category_id, categories ( name ), product_variants ( price, stock_quantity, is_active )'
    )
    .order('created_at', { ascending: false });

  return (data || []).map((p) => {
    const categoryRel = p.categories as unknown;
    const categoryName = Array.isArray(categoryRel)
      ? (categoryRel[0]?.name ?? null)
      : ((categoryRel as { name?: string } | null)?.name ?? null);

    const variants = (p.product_variants || []) as { price: number; stock_quantity: number; is_active: boolean }[];
    const activeVariants = variants.filter((v) => v.is_active !== false);
    const prices = variants.map((v) => v.price).filter((n) => n != null);
    const totalStock = variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
    const outOfStock = activeVariants.length === 0 || activeVariants.every((v) => (v.stock_quantity || 0) <= 0);
    const lowStock =
      !outOfStock && activeVariants.some((v) => (v.stock_quantity || 0) >= 1 && (v.stock_quantity || 0) <= 5);

    return {
      id: p.id as string,
      name: p.name as string,
      slug: p.slug as string,
      featured_image_url: p.featured_image_url as string | null,
      is_active: p.is_active as boolean,
      is_featured: p.is_featured as boolean,
      categoryName,
      variantCount: variants.length,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
      totalStock,
      outOfStock,
      lowStock,
    };
  });
}

export async function getProductByIdAdmin(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('products')
    .select(
      `*,
      product_images ( id, image_url, sort_order, variant_name, color ),
      product_variants ( id, variant_name, color, color_hex, price, original_price, stock_quantity, weight_grams, is_active ),
      product_faqs ( id, question, answer, display_order )`
    )
    .eq('id', id)
    .maybeSingle();

  return data;
}

type VariantInput = {
  variant_name: string;
  color?: string | null;
  color_hex?: string | null;
  price: string | number;
  original_price?: string | number | null;
  stock_quantity: string | number;
  is_active?: boolean;
};

type ImageInput = { image_url: string; sort_order?: number };
type FaqInput = { question: string; answer: string };

function parseJsonArray<T>(formData: FormData, key: string): T[] {
  const raw = formData.get(key);
  if (typeof raw !== 'string' || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function parseJsonObject(formData: FormData, key: string): Record<string, string> {
  const raw = formData.get(key);
  if (typeof raw !== 'string' || !raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

// A variant is a (color, size) pair — color is optional, so a single-color
// product can leave it blank. Mirrors SakPack's productValidation.js, adapted to TS.
function validateVariants(variants: VariantInput[]): string | null {
  if (!variants || variants.length === 0) return 'Add at least one size.';

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const label = v.variant_name && String(v.variant_name).trim() ? `"${v.variant_name}"` : `Size #${i + 1}`;

    if (!v.variant_name || !String(v.variant_name).trim()) {
      return `${label}: please enter a size name (e.g. S, M, L, XL).`;
    }
    if (v.price === '' || v.price == null || Number.isNaN(Number(v.price)) || Number(v.price) <= 0) {
      return `${label}: please enter a valid price.`;
    }
    if (v.original_price !== '' && v.original_price != null && Number(v.original_price) > 0 && Number(v.original_price) <= Number(v.price)) {
      const combo = v.color ? `${v.color} / ${v.variant_name}` : v.variant_name;
      return `"${combo}": MRP (₹${v.original_price}) must be higher than the sale price (₹${v.price}). Leave MRP blank if there is no discount.`;
    }
    if (
      v.stock_quantity === '' ||
      v.stock_quantity == null ||
      Number.isNaN(Number(v.stock_quantity)) ||
      Number(v.stock_quantity) < 0
    ) {
      return `${label}: please enter a stock quantity.`;
    }
  }

  const keys = variants.map(
    (v) => `${String(v.color || '').trim().toLowerCase()}::${String(v.variant_name).trim().toLowerCase()}`
  );
  const dupeIdx = keys.findIndex((k, i) => keys.indexOf(k) !== i);
  if (dupeIdx !== -1) {
    const dupe = variants[dupeIdx];
    const combo = dupe.color ? `${dupe.color} / ${dupe.variant_name}` : dupe.variant_name;
    return `Duplicate variant "${combo}" — each color + size combination must be unique.`;
  }

  return null;
}

async function syncChildren(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  productId: string,
  data: { images: ImageInput[]; variants: VariantInput[]; faqs: FaqInput[] }
) {
  await supabase.from('product_images').delete().eq('product_id', productId);
  if (data.images.length) {
    await supabase.from('product_images').insert(
      data.images.map((img, i) => ({
        product_id: productId,
        image_url: img.image_url,
        sort_order: img.sort_order ?? i,
      }))
    );
  }

  await supabase.from('product_variants').delete().eq('product_id', productId);
  if (data.variants.length) {
    await supabase.from('product_variants').insert(
      data.variants.map((v) => ({
        product_id: productId,
        variant_name: v.variant_name,
        color: v.color || null,
        color_hex: v.color ? v.color_hex || null : null,
        price: Number(v.price),
        original_price: v.original_price ? Number(v.original_price) : null,
        stock_quantity: Number(v.stock_quantity || 0),
        is_active: v.is_active !== false,
      }))
    );
  }

  await supabase.from('product_faqs').delete().eq('product_id', productId);
  if (data.faqs.length) {
    await supabase
      .from('product_faqs')
      .insert(data.faqs.map((f, i) => ({ product_id: productId, question: f.question, answer: f.answer, display_order: i })));
  }
}

function parseProductFields(formData: FormData) {
  return {
    name: ((formData.get('name') as string) || '').trim(),
    category_id: (formData.get('category_id') as string) || null,
    short_description: (formData.get('short_description') as string) || null,
    description: (formData.get('description') as string) || null,
    color: (formData.get('color') as string) || null,
    fabric: (formData.get('fabric') as string) || null,
    fit_type: (formData.get('fit_type') as string) || null,
    care_instructions: (formData.get('care_instructions') as string) || null,
    occasion: (formData.get('occasion') as string) || null,
    badge: (formData.get('badge') as string) || null,
    product_type: (formData.get('product_type') as string) || null,
    featured_image_url: (formData.get('featured_image_url') as string) || null,
    video_url: (formData.get('video_url') as string) || null,
    seo_title: (formData.get('seo_title') as string) || null,
    seo_description: (formData.get('seo_description') as string) || null,
    is_active: formData.get('is_active') === 'on',
    is_featured: formData.get('is_featured') === 'on',
    // The product form has no shop-visibility switch (Active already controls
    // visibility), so a missing field means "show" — never silently hide it.
    show_in_shop: formData.get('show_in_shop') !== 'off',
    colors: parseJsonArray<ProductColor>(formData, 'colors_json'),
    details: parseJsonObject(formData, 'details_json'),
  };
}

export type ProductFormState = { error?: string };

export async function createProduct(_prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const supabase = createAdminClient();
  const fields = parseProductFields(formData);
  if (!fields.name) return { error: 'Product name is required.' };

  const variants = parseJsonArray<VariantInput>(formData, 'variants_json');
  const variantsError = validateVariants(variants);
  if (variantsError) return { error: variantsError };

  const images = parseJsonArray<ImageInput>(formData, 'images_json');
  const faqs = parseJsonArray<FaqInput>(formData, 'faqs_json');

  const { data: product, error } = await supabase
    .from('products')
    .insert({ ...fields, slug: slugify(fields.name) })
    .select('id')
    .single();

  if (error || !product) return { error: error?.message || 'Failed to create product.' };

  await syncChildren(supabase, product.id, { images, variants, faqs });

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/', 'layout');
  redirect('/admin/products');
}

export async function updateProduct(_prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  const fields = parseProductFields(formData);
  if (!id || !fields.name) return { error: 'Product name is required.' };

  const variants = parseJsonArray<VariantInput>(formData, 'variants_json');
  const variantsError = validateVariants(variants);
  if (variantsError) return { error: variantsError };

  const images = parseJsonArray<ImageInput>(formData, 'images_json');
  const faqs = parseJsonArray<FaqInput>(formData, 'faqs_json');

  // Slug is intentionally NOT regenerated here — Al Hareer's existing catalog
  // uses stable slugs (its legacy product ids, e.g. "prod-1") as canonical
  // storefront URLs (/product/[slug]); silently renaming them on every edit
  // would break bookmarked/shared links. Only createProduct sets a slug.
  const { error } = await supabase
    .from('products')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  await syncChildren(supabase, id, { images, variants, faqs });

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/', 'layout');
  redirect('/admin/products');
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('products')
    .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/', 'layout');
  return { success: true };
}
