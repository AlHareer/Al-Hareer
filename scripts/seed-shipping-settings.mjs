/**
 * Seeds default shipping settings into the `settings` table (id=1).
 * Safe to re-run — only updates if the current shipping.free_threshold is 0 or null.
 * Run with: node scripts/seed-shipping-settings.mjs
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

const { data, error: fetchErr } = await supabase
  .from('settings')
  .select('id, shipping')
  .eq('id', 1)
  .maybeSingle();

if (fetchErr) { console.error('Fetch error:', fetchErr.message); process.exit(1); }

const current = data?.shipping ?? {};
console.log('Current shipping settings:', current);

if (current.free_threshold && current.free_threshold > 0) {
  console.log('✓ Already configured — no changes made.');
  process.exit(0);
}

const shipping = {
  flat_rate:       current.flat_rate       ?? 0,
  free_threshold:  999,
  cod_charge:      current.cod_charge      ?? 49,
};

if (!data) {
  // No row yet — insert
  const { error } = await supabase.from('settings').insert({ id: 1, shipping });
  if (error) { console.error('Insert error:', error.message); process.exit(1); }
} else {
  const { error } = await supabase.from('settings').update({ shipping }).eq('id', 1);
  if (error) { console.error('Update error:', error.message); process.exit(1); }
}

console.log('✓ Shipping settings saved:', shipping);
