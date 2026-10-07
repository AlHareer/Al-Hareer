'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Pencil,
  Trash2,
  Star,
  ChevronUp,
  ChevronDown,
  Quote,
  Eye,
  EyeOff,
  CheckCircle2,
  MapPin,
  Loader2,
} from 'lucide-react';
import { deleteTestimonial, toggleTestimonialActive } from '@/actions/admin/testimonials';

type Testimonial = {
  id: string;
  customer_name: string;
  role: string | null;
  location: string | null;
  review_text: string;
  rating: number;
  image_url: string | null;
  is_active: boolean;
};

export default function TestimonialRow({
  testimonial,
  canMoveUp,
  canMoveDown,
  onMove,
}: {
  testimonial: Testimonial;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: 'up' | 'down') => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  const initials = testimonial.customer_name
    ? testimonial.customer_name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join('')
    : 'AH';

  const handleToggle = (active: boolean) => {
    startTransition(async () => {
      await toggleTestimonialActive(testimonial.id, active);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (confirmDelete) {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      startTransition(async () => {
        await deleteTestimonial(testimonial.id);
        router.refresh();
      });
    } else {
      setConfirmDelete(true);
      deleteTimerRef.current = setTimeout(() => {
        setConfirmDelete(false);
      }, 4000);
    }
  };

  const isLongReview = testimonial.review_text.length > 130;

  return (
    <div
      className={`group rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all ${
        testimonial.is_active
          ? 'border-cream-200/90 hover:border-gold/40 hover:shadow-luxury-hover'
          : 'border-cream-200/50 bg-cream-50/40 opacity-80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Reordering Controls */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={pending || !canMoveUp}
            className="p-1 rounded-lg text-muted hover:text-brand-700 hover:bg-cream-100 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
            title="Move Earlier in Marquee"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove('down')}
            disabled={pending || !canMoveDown}
            className="p-1 rounded-lg text-muted hover:text-brand-700 hover:bg-cream-100 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
            title="Move Later in Marquee"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Customer Avatar / Monogram */}
        <div className="relative h-13 w-13 sm:h-14 sm:w-14 shrink-0 rounded-full overflow-hidden border-2 border-cream-200 bg-cream-100 shadow-xs flex items-center justify-center">
          {testimonial.image_url ? (
            <Image
              src={testimonial.image_url}
              alt={testimonial.customer_name}
              fill
              sizes="56px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="font-heading font-bold text-sm sm:text-base text-brand-600 tracking-wider">
              {initials}
            </span>
          )}
        </div>

        {/* Testimonial Information & Preview */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-heading text-sm sm:text-base font-bold text-brand-700 truncate">
              {testimonial.customer_name}
            </h4>

            {testimonial.role && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-brand-600 bg-cream-100 border border-cream-200">
                <CheckCircle2 className="h-3 w-3 text-gold" />
                {testimonial.role}
              </span>
            )}

            {testimonial.location && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                <MapPin className="h-3 w-3 text-muted-light" />
                {testimonial.location}
              </span>
            )}

            <div className="flex items-center gap-1 ml-auto sm:ml-2">
              <div className="flex text-[#CFAC64] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < testimonial.rating
                        ? 'fill-[#CFAC64] text-[#CFAC64]'
                        : 'text-cream-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-brand-700">
                {testimonial.rating}.0
              </span>
            </div>
          </div>

          {/* Review text with quote & expand support */}
          <div className="relative">
            <p className="text-xs sm:text-sm text-brand-700/90 leading-relaxed font-normal italic">
              &ldquo;
              {isExpanded || !isLongReview
                ? testimonial.review_text
                : `${testimonial.review_text.slice(0, 130)}...`}
              &rdquo;
            </p>
            {isLongReview && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-[11px] font-semibold text-brand-500 hover:text-brand-700 hover:underline transition-all"
              >
                {isExpanded ? 'Show less' : 'Read full quote'}
              </button>
            )}
          </div>
        </div>

        {/* Live Toggle & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-cream-200/60">
          {/* Active Status Pill */}
          <button
            type="button"
            onClick={() => handleToggle(!testimonial.is_active)}
            disabled={pending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              testimonial.is_active
                ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]/70 hover:bg-[#F6F1EC]/60'
                : 'bg-cream-100 text-muted border-cream-300/70 hover:bg-cream-200/50'
            }`}
            title="Click to toggle live storefront visibility"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : testimonial.is_active ? (
              <Eye className="h-3.5 w-3.5 text-[#024F5F]" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-muted" />
            )}
            <span>{testimonial.is_active ? 'Live' : 'Hidden'}</span>
          </button>

          {/* Edit Link */}
          <Link
            href={`/admin/testimonials/${testimonial.id}/edit`}
            className="p-2 rounded-xl text-muted hover:text-brand-700 hover:bg-cream-100 border border-transparent hover:border-cream-300 transition-all"
            title="Edit Testimonial"
          >
            <Pencil className="h-4 w-4" />
          </Link>

          {/* Delete Button with 2-step confirmation */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className={`flex items-center gap-1 p-2 rounded-xl text-xs font-semibold transition-all ${
              confirmDelete
                ? 'bg-[#024F5F] text-white shadow-xs px-3'
                : 'text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC]/80 border border-transparent hover:border-[#CFAC64]'
            }`}
            title={confirmDelete ? 'Confirm delete now' : 'Delete review'}
          >
            <Trash2 className="h-4 w-4" />
            {confirmDelete && <span>Confirm?</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
