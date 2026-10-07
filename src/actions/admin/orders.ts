'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { ORDER_STATUSES } from '@/lib/orderConstants';

export type OrderListItem = {
  id: string;
  order_number: string;
  guest_email: string | null;
  guest_phone: string | null;
  total_amount: number;
  order_status: string;
  payment_status: string;
  payment_method: string | null;
  tracking_number: string | null;
  courier_name: string | null;
  created_at: string;
  user_id: string | null;
  item_count: number;
  profiles: { full_name: string | null; email: string; phone?: string | null } | null;
};

export async function getAllOrdersAdmin(): Promise<OrderListItem[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('orders')
    .select(
      'id, order_number, guest_email, guest_phone, total_amount, order_status, payment_status, payment_method, tracking_number, courier_name, created_at, user_id, profiles ( full_name, email, phone ), order_items ( id )'
    )
    .order('created_at', { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data || []) as any[]).map((o) => ({
    id: o.id,
    order_number: o.order_number,
    guest_email: o.guest_email,
    guest_phone: o.guest_phone,
    total_amount: Number(o.total_amount),
    order_status: o.order_status,
    payment_status: o.payment_status,
    payment_method: o.payment_method,
    tracking_number: o.tracking_number,
    courier_name: o.courier_name,
    created_at: o.created_at,
    user_id: o.user_id,
    item_count: Array.isArray(o.order_items) ? o.order_items.length : 0,
    profiles: o.profiles || null,
  }));
}

export type DeleteOrderResult = { success: boolean; error?: string };

// Permanently removes an order (order_items cascade-deletes with it — see
// db/schema.sql). Does not restore any stock that was decremented when the
// order was placed; that's a deliberate admin call, not automatic.
export async function deleteOrder(orderId: string): Promise<DeleteOrderResult> {
  const supabase = createAdminClient();
  if (!orderId) return { success: false, error: 'Invalid order id.' };

  const { error } = await supabase.from('orders').delete().eq('id', orderId);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  return { success: true };
}

export async function quickUpdateOrderStatus(
  orderId: string,
  orderStatus: (typeof ORDER_STATUSES)[number]
): Promise<UpdateOrderStatusResult> {
  const supabase = createAdminClient();
  if (!orderId || !ORDER_STATUSES.includes(orderStatus)) {
    return { success: false, error: 'Invalid order status.' };
  }

  const { error } = await supabase
    .from('orders')
    .update({
      order_status: orderStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin');
  return { success: true };
}

export type OrderDetail = {
  id: string;
  order_number: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  coupon_discount: number;
  quantity_discount: number;
  coupon_code: string | null;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  tracking_number: string | null;
  tracking_url: string | null;
  courier_name: string | null;
  created_at: string;
  guest_email: string | null;
  guest_phone: string | null;
  user_id: string | null;
  profiles: { full_name: string | null; email: string; phone: string | null } | null;
  addresses: {
    full_name: string;
    phone: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  } | null;
  order_items: {
    id: string;
    product_id?: string | null;
    product_name: string;
    variant_name: string | null;
    color?: string | null;
    color_hex: string | null;
    image_url?: string | null;
    price_at_purchase: number;
    quantity: number;
    line_total: number;
  }[];
};

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('orders')
    .select(
      `
      id, order_number, subtotal, shipping_cost, discount_amount, coupon_discount, quantity_discount, coupon_code, total_amount,
      payment_method, payment_status, order_status, tracking_number, tracking_url, courier_name, created_at,
      guest_email, guest_phone, user_id,
      profiles ( full_name, email, phone ),
      addresses ( full_name, phone, address_line_1, address_line_2, city, state, postal_code, country ),
      order_items ( id, product_id, product_name, variant_name, color, color_hex, image_url, price_at_purchase, quantity, line_total )
    `
    )
    .eq('id', id)
    .maybeSingle();

  return data as unknown as OrderDetail | null;
}

export type UpdateOrderStatusResult = { success: boolean; error?: string };

export async function updateOrderStatus(
  orderId: string,
  formData: FormData
): Promise<UpdateOrderStatusResult> {
  const supabase = createAdminClient();
  const orderStatus = formData.get('order_status') as string;
  const trackingNumber = ((formData.get('tracking_number') as string) || '').trim() || null;
  const trackingUrl = ((formData.get('tracking_url') as string) || '').trim() || null;
  const courierName = ((formData.get('courier_name') as string) || '').trim() || null;

  if (!orderId || !ORDER_STATUSES.includes(orderStatus as (typeof ORDER_STATUSES)[number])) {
    return { success: false, error: 'Invalid order status.' };
  }

  const { error } = await supabase
    .from('orders')
    .update({
      order_status: orderStatus,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      courier_name: courierName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
