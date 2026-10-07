'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { Faq } from '@/lib/siteSettings';

export default function HomeFaqSection({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#F6F1EC] border-t border-cream-200">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <span className="w-6 h-[1.5px] bg-[#024F5F]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#024F5F]">
              FREQUENTLY ASKED
            </span>
            <span className="w-6 h-[1.5px] bg-[#024F5F]" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-700 tracking-tight">
            Got Questions?
          </h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            Quick answers to the most common questions we get.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-brand-300 bg-white shadow-sm'
                    : 'border-cream-300 bg-white/70 hover:border-brand-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-[15px] font-semibold text-brand-700 leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-brand-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-cream-100 pt-3.5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        {faqs.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 bg-[#CFAC64] hover:bg-[#B08F4F] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            >
              <HelpCircle className="w-4 h-4" />
              View All FAQs
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
