'use client';

import { useActionState, useState } from 'react';
import { Check, AlertCircle, Plus, Trash2, Layers, Loader2, Sparkles, Tag } from 'lucide-react';
import {
  updateQuantityDiscountSettings,
  type QuantityDiscountFormState,
  type QuantityDiscountSettings,
  type QuantityDiscountTier,
} from '@/actions/admin/quantityDiscount';

export default function QuantityDiscountForm({ settings }: { settings: QuantityDiscountSettings }) {
  const [state, formAction, pending] = useActionState<QuantityDiscountFormState, FormData>(updateQuantityDiscountSettings, {});
  const [enabled, setEnabled] = useState(settings.enabled);
  const [tiers, setTiers] = useState<QuantityDiscountTier[]>(settings.tiers.map((t) => ({ ...t })));

  const updateTier = (idx: number, key: keyof QuantityDiscountTier, value: number) => {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, [key]: value } : t)));
  };

  const addTier = () => {
    const lastQty = tiers.length > 0 ? Math.max(...tiers.map((t) => Number(t.min_quantity) || 0)) : 0;
    setTiers((prev) => [...prev, { min_quantity: lastQty + 1, discount: 0 }]);
  };

  const removeTier = (idx: number) => setTiers((prev) => prev.filter((_, i) => i !== idx));

  // Sort tiers for live preview
  const sortedTiers = [...tiers].sort((a, b) => Number(a.min_quantity) - Number(b.min_quantity));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
      <form
        action={formAction}
        className="lg:col-span-2 space-y-6 rounded-2xl border border-cream-200/80 bg-white p-5 sm:p-7 shadow-2xs"
      >
        <input type="hidden" name="tiers" value={JSON.stringify(tiers)} />

        <div className="flex items-center gap-3 border-b border-cream-200 pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-200/70 text-brand-700">
            <Layers className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-brand-700">Quantity Discount Rules</h2>
            <p className="text-xs text-muted mt-0.5">Set a flat discount that applies automatically when a customer buys a certain number of items.</p>
          </div>
        </div>

        {/* Feedback Messages */}
        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{state.error}</span>
          </div>
        )}
        {state?.success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs sm:text-sm font-semibold text-emerald-800">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Quantity discount rules saved successfully.</span>
          </div>
        )}

        {/* Enable / Disable Toggle Card */}
        <button
          type="button"
          onClick={() => setEnabled((prev) => !prev)}
          className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all cursor-pointer ${
            enabled
              ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70'
              : 'border-cream-300 bg-cream-50/40 hover:bg-cream-100/60'
          }`}
        >
          <input type="hidden" name="enabled" value={enabled ? 'on' : ''} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold text-brand-700">
                Quantity Discount at Checkout
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  enabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {enabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              When turned on, the discount is applied automatically at checkout — no coupon needed.
            </p>
          </div>

          <span
            className={`relative flex h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
              enabled ? 'bg-emerald-600' : 'bg-cream-400'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition duration-200 ease-in-out ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </span>
        </button>

        {/* Tiers List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Discount Tiers
              </label>
              <p className="text-[11px] text-muted-light">Based on total number of items in the cart</p>
            </div>
            <button
              type="button"
              onClick={addTier}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-cream-100 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-500 hover:text-white transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Tier
            </button>
          </div>

          {tiers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-cream-300 p-6 text-center text-xs text-muted">
              No discount tiers defined yet. Click &quot;Add Tier&quot; above to add your first volume discount rule.
            </div>
          ) : (
            <div className="space-y-2.5">
              {tiers.map((tier, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-cream-300/80 bg-cream-50/40 p-3 sm:p-3.5 hover:border-brand-300 transition-all"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-700 text-xs font-bold">
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
                      Min. Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={tier.min_quantity}
                      onChange={(e) => updateTier(i, 'min_quantity', Number(e.target.value))}
                      className="w-full rounded-xl border border-cream-200 bg-white px-3 py-2 text-base sm:text-sm font-bold text-brand-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
                      Flat Discount (₹)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-muted pointer-events-none">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={tier.discount}
                        onChange={(e) => updateTier(i, 'discount', Number(e.target.value))}
                        className="w-full rounded-xl border border-cream-200 bg-white pl-7 pr-3 py-2 text-base sm:text-sm font-bold text-brand-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTier(i)}
                    className="shrink-0 rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600 transition-all mt-3.5 cursor-pointer"
                    title="Remove tier"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-cream-200">
          <button
            type="submit"
            disabled={pending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving Rules…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> Save Quantity Rules
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Preview Column */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-cream-300/80 bg-gradient-to-br from-cream-100/60 to-cream-50/50 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 border border-amber-300/60">
              <Tag className="h-4 w-4" />
            </span>
            <h3 className="font-heading text-sm font-bold text-brand-700 uppercase tracking-wider">
              Preview
            </h3>
          </div>

          <p className="text-xs text-muted">
            The best matching discount is applied automatically when the customer checks out:
          </p>

          <div className="space-y-2">
            {!enabled ? (
              <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-3 text-xs text-amber-800 font-medium">
                Quantity discounts are currently <span className="font-bold">disabled</span>. No discount will be given at checkout.
              </div>
            ) : sortedTiers.length === 0 ? (
              <div className="rounded-xl border border-cream-200 bg-white p-3 text-xs text-muted">
                No active tiers configured.
              </div>
            ) : (
              sortedTiers.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-cream-200 bg-white p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-brand-700">Buy {t.min_quantity}+ Items</span>
                    <span className="text-[11px] text-muted block mt-0.5">Applied on {t.min_quantity} or more items</span>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 font-bold text-emerald-700 text-xs">
                    -₹{t.discount} OFF
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="rounded-xl bg-brand-50 border border-brand-200/60 p-3 text-[11px] text-brand-700 leading-relaxed">
            <span className="font-bold">How it works:</span> No coupon needed. When a customer&apos;s cart has enough items, the discount is added to their order automatically.
          </div>
        </div>
      </div>
    </div>
  );
}
