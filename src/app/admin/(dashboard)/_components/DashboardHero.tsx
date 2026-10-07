import Link from 'next/link';
import { ExternalLink, Plus, Store } from 'lucide-react';

interface DashboardHeroProps {
  adminName?: string;
  totalProducts: number;
  totalOrders: number;
}

export default function DashboardHero({ adminName, totalProducts, totalOrders }: DashboardHeroProps) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cream-300 bg-gradient-to-br from-white via-cream-50 to-brand-50/40 p-4 sm:p-6 md:p-8 shadow-luxury transition-all">
      {/* Decorative gold backdrop blur */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 sm:h-64 w-48 sm:w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 sm:h-48 w-36 sm:w-48 rounded-full bg-brand-400/10 blur-2xl" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
        <div className="space-y-2 min-w-0">
          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-brand-700 shadow-2xs">
              <span>Admin Dashboard</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CFAC64] bg-[#F6F1EC] px-2.5 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-[#024F5F]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#024F5F] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#024F5F]" />
              </span>
              <span>Store Online</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-brand-700 leading-tight">
            Welcome back, <span className="text-brand-500">{adminName || 'Admin'}</span>
          </h1>

          {/* Subtitle */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            <span className="font-medium text-brand-700">{today}</span>
            <span className="hidden sm:inline">•</span>
            <span>{totalProducts} products in store</span>
            <span>•</span>
            <span>{totalOrders} total orders</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 pt-2 sm:pt-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 sm:px-4 py-2.5 text-xs font-semibold text-brand-700 shadow-2xs transition-all hover:border-brand-400 hover:bg-cream-100"
          >
            <Store className="h-3.5 w-3.5 text-brand-500 shrink-0" />
            <span className="truncate">View Store</span>
            <ExternalLink className="h-3 w-3 text-muted shrink-0 hidden sm:inline" />
          </Link>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#CFAC64] px-3 sm:px-4 py-2.5 text-xs font-semibold text-white shadow-luxury transition-all hover:bg-[#B08F4F] hover:shadow-luxury-hover"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Add Product</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
