'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { toggleCoupon, deleteCoupon, type Coupon } from '@/actions/admin/coupons';

export default function CouponRow({ coupon }: { coupon: Coupon }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const expired = !!coupon.expires_at && new Date(coupon.expires_at) < new Date();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleCoupon(coupon.id, !coupon.is_active);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteCoupon(coupon.id);
      router.refresh();
    });
  };

  return (
    <tr className="hover:bg-cream-100 transition-colors">
      <td className="py-3.5 pr-4 pl-2">
        <span className="font-mono text-sm font-semibold text-brand-700">{coupon.code}</span>
      </td>
      <td className="py-3.5 pr-4 text-sm text-muted">
        {coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value} off`}
      </td>
      <td className="py-3.5 pr-4 text-sm text-muted">{coupon.min_purchase > 0 ? `₹${coupon.min_purchase}` : '—'}</td>
      <td className="py-3.5 pr-4 text-sm text-muted">
        {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('en-IN') : 'Never'}
        {expired && (
          <span className="ml-2 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700">
            Expired
          </span>
        )}
      </td>
      <td className="py-3.5 pr-4">
        <button
          onClick={handleToggle}
          disabled={pending}
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase border transition-all ${
            coupon.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-cream-100 text-muted border-cream-300'
          }`}
        >
          {coupon.is_active ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td className="py-3.5 pr-2 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/settings/coupons/${coupon.id}/edit`}
            className="rounded-lg p-2 text-muted hover:text-brand-600 hover:bg-brand-500/10 transition-all"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className={`rounded-lg p-2 transition-all ${
              confirming ? 'text-red-600 bg-red-50' : 'text-muted hover:text-red-500 hover:bg-red-50'
            }`}
            title={confirming ? 'Click again to confirm' : 'Delete'}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
