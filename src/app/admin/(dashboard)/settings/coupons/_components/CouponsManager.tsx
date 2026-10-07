'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Tag,
  Percent,
  IndianRupee,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Pencil,
  Trash2,
  Filter,
  X,
  Sparkles,
  Ticket,
  Calendar,
  ShoppingBag,
} from 'lucide-react';
import { toggleCoupon, deleteCoupon, type Coupon } from '@/actions/admin/coupons';

export default function CouponsManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'percent' | 'flat'>('all');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggle = (coupon: Coupon) => {
    startTransition(async () => {
      await toggleCoupon(coupon.id, !coupon.is_active);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      startTransition(async () => {
        await deleteCoupon(id);
        setConfirmDeleteId(null);
        router.refresh();
      });
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => {
        setConfirmDeleteId((cur) => (cur === id ? null : cur));
      }, 4000);
    }
  };

  const now = Date.now();

  const filtered = useMemo(() => {
    return coupons.filter((c) => {
      const isExpired = !!c.expires_at && new Date(c.expires_at).getTime() < now;

      // Status filter
      if (statusFilter === 'active' && (!c.is_active || isExpired)) return false;
      if (statusFilter === 'inactive' && c.is_active) return false;
      if (statusFilter === 'expired' && !isExpired) return false;

      // Type filter
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = c.code.toLowerCase().includes(query);
        const matchesValue = String(c.value).includes(query);
        if (!matchesCode && !matchesValue) return false;
      }

      return true;
    });
  }, [coupons, statusFilter, typeFilter, searchQuery, now]);

  const isFiltering = searchQuery.trim() !== '' || statusFilter !== 'all' || typeFilter !== 'all';

  if (coupons.length === 0) {
    return (
      <div className="rounded-2xl border border-cream-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-200/50 flex items-center justify-center text-brand-600 mb-4">
          <Ticket className="h-6 w-6 text-brand-500" />
        </div>
        <h3 className="font-heading text-lg font-bold text-brand-700">No Coupons Created</h3>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto mt-1 mb-6">
          Create promotional discount codes (e.g. WELCOME10, FESTIVE500) to incentivize patrons at checkout.
        </p>
        <Link
          href="/admin/settings/coupons/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#CFAC64] hover:bg-[#B08F4F] shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Create First Coupon</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-cream-200/90 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coupon code (e.g. WELCOME, 500, EID)..."
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-cream-200 bg-cream-50/50 text-xs sm:text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all font-mono uppercase placeholder:font-sans placeholder:normal-case"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-700 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center rounded-xl bg-cream-100/80 p-0.5 border border-cream-200 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-brand-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'active'
                    ? 'bg-white text-[#024F5F] font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('inactive')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'inactive'
                    ? 'bg-white text-[#B08F4F] font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                Paused
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('expired')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'expired'
                    ? 'bg-white text-[#024F5F] font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                Expired
              </button>
            </div>

            {/* Discount Type Filter */}
            <div className="flex items-center rounded-xl bg-cream-100/80 p-0.5 border border-cream-200 text-xs">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  typeFilter === 'all'
                    ? 'bg-white text-brand-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                Type: All
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('percent')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  typeFilter === 'percent'
                    ? 'bg-white text-brand-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                <Percent className="h-3 w-3 text-gold" />
                <span>% Off</span>
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('flat')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  typeFilter === 'flat'
                    ? 'bg-white text-brand-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                <IndianRupee className="h-3 w-3 text-gold" />
                <span>Flat ₹</span>
              </button>
            </div>

            {isFiltering && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="text-xs text-brand-600 hover:text-brand-800 font-medium px-2 py-1.5"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Zero results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-cream-200 bg-white p-10 text-center shadow-xs">
          <Filter className="h-6 w-6 text-muted-light mx-auto mb-2" />
          <p className="text-sm font-semibold text-brand-700">No matching coupons found</p>
          <p className="text-xs text-muted mt-1">
            Try adjusting your search query or reset your status filters.
          </p>
        </div>
      ) : (
        <>
          {/* 1. DESKTOP VIEW: Luxury Coupons Table (hidden on mobile) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-cream-200/90 bg-white shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-200/80 bg-cream-50/50 text-[11px] uppercase tracking-wider text-muted font-semibold">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount Value</th>
                  <th className="py-3 px-4">Min. Purchase</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200/60">
                {filtered.map((coupon) => {
                  const isExpired = !!coupon.expires_at && new Date(coupon.expires_at).getTime() < now;
                  const isCopied = copiedId === coupon.id;
                  const isDeleting = confirmDeleteId === coupon.id;

                  return (
                    <tr
                      key={coupon.id}
                      className="hover:bg-cream-50/50 transition-colors group"
                    >
                      {/* Code Badge with 1-Click Copy */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-brand-700 bg-cream-100/90 border border-cream-300/80 px-2.5 py-1 rounded-lg tracking-wider">
                            <Tag className="h-3 w-3 text-gold" />
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(coupon.id, coupon.code)}
                            className="p-1 rounded-md text-muted hover:text-brand-700 hover:bg-cream-100 transition-colors"
                            title="Copy Code to Clipboard"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-[#024F5F]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Discount Value */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 bg-brand-500/10 text-brand-700 px-2 py-0.5 rounded-md border border-brand-200/60">
                          {coupon.type === 'percent' ? (
                            <>
                              <Percent className="h-3 w-3 text-gold" />
                              <span>{coupon.value}% OFF</span>
                            </>
                          ) : (
                            <>
                              <span>₹{coupon.value} FLAT OFF</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Minimum Purchase */}
                      <td className="py-3.5 px-4 text-xs text-brand-700 font-medium">
                        {coupon.min_purchase > 0 ? (
                          <span>₹{coupon.min_purchase.toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-muted text-[11px]">No Minimum</span>
                        )}
                      </td>

                      {/* Expiration */}
                      <td className="py-3.5 px-4 text-xs">
                        {coupon.expires_at ? (
                          <div className="flex items-center gap-1.5">
                            <span className={isExpired ? 'text-[#024F5F] font-semibold' : 'text-brand-700'}>
                              {new Date(coupon.expires_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            {isExpired && (
                              <span className="text-[10px] font-bold uppercase text-[#024F5F] bg-[#F6F1EC] px-1.5 py-0.5 rounded border border-[#CFAC64]">
                                Expired
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#024F5F] text-xs font-medium">Never Expires</span>
                        )}
                      </td>

                      {/* Active Status Pill */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(coupon)}
                          disabled={pending}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                            coupon.is_active && !isExpired
                              ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/70 hover:bg-[#F6F1EC]/60'
                              : 'bg-cream-100 text-muted border-cream-300/70 hover:bg-cream-200/50'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              coupon.is_active && !isExpired ? 'bg-[#024F5F]' : 'bg-cream-400'
                            }`}
                          />
                          <span>{coupon.is_active && !isExpired ? 'Active' : 'Paused'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/settings/coupons/${coupon.id}/edit`}
                            className="p-1.5 rounded-xl text-muted hover:text-brand-700 hover:bg-cream-100 transition-colors"
                            title="Edit Coupon"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(coupon.id)}
                            disabled={pending}
                            className={`p-1.5 rounded-xl text-xs font-semibold transition-all ${
                              isDeleting
                                ? 'bg-[#024F5F] text-white px-2.5'
                                : 'text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC]'
                            }`}
                            title={isDeleting ? 'Click to confirm delete' : 'Delete Coupon'}
                          >
                            <Trash2 className="h-4 w-4" />
                            {isDeleting && <span className="ml-1">Confirm?</span>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 2. MOBILE VIEW: Luxury Voucher Cards (visible only on mobile) */}
          <div className="md:hidden space-y-3">
            {filtered.map((coupon) => {
              const isExpired = !!coupon.expires_at && new Date(coupon.expires_at).getTime() < now;
              const isCopied = copiedId === coupon.id;
              const isDeleting = confirmDeleteId === coupon.id;

              return (
                <div
                  key={coupon.id}
                  className={`rounded-2xl border bg-white p-4 shadow-xs space-y-3 transition-all ${
                    coupon.is_active && !isExpired
                      ? 'border-cream-200/90'
                      : 'border-cream-200/50 bg-cream-50/40 opacity-80'
                  }`}
                >
                  {/* Top: Code & Copy */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-brand-700 bg-cream-100 border border-cream-300 px-2.5 py-1 rounded-lg tracking-wider">
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(coupon.id, coupon.code)}
                        className="p-1 text-muted hover:text-brand-700 active:scale-95"
                        title="Copy"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-[#024F5F]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-200/60">
                      {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} FLAT`}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-cream-200/60 text-muted">
                    <div>
                      <span className="text-[10px] uppercase font-semibold block text-muted-light">
                        Min. Order
                      </span>
                      <span className="font-semibold text-brand-700">
                        {coupon.min_purchase > 0 ? `₹${coupon.min_purchase}` : 'None'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold block text-muted-light">
                        Expiry
                      </span>
                      <span className={`font-semibold ${isExpired ? 'text-[#024F5F]' : 'text-brand-700'}`}>
                        {coupon.expires_at
                          ? new Date(coupon.expires_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })
                          : 'Never'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Active Toggle & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-cream-200/60">
                    <button
                      type="button"
                      onClick={() => handleToggle(coupon)}
                      disabled={pending}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                        coupon.is_active && !isExpired
                          ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]'
                          : 'bg-cream-100 text-muted border-cream-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          coupon.is_active && !isExpired ? 'bg-[#024F5F]' : 'bg-cream-400'
                        }`}
                      />
                      <span>{coupon.is_active && !isExpired ? 'Active' : 'Paused'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/settings/coupons/${coupon.id}/edit`}
                        className="p-1.5 rounded-lg text-muted hover:text-brand-700 bg-cream-50 border border-cream-200"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(coupon.id)}
                        disabled={pending}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isDeleting
                            ? 'bg-[#024F5F] text-white px-2.5'
                            : 'text-muted hover:text-[#024F5F] bg-cream-50 border border-cream-200'
                        }`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {isDeleting && <span className="ml-1">Confirm?</span>}
                      </button>
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
