'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { VISIBLE_ORDERS_FILTER } from '@/lib/orderVisibility';

export async function getSidebarBadgeCounts() {
  const supabase = createAdminClient();

  const [{ count: newOrders }, { count: pendingReviewCount }, { count: unresolvedInquiryCount }] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('order_status', 'processing').or(VISIBLE_ORDERS_FILTER),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('is_resolved', false),
  ]);

  return {
    newOrders: newOrders || 0,
    pendingReviewCount: pendingReviewCount || 0,
    unresolvedInquiryCount: unresolvedInquiryCount || 0,
  };
}

export type DashboardStats = {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueToday: number;
  averageOrderValue: number;
  totalOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  activeProducts: number;
  totalCustomers: number;
  lowStockCount: number;
  pendingReviewCount: number;
  unresolvedInquiryCount: number;
  newsletterCount: number;
  activeCouponsCount: number;
};

export type RecentOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  item_count: number;
};

export type LowStockVariant = {
  id: string;
  variant_name: string;
  color: string | null;
  stock_quantity: number;
  price: number;
  product_name: string;
  product_slug: string;
  product_id: string;
};

export type RecentInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_resolved: boolean;
  created_at: string;
};

export type PendingReview = {
  id: string;
  reviewer_name: string | null;
  rating: number;
  review_text: string | null;
  created_at: string;
  product_name: string;
};

export type SalesTrendPoint = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
};

export type CategoryStat = {
  name: string;
  count: number;
};

export type FullDashboardData = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  lowStockCount: number;
  pendingReviewCount: number;
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockItems: LowStockVariant[];
  recentInquiries: RecentInquiry[];
  pendingReviews: PendingReview[];
  salesTrend: SalesTrendPoint[];
  categoryDistribution: CategoryStat[];
};

