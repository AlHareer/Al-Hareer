'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getNewsletterSubscribers() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export type NewsletterActionResult = { success: boolean; error?: string };

export async function deleteNewsletterSubscriber(id: string): Promise<NewsletterActionResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/newsletter');
  return { success: true };
}
