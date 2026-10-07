'use client';

import Image from 'next/image';
import { Check, MapPin, Truck, ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';
import type { Order } from '@/app/account/page';

function formatDateTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

type Step = { title: string; desc: string; date: string; completed: boolean; current: boolean; isCancelled: boolean };

// Builds the timeline from the order's real status and the courier details the
// admin entered. Only the placed step and the latest step carry a date — the
// database records when the order was created and last changed, nothing in between.
function buildSteps(order: Order): Step[] {
  const status = (order.status || '').toLowerCase();
  const placed = formatDateTime(order.createdAt);
  const latest = formatDateTime(order.updatedAt);

  if (status === 'cancelled') {
    return [
      { title: 'Order Placed', desc: 'We received your order.', date: placed, completed: true, current: false, isCancelled: false },
      { title: 'Order Cancelled', desc: 'This order was cancelled.', date: latest, completed: true, current: true, isCancelled: true },
    ];
  }

  const rank = ({ processing: 1, shipped: 2, delivered: 3 } as Record<string, number>)[status] ?? 1;
  const via = order.courierName ? ` via ${order.courierName}` : '';
  const awb = order.trackingNumber ? ` • AWB ${order.trackingNumber}` : '';

  const defs = [
    { title: 'Order Placed', desc: 'We received your order.' },
    { title: 'Processing', desc: 'Your order is being prepared and packed.' },
    { title: 'Shipped', desc: order.courierName || order.trackingNumber ? `Handed over${via}${awb}.` : 'Your order has been handed to the courier.' },
    { title: 'Delivered', desc: 'Your order has been delivered.' },
  ];

  return defs.map((d, i) => {
    const delivered = status === 'delivered';
    const completed = i < rank || (delivered && i === 3);
    const current = i === rank && !delivered;
    const date = i === 0 ? placed : i === rank ? latest : '';
    return { ...d, date, completed, current, isCancelled: false };
  });
}

// showSummary=false drops the address/items block for places (like the order
// details popup) that already show them.
export default function OrderTracking({ order, showSummary = true }: { order: Order; showSummary?: boolean }) {
  const [copied, setCopied] = useState(false);
  const steps = buildSteps(order);
  const hasShipment = Boolean(order.courierName || order.trackingNumber || order.trackingUrl);
  const address = order.shippingAddress;
  const hasAddress = Boolean(address && (address.address || address.city));

  const copyAwb = () => {
    if (!order.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      {/* Shipment details - only shown once the admin has entered them */}
      {hasShipment && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-xl bg-[#F6F1EC] border border-[#CFAC64]">
          {order.courierName && (
            <div>
              <p className="text-[10.5px] sm:text-[11px] text-[#024F5F] font-medium flex items-center gap-1">
                <Truck className="w-3 h-3" /> Courier Partner
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#00303A] mt-0.5">{order.courierName}</p>
            </div>
          )}
          {order.trackingNumber && (
            <div>
              <p className="text-[10.5px] sm:text-[11px] text-[#024F5F] font-medium">Tracking Number (AWB)</p>
              <p className="text-xs sm:text-sm font-bold text-[#024F5F] mt-0.5 font-mono flex items-center gap-1.5 break-all">
                {order.trackingNumber}
                <button type="button" onClick={copyAwb} title="Copy" className="text-[#024F5F]/70 hover:text-[#024F5F]">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </p>
            </div>
          )}
          {order.trackingUrl && (
            <div className="flex items-end">
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#CFAC64] hover:bg-[#B08F4F] px-3.5 py-2 text-xs font-semibold text-white transition-colors"
              >
                Track on courier site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        <h4 className="font-heading text-xs sm:text-sm font-bold text-[#00303A] uppercase tracking-wider">Order Progress</h4>
        <div className="relative pl-6 sm:pl-7 space-y-5 sm:space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#CFAC64]">
          {steps.map((step) => (
            <div key={step.title} className="relative">
              <div
                className={`absolute -left-6 sm:-left-7 top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                  step.isCancelled
                    ? 'bg-[#F6F1EC] border-[#024F5F] text-[#024F5F]'
                    : step.completed
                    ? 'bg-[#00303A] border-[#00303A] text-white'
                    : step.current
                    ? 'bg-[#024F5F] border-[#024F5F] text-white ring-4 ring-[#024F5F]/20'
                    : 'bg-white border-[#CFAC64] text-transparent'
                }`}
              >
                {step.completed || step.current ? <Check className="w-3 h-3 stroke-[3]" /> : null}
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                  <h5
                    className={`font-heading text-xs sm:text-sm font-bold ${
                      step.completed || step.current ? 'text-[#00303A]' : 'text-[#CFAC64]'
                    }`}
                  >
                    {step.title}
                  </h5>
                  {step.date && <span className="text-[10px] sm:text-[11px] font-medium text-[#024F5F]">{step.date}</span>}
                </div>
                <p className={`text-[11px] sm:text-xs leading-relaxed ${step.completed || step.current ? 'text-[#024F5F]' : 'text-[#CFAC64]'}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination & items */}
      {showSummary && (
        <div className={`grid grid-cols-1 ${hasAddress ? 'md:grid-cols-2' : ''} gap-3 sm:gap-4 pt-3 border-t border-[#F6F1EC]`}>
          {hasAddress && address && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#F6F1EC]/60 border border-[#CFAC64] space-y-1.5">
              <p className="text-xs font-bold text-[#00303A] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#024F5F]" />
                <span>Delivery Address</span>
              </p>
              <div className="text-xs text-[#024F5F] pl-5 space-y-0.5">
                {address.fullName && <p className="font-bold text-[#00303A]">{address.fullName}</p>}
                <p>
                  {[address.address, address.city, address.state].filter(Boolean).join(', ')}
                  {address.pinCode ? ` - ${address.pinCode}` : ''}
                </p>
                {address.phone && <p>Phone: {address.phone}</p>}
              </div>
            </div>
          )}

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#F6F1EC]/60 border border-[#CFAC64] space-y-2.5">
            <p className="text-xs font-bold text-[#00303A]">Items ({order.itemsCount})</p>
            {(order.items ?? []).map((it, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative w-11 h-14 rounded-lg bg-white border border-[#CFAC64] overflow-hidden shrink-0">
                  {it.image && <Image src={it.image} alt={it.name} fill sizes="44px" className="object-cover object-top" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-xs sm:text-sm font-bold text-[#00303A] truncate">{it.name}</p>
                  <p className="text-[11px] text-[#024F5F]">
                    {[it.size && `Size ${it.size}`, it.color, `Qty ${it.qty ?? 1}`].filter(Boolean).join(' • ')}
                  </p>
                </div>
                <p className="text-xs font-bold text-[#00303A] shrink-0">₹{((it.price ?? 0) * (it.qty ?? 1)).toLocaleString('en-IN')}</p>
              </div>
            ))}
            <p className="text-xs font-bold text-[#00303A] pt-2 border-t border-[#CFAC64]/50 flex justify-between">
              <span>Order Total</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
