/**
 * Seeds 15 FAQs into the faqs table.
 * Also adds show_on_home column if it doesn't exist.
 * Run: node scripts/seed-faqs.mjs
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l.includes('=') && !l.trimStart().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

const faqs = [
  // --- Orders & Shipping (show_on_home: true) ---
  {
    category: 'Orders & Shipping',
    question: 'How long does delivery take?',
    answer: 'We deliver within 5–7 business days across India. Metro cities like Delhi, Mumbai, and Bangalore usually get it in 3–4 days. You will get a tracking link once your order ships.',
    display_order: 0,
    is_active: true,
    show_on_home: true,
  },
  {
    category: 'Orders & Shipping',
    question: 'Do you offer free shipping?',
    answer: 'Yes! Orders above ₹1,199 get free shipping. For orders below that, a flat delivery fee applies. COD orders may have a small extra charge.',
    display_order: 1,
    is_active: true,
    show_on_home: false,
  },
  {
    category: 'Orders & Shipping',
    question: 'Can I change or cancel my order after placing it?',
    answer: 'You can cancel or change your order within 24 hours of placing it. After that, the order goes into processing and cannot be changed. Contact us on WhatsApp or email as soon as possible.',
    display_order: 2,
    is_active: true,
    show_on_home: false,
  },

  // --- Sizing & Custom Fit (show_on_home: true) ---
  {
    category: 'Sizing & Custom Fit',
    question: 'How do I know which size to order?',
    answer: 'Check our size chart on the product page — it shows chest, waist, and height measurements. If you are between two sizes, go one size up for a comfortable fit. For kurtas, measure your chest and add 4 inches for a relaxed fit.',
    display_order: 0,
    is_active: true,
    show_on_home: true,
  },
  {
    category: 'Sizing & Custom Fit',
    question: 'Do you do custom tailoring or made-to-measure?',
    answer: 'Yes, we offer custom stitching on select styles. You can provide your measurements — chest, waist, shoulder width, and length — while ordering, and we will tailor it to your exact fit at no extra cost.',
    display_order: 1,
    is_active: true,
    show_on_home: false,
  },
  {
    category: 'Sizing & Custom Fit',
    question: 'What if my ordered size does not fit properly?',
    answer: 'If the size does not fit, we will exchange it for the correct size within 7 days of delivery. The product must be unworn, unwashed, and have the original tags. Reach out to our team and we will sort it out quickly.',
    display_order: 2,
    is_active: true,
    show_on_home: false,
  },

  // --- Returns & Exchanges ---
  {
    category: 'Returns & Exchanges',
    question: 'What is your return policy?',
    answer: 'We accept returns within 7 days of delivery for unused, unwashed products with original tags attached. Sale items and custom-stitched pieces are not eligible for return. We offer exchange or store credit.',
    display_order: 0,
    is_active: true,
    show_on_home: true,
  },
  {
    category: 'Returns & Exchanges',
    question: 'How do I return or exchange a product?',
    answer: 'Contact us via WhatsApp or email with your order number and reason for return. We will arrange a reverse pickup from your address. Once we receive and check the item, we will process your exchange or refund within 3–5 business days.',
    display_order: 1,
    is_active: true,
    show_on_home: false,
  },

  // --- Fabric & Craftsmanship ---
  {
    category: 'Fabric & Craftsmanship',
    question: 'What fabrics are used in Al Hareer products?',
    answer: 'We use premium fabrics including pure cotton, cotton-linen blends, rayon, and chanderi silk for different collections. Each product page lists the exact fabric and weight so you know exactly what you are buying.',
    display_order: 0,
    is_active: true,
    show_on_home: false,
  },
  {
    category: 'Fabric & Craftsmanship',
    question: 'Are the embroidery and prints handmade?',
    answer: 'Many of our designs feature hand-block printing and hand embroidery done by skilled artisans. Some collections use machine embroidery for consistency. This is mentioned clearly on each product page.',
    display_order: 1,
    is_active: true,
    show_on_home: false,
  },
  {
    category: 'Fabric & Craftsmanship',
    question: 'Will the color look the same as in the photos?',
    answer: 'We photograph our products in natural lighting to show the most accurate color. Minor differences can happen due to your screen settings. If the color looks significantly different on arrival, contact us within 48 hours.',
    display_order: 2,
    is_active: true,
    show_on_home: false,
  },

  // --- Care & Maintenance ---
  {
    category: 'Care & Maintenance',
    question: 'How should I wash my kurta or sherwani?',
    answer: 'For cotton and linen, gentle machine wash in cold water is fine. For embroidered or silk pieces, dry clean only. Turn the garment inside out before washing to protect the print and embroidery. Avoid direct sunlight when drying.',
    display_order: 0,
    is_active: true,
    show_on_home: true,
  },
  {
    category: 'Care & Maintenance',
    question: 'How do I store ethnic wear to avoid damage?',
    answer: 'Store folded in a cool, dry place away from direct sunlight. Use muslin cloth bags for delicate embroidered pieces. Avoid plastic bags as they trap moisture. For sherwanis and bandhgalas, hang them on padded hangers.',
    display_order: 1,
    is_active: true,
    show_on_home: false,
  },

  // --- Atelier & Bespoke Tailoring ---
  {
    category: 'Atelier & Bespoke Tailoring',
    question: 'Can I order a custom sherwani for my wedding?',
    answer: 'Absolutely! We take bespoke orders for sherwanis, bandhgalas, and complete wedding sets. Share your measurements, preferred fabric, and design preferences, and our team will create a one-of-a-kind piece just for you. Lead time is typically 2–3 weeks.',
    display_order: 0,
    is_active: true,
    show_on_home: false,
  },
  {
    category: 'Atelier & Bespoke Tailoring',
    question: 'Do you offer bulk orders for events or corporate gifting?',
    answer: 'Yes, we handle bulk orders for weddings, family occasions, and corporate gifting. For orders of 10+ pieces, we offer special pricing and priority processing. Contact our team directly for a custom quote.',
    display_order: 1,
    is_active: true,
    show_on_home: false,
  },
];

// Check if column exists, insert FAQs
const { data: existing } = await supabase.from('faqs').select('id').limit(1);

// Try to read show_on_home column
const { error: colCheckErr } = await supabase
  .from('faqs')
  .select('show_on_home')
  .limit(1);

if (colCheckErr) {
  console.error('show_on_home column not found in faqs table.');
  console.error('Please run this SQL in Supabase SQL Editor first:');
  console.error('ALTER TABLE faqs ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT false;');
  process.exit(1);
}

// Count existing FAQs
const { count } = await supabase.from('faqs').select('*', { count: 'exact', head: true });
console.log(`Current FAQ count: ${count}`);

if (count > 0) {
  console.log('FAQs already exist. Skipping seed to avoid duplicates.');
  console.log('To reseed: delete existing FAQs from the admin panel first.');
  process.exit(0);
}

const { error } = await supabase.from('faqs').insert(faqs);

if (error) {
  console.error('Failed to seed FAQs:', error.message);
  process.exit(1);
}

const homeCount = faqs.filter(f => f.show_on_home).length;
console.log(`✓ Seeded ${faqs.length} FAQs (${homeCount} marked for homepage).`);
