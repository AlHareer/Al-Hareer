import Link from 'next/link';
import {
  Plus,
  HelpCircle,
  CheckCircle2,
  EyeOff,
  FolderTree,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { getAllFaqsAdmin } from '@/actions/admin/faqs';
import FaqsList from './_components/FaqsList';

export const metadata = { title: 'FAQs — Al Hareer Admin' };

export default async function AdminFaqsPage() {
  const faqs = await getAllFaqsAdmin();

  const totalCount = faqs.length;
  const activeCount = faqs.filter((f) => f.is_active).length;
  const hiddenCount = totalCount - activeCount;
  const categoriesCount = new Set(faqs.map((f) => f.category)).size;

  const stats = [
    {
      label: 'Total FAQs',
      value: totalCount,
      icon: HelpCircle,
      accent: 'bg-brand-500/10 text-brand-600 border-brand-200/60',
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
      accent: 'bg-amber-500/10 text-amber-700 border-amber-200/60',
    },
    {
      label: 'Categories',
      value: categoriesCount,
      icon: FolderTree,
      accent: 'bg-blue-500/10 text-blue-700 border-blue-200/60',
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
          <span className="text-brand-500 font-semibold">FAQs</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700 tracking-tight">
              Frequently Asked Questions (FAQs)
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Manage helpful questions, answers, sizing advice, and shipping policies shown on your storefront FAQ page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/faq"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-brand-700 hover:bg-cream-50 hover:border-brand-400 shadow-2xs transition-all"
            >
              <span>View Live FAQ Page</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-light" />
            </Link>

            <Link
              href="/admin/faqs/new"
              className="inline-flex items-center justify-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> New FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3.5 rounded-2xl border border-cream-300/80 bg-white p-4 shadow-2xs"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${s.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xl sm:text-2xl font-bold leading-none text-brand-700">
                  {s.value}
                </p>
                <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted mt-1">
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQs List and Filters */}
      <FaqsList faqs={faqs} />
    </div>
  );
}
