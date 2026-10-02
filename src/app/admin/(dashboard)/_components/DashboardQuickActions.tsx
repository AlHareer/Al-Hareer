import Link from 'next/link';
import {
  Plus,
  ShoppingCart,
  Star,
  MessageSquare,
  Tag,
  Truck,
  LayoutTemplate,
  Settings,
  ArrowUpRight,
} from 'lucide-react';

interface DashboardQuickActionsProps {
  processingOrders: number;
  pendingReviews: number;
  unresolvedInquiries: number;
}

export default function DashboardQuickActions({
  processingOrders,
  pendingReviews,
  unresolvedInquiries,
}: DashboardQuickActionsProps) {
  const actions = [
    {
      title: 'Add Product',
      desc: 'Create a new product',
      href: '/admin/products/new',
      icon: Plus,
      color: 'bg-brand-500 text-white',
      badge: null,
    },
    {
      title: 'Orders',
      desc: 'View & update orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-700 border border-blue-200',
      badge: processingOrders > 0 ? `${processingOrders}` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      title: 'Reviews',
      desc: 'Approve reviews',
      href: '/admin/reviews',
      icon: Star,
      color: 'bg-gold-light/40 text-gold-dark border border-gold/30',
      badge: pendingReviews > 0 ? `${pendingReviews}` : null,
      badgeColor: 'bg-gold-light text-gold-dark border-gold/40',
    },
    {
      title: 'Inquiries',
      desc: 'Customer questions',
      href: '/admin/inquiries',
      icon: MessageSquare,
      color: 'bg-cream-100 text-brand-700 border border-cream-300',
      badge: unresolvedInquiries > 0 ? `${unresolvedInquiries}` : null,
      badgeColor: 'bg-red-100 text-red-700 border-red-200',
    },
    {
      title: 'Coupons',
      desc: 'Discount codes',
      href: '/admin/settings/coupons',
      icon: Tag,
      color: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      badge: null,
    },
    {
      title: 'Shipping',
      desc: 'Delivery & COD rates',
      href: '/admin/settings/shipping',
      icon: Truck,
      color: 'bg-purple-50 text-purple-700 border border-purple-200',
      badge: null,
    },
    {
      title: 'Hero Banners',
      desc: 'Homepage slides',
      href: '/admin/hero-slides',
      icon: LayoutTemplate,
      color: 'bg-cream-100 text-brand-700 border border-cream-300',
      badge: null,
    },
    {
      title: 'Settings',
      desc: 'Store settings',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-cream-100 text-brand-700 border border-cream-300',
      badge: null,
    },
  ];

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div>
          <h2 className="font-heading text-base font-bold text-brand-700">Quick Actions</h2>
          <p className="text-xs text-muted mt-0.5">Shortcuts to manage your store.</p>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-2 sm:gap-2.5">
        {actions.map((act) => (
          <Link
            key={act.title}
            href={act.href}
            className="group relative flex flex-col justify-between rounded-xl border border-cream-200 bg-cream-50/50 p-2.5 sm:p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-white hover:shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg ${act.color} shrink-0`}>
                <act.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>

            <div className="mt-2.5 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="font-heading text-xs font-bold text-brand-700 group-hover:text-brand-500 transition-colors truncate">
                  {act.title}
                </p>
                {act.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase border shrink-0 ${act.badgeColor}`}
                  >
                    {act.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted truncate mt-0.5">{act.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
