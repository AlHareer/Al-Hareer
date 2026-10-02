'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export type CreateAccountResult = { success: boolean; error?: string };

// Creates a real Supabase Auth user with email_confirm:true so there's no
// confirmation-link step for now (a transactional email provider — Brevo —
// can be wired in later to send a real verification email; until then this
// skips it entirely rather than leaving signup broken). Also creates the
// matching `profiles` row, with id = the auth user's id (required for the
// `own_rows` RLS policies on orders/addresses/profiles to work).
export async function createCustomerAccount(
  fullName: string,
  phone: string,
  email: string,
  password: string
): Promise<CreateAccountResult> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!fullName.trim() || !trimmedEmail || !password) {
    return { success: false, error: 'Please fill in all required fields.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const supabase = createAdminClient();

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: trimmedEmail,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName.trim(), phone: phone.trim() },
  });

  if (createError) {
    if (createError.message.toLowerCase().includes('already been registered')) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    return { success: false, error: createError.message };
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: created.user.id,
    full_name: fullName.trim(),
    email: trimmedEmail,
    phone: phone.trim(),
    role: 'customer',
  });
  if (profileError) {
    console.error('Failed to create profile row for new user:', profileError.message);
  }

  return { success: true };
}

// profiles only has a public "own row" SELECT RLS policy (see db/schema.sql) —
// writes stay service-role-only, same as every other table.
export async function updateCustomerProfile(
  userId: string,
  fullName: string,
  phone: string
): Promise<CreateAccountResult> {
  const supabase = createAdminClient();
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: authUser.user?.email,
      role: 'customer',
    },
    { onConflict: 'id' }
  );
  if (error) return { success: false, error: error.message };
  return { success: true };
}
