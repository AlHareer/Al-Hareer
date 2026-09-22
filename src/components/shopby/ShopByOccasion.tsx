'use client';

import React from 'react';
import Image from 'next/image';
import { OCCASIONS } from '@/data/occasions';

export default function ShopByOccasion() {
  return (
    <section className="py-10 sm:py-16 md:py-14 bg-cream-50 border-y border-cream-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Header Badge / Line */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="w-6 sm:w-10 h-[1.5px] bg-[#C6B09B]/70" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">
            CURATED ENSEMBLES
          </span>
          <span className="w-6 sm:w-10 h-[1.5px] bg-[#C6B09B]/70" />
        </div>

        {/* Section Heading */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-700 tracking-tight">
          Shop By Occasion
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mt-2 font-normal leading-relaxed">
          From intimate family rituals to grand celebrations, find the perfect look for every moment.
        </p>

        {/* Responsive Grid: 2 cols on mobile, 3 cols on tablet, 6 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5 lg:gap-5 mt-10 sm:mt-12 md:mt-14">
          {OCCASIONS.map((occasion) => (
            <a
              key={occasion.id}
              href="/#shop"
              className="group flex flex-col items-center cursor-pointer select-none"
            >
              {/* Image Card */}
              <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-[5px] overflow-hidden bg-cream-200 border border-cream-300/80 shadow-sm transition-all duration-500 group-hover:shadow-luxury-hover group-hover:-translate-y-1">
                <Image
                  src={occasion.image}
                  alt={occasion.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle Bottom Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                {/* Floating Bottom Gold Badge */}
                <div className="absolute bottom-2.5 left-2 right-2 sm:bottom-3 sm:left-2.5 sm:right-2.5">
                  <div className="w-full py-1.5 sm:py-2 px-2 rounded-[5px] bg-[#1F1813]/80 backdrop-blur-md border border-[#D4AF37]/50 text-center shadow-md transition-all duration-300 group-hover:bg-[#1F1813]/95 group-hover:border-[#D4AF37]/90">
                    <span className="block text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#F5E6BE] truncate">
                      {occasion.tag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title Below Image */}
              <h3 className="font-heading text-base sm:text-lg font-semibold text-brand-700 mt-2.5 sm:mt-3 text-center group-hover:text-brand-500 transition-colors duration-300 tracking-wide">
                {occasion.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
