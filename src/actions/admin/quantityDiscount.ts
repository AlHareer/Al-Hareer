'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type QuantityDiscountTier = { min_quantity: number; discount: number };
export type QuantityDiscountSettings = { enabled: boolean; tiers: QuantityDiscountTier[] };

const QUANTITY_DISCOUNT_DEFAULTS: QuantityDiscountSettings = {
  enabled: false,
  tiers: [],
};

export async function getQuantityDiscountSettings(): Promise<QuantityDiscountSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('settings').select('quantity_discount').eq('id', 1).maybeSingle();
  return (data?.quantity_discount as QuantityDiscountSettings) || QUANTITY_DISCOUNT_DEFAULTS;
}

export type QuantityDiscountFormState = { error?: string; success?: boolean };

export async function updateQuantityDiscountSettings(
  _prevState: QuantityDiscountFormState,
  formData: FormData
): Promise<QuantityDiscountFormState> {
  const enabled = formData.get('enabled') === 'on';

  let rawTiers: unknown;
  try {
    rawTiers = JSON.parse((formData.get('tiers') as string | null) || '[]');
  } catch {
    return { error: 'Invalid tier data.' };
  }
  if (!Array.isArray(rawTiers)) return { error: 'Invalid tier data.' };

  const tiers: QuantityDiscountTier[] = rawTiers
    .map((t) => {
      const row = t as { min_quantity?: unknown; discount?: unknown };
      return {
        min_quantity: Number(row?.min_quantity),
        discount: Number(row?.discount),
      };
    })
    .filter((t) => Number.isFinite(t.min_quantity) && t.min_quantity > 0 && Number.isFinite(t.discount) && t.discount >= 0);

  if (tiers.length === 0) return { error: 'Add at least one valid tier.' };

  const quantity_discount: QuantityDiscountSettings = { enabled, tiers };

  const supabase = createAdminClient();
  const { error } = await supabase.from('settings').update({ quantity_discount }).eq('id', 1);
  if (error) return { error: error.message };

  revalidatePath('/admin/settings/quantity-discount');
  revalidatePath('/checkout');
  return { success: true };
}
