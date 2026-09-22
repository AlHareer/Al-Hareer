'use client';

import React from 'react';
import { Leaf, Gem, Star } from 'lucide-react';

const HangerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 4a3 3 0 0 0-3 3c0 1.5 1 2.5 3 3.5l8.5 4.5A2 2 0 0 1 21 16.8v.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-.2a2 2 0 0 1 .5-1.8L12 10.5" />
    <path d="M3 17h18" />
  </svg>
);

const pillars = [
  {
    icon: HangerIcon,
    title: 'Traditional Roots',
    subtitle: 'Inspired by Heritage',
  },
  {
    icon: Leaf,
    title: 'Modern Comfort',
    subtitle: 'Made for Today',
  },
  {
    icon: Gem,
    title: 'Elegant Designs',
    subtitle: 'For Every Occasion',
  },
  {
    icon: Star,
    title: 'A Better Tomorrow',
    subtitle: 'Through Conscious Fashion',
  },
];

export default function TrustBar() {
  return (
    <section className="relative w-full bg-[#252821] text-[#FAF6F1] py-4 sm:py-5 border-t border-[#363A2F] overflow-hidden select-none">
      {/* Left Gradient Edge Mask for Smooth Luxury Fade */}
      <div className="absolute left-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-r from-[#252821] to-transparent z-10 pointer-events-none" />

      {/* Right Gradient Edge Mask for Smooth Luxury Fade */}
      <div className="absolute right-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-l from-[#252821] to-transparent z-10 pointer-events-none" />

      {/* Infinite Continuous Auto Marquee / Carousel */}
      <div className="w-full overflow-hidden flex">
        <div className="animate-marquee-infinite flex items-center">
          {/* 4 Identical sets of pillars for 100% seamless, jump-free infinite loop */}
          {[...Array(4)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center flex-shrink-0">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={`${setIdx}-${idx}`} className="flex items-center flex-shrink-0">
                    <div className="flex items-center gap-3 sm:gap-4 mx-5 sm:mx-8 lg:mx-10 group cursor-default transition-transform duration-200">
                      <div className="text-[#C6B09B] group-hover:text-[#EDC967] group-hover:scale-110 transition-all flex-shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                      </div>
                      <div className="whitespace-nowrap">
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-white tracking-wide leading-tight group-hover:text-[#F5E6BE] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[#A39E93] mt-0.5 leading-tight">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Subtle Luxury Dot Divider between items */}
                    <span className="w-1 h-1 rounded-full bg-[#C6B09B]/40 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
