'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ReviewAdminRow = {
  id: string;
  rating: number;
  review_text: string | null;
  reviewer_name: string | null;
  is_approved: boolean;
  created_at: string;
  product_id: string;
  products: { name: string } | null;
  profiles: { full_name: string | null; email: string } | null;
};

export async function getAllReviewsAdmin(): Promise<ReviewAdminRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('reviews')
    .select('id, rating, review_text, reviewer_name, is_approved, created_at, product_id, products ( name ), profiles ( full_name, email )')
    .order('created_at', { ascending: false });

  return (data as unknown as ReviewAdminRow[]) || [];
}

// Shared helper: recomputes a product's average_rating and review_count from
// its currently-approved reviews. Called after every approve/delete so the
// product listing/detail pages always reflect only approved feedback.
async function recomputeProductRating(supabase: SupabaseClient, productId: string) {
  const { data: approved } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true);

  const rows = approved || [];
  const count = rows.length;
  const average = count > 0 ? rows.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  await supabase
    .from('products')
    .update({ average_rating: Math.round(average * 10) / 10, review_count: count })
    .eq('id', productId);
}

export type ReviewActionResult = { success: boolean; error?: string };

async function revalidateProductPage(supabase: SupabaseClient, productId: string) {
  const { data: p } = await supabase.from('products').select('slug').eq('id', productId).maybeSingle();
  if (p?.slug) revalidatePath(`/product/${p.slug}`);
}

export async function approveReview(reviewId: string): Promise<ReviewActionResult> {
  const supabase = createAdminClient();
  const { data: review } = await supabase.from('reviews').select('product_id').eq('id', reviewId).maybeSingle();
  if (!review) return { success: false, error: 'Review not found.' };

  const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', reviewId);
  if (error) return { success: false, error: error.message };

  await recomputeProductRating(supabase, review.product_id);
  await revalidateProductPage(supabase, review.product_id);
  revalidatePath('/admin/reviews');
  revalidatePath('/shop');
  return { success: true };
}

export async function deleteReview(reviewId: string): Promise<ReviewActionResult> {
  const supabase = createAdminClient();
  const { data: review } = await supabase
    .from('reviews')
    .select('product_id, is_approved')
    .eq('id', reviewId)
    .maybeSingle();
  if (!review) return { success: false, error: 'Review not found.' };

  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  if (error) return { success: false, error: error.message };

  if (review.is_approved) {
    await recomputeProductRating(supabase, review.product_id);
    await revalidateProductPage(supabase, review.product_id);
    revalidatePath('/shop');
  }
  revalidatePath('/admin/reviews');
  return { success: true };
}
