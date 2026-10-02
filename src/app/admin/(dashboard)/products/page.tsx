import Link from 'next/link';
import { Plus, Package, CheckCircle2, PackageX, AlertTriangle } from 'lucide-react';
import { getAllProductsAdmin } from '@/actions/admin/products';
import ProductList from './_components/ProductList';

export const metadata = { title: 'Products — Al Hareer' };

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  const activeCount = products.filter((p) => p.is_active).length;
  const outOfStockCount = products.filter((p) => p.outOfStock).length;
  const lowStockCount = products.filter((p) => p.lowStock).length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-brand-500 bg-brand-500/10' },
    { label: 'Active', value: activeCount, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    { label: 'Low Stock', value: lowStockCount, icon: AlertTriangle, color: 'text-amber-700 bg-amber-50' },
    { label: 'Out of Stock', value: outOfStockCount, icon: PackageX, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4 sm:pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700">Products</h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Manage your store&apos;s products, pricing, and stock.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-luxury transition-all hover:shadow-luxury-hover shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Product</span>
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

      {/* Products List with Search, Filters, and Mobile Card Mode */}
      <ProductList products={products} />
    </div>
  );
}
