import { createPublicClient } from '@/lib/supabase/public';

export type ProductReview = {
  id: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months <= 1) return '1 month ago';
  return `${months} months ago`;
}

export async function getApprovedReviews(productSlug: string): Promise<ProductReview[]> {
  const supabase = createPublicClient();
  const { data: product } = await supabase.from('products').select('id').eq('slug', productSlug).maybeSingle();
  if (!product) return [];

  const { data, error } = await supabase
    .from('reviews')
    .select('id, reviewer_name, rating, review_text, created_at')
    .eq('product_id', product.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id,
    reviewerName: r.reviewer_name || 'Verified Buyer',
    rating: r.rating,
    reviewText: r.review_text || '',
    createdAt: timeAgo(r.created_at),
  }));
}
