'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  CheckCircle2,
  Quote,
  Sparkles,
  MapPin,
  Eye,
  EyeOff,
  User,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { createTestimonial, updateTestimonial, type TestimonialFormState } from '@/actions/admin/testimonials';
import ImageUploader from '@/components/admin/ImageUploader';

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

export default function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const isEditing = !!testimonial;
  const action = isEditing ? updateTestimonial : createTestimonial;
  const [state, formAction, pending] = useActionState<TestimonialFormState, FormData>(action, {});

  // Form State for Live Preview
  const [customerName, setCustomerName] = useState(testimonial?.customer_name ?? '');
  const [role, setRole] = useState(testimonial?.role ?? '');
  const [location, setLocation] = useState(testimonial?.location ?? '');
  const [reviewText, setReviewText] = useState(testimonial?.review_text ?? '');
  const [imageUrl, setImageUrl] = useState<string | null>(testimonial?.image_url ?? null);
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [isActive, setIsActive] = useState(testimonial?.is_active ?? true);

  const initials = customerName
    ? customerName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join('')
    : 'AH';

  const ratingDescriptions: Record<number, string> = {
    5: '5.0 — Exceptional & Regal Quality',
    4: '4.0 — Great Craftsmanship',
    3: '3.0 — Satisfactory Experience',
    2: '2.0 — Needs Improvement',
    1: '1.0 — Poor Experience',
  };

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={testimonial.id} />}
      <input type="hidden" name="image_url" value={imageUrl || ''} />
      <input type="hidden" name="rating" value={rating} />
      <input type="hidden" name="is_active" value={isActive ? 'on' : 'off'} />

      {state?.error && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#CFAC64] bg-[#F6F1EC]/90 p-4 text-sm text-[#024F5F] shadow-xs">
          <span className="h-2 w-2 rounded-full bg-[#024F5F] shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Details Panel */}
          <div className="bg-white rounded-2xl border border-cream-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-cream-200/60">
              <User className="h-4 w-4 text-gold" />
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-700">
                Customer Information
              </h2>
            </div>

            {/* Photo & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="shrink-0 space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted block">
                  Customer Photo
                </label>
                <ImageUploader
                  value={imageUrl}
                  onChange={(v) => setImageUrl(v as string | null)}
                  folder="/al-hareer/testimonials"
                  previewClassName="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-cream-300 shadow-xs"
                />
                <p className="text-[10px] text-muted text-center max-w-[110px]">
                  Square portrait works best.
                </p>
              </div>

              <div className="flex-1 w-full space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-700">
                    Customer Name <span className="text-[#024F5F]">*</span>
                  </label>
                  <input
                    required
                    name="customer_name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikramaditya Rathore"
                    className="w-full rounded-xl border border-cream-200 bg-cream-50/40 px-3.5 py-2.5 text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-brand-700">
                      Role / Tag
                    </label>
                    <input
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Verified Buyer, Groom"
                      className="w-full rounded-xl border border-cream-200 bg-cream-50/40 px-3.5 py-2.5 text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-brand-700">
                      City / Location
                    </label>
                    <input
                      name="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Jaipur, Rajasthan"
                      className="w-full rounded-xl border border-cream-200 bg-cream-50/40 px-3.5 py-2.5 text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Selector */}
            <div className="pt-2 border-t border-cream-200/60">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-brand-700">
                  Star Rating
                </label>
                <span className="text-xs font-bold text-[#B08F4F] bg-[#F6F1EC] px-2 py-0.5 rounded-md border border-[#CFAC64]/50">
                  {ratingDescriptions[rating] || `${rating}.0 Stars`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-cream-50/70 border border-cream-200/80 w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-transform"
                    title={`Rate ${star} Stars`}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= rating
                          ? 'fill-[#CFAC64] text-[#CFAC64] drop-shadow-xs'
                          : 'text-cream-300 hover:text-[#B08F4F]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Quote Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-brand-700">
                  Review Quote <span className="text-[#024F5F]">*</span>
                </label>
                <span className="text-[11px] text-muted">
                  {reviewText.length} characters
                </span>
              </div>
              <textarea
                required
                name="review_text"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did the customer say about their kurta set, fabric texture, fit, or stitching?"
                className="w-full rounded-xl border border-cream-200 bg-cream-50/40 p-3.5 text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all leading-relaxed"
              />
            </div>

            {/* Visibility Toggle */}
            <div className="pt-2 border-t border-cream-200/60">
              <label className="text-xs font-semibold text-brand-700 block mb-2">
                Visibility Status
              </label>
              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isActive ? 'bg-[#F6F1EC]/80 text-[#024F5F]' : 'bg-cream-200/70 text-muted'
                    }`}
                  >
                    {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-brand-700">
                        {isActive ? 'Published' : 'Draft'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          isActive
                            ? 'bg-[#F6F1EC]/80 text-[#024F5F]'
                            : 'bg-[#F6F1EC]/70 text-[#024F5F]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActive ? 'bg-[#024F5F] animate-pulse' : 'bg-[#F6F1EC]'
                          }`}
                        />
                        {isActive ? 'Live in Marquee' : 'Hidden from Store'}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted mt-0.5">
                      {isActive
                        ? 'Customers will see this review in the website marquee.'
                        : 'Review is hidden. Only visible to admins in dashboard.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => setIsActive((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                    isActive ? 'bg-[#024F5F]' : 'bg-[#F6F1EC]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-700 hover:to-brand-600 shadow-sm transition-all disabled:opacity-60 active:scale-[0.98]"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                'Update Testimonial'
              ) : (
                'Create Testimonial'
              )}
            </button>
            <Link
              href="/admin/testimonials"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-muted hover:text-brand-700 hover:bg-cream-100 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Right Column: Live Storefront Card Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sticky top-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
              <Quote className="h-3.5 w-3.5 text-gold" />
              <span>Live Storefront Preview</span>
            </div>
            <span className="text-[10px] font-semibold text-gold bg-brand-700 px-2 py-0.5 rounded-full">
              Homepage Carousel
            </span>
          </div>

          {/* Preview Container mirroring storefront design */}
          <div className="bg-[#F6F1EC] p-5 sm:p-6 rounded-2xl border border-cream-300 shadow-xs space-y-4">
            <p className="text-[11px] text-muted text-center font-medium">
              This is how your review appears inside the infinite marquee:
            </p>

            {/* Testimonial Card Replica */}
            <div className="w-full p-5 sm:p-6 rounded-[6px] bg-white border border-cream-300/90 shadow-[0_4px_20px_rgba(0,48,58,0.06)] flex flex-col justify-between transition-all">
              {/* Card Top: Rating Stars & Verified Pill */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex text-[#CFAC64] gap-1">
                    {[...Array(rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#CFAC64] text-[#CFAC64]"
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-500 bg-cream-100 px-2.5 py-0.5 rounded-full border border-cream-200">
                    <CheckCircle2 className="w-3 h-3 text-gold" />{' '}
                    {role || 'Verified Buyer'}
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-brand-700 leading-relaxed italic font-normal min-h-[50px]">
                  &ldquo;{reviewText || 'Your customer review will appear here...'}&rdquo;
                </p>
              </div>

              {/* Card Bottom: Customer Profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-cream-200/80 mt-4">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-cream-300 flex-shrink-0 bg-cream-200 shadow-xs flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={customerName || 'Customer'}
                      fill
                      sizes="44px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="font-heading font-bold text-xs text-brand-600">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-sm font-bold text-brand-700 truncate">
                    {customerName || 'Customer Name'}
                  </h4>
                  <p className="text-[11px] text-muted truncate">
                    {role || 'Verified Buyer'}
                    {location ? ` • ${location}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Status footer pill */}
            <div className="flex items-center justify-center gap-2 pt-2 text-xs">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isActive ? 'bg-[#024F5F] animate-pulse' : 'bg-cream-400'
                }`}
              />
              <span className="text-muted text-[11px]">
                Status:{' '}
                <strong className={isActive ? 'text-[#024F5F]' : 'text-muted-dark'}>
                  {isActive ? 'Active on Storefront' : 'Hidden in Admin Drafts'}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
