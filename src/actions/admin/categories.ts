'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getAllCategoriesAdmin() {
  const supabase = createAdminClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('products').select('category_id'),
  ]);

  const directCounts: Record<string, number> = {};
  for (const p of products || []) {
    if (p.category_id) directCounts[p.category_id] = (directCounts[p.category_id] || 0) + 1;
  }

  // For parent categories, add up all children's counts too
  const allCats = categories || [];
  return allCats.map((c) => {
    let count = directCounts[c.id] || 0;
    if (!c.parent_id) {
      // parent — sum children
      const childIds = allCats.filter((ch) => ch.parent_id === c.id).map((ch) => ch.id);
      for (const cid of childIds) count += directCounts[cid] || 0;
    }
    return { ...c, product_count: count };
  });
}

// Only top-level (parent) categories — used for the "Parent Category" dropdown in the form
export async function getTopLevelCategories() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('categories')
    .select('id, name')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getCategoryById(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();
  return data;
}

export type CategoryFormState = { error?: string };

export async function createCategory(_prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const supabase = createAdminClient();
  const name = formData.get('name') as string;
  if (!name) return { error: 'Name is required.' };

  const parentId = (formData.get('parent_id') as string) || null;
  const { error } = await supabase.from('categories').insert({
    name,
    slug: slugify(name),
    description: (formData.get('description') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    sort_order: Number(formData.get('sort_order') || 0),
    is_active: formData.get('is_active') === 'on',
    show_on_homepage: formData.get('show_on_homepage') === 'on',
    parent_id: parentId,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/', 'layout');
  redirect('/admin/categories');
}

export async function updateCategory(_prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const supabase = createAdminClient();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  if (!id || !name) return { error: 'Name is required.' };

  const parentId = (formData.get('parent_id') as string) || null;
  const { error } = await supabase
    .from('categories')
    .update({
      name,
      description: (formData.get('description') as string) || null,
      image_url: (formData.get('image_url') as string) || null,
      sort_order: Number(formData.get('sort_order') || 0),
      is_active: formData.get('is_active') === 'on',
      show_on_homepage: formData.get('show_on_homepage') === 'on',
      parent_id: parentId,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/', 'layout');
  redirect('/admin/categories');
}

export async function toggleCategoryStatus(id: string, currentStatus: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('categories')
    .update({ is_active: !currentStatus })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/', 'layout');
  return { success: true };
}
