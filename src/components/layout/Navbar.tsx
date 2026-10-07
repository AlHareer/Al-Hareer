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
import { getNavMenuData, type NavMenuData } from '@/lib/products';
import ShopMegaMenu from '@/components/layout/ShopMegaMenu';

export default function Navbar() {
  const pathname = usePathname();
  const [navMenu, setNavMenu] = useState<NavMenuData | null>(null);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const shopMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getNavMenuData().then(setNavMenu).catch(() => setNavMenu(null));
  }, []);

  const openShopMenu = () => {
    if (shopMenuTimeoutRef.current) clearTimeout(shopMenuTimeoutRef.current);
    setShopMenuOpen(true);
  };
  const scheduleCloseShopMenu = () => {
    if (shopMenuTimeoutRef.current) clearTimeout(shopMenuTimeoutRef.current);
    shopMenuTimeoutRef.current = setTimeout(() => setShopMenuOpen(false), 250);
  };

  useEffect(() => {
    if (!shopMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShopMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shopMenuOpen]);
  const [currentHash, setCurrentHash] = useState('');
  const [optimisticActive, setOptimisticActive] = useState<string | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
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
    setShopMenuOpen(false);
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

  // Called when a link inside the Shop menu is clicked. The shop page is already
  // mounted when we're on /shop, so tell it to re-read the new filter.
  const handleShopMenuNavigate = (href: string) => {
    setShopMenuOpen(false);
    handleNavClick('Shop', href);
    if (pathname.startsWith('/shop')) {
      window.dispatchEvent(new CustomEvent('shop-filter-sync', { detail: { href } }));
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
        <div className="relative w-full bg-gradient-to-r from-[#00303A] via-[#00303A] to-[#00303A] border-b border-[#CFAC64]/35 text-[#F6F1EC] py-2 sm:py-2.5 overflow-hidden select-none shadow-[0_4px_20px_-4px_rgba(0,48,58,0.5)]">
          {/* Soft Central Radial Gold Ambient Light */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(207,172,100,0.1)_0%,_transparent_75%)] pointer-events-none" />

          {/* Left Gradient Edge Mask for Smooth Luxury Fade */}
          <div className="absolute left-0 inset-y-0 w-10 sm:w-28 bg-gradient-to-r from-[#00303A] via-[#00303A]/95 to-transparent z-10 pointer-events-none" />

          {/* Right Gradient Edge Mask for Smooth Luxury Fade */}
          <div className="absolute right-0 inset-y-0 w-10 sm:w-28 bg-gradient-to-l from-[#00303A] via-[#00303A]/95 to-transparent z-10 pointer-events-none" />

          {/* Infinite Smooth Scrolling Marquee */}
          <div className="w-full overflow-hidden flex">
            <div className="animate-marquee-infinite flex items-center hover:[animation-play-state:paused] cursor-default">
              {[...Array(6)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center shrink-0">
                  {announcements.map((message, idx) => (
                    <div key={`${setIdx}-${idx}`} className="flex items-center shrink-0">
                      <div className="flex items-center gap-3 mx-5 sm:mx-9 group cursor-default">
                        <span className="inline-flex items-center justify-center text-[#CFAC64] select-none text-xs drop-shadow-[0_0_8px_rgba(207,172,100,0.85)] group-hover:scale-125 transition-transform duration-300">
                          ✦
                        </span>
                        <span className="font-heading text-[11px] sm:text-[12px] font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#F6F1EC] group-hover:text-[#CFAC64] transition-colors whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,48,58,0.6)]">
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
            ? 'bg-[#F6F1EC]/95 backdrop-blur-md shadow-sm border-b border-[#CFAC64]/90 py-3'
            : 'bg-[#F6F1EC] border-b border-[#CFAC64] py-4'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Mobile: Hamburger Icon */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#00303A] hover:text-[#024F5F] hover:bg-[#F6F1EC]/70 active:scale-95 transition-all focus:outline-none cursor-pointer"
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
              const isShop = link.name === 'Shop';

              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={isShop ? openShopMenu : undefined}
                  onMouseLeave={isShop ? scheduleCloseShopMenu : undefined}
                >
                  <Link
                    href={link.href}
                    onClick={() => {
                      handleNavClick(link.name, link.href);
                      if (isShop) setShopMenuOpen(false);
                    }}
                    onFocus={isShop ? openShopMenu : undefined}
                    aria-haspopup={isShop ? 'menu' : undefined}
                    aria-expanded={isShop ? shopMenuOpen : undefined}
                    className={`text-[14px] font-medium transition-colors relative py-1.5 inline-flex items-center gap-1 ${
                      isActive ? 'text-[#00303A] font-semibold' : 'text-[#024F5F]/85 hover:text-[#00303A]'
                    }`}
                  >
                    {link.name}
                    {isShop && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${shopMenuOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#024F5F] rounded-full animate-in fade-in duration-200" />
                    )}
                  </Link>

                  {isShop && (
                    <ShopMegaMenu
                      data={navMenu}
                      open={shopMenuOpen}
                      onNavigate={handleShopMenuNavigate}
                      onMouseEnter={openShopMenu}
                      onMouseLeave={scheduleCloseShopMenu}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Header Action Items - Ultra-Modern & Responsive */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3">
            {/* Search Icon (Desktop only - available in bottom nav on mobile) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex relative w-10 h-10 rounded-full items-center justify-center text-[#00303A] hover:text-[#024F5F] bg-transparent hover:bg-[#F6F1EC]/70 active:scale-95 transition-all duration-200 cursor-pointer group"
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
                    ? 'bg-[#F6F1EC] hover:bg-[#F6F1EC] border border-[#CFAC64] hover:border-[#CFAC64] shadow-2xs text-[#024F5F]'
                    : 'bg-transparent hover:bg-[#F6F1EC]/70 text-[#00303A] hover:text-[#024F5F]'
                }`}
                aria-label="Account"
                title={isLoggedIn ? `Logged in as ${user?.name || 'User'}` : 'Account profile'}
              >
                <User className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[1.8] group-hover:scale-110 transition-transform duration-200" />
                {isLoggedIn && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#024F5F] w-2.5 h-2.5 rounded-full border-2 border-[#F6F1EC] shadow-2xs animate-in zoom-in-75 duration-200" />
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
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-[#CFAC64] shadow-[0_20px_45px_-12px_rgba(0,48,58,0.18)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {isLoggedIn && user ? (
                    <div>
                      {/* Logged in User Profile Header */}
                      <div className="flex items-center gap-3 pb-3.5 border-b border-[#F6F1EC]">
                        <div className="w-10 h-10 rounded-full bg-[#CFAC64] text-white font-heading font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-heading text-sm font-bold text-[#00303A] truncate">
                              {user.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-[#024F5F] truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Dropdown Navigation Links - Only Dashboard */}
                      <div className="py-2">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#00303A] hover:bg-[#F6F1EC] hover:text-[#024F5F] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#024F5F]" />
                          <span>Dashboard</span>
                        </Link>
                      </div>

                      {/* Sign Out Button */}
                      <div className="pt-2 border-t border-[#F6F1EC]">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                            showToast('👋 Signed out successfully!', 'info');
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-[#024F5F] bg-[#024F5F]/5 hover:bg-[#024F5F]/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Logged Out Welcome Card */}
                      <div className="text-center pb-3 border-b border-[#F6F1EC]">
                        <h4 className="font-heading text-sm font-bold text-[#00303A]">
                          Welcome to Al Hareer
                        </h4>
                        <p className="text-[11px] text-[#024F5F] mt-0.5">
                          Sign in to access your bespoke orders, appointments &amp; wishlist
                        </p>
                      </div>

                      <div className="pt-3 space-y-2">
                        <a
                          href="/account?mode=signin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full py-2.5 px-4 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-bold font-heading rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
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
              className="hidden lg:flex relative w-10 h-10 rounded-full items-center justify-center text-[#00303A] hover:text-[#024F5F] bg-transparent hover:bg-[#F6F1EC]/70 active:scale-95 transition-all duration-200 cursor-pointer group"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform duration-200" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#024F5F] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-[#F6F1EC] shadow-2xs animate-in zoom-in-75 duration-200 leading-none">
                  {wishlist.length > 99 ? '99+' : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon (Desktop only - available in bottom nav on mobile) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden lg:flex relative w-10 h-10 rounded-full items-center justify-center text-[#00303A] hover:text-[#024F5F] bg-[#F6F1EC] hover:bg-[#F6F1EC] border border-[#CFAC64] hover:border-[#CFAC64] shadow-2xs active:scale-95 transition-all duration-200 cursor-pointer group"
              aria-label="Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8] text-[#00303A] group-hover:scale-110 transition-transform duration-200" />
              {totalItems > 0 ? (
                <span className="absolute -top-1 -right-1 bg-[#024F5F] text-white text-[10px] font-bold min-w-[19px] h-[19px] px-1 rounded-full flex items-center justify-center border-2 border-[#F6F1EC] shadow-xs animate-in zoom-in-75 duration-200 leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              ) : (
                <span className="absolute -top-0.5 -right-0.5 bg-[#CFAC64] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#F6F1EC] leading-none">
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
            className="fixed inset-0 bg-[#00303A]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-[85vw] max-w-[340px] sm:max-w-[380px] bg-[#F6F1EC] shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Scrollable menu content */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#CFAC64]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col select-none"
                >
                  <BrandLogo size="sm" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#00303A] hover:bg-[#F6F1EC] transition-colors cursor-pointer"
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
                    <React.Fragment key={link.name}>
                      {(() => {
                        const hasShopGroups = link.name === 'Shop' && !!navMenu && navMenu.groups.length > 0;
                        return (
                          <div className="flex items-stretch gap-1.5">
                            <Link
                              href={link.href}
                              onClick={() => {
                                handleNavClick(link.name, link.href);
                                setMobileMenuOpen(false);
                              }}
                              className={`flex-1 flex items-center justify-between py-3 px-3.5 rounded-lg text-sm font-medium transition-all ${
                                isActive
                                  ? 'bg-white text-[#024F5F] font-semibold border-l-4 border-[#CFAC64] shadow-2xs'
                                  : 'text-[#00303A] hover:bg-white/70'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#CFAC64]" />}
                                <span>{link.name}</span>
                              </span>
                            </Link>
                            {hasShopGroups && (
                              <button
                                type="button"
                                onClick={() => setMobileShopOpen((o) => !o)}
                                aria-expanded={mobileShopOpen}
                                aria-label="Toggle shop categories"
                                className={`w-11 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                                  mobileShopOpen
                                    ? 'bg-[#024F5F] border-[#024F5F] text-white'
                                    : 'bg-white border-[#CFAC64]/70 text-[#024F5F]'
                                }`}
                              >
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileShopOpen ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                        );
                      })()}
                      {link.name === 'Shop' && navMenu && navMenu.groups.length > 0 && (
                        <div
                          className={`grid transition-all duration-300 ease-out ${
                            mobileShopOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="grid grid-cols-2 gap-2.5 pt-1.5 pb-2 px-0.5">
                              {navMenu.groups.map((c) => (
                                <Link
                                  key={c.href}
                                  href={c.href}
                                  onClick={() => {
                                    handleShopMenuNavigate(c.href);
                                    setMobileMenuOpen(false);
                                  }}
                                  className="group relative block aspect-[4/5] rounded-2xl overflow-hidden border border-[#CFAC64]/60 bg-white shadow-2xs active:scale-[0.97] transition-transform"
                                >
                                  {c.image ? (
                                    <Image
                                      src={c.image}
                                      alt={c.label}
                                      fill
                                      sizes="160px"
                                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                  ) : (
                                    <span className="absolute inset-0 flex items-center justify-center bg-[#F6F1EC] text-[#CFAC64]">
                                      <Sparkles className="w-7 h-7" />
                                    </span>
                                  )}
                                  <span className="absolute inset-0 bg-gradient-to-t from-[#00303A]/85 via-[#00303A]/15 to-transparent" />
                                  <span className="absolute inset-x-0 bottom-0 p-2.5 flex items-end justify-between gap-1">
                                    <span className="font-heading text-[13px] font-bold text-white leading-tight drop-shadow">
                                      {c.label}
                                    </span>
                                    <span className="w-5 h-5 rounded-full bg-[#CFAC64] text-white flex items-center justify-center text-[11px] shrink-0">
                                      ›
                                    </span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                            <Link
                              href="/shop"
                              onClick={() => {
                                handleShopMenuNavigate('/shop');
                                setMobileMenuOpen(false);
                              }}
                              className="block text-center text-xs font-semibold text-[#024F5F] underline underline-offset-4 pb-2"
                            >
                              View all products
                            </Link>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#F6F1EC] text-[#00303A] text-xs font-semibold hover:bg-[#CFAC64] transition-colors"
                >
                  <Heart className="w-4 h-4 text-[#024F5F]" />
                  <span>Wishlist ({wishlist.length})</span>
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#F6F1EC] text-[#00303A] text-xs font-semibold hover:bg-[#CFAC64] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#024F5F]" />
                  <span>Bag ({totalItems})</span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="space-y-4 pt-4 border-t border-[#CFAC64]">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#CFAC64] text-white py-3 rounded-full text-sm font-medium shadow-sm"
              >
                <span>Shop Now</span>
              </Link>

              <div className="flex items-center justify-between pt-2 text-xs text-[#024F5F]">
                <span>Language & Currency</span>
                <span className="font-semibold text-[#024F5F]">{selectedCurrency}</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-5 pt-2 text-[#024F5F]">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4 hover:text-[#024F5F]" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FacebookIcon className="w-4 h-4 hover:text-[#024F5F]" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <YoutubeIcon className="w-4 h-4 hover:text-[#024F5F]" />
                </a>
              </div>
            </div>
            {/* Mobile User Profile Section — pinned to the bottom of the drawer */}
            </div>

            <div className="shrink-0 px-5 sm:px-6 pt-3 pb-5 sm:pb-6 bg-[#F6F1EC] border-t border-[#CFAC64]/60 shadow-[0_-6px_12px_-8px_rgba(0,48,58,0.25)]">
  <div className="p-3.5 bg-white rounded-xl border border-[#CFAC64] shadow-2xs">
    {isLoggedIn && user ? (
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#CFAC64] text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-heading text-xs sm:text-sm font-bold text-[#00303A] truncate">
                {user.name}
              </h4>
            </div>
            <p className="text-[10.5px] text-[#024F5F] truncate">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-[#F6F1EC]">
          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="flex-1 py-2 px-2 bg-[#F6F1EC] text-center text-xs font-semibold text-[#024F5F] rounded-lg border border-[#CFAC64]"
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
            className="py-2 px-3 bg-[#024F5F]/10 text-xs font-bold text-[#024F5F] rounded-lg flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#00303A]">Welcome to Al Hareer</p>
          <p className="text-[10.5px] text-[#024F5F]">Sign in for orders &amp; wishlist</p>
        </div>
        <Link
          href="/account?mode=signin"
          onClick={() => setMobileMenuOpen(false)}
          className="px-3.5 py-2 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold rounded-lg shadow-2xs"
        >
          Sign In
        </Link>
      </div>
    )}
  </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
