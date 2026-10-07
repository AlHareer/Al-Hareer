import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { LowStockVariant } from '@/actions/admin/dashboard';

interface DashboardLowStockProps {
  lowStockItems: LowStockVariant[];
  totalCount: number;
}

export default function DashboardLowStock({ lowStockItems, totalCount }: DashboardLowStockProps) {
  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64] shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-brand-700">Low Stock Alerts</h2>
            <p className="text-xs text-muted mt-0.5">Products with 5 or less units left.</p>
          </div>
        </div>

        {totalCount > 0 && (
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      <div className="mt-3.5">
        {lowStockItems.length === 0 ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F1EC] text-[#024F5F] mb-1.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-brand-700">All products in stock</p>
            <p className="text-[11px] text-muted mt-0.5">No products are currently low on stock.</p>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {lowStockItems.map((item) => {
              const isCriticallyLow = item.stock_quantity <= 2;
              return (
                <div key={item.id} className="py-2.5 sm:py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={item.product_id ? `/admin/products/${item.product_id}` : '/admin/products'}
                      className="text-xs font-bold text-brand-700 hover:text-brand-500 truncate block transition-colors"
                    >
                      {item.product_name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5 text-[10px] sm:text-[11px] text-muted">
                      <span>{item.variant_name}</span>
                      {item.color && (
                        <>
                          <span>•</span>
                          <span>{item.color}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold border ${
                        isCriticallyLow
                          ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64] animate-pulse'
                          : 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]'
                      }`}
                    >
                      {item.stock_quantity === 0 ? 'Out of stock' : `${item.stock_quantity} left`}
                    </span>

                    <Link
                      href={item.product_id ? `/admin/products/${item.product_id}` : '/admin/products'}
                      className="rounded-lg p-1 text-muted hover:bg-cream-100 hover:text-brand-600 transition-colors"
                      title="Update Stock"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
