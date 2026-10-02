import { MessageSquare, Clock, CheckCircle2, Star } from 'lucide-react';
import { getAllReviewsAdmin } from '@/actions/admin/reviews';
import ReviewList from './_components/ReviewList';

export const metadata = { title: 'Reviews' };

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin();

  const pendingCount = reviews.filter((r) => !r.is_approved).length;
  const approvedCount = reviews.length - pendingCount;
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const stats = [
    { label: 'Total Reviews', value: reviews.length, icon: MessageSquare },
    { label: 'Pending', value: pendingCount, icon: Clock },
    { label: 'Approved', value: approvedCount, icon: CheckCircle2 },
    { label: 'Avg Rating', value: avgRating ? avgRating.toFixed(1) : '—', icon: Star },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-700">Reviews</h1>
          <p className="text-sm text-muted mt-1">Approve reviews before they appear on product pages.</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-cream-300 bg-white px-4 py-3.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-xl font-bold leading-none text-brand-700">{s.value}</p>
              <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <ReviewList reviews={reviews} />
    </div>
  );
}
