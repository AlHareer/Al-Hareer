'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  Percent,
  IndianRupee,
  Calendar,
  Ticket,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { createCoupon, updateCoupon, type CouponFormState, type Coupon } from '@/actions/admin/coupons';

export default function CouponForm({ coupon }: { coupon?: Coupon }) {
  const isEditing = !!coupon;
  const action = isEditing ? updateCoupon : createCoupon;
  const [state, formAction, pending] = useActionState<CouponFormState, FormData>(action, {});

  const [code, setCode] = useState(coupon?.code ?? '');
  const [type, setType] = useState<'percent' | 'flat'>(coupon?.type ?? 'percent');
  const [value, setValue] = useState<string>(coupon ? String(coupon.value) : '');
  const [minPurchase, setMinPurchase] = useState<string>(coupon ? String(coupon.min_purchase) : '0');
  const [expiresAt, setExpiresAt] = useState<string>(
    coupon?.expires_at ? coupon.expires_at.slice(0, 10) : ''
  );
  const [isActive, setIsActive] = useState(coupon?.is_active ?? true);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {isEditing && <input type="hidden" name="id" value={coupon.id} />}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="is_active" value={isActive ? 'on' : 'off'} />

      {state?.error && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#CFAC64] bg-[#F6F1EC]/90 p-4 text-sm text-[#024F5F] shadow-xs">
          <span className="h-2 w-2 rounded-full bg-[#024F5F] shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-cream-200/90 p-5 sm:p-7 shadow-xs space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-cream-200/60">
          <Ticket className="h-4 w-4 text-gold" />
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-700">
            {isEditing ? 'Edit Coupon Parameters' : 'Coupon Information'}
          </h2>
        </div>

        {/* Coupon Code Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-700">
            Coupon Code <span className="text-[#024F5F]">*</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              required
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
              placeholder="e.g. WELCOME10"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50/40 text-base sm:text-sm font-mono font-bold uppercase tracking-wider text-brand-700 placeholder:text-muted placeholder:normal-case placeholder:font-sans placeholder:font-normal focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <p className="text-[11px] text-muted">
            The code entered by the customer at checkout (case-insensitive).
          </p>
        </div>

        {/* Discount Type Selector */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-brand-700 block">
            Discount Type <span className="text-[#024F5F]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('percent')}
              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                type === 'percent'
                  ? 'bg-brand-700 text-white border-brand-700 shadow-xs'
                  : 'bg-cream-50/60 text-brand-700 border-cream-200 hover:bg-cream-100'
              }`}
            >
              <Percent className={`h-4 w-4 ${type === 'percent' ? 'text-gold' : 'text-muted'}`} />
              <div>
                <span className="text-xs font-bold block">Percentage Off</span>
                <span className={`text-[10px] block ${type === 'percent' ? 'text-white' : 'text-muted'}`}>
                  e.g. 10% or 15%
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType('flat')}
              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                type === 'flat'
                  ? 'bg-brand-700 text-white border-brand-700 shadow-xs'
                  : 'bg-cream-50/60 text-brand-700 border-cream-200 hover:bg-cream-100'
              }`}
            >
              <IndianRupee className={`h-4 w-4 ${type === 'flat' ? 'text-gold' : 'text-muted'}`} />
              <div>
                <span className="text-xs font-bold block">Flat Amount Off</span>
                <span className={`text-[10px] block ${type === 'flat' ? 'text-white' : 'text-muted'}`}>
                  e.g. ₹500 discount
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Discount Value & Minimum Purchase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-700">
              {type === 'percent' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}{' '}
              <span className="text-[#024F5F]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-xs font-bold">
                {type === 'percent' ? '%' : '₹'}
              </span>
              <input
                required
                type="number"
                step="0.01"
                min="0.1"
                max={type === 'percent' ? 100 : undefined}
                name="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === 'percent' ? '10' : '500'}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50/40 text-base sm:text-sm font-bold text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-brand-700">
                Minimum Purchase Amount (₹)
              </label>
              <span className="text-[10px] text-muted">0 = No Minimum</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-xs font-bold">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                name="min_purchase"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50/40 text-base sm:text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Expiration Date */}
        <div className="pt-2 border-t border-cream-200/60">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-brand-700">
              Expiration Date (Optional)
            </label>
            {expiresAt && (
              <button
                type="button"
                onClick={() => setExpiresAt('')}
                className="text-[11px] text-brand-600 hover:text-brand-800 font-semibold"
              >
                Clear (No Expiry)
              </button>
            )}
          </div>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="date"
              name="expires_at"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50/40 text-base sm:text-sm text-brand-700 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <p className="text-[10px] text-muted mt-1">
            Leave blank if this coupon is permanently valid.
          </p>
        </div>

        {/* Status Switch */}
        <div className="pt-2 border-t border-cream-200/60">
          <label className="text-xs font-semibold text-brand-700 block mb-2">
            Coupon Status
          </label>
          <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 transition-colors">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  isActive ? 'bg-[#F6F1EC]/80 text-[#024F5F]' : 'bg-cream-200/70 text-muted'
                }`}
              >
                {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-brand-700">
                    {isActive ? 'Active' : 'Paused'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      isActive
                        ? 'bg-[#F6F1EC]/80 text-[#024F5F]'
                        : 'bg-[#F6F1EC]/70 text-[#024F5F]'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? 'bg-[#024F5F] animate-pulse' : 'bg-[#F6F1EC]'
                      }`}
                    />
                    {isActive ? 'Live at Checkout' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[11px] text-muted mt-0.5">
                  {isActive
                    ? 'Customers can use this coupon code during checkout.'
                    : 'Coupon is temporarily disabled and will not apply.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                isActive ? 'bg-[#024F5F]' : 'bg-[#F6F1EC]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-700 hover:to-brand-600 shadow-sm transition-all disabled:opacity-60 active:scale-[0.98]"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : isEditing ? (
            'Update Coupon'
          ) : (
            'Create Coupon'
          )}
        </button>
        <Link
          href="/admin/settings/coupons"
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-muted hover:text-brand-700 hover:bg-cream-100 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
