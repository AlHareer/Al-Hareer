"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, X, Leaf, Wind, Scissors, Users } from "lucide-react";

export default function AboutSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      id="about"
      className="relative py-10 sm:py-16 md:py-14 bg-[#FAF6F0] overflow-hidden"
    >
      {/* Background Jali / Trellis Watermark on Right */}
      <div className="pointer-events-none absolute top-0 right-0 w-[320px] sm:w-[440px] lg:w-[540px] h-full overflow-hidden opacity-25 select-none -z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="jaliPattern"
              width="70"
              height="70"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M35 0 L70 35 L35 70 L0 35 Z"
                fill="none"
                stroke="#C6B09B"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <circle
                cx="35"
                cy="35"
                r="14"
                fill="none"
                stroke="#C6B09B"
                strokeWidth="0.9"
                strokeOpacity="0.5"
              />
              <circle
                cx="0"
                cy="0"
                r="10"
                fill="none"
                stroke="#C6B09B"
                strokeWidth="0.8"
                strokeOpacity="0.3"
              />
              <circle
                cx="70"
                cy="0"
                r="10"
                fill="none"
                stroke="#C6B09B"
                strokeWidth="0.8"
                strokeOpacity="0.3"
              />
              <circle
                cx="70"
                cy="70"
                r="10"
                fill="none"
                stroke="#C6B09B"
                strokeWidth="0.8"
                strokeOpacity="0.3"
              />
              <circle
                cx="0"
                cy="70"
                r="10"
                fill="none"
                stroke="#C6B09B"
                strokeWidth="0.8"
                strokeOpacity="0.3"
              />
              <path
                d="M0 0 L35 35 M70 0 L35 35 M70 70 L35 35 M0 70 L35 35"
                stroke="#C6B09B"
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#jaliPattern)" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* LEFT: Showcase Image with Overlays */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[580px] rounded-2xl sm:rounded-3xl lg:rounded-l-2xl lg:rounded-tr-[110px] lg:rounded-br-[110px] overflow-hidden shadow-2xl border-4 border-[#E2D7C7]/100">
              <Image
                src="/images/your-image-19.jpg"
                alt="About Al Hareer Craftsmanship"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_15%]"
              />

              {/* Subtle top & bottom dark vignettes for crisp overlay text */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />

              {/* Top Left: Brand Stamp */}
              <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 select-none text-center">
                <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-medium text-white tracking-[0.2em] leading-none drop-shadow-sm">
                  AL HAREER
                </h3>
                <p className="text-[9px] sm:text-[10.5px] uppercase tracking-[0.24em] text-white/90 font-medium mt-1 leading-tight drop-shadow-sm">
                  TRADITION IN STYLE
                </p>
              </div>

              {/* Bottom Left: Heritage Experience Pill */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-[#342418]/95 backdrop-blur-md text-white px-4 py-3 sm:px-5 sm:py-4 rounded-tr-[28px] sm:rounded-tr-[32px] rounded-tl-md rounded-b-md shadow-2xl border border-white/10 z-10 max-w-[175px] sm:max-w-[190px]">
                <div className="w-6 h-[2px] bg-[#9C8271] mb-2" />
                <span className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#EADCCB] block leading-none mb-1">
                  10+
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.18em] font-medium text-[#CBB9AB] block leading-[1.50]">
                  YEARS OF
                  <br />
                  TEXTILE &<br />
                  TAILORING
                  <br />
                  HERITAGE
                </span>
              </div>
            </div>

            {/* Circular Stamp Badge overlapping the right border */}
            <div className="absolute -bottom-5 right-5 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:-right-10 lg:-right-14 z-20">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-30 lg:h-30 rounded-full bg-[#FAF6F0] p-1 shadow-[0_10px_30px_rgba(43,35,29,0.16)] border border-[#E2D7C7] flex items-center justify-center transition-transform duration-500 hover:scale-105 select-none">
                {/* Outer delicate dashed border */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-[#C6B09B]/80 pointer-events-none" />
                <div className="absolute inset-2 rounded-full border border-[#DFCFC0]/60 pointer-events-none" />

                {/* Rotating Circular Text */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full animate-[spin_30s_linear_infinite] hover:[animation-play-state:paused]"
                >
                  <defs>
                    <path
                      id="stampCirclePath"
                      d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                    />
                  </defs>
                  <text className="text-[13.5px] font-semibold tracking-[0.27em] fill-[#4A3525] uppercase">
                    <textPath href="#stampCirclePath" startOffset="0%">
                      • PREMIUM FABRICS • TIMELESS STYLE
                    </textPath>
                  </text>
                </svg>

                {/* Center Botanical Leaves Motif */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#4A3525]">
                  <svg
                    viewBox="0 0 40 40"
                    className="w-8 h-8 sm:w-9 sm:h-9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Center Leaf */}
                    <path
                      d="M20 28V12C20 12 24.5 15.5 24.5 20C24.5 24.5 20 28 20 28Z"
                      fill="currentColor"
                      fillOpacity="0.12"
                    />
                    <path
                      d="M20 28V12C20 12 15.5 15.5 15.5 20C15.5 24.5 20 28 20 28Z"
                      fill="currentColor"
                      fillOpacity="0.12"
                    />
                    {/* Left Petal */}
                    <path
                      d="M19 25C14.5 25 11 20.5 12.5 16C16.5 16.5 19 20.5 19 25Z"
                      fill="currentColor"
                      fillOpacity="0.12"
                    />
                    {/* Right Petal */}
                    <path
                      d="M21 25C25.5 25 29 20.5 27.5 16C23.5 16.5 21 20.5 21 25Z"
                      fill="currentColor"
                      fillOpacity="0.12"
                    />
                    {/* Stem and side accent dots */}
                    <path d="M20 28V31" strokeWidth="2" />
                    <circle cx="14" cy="27" r="1" fill="currentColor" />
                    <circle cx="26" cy="27" r="1" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Content & Information */}
          <div className="lg:col-span-6 relative pt-4 lg:pt-0 space-y-6 sm:space-y-7">
            {/* Top Right Mini Pillars Navigation (Desktop & Tablet) */}
            <div className="flex items-start justify-between">
              {/* Tag / Category */}
              <div className="flex items-center gap-3">
                <span className="w-7 h-[1.5px] bg-[#655B53]" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#655B53]">
                  ABOUT Al Hareer
                </span>
              </div>

              {/* Pillars Block */}
              <div className="hidden sm:block border-l border-[#D6C7B2] pl-5 space-y-1 select-none">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#4A3525] uppercase">
                  HERITAGE
                </p>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#4A3525] uppercase">
                  CRAFTSMANSHIP
                </p>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#4A3525] uppercase">
                  MODERN LIVING
                </p>
                <div className="w-7 h-[2px] bg-gold mt-2" />
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-medium text-[#2B231D] leading-[1.15] tracking-tight">
              Tradition, Quality &amp; <br />
              <span className="font-serif italic font-normal text-[#3E2D20]">
                Modern Elegance
              </span>
            </h2>

            {/* Description Text */}
            <div className="space-y-4 text-sm sm:text-[15px] text-[#655B53] font-body leading-relaxed max-w-xl">
              <p>
                Al Hareer is a contemporary traditional menswear brand created for
                men who appreciate timeless style, premium fabrics, and
                breathable ease.
              </p>
              <p>
                We bring together the richness of Indian and South Asian fashion
                with modern cuts, subtle placket detailing, and refined
                aesthetics suited for festivities, weddings, and everyday grace.
              </p>
            </div>

            {/* 4 Feature Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 pt-2 pb-2">
              {/* 1. Handloom */}
              <div className="space-y-2.5">
                <Leaf className="w-6 h-6 text-[#4A3525]" strokeWidth={1.5} />
                <p className="text-xs sm:text-[13px] font-medium text-[#2B231D] leading-snug">
                  Premium Quality
                  <br />
                  Handloom &amp; Slub
                  <br />
                  Fabrics
                </p>
              </div>

              {/* 2. Breathable */}
              <div className="space-y-2.5">
                <Wind className="w-6 h-6 text-[#4A3525]" strokeWidth={1.5} />
                <p className="text-xs sm:text-[13px] font-medium text-[#2B231D] leading-snug">
                  Comfortable
                  <br />
                  All-Day
                  <br />
                  Breathable Fit
                </p>
              </div>

              {/* 3. Tailored */}
              <div className="space-y-2.5">
                <Scissors
                  className="w-6 h-6 text-[#4A3525]"
                  strokeWidth={1.5}
                />
                <p className="text-xs sm:text-[13px] font-medium text-[#2B231D] leading-snug">
                  Modern Traditional
                  <br />
                  Tailored Designs
                </p>
              </div>

              {/* 4. Artisanal */}
              <div className="space-y-2.5">
                <Users className="w-6 h-6 text-[#4A3525]" strokeWidth={1.5} />
                <p className="text-xs sm:text-[13px] font-medium text-[#2B231D] leading-snug">
                  Customer First
                  <br />
                  Artisanal Approach
                </p>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-3">
              {/* Discover Our Story CTA */}
              <Link
                href="/story"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[4px] bg-[#3E2D20] text-white font-medium text-sm transition-all duration-300 hover:bg-[#2A1D14] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Watch Video Button */}
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="group inline-flex items-center gap-3 text-sm font-medium text-[#2B231D] hover:text-[#4A3525] transition-colors cursor-pointer"
              >
                <span className="w-11 h-11 rounded-full bg-[#EADDCF] flex items-center justify-center transition-all duration-300 group-hover:bg-[#DFCDB8] group-hover:scale-105 shadow-sm">
                  <Play className="w-4 h-4 text-[#3E2D20] fill-[#3E2D20] ml-0.5" />
                </span>
                <span className="tracking-wide">Watch Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Craftsmanship Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#1A1410] rounded-2xl overflow-hidden shadow-2xl border border-cream-300/30">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#2B231D]">
              <div className="flex items-center gap-3">
                <span className="font-heading text-lg text-cream-100 font-semibold tracking-wider">
                  Al Hareer Craftsmanship &amp; Heritage
                </span>
              </div>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/fJ9rUzIMcZQ?autoplay=1&rel=0"
                title="Al Hareer Craftsmanship"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
