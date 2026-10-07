import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Home,
  Feather,
  Compass,
  Award,
  Scissors,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getStoryContentSettings } from '@/lib/siteSettings';

function parseJsonList<T>(raw: string | undefined, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) && parsed.length === fallback.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

const VALUE_ICONS = [Feather, Scissors, Compass, Award];

export default async function OurStoryPage() {
  const s = await getStoryContentSettings();

  const ch2Stats = parseJsonList<{ value: string; label: string; desc: string }>(s.story_ch2_stats_items, [
    { value: '100%', label: 'Slow Weft Certified', desc: 'Pre-washed, zero synthetic polyester' },
    { value: 'Fair-Pay', label: 'Direct Weaver Support', desc: 'Eliminating exploitative middlemen' },
  ]);

  const milestones = parseJsonList<{ year: string; title: string; desc: string }>(s.story_milestones_items, [
    { year: '2018', title: 'The First Handspun Stitch', desc: '' },
    { year: '2020', title: 'The Festive & Silk Renaissance', desc: '' },
    { year: '2023', title: 'Global Indian Diaspora', desc: '' },
    { year: 'Today', title: 'The 48 Signature Silhouettes', desc: '' },
  ]);

  const valuesText = parseJsonList<{ title: string; desc: string }>(s.story_values_items, [
    { title: 'Living Tradition', desc: '' },
    { title: 'Master Tailoring', desc: '' },
    { title: 'Conscious Production', desc: '' },
    { title: 'Uncompromising Touch', desc: '' },
  ]);
  const values = valuesText.map((v, i) => ({ ...v, icon: VALUE_ICONS[i] }));

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1EC] text-[#00303A] selection:bg-[#024F5F] selection:text-white">
      <Navbar />

      {/* 1. SECTION INTRO / TOP HERO BANNER */}
      <section className="relative overflow-hidden bg-[#F6F1EC] border-b border-[#CFAC64]">
        {/* Arch Graphic Background */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] md:w-[48%] lg:w-[42%] pointer-events-none select-none overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={s.story_hero_image || '/images/shop-banner-arch.jpg'}
              alt="Al Hareer Chronicles - Our Story"
              fill
              priority
              className="object-cover object-right opacity-30 sm:opacity-85"
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
            <span className="font-semibold text-[#00303A]">Our Story</span>
          </nav>

          {/* Centered Banner Header on Desktop */}
          <div className="relative flex items-center justify-between lg:justify-center gap-4">
            <div className="max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl lg:mx-auto lg:text-center flex flex-col items-start lg:items-center">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-1.5 justify-start lg:justify-center">
                <span className="w-5 sm:w-7 lg:w-8 h-[1.5px] bg-[#024F5F]"></span>
                <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#024F5F] uppercase">
                  {s.story_hero_eyebrow}
                </span>
                <span className="hidden lg:inline-block w-8 h-[1.5px] bg-[#024F5F]"></span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-bold text-[#00303A] tracking-tight leading-[1.08] mb-1">
                {s.story_hero_title}
              </h1>

              <p className="font-body text-[#024F5F] text-xs sm:text-sm font-normal leading-snug">
                {s.story_hero_subtitle}
              </p>
            </div>

            {/* Right Calligraphy */}
            <div className="flex flex-col items-center justify-center text-center select-none shrink-0 lg:absolute lg:right-6 xl:right-12 lg:top-1/2 lg:-translate-y-1/2 sm:pr-16 md:pr-24 lg:pr-0">
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#024F5F] leading-none tracking-wide">
                {s.story_hero_calligraphy_line1}
              </span>
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#024F5F] leading-none tracking-wide mt-0.5">
                {s.story_hero_calligraphy_line2}
              </span>
              <div className="w-4 sm:w-5 h-[1.5px] bg-[#024F5F] mx-auto mt-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHAPTER 1: THE GENESIS */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

            {/* Story Text */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-[1.5px] bg-[#024F5F]"></span>
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#024F5F]">
                  {s.story_ch1_eyebrow}
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#00303A] leading-tight">
                {s.story_ch1_heading}
              </h2>

              <p className="text-sm sm:text-base text-[#024F5F] leading-relaxed">
                {s.story_ch1_paragraph1}
              </p>

              <p className="text-sm sm:text-base text-[#024F5F] leading-relaxed">
                {s.story_ch1_paragraph2}
              </p>

              <div className="p-4 rounded-xl bg-[#F6F1EC] border-l-4 border-[#024F5F] border-y border-r border-[#CFAC64]">
                <p className="font-heading text-base sm:text-lg italic text-[#024F5F]">
                  &ldquo;{s.story_ch1_quote}&rdquo;
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#024F5F] font-semibold mt-1">
                  — {s.story_ch1_quote_attribution}
                </p>
              </div>
            </div>

            {/* Split Arch Photography */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-[#CFAC64] group">
                <Image
                  src={s.story_ch1_image1 || '/images/your-image-19.jpg'}
                  alt="The Handloom Roots"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00303A]/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white">
                  {s.story_ch1_image1_caption}
                </span>
              </div>

              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-[#CFAC64] group mt-6 sm:mt-8">
                <Image
                  src={s.story_ch1_image2 || '/images/same.jpg'}
                  alt="Modern Ethnic Fitting"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00303A]/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white">
                  {s.story_ch1_image2_caption}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CHAPTER 2: WEAVERS & MASTER CRAFTSMEN */}
      <section className="py-14 sm:py-20 bg-white border-y border-[#CFAC64]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

            {/* Visual Image */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative aspect-[4/5] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 border-[#CFAC64]">
                <Image
                  src={s.story_ch2_image || '/images/shopby/wedding.jpg'}
                  alt="Weaving Mastery"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00303A]/75 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-heading text-xl font-bold">
                    {s.story_ch2_weaver_name}
                  </p>
                  <p className="text-xs text-white/80 font-light mt-0.5">
                    {s.story_ch2_weaver_desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-[1.5px] bg-[#024F5F]"></span>
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#024F5F]">
                  {s.story_ch2_eyebrow}
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#00303A] leading-tight">
                {s.story_ch2_heading}
              </h2>

              <p className="text-sm sm:text-base text-[#024F5F] leading-relaxed">
                {s.story_ch2_paragraph1}
              </p>

              <p className="text-sm sm:text-base text-[#024F5F] leading-relaxed">
                {s.story_ch2_paragraph2}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {ch2Stats.map((stat, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-[#F6F1EC] border border-[#CFAC64]">
                    <p className="font-heading text-2xl font-bold text-[#024F5F]">{stat.value}</p>
                    <p className="text-xs font-semibold text-[#00303A] mt-0.5">{stat.label}</p>
                    <p className="text-[11px] text-[#024F5F] mt-0.5">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CHAPTER 3: THE FOUR MILESTONES (TIMELINE) */}
      <section className="py-14 sm:py-20 bg-[#F6F1EC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#024F5F] block mb-1">
              {s.story_ch3_eyebrow}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#00303A]">
              {s.story_ch3_heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#024F5F] mt-2">
              {s.story_ch3_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-[#CFAC64] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="font-heading text-3xl sm:text-4xl font-bold text-[#024F5F] block mb-2 group-hover:scale-105 transition-transform">
                    {m.year}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#00303A] mb-2 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#024F5F] leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="w-8 h-[2px] bg-[#024F5F] mt-5"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CHAPTER 4: CORE VALUES / PHILOSOPHY */}
      <section className="py-14 sm:py-20 bg-white border-y border-[#CFAC64]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#024F5F] block mb-1">
              {s.story_ch4_eyebrow}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#00303A]">
              {s.story_ch4_heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] flex flex-col justify-between hover:shadow-xs transition-all"
                >
                  <div>
                    <div className="w-11 h-11 rounded-full bg-white border border-[#CFAC64] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-[#024F5F]" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#00303A] mb-2">
                      {v.title}
                    </h3>
                    <p className="text-xs text-[#024F5F] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-14 sm:py-18 bg-[#F6F1EC] text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <span className="w-8 h-[1.5px] bg-[#024F5F] mx-auto block mb-3"></span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#00303A] mb-2">
            {s.story_cta_heading}
          </h2>
          <p className="text-xs sm:text-sm text-[#024F5F] max-w-md mx-auto mb-6">
            {s.story_cta_subtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#CFAC64] hover:bg-[#B08F4F] text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg group cursor-pointer"
            >
              <span>{s.story_cta_button1_text}</span>
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white hover:bg-[#F6F1EC] text-[#024F5F] font-semibold text-sm tracking-wide border border-[#CFAC64] transition-colors"
            >
              <span>{s.story_cta_button2_text}</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
