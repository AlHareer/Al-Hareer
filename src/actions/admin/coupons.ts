'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type Coupon = {
  id: string;
  code: string;
  type: 'flat' | 'percent';
  value: number;
  min_purchase: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

export async function getAllCoupons(): Promise<Coupon[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  return (data as Coupon[]) || [];
}

export async function getCouponById(id: string): Promise<Coupon | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('coupons').select('*').eq('id', id).maybeSingle();
  return (data as Coupon) ?? null;
}

export type CouponFormState = { error?: string };

type ParsedCoupon = {
  code: string;
  type: 'flat' | 'percent';
  value: number;
  min_purchase: number;
  expires_at: string | null;
  is_active: boolean;
};

function parseCouponForm(formData: FormData): { data: ParsedCoupon } | { error: string } {
  const code = ((formData.get('code') as string | null) || '').trim().toUpperCase();
  const type = formData.get('type') as string | null;
  const value = Number(formData.get('value'));
  const min_purchase = Number(formData.get('min_purchase') || 0);
  const expiresRaw = (formData.get('expires_at') as string | null) || '';
  const is_active = formData.get('is_active') === 'on';

  if (!code) return { error: 'Code is required.' };
  if (type !== 'flat' && type !== 'percent') return { error: 'Type must be flat or percent.' };
  if (!Number.isFinite(value) || value <= 0) return { error: 'Value must be a positive number.' };
  if (!Number.isFinite(min_purchase) || min_purchase < 0) return { error: 'Minimum purchase must be zero or more.' };

  return {
    data: { code, type, value, min_purchase, expires_at: expiresRaw || null, is_active },
  };
}

export async function createCoupon(_prevState: CouponFormState, formData: FormData): Promise<CouponFormState> {
  const parsed = parseCouponForm(formData);
  if ('error' in parsed) return { error: parsed.error };

  const supabase = createAdminClient();
  const { error } = await supabase.from('coupons').insert(parsed.data);

  if (error) {
    return { error: error.message.includes('duplicate') ? 'This coupon code already exists.' : error.message };
  }
  revalidatePath('/admin/settings/coupons');
  redirect('/admin/settings/coupons');
}

export async function updateCoupon(_prevState: CouponFormState, formData: FormData): Promise<CouponFormState> {
  const id = formData.get('id') as string | null;
  if (!id) return { error: 'Missing coupon id.' };

  const parsed = parseCouponForm(formData);
  if ('error' in parsed) return { error: parsed.error };

  const supabase = createAdminClient();
  const { error } = await supabase.from('coupons').update(parsed.data).eq('id', id);

  if (error) {
    return { error: error.message.includes('duplicate') ? 'This coupon code already exists.' : error.message };
  }
  revalidatePath('/admin/settings/coupons');
  redirect('/admin/settings/coupons');
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('coupons').update({ is_active: isActive }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/settings/coupons');
  return { success: true };
}

export async function deleteCoupon(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/settings/coupons');
  return { success: true };
}
