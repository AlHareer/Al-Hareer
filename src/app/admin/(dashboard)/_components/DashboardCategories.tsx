import Link from 'next/link';
import { FolderTree, ArrowRight } from 'lucide-react';
import type { CategoryStat } from '@/actions/admin/dashboard';

interface DashboardCategoriesProps {
  categories: CategoryStat[];
  totalProducts: number;
}

export default function DashboardCategories({ categories, totalProducts }: DashboardCategoriesProps) {
  const safeTotal = totalProducts || 1;

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cream-100 text-brand-700 shrink-0">
            <FolderTree className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-brand-700">Product Categories</h2>
            <p className="text-xs text-muted mt-0.5">Number of products in each category.</p>
          </div>
        </div>

        <Link
          href="/admin/categories"
          className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 shrink-0"
        >
          <span>All Categories</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {categories.map((cat) => {
          const percentage = Math.round((cat.count / safeTotal) * 100);
          return (
            <Link
              key={cat.name}
              href="/admin/categories"
              className="group rounded-xl border border-cream-200 bg-cream-50/50 p-2.5 sm:p-3.5 transition-all hover:border-brand-400 hover:bg-white hover:shadow-2xs min-w-0"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-heading text-xs font-bold text-brand-700 group-hover:text-brand-500 transition-colors truncate">
                  {cat.name}
                </span>
                <span className="text-xs font-bold text-brand-700 shrink-0">{cat.count}</span>
              </div>

              <div className="mt-2 sm:mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                <div
                  className="h-full rounded-full bg-brand-500 group-hover:bg-gold transition-all duration-300"
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                />
              </div>

              <p className="text-[10px] text-muted mt-1 truncate">{percentage}% of total</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
