'use client';

import { useActionState, useState } from 'react';
import {
  Truck,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  updateShippingSettings,
  type ShippingFormState,
  type ShippingSettings,
} from '@/actions/admin/shipping';

export default function ShippingForm({ shipping }: { shipping: ShippingSettings }) {
  const [state, formAction, pending] = useActionState<ShippingFormState, FormData>(
    updateShippingSettings,
    {}
  );
  const [flatRate, setFlatRate] = useState<number>(shipping.flat_rate ?? 0);
  const [freeThreshold, setFreeThreshold] = useState<number>(shipping.free_threshold ?? 0);
  const [codCharge, setCodCharge] = useState<number>(shipping.cod_charge ?? 0);

  return (
    <div className="max-w-2xl">
      <form
        action={formAction}
        className="space-y-6 rounded-2xl border border-cream-200/90 bg-white p-5 sm:p-7 shadow-xs"
      >
        {/* Panel Header */}
        <div className="flex items-center gap-3 border-b border-cream-200/80 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-200/60 text-brand-600">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-brand-700">
              Delivery Rates &amp; COD Fees
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Rules are applied dynamically at checkout based on the cart subtotal and selected payment method.
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {state?.error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3.5 text-xs sm:text-sm font-semibold text-red-800 shadow-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{state.error}</span>
          </div>
        )}
        {state?.success && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs sm:text-sm font-semibold text-emerald-800 shadow-xs">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Shipping settings saved successfully.</span>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Standard Courier Delivery Fee */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Standard Courier Delivery Fee (₹)
              </label>
              {flatRate === 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Free
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-bold text-muted pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                name="flat_rate"
                value={flatRate}
                onChange={(e) => setFlatRate(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-cream-200 bg-cream-50/40 pl-8 pr-4 py-2.5 text-base sm:text-sm text-brand-700 font-bold focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="0"
              />
            </div>
            <p className="text-[11px] text-muted">
              Base delivery fee charged on orders below the free delivery threshold. Set to 0 if all orders ship free.
            </p>
          </div>

          {/* Free Delivery Threshold */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Free Delivery Threshold (₹)
              </label>
              <span className="text-[10px] text-muted font-medium">
                {freeThreshold === 0 ? 'All orders free' : `Cart ≥ ₹${freeThreshold} gets free shipping`}
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-bold text-muted pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                name="free_threshold"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-cream-200 bg-cream-50/40 pl-8 pr-4 py-2.5 text-base sm:text-sm text-brand-700 font-bold focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="999"
              />
            </div>
            <p className="text-[11px] text-muted">
              Orders with cart value equal to or above this amount automatically get free delivery.
            </p>
          </div>

          {/* Cash on Delivery Charge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Cash on Delivery (COD) Handling Charge (₹)
              </label>
              <span className="text-[10px] text-muted">
                {codCharge === 0 ? 'No extra fee' : `+ ₹${codCharge} per COD order`}
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-bold text-muted pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                name="cod_charge"
                value={codCharge}
                onChange={(e) => setCodCharge(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-cream-200 bg-cream-50/40 pl-8 pr-4 py-2.5 text-base sm:text-sm text-brand-700 font-bold focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="0"
              />
            </div>
            <p className="text-[11px] text-muted">
              Extra courier surcharge added only when the customer selects COD payment. Set to 0 if COD is free.
            </p>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 border-t border-cream-200/80">
          <button
            type="submit"
            disabled={pending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-700 hover:to-brand-600 shadow-sm transition-all disabled:opacity-60 active:scale-[0.98]"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Rules…</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Save Shipping Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
