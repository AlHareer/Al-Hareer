/**
 * Seeds all site_settings defaults into the database.
 * Uses ON CONFLICT (key) DO NOTHING — existing admin-edited values are preserved.
 * Run with: node scripts/seed-site-settings.mjs
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l.includes('=') && !l.trimStart().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const SUPABASE_URL     = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── Inline schema (mirrors src/lib/siteSettingsSchema.ts) ──────────────────────

const HOME_SETTINGS_DEFAULTS = {
  home_splitbanner_heading:     { value: 'Made For Comfort,\nMade For You', category: 'home' },
  home_splitbanner_description: { value: 'Breathable fabric, good stitching, and classic cuts that are comfortable to wear.', category: 'home' },
  home_aboutteaser_heading:     { value: 'Traditional Look,\nModern Fit', category: 'home' },
  home_aboutteaser_paragraph:   { value: 'Al Hareer makes comfortable traditional clothes for men.', category: 'home' },
  home_aboutteaser_paragraph2:  { value: 'Our kurtas work for festivals, weddings, and everyday wear.', category: 'home' },
  home_trustbar_items: {
    value: JSON.stringify([
      { title: 'Traditional Style', subtitle: 'Rooted in Heritage' },
      { title: 'Modern Comfort',    subtitle: 'Made for Today' },
      { title: 'Simple Designs',    subtitle: 'For Every Occasion' },
      { title: 'Better Choices',    subtitle: 'Responsible Fashion' },
    ]),
    category: 'home',
  },
  home_ourstory_heading:    { value: 'Rooted in Tradition.\nStyled for Today.', category: 'home' },
  home_ourstory_paragraph:  { value: 'We keep tradition alive through our clothing. Our kurtas and pajamas are made with care, using traditional weaving methods, and designed for everyday life.', category: 'home' },
  home_moments_heading:     { value: 'Not Just Outfits,\nBut Moments', category: 'home' },
  home_moments_paragraph:   { value: 'From festivals to weddings, our clothes are part of your best memories.', category: 'home' },
  home_contact_heading:     { value: "We'd Love To Hear From You", category: 'home' },
  home_contact_subtitle:    { value: "Have a question about sizing, an order, or anything else? We're here to help.", category: 'home' },
  home_contact_phone:       { value: '+91 73966 90308', category: 'home' },
  home_contact_email:       { value: 'support@alhareer.com', category: 'home' },
  home_contact_address:     { value: 'Jabalpur, Madhya Pradesh, India', category: 'home' },
  home_contact_hours:       { value: 'Monday – Saturday: 10:00 AM – 7:00 PM IST', category: 'home' },
  home_newsletter_heading:  { value: 'Be the First\nto Experience More', category: 'home' },
  home_newsletter_subtitle: { value: 'Sign up for new arrivals, offers, and updates.', category: 'home' },
  // images
  footer_arch_image:           { value: '', category: 'home' },
  home_splitbanner_image1:     { value: '', category: 'home' },
  home_splitbanner_image2:     { value: '', category: 'home' },
  home_ourstory_image1:        { value: '', category: 'home' },
  home_ourstory_image2:        { value: '', category: 'home' },
  home_aboutteaser_image:      { value: '', category: 'home' },
  home_newsletter_image:       { value: '', category: 'home' },
  home_hero_video_url:         { value: 'fJ9rUzIMcZQ', category: 'home' },
  home_moments_cards: {
    value: JSON.stringify([
      { title: 'Festivals Feel Brighter', subtitle: 'Diwali, Eid & Celebrations',      image: '' },
      { title: 'Weddings Look Grand',     subtitle: 'Sangeet, Baraat & Receptions',    image: '' },
      { title: 'Everyday Feels Better',   subtitle: 'Casual Grace & Comfort',          image: '' },
    ]),
    category: 'home',
  },
};

const ABOUT_SETTINGS_DEFAULTS = {
  about_hero_eyebrow:      { value: 'ABOUT US',                  category: 'about' },
  about_hero_title:        { value: 'About Al Hareer',           category: 'about' },
  about_hero_subtitle:     { value: 'Good Clothes, Made Well',   category: 'about' },
  about_hero_image:        { value: '',                          category: 'about' },
  about_pillars_eyebrow:   { value: 'OUR FOUR PILLARS',          category: 'about' },
  about_pillars_heading:   { value: 'What Makes Us Different',   category: 'about' },
  about_pillars_subtitle:  { value: 'We check every piece for comfort and quality.', category: 'about' },
  about_pillars_items: {
    value: JSON.stringify([
      { title: 'Quality Fabrics',       desc: "We use cotton and silk that's pre-washed so it won't shrink.", badge: 'No Synthetic Blends' },
      { title: 'Good Fit',              desc: 'Made to fit well and feel comfortable.',                        badge: 'Comfortable Fit'    },
      { title: 'Made Thoughtfully',     desc: 'We make in small batches and pay our weavers fairly.',          badge: 'Fair to Weavers'    },
      { title: 'Handcrafted Details',   desc: 'Collars and embroidery are stitched by hand.',                  badge: 'Made by Hand'       },
    ]),
    category: 'about',
  },
  about_process_eyebrow:  { value: "HOW IT'S MADE",                  category: 'about' },
  about_process_heading:  { value: 'How We Make Your Clothes',        category: 'about' },
  about_process_subtitle: { value: 'Here is how each piece is made, step by step.', category: 'about' },
  about_process_items: {
    value: JSON.stringify([
      { title: 'Sourcing the Fabric',       desc: 'We buy good cotton, linen, and silk directly from suppliers.' },
      { title: 'Weaving',                   desc: 'Our fabric is handwoven on traditional looms.' },
      { title: 'Tailoring',                 desc: 'Tailors cut and stitch each piece by hand.' },
      { title: 'Quality Check & Packing',   desc: 'Every garment is checked, pressed, and packed before it ships to you.' },
    ]),
    category: 'about',
  },
  about_stats_items: {
    value: JSON.stringify([
      { value: '100%',  label: 'Handloom Fabric',         desc: 'Ethically sourced natural fibres'      },
      { value: '50k+',  label: 'Customers Served',        desc: 'Across India and abroad'               },
      { value: '120+',  label: 'Weavers We Work With',    desc: 'Supporting traditional weaving families'},
      { value: '4.9★',  label: 'Customer Rating',         desc: 'From over 1,200 verified reviews'      },
    ]),
    category: 'about',
  },
  about_cta_heading:      { value: 'Shop Al Hareer',                                    category: 'about' },
  about_cta_subtitle:     { value: 'Kurtas, kurta sets, and waistcoats, made by hand.', category: 'about' },
  about_cta_button_text:  { value: 'Shop Now',                                          category: 'about' },
};

const STORY_SETTINGS_DEFAULTS = {
  story_hero_eyebrow:   { value: 'OUR STORY',                           category: 'story' },
  story_hero_title:     { value: 'Our Story',                           category: 'story' },
  story_hero_subtitle:  { value: 'Rooted in Tradition. Styled for Today.', category: 'story' },
  story_hero_image:     { value: '',                                    category: 'story' },
  story_ch1_eyebrow:    { value: 'CHAPTER ONE',                         category: 'story' },
  story_ch1_heading:    { value: 'Why We Started',                      category: 'story' },
  story_ch1_paragraph1: { value: "You need an outfit for a wedding or festival. Most store options are uncomfortable, or they just don't fit well.", category: 'story' },
  story_ch1_paragraph2: { value: 'We started Al Hareer in 2018 to make ethnic wear that is actually comfortable to wear.', category: 'story' },
  story_ch1_quote:      { value: "You shouldn't have to choose between looking good and feeling comfortable.", category: 'story' },
  story_ch1_quote_attribution: { value: 'Al Hareer', category: 'story' },
  story_ch1_image1:     { value: '', category: 'story' },
  story_ch1_image2:     { value: '', category: 'story' },
  story_ch2_eyebrow:    { value: 'CHAPTER TWO',                           category: 'story' },
  story_ch2_heading:    { value: 'The People Behind Our Fabric',           category: 'story' },
  story_ch2_paragraph1: { value: 'Real people make every Al Hareer kurta. Our weavers have done this work for decades.', category: 'story' },
  story_ch2_paragraph2: { value: 'We use traditional handlooms, not factory machines. We pay our weavers fairly and give them work all year.', category: 'story' },
  story_ch2_weaver_name: { value: 'Ramzan Ali and Family',               category: 'story' },
  story_ch2_weaver_desc: { value: 'Third-generation weavers from Chanderi.', category: 'story' },
  story_ch2_image:      { value: '', category: 'story' },
  story_ch2_stats_items: {
    value: JSON.stringify([
      { label: 'No Synthetic Fabric', desc: 'Pre-washed, natural fibres only', value: '100%'     },
      { label: 'Direct to Weavers',   desc: 'No middlemen taking a cut',       value: 'Fair-Pay' },
    ]),
    category: 'story',
  },
  story_ch3_eyebrow: { value: 'CHAPTER THREE',                          category: 'story' },
  story_ch3_heading: { value: 'Our Journey So Far',                     category: 'story' },
  story_ch3_subtitle:{ value: 'From a handful of kurtas to shipping across the world.', category: 'story' },
  story_milestones_items: {
    value: JSON.stringify([
      { year: '2018',  title: 'The First Kurtas',    desc: 'Tired of uncomfortable synthetic kurtas in the market, we partnered with two weaving families in Varanasi to make our first 4 cotton kurtas.' },
      { year: '2020',  title: 'Adding Silk',          desc: 'We introduced Chanderi silk and silk-cotton blends, and expanded into new colours beyond white.' },
      { year: '2023',  title: 'Going Global',         desc: 'Started shipping to customers in 20+ countries, including the US, UK, Canada, and UAE.' },
      { year: 'Today', title: '48 Styles and Growing',desc: 'From waistcoats to pajamas to kurtas — we keep adding new styles, made the same careful way.' },
    ]),
    category: 'story',
  },
  story_ch4_eyebrow: { value: 'WHAT WE BELIEVE',    category: 'story' },
  story_ch4_heading: { value: 'What We Stand For',  category: 'story' },
  story_values_items: {
    value: JSON.stringify([
      { title: 'Everyday Tradition',     desc: 'You can wear our clothes anytime, not just for special occasions.' },
      { title: 'Good Tailoring',         desc: 'Our clothes are shaped to fit real bodies well.' },
      { title: 'Responsible Production', desc: 'We pay fair wages, avoid waste, and use plastic-free packaging.' },
      { title: 'Quality Control',        desc: 'We test every fabric before we use it.' },
    ]),
    category: 'story',
  },
  story_cta_heading:  { value: 'Shop Our Collection',                    category: 'story' },
  story_cta_subtitle: { value: 'Handmade kurtas, kurta sets, and waistcoats.', category: 'story' },
};

const ALL_DEFAULTS = {
  ...HOME_SETTINGS_DEFAULTS,
  ...ABOUT_SETTINGS_DEFAULTS,
  ...STORY_SETTINGS_DEFAULTS,
};

// ── Run seed ───────────────────────────────────────────────────────────────────

const rows = Object.entries(ALL_DEFAULTS).map(([key, meta]) => ({
  key,
  value: meta.value,
  category: meta.category,
}));

console.log(`Seeding ${rows.length} site_settings rows (ON CONFLICT DO NOTHING)...`);

// Batch into chunks of 50
const CHUNK = 50;
let inserted = 0;
let skipped  = 0;

for (let i = 0; i < rows.length; i += CHUNK) {
  const chunk = rows.slice(i, i + CHUNK);
  const { data, error } = await supabase
    .from('site_settings')
    .upsert(chunk, { onConflict: 'key', ignoreDuplicates: true })
    .select('key');

  if (error) {
    console.error('Error inserting chunk:', error.message);
    process.exit(1);
  }

  const count = data?.length ?? 0;
  inserted += count;
  skipped  += chunk.length - count;
}

console.log(`Done.`);
console.log(`  Inserted (new rows): ${inserted}`);
console.log(`  Skipped  (existing): ${skipped}`);
