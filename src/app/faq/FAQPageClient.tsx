'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Search,
  ChevronDown,
  Mail,
  HelpCircle,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import type { Faq } from '@/lib/siteSettings';

export default function FAQPageClient({ faqData, phone }: { faqData: Faq[]; phone: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<string | null>(faqData[0]?.id ?? null);
  const digits = phone.replace(/\D/g, '').slice(-10);

  const categories = useMemo(() => {
    const set = new Set(faqData.map((item) => item.category));
    return ['All', ...Array.from(set)];
  }, [faqData]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqData, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2B231D] selection:bg-[#4A3525] selection:text-white">
      <Navbar />

      {/* 1. TOP HERO / SECTION INTRO */}
      <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#E8DFD5]">
        {/* Background Decorative Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] md:w-[48%] lg:w-[42%] pointer-events-none select-none overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/images/shop-banner-arch.jpg"
              alt="Al Hareer Concierge Support"
              fill
              priority
              className="object-cover object-right opacity-30 sm:opacity-80"
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
            <span className="font-semibold text-[#2B231D]">FAQs &amp; Help</span>
          </nav>

          {/* Centered Banner Header on Desktop */}
          <div className="relative flex items-center justify-between lg:justify-center gap-4">
            <div className="max-w-[320px] sm:max-w-md md:max-w-lg lg:max-w-xl lg:mx-auto lg:text-center flex flex-col items-start lg:items-center">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-1.5 justify-start lg:justify-center">
                <span className="w-5 sm:w-7 lg:w-8 h-[1.5px] bg-[#4A3525]"></span>
                <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#4A3525] uppercase">
                  HELP &amp; CONCIERGE DESK
                </span>
                <span className="hidden lg:inline-block w-8 h-[1.5px] bg-[#4A3525]"></span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-black text-[#1F1813] tracking-tight leading-[1.08] mb-1">
                Frequently Asked Questions
              </h1>

              <p className="font-body text-[#7A6F66] text-xs sm:text-sm font-normal leading-snug">
                Everything you need to know about our tailoring, shipping, custom fits, and heritage fabrics.
              </p>
            </div>

            {/* Right Calligraphy */}
            <div className="flex flex-col items-center justify-center text-center select-none shrink-0 lg:absolute lg:right-6 xl:right-12 lg:top-1/2 lg:-translate-y-1/2 sm:pr-16 md:pr-24 lg:pr-0">
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#7A6F66] leading-none tracking-wide">
                Tradition
              </span>
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#7A6F66] leading-none tracking-wide mt-0.5">
                In Style
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH BAR & QUICK CATEGORY CHIPS */}
      <section className="py-6 sm:py-8 bg-[#FAF6F0]">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search Box */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. custom size, delivery time, returns, fabric...)"
              className="w-full text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl bg-white border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] shadow-2xs focus:outline-none focus:border-[#4A3525] transition-all"
            />
            <Search className="w-4 h-4 text-[#8B6B52] absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8B6B52] hover:text-[#4A3525] px-2 py-1 bg-[#F5EFE6] rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-medium whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#4A3525] text-white shadow-xs'
                      : 'bg-white text-[#7A6F66] border border-[#E5DACD] hover:bg-[#EFE8E0] hover:text-[#2B231D]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. ACCORDION FAQ LIST */}
      <section className="py-4 sm:py-8 pb-14 bg-[#FAF6F0] flex-1">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DFD5] p-8 space-y-3">
              <HelpCircle className="w-10 h-10 text-[#8B6B52] mx-auto stroke-1" />
              <p className="font-heading text-xl font-bold text-[#2B231D]">
                No matching answers found
              </p>
              <p className="text-xs sm:text-sm text-[#7A6F66] max-w-md mx-auto">
                We couldn&apos;t find an answer matching &ldquo;{searchQuery}&rdquo;. Feel free to reach out to our concierge team directly.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/91${digits}?text=Hello%20Al%20Hareer%20Concierge,%20I%20have%20a%20question.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A3525] text-white text-xs font-semibold hover:bg-[#36261A] transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Ask On WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openIndex === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-[#E8DFD5] bg-white overflow-hidden shadow-2xs transition-all hover:border-[#DACDC0]"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-[#2B231D] hover:text-[#4A3525] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A3525] shrink-0" />
                        <span>{faq.question}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8B6B52] transition-transform duration-200 shrink-0 ml-2 ${
                          isOpen ? 'rotate-180 text-[#4A3525]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-[#7A6F66] leading-relaxed border-t border-[#F5EFE6] pt-3 animate-in fade-in duration-200 bg-[#FCFAF7]/50">
                        <p>{faq.answer}</p>
                        <div className="mt-3 pt-2.5 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] text-[#A89C8F]">
                          <span>Category: <strong className="text-[#8B6B52]">{faq.category}</strong></span>
                          <span>Was this helpful?</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. NEED MORE ASSISTANCE BANNER */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#EFE8E0] border border-[#DACDC0] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

              <div className="md:col-span-8 space-y-1 text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6B52]">
                  — PERSONAL STYLING CONCIERGE
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B231D]">
                  Still have questions or need custom assistance?
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6F66] leading-relaxed">
                  Our dedicated styling concierges are available 6 days a week to assist with fittings, customized wedding trousseau orders, or studio appointments.
                </p>
              </div>

              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5 justify-center">
                <a
                  href={`https://wa.me/91${digits}?text=Hello%20Al%20Hareer,%20I%20have%20a%20question%20about%20my%20order.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Page Form</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
