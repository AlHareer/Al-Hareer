'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import {
  createAdminSessionToken,
  COOKIE_NAME as ADMIN_COOKIE_NAME,
  MAX_AGE_SECONDS as ADMIN_COOKIE_MAX_AGE,
} from '@/lib/adminSession';

async function setAdminSessionCookie(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, await createAdminSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: '/',
  });
}

export type AdminLoginState = { error?: string };

// Checks straight against ADMIN_EMAIL/ADMIN_PASSWORD and issues a self-signed
// cookie (src/lib/adminSession.ts) — no Supabase Auth involved. Ported from
// SakPack-India's actions/auth.js:adminLogin.
export async function adminLogin(_prevState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const isValid =
    adminEmail &&
    adminPassword &&
    String(email).toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword;

  if (!isValid) {
    return { error: 'Invalid credentials.' };
  }

  await setAdminSessionCookie(String(email));
  revalidatePath('/admin', 'layout');
  redirect('/admin');
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
