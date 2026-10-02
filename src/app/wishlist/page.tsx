import { getFeaturedProducts } from '@/lib/products';
import WishlistPageClient from './WishlistPageClient';

export default async function WishlistPage() {
  const recommendedProducts = await getFeaturedProducts();
  return <WishlistPageClient recommendedProducts={recommendedProducts} />;
}
