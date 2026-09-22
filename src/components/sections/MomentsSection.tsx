'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MomentsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const moments = [
    {
      title: 'Festivals Feel Brighter',
      image: '/images/your-image-20.jpg',
      subtitle: 'Diwali, Eid & Celebrations',
    },
    {
      title: 'Weddings Look Grand',
      image: '/images/your-image-21.jpg',
      subtitle: 'Sangeet, Baraat & Receptions',
    },
    {
      title: 'Everyday Feels Better',
      image: '/images/your-image-22.jpg',
      subtitle: 'Casual Grace & Comfort',
    },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const progress = scrollLeft / maxScroll;
      const index = Math.min(
        Math.max(Math.round(progress * (moments.length - 1)), 0),
        moments.length - 1
      );
      setActiveIndex(index);
    }
  };

  const scrollByCard = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const targetScroll = (maxScroll / (moments.length - 1)) * index;
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  return (
    <section id="collections" className="py-10 sm:py-16 md:py-14 bg-cream-100 border-t border-cream-300 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-4 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="w-6 h-[1.5px] bg-[#655B53]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#655B53]">
                EMOTIONS &amp; MEMORIES
              </span>
              <span className="w-6 h-[1.5px] bg-[#655B53] lg:hidden" />
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-brand-700 leading-tight">
              Not Just Outfits, <br />
              <span className="italic font-normal text-brand-500">But Moments</span>
            </h2>

            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md mx-auto lg:mx-0">
              From joyful festive gatherings to lifelong wedding vows, our ensembles are woven into your cherished memories.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a
                href="#shop"
                className="btn-primary w-full sm:w-auto shadow-md"
              >
                Shop Festive Collection <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              {/* Mobile Arrow Navigation */}
              <div className="flex sm:hidden items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => scrollByCard('left')}
                  className="w-9 h-9 rounded-full border border-cream-300 bg-white hover:bg-cream-200 text-brand-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="Previous card"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCard('right')}
                  className="w-9 h-9 rounded-full border border-cream-300 bg-white hover:bg-cream-200 text-brand-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="Next card"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right 3 Moment Cards (Smooth horizontal swipe on mobile, 3-col grid on desktop) */}
          <div className="lg:col-span-8 min-w-0 w-full overflow-hidden">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0 pb-3 sm:pb-0"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {moments.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative w-[75vw] max-w-[280px] sm:max-w-none sm:w-auto flex-shrink-0 snap-start aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-cream-300 hover:shadow-luxury-hover transition-all duration-500 cursor-pointer"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/35 to-transparent pointer-events-none" />

                  <div className="absolute bottom-5 left-4 right-4 sm:bottom-6 sm:left-5 sm:right-5 text-white space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-gold" /> {item.subtitle}
                    </span>
                    <h4 className="font-heading text-lg sm:text-xl font-bold text-white group-hover:text-gold transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile swipe indicator dots with interactive click */}
            <div className="flex sm:hidden items-center justify-center gap-2 mt-3">
              {moments.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? 'w-6 bg-brand-500'
                      : 'w-2 bg-cream-300 hover:bg-cream-400'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


