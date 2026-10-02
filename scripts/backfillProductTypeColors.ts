// One-off: backfills product_type + colors for the 48 products already seeded
// before those columns existed. Safe to re-run (always overwrites by slug).
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../src/data/products";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const imageMap: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(__dirname, "imageMap.json"), "utf8")
);
const resolveImage = (p?: string | null) => (p ? imageMap[p] ?? p : null);

async function main() {
  let updated = 0;
  for (const p of PRODUCTS) {
    const { error, count } = await supabase
      .from("products")
      .update(
        {
          product_type: p.productType ?? null,
          colors: p.colors.map((c) => ({ name: c.name, hex: c.hex, image: resolveImage(c.image) })),
          details: p.details ?? {},
        },
        { count: "exact" }
      )
      .eq("slug", p.id);
    if (error) throw error;
    updated += count ?? 0;
  }
  console.log(`Backfilled product_type/colors on ${updated} products.`);
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
