'use client';

import { useState } from 'react';
import { Copy, Check, Printer } from 'lucide-react';

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
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
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
