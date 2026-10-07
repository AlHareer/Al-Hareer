'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shirt } from 'lucide-react';
import type { NavMenuData } from '@/lib/products';

type Props = {
  data: NavMenuData | null;
  open: boolean;
  onNavigate: (href: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function ShopMegaMenu({ data, open, onNavigate, onMouseEnter, onMouseLeave }: Props) {
  if (!open) return null;

  const hasAnything = !!data && data.groups.length > 0;

  return (
    <div
      className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full pt-4 z-40"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Little caret pointing up at the Shop link */}
      <span className="absolute left-1/2 top-2.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#F6F1EC] border-l border-t border-[#CFAC64]/70" />

      <div
        role="menu"
        aria-label="Shop categories"
        className="relative w-64 bg-[#F6F1EC] border border-[#CFAC64]/70 rounded-2xl shadow-luxury-hover overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-200"
      >
        <div className="px-4 pt-3.5 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CFAC64]">Shop By</span>
        </div>

        {!data ? (
          <p className="text-sm text-[#024F5F] py-6 text-center">Loading…</p>
        ) : !hasAnything ? (
          <p className="text-sm text-[#024F5F] py-6 text-center">No categories yet.</p>
        ) : (
          <ul className="p-2">
            {data.groups.map((g) => (
              <li key={g.href}>
                <Link
                  href={g.href}
                  onClick={() => onNavigate(g.href)}
                  role="menuitem"
                  className="group/item flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[14px] font-semibold text-[#00303A] transition-colors hover:bg-[#CFAC64]/15"
                >
                  <span className="relative w-10 h-10 rounded-full overflow-hidden border border-[#CFAC64]/60 shrink-0 bg-white transition-transform duration-300 group-hover/item:scale-105 group-hover/item:border-[#CFAC64]">
                    {g.image ? (
                      <Image src={g.image} alt="" fill sizes="40px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[#024F5F]">
                        <Shirt className="w-4.5 h-4.5" />
                      </span>
                    )}
                  </span>
                  <span className="flex-1 transition-colors group-hover/item:text-[#024F5F]">{g.label}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CFAC64] opacity-0 scale-0 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:scale-100" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
