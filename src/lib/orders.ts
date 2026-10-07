import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { Order, OrderItem, OrderShippingAddress } from '@/app/account/page';

function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: 'Cash on Delivery',
};

type AddressRow = {
  id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
};

function mapAddress(row: AddressRow): OrderShippingAddress {
  return {
    fullName: row.full_name,
    phone: row.phone,
    address: row.address_line_1,
    city: row.city,
    state: row.state,
    pinCode: row.postal_code,
  };
}

// Reads the CURRENT signed-in user's own orders — relies on the `own_rows`
// RLS policy (db/schema.sql) restricting this to rows where orders.user_id =
// auth.uid(), so this is safe to call with the anon-key browser client.
export async function getOrdersForUser(): Promise<Order[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('orders')
    .select(
      `id, order_number, total_amount, order_status, payment_method, created_at, updated_at, tracking_number, tracking_url, courier_name,
       addresses ( id, full_name, phone, address_line_1, city, state, postal_code, is_default ),
       order_items ( product_name, variant_name, color, image_url, price_at_purchase, quantity )`
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => {
    const items: OrderItem[] = (row.order_items ?? []).map((it: any) => ({
      name: it.product_name,
      size: it.variant_name ?? undefined,
      color: it.color ?? undefined,
      qty: it.quantity,
      price: it.price_at_purchase,
      image: it.image_url ?? undefined,
    }));
    const address = Array.isArray(row.addresses) ? row.addresses[0] : row.addresses;
    const primaryItem = items[0];

    const order: Order = {
      id: row.order_number,
      productName: primaryItem?.name ?? 'Order',
      productImage: primaryItem?.image ?? '/images/your-image-19.jpg',
      date: formatOrderDate(row.created_at),
      status: capitalize(row.order_status),
      total: Number(row.total_amount),
      itemsCount: items.reduce((sum, it) => sum + (it.qty ?? 0), 0),
      items,
      shippingAddress: address
        ? mapAddress(address)
        : { fullName: '', phone: '', address: '', city: '', state: '', pinCode: '' },
      paymentMethod: PAYMENT_METHOD_LABELS[row.payment_method] ?? row.payment_method,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      courierName: row.courier_name ?? undefined,
      trackingNumber: row.tracking_number ?? undefined,
      trackingUrl: row.tracking_url ?? undefined,
    };
    return order;
  });
}

export type SavedAddress = {
  id: string;
  name: string;
  phone: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
  type: string;
};

export async function getAddressesForUser(): Promise<SavedAddress[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('addresses')
    .select('id, full_name, phone, address_line_1, address_line_2, city, state, postal_code, address_type, is_default')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.full_name,
    phone: row.phone,
    address: row.address_line_1,
    addressLine2: row.address_line_2 ?? undefined,
    city: row.city,
    state: row.state,
    pinCode: row.postal_code,
    isDefault: row.is_default,
    type: row.address_type || 'Home',
  }));
}
