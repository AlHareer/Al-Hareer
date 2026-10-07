import Link from 'next/link';
import { Plus, FolderTree, CheckCircle2, EyeOff, Package, AlertTriangle } from 'lucide-react';
import { getAllCategoriesAdmin } from '@/actions/admin/categories';
import CategoryList from './_components/CategoryList';

export const metadata = { title: 'Categories — Al Hareer' };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  const activeCount = categories.filter((c) => c.is_active).length;
  const parentIds = new Set(categories.filter((c) => c.parent_id).map((c) => c.parent_id));
  const totalProducts = categories
    .filter((c) => !parentIds.has(c.id))
    .reduce((sum, c) => sum + (c.product_count || 0), 0);
  const emptyCount = categories.filter((c) => !parentIds.has(c.id) && c.product_count === 0).length;

  const stats = [
    { label: 'Total Categories', value: categories.length, icon: FolderTree, color: 'text-brand-500 bg-brand-500/10' },
    { label: 'Active', value: activeCount, icon: CheckCircle2, color: 'text-[#024F5F] bg-[#F6F1EC]' },
    { label: 'Total Products', value: totalProducts, icon: Package, color: 'text-gold-dark bg-gold-light/40' },
    {
      label: 'Empty Categories',
      value: emptyCount,
      icon: emptyCount > 0 ? AlertTriangle : CheckCircle2,
      color: emptyCount > 0 ? 'text-[#B08F4F] bg-[#F6F1EC]' : 'text-muted bg-cream-100',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4 sm:pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700">Categories</h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Manage your store&apos;s product collections and categories.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#CFAC64] hover:bg-[#B08F4F] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-luxury transition-all hover:shadow-luxury-hover shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-cream-300 bg-white p-3.5 sm:p-4 shadow-2xs min-w-0"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted">
                {s.label}
              </p>
              <p className="font-heading text-lg sm:text-xl font-bold text-brand-700 mt-0.5 truncate">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Category List with Search, Filters, Grid/Table view */}
      <CategoryList categories={categories} />
    </div>
  );
}
