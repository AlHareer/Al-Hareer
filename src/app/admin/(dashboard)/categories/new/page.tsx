import { getTopLevelCategories } from '@/actions/admin/categories';
import CategoryForm from '../_components/CategoryForm';

export const metadata = { title: 'New Category — Al Hareer' };

export default async function NewCategoryPage() {
  const parentOptions = await getTopLevelCategories();
  return (
    <div className="pb-12 w-full max-w-full">
      <CategoryForm parentOptions={parentOptions} />
    </div>
  );
}
