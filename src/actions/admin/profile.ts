'use server';

import { cookies } from 'next/headers';
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from '@/lib/adminSession';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

// Al Hareer's admin is always the cookie-based bootstrap admin, never a
// Supabase Auth user — so this only ports the custom-admin-session-cookie
// path from SakPack-India's actions/admin/profile.js, skipping the
// Supabase-Auth-user fallback branch entirely.

export type AdminProfile = { full_name: string | null; email: string };

export async function getAdminProfile(): Promise<AdminProfile | null> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(adminToken);
  if (!session) return null;

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('email', session.email)
    .maybeSingle();

  return (profile as AdminProfile) ?? { full_name: 'Admin', email: session.email };
}

export type AdminProfileFormState = { error?: string; success?: boolean };

export async function updateAdminProfile(
  _prevState: AdminProfileFormState,
  formData: FormData
): Promise<AdminProfileFormState> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(adminToken);
  if (!session) return { error: 'Not authenticated.' };

  const fullName = ((formData.get('full_name') as string | null) || '').trim();
  if (!fullName) return { error: 'Full name is required.' };

  const supabase = createAdminClient();

  // This is a fresh install, so there is likely no `profiles` row matching
  // the bootstrap admin's email yet. Look it up first and insert if missing,
  // rather than a plain `.update()`, which would silently affect 0 rows.
  const { data: existing, error: lookupError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', session.email)
    .maybeSingle();

  if (lookupError) return { error: lookupError.message };

  if (existing) {
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('profiles').insert({
      id: crypto.randomUUID(),
      email: session.email,
      full_name: fullName,
      role: 'admin',
      is_active: true,
    });
    if (error) return { error: error.message };
  }

  revalidatePath('/admin/settings/profile');
  return { success: true };
}
