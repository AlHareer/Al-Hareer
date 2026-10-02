'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getAllInquiries() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
  return data || [];
}

export type InquiryActionResult = { success: boolean; error?: string };

export async function resolveInquiry(id: string, isResolved: boolean): Promise<InquiryActionResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('inquiries').update({ is_resolved: isResolved }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/inquiries');
  return { success: true };
}

export async function deleteInquiry(id: string): Promise<InquiryActionResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/inquiries');
  return { success: true };
}
