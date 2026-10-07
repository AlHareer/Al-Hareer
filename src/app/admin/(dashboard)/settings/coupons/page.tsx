import Link from 'next/link';
import { Plus, Tag, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';
import { getAllCoupons } from '@/actions/admin/coupons';
import CouponsManager from './_components/CouponsManager';

export const metadata = { title: 'Coupons & Discounts — Al Hareer Admin' };

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons();
  const now = Date.now();
  const activeCount = coupons.filter((c) => {
    const isExpired = !!c.expires_at && new Date(c.expires_at).getTime() < now;
    return c.is_active && !isExpired;
  }).length;
  const expiredCount = coupons.filter((c) => c.expires_at && new Date(c.expires_at).getTime() < now).length;
  const inactiveCount = coupons.filter((c) => !c.is_active).length;

  const stats = [
    {
      label: 'Total Coupons',
      value: coupons.length,
      icon: Tag,
      accent: 'bg-brand-500/10 text-brand-600 border-brand-200/60',
    },
    {
      label: 'Live & Active',
      value: activeCount,
      icon: CheckCircle2,
      accent: 'bg-[#024F5F]/10 text-[#024F5F] border-[#CFAC64]/60',
    },
    {
      label: 'Paused / Inactive',
      value: inactiveCount,
      icon: XCircle,
      accent: 'bg-[#CFAC64]/10 text-[#B08F4F] border-[#CFAC64]/60',
    },
    {
      label: 'Expired',
      value: expiredCount,
      icon: Clock,
      accent: 'bg-[#024F5F]/10 text-[#024F5F] border-[#CFAC64]/60',
    },
  ];

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Page Header & Breadcrumbs (NO OTHER SETTINGS TABS) */}
      <div className="border-b border-cream-200/80 pb-4.5">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span>Promotions</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="text-brand-500 font-semibold">Coupons</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-700 tracking-tight">
              Coupons &amp; Promo Codes
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Create and manage checkout promotional vouchers, percentage discounts, and minimum order incentives.
            </p>
          </div>
          <Link
            href="/admin/settings/coupons/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-700 hover:to-brand-600 shadow-sm transition-all active:scale-[0.98] self-start sm:self-auto shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Coupon</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-cream-200/90 p-4 shadow-xs flex items-center justify-between gap-3 hover:border-brand-300/40 transition-all"
            >
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted">
                  {s.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-brand-700 font-heading mt-1">
                  {s.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl border ${s.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Coupons Manager (Table & Mobile Cards) */}
      <CouponsManager coupons={coupons} />
    </div>
  );
}
