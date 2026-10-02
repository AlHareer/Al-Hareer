'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { CartItem } from '@/types';

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

// Guest checkout, COD-only (no payment gateway configured for this phase — see
// project plan). Writes a real order into Supabase so the admin dashboard can
// manage it; best-effort stock decrement (not transactional/race-safe, fine at
// this scale).
export async function placeOrder(input: PlaceOrderInput): Promise<{ orderId: string; orderNumber: string }> {
  const supabase = createAdminClient();

  const orderNumber = `AH-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  const { data: address, error: addrErr } = await supabase
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
      .select('id')
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
      image_url: matchedColor?.image || item.product.image || null,
      price_at_purchase: item.product.price,
      quantity: item.quantity,
      line_total: item.product.price * item.quantity,
    });
  }

  const { error: itemsErr } = await supabase.from('order_items').insert(itemRows);
  if (itemsErr) throw itemsErr;

  return { orderId: order.id, orderNumber: order.order_number };
}
