'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import BrandLogo from '@/components/layout/BrandLogo';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Heart,
  Sparkles,
  Truck,
  Scissors,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/ui/SocialIcons';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';
import { useAuth } from '@/context/AuthContext';
import { getActiveAnnouncements } from '@/lib/siteSettings';
import { getActiveCategories, type CategoryItem } from '@/lib/products';

export default function Navbar() {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');
  const [optimisticActive, setOptimisticActive] = useState<string | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    getActiveAnnouncements().then(setAnnouncements).catch(() => setAnnouncements([]));
  }, []);
  const [selectedCurrency, setSelectedCurrency] = useState('India (₹)');
  
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { setIsSearchOpen, showToast } = useUI();
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateHash = () => {
        setCurrentHash(window.location.hash);
      };
      updateHash();
      window.addEventListener('hashchange', updateHash);
      window.addEventListener('popstate', updateHash);
      return () => {
        window.removeEventListener('hashchange', updateHash);
        window.removeEventListener('popstate', updateHash);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
    }
    setOptimisticActive(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (linkName: string, href: string) => {
    setOptimisticActive(linkName);
    setMobileMenuOpen(false);
    if (href.includes('#contact')) {
      setCurrentHash('#contact');
    } else {
      setCurrentHash('');
    }
  };

  const isLinkActive = (href: string, name: string) => {
    if (optimisticActive) {
      return optimisticActive === name;
    }
    if (name === 'Contact') {
      return pathname === '/contact' || pathname.startsWith('/contact') || currentHash === '#contact';
    }
    if (name === 'Home') {
      return (pathname === '/' || pathname === '') && currentHash !== '#contact';
    }
    if (name === 'Shop') {
      return pathname === '/shop' || pathname.startsWith('/shop') || pathname.startsWith('/product');
    }
    if (name === 'About Us') {
      return pathname === '/about' || pathname.startsWith('/about');
    }
    if (name === 'Our Story') {
      return pathname === '/story' || pathname.startsWith('/story');
    }
    return false;
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/story' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar — Regal Dark Espresso & Glistening Gold Luxury Marquee */}
      {announcements.length > 0 && (
        <div className="relative w-full bg-gradient-to-r from-[#120D09] via-[#211710] to-[#120D09] border-b border-[#D4AF37]/35 text-[#FAF6F0] py-2 sm:py-2.5 overflow-hidden select-none shadow-[0_4px_20px_-4px_rgba(18,13,9,0.5)]">
          {/* Soft Central Radial Gold Ambient Light */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.1)_0%,_transparent_75%)] pointer-events-none" />

          {/* Left Gradient Edge Mask for Smooth Luxury Fade */}
          <div className="absolute left-0 inset-y-0 w-10 sm:w-28 bg-gradient-to-r from-[#120D09] via-[#120D09]/95 to-transparent z-10 pointer-events-none" />

          {/* Right Gradient Edge Mask for Smooth Luxury Fade */}
          <div className="absolute right-0 inset-y-0 w-10 sm:w-28 bg-gradient-to-l from-[#120D09] via-[#120D09]/95 to-transparent z-10 pointer-events-none" />

          {/* Infinite Smooth Scrolling Marquee */}
          <div className="w-full overflow-hidden flex">
            <div className="animate-marquee-infinite flex items-center hover:[animation-play-state:paused] cursor-default">
              {[...Array(6)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center shrink-0">
                  {announcements.map((message, idx) => (
                    <div key={`${setIdx}-${idx}`} className="flex items-center shrink-0">
                      <div className="flex items-center gap-3 mx-5 sm:mx-9 group cursor-default">
                        <span className="inline-flex items-center justify-center text-[#D4AF37] select-none text-xs drop-shadow-[0_0_8px_rgba(212,175,55,0.85)] group-hover:scale-125 transition-transform duration-300">
                          ✦
                        </span>
                        <span className="font-heading text-[11px] sm:text-[12px] font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#F5EDE4] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                          {message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Header / Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isScrolled
            ? 'bg-[#FAF6F1]/95 backdrop-blur-md shadow-sm border-b border-[#E8DFD5]/90 py-3'
            : 'bg-[#FAF6F1] border-b border-[#E8DFD5] py-4'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Mobile: Hamburger Icon */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#2B231D] hover:text-[#4A3525] hover:bg-[#EFE8E0]/70 active:scale-95 transition-all focus:outline-none cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Brand Logo */}
          <Link
            href="/"
            className="flex flex-col items-center lg:items-start group select-none text-center lg:text-left"
          >
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href, link.name);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.name, link.href)}
                  className={`text-[14px] font-medium transition-colors relative py-1.5 ${
                    isActive ? 'text-[#2B231D] font-semibold' : 'text-[#4A3525]/85 hover:text-[#2B231D]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A3525] rounded-full animate-in fade-in duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Items - Ultra-Modern & Responsive */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3">
            {/* Search Icon (Desktop only - available in bottom nav on mobile) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex relative w-10 h-10 rounded-full items-center justify-center text-[#2B231D] hover:text-[#4A3525] bg-transparent hover:bg-[#EFE8E0]/70 active:scale-95 transition-all duration-200 cursor-pointer group"
              aria-label="Search"
              title="Search products"
            >
              <Search className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* User Profile Icon with Dynamic Auth State & Hover Dropdown (Visible on Mobile & Desktop) */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current);
                setIsUserMenuOpen(true);
              }}
              onMouseLeave={() => {
                userMenuTimeoutRef.current = setTimeout(() => setIsUserMenuOpen(false), 200);
              }}
            >
              <Link
                href="/account"
                className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer group ${
                  isLoggedIn
                    ? 'bg-[#FAF6F1] hover:bg-[#EFE8E0] border border-[#E8DFD5] hover:border-[#DACDC0] shadow-2xs text-[#4A3525]'
                    : 'bg-transparent hover:bg-[#EFE8E0]/70 text-[#2B231D] hover:text-[#4A3525]'
                }`}
                aria-label="Account"
                title={isLoggedIn ? `Logged in as ${user?.name || 'User'}` : 'Account profile'}
              >
                <User className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[1.8] group-hover:scale-110 transition-transform duration-200" />
                {isLoggedIn && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#1E7E34] w-2.5 h-2.5 rounded-full border-2 border-[#FAF6F1] shadow-2xs animate-in zoom-in-75 duration-200" />
                )}
              </Link>

              {/* Modern Luxury Profile Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  onMouseEnter={() => {
                    if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current);
                    setIsUserMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    userMenuTimeoutRef.current = setTimeout(() => setIsUserMenuOpen(false), 200);
                  }}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-[#E8DFD5] shadow-[0_20px_45px_-12px_rgba(43,35,29,0.18)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {isLoggedIn && user ? (
                    <div>
                      {/* Logged in User Profile Header */}
                      <div className="flex items-center gap-3 pb-3.5 border-b border-[#F0EAE1]">
                        <div className="w-10 h-10 rounded-full bg-[#4A3525] text-white font-heading font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-heading text-sm font-bold text-[#2B231D] truncate">
                              {user.name}
                            </h4>
                            <span className="text-[9.5px] font-bold text-[#1E7E34] bg-[#1E7E34]/10 px-1.5 py-0.5 rounded shrink-0">
                              VIP
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7A6F66] truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Dropdown Navigation Links - Only Dashboard */}
                      <div className="py-2">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#2B231D] hover:bg-[#FAF6F1] hover:text-[#4A3525] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#8B6B52]" />
                          <span>Dashboard</span>
                        </Link>
                      </div>

                      {/* Sign Out Button */}
                      <div className="pt-2 border-t border-[#F0EAE1]">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                            showToast('👋 Signed out successfully!', 'info');
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-[#8B2D2D] bg-[#8B2D2D]/5 hover:bg-[#8B2D2D]/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Logged Out Welcome Card */}
                      <div className="text-center pb-3 border-b border-[#F0EAE1]">
                        <h4 className="font-heading text-sm font-bold text-[#2B231D]">
                          Welcome to Al Hareer
                        </h4>
                        <p className="text-[11px] text-[#7A6F66] mt-0.5">
                          Sign in to access your bespoke orders, appointments &amp; wishlist
                        </p>
                      </div>

                      <div className="pt-3 space-y-2">
                        <a
                          href="/account?mode=signin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full py-2.5 px-4 bg-[#2B231D] hover:bg-[#4A3525] text-white text-xs font-bold font-heading rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>Sign In</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon (Desktop only - available in bottom nav on mobile) */}
            <Link
              href="/wishlist"
              className="hidden lg:flex relative w-10 h-10 rounded-full items-center justify-center text-[#2B231D] hover:text-[#4A3525] bg-transparent hover:bg-[#EFE8E0]/70 active:scale-95 transition-all duration-200 cursor-pointer group"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform duration-200" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#8B2D2D] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-[#FAF6F1] shadow-2xs animate-in zoom-in-75 duration-200 leading-none">
                  {wishlist.length > 99 ? '99+' : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon (Desktop only - available in bottom nav on mobile) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden lg:flex relative w-10 h-10 rounded-full items-center justify-center text-[#2B231D] hover:text-[#4A3525] bg-[#FAF6F1] hover:bg-[#EFE8E0] border border-[#E8DFD5] hover:border-[#DACDC0] shadow-2xs active:scale-95 transition-all duration-200 cursor-pointer group"
              aria-label="Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8] text-[#2B231D] group-hover:scale-110 transition-transform duration-200" />
              {totalItems > 0 ? (
                <span className="absolute -top-1 -right-1 bg-[#4A3525] text-white text-[10px] font-bold min-w-[19px] h-[19px] px-1 rounded-full flex items-center justify-center border-2 border-[#FAF6F1] shadow-xs animate-in zoom-in-75 duration-200 leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              ) : (
                <span className="absolute -top-0.5 -right-0.5 bg-[#A89C8F] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#FAF6F1] leading-none">
                  0
                </span>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1F1813]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-[85vw] max-w-[340px] sm:max-w-[380px] bg-[#FAF6F1] shadow-2xl z-50 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto no-scrollbar animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col select-none"
                >
                  <BrandLogo size="sm" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#2B231D] hover:bg-[#EFE8E0] transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.href, link.name);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => {
                        handleNavClick(link.name, link.href);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between py-3 px-3.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#EFE8E0] text-[#4A3525] font-semibold border-l-4 border-[#4A3525]'
                          : 'text-[#2B231D] hover:bg-[#F3ECE1]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#4A3525]" />}
                        <span>{link.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile User Profile Section */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E5DACD] shadow-2xs my-3">
                {isLoggedIn && user ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#4A3525] text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-heading text-xs sm:text-sm font-bold text-[#2B231D] truncate">
                            {user.name}
                          </h4>
                          <span className="text-[9px] font-bold text-[#1E7E34] bg-[#1E7E34]/10 px-1.5 py-0.2 rounded">
                            VIP
                          </span>
                        </div>
                        <p className="text-[10.5px] text-[#7A6F66] truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-[#F0EAE1]">
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-2 px-2 bg-[#FAF6F1] text-center text-xs font-semibold text-[#4A3525] rounded-lg border border-[#E5DACD]"
                      >
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                          showToast('👋 Signed out successfully!', 'info');
                        }}
                        className="py-2 px-3 bg-[#8B2D2D]/10 text-xs font-bold text-[#8B2D2D] rounded-lg flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#2B231D]">VIP Membership</p>
                      <p className="text-[10.5px] text-[#7A6F66]">Sign in for orders &amp; wishlist</p>
                    </div>
                    <Link
                      href="/account?mode=signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3.5 py-2 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold rounded-lg shadow-2xs"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#EFE8E0] text-[#2B231D] text-xs font-semibold hover:bg-[#E5DACD] transition-colors"
                >
                  <Heart className="w-4 h-4 text-[#8B2D2D]" />
                  <span>Wishlist ({wishlist.length})</span>
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#EFE8E0] text-[#2B231D] text-xs font-semibold hover:bg-[#E5DACD] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#4A3525]" />
                  <span>Bag ({totalItems})</span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="space-y-4 pt-4 border-t border-[#E8DFD5]">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#4A3525] text-white py-3 rounded-full text-sm font-medium shadow-sm"
              >
                <span>Shop Now</span>
              </Link>

              <div className="flex items-center justify-between pt-2 text-xs text-[#7A6F66]">
                <span>Language & Currency</span>
                <span className="font-semibold text-[#4A3525]">{selectedCurrency}</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-5 pt-2 text-[#4A3525]">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4 hover:text-[#8B6B52]" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FacebookIcon className="w-4 h-4 hover:text-[#8B6B52]" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <YoutubeIcon className="w-4 h-4 hover:text-[#8B6B52]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
