import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from '@/lib/adminSession';
import { AdminSidebarProvider } from '@/context/AdminSidebarContext';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';

export const metadata: Metadata = { title: { template: '%s — Al Hareer Admin', default: 'Admin Dashboard' } };

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Identity is already verified by middleware for every route under this layout.
  const cookieStore = await cookies();
  const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  const adminName = session?.email ?? 'Admin';

  return (
    <AdminSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-cream-100 print:h-auto print:overflow-visible print:bg-white">
        <div className="print:hidden">
          <AdminSidebar adminName={adminName} />
        </div>
        <div className="flex h-screen flex-1 flex-col overflow-hidden print:h-auto print:overflow-visible print:block">
          <div className="print:hidden">
            <AdminHeader adminName={adminName} />
          </div>
          <main className="relative flex-1 overflow-y-auto px-3.5 py-4 sm:p-6 md:p-8 print:p-0 print:overflow-visible print:static">
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
