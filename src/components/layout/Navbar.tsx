'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
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

export default function Navbar() {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');
  const [optimisticActive, setOptimisticActive] = useState<string | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('India (₹)');
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsCollectionsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCollectionsHovered(false);
    }, 180);
  };

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

  const handleMegaMenuClick = (targetHref?: string) => {
    setIsCollectionsHovered(false);
    setMobileMenuOpen(false);
    setOptimisticActive('Shop');
    setCurrentHash('');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shop-filter-sync', { detail: { href: targetHref } }));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('shop-filter-sync', { detail: { href: targetHref } }));
      }, 70);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/shop' },
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/story' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#FAF6F1] border-b border-[#E8DFD5] text-[#554D46] text-[11px] sm:text-xs py-2 px-4 sm:px-6 lg:px-12 transition-colors ">
        <div className="max-w-[1350px] mx-auto flex items-center justify-between">
          {/* Left: Perks */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar font-medium whitespace-nowrap">
            <span>Free Shipping on Orders Above ₹999</span>
            <span className="text-[#C6B09B]">|</span>
            <span>Easy Returns</span>
            <span className="text-[#C6B09B]">|</span>
            <span>Cash on Delivery</span>
          </div>

          {/* Right: Socials & Currency Selector */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-[#7A6F66] font-medium text-xs">Follow Us</span>
              <div className="flex items-center gap-2 text-[#4A3525]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="hover:text-[#8B6B52] transition-colors p-0.5"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="hover:text-[#8B6B52] transition-colors p-0.5"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="hover:text-[#8B6B52] transition-colors p-0.5"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            className="flex flex-col items-center lg:items-start group select-none tracking-widest text-center lg:text-left"
          >
            <span className="font-heading text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#2B231D] group-hover:text-[#4A3525] transition-colors leading-tight">
              AL HAREER
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.38em] text-[#7A6F66] font-medium -mt-0.5 sm:-mt-1">
              TRADITION IN STYLE
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href, link.name);
              
              if (link.name === 'Collections') {
                return (
                  <div
                    key="Collections"
                    className="relative py-2"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href="/shop"
                      onClick={() => {
                        handleNavClick('Collections', '/shop');
                        setIsCollectionsHovered(false);
                      }}
                      className={`inline-flex items-center gap-1.5 text-[14px] font-medium transition-all duration-200 px-3.5 py-1.5 rounded-full cursor-pointer ${
                        isCollectionsHovered
                          ? 'bg-[#4A3525] text-white shadow-xs'
                          : 'text-[#4A3525] hover:bg-[#EFE8E0] hover:text-[#2B231D]'
                      }`}
                    >
                      <span>Collections</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isCollectionsHovered ? 'rotate-180 text-white' : 'text-[#7A6F66]'
                        }`}
                      />
                    </Link>
                  </div>
                );
              }

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
                          <ArrowRight className="w-3.5 h-3.5" />
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

        {/* Desktop Mega Menu Dropdown */}
        {isCollectionsHovered && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="hidden lg:block absolute top-full left-0 right-0 w-full bg-[#F7F2EB] border-t-2 border-t-[#4A3525] border-b border-[#DACDC0] shadow-[0_20px_45px_-10px_rgba(43,35,29,0.22)] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-7">
              <div className="grid grid-cols-12 gap-6">
                
                {/* Column 1: Categories (3 cols) */}
                <div className="col-span-3 bg-white p-5 rounded-xl border border-[#E5DACD] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E8DFD5]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4A3525]"></span>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A3525]">
                          Categories
                        </h4>
                      </div>
                      <span className="text-[9px] text-[#8B6B52] bg-[#F5EFE6] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                        Filter
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-sm">
                      <li>
                        <Link
                          href="/shop"
                          onClick={() => handleMegaMenuClick('/shop')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            All Products
                          </span>
                          <span className="text-[9px] bg-[#FAF6F1] text-[#7A6F66] border border-[#DACDC0] px-1.5 py-0.5 rounded font-semibold">
                            All 48
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?category=Kurtas"
                          onClick={() => handleMegaMenuClick('/shop?category=Kurtas')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Kurtas
                          </span>
                          <span className="text-[9px] bg-[#D4AF37]/25 text-[#8B6B52] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                            Classic
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?category=Kurta+Sets"
                          onClick={() => handleMegaMenuClick('/shop?category=Kurta+Sets')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Kurta Sets
                          </span>
                          <span className="text-[9px] bg-[#4A3525] text-white px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                            Bestseller
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?category=Pajamas"
                          onClick={() => handleMegaMenuClick('/shop?category=Pajamas')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Pajamas
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?category=Waistcoats"
                          onClick={() => handleMegaMenuClick('/shop?category=Waistcoats')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Waistcoats
                          </span>
                          <span className="text-[9px] bg-[#EFE8E0] text-[#7A6F66] px-1.5 py-0.5 rounded font-semibold uppercase">
                            Nehru
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?category=Accessories"
                          onClick={() => handleMegaMenuClick('/shop?category=Accessories')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Accessories
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#E8DFD5]">
                    <Link
                      href="/shop"
                      onClick={() => handleMegaMenuClick('/shop')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A3525] hover:text-[#2B231D] transition-colors group"
                    >
                      <span>Explore All Products</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Column 2: Occasion (3 cols) */}
                <div className="col-span-3 bg-white p-5 rounded-xl border border-[#E5DACD] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E8DFD5]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8B6B52]"></span>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A3525]">
                          Occasion
                        </h4>
                      </div>
                      <span className="text-[9px] text-[#8B6B52] bg-[#F5EFE6] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                        Events
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-sm">
                      <li>
                        <Link
                          href="/shop?occasion=Festive"
                          onClick={() => handleMegaMenuClick('/shop?occasion=Festive')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Festive
                          </span>
                          <span className="text-[9px] bg-[#4A3525] text-white px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                            Grandeur
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?occasion=Wedding"
                          onClick={() => handleMegaMenuClick('/shop?occasion=Wedding')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Wedding
                          </span>
                          <span className="text-[9px] bg-[#8B2D2D] text-white px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                            Royal
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?occasion=Casual"
                          onClick={() => handleMegaMenuClick('/shop?occasion=Casual')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Casual
                          </span>
                          <span className="text-[9px] bg-[#FAF6F1] text-[#7A6F66] border border-[#DACDC0] px-1.5 py-0.5 rounded font-medium">
                            Everyday
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?occasion=Formal"
                          onClick={() => handleMegaMenuClick('/shop?occasion=Formal')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Formal
                          </span>
                          <span className="text-[9px] bg-[#FAF6F1] text-[#7A6F66] border border-[#DACDC0] px-1.5 py-0.5 rounded font-medium">
                            Reception
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Occasion Callout Card */}
                  <div className="pt-3 mt-3 border-t border-[#E8DFD5]">
                    <div className="p-3 rounded-lg bg-[#FAF6F1] border border-[#E5DACD]">
                      <p className="text-[11px] font-semibold text-[#4A3525] leading-snug">
                        Celebratory Curations
                      </p>
                      <p className="text-[10px] text-[#7A6F66] mt-0.5 font-light">
                        Tailored fits for royal weddings, Eid, Diwali &amp; evening receptions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 3: Fabric (3 cols) */}
                <div className="col-span-3 bg-white p-5 rounded-xl border border-[#E5DACD] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E8DFD5]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#6B4E3D]"></span>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A3525]">
                          Fabric
                        </h4>
                      </div>
                      <span className="text-[9px] text-[#8B6B52] bg-[#F5EFE6] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                        Pure Weaves
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-sm">
                      <li>
                        <Link
                          href="/shop?fabric=Cotton"
                          onClick={() => handleMegaMenuClick('/shop?fabric=Cotton')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Cotton
                          </span>
                          <span className="text-[9px] bg-[#FAF6F1] text-[#7A6F66] border border-[#DACDC0] px-1.5 py-0.5 rounded font-medium">
                            100% Breathable
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?fabric=Silk"
                          onClick={() => handleMegaMenuClick('/shop?fabric=Silk')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Silk
                          </span>
                          <span className="text-[9px] bg-[#D4AF37]/25 text-[#8B6B52] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                            Chanderi
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?fabric=Linen"
                          onClick={() => handleMegaMenuClick('/shop?fabric=Linen')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Linen
                          </span>
                          <span className="text-[9px] bg-[#FAF6F1] text-[#7A6F66] border border-[#DACDC0] px-1.5 py-0.5 rounded font-medium">
                            Pure Weave
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop?fabric=Blended"
                          onClick={() => handleMegaMenuClick('/shop?fabric=Blended')}
                          className="group flex items-center justify-between text-[#2B231D] hover:text-[#4A3525] hover:bg-[#F9F6F1] px-2.5 py-1.5 rounded-md transition-all"
                        >
                          <span className="group-hover:translate-x-1 transition-transform font-medium text-xs">
                            Blended
                          </span>
                          <span className="text-[9px] bg-[#FAF6F1] text-[#7A6F66] border border-[#DACDC0] px-1.5 py-0.5 rounded font-medium">
                            Silk Blend
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Fabric Callout Card */}
                  <div className="pt-3 mt-3 border-t border-[#E8DFD5]">
                    <div className="p-3 rounded-lg bg-[#FAF6F1] border border-[#E5DACD]">
                      <p className="text-[11px] font-semibold text-[#4A3525] leading-snug">
                        Artisanal Textiles
                      </p>
                      <p className="text-[10px] text-[#7A6F66] mt-0.5 font-light">
                        Ethically sourced natural fibres with soft touch and long-lasting lustre.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 4: Featured Visual Card (3 cols) */}
                <div className="col-span-3">
                  <Link
                    href="/shop?occasion=Wedding"
                    onClick={() => handleMegaMenuClick('/shop?occasion=Wedding')}
                    className="group block relative rounded-xl overflow-hidden shadow-xs h-full min-h-[300px] bg-[#EFE8E0] border border-[#E5DACD]"
                  >
                    <Image
                      src="/images/shopby/wedding.jpg"
                      alt="Royal Wedding Edit"
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-white/95 backdrop-blur-xs text-[#2B231D] px-2.5 py-1 rounded shadow-xs">
                        Royal Heritage
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-heading text-xl font-bold leading-tight mb-1">
                        The Wedding Edit
                      </p>
                      <p className="text-[11px] text-white/80 line-clamp-2 mb-2 font-light">
                        Intricate zari &amp; resham embroideries on pure silken drapes.
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F5E6BE] group-hover:underline">
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </div>

              </div>

              {/* Bottom Highlights Bar inside Mega Menu */}
              <div className="mt-5 px-5 py-3.5 bg-white rounded-xl border border-[#E5DACD] shadow-xs flex items-center justify-between text-xs text-[#7A6F66]">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="text-[#4A3525]">✨</span>
                    <span>100% Handcrafted Artisanal Weaves</span>
                  </span>
                  <span className="hidden sm:inline text-[#DACDC0]">|</span>
                  <span className="hidden sm:flex items-center gap-1.5 font-medium">
                    <span className="text-[#4A3525]">🚚</span>
                    <span>Express Dispatch in 24-48 Hours</span>
                  </span>
                  <span className="hidden md:inline text-[#DACDC0]">|</span>
                  <span className="hidden md:flex items-center gap-1.5 font-medium">
                    <span className="text-[#4A3525]">🧵</span>
                    <span>Custom Fit &amp; Alteration Support</span>
                  </span>
                </div>
                <Link
                  href="/shop"
                  onClick={() => handleMegaMenuClick('/shop')}
                  className="font-semibold text-[#4A3525] hover:text-[#2B231D] inline-flex items-center gap-1 transition-colors group"
                >
                  <span>View Full Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}
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
                  <span className="font-heading text-xl font-bold tracking-[0.2em] text-[#2B231D]">
                    AL HAREER
                  </span>
                  <span className="text-[7.5px] uppercase tracking-[0.35em] text-[#7A6F66]">
                    TRADITION IN STYLE
                  </span>
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
                  if (link.name === 'Collections') {
                    return (
                      <div
                        key="Collections"
                        className="rounded-xl overflow-hidden border border-[#DACDC0] bg-white shadow-xs"
                      >
                        <button
                          onClick={() => setIsMobileCollectionsOpen(!isMobileCollectionsOpen)}
                          className={`w-full flex items-center justify-between py-3 px-3.5 text-sm font-bold transition-all ${
                            isMobileCollectionsOpen
                              ? 'bg-[#4A3525] text-white shadow-xs'
                              : 'bg-[#EFE8E0] text-[#2B231D] hover:bg-[#E5DACD]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>Collections</span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                isMobileCollectionsOpen
                                  ? 'bg-white text-[#4A3525]'
                                  : 'bg-[#4A3525] text-white'
                              }`}
                            >
                              Mega Menu
                            </span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isMobileCollectionsOpen ? 'rotate-180 text-white' : 'text-[#7A6F66]'
                            }`}
                          />
                        </button>

                        {/* Mobile Expandable Collections Accordion */}
                        {isMobileCollectionsOpen && (
                          <div className="p-3.5 space-y-3 bg-[#FAF6F1] border-t border-[#DACDC0] animate-in fade-in duration-200">
                            
                            {/* 1. Categories Card */}
                            <div className="bg-white p-3 rounded-lg border border-[#E8DFD5] shadow-2xs">
                              <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#F0EAE1]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A3525] flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A3525]"></span>
                                  <span>Categories</span>
                                </p>
                                <span className="text-[9px] text-[#8B6B52] font-semibold uppercase">Filter</span>
                              </div>
                              <div className="space-y-1 text-xs">
                                <Link
                                  href="/shop"
                                  onClick={() => handleMegaMenuClick('/shop')}
                                  className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] transition-colors"
                                >
                                  <span className="font-medium">All Products</span>
                                  <span className="text-[9px] bg-[#FAF6F1] text-[#7A6F66] px-1.5 py-0.5 rounded border border-[#E5DACD]">All 48</span>
                                </Link>
                                <Link
                                  href="/shop?category=Kurtas"
                                  onClick={() => handleMegaMenuClick('/shop?category=Kurtas')}
                                  className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] transition-colors"
                                >
                                  <span className="font-medium">Kurtas</span>
                                  <span className="text-[9px] text-[#7A6F66]">Classic</span>
                                </Link>
                                <Link
                                  href="/shop?category=Kurta+Sets"
                                  onClick={() => handleMegaMenuClick('/shop?category=Kurta+Sets')}
                                  className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] transition-colors"
                                >
                                  <span className="font-medium">Kurta Sets</span>
                                  <span className="text-[9px] bg-[#4A3525] text-white px-1.5 py-0.2 rounded font-bold">Hot</span>
                                </Link>
                                <Link
                                  href="/shop?category=Pajamas"
                                  onClick={() => handleMegaMenuClick('/shop?category=Pajamas')}
                                  className="block py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] font-medium transition-colors"
                                >
                                  Pajamas
                                </Link>
                                <Link
                                  href="/shop?category=Waistcoats"
                                  onClick={() => handleMegaMenuClick('/shop?category=Waistcoats')}
                                  className="block py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] font-medium transition-colors"
                                >
                                  Waistcoats &amp; Jackets
                                </Link>
                                <Link
                                  href="/shop?category=Accessories"
                                  onClick={() => handleMegaMenuClick('/shop?category=Accessories')}
                                  className="block py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] font-medium transition-colors"
                                >
                                  Accessories &amp; Stoles
                                </Link>
                              </div>
                            </div>

                            {/* 2. Occasion Card */}
                            <div className="bg-white p-3 rounded-lg border border-[#E8DFD5] shadow-2xs">
                              <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#F0EAE1]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A3525] flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B6B52]"></span>
                                  <span>Occasion</span>
                                </p>
                                <span className="text-[9px] text-[#8B6B52] font-semibold uppercase">Filter</span>
                              </div>
                              <div className="space-y-1 text-xs">
                                <Link
                                  href="/shop?occasion=Festive"
                                  onClick={() => handleMegaMenuClick('/shop?occasion=Festive')}
                                  className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] transition-colors"
                                >
                                  <span className="font-medium">Festive</span>
                                  <span className="text-[9px] bg-[#4A3525] text-white px-1.5 py-0.2 rounded font-bold">Grandeur</span>
                                </Link>
                                <Link
                                  href="/shop?occasion=Wedding"
                                  onClick={() => handleMegaMenuClick('/shop?occasion=Wedding')}
                                  className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] transition-colors"
                                >
                                  <span className="font-medium">Wedding</span>
                                  <span className="text-[9px] bg-[#8B2D2D] text-white px-1.5 py-0.2 rounded font-bold">Royal</span>
                                </Link>
                                <Link
                                  href="/shop?occasion=Casual"
                                  onClick={() => handleMegaMenuClick('/shop?occasion=Casual')}
                                  className="block py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] font-medium transition-colors"
                                >
                                  Casual &amp; Everyday
                                </Link>
                                <Link
                                  href="/shop?occasion=Formal"
                                  onClick={() => handleMegaMenuClick('/shop?occasion=Formal')}
                                  className="block py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] font-medium transition-colors"
                                >
                                  Formal &amp; Evening
                                </Link>
                              </div>
                            </div>

                            {/* 3. Fabric Card */}
                            <div className="bg-white p-3 rounded-lg border border-[#E8DFD5] shadow-2xs">
                              <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#F0EAE1]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A3525] flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B4E3D]"></span>
                                  <span>Fabric</span>
                                </p>
                                <span className="text-[9px] text-[#8B6B52] font-semibold uppercase">Filter</span>
                              </div>
                              <div className="space-y-1 text-xs">
                                <Link
                                  href="/shop?fabric=Cotton"
                                  onClick={() => handleMegaMenuClick('/shop?fabric=Cotton')}
                                  className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] transition-colors"
                                >
                                  <span className="font-medium">Cotton</span>
                                  <span className="text-[9px] text-[#7A6F66]">Pure Slub</span>
                                </Link>
                                <Link
                                  href="/shop?fabric=Silk"
                                  onClick={() => handleMegaMenuClick('/shop?fabric=Silk')}
                                  className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] transition-colors"
                                >
                                  <span className="font-medium">Silk</span>
                                  <span className="text-[9px] bg-[#D4AF37]/25 text-[#8B6B52] px-1.5 py-0.2 rounded font-bold">Chanderi</span>
                                </Link>
                                <Link
                                  href="/shop?fabric=Linen"
                                  onClick={() => handleMegaMenuClick('/shop?fabric=Linen')}
                                  className="block py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] font-medium transition-colors"
                                >
                                  Linen
                                </Link>
                                <Link
                                  href="/shop?fabric=Blended"
                                  onClick={() => handleMegaMenuClick('/shop?fabric=Blended')}
                                  className="block py-1.5 px-2 rounded hover:bg-[#F7F2EB] text-[#2B231D] font-medium transition-colors"
                                >
                                  Blended
                                </Link>
                              </div>
                            </div>

                            {/* Mini Visual Promo Card */}
                            <Link
                              href="/shop?occasion=Wedding"
                              onClick={() => handleMegaMenuClick('/shop?occasion=Wedding')}
                              className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#DACDC0] shadow-xs group hover:border-[#4A3525] transition-colors"
                            >
                              <div className="relative w-12 h-14 rounded overflow-hidden shrink-0">
                                <Image
                                  src="/images/shopby/wedding.jpg"
                                  alt="The Wedding Edit"
                                  fill
                                  className="object-cover object-top"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A3525]">
                                  Royal Edit
                                </p>
                                <p className="text-xs font-bold text-[#2B231D] truncate">
                                  The Wedding Collection
                                </p>
                                <span className="text-[10px] text-[#7A6F66] group-hover:text-[#4A3525] inline-flex items-center gap-1 font-semibold">
                                  <span>Explore Edit</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </Link>

                            {/* All Collections Link */}
                            <Link
                              href="/shop"
                              onClick={() => handleMegaMenuClick('/shop')}
                              className="block text-center py-2.5 bg-[#4A3525] hover:bg-[#36261A] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                            >
                              View All Collections (48) →
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  }

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
                      <ArrowRight className={`w-4 h-4 ${isActive ? 'text-[#4A3525]' : 'text-[#7A6F66]'}`} />
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
                <ArrowRight className="w-4 h-4" />
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
