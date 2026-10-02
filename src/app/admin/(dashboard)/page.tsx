import { cookies } from 'next/headers';
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from '@/lib/adminSession';
import { getDashboardStats } from '@/actions/admin/dashboard';
import DashboardHero from './_components/DashboardHero';
import DashboardAlerts from './_components/DashboardAlerts';
import DashboardKpiCards from './_components/DashboardKpiCards';
import DashboardSalesChart from './_components/DashboardSalesChart';
import DashboardRecentOrders from './_components/DashboardRecentOrders';
import DashboardQuickActions from './_components/DashboardQuickActions';
import DashboardOrderStatus from './_components/DashboardOrderStatus';
import DashboardLowStock from './_components/DashboardLowStock';
import DashboardCustomerEngagement from './_components/DashboardCustomerEngagement';

export const metadata = { title: 'Dashboard — Al Hareer' };

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  const adminName = session?.email ? session.email.split('@')[0] : 'Admin';

  const data = await getDashboardStats();

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* 1. Hero & Store Status */}
      <DashboardHero
        adminName={adminName}
        totalProducts={data.stats.totalProducts}
        totalOrders={data.stats.totalOrders}
      />

      {/* 2. Action Alerts Bar */}
      <DashboardAlerts
        processingOrders={data.stats.processingOrders}
        pendingReviews={data.stats.pendingReviewCount}
        unresolvedInquiries={data.stats.unresolvedInquiryCount}
        lowStockCount={data.stats.lowStockCount}
      />

      {/* 3. Hero Metric Cards & KPI Row */}
      <DashboardKpiCards stats={data.stats} />

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column (8 cols): Interactive Sales Analytics, Recent Orders, Category Distribution */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6 min-w-0">
          <DashboardSalesChart salesTrend={data.salesTrend} />
          <DashboardRecentOrders orders={data.recentOrders} />
        </div>

        {/* Right Column (4 cols): Quick Operations Hub, Fulfillment Pipeline, Low Stock Alerts, Customer Voice */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6 min-w-0">
          <DashboardQuickActions
            processingOrders={data.stats.processingOrders}
            pendingReviews={data.stats.pendingReviewCount}
            unresolvedInquiries={data.stats.unresolvedInquiryCount}
          />
          <DashboardOrderStatus stats={data.stats} />
          <DashboardLowStock
            lowStockItems={data.lowStockItems}
            totalCount={data.stats.lowStockCount}
          />
          <DashboardCustomerEngagement
            pendingReviews={data.pendingReviews}
            recentInquiries={data.recentInquiries}
            pendingReviewCount={data.stats.pendingReviewCount}
            unresolvedInquiryCount={data.stats.unresolvedInquiryCount}
          />
        </div>
      </div>
    </div>
  );
}
