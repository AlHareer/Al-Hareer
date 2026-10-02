import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import { getApprovedReviews } from '@/lib/reviews';
import ProductDetailClient from './ProductDetailClient';

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) notFound();

  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product, 4),
    getApprovedReviews(id),
  ]);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} reviews={reviews} />;
}
