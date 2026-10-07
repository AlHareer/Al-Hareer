'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import type { CartItem } from '@/types';
import { getVariantImage } from '@/lib/products';

let razorpayInstance: any = null
try {
  if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
} catch {
  console.warn('[Razorpay]: Credentials missing or invalid')
}

export type PaymentSettings = { codEnabled: boolean; razorpayEnabled: boolean };

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['cod_enabled', 'razorpay_enabled']);

  const map = new Map((data ?? []).map((r) => [r.key, r.value]));
  return {
    codEnabled: map.get('cod_enabled') !== 'false',
    razorpayEnabled: map.get('razorpay_enabled') !== 'false',
  };
}

export type CouponResult =
  | { valid: true; discount: number; displayMsg: string }
  | { valid: false; message: string };

export async function validateCoupon(code: string, subtotal: number): Promise<CouponResult> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (!data) return { valid: false, message: 'Invalid or inactive coupon code.' };

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, message: 'This coupon has expired.' };
  }

  if (subtotal < data.min_purchase) {
    return { valid: false, message: `Minimum order of ₹${data.min_purchase.toLocaleString('en-IN')} required for this coupon.` };
  }

  const discount =
    data.type === 'percent'
      ? Math.round(subtotal * (data.value / 100))
      : Math.min(data.value, subtotal);

  const displayMsg =
    data.type === 'percent'
      ? `🎉 ${data.value}% discount applied! You save ₹${discount.toLocaleString('en-IN')}`
      : `🎉 ₹${data.value} discount applied!`;

  return { valid: true, discount, displayMsg };
}

export type PlaceOrderInput = {
  cart: CartItem[];
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  paymentMethod?: 'online' | 'cod';
  // Set when the customer is signed in, so the order/address are attached to
  // their real account (order history) instead of being guest-only.
  userId?: string;
};

