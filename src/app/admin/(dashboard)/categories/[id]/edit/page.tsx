import { notFound } from 'next/navigation';
import { getCategoryById, getTopLevelCategories } from '@/actions/admin/categories';
import CategoryForm from '../../_components/CategoryForm';

export const metadata = { title: 'Edit Category — Al Hareer' };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, parentOptions] = await Promise.all([getCategoryById(id), getTopLevelCategories()]);
  if (!category) notFound();

  return (
    <div className="pb-12 w-full max-w-full">
      <CategoryForm category={category} parentOptions={parentOptions} />
    </div>
  );
}
