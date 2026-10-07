import Link from 'next/link';
import {
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  Mail,
  Tag,
  Star,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type { DashboardStats } from '@/actions/admin/dashboard';

interface DashboardKpiCardsProps {
  stats: DashboardStats;
}

export default function DashboardKpiCards({ stats }: DashboardKpiCardsProps) {
  const fulfillmentRate =
    stats.totalOrders > 0
      ? Math.round(((stats.shippedOrders + stats.deliveredOrders) / stats.totalOrders) * 100)
      : 100;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Revenue */}
        <div className="group relative overflow-hidden rounded-2xl border border-cream-300 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:border-gold/50 hover:shadow-luxury">
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gold/10 transition-all duration-300 group-hover:scale-110" />
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gold-light/40 text-gold-dark border border-gold/30 shrink-0">
              <IndianRupee className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-brand-700">
              <TrendingUp className="h-3 w-3 text-gold" /> Sales
            </span>
          </div>

          <div className="mt-3 sm:mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Total Revenue</p>
            <p className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-brand-700 mt-0.5 sm:mt-1 truncate">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-cream-200 pt-2 text-[11px] text-muted">
            <span className="truncate">This month: <strong className="text-brand-700 font-semibold">₹{stats.revenueThisMonth.toLocaleString('en-IN')}</strong></span>
            {stats.revenueToday > 0 && (
              <span className="text-[#024F5F] font-semibold bg-[#F6F1EC] px-1.5 py-0.5 rounded text-[10px] shrink-0 ml-1">
                +₹{stats.revenueToday.toLocaleString('en-IN')} today
              </span>
            )}
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="group relative overflow-hidden rounded-2xl border border-cream-300 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:border-brand-400 hover:shadow-luxury">
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-brand-500/5 transition-all duration-300 group-hover:scale-110" />
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20 shrink-0">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F1EC] px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#024F5F]">
              {stats.processingOrders} pending
            </span>
          </div>

          <div className="mt-3 sm:mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Total Orders</p>
            <p className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-brand-700 mt-0.5 sm:mt-1">
              {stats.totalOrders}
            </p>
          </div>

          <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-cream-200 pt-2 text-[11px] text-muted">
            <span className="flex items-center gap-1 text-[#024F5F] font-medium truncate">
              <CheckCircle2 className="h-3 w-3 shrink-0" /> {stats.deliveredOrders + stats.shippedOrders} completed
            </span>
            <span className="text-brand-600 font-semibold shrink-0 ml-1">{fulfillmentRate}% fulfilled</span>
          </div>
        </div>

        {/* 3. Average Order Value */}
        <div className="group relative overflow-hidden rounded-2xl border border-cream-300 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:border-[#CFAC64] hover:shadow-luxury">
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[#024F5F]/5 transition-all duration-300 group-hover:scale-110" />
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64] shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F1EC] px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#024F5F]">
              Average
            </span>
          </div>

          <div className="mt-3 sm:mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Average Order Value</p>
            <p className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-brand-700 mt-0.5 sm:mt-1 truncate">
              ₹{stats.averageOrderValue.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-cream-200 pt-2 text-[11px] text-muted truncate">
            <span className="truncate">Average per completed order</span>
          </div>
        </div>

        {/* 4. Total Products */}
        <div className="group relative overflow-hidden rounded-2xl border border-cream-300 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:border-brand-400 hover:shadow-luxury">
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-brand-500/5 transition-all duration-300 group-hover:scale-110" />
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 border border-cream-300 shrink-0">
              <Package className="h-5 w-5 text-brand-500" />
            </div>
            {stats.lowStockCount > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F1EC] px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#024F5F]">
                <AlertTriangle className="h-3 w-3 shrink-0" /> {stats.lowStockCount} low stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F1EC] px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#024F5F]">
                In Stock
              </span>
            )}
          </div>

          <div className="mt-3 sm:mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Total Products</p>
            <p className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-brand-700 mt-0.5 sm:mt-1 truncate">
              {stats.totalProducts} <span className="text-xs font-medium text-muted">({stats.activeProducts} active)</span>
            </p>
          </div>

          <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-cream-200 pt-2 text-[11px] text-muted">
            <Link href="/admin/products" className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1">
              <span>View products</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-cream-300 bg-white/80 p-2.5 sm:p-3.5 shadow-2xs min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-cream-100 text-brand-700">
            <Users className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted truncate">Customers</p>
            <p className="font-heading text-base sm:text-lg font-bold text-brand-700 truncate">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-cream-300 bg-white/80 p-2.5 sm:p-3.5 shadow-2xs min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-cream-100 text-brand-700">
            <Mail className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted truncate">Subscribers</p>
            <p className="font-heading text-base sm:text-lg font-bold text-brand-700 truncate">{stats.newsletterCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-cream-300 bg-white/80 p-2.5 sm:p-3.5 shadow-2xs min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-cream-100 text-brand-700">
            <Tag className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted truncate">Active Coupons</p>
            <p className="font-heading text-base sm:text-lg font-bold text-brand-700 truncate">{stats.activeCouponsCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-cream-300 bg-white/80 p-2.5 sm:p-3.5 shadow-2xs min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-cream-100 text-gold-dark">
            <Star className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-gold" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted truncate">Pending Reviews</p>
            <p className="font-heading text-base sm:text-lg font-bold text-brand-700 truncate">{stats.pendingReviewCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
