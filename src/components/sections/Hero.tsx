'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ContentSettings } from '@/lib/siteSettings';
import {
  Truck,
  Award,
  RotateCcw,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useShippingSettings } from '@/hooks/useShippingSettings';

export type HeroSlideData = {
  id: number;
  image: string;
  tag: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
};

export default function Hero({ slides: heroSlides, settings }: { slides: HeroSlideData[]; settings: ContentSettings }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const shipping = useShippingSettings();

  if (heroSlides.length === 0) return null;

  // Auto slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const activeData = heroSlides[currentSlide];

  return (
    <section id="home" className="relative w-full bg-[#F6F1EC] overflow-hidden">
      {/* ========================================================================= */}
      {/* DESKTOP HERO LAYOUT (lg & above) - Compact Height & Responsive            */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative w-full h-[450px] lg:h-[470px] xl:h-[500px]">
        {/* Right Side Architectural Scene & Model Photo */}
        <div className="absolute top-0 right-0 bottom-0 w-[55%] xl:w-[53%] 2xl:w-[50%] h-full pointer-events-none select-none overflow-hidden">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={slide.image}
                alt="Tradition Wears Better Today"
                fill
                priority={idx === 0}
                className="object-cover object-[center_12%] xl:object-[center_10%]"
              />
            </div>
          ))}

          {/* Seamless Soft Left Gradient Fade */}
          <div className="absolute inset-y-0 left-0 w-36 xl:w-56 bg-gradient-to-r from-[#F6F1EC] via-[#F6F1EC]/85 to-transparent z-15 pointer-events-none" />

          {/* Bottom Right Carousel Navigation Controller (< 01 02 03 >) */}
          <div className="absolute bottom-5 xl:bottom-6 right-8 lg:right-10 xl:right-14 z-30 pointer-events-auto flex items-center gap-3  rounded-full bg-[#ffffff]">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-white/95 hover:bg-white text-[#00303A] flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,48,58,0.08)] border border-[#CFAC64] hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.8]" />
            </button>

            {/* Numbers Indicator with active underline */}
            <div className="flex items-center gap-2.5 xl:gap-3 px-1.5 text-xs font-semibold">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`tracking-wider transition-all relative pb-1 cursor-pointer ${
                    currentSlide === idx ? 'text-[#00303A]' : 'text-[#024F5F] hover:text-[#024F5F]'
                  }`}
                >
                  0{slide.id}
                  {currentSlide === idx && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00303A] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-white/95 hover:bg-white text-[#00303A] flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,48,58,0.08)] border border-[#CFAC64] hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Left Side Main Content Container */}
        <div className="relative z-20 max-w-[1440px] mx-auto h-full px-6 lg:px-12 flex flex-col justify-between pt-6 pb-5 xl:pt-7 xl:pb-6 pointer-events-none">
          {/* Top Block: Tag, Headline, Subtitle, Buttons */}
          <div className="max-w-[540px] xl:max-w-[600px] pointer-events-auto mt-12">
            {/* Tagline with thin bronze rule */}
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-[11px] xl:text-[11.5px] uppercase tracking-[0.25em] font-medium text-[#024F5F]">
                {activeData.tag}
              </span>
              <span className="h-[1px] w-10 xl:w-12 bg-[#CFAC64] inline-block" />
            </div>

            {/* Main Luxury Serif Display Headline */}
            <h1 className="font-serif-luxury text-3xl lg:text-[50px] xl:text-[53px] text-[#00303A] font-[600] tracking-tight leading-[1.2] mb-2.5">
              {activeData.titleLine1} <br />
              <span className="text-[#024F5F]">
                {activeData.titleLine2} {" "}
                {activeData.titleLine3}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#024F5F] text-[12.5px] xl:text-[14px] font-medium leading-relaxed max-w-[430px] mb-4">
              {activeData.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-3 mt-8">
              <a
                href={activeData.buttonLink || '/shop'}
                className="inline-flex items-center gap-2 bg-[#CFAC64] hover:bg-[#B08F4F] text-white px-6 py-2.5 rounded-[5px] text-[13px] xl:text-sm font-medium transition-all duration-300 shadow-[0_4px_12px_rgba(0,48,58,0.2)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{activeData.buttonText || 'Shop Collection'}</span>
              </a>

            </div>
          </div>

          {/* Bottom Features Row - Frameless Minimal Columns with Vertical Dividers */}
          <div className="max-w-[540px] xl:max-w-[600px] pointer-events-auto pt-3 border-t border-[#CFAC64]/80">
            <div className="grid grid-cols-4 items-start divide-x divide-[#CFAC64]">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center px-2 first:pl-0">
                <div className="text-[#00303A] mb-0.5">
                  <Truck className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.6]" />
                </div>
                <h4 className="text-[11.5px] xl:text-[12px] font-bold text-[#00303A] leading-tight">
                  Free Shipping
                </h4>
                <p className="text-[9.5px] xl:text-[10px] text-[#024F5F] mt-0.5 leading-snug">
                  On Orders Above ₹{shipping.free_threshold.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center px-2">
                <div className="text-[#00303A] mb-0.5">
                  <Award className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.6]" />
                </div>
                <h4 className="text-[11.5px] xl:text-[12px] font-bold text-[#00303A] leading-tight">
                  Premium Quality
                </h4>
                <p className="text-[9.5px] xl:text-[10px] text-[#024F5F] mt-0.5 leading-snug">
                  Finest Fabrics
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center px-2">
                <div className="text-[#00303A] mb-0.5">
                  <RotateCcw className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.6]" />
                </div>
                <h4 className="text-[11.5px] xl:text-[12px] font-bold text-[#00303A] leading-tight">
                  Easy Returns
                </h4>
                <p className="text-[9.5px] xl:text-[10px] text-[#024F5F] mt-0.5 leading-snug">
                  Hassle Free
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center px-2 last:pr-0">
                <div className="text-[#00303A] mb-0.5">
                  <Heart className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.6]" />
                </div>
                <h4 className="text-[11.5px] xl:text-[12px] font-bold text-[#00303A] leading-tight">
                  50K+ Customers
                </h4>
                <p className="text-[9.5px] xl:text-[10px] text-[#024F5F] mt-0.5 leading-snug">
                  Trust Our Brand
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE HERO LAYOUT (below lg) - Modern, Compact ("kam space me"), 1:1     */}
      {/* ========================================================================= */}
      <div className="block lg:hidden px-4 sm:px-6 pt-3 pb-5">
        <div className="flex flex-col gap-3">
          {/* Top Visual Image Card with Overlays */}
          <div className="relative w-full h-[230px] sm:h-[270px] rounded-2xl overflow-hidden shadow-md border border-[#CFAC64] bg-[#F6F1EC]">
            <Image
              src={activeData.image}
              alt="Tradition Wears Better Today"
              fill
              priority
              className="object-cover object-[center_12%]"
            />

            {/* Carousel Navigation Controller Overlay on Bottom Right */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/80 shadow-md">
              <button
                onClick={prevSlide}
                className="w-6 h-6 rounded-full bg-white text-[#00303A] flex items-center justify-center shadow-xs active:scale-90 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 px-1">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`text-[11px] font-semibold cursor-pointer ${
                      currentSlide === idx
                        ? 'text-[#00303A] underline underline-offset-4 decoration-[#00303A] decoration-2'
                        : 'text-[#024F5F]'
                    }`}
                  >
                    0{slide.id}
                  </button>
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-6 h-6 rounded-full bg-white text-[#00303A] flex items-center justify-center shadow-xs active:scale-90 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content Block below image */}
          <div className="flex flex-col items-center text-center space-y-2 px-1">
            {/* Tagline */}
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] uppercase tracking-[0.25em] font-medium text-[#024F5F]">
                {activeData.tag}
              </span>
              <span className="h-[1px] w-8 bg-[#CFAC64] inline-block" />
            </div>

            {/* Display Headline */}
            <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#00303A] font-normal tracking-tight leading-[1.12]">
              {activeData.titleLine1} <br />
              <span className="text-[#024F5F]">{activeData.titleLine2} {activeData.titleLine3}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs text-[#024F5F] font-medium leading-relaxed max-w-sm">
              {activeData.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href={activeData.buttonLink || '/shop'}
                className="w-full sm:flex-1 bg-[#CFAC64] hover:bg-[#B08F4F] text-white py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>{activeData.buttonText || 'Shop Collection'}</span>
              </a>

            </div>

            {/* 4 Feature Items in Clean 2x2 Minimal Grid */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2.5 border-t border-[#CFAC64]">
              <div className="flex flex-col items-center text-center p-1.5">
                <Truck className="w-3.5 h-3.5 text-[#00303A] stroke-[1.6] mb-0.5" />
                <span className="text-[11px] font-bold text-[#00303A]">Free Shipping</span>
                <span className="text-[9px] text-[#024F5F]">On Orders Above ₹{shipping.free_threshold.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex flex-col items-center text-center p-1.5">
                <Award className="w-3.5 h-3.5 text-[#00303A] stroke-[1.6] mb-0.5" />
                <span className="text-[11px] font-bold text-[#00303A]">Premium Quality</span>
                <span className="text-[9px] text-[#024F5F]">Finest Fabrics</span>
              </div>

              <div className="flex flex-col items-center text-center p-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#00303A] stroke-[1.6] mb-0.5" />
                <span className="text-[11px] font-bold text-[#00303A]">Easy Returns</span>
                <span className="text-[9px] text-[#024F5F]">Hassle Free</span>
              </div>

              <div className="flex flex-col items-center text-center p-1.5">
                <Heart className="w-3.5 h-3.5 text-[#00303A] stroke-[1.6] mb-0.5" />
                <span className="text-[11px] font-bold text-[#00303A]">50K+ Customers</span>
                <span className="text-[9px] text-[#024F5F]">Trust Our Brand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
