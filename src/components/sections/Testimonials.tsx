'use client';

import React from 'react';
import Image from 'next/image';
import { Star, CheckCircle2 } from 'lucide-react';
import type { Testimonial } from '@/types';

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  // Double-duplicated list to ensure perfectly smooth -50% infinite marquee loop across all screen sizes
  const baseList = [...testimonials, ...testimonials];
  const marqueeList = [...baseList, ...baseList];

  return (
    <section className="relative py-10 sm:py-16 md:py-14 bg-cream-50 border-t border-cream-300 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-cream-300/80">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="w-6 h-[1.5px] bg-[#024F5F]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#024F5F]">
                REVIEWS &amp; STORIES
              </span>
              <span className="w-6 h-[1.5px] bg-[#024F5F] md:hidden" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-700">
              What Our Customers Say
            </h2>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-xl mx-auto md:mx-0">
              Real stories from men who wear Al Hareer with pride and poise.
            </p>
          </div>

          {/* Social Proof Badge */}
          <div className="flex items-center gap-3 bg-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-cream-300 shadow-sm self-center md:self-end">
            <div className="flex text-[#CFAC64] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#CFAC64] text-[#CFAC64]" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-brand-700">4.9 / 5.0</span>
            <span className="text-xs text-muted border-l border-cream-300 pl-2.5 hidden sm:inline">
              1,200+ Verified Buyers
            </span>
          </div>
        </div>
      </div>

      {/* Infinite 1-Row Marquee Container with Left & Right Gradient Shadows */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left Gradient Shadow Overlay */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 lg:w-52 bg-gradient-to-r from-cream-50 via-cream-50/90 to-transparent z-20" />

        {/* Right Gradient Shadow Overlay */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 lg:w-52 bg-gradient-to-l from-cream-50 via-cream-50/90 to-transparent z-20" />

        {/* The Continuous Infinite Marquee Row */}
        <div
          className="flex items-stretch gap-5 sm:gap-6 w-max animate-marquee-infinite hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-grab active:cursor-grabbing"
          style={{ animationDuration: '42s' }}
        >
          {marqueeList.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="w-[280px] sm:w-[340px] md:w-[380px] p-5 sm:p-7 rounded-[5px] bg-white border border-cream-300/90 shadow-[0_4px_20px_rgba(0,48,58,0.04)] hover:shadow-luxury-hover hover:border-gold/50 transition-all duration-300 flex flex-col justify-between flex-shrink-0 group relative select-none"
            >
              {/* Card Top: Rating Stars & Verified Pill */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex text-[#CFAC64] gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-[#CFAC64] text-[#CFAC64]" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-brand-500 bg-cream-100 px-2.5 py-0.5 rounded-full border border-cream-200">
                    <CheckCircle2 className="w-3 h-3 text-gold" /> Verified Buyer
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-brand-700 leading-relaxed italic font-normal">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Card Bottom: Customer Profile */}
              <div className="flex items-center gap-3.5 pt-5 border-t border-cream-200/80 mt-5">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-cream-300 flex-shrink-0 bg-cream-200 shadow-sm">
                  {review.image ? (
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center bg-brand-100 text-brand-700 font-bold text-base sm:text-lg select-none">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-sm sm:text-base font-bold text-brand-700 truncate">
                    {review.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-muted truncate">
                    {review.role} • {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
