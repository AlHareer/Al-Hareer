'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Trash2, Star } from 'lucide-react';
import { approveReview, deleteReview } from '@/actions/admin/reviews';

type Review = {
  id: string;
  rating: number;
  review_text: string | null;
  reviewer_name: string | null;
  is_approved: boolean;
  created_at: string;
  products?: { name: string } | null;
  profiles?: { full_name: string | null; email: string } | null;
};

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'fill-gold text-gold' : 'text-cream-400'}`} />
      ))}
    </span>
  );
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    startTransition(async () => {
      await approveReview(id);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      return;
    }
    startTransition(async () => {
      await deleteReview(id);
      setConfirmingId(null);
      router.refresh();
    });
  };

  const filtered = reviews.filter((r) => {
    if (tab === 'pending') return !r.is_approved;
    if (tab === 'approved') return r.is_approved;
    return true;
  });

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.key ? 'border-brand-500/40 bg-brand-500/10 text-brand-700' : 'border-cream-300 text-muted hover:text-brand-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-cream-300 bg-white py-12 text-center text-sm text-muted shadow-sm">
          No reviews here.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li key={r.id} className="rounded-xl border border-cream-300 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Stars rating={r.rating} />
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        r.is_approved
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gold-light/50 text-gold-dark border-gold/40'
                      }`}
                    >
                      {r.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-brand-700 leading-relaxed">
                    {r.review_text || <em className="text-muted-light">No comment</em>}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    <span className="font-semibold text-brand-700">
                      {r.profiles?.full_name || r.profiles?.email || r.reviewer_name || 'Anonymous'}
                    </span>{' '}
                    on <span className="font-semibold text-brand-600">{r.products?.name || 'Product'}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!r.is_approved && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={pending}
                      className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3.5 py-2 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={pending}
                    title={confirmingId === r.id ? 'Click again to confirm' : 'Delete Review'}
                    className={`rounded-lg p-2 transition-all ${
                      confirmingId === r.id ? 'text-red-600 bg-red-50' : 'text-muted hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
