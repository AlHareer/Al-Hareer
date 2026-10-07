'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Printer, Trash2 } from 'lucide-react';
import { deleteOrder } from '@/actions/admin/orders';

export function CopyButton({
  text,
  label = 'Copy',
  className = '',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${className}`}
      title={`Copy ${label}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[#024F5F]" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
}

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 hover:border-brand-400 hover:bg-cream-50 transition-all shadow-2xs cursor-pointer"
      title="Print Packing Slip / Receipt"
    >
      <Printer className="h-3.5 w-3.5 text-muted" />
      <span>Print Slip</span>
    </button>
  );
}

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteOrder(orderId);
      router.push('/admin/orders');
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      title={confirming ? 'Click again to confirm delete' : 'Delete this order'}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-60 ${
        confirming
          ? 'border-[#024F5F] bg-[#F6F1EC] text-[#024F5F]'
          : 'border-cream-300 bg-white text-brand-700 hover:border-[#024F5F] hover:text-[#024F5F] hover:bg-[#F6F1EC]'
      }`}
    >
      <Trash2 className="h-3.5 w-3.5" />
      <span>{pending ? 'Deleting…' : confirming ? 'Click again to confirm' : 'Delete Order'}</span>
    </button>
  );
}
