'use client';

import React from 'react';
import Image from 'next/image';
import { Feather } from 'lucide-react';
import type { ContentSettings } from '@/lib/siteSettings';

export default function OurStory({ settings }: { settings: ContentSettings }) {
  const [headingLine1, headingLine2] = settings.home_ourstory_heading.split('\n');
  const img1 = settings.home_ourstory_image1 || '/images/your-image-19.jpg';
  const img2 = settings.home_ourstory_image2 || '/images/same.jpg';

  return (
    <section id="story" className="py-10 sm:py-16 md:py-14 bg-cream-50 border-t border-cream-300 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center">
          
          {/* Center Story Content (First on mobile, Center on desktop) */}
          <div className="w-full lg:col-span-4 lg:order-2 text-center space-y-5 sm:space-y-6 px-2 sm:px-6 py-2 sm:py-4 max-w-lg mx-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 mx-auto rounded-full bg-cream-200 border border-cream-300 flex items-center justify-center text-brand-500 shadow-sm">
              <Feather className="w-5 h-5 text-[#024F5F]" />
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#024F5F]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#024F5F]">
                OUR STORY
              </span>
              <span className="w-6 h-[1.5px] bg-[#024F5F]" />
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-bold text-brand-700 leading-tight">
              {headingLine1}
              {headingLine2 && (
                <>
                  {' '}
                  <br />
                  <span className="italic font-normal text-brand-500">{headingLine2}</span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md mx-auto">
              {settings.home_ourstory_paragraph}
            </p>

            <div className="pt-2">
              <a
                href="#shop"
                className="btn-primary w-full sm:w-auto shadow-md"
              >
                Shop The Legacy
              </a>
            </div>
          </div>

          {/* Images: 2-column grid on mobile/tablet, separate columns on desktop */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-6 w-full lg:contents">
            {/* Left Story Image */}
            <div className="lg:col-span-4 lg:order-1 relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-cream-300 group">
              <Image
                src={img1}
                alt="Heritage Tailoring"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00303A]/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white text-[10px] sm:text-xs font-medium tracking-wider uppercase opacity-90">
                Crafted by Hand
              </div>
            </div>

            {/* Right Story Image */}
            <div className="lg:col-span-4 lg:order-3 relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-cream-300 group">
              <Image
                src={img2}
                alt="Modern Traditional Aesthetics"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00303A]/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white text-[10px] sm:text-xs font-medium tracking-wider uppercase opacity-90">
                Modern Silhouette
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

