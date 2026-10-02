import { getAllProducts, getActiveCategories } from '@/lib/products';
import ShopPageClient from './ShopPageClient';

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getActiveCategories()]);
  return <ShopPageClient products={products} categories={categories} />;
}
