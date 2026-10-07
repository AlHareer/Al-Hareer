import Link from 'next/link';
import { Clock, Truck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import type { DashboardStats } from '@/actions/admin/dashboard';

interface DashboardOrderStatusProps {
  stats: DashboardStats;
}

export default function DashboardOrderStatus({ stats }: DashboardOrderStatusProps) {
  const total = stats.totalOrders || 1;

  const items = [
    {
      label: 'Processing',
      count: stats.processingOrders,
      percentage: Math.round((stats.processingOrders / total) * 100),
      color: 'bg-[#CFAC64]',
      textColor: 'text-[#B08F4F]',
      bgColor: 'bg-[#F6F1EC]',
      borderColor: 'border-[#CFAC64]',
      icon: Clock,
    },
    {
      label: 'Shipped',
      count: stats.shippedOrders,
      percentage: Math.round((stats.shippedOrders / total) * 100),
      color: 'bg-[#024F5F]',
      textColor: 'text-[#024F5F]',
      bgColor: 'bg-[#F6F1EC]',
      borderColor: 'border-[#CFAC64]',
      icon: Truck,
    },
    {
      label: 'Delivered',
      count: stats.deliveredOrders,
      percentage: Math.round((stats.deliveredOrders / total) * 100),
      color: 'bg-[#024F5F]',
      textColor: 'text-[#024F5F]',
      bgColor: 'bg-[#F6F1EC]',
      borderColor: 'border-[#CFAC64]',
      icon: CheckCircle2,
    },
    {
      label: 'Cancelled',
      count: stats.cancelledOrders,
      percentage: Math.round((stats.cancelledOrders / total) * 100),
      color: 'bg-[#024F5F]',
      textColor: 'text-[#024F5F]',
      bgColor: 'bg-[#F6F1EC]',
      borderColor: 'border-[#CFAC64]',
      icon: XCircle,
    },
  ];

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div>
          <h2 className="font-heading text-base font-bold text-brand-700">Order Status</h2>
          <p className="text-xs text-muted mt-0.5">Breakdown of orders by status.</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 shrink-0"
        >
          <span>All Orders</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mt-3.5">
        <div className="flex h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-cream-200 p-0.5">
          {items.map((item) =>
            item.count > 0 ? (
              <div
                key={item.label}
                className={`${item.color} h-full first:rounded-l-full last:rounded-r-full transition-all duration-500`}
                style={{ width: `${Math.max(item.percentage, 4)}%` }}
                title={`${item.label}: ${item.count} (${item.percentage}%)`}
              />
            ) : null
          )}
        </div>
      </div>

      {/* Status Breakdown Legend & Counts */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 sm:gap-2.5">
        {items.map((item) => (
          <Link
            key={item.label}
            href="/admin/orders"
            className={`flex items-center justify-between rounded-xl border p-2 sm:p-2.5 transition-all hover:shadow-2xs ${item.borderColor} ${item.bgColor} min-w-0`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <item.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${item.textColor} shrink-0`} />
              <span className="text-[11px] sm:text-xs font-semibold text-brand-700 truncate">{item.label}</span>
            </div>
            <div className="text-right shrink-0 ml-1">
              <span className="font-heading text-xs sm:text-sm font-bold text-brand-700 block leading-tight">{item.count}</span>
              <span className="text-[9px] sm:text-[10px] text-muted block">({item.percentage}%)</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
