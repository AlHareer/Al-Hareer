'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// NOTE: `testimonials` is already consumed by the live storefront (homepage
// + about page, via `getTestimonials()` in `src/lib/siteSettings.ts`), so
// every mutation here revalidates both '/' and '/about' in addition to the
// admin list page.

export async function getAllTestimonialsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('testimonials').select('*').order('display_order', { ascending: true });
  return data || [];
}

export async function getTestimonialById(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from('testimonials').select('*').eq('id', id).maybeSingle();
  return data;
}

export type TestimonialFormState = { error?: string };

export async function createTestimonial(_prevState: TestimonialFormState, formData: FormData): Promise<TestimonialFormState> {
  const supabase = createAdminClient();
  const customer_name = (formData.get('customer_name') as string) || '';
  const review_text = (formData.get('review_text') as string) || '';
  if (!customer_name || !review_text) return { error: 'Customer name and review text are required.' };

  const { data: existing } = await supabase
    .from('testimonials')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1);
  const nextOrder = existing?.[0] ? existing[0].display_order + 1 : 0;

  const { error } = await supabase.from('testimonials').insert({
    customer_name,
    role: (formData.get('role') as string) || null,
    location: (formData.get('location') as string) || null,
    review_text,
    rating: Number(formData.get('rating') || 5),
    image_url: (formData.get('image_url') as string) || null,
    display_order: nextOrder,
    is_active: formData.get('is_active') === 'on',
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  revalidatePath('/about');
  redirect('/admin/testimonials');
}

export async function updateTestimonial(_prevState: TestimonialFormState, formData: FormData): Promise<TestimonialFormState> {
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  const customer_name = (formData.get('customer_name') as string) || '';
  const review_text = (formData.get('review_text') as string) || '';
  if (!id) return { error: 'Missing testimonial id.' };
  if (!customer_name || !review_text) return { error: 'Customer name and review text are required.' };

  const { error } = await supabase
    .from('testimonials')
    .update({
      customer_name,
      role: (formData.get('role') as string) || null,
      location: (formData.get('location') as string) || null,
      review_text,
      rating: Number(formData.get('rating') || 5),
      image_url: (formData.get('image_url') as string) || null,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  revalidatePath('/about');
  redirect('/admin/testimonials');
}

export async function toggleTestimonialActive(id: string, isActive: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('testimonials').update({ is_active: isActive }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  revalidatePath('/about');
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  revalidatePath('/about');
  return { success: true };
}

export async function reorderTestimonials(orderedIds: string[]) {
  const supabase = createAdminClient();
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from('testimonials').update({ display_order: index }).eq('id', id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: failed.error.message };
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  revalidatePath('/about');
  return { success: true };
}
