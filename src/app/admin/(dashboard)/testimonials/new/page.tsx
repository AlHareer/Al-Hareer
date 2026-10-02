import Link from 'next/link';
import { ArrowLeft, ChevronRight, Quote } from 'lucide-react';
import TestimonialForm from '../_components/TestimonialForm';

export const metadata = { title: 'New Testimonial — Al Hareer Admin' };

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Header & Breadcrumbs */}
      <div className="border-b border-cream-200/80 pb-4.5">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <Link href="/admin/testimonials" className="hover:text-brand-700 transition-colors">
            Testimonials
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="text-brand-500 font-semibold">New Testimonial</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-700 tracking-tight">
              Create Customer Testimonial
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Add authentic praise and ratings from patrons to feature in the storefront social proof marquee.
            </p>
          </div>
          <Link
            href="/admin/testimonials"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-white border border-cream-300 hover:border-gold/60 hover:bg-cream-50 shadow-xs transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Reviews</span>
          </Link>
        </div>
      </div>

      {/* Form with Live Preview */}
      <TestimonialForm />
    </div>
  );
}
