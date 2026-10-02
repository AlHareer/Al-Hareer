'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Sparkles,
  Loader2,
  Home,
} from 'lucide-react';
import { deleteFaq, toggleFaqActive, toggleFaqShowOnHome } from '@/actions/admin/faqs';

type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  is_active: boolean;
  show_on_home: boolean;
};

export default function FaqRow({
  faq,
  canMoveUp,
  canMoveDown,
  onMove,
}: {
  faq: Faq;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: 'up' | 'down') => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggle = (active: boolean) => {
    startTransition(async () => {
      await toggleFaqActive(faq.id, active);
      router.refresh();
    });
  };

  const handleToggleHome = (showOnHome: boolean) => {
    startTransition(async () => {
      await toggleFaqShowOnHome(faq.id, showOnHome);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (confirmDelete) {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      startTransition(async () => {
        await deleteFaq(faq.id);
        router.refresh();
      });
    } else {
      setConfirmDelete(true);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => {
        setConfirmDelete(false);
      }, 3500);
    }
  };

  return (
    <div
      className={`rounded-2xl border bg-white transition-all duration-200 shadow-2xs hover:border-brand-300 ${
        faq.is_active ? 'border-cream-300/80' : 'border-amber-200/80 bg-amber-50/10'
      }`}
    >
      {/* Main Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Reorder Buttons */}
          <div className="flex shrink-0 flex-col gap-0.5 rounded-lg border border-cream-200 bg-cream-50/70 p-0.5">
            <button
              type="button"
              onClick={() => onMove('up')}
              disabled={pending || !canMoveUp}
              className="rounded p-1 text-muted hover:bg-white hover:text-brand-700 disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Move up in order"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onMove('down')}
              disabled={pending || !canMoveDown}
              className="rounded p-1 text-muted hover:bg-white hover:text-brand-700 disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Move down in order"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Question & Category Information */}
          <div className="min-w-0 flex-1 cursor-pointer select-none" onClick={() => setIsExpanded((prev) => !prev)}>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-block rounded-full bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                {faq.category}
              </span>

              {!faq.is_active && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                  <EyeOff className="h-3 w-3" /> Hidden from Storefront
                </span>
              )}
              {faq.show_on_home && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 text-[10px] font-bold">
                  <Home className="h-3 w-3" /> Homepage
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-[15px] font-bold text-brand-700 hover:text-brand-600 transition-colors leading-snug">
                {faq.question}
              </h3>
              <ChevronRight
                className={`h-4 w-4 text-muted transition-transform shrink-0 ${
                  isExpanded ? 'rotate-90 text-brand-500' : ''
                }`}
              />
            </div>

            {!isExpanded && (
              <p className="text-xs text-muted truncate mt-1 max-w-2xl font-normal leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-cream-200/60 pt-2.5 sm:pt-0">
          {/* Active Switch */}
          <button
            type="button"
            onClick={() => handleToggle(!faq.is_active)}
            disabled={pending}
            className={`inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              faq.is_active
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-cream-100 text-muted border-cream-300'
            }`}
            title={faq.is_active ? 'Visible on /faq page' : 'Hidden from customers'}
          >
            <span
              className={`relative flex h-4 w-7 shrink-0 rounded-full p-0.5 transition-colors ${
                faq.is_active ? 'bg-emerald-600' : 'bg-cream-400'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 rounded-full bg-white shadow transform transition ${
                  faq.is_active ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </span>
            <span className="hidden md:inline">{faq.is_active ? 'Live' : 'Hidden'}</span>
          </button>

          {/* Homepage Toggle */}
          <button
            type="button"
            onClick={() => handleToggleHome(!faq.show_on_home)}
            disabled={pending}
            className={`inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              faq.show_on_home
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-cream-100 text-muted border-cream-300'
            }`}
            title={faq.show_on_home ? 'Shown on homepage' : 'Not on homepage'}
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{faq.show_on_home ? 'On Home' : 'Home'}</span>
          </button>

          {/* Edit Button */}
          <Link
            href={`/admin/faqs/${faq.id}/edit`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-cream-300 bg-white text-muted hover:text-brand-700 hover:bg-cream-50 transition-all shadow-2xs"
            title="Edit FAQ"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className={`inline-flex items-center justify-center rounded-xl transition-all cursor-pointer shadow-2xs ${
              confirmDelete
                ? 'bg-red-600 text-white px-3 py-1.5 text-xs font-bold'
                : 'h-8 w-8 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
            }`}
            title={confirmDelete ? 'Click again to permanently delete' : 'Delete FAQ'}
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : confirmDelete ? (
              'Confirm?'
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Answer Section with Rich Styling */}
      {isExpanded && (
        <div className="border-t border-cream-200 bg-cream-50/40 p-4 sm:px-6 sm:py-4 rounded-b-2xl">
          <div className="rounded-xl border border-cream-200/80 bg-white p-4 shadow-inner space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
              Customer Answer Text:
            </span>
            <p className="text-xs sm:text-sm text-brand-700 font-normal leading-relaxed whitespace-pre-line">
              {faq.answer}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] text-muted">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-brand-600 font-semibold hover:underline"
            >
              ▲ Collapse Answer
            </button>
            <Link
              href={`/admin/faqs/${faq.id}/edit`}
              className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-800"
            >
              Edit this FAQ ↗
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
