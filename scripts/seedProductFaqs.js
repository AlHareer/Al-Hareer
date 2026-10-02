// Inserts 5-6 product-specific FAQs for every product in the DB.
// Safe to re-run — clears existing FAQs for each product before inserting.
// Run with: node --env-file=.env scripts/seedProductFaqs.js

const { Client } = require('pg');

const connectionString = process.env.Direct_connection_str;
if (!connectionString) {
  console.error('Missing Direct_connection_str. Run with: node --env-file=.env scripts/seedProductFaqs.js');
  process.exit(1);
}

// ─── FAQ templates per product type ──────────────────────────────────────────

function getFabricCare(fabric = '') {
  const f = fabric.toLowerCase();
  if (f.includes('silk')) return 'Hand wash in cold water with mild detergent, or dry clean. Do not wring or tumble dry. Iron on low heat while slightly damp.';
  if (f.includes('linen')) return 'Machine wash on a gentle cycle with cold water. Tumble dry on low or air dry. Iron while slightly damp for best results.';
  if (f.includes('blend') || f.includes('viscose') || f.includes('rayon')) return 'Hand wash in cold water or dry clean. Avoid wringing. Hang dry and iron on low heat.';
  // default cotton
  return 'Machine wash in cold water on a gentle cycle. Tumble dry on low heat. Iron on medium heat while slightly damp to remove creases.';
}

function getFabricFeel(fabric = '') {
  const f = fabric.toLowerCase();
  if (f.includes('silk')) return 'It has a luxurious, smooth texture with a natural sheen — cool to the touch and ideal for festive or formal occasions.';
  if (f.includes('linen')) return 'It is light and breathable with a natural, slightly textured feel — great for warm weather and daily wear.';
  if (f.includes('blend')) return 'It has a soft, comfortable feel that combines the best of both fabrics — lightweight yet with a refined finish.';
  return 'It is soft, breathable, and comfortable for all-day wear. The fabric is pre-washed for shrink resistance.';
}

function getFabricSummer(fabric = '') {
  const f = fabric.toLowerCase();
  if (f.includes('silk')) return 'Silk kurtas work best for festive evenings and air-conditioned venues. For outdoor summer wear, we recommend our cotton or linen options.';
  if (f.includes('linen')) return 'Yes, linen is one of the best fabrics for summer — it is highly breathable and keeps you cool even in hot weather.';
  return 'Yes, this fabric is breathable and lightweight, making it comfortable for both indoor and outdoor summer wear.';
}

function getKurtaFaqs(product, fabric) {
  return [
    {
      question: 'How do I choose the right size?',
      answer: 'Measure your chest in inches and pick accordingly — S (38"), M (40"), L (42"), XL (44"), XXL (46"), XXXL (48"). Our kurtas are cut for a relaxed, comfortable fit. If you are between sizes, we recommend sizing up.',
    },
    {
      question: `What fabric is the ${product.name} made of?`,
      answer: `This kurta is made from ${fabric || 'premium quality fabric'}. ${getFabricFeel(fabric)}`,
    },
    {
      question: 'How should I wash and care for this kurta?',
      answer: getFabricCare(fabric),
    },
    {
      question: 'Is this kurta suitable for summer?',
      answer: getFabricSummer(fabric),
    },
    {
      question: 'What can I pair this kurta with?',
      answer: 'This kurta pairs well with our matching churidar pajamas, straight-cut pajamas, or slim-fit trousers. You can also layer it with a waistcoat for a more formal or festive look.',
    },
    {
      question: 'Will the color fade after washing?',
      answer: 'We use high-quality dyes tested for color fastness. To preserve the color, wash in cold water on a gentle cycle and avoid direct sunlight when drying.',
    },
  ];
}

function getKurtaSetFaqs(product, fabric) {
  return [
    {
      question: 'What does this kurta set include?',
      answer: 'This set includes a full-length kurta and a matching pajama, both stitched from the same fabric for a coordinated look.',
    },
    {
      question: 'How do I choose my size for the set?',
      answer: 'The size applies to both the kurta and pajama. Measure your chest for the kurta (S=38", M=40", L=42", XL=44", XXL=46") and your waist for the pajama — our pajamas have an adjustable drawstring waist that fits most sizes comfortably.',
    },
    {
      question: `What fabric is this set made of?`,
      answer: `Both pieces are made from ${fabric || 'premium quality fabric'}. ${getFabricFeel(fabric)}`,
    },
    {
      question: 'Can I buy the kurta and pajama separately?',
      answer: 'This item is sold as a set. However, we do sell individual kurtas and pajamas separately — browse our collection to find matching pieces.',
    },
    {
      question: 'How do I care for this set?',
      answer: getFabricCare(fabric),
    },
    {
      question: 'Is this set appropriate for weddings and festive occasions?',
      answer: 'Yes, this kurta set is designed for festive and formal occasions like weddings, Eid, and family celebrations. It can also be dressed down for casual family gatherings.',
    },
  ];
}

