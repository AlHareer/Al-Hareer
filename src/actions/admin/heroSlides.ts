'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getAllHeroSlidesAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('hero_slides').select('*').order('display_order', { ascending: true });
  return data || [];
}

export async function getHeroSlideById(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from('hero_slides').select('*').eq('id', id).maybeSingle();
  return data;
}

export type HeroSlideFormState = { error?: string };

export async function createHeroSlide(_prevState: HeroSlideFormState, formData: FormData): Promise<HeroSlideFormState> {
  const supabase = createAdminClient();
  const image_url = (formData.get('image_url') as string) || '';
  if (!image_url) return { error: 'An image is required.' };

  const { data: existing } = await supabase
    .from('hero_slides')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1);
  const nextOrder = existing?.[0] ? existing[0].display_order + 1 : 0;

  const { error } = await supabase.from('hero_slides').insert({
    image_url,
    tag: (formData.get('tag') as string) || null,
    title: (formData.get('title') as string) || null,
    subtitle: (formData.get('subtitle') as string) || null,
    button_text: (formData.get('button_text') as string) || null,
    button_link: (formData.get('button_link') as string) || null,
    display_order: nextOrder,
    is_active: formData.get('is_active') === 'on',
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/hero-slides');
  revalidatePath('/');
  redirect('/admin/hero-slides');
}

export async function updateHeroSlide(_prevState: HeroSlideFormState, formData: FormData): Promise<HeroSlideFormState> {
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  const image_url = (formData.get('image_url') as string) || '';
  if (!id) return { error: 'Missing slide id.' };
  if (!image_url) return { error: 'An image is required.' };

  const { error } = await supabase
    .from('hero_slides')
    .update({
      image_url,
      tag: (formData.get('tag') as string) || null,
      title: (formData.get('title') as string) || null,
      subtitle: (formData.get('subtitle') as string) || null,
      button_text: (formData.get('button_text') as string) || null,
      button_link: (formData.get('button_link') as string) || null,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/hero-slides');
  revalidatePath('/');
  redirect('/admin/hero-slides');
}

export async function toggleHeroSlideActive(id: string, isActive: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('hero_slides').update({ is_active: isActive }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/hero-slides');
  revalidatePath('/');
  return { success: true };
}

export async function deleteHeroSlide(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/hero-slides');
  revalidatePath('/');
  return { success: true };
}

/**
 * Persists a full reordering of hero slides — `orderedIds` is the complete
 * list of slide ids in their new display order (index becomes the new
 * `display_order`). Used by the up/down reorder buttons in the admin list.
 */
export async function reorderHeroSlides(orderedIds: string[]) {
  const supabase = createAdminClient();
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from('hero_slides').update({ display_order: index }).eq('id', id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: failed.error.message };
  revalidatePath('/admin/hero-slides');
  revalidatePath('/');
  return { success: true };
}
