'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '@/actions/admin/orders';
import { ORDER_STATUSES } from '@/lib/orderConstants';
import { Loader2, Check, AlertCircle } from 'lucide-react';

type Order = {
  id: string;
  order_status: string;
  tracking_number: string | null;
  tracking_url: string | null;
  courier_name: string | null;
};

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10 disabled:opacity-60';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-700';

const COURIER_PRESETS = ['Delhivery', 'Blue Dart', 'DTDC', 'India Post', 'Shiprocket'];

export default function OrderStatusManager({ order }: { order: Order }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(order.order_status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number ?? '');
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url ?? '');
  const [courierName, setCourierName] = useState(order.courier_name ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleCourierPreset = (name: string) => {
    setCourierName(name);
    // If tracking number already entered and url is empty, generate track URL
    if (trackingNumber && !trackingUrl) {
      if (name.toLowerCase().includes('delhivery')) {
        setTrackingUrl(`https://www.delhivery.com/track/package/${trackingNumber}`);
      } else if (name.toLowerCase().includes('blue dart')) {
        setTrackingUrl(`https://www.bluedart.com/tracking`);
      }
    }
  };

  const handleTrackingNumberChange = (val: string) => {
    setTrackingNumber(val);
    if (courierName.toLowerCase().includes('delhivery') && val && !trackingUrl) {
      setTrackingUrl(`https://www.delhivery.com/track/package/${val}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('order_status', status);
    formData.set('tracking_number', trackingNumber);
    formData.set('tracking_url', trackingUrl);
    formData.set('courier_name', courierName);

    startTransition(async () => {
      const result = await updateOrderStatus(order.id, formData);
      if (!result.success) {
        setError(result.error || 'Failed to update order status.');
        setSaved(false);
        return;
      }
      setError(null);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Order Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={pending}
          className={`${inputClass} capitalize font-semibold`}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-700">Courier / Carrier</label>
          <div className="flex items-center gap-1">
            {COURIER_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleCourierPreset(preset)}
                className={`text-[10px] rounded px-1.5 py-0.5 font-medium transition-colors ${
                  courierName.toLowerCase() === preset.toLowerCase()
                    ? 'bg-brand-500 text-white'
                    : 'bg-cream-100 text-muted hover:text-brand-700 hover:bg-cream-200'
                }`}
              >
                {preset.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        <input
          value={courierName}
          onChange={(e) => setCourierName(e.target.value)}
          disabled={pending}
          placeholder="e.g. Delhivery, Blue Dart, DTDC"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Tracking Number / AWB</label>
        <input
          value={trackingNumber}
          onChange={(e) => handleTrackingNumberChange(e.target.value)}
          disabled={pending}
          placeholder="e.g. DL98234123IN"
          className={`${inputClass} font-mono`}
        />
      </div>

      <div>
        <label className={labelClass}>Tracking Link</label>
        <input
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          disabled={pending}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-luxury hover:shadow-luxury-hover disabled:opacity-60 transition-all cursor-pointer"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating Status...</span>
          </>
        ) : saved ? (
          <>
            <Check className="h-4 w-4 text-emerald-300" />
            <span>Saved Successfully</span>
          </>
        ) : (
          <span>Save Changes</span>
        )}
      </button>
    </form>
  );
}
