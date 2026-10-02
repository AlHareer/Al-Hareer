import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import FaqForm from '../_components/FaqForm';
import { getFaqCategories } from '@/actions/admin/faqs';

export const metadata = { title: 'Create FAQ — Al Hareer Admin' };

export default async function NewFaqPage() {
  const categories = await getFaqCategories();
  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Breadcrumb & Header */}
      <div className="border-b border-cream-200/80 pb-4.5">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <Link href="/admin" className="hover:text-brand-700 transition-colors">
            Admin
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <Link href="/admin/faqs" className="hover:text-brand-700 transition-colors">
            FAQs
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="text-brand-500 font-semibold">New FAQ</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700 tracking-tight">
              Create New FAQ
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Add a customer-facing question and helpful answer to your public FAQ directory.
            </p>
          </div>

          <Link
            href="/admin/faqs"
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-cream-50 hover:border-brand-400 shadow-2xs transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to FAQs
          </Link>
        </div>
      </div>

      <FaqForm categories={categories} />
    </div>
  );
}
