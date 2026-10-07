import { getFeaturedProducts } from '@/lib/products';
import { getWishlistContentSettings } from '@/lib/siteSettings';
import WishlistPageClient from './WishlistPageClient';

export default async function WishlistPage() {
  const [recommendedProducts, heroSettings] = await Promise.all([
    getFeaturedProducts(),
    getWishlistContentSettings(),
  ]);
  return <WishlistPageClient recommendedProducts={recommendedProducts} heroSettings={heroSettings} />;
}
