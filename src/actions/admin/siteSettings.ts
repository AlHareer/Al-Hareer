'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { ALL_SETTINGS_DEFAULTS, type SiteSettingMeta, type SiteSettingsDefaults } from '@/lib/siteSettingsSchema';

export type { SiteSettingMeta, SiteSettingsDefaults };

// NOTE: a 'use server' file may only export async functions — components
// that need HOME_SETTINGS_DEFAULTS / ABOUT_SETTINGS_DEFAULTS import them
// directly from '@/lib/siteSettingsSchema' instead of re-exporting here.

/**
 * Shared `site_settings` (key/value CMS store) admin CRUD, used by both the
 * Home Customization page and the About Page Customization page — it's the
 * same table, just filtered to a different curated key list per page (see
 * `src/lib/siteSettingsSchema.ts`).
 *
 * NOTE: this is a separate, admin-facing read/write helper from
 * `src/lib/siteSettings.ts` (the existing storefront-facing read helper for
 * testimonials/occasions) — that file is untouched.
 */

export async function getSiteSettings(): Promise<SiteSettingsDefaults> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value, category, description')
      .order('category', { ascending: true });

    if (error) {
      console.warn('site_settings read error, falling back to defaults:', error.message);
      return { ...ALL_SETTINGS_DEFAULTS };
    }

    const settings: SiteSettingsDefaults = {};
    for (const item of data || []) {
      settings[item.key] = {
        value: item.value ?? '',
        category: (item.category as SiteSettingMeta['category']) ?? 'home',
        description: item.description ?? '',
      };
    }

    // Backfill any curated keys that don't have a DB row yet so they still
    // show up with a sensible default until an admin explicitly saves them.
    for (const [key, meta] of Object.entries(ALL_SETTINGS_DEFAULTS)) {
      if (!settings[key]) settings[key] = meta;
    }

    return settings;
  } catch (err) {
    console.error('Error fetching site settings:', err instanceof Error ? err.message : err);
    return { ...ALL_SETTINGS_DEFAULTS };
  }
}

export type UpdateSettingResult = { success: boolean; error?: string };

export async function updateSiteSetting(key: string, value: string | null | undefined): Promise<UpdateSettingResult> {
  try {
    const supabase = createAdminClient();
    const meta = ALL_SETTINGS_DEFAULTS[key];

    const payload: {
      key: string;
      value: string;
      updated_at: string;
      category?: string;
      description?: string;
    } = {
      key,
      // Never let undefined/null hit the DB's (presumably NOT NULL) value column.
      value: value ?? '',
      updated_at: new Date().toISOString(),
    };
    if (meta) {
      payload.category = meta.category;
      payload.description = meta.description;
    }

    const { error } = await supabase.from('site_settings').upsert(payload, { onConflict: 'key' });
    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/hero-slides');
    revalidatePath('/admin/about');
    revalidatePath('/');
    revalidatePath('/shop');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update setting.' };
  }
}
