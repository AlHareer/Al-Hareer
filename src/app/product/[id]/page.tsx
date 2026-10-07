import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import { getApprovedReviews } from '@/lib/reviews';
import { getHomeContentSettings } from '@/lib/siteSettings';
import ProductDetailClient from './ProductDetailClient';

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) notFound();

  const [relatedProducts, reviews, siteSettings] = await Promise.all([
    getRelatedProducts(product, 4),
    getApprovedReviews(id),
    getHomeContentSettings(),
  ]);

  return <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
      shippingPolicy={siteSettings.product_shipping_returns ?? ''}
    />;
}
