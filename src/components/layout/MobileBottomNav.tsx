'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen, isCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { setIsSearchOpen, isSearchOpen } = useUI();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHomeActive = pathname === '/';
  const isWishlistActive = pathname === '/wishlist';
  const isCartActive = isCartOpen || pathname === '/cart' || pathname === '/checkout';

  const wishlistCount = mounted ? wishlist.length : 0;
  const cartCount = mounted ? totalItems : 0;

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-xl border-t border-[#E5DACD] shadow-[0_-8px_30px_rgba(43,35,29,0.08)] pb-[max(0.4rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-4 items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        
        {/* 1. HOME */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 select-none group relative ${
            isHomeActive
              ? 'text-[#2B231D]'
              : 'text-[#7A6F66] hover:text-[#2B231D]'
          }`}
          aria-label="Home"
        >
          <div className="relative w-8 h-7 flex items-center justify-center">
            <Home
              className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isHomeActive ? 'stroke-[2.2] text-[#2B231D]' : 'stroke-[1.6]'
              }`}
            />
            {isHomeActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4A3525] shadow-xs" />
            )}
          </div>
          <span
            className={`text-[11px] tracking-tight leading-tight mt-0.5 ${
              isHomeActive ? 'font-bold text-[#2B231D]' : 'font-medium text-[#7A6F66]'
            }`}
          >
            Home
          </span>
        </Link>

        {/* 2. SEARCH */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 select-none group relative ${
            isSearchOpen
              ? 'text-[#2B231D]'
              : 'text-[#7A6F66] hover:text-[#2B231D]'
          }`}
          aria-label="Search"
        >
          <div className="relative w-8 h-7 flex items-center justify-center">
            <Search
              className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isSearchOpen ? 'stroke-[2.2] text-[#2B231D]' : 'stroke-[1.6]'
              }`}
            />
            {isSearchOpen && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4A3525] shadow-xs" />
            )}
          </div>
          <span
            className={`text-[11px] tracking-tight leading-tight mt-0.5 ${
              isSearchOpen ? 'font-bold text-[#2B231D]' : 'font-medium text-[#7A6F66]'
            }`}
          >
            Search
          </span>
        </button>

        {/* 3. WISHLIST */}
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 select-none group relative ${
            isWishlistActive
              ? 'text-[#8B2D2D]'
              : 'text-[#7A6F66] hover:text-[#8B2D2D]'
          }`}
          aria-label={`Wishlist, ${wishlistCount} items`}
        >
          <div className="relative w-8 h-7 flex items-center justify-center">
            <Heart
              className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isWishlistActive
                  ? 'stroke-[2.2] text-[#8B2D2D] fill-[#8B2D2D]/15'
                  : 'stroke-[1.6]'
              }`}
            />
            {wishlistCount > 0 && (
              <span
                key={`wishlist-badge-${wishlistCount}`}
                className="absolute -top-1 -right-1 bg-[#8B2D2D] text-white text-[10px] font-bold font-sans min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-[#FAF6F0] shadow-sm animate-in zoom-in-75 duration-200 leading-none pointer-events-none"
              >
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
            {isWishlistActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8B2D2D] shadow-xs" />
            )}
          </div>
          <span
            className={`text-[11px] tracking-tight leading-tight mt-0.5 ${
              isWishlistActive ? 'font-bold text-[#8B2D2D]' : 'font-medium text-[#7A6F66]'
            }`}
          >
            Wishlist
          </span>
        </Link>

        {/* 4. CART */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 select-none group relative ${
            isCartActive
              ? 'text-[#2B231D]'
              : 'text-[#7A6F66] hover:text-[#2B231D]'
          }`}
          aria-label={`Cart, ${cartCount} items`}
        >
          <div className="relative w-8 h-7 flex items-center justify-center">
            <ShoppingBag
              className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isCartActive ? 'stroke-[2.2] text-[#2B231D]' : 'stroke-[1.6]'
              }`}
            />
            {cartCount > 0 && (
              <span
                key={`cart-badge-${cartCount}`}
                className="absolute -top-1 -right-1 bg-[#2B231D] text-white text-[10px] font-bold font-sans min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-[#FAF6F0] shadow-sm animate-in zoom-in-75 duration-200 leading-none pointer-events-none"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
            {isCartActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4A3525] shadow-xs" />
            )}
          </div>
          <span
            className={`text-[11px] tracking-tight leading-tight mt-0.5 ${
              isCartActive ? 'font-bold text-[#2B231D]' : 'font-medium text-[#7A6F66]'
            }`}
          >
            Cart
          </span>
        </button>

      </div>
    </nav>
  );
}
