import Link from 'next/link';
import {
  Building2,
  User,
  Truck,
  Ticket,
  Layers,
} from 'lucide-react';

export const SETTINGS_TABS = [
  { label: 'Store Identity', href: '/admin/settings', icon: Building2, id: 'identity' },
  { label: 'Admin Profile', href: '/admin/settings/profile', icon: User, id: 'profile' },
  { label: 'Shipping Rules', href: '/admin/settings/shipping', icon: Truck, id: 'shipping' },
  { label: 'Coupons & Promos', href: '/admin/settings/coupons', icon: Ticket, id: 'coupons' },
  { label: 'Quantity Discounts', href: '/admin/settings/quantity-discount', icon: Layers, id: 'quantity' },
];

export default function SettingsNavTabs({ currentTab }: { currentTab: 'identity' | 'profile' | 'shipping' | 'coupons' | 'quantity' }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon;
        const isCurrent = tab.id === currentTab;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`group flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isCurrent
                ? 'bg-brand-500 text-white shadow-luxury ring-1 ring-brand-600/30 font-bold'
                : 'border border-cream-300/80 bg-white text-brand-700 hover:bg-cream-50/80 hover:border-brand-300 shadow-2xs'
            }`}
          >
            <Icon
              className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                isCurrent ? 'text-gold' : 'text-muted group-hover:text-brand-600'
              }`}
            />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
