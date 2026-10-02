'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// NOTE: `faqs` is already consumed by the live storefront (the FAQ page, via
// `getFaqs()` in `src/lib/siteSettings.ts`), so every mutation here
// revalidates both '/faq' and the admin list page.

export async function getFaqCategories(): Promise<string[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('faqs').select('category').order('category', { ascending: true });
  if (!data) return [];
  return [...new Set(data.map((r) => r.category).filter(Boolean))];
}

export async function getAllFaqsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });
  return data || [];
}

export async function getFaqById(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from('faqs').select('*').eq('id', id).maybeSingle();
  return data;
}

export type FaqFormState = { error?: string };

export async function createFaq(_prevState: FaqFormState, formData: FormData): Promise<FaqFormState> {
  const supabase = createAdminClient();
  const category = (formData.get('category') as string) || '';
  const question = (formData.get('question') as string) || '';
  const answer = (formData.get('answer') as string) || '';
  if (!category || !question || !answer) return { error: 'Category, question and answer are required.' };

  const { data: existing } = await supabase
    .from('faqs')
    .select('display_order')
    .eq('category', category)
    .order('display_order', { ascending: false })
    .limit(1);
  const nextOrder = existing?.[0] ? existing[0].display_order + 1 : 0;

  const { error } = await supabase.from('faqs').insert({
    category,
    question,
    answer,
    display_order: nextOrder,
    is_active: formData.get('is_active') === 'on',
    show_on_home: formData.get('show_on_home') === 'on',
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
  redirect('/admin/faqs');
}

export async function updateFaq(_prevState: FaqFormState, formData: FormData): Promise<FaqFormState> {
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  const category = (formData.get('category') as string) || '';
  const question = (formData.get('question') as string) || '';
  const answer = (formData.get('answer') as string) || '';
  if (!id) return { error: 'Missing FAQ id.' };
  if (!category || !question || !answer) return { error: 'Category, question and answer are required.' };

  const { error } = await supabase
    .from('faqs')
    .update({
      category,
      question,
      answer,
      is_active: formData.get('is_active') === 'on',
      show_on_home: formData.get('show_on_home') === 'on',
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
  redirect('/admin/faqs');
}

export async function toggleFaqShowOnHome(id: string, showOnHome: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('faqs').update({ show_on_home: showOnHome }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/faqs');
  revalidatePath('/');
  return { success: true };
}

export async function toggleFaqActive(id: string, isActive: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('faqs').update({ is_active: isActive }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
  return { success: true };
}

export async function deleteFaq(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
  return { success: true };
}

export async function reorderFaqs(orderedIds: string[]) {
  const supabase = createAdminClient();
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from('faqs').update({ display_order: index }).eq('id', id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: failed.error.message };
  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
  return { success: true };
}
