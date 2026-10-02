'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, ArrowRight, ShoppingBag, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';
import type { RecentOrder } from '@/actions/admin/dashboard';

interface DashboardRecentOrdersProps {
  orders: RecentOrder[];
}

const STATUS_BADGES: Record<string, { label: string; class: string; icon: any }> = {
  processing: {
    label: 'Processing',
    class: 'bg-amber-50 text-amber-800 border-amber-300/80',
    icon: Clock,
  },
  shipped: {
    label: 'Shipped',
    class: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    class: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    class: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
  },
};

export default function DashboardRecentOrders({ orders }: DashboardRecentOrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(term) ||
      o.customer_name.toLowerCase().includes(term) ||
      o.customer_email.toLowerCase().includes(term) ||
      o.order_status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-6 shadow-2xs">
      {/* Header with Title and Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-cream-200 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-base sm:text-lg font-bold text-brand-700">Recent Orders</h2>
            <span className="rounded-full bg-cream-100 px-2 py-0.5 text-xs font-bold text-brand-600 border border-cream-300">
              {orders.length}
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">Latest orders placed by customers.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick Search Input */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            <input
              type="text"
              placeholder="Search by order # or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full sm:w-56 rounded-xl border border-cream-300 bg-cream-50 pl-8 pr-3 text-xs text-brand-700 placeholder:text-muted focus:border-brand-400 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <Link
            href="/admin/orders"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors whitespace-nowrap shrink-0"
          >
            <span>All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 text-muted">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-700">No orders found</p>
          <p className="text-xs text-muted mt-1">
            {searchTerm ? 'Try adjusting your search query.' : 'New orders will show up here.'}
          </p>
        </div>
      ) : (
        <>
          {/* 1. MOBILE VIEW (Cards) */}
          <div className="sm:hidden mt-3 divide-y divide-cream-100">
            {filteredOrders.map((order) => {
              const badge = STATUS_BADGES[order.order_status] || {
                label: order.order_status,
                class: 'bg-cream-100 text-muted border-cream-300',
                icon: Clock,
              };
              const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });
              const initial = (order.customer_name || 'C').charAt(0).toUpperCase();

              return (
                <div key={order.id} className="py-3.5 first:pt-2 last:pb-1 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-heading text-xs font-bold text-brand-700 hover:text-brand-500 truncate"
                    >
                      {order.order_number}
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border shrink-0 ${badge.class}`}
                    >
                      <badge.icon className="h-2.5 w-2.5" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 text-[11px] font-bold">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-700 truncate max-w-[170px]">
                          {order.customer_name}
                        </p>
                        <p className="text-[10px] text-muted truncate max-w-[170px]">
                          {order.customer_email}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-heading text-xs font-bold text-brand-700">
                        ₹{order.total_amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-muted">{order.item_count} item{order.item_count === 1 ? '' : 's'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted border-t border-cream-100 pt-2">
                    <span>{formattedDate}</span>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. TABLE VIEW (Tablet & Desktop) */}
          <div className="hidden sm:block mt-4 overflow-x-auto">
            <table className="w-full min-w-[580px] text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-200 text-[10px] font-bold uppercase tracking-wider text-muted">
                  <th className="pb-3 pl-2">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredOrders.map((order) => {
                  const badge = STATUS_BADGES[order.order_status] || {
                    label: order.order_status,
                    class: 'bg-cream-100 text-muted border-cream-300',
                    icon: Clock,
                  };
                  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const initial = (order.customer_name || 'C').charAt(0).toUpperCase();

                  return (
                    <tr key={order.id} className="group hover:bg-cream-50/70 transition-colors">
                      <td className="py-3.5 pl-2 pr-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-heading text-xs font-bold text-brand-700 group-hover:text-brand-500 transition-colors"
                        >
                          {order.order_number}
                        </Link>
                        <p className="text-[11px] text-muted">{formattedDate}</p>
                      </td>

                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 text-xs font-bold">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-brand-700 truncate max-w-[140px]">
                              {order.customer_name}
                            </p>
                            <p className="text-[11px] text-muted truncate max-w-[140px]">
                              {order.customer_email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 pr-3 text-xs text-muted">
                        {order.item_count} item{order.item_count === 1 ? '' : 's'}
                      </td>

                      <td className="py-3.5 pr-3">
                        <p className="font-heading text-xs font-bold text-brand-700">
                          ₹{order.total_amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-muted uppercase tracking-wider">{order.payment_status === 'paid' ? 'Paid' : 'Cash on Delivery'}</p>
                      </td>

                      <td className="py-3.5 pr-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${badge.class}`}
                        >
                          <badge.icon className="h-3 w-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      <td className="py-3.5 pr-2 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 transition-all hover:border-brand-400 hover:bg-cream-50 hover:text-brand-600 shadow-2xs whitespace-nowrap"
                          title="View Order Details"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted" />
                          <span>View Details</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-3.5 sm:hidden border-t border-cream-200 pt-3 text-center">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600"
        >
          <span>View All Orders</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
