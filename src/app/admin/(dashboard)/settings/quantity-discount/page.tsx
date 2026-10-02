import { getQuantityDiscountSettings } from '@/actions/admin/quantityDiscount';
import QuantityDiscountForm from './_components/QuantityDiscountForm';
import { ChevronRight } from 'lucide-react';

export const metadata = { title: 'Quantity Discount — Al Hareer Admin' };

export default async function AdminQuantityDiscountPage() {
  const settings = await getQuantityDiscountSettings();

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Page Header (No other settings tabs) */}
      <div className="border-b border-cream-200/80 pb-4.5">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span>Promotions</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="text-brand-500 font-semibold">Quantity Discounts</span>
        </div>
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-700 tracking-tight">
            Quantity Discounts
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Give customers an automatic discount when they buy more items in one order.
          </p>
        </div>
      </div>

      {/* Main Quantity Discount Form */}
      <QuantityDiscountForm settings={settings} />
    </div>
  );
}
