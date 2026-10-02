// Replaces prod-1 style slugs with clean name-based slugs.
// Run with: node --env-file=.env scripts/fixProductSlugs.js

const { Client } = require('pg');

const connectionString = process.env.Direct_connection_str;
if (!connectionString) {
  console.error('Missing Direct_connection_str. Run with: node --env-file=.env scripts/fixProductSlugs.js');
  process.exit(1);
}

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')           // remove apostrophes
    .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
    .trim()
    .replace(/\s+/g, '-')          // spaces to hyphens
    .replace(/-+/g, '-');          // collapse multiple hyphens
}

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected.\n');

  try {
    const { rows: products } = await client.query(
      `SELECT id, name, slug FROM products ORDER BY created_at`
    );

    console.log(`Found ${products.length} products.\n`);

    // Generate unique slugs
    const usedSlugs = new Set();
    const updates = [];

    for (const p of products) {
      let base = toSlug(p.name);
      let slug = base;
      let counter = 2;
      while (usedSlugs.has(slug)) {
        slug = `${base}-${counter++}`;
      }
      usedSlugs.add(slug);
      updates.push({ id: p.id, oldSlug: p.slug, newSlug: slug, name: p.name });
    }

    // Apply updates
    for (const u of updates) {
      if (u.oldSlug === u.newSlug) {
        console.log(`  skipped  ${u.name} (slug already clean: ${u.newSlug})`);
        continue;
      }
      await client.query(`UPDATE products SET slug = $1 WHERE id = $2`, [u.newSlug, u.id]);
      console.log(`  updated  "${u.name}"\n           ${u.oldSlug}  →  ${u.newSlug}`);
    }

    console.log('\nDone!');
  } finally {
    await client.end();
  }
}

main().catch(err => { console.error(err.message); process.exit(1); });
