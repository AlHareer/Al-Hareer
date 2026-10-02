/**
 * Uploads all site fallback images to ImageKit and writes the resulting URLs
 * back into site_settings in Supabase. Safe to re-run — skips keys that
 * already have a non-empty value in the DB.
 *
 * Run with: node scripts/upload-images-to-imagekit.mjs
 * Reads credentials from .env in the project root.
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// ── Load .env ──────────────────────────────────────────────────────────────────
const envFile = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l.includes('=') && !l.trimStart().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const SUPABASE_URL     = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];
const IK_PRIVATE_KEY   = env['IMAGEKIT_PRIVATE_KEY'];
const IK_UPLOAD_URL    = 'https://upload.imagekit.io/api/v1/files/upload';
const PUBLIC_DIR       = decodeURIComponent(new URL('../public', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── Upload helper ──────────────────────────────────────────────────────────────
async function uploadToImageKit(localPath, fileName, folder) {
  const fileBuffer = readFileSync(localPath);
  const base64     = fileBuffer.toString('base64');
  const ext        = localPath.split('.').pop().toLowerCase();
  const mimeMap    = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
  const mime       = mimeMap[ext] || 'image/jpeg';
  const dataUri    = `data:${mime};base64,${base64}`;

  const body = new URLSearchParams();
  body.append('file',     dataUri);
  body.append('fileName', fileName);
  body.append('folder',   folder);

  const auth = Buffer.from(`${IK_PRIVATE_KEY}:`).toString('base64');
  const res  = await fetch(IK_UPLOAD_URL, {
    method:  'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ImageKit upload failed for ${fileName}: ${err}`);
  }
  const json = await res.json();
  return json.url;
}

// ── Map: DB key → { localFile, folder, fileName } ─────────────────────────────
const SINGLE_KEYS = [
  { key: 'footer_arch_image',       file: 'images/footer-arch.jpg',            folder: '/al-hareer/footer',           name: 'footer-arch.jpg'          },
  { key: 'home_splitbanner_image1', file: 'images/shopby/comfort-kurta.jpg',   folder: '/al-hareer/home/splitbanner', name: 'comfort-kurta.jpg'         },
  { key: 'home_splitbanner_image2', file: 'images/shopby/heritage-fabric.jpg', folder: '/al-hareer/home/splitbanner', name: 'heritage-fabric.jpg'       },
  { key: 'home_ourstory_image1',    file: 'images/your-image-19.jpg',          folder: '/al-hareer/home/ourstory',    name: 'ourstory-left.jpg'         },
  { key: 'home_ourstory_image2',    file: 'images/same.jpg',                   folder: '/al-hareer/home/ourstory',    name: 'ourstory-right.jpg'        },
  { key: 'home_aboutteaser_image',  file: 'images/your-image-19.jpg',          folder: '/al-hareer/home/about',       name: 'aboutteaser.jpg'           },
  { key: 'home_newsletter_image',   file: 'images/your-image-19.jpg',          folder: '/al-hareer/home/newsletter',  name: 'newsletter-panel.jpg'      },
  { key: 'about_hero_image',        file: 'images/shop-banner-arch.jpg',       folder: '/al-hareer/about',            name: 'about-hero-arch.jpg'       },
  { key: 'story_hero_image',        file: 'images/shop-banner-arch.jpg',       folder: '/al-hareer/story',            name: 'story-hero-arch.jpg'       },
  { key: 'story_ch1_image1',        file: 'images/your-image-19.jpg',          folder: '/al-hareer/story',            name: 'story-ch1-left.jpg'        },
  { key: 'story_ch1_image2',        file: 'images/same.jpg',                   folder: '/al-hareer/story',            name: 'story-ch1-right.jpg'       },
  { key: 'story_ch2_image',         file: 'images/shopby/wedding.jpg',         folder: '/al-hareer/story',            name: 'story-ch2-weaver.jpg'      },
];

const MOMENT_IMAGES = [
  { file: 'images/your-image-20.jpg', folder: '/al-hareer/home/moments', name: 'moment-1.jpg' },
  { file: 'images/your-image-21.jpg', folder: '/al-hareer/home/moments', name: 'moment-2.jpg' },
  { file: 'images/your-image-22.jpg', folder: '/al-hareer/home/moments', name: 'moment-3.jpg' },
];

// ── Fetch current DB values ────────────────────────────────────────────────────
const allKeys = [...SINGLE_KEYS.map(k => k.key), 'home_moments_cards'];
const { data: existing, error: fetchErr } = await supabase
  .from('site_settings')
  .select('key, value')
  .in('key', allKeys);

if (fetchErr) { console.error('DB fetch error:', fetchErr.message); process.exit(1); }

const currentValues = Object.fromEntries((existing ?? []).map(r => [r.key, r.value]));

// ── Upload single-key images ───────────────────────────────────────────────────
console.log('\n── Single image keys ─────────────────────────────────────────────');
for (const { key, file, folder, name } of SINGLE_KEYS) {
  if (currentValues[key]) {
    console.log(`  SKIP  ${key}  (already set)`);
    continue;
  }
  process.stdout.write(`  UP    ${key}  →  uploading...`);
  const url = await uploadToImageKit(`${PUBLIC_DIR}/${file}`, name, folder);
  const { error } = await supabase.from('site_settings').update({ value: url }).eq('key', key);
  if (error) { console.error(`\nDB write failed: ${error.message}`); process.exit(1); }
  process.stdout.write(`\r  DONE  ${key}  →  ${url}\n`);
}

// ── Upload moments card images ─────────────────────────────────────────────────
console.log('\n── Moments cards ─────────────────────────────────────────────────');
const currentCards = (() => {
  try { return JSON.parse(currentValues['home_moments_cards'] || '[]'); } catch { return []; }
})();

let momentsChanged = false;
for (let i = 0; i < MOMENT_IMAGES.length; i++) {
  const card = currentCards[i] ?? {};
  if (card.image) {
    console.log(`  SKIP  moments card ${i + 1}  (already has image)`);
    continue;
  }
  const { file, folder, name } = MOMENT_IMAGES[i];
  process.stdout.write(`  UP    moments card ${i + 1}  →  uploading...`);
  const url = await uploadToImageKit(`${PUBLIC_DIR}/${file}`, name, folder);
  currentCards[i] = { ...card, image: url };
  momentsChanged = true;
  process.stdout.write(`\r  DONE  moments card ${i + 1}  →  ${url}\n`);
}

if (momentsChanged) {
  const { error } = await supabase
    .from('site_settings')
    .update({ value: JSON.stringify(currentCards) })
    .eq('key', 'home_moments_cards');
  if (error) { console.error('DB write failed for moments_cards:', error.message); process.exit(1); }
}

console.log('\n✓ All done.\n');
