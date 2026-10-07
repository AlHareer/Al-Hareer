'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

// Brand/Contact/Social/Checkout settings for the admin "Site Settings" page.
// Scoped to a small, curated key list — the Home/About CMS content module
// (a separate agent's scope) owns its own keys in this same `site_settings`
// table under the 'home'/'about' categories, which this file never reads or
// writes.
export type BrandSettingItem = {
  value: string;
  category: 'brand' | 'contact' | 'social' | 'checkout';
  description: string;
};

export type BrandSettings = Record<string, BrandSettingItem>;

// `contact_email` and `contact_phone` already exist in the DB from the
// initial seed (read via src/lib/siteSettings.ts's getSiteSetting()) — this
// module edits those SAME keys rather than creating duplicates.
const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  brand_name: { value: 'Al Hareer', category: 'brand', description: 'Brand name shown across the site' },
  tagline: { value: '', category: 'brand', description: 'Short brand tagline' },
  contact_email: { value: '', category: 'contact', description: 'Business contact email' },
  contact_phone: { value: '', category: 'contact', description: 'Business contact phone' },
  whatsapp_number: { value: '', category: 'contact', description: 'WhatsApp number (with country code, no spaces)' },
  instagram_url: { value: '', category: 'social', description: 'Instagram profile URL' },
  facebook_url: { value: '', category: 'social', description: 'Facebook profile URL' },
  youtube_url: { value: '', category: 'social', description: 'YouTube channel URL' },
  cod_enabled: {
    value: 'true',
    category: 'checkout',
    description: 'Allow Cash on Delivery at checkout',
  },
  razorpay_enabled: {
    value: 'true',
    category: 'checkout',
    description: 'Allow online payment via Razorpay (UPI/Card/Net Banking) at checkout',
  },
};

const BRAND_SETTINGS_KEYS = Object.keys(DEFAULT_BRAND_SETTINGS);

export async function getBrandSettings(): Promise<BrandSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, category, description')
    .in('key', BRAND_SETTINGS_KEYS);

  const settings: BrandSettings = {};
  for (const key of BRAND_SETTINGS_KEYS) {
    settings[key] = { ...DEFAULT_BRAND_SETTINGS[key] };
  }

  if (!error) {
    for (const row of data || []) {
      if (row.key in settings) {
        settings[row.key] = {
          value: row.value ?? '',
          category: settings[row.key].category,
          description: settings[row.key].description,
        };
      }
    }
  }

  return settings;
}

export type UpdateBrandSettingResult = { success: boolean; error?: string };

export async function updateBrandSetting(key: string, value: string): Promise<UpdateBrandSettingResult> {
  const meta = DEFAULT_BRAND_SETTINGS[key];
  if (!meta) return { success: false, error: 'Unknown setting key.' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('site_settings').upsert(
    {
      key,
      value: value ?? '',
      category: meta.category,
      description: meta.description,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  );

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/settings');
  return { success: true };
}
