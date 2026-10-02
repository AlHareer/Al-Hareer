import Link from 'next/link';
import {
  Plus,
  Quote,
  Star,
  CheckCircle2,
  EyeOff,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { getAllTestimonialsAdmin } from '@/actions/admin/testimonials';
import TestimonialsList from './_components/TestimonialsList';

export const metadata = { title: 'Testimonials — Al Hareer Admin' };

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();

  const totalCount = testimonials.length;
  const activeCount = testimonials.filter((t) => t.is_active).length;
  const hiddenCount = totalCount - activeCount;

  const avgRating = totalCount > 0
    ? (testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  const stats = [
    {
      label: 'Total Reviews',
      value: totalCount,
      icon: Quote,
      accent: 'bg-brand-500/10 text-brand-600 border-brand-200/60',
    },
    {
      label: 'Average Rating',
      value: `${avgRating} ★`,
      icon: Star,
      accent: 'bg-amber-500/10 text-amber-700 border-amber-200/60',
    },
    {
      label: 'Published & Live',
      value: activeCount,
      icon: CheckCircle2,
      accent: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/60',
    },
    {
      label: 'Draft / Hidden',
      value: hiddenCount,
      icon: EyeOff,
      accent: 'bg-cream-300/40 text-muted-dark border-cream-300/70',
    },
  ];

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Page Header */}
      <div className="border-b border-cream-200/80 pb-4.5">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span>Content</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="text-brand-500 font-semibold">Testimonials</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-700 tracking-tight">
              Testimonials &amp; Social Proof
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Curate customer reviews shown in the infinite marquee carousel on the Homepage and About page.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-white border border-cream-300 hover:border-gold/60 hover:bg-cream-50 shadow-xs transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5 text-gold" />
              <span>Storefront View</span>
            </Link>
            <Link
              href="/admin/testimonials/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-700 hover:to-brand-600 shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>New Testimonial</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3 hover:border-brand-300/40 transition-all"
            >
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-brand-700 font-heading mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2.5 sm:p-3 rounded-xl border ${stat.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main List Component */}
      <TestimonialsList testimonials={testimonials} />
    </div>
  );
}
