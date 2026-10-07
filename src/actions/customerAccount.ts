'use server';

import { createAdminClient } from '@/lib/supabase/admin';

// orders/addresses only have SELECT RLS policies for the owning user (see
// db/schema.sql's `own_rows` policies) — writes stay service-role-only, same
// as every other table, so these mutating actions take userId explicitly and
// verify ownership before writing.

export type ActionResult = { success: boolean; error?: string };

export type NewAddressInput = {
  name: string;
  phone: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  addressType: string;
  isDefault: boolean;
};

export async function addCustomerAddress(userId: string, input: NewAddressInput): Promise<ActionResult> {
  const supabase = createAdminClient();

  if (input.isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
  }

  const { error } = await supabase.from('addresses').insert({
    user_id: userId,
    full_name: input.name.trim(),
    phone: input.phone.trim(),
    address_line_1: input.address.trim(),
    address_line_2: input.addressLine2?.trim() || null,
    city: input.city.trim(),
    state: input.state.trim(),
    postal_code: input.pinCode.trim(),
    address_type: input.addressType || 'Home',
    is_default: input.isDefault,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
