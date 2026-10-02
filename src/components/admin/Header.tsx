'use client';

import Link from 'next/link';
import { Menu, ExternalLink, LogOut } from 'lucide-react';
import { useAdminSidebar } from '@/context/AdminSidebarContext';
import { adminLogout } from '@/actions/auth';

export default function AdminHeader({ adminName }: { adminName?: string }) {
  const { setMobileOpen } = useAdminSidebar();
  const initial = (adminName || 'A').trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-cream-300 bg-white/90 px-4 backdrop-blur-md md:px-6">
      <button onClick={() => setMobileOpen(true)} className="p-1.5 text-muted hover:text-brand-700 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-brand-700 font-semibold">
          Welcome back, <span className="font-semibold text-brand-500">{adminName || 'Admin'}</span>
        </p>
        <p className="text-xs text-muted mt-0.5">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded-full border border-cream-300 bg-cream-100 px-4 py-1.5 text-xs font-semibold text-muted transition-all hover:border-brand-300 hover:text-brand-600 sm:flex"
        >
          View Store <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="h-8 w-px bg-cream-300 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
            {initial}
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100"
            >
              <LogOut className="h-3.5 w-3.5" /> Log Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
