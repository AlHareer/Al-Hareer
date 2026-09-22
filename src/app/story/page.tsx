'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Home,
  ArrowRight,
  Feather,
  Sparkles,
  Heart,
  Clock,
  Compass,
  Award,
  Shirt,
  Scissors,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function OurStoryPage() {
  const milestones = [
    {
      year: '2018',
      title: 'The First Handspun Stitch',
      desc: 'Frustrated by scratchy synthetic kurtas in the market, our founders partnered with two master weaving families in Varanasi to craft 4 signature pure cotton kurtas.',
    },
    {
      year: '2020',
      title: 'The Festive & Silk Renaissance',
      desc: 'Introduced authentic Chanderi silk and silk-cotton blends, expanding beyond daily whites into royal emerald greens, deep maroons, and midnight blacks.',
    },
    {
      year: '2023',
      title: 'Global Indian Diaspora',
      desc: 'Dressing grooms and celebration attendees across 20+ countries, bringing effortless Indian royal heritage to weddings in the US, UK, Canada, and UAE.',
    },
    {
      year: 'Today',
      title: 'The 48 Signature Silhouettes',
      desc: 'From Nehru waistcoats to bespoke churi pajamas and artisanal long kurtas, continuing our pledge of unhurried, generational Indian luxury.',
    },
  ];

  const values = [
    {
      icon: <Feather className="w-5 h-5 text-[#4A3525]" />,
      title: 'Living Tradition',
      desc: 'We do not view Indian wear as mere ceremonial costume. We make it an organic, comfortable extension of everyday life.',
    },
    {
      icon: <Scissors className="w-5 h-5 text-[#4A3525]" />,
      title: 'Master Tailoring',
      desc: 'No boxy cuts. Every silhouette follows human anatomy with tailored shoulders and clean falls that look regal on every body type.',
    },
    {
      icon: <Compass className="w-5 h-5 text-[#4A3525]" />,
      title: 'Conscious Production',
      desc: 'Direct fair-trade wages for artisans, small-batch runs to eliminate fashion waste, and recyclable plastic-free packaging.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#4A3525]" />,
      title: 'Uncompromising Touch',
      desc: 'If a textile does not pass our softness, breathability, and colorfast wash test, it never enters our collection.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2B231D] selection:bg-[#4A3525] selection:text-white">
      <Navbar />

      {/* 1. SECTION INTRO / TOP HERO BANNER */}
      <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#E8DFD5]">
        {/* Arch Graphic Background */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] md:w-[48%] lg:w-[42%] pointer-events-none select-none overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/images/shop-banner-arch.jpg"
              alt="Al Hareer Chronicles - Our Story"
              fill
              priority
              className="object-cover object-right opacity-30 sm:opacity-85"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/80 to-transparent sm:via-[#FAF6F0]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0]/60 to-transparent sm:hidden" />
          </div>
        </div>

        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-12 pt-3 sm:pt-4 lg:pt-4 pb-4 sm:pb-6 lg:pb-6 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#7A6F66] mb-2.5 sm:mb-3.5 lg:mb-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[#7A6F66] hover:text-[#2B231D] transition-colors">
              <Home className="w-3.5 h-3.5 text-[#7A6F66]" />
              <span>Home</span>
            </Link>
            <span className="text-[#A89C8F] font-light">&gt;</span>
            <span className="font-semibold text-[#2B231D]">Our Story</span>
          </nav>

          {/* Centered Banner Header on Desktop */}
          <div className="relative flex items-center justify-between lg:justify-center gap-4">
            <div className="max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl lg:mx-auto lg:text-center flex flex-col items-start lg:items-center">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-1.5 justify-start lg:justify-center">
                <span className="w-5 sm:w-7 lg:w-8 h-[1.5px] bg-[#4A3525]"></span>
                <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#4A3525] uppercase">
                  THE AL HAREER CHRONICLES
                </span>
                <span className="hidden lg:inline-block w-8 h-[1.5px] bg-[#4A3525]"></span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-black text-[#1F1813] tracking-tight leading-[1.08] mb-1">
                Our Story
              </h1>

              <p className="font-body text-[#7A6F66] text-xs sm:text-sm font-normal leading-snug">
                Rooted in Tradition. Styled for Today.
              </p>
            </div>

            {/* Right Calligraphy */}
            <div className="flex flex-col items-center justify-center text-center select-none shrink-0 lg:absolute lg:right-6 xl:right-12 lg:top-1/2 lg:-translate-y-1/2 sm:pr-16 md:pr-24 lg:pr-0">
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#7A6F66] leading-none tracking-wide">
                Wear
              </span>
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#7A6F66] leading-none tracking-wide mt-0.5">
                Your Legacy
              </span>
              <div className="w-4 sm:w-5 h-[1.5px] bg-[#9E9185] mx-auto mt-1"></div>
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
                <span className="w-6 h-[1.5px] bg-[#4A3525]"></span>
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#4A3525]">
                  CHAPTER ONE • THE GENESIS
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1F1813] leading-tight">
                Born From a Disconnect Between Pride &amp; Comfort
              </h2>

              <p className="text-sm sm:text-base text-[#5C5147] leading-relaxed">
                Every Indian man knows the familiar feeling: an upcoming family wedding, Eid celebration, or Diwali puja, followed by the exhausting search for an ethnic outfit. Most options on modern racks were either paper-stiff polyesters that turned stifling within minutes, or ill-fitting garments made without regard for silhouette.
              </p>

              <p className="text-sm sm:text-base text-[#5C5147] leading-relaxed">
                Al Hareer started in 2018 with a singular mission: to make ethnic menswear so comfortable, breathable, and gracefully fitted that you would eagerly choose to wear it, not just endure it for rituals.
              </p>

              <div className="p-4 rounded-xl bg-[#FAF6F1] border-l-4 border-[#4A3525] border-y border-r border-[#E8DFD5]">
                <p className="font-heading text-base sm:text-lg italic text-[#4A3525]">
                  &ldquo;A man should look noble in his roots without sacrificing an ounce of physical ease.&rdquo;
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#7A6F66] font-semibold mt-1">
                  — Founding Motto, Al Hareer Atelier
                </p>
              </div>
            </div>

            {/* Split Arch Photography */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-[#E5DACD] group">
                <Image
                  src="/images/your-image-19.jpg"
                  alt="The Handloom Roots"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white">
                  Generational Weft
                </span>
              </div>

              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-[#E5DACD] group mt-6 sm:mt-8">
                <Image
                  src="/images/same.jpg"
                  alt="Modern Ethnic Fitting"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white">
                  Modern Tailoring
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CHAPTER 2: WEAVERS & MASTER CRAFTSMEN */}
      <section className="py-14 sm:py-20 bg-white border-y border-[#E8DFD5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Visual Image */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative aspect-[4/5] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 border-[#E5DACD]">
                <Image
                  src="/images/shopby/wedding.jpg"
                  alt="Weaving Mastery"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-heading text-xl font-bold">
                    Master Weaver Ramzan Ali &amp; Clan
                  </p>
                  <p className="text-xs text-white/80 font-light mt-0.5">
                    3rd-generation jacquard loom artisans, Chanderi clusters.
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-[1.5px] bg-[#4A3525]"></span>
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#4A3525]">
                  CHAPTER TWO • THE WEAVERS
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1813] leading-tight">
                Keeping the Handloom Hearth Burning
              </h2>

              <p className="text-sm sm:text-base text-[#5C5147] leading-relaxed">
                Behind every Al Hareer kurta are real people—hands that have spun threads for four decades, eyes that spot a thread tension discrepancy in milliseconds, and hearts full of pride for their craft.
              </p>

              <p className="text-sm sm:text-base text-[#5C5147] leading-relaxed">
                In an era where powerlooms churn out synthetic replicas in seconds, our artisans work with wooden pit looms, guiding silken threads by pedal and shuttle. By paying above-standard fair living wages and providing year-round steady orders, we ensure this irreplaceable heritage is passed on to the next generation.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-lg bg-[#FAF6F1] border border-[#E5DACD]">
                  <p className="font-heading text-2xl font-bold text-[#4A3525]">100%</p>
                  <p className="text-xs font-semibold text-[#2B231D] mt-0.5">Slow Weft Certified</p>
                  <p className="text-[11px] text-[#7A6F66] mt-0.5">Pre-washed, zero synthetic polyester</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#FAF6F1] border border-[#E5DACD]">
                  <p className="font-heading text-2xl font-bold text-[#4A3525]">Fair-Pay</p>
                  <p className="text-xs font-semibold text-[#2B231D] mt-0.5">Direct Weaver Support</p>
                  <p className="text-[11px] text-[#7A6F66] mt-0.5">Eliminating exploitative middlemen</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CHAPTER 3: THE FOUR MILESTONES (TIMELINE) */}
      <section className="py-14 sm:py-20 bg-[#FAF6F0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#4A3525] block mb-1">
              CHAPTER THREE • THE EVOLUTION
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1813]">
              Milestones of Our Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6F66] mt-2">
              From four prototype shirts in a humble living room to dressing gentlemen around the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="font-heading text-3xl sm:text-4xl font-black text-[#4A3525] block mb-2 group-hover:scale-105 transition-transform">
                    {m.year}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#2B231D] mb-2 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#5C5147] leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="w-8 h-[2px] bg-[#4A3525] mt-5"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CHAPTER 4: CORE VALUES / PHILOSOPHY */}
      <section className="py-14 sm:py-20 bg-white border-y border-[#E8DFD5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#4A3525] block mb-1">
              THE AL HAREER CODE
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1813]">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] flex flex-col justify-between hover:shadow-xs transition-all"
              >
                <div>
                  <div className="w-11 h-11 rounded-full bg-white border border-[#DACDC0] flex items-center justify-center mb-4">
                    {v.icon}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#2B231D] mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs text-[#655B53] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-14 sm:py-18 bg-[#FAF6F0] text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <span className="w-8 h-[1.5px] bg-[#4A3525] mx-auto block mb-3"></span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1813] mb-2">
            Step Into The Legacy
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6F66] max-w-md mx-auto mb-6">
            Discover our collection of handcrafted kurtas, kurta sets, and bespoke waistcoats.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#4A3525] hover:bg-[#36261A] text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg group cursor-pointer"
            >
              <span>Explore The Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white hover:bg-[#FAF6F1] text-[#4A3525] font-semibold text-sm tracking-wide border border-[#DACDC0] transition-colors"
            >
              <span>About Our Atelier</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
