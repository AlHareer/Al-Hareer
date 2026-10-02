'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export type SubmitReviewResult = { success: boolean; error?: string };

export async function submitReview(
  userId: string,
  reviewerName: string,
  productSlug: string,
  rating: number,
  reviewText: string
): Promise<SubmitReviewResult> {
  if (!userId || !productSlug) return { success: false, error: 'Missing required fields.' };
  if (rating < 1 || rating > 5) return { success: false, error: 'Rating must be between 1 and 5.' };
  if (!reviewText.trim()) return { success: false, error: 'Please write something in your review.' };

  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .maybeSingle();

  if (!product) return { success: false, error: 'Product not found.' };

  // Prevent duplicate review from same user for same product
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('product_id', product.id)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) return { success: false, error: 'You have already submitted a review for this product.' };

  const { error } = await supabase.from('reviews').insert({
    product_id: product.id,
    user_id: userId,
    reviewer_name: reviewerName.trim() || 'Verified Buyer',
    rating,
    review_text: reviewText.trim(),
    is_approved: false,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
