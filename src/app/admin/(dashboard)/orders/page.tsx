import { getAllOrdersAdmin } from '@/actions/admin/orders';
import OrderList from './_components/OrderList';
import { ShoppingBag, Clock, Truck, IndianRupee } from 'lucide-react';

export const metadata = { title: 'Orders — Al Hareer Admin' };

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersAdmin();

  const processingCount = orders.filter((o) => o.order_status === 'processing').length;
  const shippedCount = orders.filter((o) => o.order_status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.order_status === 'delivered').length;
  const totalRevenue = orders
    .filter((o) => o.order_status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const kpis = [
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      sub: `${deliveredCount} delivered so far`,
      icon: ShoppingBag,
      color: 'brand',
      bgClass: 'bg-brand-50 text-brand-700 border-brand-200/60',
    },
    {
      label: 'Needs Processing',
      value: processingCount.toString(),
      sub: processingCount > 0 ? 'Pending dispatch' : 'All caught up',
      icon: Clock,
      color: 'amber',
      bgClass: 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]/60',
      pulse: processingCount > 0,
    },
    {
      label: 'In Transit',
      value: shippedCount.toString(),
      sub: 'Shipped to customers',
      icon: Truck,
      color: 'blue',
      bgClass: 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/60',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      sub: 'Non-cancelled orders',
      icon: IndianRupee,
      color: 'emerald',
      bgClass: 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/60',
    },
  ];

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-brand-700">Orders</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700">Customer Orders</h1>
            <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700 border border-cream-200">
              {orders.length} total
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="relative overflow-hidden rounded-2xl border border-cream-200/80 bg-white p-4 sm:p-5 shadow-2xs transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">{k.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${k.bgClass}`}>
                <k.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <p className="font-heading text-xl sm:text-2xl font-bold text-brand-700 leading-tight">
                {k.value}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted">
                {k.pulse && <span className="h-1.5 w-1.5 rounded-full bg-[#CFAC64] animate-pulse" />}
                <span>{k.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Orders List */}
      <OrderList initialOrders={orders} />
    </div>
  );
}