export async function getDashboardStats(): Promise<FullDashboardData> {
  const supabase = createAdminClient();

  const [
    productsRes,
    ordersRes,
    recentOrdersRes,
    profilesRes,
    lowStockCountRes,
    lowStockItemsRes,
    pendingReviewsCountRes,
    pendingReviewsRes,
    unresolvedInquiriesCountRes,
    recentInquiriesRes,
    categoriesRes,
    newsletterRes,
    couponsRes,
  ] = await Promise.all([
    supabase.from('products').select('id, is_active, category_id'),
    supabase.from('orders').select('id, total_amount, order_status, created_at').or(VISIBLE_ORDERS_FILTER),
    supabase
      .from('orders')
      .select('id, order_number, total_amount, order_status, payment_status, created_at, guest_email, user_id, profiles(full_name, email), order_items(id, quantity)')
      .or(VISIBLE_ORDERS_FILTER)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('product_variants').select('id', { count: 'exact', head: true }).lte('stock_quantity', 5),
    supabase
      .from('product_variants')
      .select('id, product_id, variant_name, color, stock_quantity, price, products(id, name, slug)')
      .lte('stock_quantity', 5)
      .order('stock_quantity', { ascending: true })
      .limit(6),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
    supabase
      .from('reviews')
      .select('id, reviewer_name, rating, review_text, created_at, products(name, slug)')
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('is_resolved', false),
    supabase
      .from('inquiries')
      .select('id, name, email, phone, message, is_resolved, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('categories').select('id, name, slug').eq('is_active', true),
    supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
    supabase.from('coupons').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ]);

  const orders = ordersRes.data || [];
  const nonCancelledOrders = orders.filter((o) => o.order_status !== 'cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0);
  const totalOrders = orders.length;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayStr = now.toISOString().slice(0, 10);

  let revenueThisMonth = 0;
  let revenueToday = 0;
  let processingOrders = 0;
  let shippedOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;

  for (const o of orders) {
    const oDate = new Date(o.created_at);
    const amount = Number(o.total_amount ?? 0);
    const isCancelled = o.order_status === 'cancelled';

    if (o.order_status === 'processing') processingOrders++;
    else if (o.order_status === 'shipped') shippedOrders++;
    else if (o.order_status === 'delivered') deliveredOrders++;
    else if (o.order_status === 'cancelled') cancelledOrders++;

    if (!isCancelled) {
      if (oDate.getFullYear() === currentYear && oDate.getMonth() === currentMonth) {
        revenueThisMonth += amount;
      }
      if ((o.created_at || '').slice(0, 10) === todayStr) {
        revenueToday += amount;
      }
    }
  }

  const validOrderCount = nonCancelledOrders.length;
  const averageOrderValue = validOrderCount > 0 ? Math.round(totalRevenue / validOrderCount) : 0;

  // Generate 7-day trend
  const trend: SalesTrendPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });

    const dayOrders = orders.filter((o) => (o.created_at || '').slice(0, 10) === dateStr);
    const dayRev = dayOrders
      .filter((o) => o.order_status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    trend.push({
      date: dateStr,
      label,
      revenue: dayRev,
      orders: dayOrders.length,
    });
  }

  // Format recent orders
  const recentOrders: RecentOrder[] = (recentOrdersRes.data || []).map((o: any) => {
    const profile = Array.isArray(o.profiles) ? o.profiles[0] : o.profiles;
    const customer_name = profile?.full_name || (o.guest_email ? o.guest_email.split('@')[0] : 'Guest Customer');
    const customer_email = profile?.email || o.guest_email || 'No email';
    const items = o.order_items || [];
    const item_count = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);

    return {
      id: o.id,
      order_number: o.order_number,
      customer_name,
      customer_email,
      total_amount: Number(o.total_amount || 0),
      order_status: o.order_status || 'processing',
      payment_status: o.payment_status || 'pending',
      created_at: o.created_at,
      item_count,
    };
  });

  // Format low stock variants
  const lowStockItems: LowStockVariant[] = (lowStockItemsRes.data || []).map((v: any) => {
    const prod = Array.isArray(v.products) ? v.products[0] : v.products;
    return {
      id: v.id,
      variant_name: v.variant_name || 'Standard',
      color: v.color || null,
      stock_quantity: v.stock_quantity ?? 0,
      price: Number(v.price || 0),
      product_name: prod?.name || 'Product',
      product_slug: prod?.slug || '',
      product_id: v.product_id,
    };
  });

  // Format pending reviews
  const pendingReviews: PendingReview[] = (pendingReviewsRes.data || []).map((r: any) => {
    const prod = Array.isArray(r.products) ? r.products[0] : r.products;
    return {
      id: r.id,
      reviewer_name: r.reviewer_name || 'Customer',
      rating: r.rating || 5,
      review_text: r.review_text || null,
      created_at: r.created_at,
      product_name: prod?.name || 'Product',
    };
  });

  // Format recent inquiries
  const recentInquiries: RecentInquiry[] = (recentInquiriesRes.data || []).map((inq: any) => ({
    id: inq.id,
    name: inq.name || 'Anonymous',
    email: inq.email || '',
    phone: inq.phone || null,
    message: inq.message || '',
    is_resolved: inq.is_resolved || false,
    created_at: inq.created_at,
  }));

  // Categories distribution
  const categoryCountMap = new Map<string, number>();
  (productsRes.data || []).forEach((p: any) => {
    if (p.category_id) {
      categoryCountMap.set(p.category_id, (categoryCountMap.get(p.category_id) || 0) + 1);
    }
  });

  const categoryDistribution: CategoryStat[] = (categoriesRes.data || []).map((c: any) => ({
    name: c.name,
    count: categoryCountMap.get(c.id) || 0,
  }));

  const products = productsRes.data || [];
  const activeProducts = products.filter((p) => p.is_active).length;

  const stats: DashboardStats = {
    totalRevenue,
    revenueThisMonth,
    revenueToday,
    averageOrderValue,
    totalOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalProducts: products.length,
    activeProducts,
    totalCustomers: profilesRes.count || 0,
    lowStockCount: lowStockCountRes.count || 0,
    pendingReviewCount: pendingReviewsCountRes.count || 0,
    unresolvedInquiryCount: unresolvedInquiriesCountRes.count || 0,
    newsletterCount: newsletterRes.count || 0,
    activeCouponsCount: couponsRes.count || 0,
  };

  return {
    totalProducts: products.length,
    totalOrders,
    totalCustomers: profilesRes.count || 0,
    totalRevenue,
    lowStockCount: lowStockCountRes.count || 0,
    pendingReviewCount: pendingReviewsCountRes.count || 0,
    stats,
    recentOrders,
    lowStockItems,
    recentInquiries,
    pendingReviews,
    salesTrend: trend,
    categoryDistribution,
  };
}
