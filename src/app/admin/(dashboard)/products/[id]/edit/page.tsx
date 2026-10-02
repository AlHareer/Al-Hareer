import { notFound } from 'next/navigation';
import { getProductByIdAdmin } from '@/actions/admin/products';
import { getAllCategoriesAdmin } from '@/actions/admin/categories';
import ProductForm from '../../_components/ProductForm';

export const metadata = { title: 'Edit Product — Al Hareer' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductByIdAdmin(id), getAllCategoriesAdmin()]);
  if (!product) notFound();

  return (
    <div className="pb-12 w-full max-w-full">
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
