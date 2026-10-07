'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  Mail,
  LayoutTemplate,
  Info,
  BookOpen,
  Quote,
  Megaphone,
  HelpCircle,
  Tag,
  Truck,
  Layers,
  UserCog,
  Settings,
  X,
  LogOut,
} from 'lucide-react';
import { useAdminSidebar } from '@/context/AdminSidebarContext';
import { adminLogout } from '@/actions/auth';
import { getSidebarBadgeCounts } from '@/actions/admin/dashboard';

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Products', href: '/admin/products', icon: Package },
    ],
  },
  {
    title: 'Sales',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Reviews', href: '/admin/reviews', icon: Star },
      { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
      { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Home Customization', href: '/admin/hero-slides', icon: LayoutTemplate },
      { label: 'About Page', href: '/admin/about', icon: Info },
      { label: 'Story Page', href: '/admin/story', icon: BookOpen },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
      { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
      { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Site Settings', href: '/admin/settings', icon: Settings },
      { label: 'Coupons', href: '/admin/settings/coupons', icon: Tag },
      { label: 'Shipping Settings', href: '/admin/settings/shipping', icon: Truck },
      { label: 'Quantity Discount', href: '/admin/settings/quantity-discount', icon: Layers },
      { label: 'My Profile', href: '/admin/settings/profile', icon: UserCog },
    ],
  },
];

export default function AdminSidebar({ adminName = 'Admin' }: { adminName?: string }) {
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useAdminSidebar();
  const initial = adminName.trim().charAt(0).toUpperCase();

  const [badges, setBadges] = useState<Record<string, number>>({});
  useEffect(() => {
    let cancelled = false;
    getSidebarBadgeCounts().then((counts) => {
      if (cancelled) return;
      setBadges({
        '/admin/reviews': counts.pendingReviewCount,
        '/admin/inquiries': counts.unresolvedInquiryCount,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#00303A]/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-cream-300 bg-white/95 backdrop-blur-md transition-transform duration-300 lg:static lg:h-screen lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-cream-300 px-5">
          <div className="relative flex-1 overflow-hidden">
            <p className="truncate font-heading text-base font-semibold tracking-wider text-brand-700">Al Hareer</p>
            <p className="truncate text-[11px] uppercase tracking-[0.2em] text-brand-400 font-bold">Admin Panel</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="relative p-1 text-muted hover:text-brand-700 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-light">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === '/admin' || item.href === '/admin/settings'
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  const badgeCount = badges[item.href];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group relative flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-semibold tracking-wide transition-all ${active
                          ? 'border-brand-500 bg-brand-500/10 text-brand-700'
                          : 'border-transparent text-brand-700/70 hover:border-brand-300 hover:bg-cream-100 hover:text-brand-700'
                        }`}
                    >
                      <item.icon className={`h-4 w-4 shrink-0 ${active ? 'text-brand-500' : 'text-muted group-hover:text-brand-500'}`} />
                      <span className="flex-1">{item.label}</span>
                      {!!badgeCount && (
                        <span
                          className={`flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full px-1 text-[10px] font-bold ${active ? 'bg-brand-500/20 text-brand-700' : 'bg-[#F6F1EC] text-[#024F5F] group-hover:bg-[#F6F1EC]'
                            }`}
                        >
                          {badgeCount > 99 ? '99+' : badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-cream-300 bg-cream-50 p-3">
          <div className="flex items-center gap-3 rounded-xl border border-cream-300 bg-white p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CFAC64] text-sm font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-700">{adminName}</p>
              <p className="truncate text-[10px] uppercase tracking-widest text-muted-light font-semibold">Administrator</p>
            </div>
            <form action={adminLogout}>
              <button
                type="submit"
                title="Log out"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#CFAC64] bg-[#F6F1EC] text-[#024F5F] transition-all hover:bg-[#F6F1EC]"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
