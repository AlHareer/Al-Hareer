'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { VISIBLE_ORDERS_FILTER } from '@/lib/orderVisibility';
import { revalidatePath } from 'next/cache';

export type AdminUserItem = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  orderCount: number;
  totalSpend: number;
  lastOrderDate: string | null;
  averageOrderValue: number;
};

export async function getAllUsers(): Promise<AdminUserItem[]> {
  const supabase = createAdminClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, is_active, created_at')
    .order('created_at', { ascending: false });

  if (!profiles || profiles.length === 0) return [];

  const { data: orders } = await supabase
    .from('orders')
    .select('id, user_id, total_amount, order_number, created_at, order_status')
    .or(VISIBLE_ORDERS_FILTER)
    .order('created_at', { ascending: false });

  return profiles.map((p) => {
    const userOrders = (orders || []).filter((o) => o.user_id === p.id);
    const nonCancelled = userOrders.filter((o) => o.order_status !== 'cancelled');
    const totalSpend = nonCancelled.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const orderCount = userOrders.length;
    const lastOrderDate = userOrders.length > 0 ? userOrders[0].created_at : null;
    const averageOrderValue = orderCount > 0 ? Math.round(totalSpend / orderCount) : 0;

    return {
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      phone: p.phone,
      role: p.role || 'customer',
      is_active: p.is_active !== false,
      created_at: p.created_at,
      orderCount,
      totalSpend,
      lastOrderDate,
      averageOrderValue,
    };
  });
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/users');
  return { success: true };
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('profiles').update({ is_active: isActive }).eq('id', userId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/users');
  return { success: true };
}
