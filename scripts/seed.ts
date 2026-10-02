// Seeds Al Hareer's real hardcoded data (src/data/*.ts) into Supabase, using the
// ImageKit URLs produced by scripts/uploadImages.js (scripts/imageMap.json).
// Idempotent: skips categories/products/testimonials that already exist by slug/name.
// Run with: npm run db:seed  (requires `npm run images:upload` to have been run first)
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../src/data/products";
import { TESTIMONIALS } from "../src/data/testimonials";
import { OCCASIONS } from "../src/data/occasions";
import type { Product } from "../src/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  console.error("Run with: npm run db:seed");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const imageMapPath = path.join(__dirname, "imageMap.json");
if (!fs.existsSync(imageMapPath)) {
  console.error("scripts/imageMap.json not found — run `npm run images:upload` first.");
  process.exit(1);
}
const imageMap: Record<string, string> = JSON.parse(fs.readFileSync(imageMapPath, "utf8"));

function resolveImage(localPath: string | undefined | null): string | null {
  if (!localPath) return null;
  return imageMap[localPath] ?? localPath;
}

const CATEGORY_META: Record<string, { name: string; description: string }> = {
  daily: { name: "Daily Wear", description: "Everyday comfort kurta pajama sets for effortless style." },
  festive: { name: "Festive", description: "Festive kurta sets for celebrations and special occasions." },
  wedding: { name: "Wedding", description: "Wedding-ready ensembles crafted for grand occasions." },
  royal: { name: "Royal", description: "Regal, statement pieces for evening and formal events." },
};

// The first 8 entries in PRODUCTS are the hand-authored "primary" showcase products —
// mark them featured on the homepage. Everything after is the generated catalog filler.
const FEATURED_COUNT = 8;

async function seedCategories() {
  const slugs = Object.keys(CATEGORY_META);
  const map: Record<string, string> = {};
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const { data: existing } = await supabase.from("categories").select("id").eq("slug", slug).maybeSingle();
    if (existing) {
      map[slug] = existing.id;
      console.log(`category exists, skip: ${slug}`);
      continue;
    }
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: CATEGORY_META[slug].name, slug, description: CATEGORY_META[slug].description, sort_order: i })
      .select("id")
      .single();
    if (error) throw error;
    map[slug] = data.id;
    console.log(`category inserted: ${slug}`);
  }
  return map;
}

async function seedProducts(categoryMap: Record<string, string>) {
  let inserted = 0;
  let skipped = 0;
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p: Product = PRODUCTS[i];
    const { data: existing } = await supabase.from("products").select("id").eq("slug", p.id).maybeSingle();
    if (existing) {
      skipped++;
      continue;
    }

    const featuredImage = resolveImage(p.image);
    const singleColor = p.colors.length === 1 ? p.colors[0] : null;

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: p.name,
        slug: p.id,
        category_id: categoryMap[p.category] ?? null,
        short_description: p.description.slice(0, 160),
        description: p.description,
        color: p.details?.color ?? p.colors[0]?.name ?? null,
        fabric: p.fabric,
        fit_type: p.details?.fit ?? null,
        care_instructions: p.details?.care ?? null,
        occasion: p.details?.occasion ?? null,
        badge: p.tag ?? null,
        product_type: p.productType ?? null,
        colors: p.colors.map((c) => ({ name: c.name, hex: c.hex, image: resolveImage(c.image) ?? c.image ?? null })),
        details: p.details ?? {},
        featured_image_url: featuredImage,
        is_active: true,
        is_featured: i < FEATURED_COUNT,
        show_in_shop: true,
        average_rating: p.rating,
        review_count: p.reviewCount,
      })
      .select("id")
      .single();
    if (error) throw error;

    // One variant per size — Al Hareer's source data has no true per-color-per-size
    // stock matrix (colors[]/sizes[] are independent flat lists), so every size shares
    // the product's single price/stock. See db/schema.sql + plan notes for this tradeoff.
    const variantRows = p.sizes.map((size) => ({
      product_id: product.id,
      variant_name: size,
      color: singleColor?.name ?? null,
      color_hex: singleColor?.hex ?? null,
      price: p.price,
      original_price: p.originalPrice ?? null,
      stock_quantity: p.inStock ? 15 : 0,
      is_active: true,
    }));
    if (variantRows.length) {
      const { error: variantErr } = await supabase.from("product_variants").insert(variantRows);
      if (variantErr) throw variantErr;
    }

    const gallery = p.images && p.images.length ? p.images : [p.image];
    const imageRows = gallery.map((img, sortOrder) => ({
      product_id: product.id,
      image_url: resolveImage(img) ?? img,
      sort_order: sortOrder,
    }));
    if (imageRows.length) {
      const { error: imageErr } = await supabase.from("product_images").insert(imageRows);
      if (imageErr) throw imageErr;
    }

    inserted++;
  }
  console.log(`products: ${inserted} inserted, ${skipped} skipped (already existed)`);
}

async function seedTestimonials() {
  let inserted = 0;
  for (let i = 0; i < TESTIMONIALS.length; i++) {
    const t = TESTIMONIALS[i];
    const { data: existing } = await supabase
      .from("testimonials")
      .select("id")
      .eq("customer_name", t.name)
      .eq("review_text", t.comment)
      .maybeSingle();
    if (existing) continue;
    const { error } = await supabase.from("testimonials").insert({
      customer_name: t.name,
      role: t.role,
      location: t.location,
      review_text: t.comment,
      rating: t.rating,
      image_url: resolveImage(t.image),
      display_order: i,
      is_active: true,
    });
    if (error) throw error;
    inserted++;
  }
  console.log(`testimonials: ${inserted} inserted`);
}

async function seedOccasions() {
  const value = JSON.stringify(
    OCCASIONS.map((o) => ({ id: o.id, title: o.title, tag: o.tag, image: resolveImage(o.image) }))
  );
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key: "home_shopby_occasions", value, category: "home", description: "Shop-by-occasion tiles on the homepage" },
      { onConflict: "key" }
    );
  if (error) throw error;
  console.log("site_settings: home_shopby_occasions upserted");
}

async function seedBrandSettings() {
  const rows = [
    { key: "brand_name", value: "Al Hareer", category: "brand", description: "Site brand name" },
    { key: "tagline", value: "Tradition in Style", category: "brand", description: "Site tagline" },
    { key: "contact_email", value: "support@alhareer.com", category: "contact", description: "Support email" },
    { key: "contact_phone", value: "+91 73966 90308", category: "contact", description: "Support phone / WhatsApp" },
    { key: "cod_enabled", value: "true", category: "checkout", description: "Cash on delivery available" },
  ];
  for (const row of rows) {
    const { error } = await supabase.from("site_settings").upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw error;
  }
  console.log(`site_settings: ${rows.length} brand/contact rows upserted`);
}

async function main() {
  const categoryMap = await seedCategories();
  await seedProducts(categoryMap);
  await seedTestimonials();
  await seedOccasions();
  await seedBrandSettings();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
