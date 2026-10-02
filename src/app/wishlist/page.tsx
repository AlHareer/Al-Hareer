import { getFeaturedProducts } from '@/lib/products';
import WishlistPageClient from './WishlistPageClient';

export default async function WishlistPage() {
  const recommendedProducts = await getFeaturedProducts(4);
  return <WishlistPageClient recommendedProducts={recommendedProducts} />;
}
