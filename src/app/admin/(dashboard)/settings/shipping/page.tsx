import { getShippingSettings } from '@/actions/admin/shipping';
import ShippingForm from './_components/ShippingForm';
import { ChevronRight } from 'lucide-react';

export const metadata = { title: 'Shipping & Delivery Rules — Al Hareer Admin' };

export default async function AdminShippingPage() {
  const shipping = await getShippingSettings();

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Page Header (No other tabs) */}
      <div className="border-b border-cream-200/80 pb-4.5">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span>Operations</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="text-brand-500 font-semibold">Shipping Rules</span>
        </div>
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-700 tracking-tight">
            Shipping &amp; Delivery Rules
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Configure courier delivery fees, free delivery order threshold, and Cash on Delivery charges.
          </p>
        </div>
      </div>

      {/* Main Shipping Form */}
      <ShippingForm shipping={shipping} />
    </div>
  );
}
