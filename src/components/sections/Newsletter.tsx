'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Gift, Crown, Percent, Bell, Check } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import type { ContentSettings } from '@/lib/siteSettings';
import { subscribeNewsletter } from '@/actions/customerContact';

export default function Newsletter({ settings }: { settings: ContentSettings }) {
  const [headingLine1, headingLine2] = settings.home_newsletter_heading.split('\n');
  const newsletterImage = settings.home_newsletter_image || '/images/your-image-19.jpg';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useUI();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const result = await subscribeNewsletter(email);
    if (!result.success) {
      showToast(result.error || 'Failed to subscribe. Please try again.', 'error');
      return;
    }

    setSubscribed(true);
    showToast('✨ Welcome to the Al Hareer Privilege Club!');
    setEmail('');
  };

  return (
    <section className="py-10 sm:py-14 md:py-16 bg-[#FAF6F0] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Rounded Luxury Banner Card */}
        <div className="relative rounded-[10px] overflow-hidden border border-[#E2D7C7] bg-[#FCFAF7] shadow-[0_12px_40px_rgba(43,35,29,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* LEFT SIDE: Text, Newsletter Form & 4 Highlights */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10">
              
              {/* Header Info */}
              <div>
                {/* Tag Pill */}
                <div className="flex items-center gap-3">
                  <span className="w-7 h-[1.5px] bg-[#655B53]" />
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#655B53]">
                    Al Hareer PRIVILEGE CLUB
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#2B231D] leading-[1.14] mt-4">
                  {headingLine1}
                  {headingLine2 && (
                    <>
                      {' '}
                      <br />
                      <span className="font-serif italic font-normal text-[#3E2D20]">{headingLine2}</span>
                    </>
                  )}
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-[#655B53] font-body leading-relaxed max-w-md mt-3">
                  {settings.home_newsletter_subtitle}
                </p>

                {/* Subscribe Form */}
                <form onSubmit={handleSubscribe} className="mt-6 sm:mt-7">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-0 max-w-lg">
                    {/* Email Input Field */}
                    <div className="relative flex-1 flex items-center bg-white border border-[#E2D7C7] rounded-[5px] sm:rounded-r-none px-4 py-3 sm:py-3.5 focus-within:border-brand-300 transition-colors shadow-sm outline-none">
                      <Mail className="w-4 h-4 text-[#8C8178] mr-3 flex-shrink-0" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-transparent text-xs sm:text-sm text-[#2B231D] placeholder:text-[#8C8178] focus:outline-none"
                      />
                    </div>

                    {/* Join Now Button */}
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 sm:py-3.5 bg-[#3E2B1E] text-white font-medium text-xs sm:text-sm rounded-lg sm:rounded-l-none hover:bg-[#2A1D14] transition-all duration-300 shadow-sm whitespace-nowrap cursor-pointer hover:shadow-md"
                    >
                      <span>{subscribed ? 'Joined' : 'Join Now'}</span>
                      {subscribed && (
                        <Check className="w-4 h-4 text-gold" />
                      )}
                    </button>
                  </div>
                  
                  <p className="text-[11px] text-[#8C8178] mt-2 font-normal">
                    No spam, ever. Unsubscribe at any time.
                  </p>
                </form>
              </div>

              {/* Bottom 4 Feature Icons Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-4 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-[#EADDCF]/80">
                {/* 1. Exclusive Offers */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F3ECE1] flex items-center justify-center text-[#4A3525] flex-shrink-0 border border-[#E2D7C7]/70 shadow-sm">
                    <Gift className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#2B231D] font-medium leading-tight">
                    Exclusive<br />Offers
                  </div>
                </div>

                {/* 2. Early Access */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F3ECE1] flex items-center justify-center text-[#4A3525] flex-shrink-0 border border-[#E2D7C7]/70 shadow-sm">
                    <Crown className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#2B231D] font-medium leading-tight">
                    Early Access<br />to Collections
                  </div>
                </div>

                {/* 3. Festive Discounts */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F3ECE1] flex items-center justify-center text-[#4A3525] flex-shrink-0 border border-[#E2D7C7]/70 shadow-sm">
                    <Percent className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#2B231D] font-medium leading-tight">
                    Festive<br />Discounts
                  </div>
                </div>

                {/* 4. Style Tips */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F3ECE1] flex items-center justify-center text-[#4A3525] flex-shrink-0 border border-[#E2D7C7]/70 shadow-sm">
                    <Bell className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#2B231D] font-medium leading-tight">
                    Style Tips<br />&amp; Updates
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: Heritage Photo, Organic Curve, & Arched Community Badge */}
            <div className="lg:col-span-5 xl:col-span-5 relative min-h-[340px] sm:min-h-[380px] lg:min-h-[430px] overflow-hidden">
              
              {/* Main Model Photo */}
              <Image
                src={newsletterImage}
                alt="Al Hareer Community Heritage"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-[center_18%]"
              />

              {/* Dark organic wave contour separating left & right */}
              <div className="hidden lg:block absolute inset-y-0 left-0 w-44 pointer-events-none z-10">
                <svg
                  viewBox="0 0 160 450"
                  preserveAspectRatio="none"
                  className="w-full h-full text-[#342418] fill-current"
                >
                  <path d="M0 0 L160 0 C100 140 40 240 100 360 C130 420 150 460 160 500 L0 500 Z" />
                </svg>

                {/* Subtle mandala watermark in dark section */}
                <div className="absolute top-8 left-4 opacity-15 text-gold pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-current fill-none" strokeWidth="0.8">
                    <circle cx="50" cy="50" r="45" />
                    <circle cx="50" cy="50" r="30" />
                    <circle cx="50" cy="50" r="15" />
                    <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" />
                  </svg>
                </div>
              </div>

              {/* Top Text on Dark Section ("MORE THAN FASHION...") */}
              <div className="hidden lg:block absolute top-6 sm:top-4 left-3 sm:left-4 z-20 select-none text-left">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-[#CBB9AB] uppercase">
                  MORE
                </p>
                <p className="text-[10px] font-semibold tracking-[0.24em] text-[#CBB9AB] uppercase mt-0.5">
                  THAN FASHION
                </p>
                <p className="text-[10px] font-semibold tracking-[0.24em] text-[#CBB9AB] uppercase mt-0.5">
                  A CLOSER
                </p>
                <p className="text-[10px] font-semibold tracking-[0.24em] text-[#CBB9AB] uppercase mt-0.5">
                  CONNECTION
                </p>
                <div className="w-6 h-[1.5px] bg-gold mt-2" />
              </div>

              {/* Arched Pill Card on the Right ("JOIN A COMMUNITY THAT VALUES TRADITION") */}
              <div className="absolute top-10 right-5 sm:top-20 sm:right-8 z-20 w-[125px] sm:w-[140px] bg-[#EFE6D8]/95 backdrop-blur-md rounded-t-full rounded-b-2xl border border-[#D8C7B3] px-4 py-5 text-center shadow-lg select-none">
                {/* Botanical emblem */}
                <div className="flex justify-center mb-2 text-[#38261A]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21c4.5-2 8-6.5 8-11.5A8 8 0 0 0 12 2a8 8 0 0 0-8 7.5c0 5 3.5 9.5 8 11.5Z" />
                    <path d="M12 2v19" />
                  </svg>
                </div>
                <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#38261A] leading-[1.4]">
                  JOIN A<br />COMMUNITY<br />THAT VALUES<br />TRADITION
                </p>
                <div className="w-5 h-[1.5px] bg-gold mx-auto mt-2.5" />
              </div>

              {/* Bottom Right: Cursive Script "Style Beyond Seasons" */}
              <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-8 z-20 select-none pointer-events-none">
                <p className="font-script-luxury text-2xl sm:text-3xl lg:text-[34px] text-[#FAF6F0] drop-shadow-lg -rotate-6 leading-tight">
                  Style<br />Beyond Seasons
                </p>
              </div>

              {/* Vignette Gradient for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

