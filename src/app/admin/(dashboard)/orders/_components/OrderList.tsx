'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ChevronRight,
  User,
  Phone,
  Mail,
  Copy,
  Check,
  Package,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { type OrderListItem, quickUpdateOrderStatus, deleteOrder } from '@/actions/admin/orders';
import { ORDER_STATUSES } from '@/lib/orderConstants';

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string; icon: typeof Clock }
> = {
  processing: {
    label: 'Processing',
    badgeClass: 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]/80',
    dotClass: 'bg-[#CFAC64]',
    icon: Clock,
  },
  shipped: {
    label: 'Shipped',
    badgeClass: 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/80',
    dotClass: 'bg-[#024F5F]',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    badgeClass: 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/80',
    dotClass: 'bg-[#024F5F]',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    badgeClass: 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/80',
    dotClass: 'bg-[#024F5F]',
    icon: XCircle,
  },
};

function formatCurrency(amount: number) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  } catch {
    return { date: dateStr, time: '' };
  }
}

function getInitials(name?: string | null) {
  if (!name) return 'CU';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function OrderList({ initialOrders }: { initialOrders: OrderListItem[] }) {
  const [orders, setOrders] = useState<OrderListItem[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | (typeof ORDER_STATUSES)[number]>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cod' | 'prepaid'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_amount'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Counts for filter tabs
  const counts = useMemo(() => {
    return {
      all: orders.length,
      processing: orders.filter((o) => o.order_status === 'processing').length,
      shipped: orders.filter((o) => o.order_status === 'shipped').length,
      delivered: orders.filter((o) => o.order_status === 'delivered').length,
      cancelled: orders.filter((o) => o.order_status === 'cancelled').length,
    };
  }, [orders]);

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders
      .filter((o) => {
        // Status filter
        if (statusFilter !== 'all' && o.order_status !== statusFilter) return false;

        // Payment method filter
        if (paymentFilter === 'cod') {
          const m = (o.payment_method || '').toLowerCase();
          if (!m.includes('cod') && !m.includes('cash')) return false;
        } else if (paymentFilter === 'prepaid') {
          const m = (o.payment_method || '').toLowerCase();
          if (m.includes('cod') || m.includes('cash')) return false;
        }

        // Search query
        if (!q) return true;
        const customerName = (o.profiles?.full_name || '').toLowerCase();
        const email = (o.profiles?.email || o.guest_email || '').toLowerCase();
        const phone = (o.profiles?.phone || o.guest_phone || '').toLowerCase();
        const orderNum = (o.order_number || '').toLowerCase();

        return orderNum.includes(q) || customerName.includes(q) || email.includes(q) || phone.includes(q);
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortBy === 'highest_amount') return b.total_amount - a.total_amount;
        return 0;
      });
  }, [orders, search, statusFilter, paymentFilter, sortBy]);

  // Copy order number helper
  const handleCopy = (orderNum: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(orderNum);
    setCopiedId(orderNum);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Delete an order — click once to arm, click again (within the same render) to confirm.
  const handleDelete = (e: React.MouseEvent, orderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmDeleteId !== orderId) {
      setConfirmDeleteId(orderId);
      return;
    }
    setConfirmDeleteId(null);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    startTransition(async () => {
      await deleteOrder(orderId);
    });
  };

  // Quick inline status updater
  const handleStatusChange = (orderId: string, newStatus: (typeof ORDER_STATUSES)[number]) => {
    // Optimistic update
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o)));

    startTransition(async () => {
      await quickUpdateOrderStatus(orderId, newStatus);
    });
  };

  // Export filtered orders as CSV
  const handleExportCSV = () => {
    if (!filteredOrders.length) return;
    const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Phone', 'Items', 'Total (INR)', 'Status', 'Payment Method'];
    const rows = filteredOrders.map((o) => [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toLocaleDateString('en-IN')}"`,
      `"${o.profiles?.full_name || 'Guest'}"`,
      `"${o.profiles?.email || o.guest_email || ''}"`,
      `"${o.profiles?.phone || o.guest_phone || ''}"`,
      o.item_count || 1,
      o.total_amount,
      `"${o.order_status}"`,
      `"${o.payment_method || 'COD'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `al-hareer-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters = search || statusFilter !== 'all' || paymentFilter !== 'all' || sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, email, phone..."
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-9 py-2.5 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-700 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Secondary Controls: Payment, Sort, Export */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'cod' | 'prepaid')}
            className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs font-semibold text-brand-700 focus:border-brand-500 focus:outline-none shadow-2xs cursor-pointer shrink-0"
          >
            <option value="all">All Payments</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="prepaid">Online / Prepaid</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'highest_amount')}
            className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs font-semibold text-brand-700 focus:border-brand-500 focus:outline-none shadow-2xs cursor-pointer shrink-0"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_amount">Highest Amount</option>
          </select>

          <button
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-cream-50 hover:border-brand-400 disabled:opacity-50 transition-all shadow-2xs shrink-0 cursor-pointer"
            title="Download orders as CSV"
          >
            <Download className="h-3.5 w-3.5 text-muted" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Status Filter Chips (Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-brand-500 text-white shadow-luxury'
              : 'border border-cream-300 bg-white text-brand-700 hover:border-brand-300 hover:bg-cream-50 shadow-2xs'
          }`}
        >
          <span>All Orders</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
              statusFilter === 'all' ? 'bg-white/25 text-white' : 'bg-cream-100 text-muted'
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('processing')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'processing'
              ? 'bg-brand-500 text-white shadow-luxury'
              : 'border border-cream-300 bg-white text-brand-700 hover:border-brand-300 hover:bg-cream-50 shadow-2xs'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#CFAC64]" />
          <span>Processing</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
              statusFilter === 'processing' ? 'bg-white/25 text-white' : 'bg-[#F6F1EC] text-[#B08F4F]'
            }`}
          >
            {counts.processing}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('shipped')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'shipped'
              ? 'bg-brand-500 text-white shadow-luxury'
              : 'border border-cream-300 bg-white text-brand-700 hover:border-brand-300 hover:bg-cream-50 shadow-2xs'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#024F5F]" />
          <span>Shipped</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
              statusFilter === 'shipped' ? 'bg-white/25 text-white' : 'bg-[#F6F1EC] text-[#024F5F]'
            }`}
          >
            {counts.shipped}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('delivered')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'delivered'
              ? 'bg-brand-500 text-white shadow-luxury'
              : 'border border-cream-300 bg-white text-brand-700 hover:border-brand-300 hover:bg-cream-50 shadow-2xs'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#024F5F]" />
          <span>Delivered</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
              statusFilter === 'delivered' ? 'bg-white/25 text-white' : 'bg-[#F6F1EC] text-[#024F5F]'
            }`}
          >
            {counts.delivered}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'cancelled'
              ? 'bg-brand-500 text-white shadow-luxury'
              : 'border border-cream-300 bg-white text-brand-700 hover:border-brand-300 hover:bg-cream-50 shadow-2xs'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#024F5F]" />
          <span>Cancelled</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
              statusFilter === 'cancelled' ? 'bg-white/25 text-white' : 'bg-[#F6F1EC] text-[#024F5F]'
            }`}
          >
            {counts.cancelled}
          </span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setPaymentFilter('all');
              setSortBy('newest');
            }}
            className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs text-muted hover:text-brand-700 hover:bg-cream-100 transition-colors whitespace-nowrap cursor-pointer ml-auto"
            title="Reset all filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Orders List Container */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-cream-200/80 bg-white p-12 text-center shadow-2xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-100 text-muted mb-3">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-brand-700">No orders found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto mt-1">
            {search || statusFilter !== 'all' || paymentFilter !== 'all'
              ? 'Try adjusting your search keywords or clear your active filters.'
              : 'When customers place orders on your store, they will appear here.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setPaymentFilter('all');
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#CFAC64] px-4 py-2 text-xs font-semibold text-white shadow-luxury hover:bg-[#B08F4F] transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (>= lg) */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-cream-200/80 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50/70 text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="py-3 px-4 w-[15%]">Order</th>
                  <th className="py-3 px-4 w-[22%]">Customer</th>
                  <th className="py-3 px-4 w-[15%]">Date &amp; Time</th>
                  <th className="py-3 px-4 w-[12%]">Payment</th>
                  <th className="py-3 px-4 w-[11%]">Total</th>
                  <th className="py-3 px-4 w-[12%] text-center">Fulfillment</th>
                  <th className="py-3 px-4 w-[13%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredOrders.map((o) => {
                  const { date, time } = formatDate(o.created_at);
                  const customerName = o.profiles?.full_name || 'Guest Customer';
                  const email = o.profiles?.email || o.guest_email;
                  const phone = o.profiles?.phone || o.guest_phone;
                  const isCOD = (o.payment_method || '').toLowerCase().includes('cod');
                  const statusObj = STATUS_CONFIG[o.order_status] || STATUS_CONFIG.processing;

                  return (
                    <tr key={o.id} className="group hover:bg-cream-50/50 transition-colors">
                      {/* Order Number & Items */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="font-mono text-xs font-bold text-brand-700 hover:text-brand-500 transition-colors"
                          >
                            {o.order_number}
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(o.order_number, e)}
                            className="text-muted/60 hover:text-brand-600 transition-colors p-0.5 rounded"
                            title="Copy Order Number"
                          >
                            {copiedId === o.order_number ? (
                              <Check className="h-3 w-3 text-[#024F5F]" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-muted mt-0.5">
                          {o.item_count || 1} {o.item_count === 1 ? 'item' : 'items'}
                        </p>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 border border-brand-200/60 font-heading text-xs font-bold text-brand-700">
                            {getInitials(customerName)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-brand-700 truncate">{customerName}</p>
                            <p className="text-[11px] text-muted truncate">{phone || email || '—'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-xs">
                        <p className="font-medium text-brand-700">{date}</p>
                        <p className="text-[11px] text-muted">{time}</p>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            isCOD
                              ? 'bg-[#F6F1EC] text-[#B08F4F] border border-[#CFAC64]/60'
                              : 'bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64]/60'
                          }`}
                        >
                          {isCOD ? 'COD' : 'Prepaid'}
                        </span>
                        <p className="text-[10px] text-muted capitalize mt-0.5">{o.payment_status || 'Pending'}</p>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-bold text-brand-700">{formatCurrency(o.total_amount)}</p>
                      </td>

                      {/* Quick Status Selector */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={o.order_status}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value as (typeof ORDER_STATUSES)[number])
                          }
                          className={`rounded-xl border px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer text-center capitalize ${statusObj.badgeClass}`}
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st} className="bg-white text-brand-700 capitalize">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Action: View Details + Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:border-brand-500 hover:bg-cream-50 hover:text-brand-600 transition-all shadow-2xs whitespace-nowrap"
                          >
                            <Eye className="h-3.5 w-3.5 text-muted" />
                            <span>View Details</span>
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, o.id)}
                            title={confirmDeleteId === o.id ? 'Click again to confirm delete' : 'Delete order'}
                            className={`rounded-xl border p-2 transition-all shadow-2xs ${
                              confirmDeleteId === o.id
                                ? 'border-[#024F5F] bg-[#F6F1EC] text-[#024F5F]'
                                : 'border-cream-300 bg-white text-muted hover:border-[#024F5F] hover:text-[#024F5F] hover:bg-[#F6F1EC]'
                            }`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View (< lg) */}
          <div className="lg:hidden space-y-3">
            {filteredOrders.map((o) => {
              const { date, time } = formatDate(o.created_at);
              const customerName = o.profiles?.full_name || 'Guest Customer';
              const email = o.profiles?.email || o.guest_email;
              const phone = o.profiles?.phone || o.guest_phone;
              const isCOD = (o.payment_method || '').toLowerCase().includes('cod');
              const statusObj = STATUS_CONFIG[o.order_status] || STATUS_CONFIG.processing;

              return (
                <div
                  key={o.id}
                  className="rounded-2xl border border-cream-200/80 bg-white p-4 shadow-2xs space-y-3 transition-all hover:border-cream-300"
                >
                  {/* Card Header: Order # + Status Selector */}
                  <div className="flex items-center justify-between gap-2 border-b border-cream-100 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-mono text-xs font-bold text-brand-700 hover:text-brand-500"
                      >
                        {o.order_number}
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(o.order_number, e)}
                        className="text-muted/60 hover:text-brand-600 p-0.5 rounded"
                        title="Copy Order Number"
                      >
                        {copiedId === o.order_number ? (
                          <Check className="h-3 w-3 text-[#024F5F]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>

                    <select
                      value={o.order_status}
                      onChange={(e) =>
                        handleStatusChange(o.id, e.target.value as (typeof ORDER_STATUSES)[number])
                      }
                      className={`rounded-lg border px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer capitalize ${statusObj.badgeClass}`}
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-white text-brand-700 capitalize">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Customer row */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 border border-brand-200/60 font-heading text-xs font-bold text-brand-700">
                      {getInitials(customerName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-brand-700 truncate">{customerName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-muted truncate mt-0.5">
                        {phone && (
                          <a href={`tel:${phone}`} className="hover:text-brand-700 underline decoration-cream-300">
                            {phone}
                          </a>
                        )}
                        {phone && email && <span>·</span>}
                        {email && <span className="truncate">{email}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Details row: Date, items, payment */}
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-cream-50/70 p-2.5 text-[11px]">
                    <div className="text-muted">
                      <span>{date} · {time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted">
                        {o.item_count || 1} {o.item_count === 1 ? 'item' : 'items'}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.2 font-semibold text-[10px] ${
                          isCOD
                            ? 'bg-[#F6F1EC] text-[#B08F4F]'
                            : 'bg-[#F6F1EC] text-[#024F5F]'
                        }`}
                      >
                        {isCOD ? 'COD' : 'Prepaid'}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Total + View Link */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Amount</p>
                      <p className="font-heading text-base font-bold text-brand-700">
                        {formatCurrency(o.total_amount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, o.id)}
                        title={confirmDeleteId === o.id ? 'Click again to confirm delete' : 'Delete order'}
                        className={`inline-flex items-center justify-center rounded-xl border p-2.5 transition-all ${
                          confirmDeleteId === o.id
                            ? 'border-[#024F5F] bg-[#F6F1EC] text-[#024F5F]'
                            : 'border-cream-300 bg-white text-muted hover:border-[#024F5F] hover:text-[#024F5F] hover:bg-[#F6F1EC]'
                        }`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#CFAC64] hover:bg-[#B08F4F] px-3.5 py-2 text-xs font-semibold text-white transition-all shadow-luxury hover:shadow-luxury-hover"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
