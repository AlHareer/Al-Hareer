'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ContentSettings } from '@/lib/siteSettings';

type KurtaStyle = { name: string; slug: string; image: string; link?: string };

const SCROLL_AMOUNT = 320;

export default function ShopByCategory({ settings }: { settings: ContentSettings }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  let styles: KurtaStyle[] = [];
  try {
    const parsed = JSON.parse(settings.home_kurta_styles || '[]');
    if (Array.isArray(parsed)) styles = parsed.filter((s) => s.name && s.slug);
  } catch { /* ignore */ }

  if (styles.length === 0) return null;

  const heading = settings.home_kurtatype_heading || 'Shop By Kurta Type';
  const subtitle = settings.home_kurtatype_subtitle || 'Explore our curated collections, crafted for every occasion.';
  const showArrows = styles.length > 4;

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-cream-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-700 tracking-tight">
            {heading}
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mt-2">
            {subtitle}
          </p>
        </div>

        <div className="relative">
          {showArrows && (
            <button
              onClick={() => scroll('left')}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 w-10 h-10 rounded-full bg-white border border-cream-300 shadow-md items-center justify-center text-brand-700 hover:bg-cream-100 hover:shadow-luxury-hover transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex items-start gap-5 sm:gap-10 md:gap-14 overflow-x-auto no-scrollbar pb-1 px-2 sm:px-0 justify-start sm:justify-center"
          >
            {styles.map((style, idx) => (
              <Link
                key={idx}
                href={style.link || `/shop?category=${encodeURIComponent(style.slug)}`}
                className="group flex shrink-0 flex-col items-center gap-3 sm:gap-4 text-center"
              >
                <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 shrink-0 overflow-hidden rounded-full border border-cream-300 bg-cream-100 shadow-sm transition-all duration-300 group-hover:border-brand-400 group-hover:shadow-luxury-hover">
                  {style.image ? (
                    <Image
                      src={style.image}
                      alt={style.name}
                      fill
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
                      className="object-cover object-[center_22%] transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-heading font-bold text-brand-300">
                      {style.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700 group-hover:text-brand-500 transition-colors">
                  {style.name}
                </span>
              </Link>
            ))}
          </div>

          {showArrows && (
            <button
              onClick={() => scroll('right')}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 w-10 h-10 rounded-full bg-white border border-cream-300 shadow-md items-center justify-center text-brand-700 hover:bg-cream-100 hover:shadow-luxury-hover transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
