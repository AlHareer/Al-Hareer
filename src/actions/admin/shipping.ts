'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type ShippingSettings = {
  flat_rate: number;
  free_threshold: number;
  cod_charge: number;
};

// Local default — used only if the single `settings` row's `shipping` jsonb
// column somehow comes back empty. Not imported from SakPack-India.
const SHIPPING_DEFAULTS: ShippingSettings = {
  flat_rate: 0,
  free_threshold: 0,
  cod_charge: 0,
};

export async function getShippingSettings(): Promise<ShippingSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('settings').select('shipping').eq('id', 1).maybeSingle();
  return (data?.shipping as ShippingSettings) || SHIPPING_DEFAULTS;
}

export type ShippingFormState = { error?: string; success?: boolean };

export async function updateShippingSettings(
  _prevState: ShippingFormState,
  formData: FormData
): Promise<ShippingFormState> {
  const flat_rate = Number(formData.get('flat_rate') || 0);
  const free_threshold = Number(formData.get('free_threshold') || 0);
  const cod_charge = Number(formData.get('cod_charge') || 0);

  if (!Number.isFinite(flat_rate) || flat_rate < 0) return { error: 'Flat rate must be zero or more.' };
  if (!Number.isFinite(free_threshold) || free_threshold < 0) {
    return { error: 'Free shipping threshold must be zero or more.' };
  }
  if (!Number.isFinite(cod_charge) || cod_charge < 0) return { error: 'COD charge must be zero or more.' };

  const shipping: ShippingSettings = { flat_rate, free_threshold, cod_charge };

  const supabase = createAdminClient();
  const { error } = await supabase.from('settings').update({ shipping }).eq('id', 1);
  if (error) return { error: error.message };

  revalidatePath('/admin/settings/shipping');
  revalidatePath('/checkout');
  return { success: true };
}