function getWaistcoatFaqs(product, fabric) {
  return [
    {
      question: 'What can I pair this waistcoat with?',
      answer: 'This waistcoat pairs well with any plain or lightly embroidered kurta. For a complete festive look, wear it over a matching kurta set. It also works with a straight kurta and trousers for a semi-formal style.',
    },
    {
      question: 'How do I choose my size?',
      answer: 'Measure your chest and pick accordingly — S (38"), M (40"), L (42"), XL (44"), XXL (46"). Waistcoats are designed for a fitted silhouette, so if you are between sizes, we recommend sizing up for comfort.',
    },
    {
      question: `What fabric is this waistcoat made of?`,
      answer: `This waistcoat is crafted from ${fabric || 'premium fabric'}. ${getFabricFeel(fabric)}`,
    },
    {
      question: 'Does this waistcoat have pockets?',
      answer: 'Yes, this waistcoat features front pockets designed to complement its traditional silhouette. They are functional and add to the classic look.',
    },
    {
      question: 'How do I wash this waistcoat?',
      answer: getFabricCare(fabric),
    },
    {
      question: 'Can I wear this waistcoat for formal occasions?',
      answer: 'Absolutely. This waistcoat is suitable for weddings, festivals, formal dinners, and cultural events. Layer it over a kurta for an elevated, traditional formal look.',
    },
  ];
}

function getPajamaFaqs(product, fabric) {
  return [
    {
      question: 'Does this pajama have an adjustable waistband?',
      answer: 'Yes, the pajama has a traditional drawstring waistband that can be adjusted for a comfortable, secure fit. It is designed to be worn throughout the day without discomfort.',
    },
    {
      question: 'How do I choose my size?',
      answer: 'Use your waist measurement to select the size: S (28–30"), M (32–34"), L (36–38"), XL (40–42"), XXL (44–46"). The drawstring waist provides additional flexibility across sizes.',
    },
    {
      question: `What fabric is this pajama made of?`,
      answer: `This pajama is made from ${fabric || 'breathable fabric'}. ${getFabricFeel(fabric)}`,
    },
    {
      question: 'Can this pajama be paired with other kurtas?',
      answer: 'Yes, this pajama is designed as a versatile bottom that pairs well with most straight-cut and flared kurtas, not just the matching set. It works for both daily wear and festive occasions.',
    },
    {
      question: 'How should I wash this pajama?',
      answer: getFabricCare(fabric),
    },
    {
      question: 'Is this pajama comfortable for all-day wear?',
      answer: 'Yes, the relaxed cut, soft fabric, and adjustable waist make this pajama comfortable enough for full-day wear, whether you are at a family function or relaxing at home.',
    },
  ];
}

function getDefaultFaqs(product, fabric) {
  return [
    {
      question: 'How do I choose the right size?',
      answer: 'Use your chest measurement to pick the right size — S (38"), M (40"), L (42"), XL (44"), XXL (46"). For a comfortable fit, we recommend choosing your regular size.',
    },
    {
      question: `What fabric is the ${product.name} made of?`,
      answer: `This product is made from ${fabric || 'premium quality fabric'}. ${getFabricFeel(fabric)}`,
    },
    {
      question: 'How should I wash and care for this item?',
      answer: getFabricCare(fabric),
    },
    {
      question: 'Is this item suitable for festive occasions?',
      answer: 'Yes, this piece is designed for traditional and festive wear — suitable for weddings, Eid, family celebrations, and cultural events.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 5–7 business days across India. Express delivery options may be available at checkout. You will receive a tracking link once your order is shipped.',
    },
    {
      question: 'What is the return and exchange policy?',
      answer: 'We accept returns and exchanges within 7 days of delivery, provided the item is unused, unwashed, and in its original condition with all tags intact. Contact our support team to initiate a return.',
    },
  ];
}

function generateFaqs(product) {
  const type = (product.product_type || '').toLowerCase();
  const fabric = product.fabric || '';

  if (type.includes('kurta set') || type.includes('kurta-set')) return getKurtaSetFaqs(product, fabric);
  if (type.includes('kurta')) return getKurtaFaqs(product, fabric);
  if (type.includes('waistcoat')) return getWaistcoatFaqs(product, fabric);
  if (type.includes('pajama') || type.includes('pyjama')) return getPajamaFaqs(product, fabric);
  return getDefaultFaqs(product, fabric);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to database.\n');

  try {
    const { rows: products } = await client.query(
      `SELECT id, name, product_type, fabric FROM products WHERE is_active = true ORDER BY created_at`
    );

    console.log(`Found ${products.length} products. Inserting FAQs...\n`);

    let totalInserted = 0;

    for (const product of products) {
      // Remove existing FAQs for this product first
      await client.query(`DELETE FROM product_faqs WHERE product_id = $1`, [product.id]);

      const faqs = generateFaqs(product);

      for (let i = 0; i < faqs.length; i++) {
        await client.query(
          `INSERT INTO product_faqs (product_id, question, answer, display_order) VALUES ($1, $2, $3, $4)`,
          [product.id, faqs[i].question, faqs[i].answer, i + 1]
        );
      }

      totalInserted += faqs.length;
      console.log(`✓ ${product.name} (${product.product_type || 'Unknown type'}) — ${faqs.length} FAQs inserted`);
    }

    console.log(`\nDone! ${totalInserted} FAQs inserted across ${products.length} products.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
