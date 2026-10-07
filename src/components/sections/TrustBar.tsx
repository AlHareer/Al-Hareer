'use client';

import React from 'react';
import { Truck, Users, BadgeCheck, Store } from 'lucide-react';
import type { ContentSettings } from '@/lib/siteSettings';

const ICONS = [Truck, Users, BadgeCheck, Store];
const FALLBACK_ITEMS = [
  { title: 'Wide Range', subtitle: 'of Collection' },
  { title: 'Perfect for', subtitle: 'Retailers & Resellers' },
  { title: 'Quality You', subtitle: 'Can Trust' },
  { title: 'Wholesale', subtitle: 'Pricing Available' },
];

export default function TrustBar({ settings }: { settings: ContentSettings }) {
  let items = FALLBACK_ITEMS;
  try {
    const parsed = JSON.parse(settings.home_trustbar_items || '[]');
    if (Array.isArray(parsed) && parsed.length === 4) items = parsed;
  } catch {
    // keep FALLBACK_ITEMS
  }

  return (
    <section className="w-full bg-[#024F5F] text-white select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 gap-y-6">
        {items.map((item, idx) => {
          const Icon = ICONS[idx];
          return (
            <div
              key={idx}
              className={`flex flex-col items-center text-center gap-2.5 px-3 ${
                idx > 0 ? 'md:border-l md:border-white/25' : ''
              } ${idx % 2 === 1 ? 'border-l border-white/25' : ''}`}
            >
              <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[1.4]" />
              <p className="font-body text-xs sm:text-sm font-medium leading-snug text-white">
                {item.title}
                <br />
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