export type PlaceOrderResult =
  | { isRazorpay: false; orderId: string; orderNumber: string }
  | { isRazorpay: true; razorpayOrderId: string; orderId: string; orderNumber: string; amount: number }

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const supabase = createAdminClient();

  // Server-side guard: a disabled payment method can't be forced via a tampered request.
  const { codEnabled, razorpayEnabled } = await getPaymentSettings();
  if (input.paymentMethod === 'online' && !razorpayEnabled) {
    throw new Error('Online payment is currently unavailable. Please choose Cash on Delivery.');
  }
  if (input.paymentMethod !== 'online' && !codEnabled) {
    throw new Error('Cash on Delivery is currently unavailable. Please choose online payment.');
  }

  const orderNumber = `AH-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  // A signed-in customer re-ordering to an address already on file reuses it
  // instead of piling up a duplicate saved address on every order.
  let existingAddressId: string | null = null;
  if (input.userId) {
    const { data: existing } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', input.userId)
      .eq('postal_code', input.pinCode)
      .eq('city', input.city)
      .eq('address_line_1', input.address)
      .limit(1)
      .maybeSingle();
    existingAddressId = existing?.id ?? null;
  }

  const { data: address, error: addrErr } = existingAddressId
    ? { data: { id: existingAddressId }, error: null }
    : await supabase
    .from('addresses')
    .insert({
      user_id: input.userId ?? null,
      full_name: input.fullName,
      phone: input.phone,
      address_line_1: input.address,
      city: input.city,
      state: input.state,
      postal_code: input.pinCode,
    })
    .select('id')
    .single();
  if (addrErr) throw addrErr;

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: input.userId ?? null,
      guest_email: input.email,
      guest_phone: input.phone,
      address_id: address.id,
      subtotal: input.subtotal,
      shipping_cost: input.shippingCost,
      discount_amount: input.discountAmount,
      coupon_code: input.couponCode || null,
      total_amount: input.total,
      payment_method: input.paymentMethod === 'online' ? 'Online Payment' : 'COD',
      payment_status: 'pending',
      order_status: 'processing',
    })
    .select('id, order_number')
    .single();
  if (orderErr) throw orderErr;

  const itemRows = [];
  for (const item of input.cart) {
    const { data: product } = await supabase
      .from('products')
      .select('id, featured_image_url')
      .eq('slug', item.product.id)
      .maybeSingle();

    let variantId: string | null = null;
    if (product) {
      // Prefer exact color+size match; fall back to size-only (single-color products)
      let variantRow: { id: string; stock_quantity: number } | null = null;
      if (item.selectedColor) {
        const { data } = await supabase
          .from('product_variants')
          .select('id, stock_quantity')
          .eq('product_id', product.id)
          .eq('variant_name', item.selectedSize)
          .eq('color', item.selectedColor)
          .maybeSingle();
        variantRow = data ?? null;
      }
      if (!variantRow) {
        const { data } = await supabase
          .from('product_variants')
          .select('id, stock_quantity')
          .eq('product_id', product.id)
          .eq('variant_name', item.selectedSize)
          .maybeSingle();
        variantRow = data ?? null;
      }
      if (variantRow) {
        variantId = variantRow.id;
        await supabase
          .from('product_variants')
          .update({ stock_quantity: Math.max(0, variantRow.stock_quantity - item.quantity) })
          .eq('id', variantRow.id);
      }
    }

    const matchedColor = item.product.colors.find((c) => c.name === item.selectedColor);
    itemRows.push({
      order_id: order.id,
      product_id: product?.id ?? null,
      variant_id: variantId,
      product_name: item.product.name,
      variant_name: item.selectedSize,
      color: item.selectedColor || null,
      color_hex: matchedColor?.hex ?? null,
      image_url:
        getVariantImage(item.product, item.selectedSize, item.selectedColor) ||
        product?.featured_image_url ||
        null,
      price_at_purchase: item.product.price,
      quantity: item.quantity,
      line_total: item.product.price * item.quantity,
    });
  }

  const { error: itemsErr } = await supabase.from('order_items').insert(itemRows);
  if (itemsErr) throw itemsErr;

  if (input.paymentMethod === 'online') {
    if (!razorpayInstance) throw new Error('Razorpay is not configured on the server.')
    const rzpOrder = await razorpayInstance.orders.create({
      amount: Math.round(input.total * 100),
      currency: 'INR',
      receipt: order.id,
      payment_capture: 1,
      notes: { internal_order_id: order.id },
    })
    return { isRazorpay: true, razorpayOrderId: rzpOrder.id, orderId: order.id, orderNumber: order.order_number, amount: Math.round(input.total * 100) }
  }

  return { isRazorpay: false, orderId: order.id, orderNumber: order.order_number };
}

export async function verifyRazorpayPayment(
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string,
  internal_order_id: string
): Promise<{ success: boolean; error?: string }> {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return { success: false, error: 'Razorpay secret not configured' }

  const generated = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (generated !== razorpay_signature) {
    return { success: false, error: 'Payment verification failed: invalid signature' }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: 'paid' })
    .eq('id', internal_order_id)

  if (error) return { success: false, error: 'Failed to update order status' }
  return { success: true }
}

export async function cancelPendingOrder(orderId: string, razorpayOrderId?: string): Promise<void> {
  if (!orderId) return
  try {
    const supabase = createAdminClient()
    const { data: order } = await supabase
      .from('orders')
      .select('id, payment_status')
      .eq('id', orderId)
      .maybeSingle()

    if (!order || order.payment_status !== 'pending') return

    if (razorpayOrderId && razorpayInstance) {
      try {
        const rzpOrder = await razorpayInstance.orders.fetch(razorpayOrderId)
        if (rzpOrder.status === 'paid') return
      } catch {
        // Can't confirm status — leave order as pending rather than risk cancelling a paid order
        return
      }
    }

    await supabase
      .from('orders')
      .update({ order_status: 'cancelled' })
      .eq('id', orderId)
      .eq('payment_status', 'pending')
  } catch (e) {
    console.warn('[Razorpay]: Failed to cancel pending order:', e)
  }
}
