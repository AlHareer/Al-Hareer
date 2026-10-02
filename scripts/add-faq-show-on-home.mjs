/**
 * Adds show_on_home column to faqs table.
 * Run once: node scripts/add-faq-show-on-home.mjs
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

// Add column via raw SQL using rpc (Supabase allows this with service role)
const { error } = await supabase.rpc('exec_sql', {
  sql: `ALTER TABLE faqs ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT false;`
});

if (error) {
  // Try alternative: use the REST API directly
  console.log('rpc not available, trying direct insert to check column...');

  // Check if column already exists by trying a select
  const { error: selectErr } = await supabase
    .from('faqs')
    .select('show_on_home')
    .limit(1);

  if (!selectErr) {
    console.log('✓ Column show_on_home already exists.');
    process.exit(0);
  }

  console.error('Could not add column automatically.');
  console.error('Please run this SQL in Supabase SQL Editor:');
  console.error('ALTER TABLE faqs ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT false;');
  process.exit(1);
} else {
  console.log('✓ Column show_on_home added to faqs table.');
}
