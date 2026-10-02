import Link from 'next/link';
import { AlertTriangle, Clock, Star, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DashboardAlertsProps {
  processingOrders: number;
  pendingReviews: number;
  unresolvedInquiries: number;
  lowStockCount: number;
}

export default function DashboardAlerts({
  processingOrders,
  pendingReviews,
  unresolvedInquiries,
  lowStockCount,
}: DashboardAlertsProps) {
  const totalPending = processingOrders + pendingReviews + unresolvedInquiries + lowStockCount;

  if (totalPending === 0) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-green-200/80 bg-green-50/70 p-3 sm:px-4 sm:py-3 text-xs text-green-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <span className="font-semibold">Everything looks good!</span>
          <span className="text-green-700/80 hidden md:inline">No pending orders, reviews, or low stock alerts.</span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-green-700 uppercase tracking-wider shrink-0">
          All Clear
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-cream-50 to-amber-50/50 p-3.5 sm:p-4 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Action Needed</p>
            <p className="text-xs text-brand-700/90">
              You have <span className="font-bold text-amber-900">{totalPending} item{totalPending > 1 ? 's' : ''}</span> that need your attention:
            </p>
          </div>
        </div>

        {/* Action Pills Grid */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {processingOrders > 0 && (
            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-between sm:justify-start gap-1.5 rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs transition-all hover:bg-amber-100"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{processingOrders} Pending Order{processingOrders > 1 ? 's' : ''}</span>
              </div>
              <ArrowRight className="h-3 w-3 text-amber-600 shrink-0" />
            </Link>
          )}

          {pendingReviews > 0 && (
            <Link
              href="/admin/reviews"
              className="inline-flex items-center justify-between sm:justify-start gap-1.5 rounded-lg border border-gold/40 bg-white px-2.5 py-1.5 text-xs font-semibold text-gold-dark shadow-2xs transition-all hover:bg-gold-light/40"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Star className="h-3.5 w-3.5 text-gold shrink-0" />
                <span className="truncate">{pendingReviews} Pending Review{pendingReviews > 1 ? 's' : ''}</span>
              </div>
              <ArrowRight className="h-3 w-3 text-gold-dark shrink-0" />
            </Link>
          )}

          {unresolvedInquiries > 0 && (
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center justify-between sm:justify-start gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-800 shadow-2xs transition-all hover:bg-blue-50"
            >
              <div className="flex items-center gap-1.5 truncate">
                <MessageSquare className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{unresolvedInquiries} New Message{unresolvedInquiries > 1 ? 's' : ''}</span>
              </div>
              <ArrowRight className="h-3 w-3 text-blue-600 shrink-0" />
            </Link>
          )}

          {lowStockCount > 0 && (
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-between sm:justify-start gap-1.5 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-800 shadow-2xs transition-all hover:bg-rose-50"
            >
              <div className="flex items-center gap-1.5 truncate">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span className="truncate">{lowStockCount} Low Stock</span>
              </div>
              <ArrowRight className="h-3 w-3 text-rose-600 shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
