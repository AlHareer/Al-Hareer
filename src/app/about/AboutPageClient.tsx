'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Home,
  Star,
  CheckCircle2,
  Sparkles,
  Scissors,
  Leaf,
  ShieldCheck,
  Heart,
  Award,
  Users,
  Feather,
  Clock,
  Shirt,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutSection from '@/components/sections/AboutSection';
import Testimonials from '@/components/sections/Testimonials';
import type { Testimonial } from '@/types';
import type { ContentSettings } from '@/lib/siteSettings';

function parseJsonList<T>(raw: string | undefined, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) && parsed.length === fallback.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

const PILLAR_ICONS = [Shirt, Scissors, Leaf, Award];

export default function AboutPageClient({
  testimonials,
  homeSettings,
  aboutSettings,
}: {
  testimonials: Testimonial[];
  homeSettings: ContentSettings;
  aboutSettings: ContentSettings;
}) {
  const stats = parseJsonList<{ value: string; label: string; desc: string }>(aboutSettings.about_stats_items, [
    { value: '100%', label: 'Artisanal Handloom', desc: 'Ethically sourced natural fibres' },
    { value: '50k+', label: 'Gentlemen Styled', desc: 'Across India & international diaspora' },
    { value: '120+', label: 'Master Weavers', desc: 'Sustaining generational weaving families' },
    { value: '4.9★', label: 'Patron Satisfaction', desc: 'Over 1,200+ verified 5-star reviews' },
  ]);

  const pillarText = parseJsonList<{ title: string; desc: string; badge: string }>(aboutSettings.about_pillars_items, [
    {
      title: 'Heritage Weaves & Pure Fibres',
      desc: 'From handspun organic cotton slubs to iridescent Chanderi silks, every textile is breathable, pre-washed for shrink resistance, and chosen to last generations.',
      badge: 'Zero Synthetic Blends',
    },
    {
      title: 'Bespoke Tailored Silhouette',
      desc: 'Our silhouettes bridge regal grandeur with modern ergonomics. Designed with shoulder room, seamless plackets, and natural drape for unmatched ease.',
      badge: 'Flawless Fit',
    },
    {
      title: 'Conscious & Slow Fashion',
      desc: 'We reject high-speed mass manufacturing. Each batch is curated in limited runs to respect weaver livelihoods, minimize waste, and celebrate individuality.',
      badge: 'Ethical Looms',
    },
    {
      title: 'Royal Handcrafted Finishing',
      desc: 'Tone-on-tone resham embroideries, hand-stitched mandarin collars, and metal-crested brass buttons add an unmistakable aura of refined distinction.',
      badge: 'Artisanal Touch',
    },
  ]);
  const pillars = pillarText.map((p, i) => {
    const Icon = PILLAR_ICONS[i];
    return { ...p, icon: <Icon className="w-6 h-6 text-[#024F5F]" /> };
  });

  const processText = parseJsonList<{ title: string; desc: string }>(aboutSettings.about_process_items, [
    {
      title: 'Fibre & Yarn Sourcing',
      desc: 'Direct partnerships with farm-level co-ops for pure long-staple cotton, natural linen, and cruelty-free mulberry silken threads.',
    },
    {
      title: 'Traditional Loom Weaving',
      desc: 'Loomed by master artisans in historic textile hubs using centuries-old pit looms and jacquard frames.',
    },
    {
      title: 'Tailoring & Mandarin Collars',
      desc: 'Each garment is hand-cut and assembled by seasoned tailors ensuring immaculate collar symmetry and stitch density.',
    },
    {
      title: 'Quality Check & Signature Box',
      desc: 'Subjected to a 14-point inspection, hand-pressed, and wrapped in aromatic butter paper inside our luxury keepsake box.',
    },
  ]);
  const processSteps = processText.map((p, i) => ({ ...p, number: String(i + 1).padStart(2, '0') }));

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1EC] text-[#00303A] selection:bg-[#024F5F] selection:text-white">
      <Navbar />

      {/* 1. TOP HERO / SECTION INTRO */}
      <section className="relative overflow-hidden bg-[#F6F1EC] border-b border-[#CFAC64]">
        {/* Background Decorative Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] md:w-[48%] lg:w-[42%] pointer-events-none select-none overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={aboutSettings.about_hero_image || '/images/shop-banner-arch.jpg'}
              alt="About Al Hareer Atelier"
              fill
              priority
              className="object-cover object-right opacity-30 sm:opacity-80"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F6F1EC] via-[#F6F1EC]/80 to-transparent sm:via-[#F6F1EC]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F6F1EC]/60 to-transparent sm:hidden" />
          </div>
        </div>

        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-12 pt-3 sm:pt-4 lg:pt-4 pb-4 sm:pb-6 lg:pb-6 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#024F5F] mb-2.5 sm:mb-3.5 lg:mb-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[#024F5F] hover:text-[#00303A] transition-colors">
              <Home className="w-3.5 h-3.5 text-[#024F5F]" />
              <span>Home</span>
            </Link>
            <span className="text-[#CFAC64] font-light">&gt;</span>
            <span className="font-semibold text-[#00303A]">About Us</span>
          </nav>

          {/* Centered Banner Header on Desktop */}
          <div className="relative flex items-center justify-between lg:justify-center gap-4">
            <div className="max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl lg:mx-auto lg:text-center flex flex-col items-start lg:items-center">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-1.5 justify-start lg:justify-center">
                <span className="w-5 sm:w-7 lg:w-8 h-[1.5px] bg-[#024F5F]"></span>
                <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#024F5F] uppercase">
                  {aboutSettings.about_hero_eyebrow}
                </span>
                <span className="hidden lg:inline-block w-8 h-[1.5px] bg-[#024F5F]"></span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-bold text-[#00303A] tracking-tight leading-[1.08] mb-1">
                {aboutSettings.about_hero_title}
              </h1>

              <p className="font-body text-[#024F5F] text-xs sm:text-sm font-normal leading-snug">
                {aboutSettings.about_hero_subtitle}
              </p>
            </div>

            {/* Right Calligraphy */}
            <div className="flex flex-col items-center justify-center text-center select-none shrink-0 lg:absolute lg:right-6 xl:right-12 lg:top-1/2 lg:-translate-y-1/2 sm:pr-16 md:pr-24 lg:pr-0">
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#024F5F] leading-none tracking-wide">
                {aboutSettings.about_hero_calligraphy_line1}
              </span>
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#024F5F] leading-none tracking-wide mt-0.5">
                {aboutSettings.about_hero_calligraphy_line2}
              </span>
              <div className="w-4 sm:w-5 h-[1.5px] bg-[#024F5F] mx-auto mt-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT Al Hareer (Exact matching homepage showcase with arch, rotating stamp, 4 pillars & video modal) */}
      <AboutSection settings={homeSettings} />

      {/* 3. METRICS / STATS BAR */}
      <section className="bg-white border-y border-[#CFAC64] py-10 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-4 sm:p-5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] hover:shadow-xs transition-all"
              >
                <p className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#024F5F] mb-1">
                  {stat.value}
                </p>
                <p className="font-bold text-xs sm:text-sm text-[#00303A] tracking-wide">
                  {stat.label}
                </p>
                <p className="text-[11px] sm:text-xs text-[#024F5F] mt-0.5 font-light">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PILLARS OF EXCELLENCE */}
      <section className="py-14 sm:py-18 lg:py-20 bg-[#F6F1EC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-2.5 mb-2">
              <span className="w-6 h-[1.5px] bg-[#024F5F]"></span>
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#024F5F]">
                {aboutSettings.about_pillars_eyebrow}
              </span>
              <span className="w-6 h-[1.5px] bg-[#024F5F]"></span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#00303A]">
              {aboutSettings.about_pillars_heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#024F5F] mt-2 leading-relaxed">
              {aboutSettings.about_pillars_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-[#CFAC64] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#F6F1EC] text-[#024F5F] px-2 py-0.5 rounded mb-2.5">
                    {pillar.badge}
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#00303A] mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#024F5F] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROCESS & MAKING TIMELINE */}
      <section className="py-14 sm:py-18 bg-white border-y border-[#CFAC64]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#024F5F] block mb-1">
              {aboutSettings.about_process_eyebrow}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#00303A]">
              {aboutSettings.about_process_heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#024F5F] mt-2">
              {aboutSettings.about_process_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className="relative p-6 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-heading text-3xl sm:text-4xl font-bold text-[#024F5F]/30 block mb-2">
                    {step.number}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#00303A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#024F5F] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="w-6 h-[2px] bg-[#024F5F] mt-5"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHAT OUR CUSTOMERS SAY (Exact matching homepage review design with infinite marquee & social proof badge) */}
      <Testimonials testimonials={testimonials} />

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="py-12 sm:py-16 bg-[#F6F1EC] border-t border-[#CFAC64]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <span className="w-8 h-[1.5px] bg-[#024F5F] mx-auto block mb-3"></span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#00303A] mb-2">
            {aboutSettings.about_cta_heading}
          </h2>
          <p className="text-xs sm:text-sm text-[#024F5F] max-w-md mx-auto mb-6">
            {aboutSettings.about_cta_subtitle}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#CFAC64] hover:bg-[#B08F4F] text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg group"
          >
            <span>{aboutSettings.about_cta_button_text}</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
