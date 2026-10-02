import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getCouponById } from '@/actions/admin/coupons';
import CouponForm from '../../_components/CouponForm';

export const metadata = { title: 'Edit Coupon — Al Hareer Admin' };

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await getCouponById(id);
  if (!coupon) notFound();

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Header & Breadcrumbs */}
      <div className="border-b border-cream-200/80 pb-4.5">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <Link href="/admin/settings/coupons" className="hover:text-brand-700 transition-colors">
            Coupons
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="font-mono font-bold text-brand-500">
            {coupon.code}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-700 tracking-tight">
              Edit Coupon: <span className="font-mono text-brand-600">{coupon.code}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Modify discount parameters, minimum cart value, expiry deadline, or status.
            </p>
          </div>
          <Link
            href="/admin/settings/coupons"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-white border border-cream-300 hover:border-gold/60 hover:bg-cream-50 shadow-xs transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Coupons</span>
          </Link>
        </div>
      </div>

      {/* Form */}
      <CouponForm coupon={coupon} />
    </div>
  );
}
