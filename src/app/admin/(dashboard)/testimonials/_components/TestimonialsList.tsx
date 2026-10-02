'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Plus,
  Quote,
  Star,
  Filter,
  X,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { reorderTestimonials } from '@/actions/admin/testimonials';
import TestimonialRow from './TestimonialRow';

type Testimonial = {
  id: string;
  customer_name: string;
  role: string | null;
  location: string | null;
  review_text: string;
  rating: number;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
};

export default function TestimonialsList({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | 'other'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft'>('all');

  // Filtered Testimonials
  const filtered = useMemo(() => {
    return testimonials.filter((t) => {
      // Status filter
      if (statusFilter === 'live' && !t.is_active) return false;
      if (statusFilter === 'draft' && t.is_active) return false;

      // Rating filter
      if (ratingFilter === '5' && t.rating !== 5) return false;
      if (ratingFilter === '4' && t.rating !== 4) return false;
      if (ratingFilter === 'other' && t.rating > 3) return false;

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = t.customer_name?.toLowerCase().includes(query);
        const matchesReview = t.review_text?.toLowerCase().includes(query);
        const matchesLocation = t.location?.toLowerCase().includes(query);
        const matchesRole = t.role?.toLowerCase().includes(query);
        if (!matchesName && !matchesReview && !matchesLocation && !matchesRole) {
          return false;
        }
      }

      return true;
    });
  }, [testimonials, statusFilter, ratingFilter, searchQuery]);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;
    const reordered = [...testimonials];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    startTransition(async () => {
      await reorderTestimonials(reordered.map((t) => t.id));
      router.refresh();
    });
  };

  if (testimonials.length === 0) {
    return (
      <div className="rounded-2xl border border-cream-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-200/50 flex items-center justify-center text-brand-600 mb-4">
          <Quote className="h-6 w-6 text-brand-500" />
        </div>
        <h3 className="font-heading text-lg font-bold text-brand-700">No Testimonials Yet</h3>
        <p className="text-sm text-muted max-w-md mx-auto mt-1 mb-6">
          Add authentic reviews from patrons who love their Al Hareer kurta sets to showcase credibility across your store.
        </p>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add First Testimonial</span>
        </Link>
      </div>
    );
  }

  const isFiltering = searchQuery.trim() !== '' || ratingFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-cream-200/90 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, review quote, or city..."
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-cream-200 bg-cream-50/50 text-xs sm:text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-700 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Switcher */}
            <div className="flex items-center rounded-xl bg-cream-100/80 p-0.5 border border-cream-200 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-brand-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('live')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'live'
                    ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                Live
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'draft'
                    ? 'bg-white text-amber-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                Hidden
              </button>
            </div>

            {/* Rating Filter Switcher */}
            <div className="flex items-center rounded-xl bg-cream-100/80 p-0.5 border border-cream-200 text-xs">
              <button
                type="button"
                onClick={() => setRatingFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  ratingFilter === 'all'
                    ? 'bg-white text-brand-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                Any Rating
              </button>
              <button
                type="button"
                onClick={() => setRatingFilter('5')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  ratingFilter === '5'
                    ? 'bg-white text-amber-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>5★</span>
              </button>
              <button
                type="button"
                onClick={() => setRatingFilter('4')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  ratingFilter === '4'
                    ? 'bg-white text-amber-700 font-semibold shadow-xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>4★</span>
              </button>
            </div>

            {isFiltering && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setRatingFilter('all');
                  setStatusFilter('all');
                }}
                className="text-xs text-brand-600 hover:text-brand-800 font-medium px-2 py-1.5"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Display sequence note when in natural sort order */}
        {!isFiltering && testimonials.length > 1 && (
          <div className="flex items-center gap-2 pt-2 border-t border-cream-200/60 text-[11px] text-muted">
            <ArrowUpDown className="h-3.5 w-3.5 text-gold shrink-0" />
            <span>
              Marquee sequence: Reviews appear on the homepage and about carousel in the exact order below. Use the up/down arrows to prioritize.
            </span>
          </div>
        )}
      </div>

      {/* Testimonial Rows List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-cream-200 bg-white p-10 text-center shadow-xs">
          <Filter className="h-6 w-6 text-muted-light mx-auto mb-2" />
          <p className="text-sm font-semibold text-brand-700">No matching testimonials found</p>
          <p className="text-xs text-muted mt-1">
            Try adjusting your search terms or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((testimonial, idx) => {
            // Find natural index for accurate reordering
            const naturalIndex = testimonials.findIndex((t) => t.id === testimonial.id);
            return (
              <TestimonialRow
                key={testimonial.id}
                testimonial={testimonial}
                canMoveUp={naturalIndex > 0 && !isFiltering}
                canMoveDown={naturalIndex < testimonials.length - 1 && !isFiltering}
                onMove={(direction) => handleMove(naturalIndex, direction)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
