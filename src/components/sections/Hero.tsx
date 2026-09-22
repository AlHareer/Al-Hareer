'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Play,
  Truck,
  Award,
  RotateCcw,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    image: '/images/img_01/hero_img01.png',
    tag: 'TIMELESS TRADITION',
    titleLine1: 'Tradition',
    titleLine2: 'Wears Better',
    titleLine3: 'Today',
    subtitle: 'Premium Kurta Pajama Sets for Every Occasion. Where timeless style meets modern comfort.',
  },
  {
    id: 2,
    image: '/images/img_01/hero_img01.png',
    tag: 'ROYAL HERITAGE',
    titleLine1: 'Elegance',
    titleLine2: 'Woven In Every',
    titleLine3: 'Thread',
    subtitle: 'Pure Mulberry Silks and Slub Cotton tailored for festive celebrations and milestones.',
  },
  {
    id: 3,
    image: '/images/img_01/hero_img01.png',
    tag: 'MODERN BESPOKE',
    titleLine1: 'Comfort',
    titleLine2: 'Designed For',
    titleLine3: 'Celebration',
    subtitle: 'Tailored ethnic silhouettes engineered for effortless charm and all-day celebration ease.',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
    <section id="home" className="relative w-full bg-[#FAF6F0] overflow-hidden">
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
          <div className="absolute inset-y-0 left-0 w-36 xl:w-56 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/85 to-transparent z-15 pointer-events-none" />

          {/* Bottom Right Carousel Navigation Controller (< 01 02 03 >) */}
          <div className="absolute bottom-5 xl:bottom-6 right-8 lg:right-10 xl:right-14 z-30 pointer-events-auto flex items-center gap-3  rounded-full bg-[#ffffff]">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-white/95 hover:bg-white text-[#2B231D] flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E8DFD5] hover:scale-105 active:scale-95 cursor-pointer"
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
                    currentSlide === idx ? 'text-[#2B231D]' : 'text-[#A39E93] hover:text-[#4A3525]'
                  }`}
                >
                  0{slide.id}
                  {currentSlide === idx && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2B231D] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-white/95 hover:bg-white text-[#2B231D] flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E8DFD5] hover:scale-105 active:scale-95 cursor-pointer"
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
              <span className="text-[11px] xl:text-[11.5px] uppercase tracking-[0.25em] font-medium text-[#7C6652]">
                {activeData.tag}
              </span>
              <span className="h-[1px] w-10 xl:w-12 bg-[#C6B09B] inline-block" />
            </div>

            {/* Main Luxury Serif Display Headline */}
            <h1 className="font-serif-luxury text-3xl lg:text-[50px] xl:text-[53px] text-[#1E1712] font-[600] tracking-tight leading-[1.2] mb-2.5">
              {activeData.titleLine1} <br />
              {activeData.titleLine2} {" "}
              {activeData.titleLine3}
            </h1>

            {/* Subtitle */}
            <p className="text-[#655B53] text-[12.5px] xl:text-[14px] font-normal leading-relaxed max-w-[430px] mb-4">
              {activeData.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-3 mt-8">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 bg-[#423124] hover:bg-[#302217] text-white px-6 py-2.5 rounded-[5px] text-[13px] xl:text-sm font-medium transition-all duration-300 shadow-[0_4px_12px_rgba(66,49,36,0.2)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              </a>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2.5 text-[#2B231D] hover:text-[#423124] font-medium text-[13px] xl:text-sm group cursor-pointer transition-colors"
              >
                <span className="w-6 h-6 xl:w-7 xl:h-7 rounded-full border border-[#2B231D] flex items-center justify-center group-hover:bg-[#2B231D] group-hover:text-white transition-all shadow-sm">
                  <Play className="w-2 xl:w-2.5 h-2 xl:h-2.5 fill-current ml-0.5" />
                </span>
                <span>Watch Our Story</span>
              </button>
            </div>
          </div>

          {/* Bottom Features Row - Frameless Minimal Columns with Vertical Dividers */}
          <div className="max-w-[540px] xl:max-w-[600px] pointer-events-auto pt-3 border-t border-[#E5DACD]/80">
            <div className="grid grid-cols-4 items-start divide-x divide-[#E5DACD]">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center px-2 first:pl-0">
                <div className="text-[#2B231D] mb-0.5">
                  <Truck className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.6]" />
                </div>
                <h4 className="text-[11.5px] xl:text-[12px] font-bold text-[#2B231D] leading-tight">
                  Free Shipping
                </h4>
                <p className="text-[9.5px] xl:text-[10px] text-[#7A6F66] mt-0.5 leading-snug">
                  On Orders Above ₹999
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center px-2">
                <div className="text-[#2B231D] mb-0.5">
                  <Award className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.6]" />
                </div>
                <h4 className="text-[11.5px] xl:text-[12px] font-bold text-[#2B231D] leading-tight">
                  Premium Quality
                </h4>
                <p className="text-[9.5px] xl:text-[10px] text-[#7A6F66] mt-0.5 leading-snug">
                  Finest Fabrics
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center px-2">
                <div className="text-[#2B231D] mb-0.5">
                  <RotateCcw className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.6]" />
                </div>
                <h4 className="text-[11.5px] xl:text-[12px] font-bold text-[#2B231D] leading-tight">
                  Easy Returns
                </h4>
                <p className="text-[9.5px] xl:text-[10px] text-[#7A6F66] mt-0.5 leading-snug">
                  Hassle Free
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center px-2 last:pr-0">
                <div className="text-[#2B231D] mb-0.5">
                  <Heart className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.6]" />
                </div>
                <h4 className="text-[11.5px] xl:text-[12px] font-bold text-[#2B231D] leading-tight">
                  50K+ Customers
                </h4>
                <p className="text-[9.5px] xl:text-[10px] text-[#7A6F66] mt-0.5 leading-snug">
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
          <div className="relative w-full h-[230px] sm:h-[270px] rounded-2xl overflow-hidden shadow-md border border-[#E5DACD] bg-[#F3ECE1]">
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
                className="w-6 h-6 rounded-full bg-white text-[#2B231D] flex items-center justify-center shadow-xs active:scale-90 cursor-pointer"
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
                        ? 'text-[#2B231D] underline underline-offset-4 decoration-[#423124] decoration-2'
                        : 'text-[#A39E93]'
                    }`}
                  >
                    0{slide.id}
                  </button>
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-6 h-6 rounded-full bg-white text-[#2B231D] flex items-center justify-center shadow-xs active:scale-90 cursor-pointer"
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
              <span className="text-[10.5px] uppercase tracking-[0.25em] font-medium text-[#7C6652]">
                {activeData.tag}
              </span>
              <span className="h-[1px] w-8 bg-[#C6B09B] inline-block" />
            </div>

            {/* Display Headline */}
            <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#1E1712] font-normal tracking-tight leading-[1.12]">
              {activeData.titleLine1} <br />
              {activeData.titleLine2} {activeData.titleLine3}
            </h1>

            {/* Subtitle */}
            <p className="text-xs text-[#655B53] font-normal leading-relaxed max-w-sm">
              {activeData.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="#shop"
                className="w-full sm:flex-1 bg-[#423124] hover:bg-[#302217] text-white py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full sm:flex-1 bg-transparent border border-[#2B231D] text-[#2B231D] hover:bg-black/5 py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
              >
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                  <Play className="w-2 h-2 fill-current ml-0.5" />
                </span>
                <span>Watch Our Story</span>
              </button>
            </div>

            {/* 4 Feature Items in Clean 2x2 Minimal Grid */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2.5 border-t border-[#E5DACD]">
              <div className="flex flex-col items-center text-center p-1.5">
                <Truck className="w-3.5 h-3.5 text-[#2B231D] stroke-[1.6] mb-0.5" />
                <span className="text-[11px] font-bold text-[#2B231D]">Free Shipping</span>
                <span className="text-[9px] text-[#7A6F66]">On Orders Above ₹999</span>
              </div>

              <div className="flex flex-col items-center text-center p-1.5">
                <Award className="w-3.5 h-3.5 text-[#2B231D] stroke-[1.6] mb-0.5" />
                <span className="text-[11px] font-bold text-[#2B231D]">Premium Quality</span>
                <span className="text-[9px] text-[#7A6F66]">Finest Fabrics</span>
              </div>

              <div className="flex flex-col items-center text-center p-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#2B231D] stroke-[1.6] mb-0.5" />
                <span className="text-[11px] font-bold text-[#2B231D]">Easy Returns</span>
                <span className="text-[9px] text-[#7A6F66]">Hassle Free</span>
              </div>

              <div className="flex flex-col items-center text-center p-1.5">
                <Heart className="w-3.5 h-3.5 text-[#2B231D] stroke-[1.6] mb-0.5" />
                <span className="text-[11px] font-bold text-[#2B231D]">50K+ Customers</span>
                <span className="text-[9px] text-[#7A6F66]">Trust Our Brand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WATCH OUR STORY VIDEO MODAL POPUP                                         */}
      {/* ========================================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#1F1813] rounded-2xl overflow-hidden shadow-2xl border border-[#4A3525]">
            <div className="flex items-center justify-between p-4 border-b border-[#36261A]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-serif-luxury text-lg font-bold text-[#FAF6F1]">
                  AL HAREER Heritage Craftsmanship
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 text-[#A39E93] hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="AL HAREER Brand Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-[#2B231D] text-center">
              <p className="text-xs text-[#DFCFC0]">
                Every stitch is handcrafted by master artisans with over 40 years of South Asian handloom heritage.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
