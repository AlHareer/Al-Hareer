'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type SubmitInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export type ContactActionResult = { success: boolean; error?: string };

export async function submitInquiry(input: SubmitInquiryInput): Promise<ContactActionResult> {
  if (!input.name.trim() || !input.email.trim() || !input.message.trim()) {
    return { success: false, error: 'Name, email, and message are required.' };
  }

  const supabase = createAdminClient();
  const message = input.subject?.trim() ? `[${input.subject.trim()}] ${input.message.trim()}` : input.message.trim();

  const { error } = await supabase.from('inquiries').insert({
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    message,
  });
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/inquiries');
  return { success: true };
}

export async function subscribeNewsletter(email: string): Promise<ContactActionResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { success: false, error: 'Email is required.' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('newsletter_subscribers').insert({ email: trimmed });
  if (error) {
    if (error.code === '23505') return { success: true }; // already subscribed — treat as success
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/newsletter');
  return { success: true };
}
