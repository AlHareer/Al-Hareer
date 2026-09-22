'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Leaf, Scissors, Layers } from 'lucide-react';

export default function CraftedComfort() {
  return (
    <section className="py-10 sm:py-16 md:py-14 bg-cream-100/60 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-block Grid for Desktop / Responsive Stack for Mobile & Tablet */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* Block 1: Left Text & Features Column (Desktop: col-span-4 / col-span-5) */}
          <div className="md:col-span-2 lg:col-span-4 xl:col-span-4 flex flex-col justify-between bg-[#FAF6F0] rounded-[5px] p-6 sm:p-8 xl:p-9 border border-cream-300/100 shadow-lg relative overflow-hidden">
            
            {/* Subtle background curved line / circle watermark on left */}
            <div className="absolute -left-20 top-1/4 w-56 h-56 rounded-full border-[1.5px] border-[#D3C4AF]/30 pointer-events-none -z-0" />
            
            <div className="relative z-10 space-y-4">
              {/* Overline */}
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-[1.5px] bg-[#8B6B52]" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">
                  BESPOKE COMFORT
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-heading text-3xl sm:text-4xl xl:text-[42px] font-bold text-brand-700 leading-[1.15]">
                Crafted For Comfort, <br />
                <span className="italic font-serif-luxury font-normal text-brand-600">
                  Designed For You
                </span>
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-[15px] text-muted leading-relaxed max-w-md">
                Breathable organic fabrics, tailored seams, and timeless cuts — because you deserve nothing less than supreme ease and heritage luxury.
              </p>

              {/* Explore Button */}
              <div className="pt-2">
                <a
                  href="/#shop"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#3E2B1E] text-white font-medium text-sm transition-all duration-300 hover:bg-brand-700 hover:shadow-luxury group cursor-pointer"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Bottom 3 Feature Pills */}
            <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 pt-6 sm:pt-8 mt-6 border-t border-cream-300/80">
              
              {/* Feature 1: Natural Fabrics */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EFE8E0] border border-cream-300/80 flex items-center justify-center shrink-0 text-brand-600">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand-800 leading-tight">
                    NATURAL
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand-800 leading-tight">
                    FABRICS
                  </span>
                </div>
              </div>

              {/* Feature 2: Tailored Fit */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-2.5 border-l border-cream-300/80 pl-2 sm:pl-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EFE8E0] border border-cream-300/80 flex items-center justify-center shrink-0 text-brand-600">
                  <Scissors className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand-800 leading-tight">
                    TAILORED
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand-800 leading-tight">
                    FIT
                  </span>
                </div>
              </div>

              {/* Feature 3: Timeless Designs */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-2.5 border-l border-cream-300/80 pl-2 sm:pl-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EFE8E0] border border-cream-300/80 flex items-center justify-center shrink-0 text-brand-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand-800 leading-tight">
                    TIMELESS
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand-800 leading-tight">
                    DESIGNS
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Block 2: Middle Olive Kurta Portrait Card */}
          <div className="md:col-span-1 lg:col-span-3 xl:col-span-3 relative rounded-[5px] overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] border border-cream-300/80 shadow-sm group">
            <Image
              src="/images/shopby/comfort-kurta.jpg"
              alt="Man wearing olive green linen kurta"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Bottom-left dark frosted glass capsule badge */}
            <div className="absolute bottom-6 left-4 z-10">
              <div className="py-2.5 px-3.5 rounded-[5px] bg-black/60 backdrop-blur-md border border-white/20 text-white/95 shadow-md flex flex-col items-start select-none">
                <span className="w-4 h-[1px] bg-white/70 mb-1.5" />
                <span className="text-[8.5px] sm:text-[9.5px] uppercase font-bold tracking-[0.2em] leading-tight text-white/90">
                  WEAR TRADITION
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] uppercase font-bold tracking-[0.2em] leading-tight text-white/90">
                  LIVE COMFORT
                </span>
              </div>
            </div>
          </div>

          {/* Block 3: Right Handloom Fabric Card with Top-Right Stamp & Bottom Pill */}
          <div className="md:col-span-1 lg:col-span-5 xl:col-span-5 relative rounded-[5px] overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-between p-4 sm:p-6 border border-cream-300/80 shadow-sm group">
            <Image
              src="/images/shopby/heritage-fabric.jpg"
              alt="The Finest Heritage Handloom Fabrics"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 42vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Top-Right Floating Circular Stamp */}
            <div className="flex justify-end relative z-10">
              <div className="w-22 h-22 sm:w-26 sm:h-26 md:w-28 md:h-28 rounded-full bg-[#FAF6F0]/95 backdrop-blur-md border border-[#E2D7C7] p-2.5 sm:p-3 flex flex-col items-center justify-center text-center shadow-lg select-none">
                <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-700 mb-1" />
                <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-wider font-bold text-brand-800 leading-tight">
                  TRADITION<br />MEETS<br />MODERN COMFORT
                </span>
                <span className="w-4 h-[1px] bg-brand-400 mt-1" />
              </div>
            </div>

            {/* Bottom Floating White/Cream Pill */}
            <div className="relative z-10 mt-auto pt-4">
              <a
                href="#about"
                className="w-full flex items-center justify-between gap-3 sm:gap-4 bg-[#FAF6F0]/95 backdrop-blur-md rounded-[5px] py-3 px-4 sm:px-6 border border-[#E2D7C7]/90 shadow-luxury hover:bg-white hover:border-[#D4AF37]/60 transition-all duration-300 group/pill"
              >
                {/* Left: Handloom Excellence */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-4 h-[1.5px] bg-brand-500" />
                  <span className="text-[9.5px] sm:text-[11px] font-bold tracking-[0.18em] text-brand-700 uppercase">
                    HANDLOOM EXCELLENCE
                  </span>
                </div>

                {/* Center Divider & Title */}
                <div className="flex items-center gap-3 border-l border-brand-300/80 pl-3 sm:pl-4 min-w-0">
                  <h3 className="font-heading text-xs sm:text-base md:text-lg font-semibold text-brand-800 truncate">
                    The Finest Heritage Fabrics
                  </h3>
                </div>

                {/* Right: Circular Arrow Button */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-brand-400/80 flex items-center justify-center text-brand-700 group-hover/pill:bg-[#3E2B1E] group-hover/pill:border-[#3E2B1E] group-hover/pill:text-white transition-all duration-300 shrink-0">
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/pill:translate-x-0.5" />
                </div>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
