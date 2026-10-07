import { getAllProducts, getActiveCategories } from '@/lib/products';
import { getShopContentSettings, getHomeContentSettings } from '@/lib/siteSettings';
import ShopPageClient from './ShopPageClient';

export default async function ShopPage() {
  const [products, categories, heroSettings, siteSettings] = await Promise.all([
    getAllProducts(),
    getActiveCategories(),
    getShopContentSettings(),
    getHomeContentSettings(),
  ]);
  return <ShopPageClient
      products={products}
      categories={categories}
      heroSettings={heroSettings}
      hasReturnsPolicy={Boolean(siteSettings.policy_returns?.trim())}
    />;
}
