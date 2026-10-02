import ProductForm from '../_components/ProductForm';
import { getAllCategoriesAdmin } from '@/actions/admin/categories';

export const metadata = { title: 'New Product — Al Hareer' };

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="pb-12 w-full max-w-full">
      <ProductForm categories={categories} />
    </div>
  );
}
