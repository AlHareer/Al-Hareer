import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  MapPin,
  Settings2,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Phone,
  Mail,
  CreditCard,
  MessageCircle,
  Calendar,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { getOrderById } from '@/actions/admin/orders';
import { getBrandSettings } from '@/actions/admin/siteBrandSettings';
import OrderStatusManager from './_components/OrderStatusManager';
import { CopyButton, PrintButton, DeleteOrderButton } from './_components/OrderActions';

export const metadata = { title: 'Order Details — Al Hareer Admin' };

const cardClass = 'rounded-2xl border border-cream-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4';

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; step: number; icon: typeof Clock }
> = {
  processing: {
    label: 'Processing',
    badgeClass: 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]/80',
    step: 2,
    icon: Clock,
  },
  shipped: {
    label: 'Shipped',
    badgeClass: 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/80',
    step: 3,
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    badgeClass: 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/80',
    step: 4,
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    badgeClass: 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/80',
    step: 0,
    icon: XCircle,
  },
};

function formatCurrency(amount: number) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

function getInitials(name?: string | null) {
  if (!name) return 'CU';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, brand] = await Promise.all([getOrderById(id), getBrandSettings()]);
  if (!order) notFound();
  const contactEmail = brand.contact_email?.value || 'contact@alhareer.com';

  const address = order.addresses;
  const customerName = order.profiles?.full_name || 'Guest Customer';
  const customerEmail = order.profiles?.email || order.guest_email;
  const customerPhone = order.profiles?.phone || order.guest_phone || address?.phone;
  const isCOD = (order.payment_method || '').toLowerCase().includes('cod');
  const statusObj = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.processing;
  const StatusIcon = statusObj.icon;
  const currentStep = statusObj.step;
  const isCancelled = order.order_status === 'cancelled';

  const rawPhone = customerPhone ? customerPhone.replace(/[^0-9]/g, '') : '';
  const whatsappNumber = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

  // Format full address for 1-click clipboard copy
  const fullAddressText = address
    ? [
        address.full_name,
        `Phone: ${address.phone}`,
        address.address_line_1,
        address.address_line_2,
        `${address.city}, ${address.state} - ${address.postal_code}`,
        address.country || 'India',
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  const orderDateFormatted = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. SCREEN VIEW (Hidden during Print)                                      */}
      {/* ========================================================================= */}
      <div className="space-y-6 pb-12 w-full max-w-full print:hidden">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200/80 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 bg-white text-muted hover:border-brand-400 hover:text-brand-600 transition-colors shadow-2xs shrink-0"
              title="Back to Orders"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Link href="/admin/orders" className="hover:text-brand-700 transition-colors">
                  Orders
                </Link>
                <span>/</span>
                <span className="font-semibold text-brand-700">{order.order_number}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700">
                  {order.order_number}
                </h1>
                <CopyButton
                  text={order.order_number}
                  label="Copy"
                  className="rounded-lg border border-cream-200 bg-cream-50 px-2 py-0.5 text-muted hover:text-brand-700 hover:bg-cream-100"
                />
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${statusObj.badgeClass}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  <span>{statusObj.label}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted mr-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{orderDateFormatted}</span>
            </div>

            <PrintButton />
            <DeleteOrderButton orderId={order.id} />
          </div>
        </div>

        {/* Visual Fulfillment Progress Stepper */}
        {!isCancelled ? (
          <div className="rounded-2xl border border-cream-200/80 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Step 1: Placed */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    currentStep >= 1 ? 'bg-[#024F5F] text-white shadow-xs' : 'bg-cream-200 text-muted'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="font-semibold text-[11px] sm:text-xs text-brand-700 mt-1.5">Order Placed</p>
                <p className="text-[10px] text-muted hidden sm:block">Payment confirmed</p>
              </div>

              {/* Step 2: Processing */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    currentStep >= 2
                      ? 'bg-[#CFAC64] text-white shadow-xs'
                      : 'bg-cream-100 text-muted border border-cream-300'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <p className="font-semibold text-[11px] sm:text-xs text-brand-700 mt-1.5">Processing</p>
                <p className="text-[10px] text-muted hidden sm:block">Packaging garment</p>
              </div>

              {/* Step 3: Shipped */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    currentStep >= 3
                      ? 'bg-[#024F5F] text-white shadow-xs'
                      : 'bg-cream-100 text-muted border border-cream-300'
                  }`}
                >
                  <Truck className="h-4 w-4" />
                </div>
                <p className="font-semibold text-[11px] sm:text-xs text-brand-700 mt-1.5">Shipped</p>
                <p className="text-[10px] text-muted hidden sm:block">
                  {order.courier_name ? order.courier_name : 'In transit'}
                </p>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    currentStep >= 4
                      ? 'bg-[#024F5F] text-white shadow-xs'
                      : 'bg-cream-100 text-muted border border-cream-300'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="font-semibold text-[11px] sm:text-xs text-brand-700 mt-1.5">Delivered</p>
                <p className="text-[10px] text-muted hidden sm:block">Order completed</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#CFAC64] bg-[#F6F1EC]/70 p-4 text-xs font-semibold text-[#024F5F] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#024F5F] shrink-0" />
            <span>This order has been cancelled. Inventory was restored.</span>
          </div>
        )}

        {/* Main 2-Column Details Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Items & Totals (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Order Items Card */}
            <div className={cardClass}>
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand-600" />
                  <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">
                    Purchased Items ({order.order_items?.length || 0})
                  </h2>
                </div>
                <span className="text-xs font-semibold text-muted">
                  {order.order_items?.reduce((sum, item) => sum + item.quantity, 0)} total quantity
                </span>
              </div>

              <ul className="divide-y divide-cream-100">
                {(order.order_items || []).map((item) => (
                  <li key={item.id} className="flex items-center gap-3.5 py-4 first:pt-1 last:pb-1">
                    {/* Item Image Thumbnail */}
                    <div className="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-xl border border-cream-200 bg-cream-100">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.product_name}
                          fill
                          sizes="72px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Item Specs */}
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-xs sm:text-sm font-bold text-brand-700 leading-snug">
                        {item.product_name}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted mt-1.5">
                        {item.variant_name && (
                          <span className="inline-flex items-center rounded-md bg-cream-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700 border border-cream-200">
                            Size: {item.variant_name}
                          </span>
                        )}

                        {item.color_hex && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700">
                            <span
                              className="h-3.5 w-3.5 shrink-0 rounded-full border border-cream-300"
                              style={{ backgroundColor: item.color_hex }}
                            />
                            {item.color && <span>{item.color}</span>}
                          </div>
                        )}

                        <span className="text-muted">·</span>
                        <span className="text-muted">
                          Qty: <strong className="text-brand-700">{item.quantity}</strong>
                        </span>
                        <span className="text-muted">·</span>
                        <span className="text-muted">{formatCurrency(item.price_at_purchase)} each</span>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="text-right shrink-0">
                      <p className="font-heading text-sm sm:text-base font-bold text-brand-700">
                        {formatCurrency(item.line_total)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Financial Summary */}
              <div className="border-t border-cream-200 pt-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-muted">
                  <span>Items Subtotal</span>
                  <span className="text-brand-700 font-semibold">{formatCurrency(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-muted">
                  <span>Shipping Charges</span>
                  <span className="text-brand-700 font-semibold">
                    {Number(order.shipping_cost) === 0 ? 'FREE' : formatCurrency(order.shipping_cost)}
                  </span>
                </div>

                {Number(order.quantity_discount) > 0 && (
                  <div className="flex justify-between text-[#024F5F] font-semibold">
                    <span>Bulk / Quantity Discount</span>
                    <span>-{formatCurrency(order.quantity_discount)}</span>
                  </div>
                )}

                {Number(order.coupon_discount) > 0 && (
                  <div className="flex justify-between text-[#024F5F] font-semibold">
                    <span>Coupon Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                    <span>-{formatCurrency(order.coupon_discount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-cream-200 pt-3">
                  <div>
                    <span className="font-heading text-base font-bold text-brand-700">Grand Total</span>
                    <p className="text-[11px] text-muted">
                      {isCOD ? 'Payable via Cash on Delivery' : 'Prepaid online via Razorpay'}
                    </p>
                  </div>
                  <span className="font-heading text-xl sm:text-2xl font-bold text-brand-700">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Contact Card (Directly under Order Items) */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 border border-brand-200/60 font-heading text-xs font-bold text-brand-700">
                  {getInitials(customerName)}
                </div>
                <div>
                  <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Customer Contact</h2>
                  <p className="text-[11px] text-muted">Quick communication with the customer.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Customer Name</p>
                  <p className="font-semibold text-brand-700 mt-0.5 text-sm">{customerName}</p>
                </div>

                {/* Communication Links: Call, WhatsApp, Email */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {customerPhone && (
                    <a
                      href={`tel:${customerPhone}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-cream-100 hover:border-brand-400 transition-colors shadow-2xs"
                    >
                      <Phone className="h-3.5 w-3.5 text-muted" />
                      <span>Call: {customerPhone}</span>
                    </a>
                  )}

                  {rawPhone && (
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#CFAC64] bg-[#F6F1EC] px-3.5 py-2 text-xs font-semibold text-[#024F5F] hover:bg-[#F6F1EC] hover:border-[#CFAC64] transition-colors shadow-2xs"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-[#024F5F]" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  )}

                  {customerEmail && (
                    <a
                      href={`mailto:${customerEmail}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-cream-100 hover:border-brand-400 transition-colors shadow-2xs"
                    >
                      <Mail className="h-3.5 w-3.5 text-muted" />
                      <span>Email ({customerEmail})</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Terms Card */}
            <div className="rounded-2xl border border-cream-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-brand-600" />
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-700">
                    Payment Method
                  </h3>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    order.payment_status === 'paid'
                      ? 'bg-[#F6F1EC] text-[#024F5F]'
                      : 'bg-[#F6F1EC] text-[#B08F4F]'
                  }`}
                >
                  {order.payment_status?.toUpperCase() || 'PENDING'}
                </span>
              </div>

              <p className="text-xs text-brand-700 font-medium">
                {isCOD ? 'Cash on Delivery (COD)' : order.payment_method || 'Online Payment'}
              </p>
              {order.razorpay_payment_id && (
                <p className="text-[11px] text-muted">
                  Payment ID:{' '}
                  <span className="font-mono font-bold text-brand-700 select-all">{order.razorpay_payment_id}</span>
                </p>
              )}
              {isCOD && (
                <p className="text-[11px] text-muted leading-relaxed">
                  Collection instruction: Delivery partner must collect{' '}
                  <strong className="text-brand-700">{formatCurrency(order.total_amount)}</strong> in cash or UPI
                  before handing the package over to the customer.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Fulfillment & Delivery Address (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status & Courier Manager */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <Settings2 className="h-4 w-4 text-brand-600" />
                <div>
                  <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Fulfillment &amp; Courier</h2>
                  <p className="text-[11px] text-muted">Update order dispatch and assign tracking number.</p>
                </div>
              </div>

              <OrderStatusManager order={order} />

              {/* Tracking Link quick view if available */}
              {order.tracking_url && (
                <div className="rounded-xl border border-[#CFAC64] bg-[#F6F1EC]/70 p-3 text-xs">
                  <p className="font-semibold text-[#024F5F]">Tracking Active</p>
                  {order.courier_name && <p className="text-[11px] text-[#024F5F] mt-0.5">Carrier: {order.courier_name}</p>}
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#024F5F] hover:text-[#024F5F] underline mt-1.5 font-semibold"
                  >
                    <span>Open Tracking Page</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Delivery Address Card */}
            {address && (
              <div className={cardClass}>
                <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Delivery Address</h2>
                  </div>
                  <CopyButton
                    text={fullAddressText}
                    label="Copy Address"
                    className="rounded-lg border border-cream-200 bg-cream-50 px-2 py-1 text-muted hover:text-brand-700 hover:bg-cream-100"
                  />
                </div>

                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-bold text-brand-700">{address.full_name}</p>
                  <p className="text-muted font-medium">Contact: {address.phone}</p>
                  <p className="text-brand-700 pt-1 leading-relaxed">
                    {address.address_line_1}
                    {address.address_line_2 ? `, ${address.address_line_2}` : ''}
                  </p>
                  <p className="text-brand-700 font-semibold">
                    {address.city}, {address.state} — {address.postal_code}
                  </p>
                  <p className="text-muted text-[11px] pt-0.5">{address.country || 'India'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED CLEAN PACKING SLIP & INVOICE (Visible ONLY during Print)       */}
      {/* ========================================================================= */}
      <div className="hidden print:block font-sans text-[#024F5F] bg-white p-6 max-w-3xl mx-auto">
        {/* Invoice Header */}
        <div className="border-b-2 border-[#00303A] pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-wider uppercase font-heading text-[#00303A]">AL HAREER</h1>
            <p className="text-xs text-[#024F5F] tracking-wide uppercase mt-0.5">Luxury Handcrafted Ethnic Menswear</p>
            <p className="text-[11px] text-[#024F5F] mt-1">{contactEmail} · www.alhareer.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#00303A]">PACKING SLIP &amp; INVOICE</h2>
            <p className="text-sm font-bold font-mono mt-0.5">Order #{order.order_number}</p>
            <p className="text-xs text-[#024F5F] mt-0.5">Date: {orderDateFormatted}</p>
            <div className="mt-2 inline-block px-2.5 py-0.5 text-xs font-bold border border-[#00303A] uppercase">
              {isCOD ? 'CASH ON DELIVERY (COD)' : 'PREPAID ONLINE'}
            </div>
          </div>
        </div>

        {/* Addresses Row */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-xs">
          <div className="border border-[#CFAC64] p-3 rounded">
            <p className="font-bold uppercase tracking-wider text-[#024F5F] mb-1 border-b border-[#CFAC64] pb-1">
              Customer Details
            </p>
            <p className="font-bold text-sm text-[#00303A]">{customerName}</p>
            {customerEmail && <p className="text-[#024F5F] mt-0.5">{customerEmail}</p>}
            {customerPhone && <p className="text-[#024F5F] mt-0.5">Phone: {customerPhone}</p>}
          </div>

          <div className="border border-[#CFAC64] p-3 rounded">
            <p className="font-bold uppercase tracking-wider text-[#024F5F] mb-1 border-b border-[#CFAC64] pb-1">
              Ship To (Delivery Address)
            </p>
            {address ? (
              <div className="text-[#024F5F] leading-snug">
                <p className="font-bold text-sm text-[#00303A]">{address.full_name}</p>
                <p className="mt-0.5">{address.address_line_1}</p>
                {address.address_line_2 && <p>{address.address_line_2}</p>}
                <p className="font-semibold text-[#00303A] mt-0.5">
                  {address.city}, {address.state} — {address.postal_code}
                </p>
                <p className="mt-0.5">Phone: {address.phone}</p>
              </div>
            ) : (
              <p className="text-[#024F5F]">No delivery address provided</p>
            )}
          </div>
        </div>

        {/* Purchased Items Table */}
        <table className="w-full text-left text-xs border border-[#00303A] mb-6">
          <thead className="bg-[#F6F1EC] border-b border-[#00303A] text-[#00303A]">
            <tr>
              <th className="py-2 px-3 border-r border-[#00303A] w-8 text-center">#</th>
              <th className="py-2 px-3 border-r border-[#00303A]">Item Description</th>
              <th className="py-2 px-3 border-r border-[#00303A] text-center w-28">Size / Color</th>
              <th className="py-2 px-3 border-r border-[#00303A] text-center w-16">Qty</th>
              <th className="py-2 px-3 border-r border-[#00303A] text-right w-24">Price (₹)</th>
              <th className="py-2 px-3 text-right w-28">Total (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CFAC64] text-[#024F5F]">
            {(order.order_items || []).map((item, idx) => (
              <tr key={item.id}>
                <td className="py-2.5 px-3 border-r border-[#CFAC64] text-center font-medium">{idx + 1}</td>
                <td className="py-2.5 px-3 border-r border-[#CFAC64] font-bold text-[#00303A]">{item.product_name}</td>
                <td className="py-2.5 px-3 border-r border-[#CFAC64] text-center">
                  {item.variant_name || 'Free Size'} {item.color ? `· ${item.color}` : ''}
                </td>
                <td className="py-2.5 px-3 border-r border-[#CFAC64] text-center font-bold text-[#00303A]">
                  {item.quantity}
                </td>
                <td className="py-2.5 px-3 border-r border-[#CFAC64] text-right">
                  {formatCurrency(item.price_at_purchase)}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-[#00303A]">{formatCurrency(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & Payment Instructions */}
        <div className="flex justify-between items-start mb-8 text-xs">
          {/* Left: Payment Box */}
          <div className="w-1/2 pr-6">
            {isCOD ? (
              <div className="border-2 border-[#00303A] p-3 bg-[#F6F1EC] rounded">
                <p className="font-bold text-xs uppercase tracking-wider text-[#00303A]">CASH ON DELIVERY (COD)</p>
                <p className="text-xs text-[#024F5F] mt-1">
                  Courier partner must collect{' '}
                  <strong className="text-sm font-bold text-[#00303A]">{formatCurrency(order.total_amount)}</strong> before
                  handing over parcel.
                </p>
              </div>
            ) : (
              <div className="border border-[#CFAC64] p-3 rounded">
                <p className="font-bold text-xs uppercase tracking-wider text-[#00303A]">
                  ONLINE PAYMENT: {order.payment_method || 'Prepaid'}
                </p>
                <p className="text-xs text-[#024F5F] font-bold mt-1">
                  PAYMENT STATUS: {order.payment_status.toUpperCase()}
                </p>
                <p className="text-[11px] text-[#024F5F] mt-0.5">No cash collection required at doorstep.</p>
              </div>
            )}
          </div>

          {/* Right: Calculations */}
          <div className="w-1/2 space-y-1 text-xs">
            <div className="flex justify-between py-1 border-b border-[#CFAC64]">
              <span className="text-[#024F5F]">Items Subtotal:</span>
              <span className="font-semibold text-[#00303A]">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#CFAC64]">
              <span className="text-[#024F5F]">Shipping:</span>
              <span className="font-semibold text-[#00303A]">
                {Number(order.shipping_cost) === 0 ? 'FREE' : formatCurrency(order.shipping_cost)}
              </span>
            </div>
            {Number(order.quantity_discount) > 0 && (
              <div className="flex justify-between py-1 border-b border-[#CFAC64] text-[#024F5F]">
                <span>Quantity Discount:</span>
                <span>-{formatCurrency(order.quantity_discount)}</span>
              </div>
            )}
            {Number(order.coupon_discount) > 0 && (
              <div className="flex justify-between py-1 border-b border-[#CFAC64] text-[#024F5F]">
                <span>Coupon Discount {order.coupon_code ? `(${order.coupon_code})` : ''}:</span>
                <span>-{formatCurrency(order.coupon_discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t-2 border-[#00303A] text-sm font-bold text-[#00303A]">
              <span>Grand Total:</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#CFAC64] pt-4 flex justify-between items-end text-xs text-[#024F5F]">
          <div>
            <p className="font-bold text-[#00303A]">Thank you for shopping with Al Hareer!</p>
            <p className="text-[11px] mt-0.5">
              For support, order updates, or size exchanges: {contactEmail}
            </p>
          </div>
          <div className="text-right">
            <div className="w-36 border-b border-[#00303A] mb-1"></div>
            <p className="text-[10px] uppercase font-bold text-[#024F5F]">Authorized Signature</p>
          </div>
        </div>
      </div>
    </>
  );
}
