'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Ruler,
  ShieldCheck,
  RefreshCw,
  Truck,
  Package,
  Wind,
  Calendar,
  Plus,
  Minus,
  Check,
  Eye,
  X,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';
import { Product } from '@/types';

export default function SingleProductPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : 'prod-1';
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast, openQuickView } = useUI();

  // Gallery list: images from product or default to single image
  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.image, '/images/shopby/heritage-fabric.jpg'];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'S');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'sizing' | 'shipping' | 'reviews'>('details');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState<boolean>(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 22;

  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNextImage();
    } else if (diff < -45) {
      handlePrevImage();
    }
  };

  const currentMainImage = galleryImages[activeImageIndex] || galleryImages[0] || product.image;

  const handleColorClick = (colorName: string, imageSrc?: string) => {
    setSelectedColor(colorName);
    if (imageSrc) {
      const idx = galleryImages.indexOf(imageSrc);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    showToast(`Added ${quantity} × ${product.name} (${selectedSize}) to Bag!`);
  };

  const [selectedRelatedColors, setSelectedRelatedColors] = useState<{ [productId: string]: { name: string; image: string } }>({});

  const handleRelatedColorSelect = (productId: string, colorName: string, imageSrc: string) => {
    setSelectedRelatedColors((prev) => ({
      ...prev,
      [productId]: { name: colorName, image: imageSrc },
    }));
  };

  const handleQuickAddRelated = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const activeColor = selectedRelatedColors[p.id]?.name || p.colors[0]?.name;
    const activeSize = p.sizes[0] || 'M';
    addToCart(p, activeColor, activeSize, 1);
    showToast(`Added ${p.name} to Bag!`);
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF6F0] text-brand-700 selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Main Container */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-16 md:pb-8 w-full">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-brand-700 transition-colors">
            Home
          </Link>
          <span className="text-cream-400">&gt;</span>
          <Link href="/#shop" className="hover:text-brand-700 transition-colors">
            Men
          </Link>
          <span className="text-cream-400">&gt;</span>
          <span className="capitalize hover:text-brand-700 transition-colors">
            {product.category} Collection
          </span>
          <span className="text-cream-400">&gt;</span>
          <span className="text-brand-800 font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Top Product Section: Gallery + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Image Gallery (Desktop: col-span-6 with reduced height) */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-3.5 sm:gap-4 items-stretch md:items-start w-full">
            
            {/* Desktop / Tablet Vertical Thumbnails (Mobile: Horizontal row) */}
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar w-full md:w-20 shrink-0 py-1 md:py-0">
              {galleryImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 sm:w-16 md:w-20 h-16 sm:h-20 md:h-24 rounded-[6px] overflow-hidden border-2 transition-all shrink-0 bg-cream-200 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-brand-700 shadow-md ring-1 ring-brand-700 scale-102'
                      : 'border-cream-300/80 hover:border-brand-400 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`View thumbnail ${idx + 1}`}
                >
                  <Image
                    src={imgSrc}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    unoptimized
                    className="object-cover object-top"
                  />
                  {/* Video badge on last thumbnail if applicable */}
                  {idx === galleryImages.length - 1 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Main Featured Image Box (Responsive for Mobile and Desktop) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full aspect-[4/5] sm:aspect-[4/5] md:aspect-auto md:flex-1 min-w-0 h-[380px] xs:h-[420px] sm:h-[460px] md:h-[460px] lg:h-[530px] rounded-[10px] overflow-hidden bg-cream-200 border border-cream-300/80 shadow-md group touch-pan-y select-none"
            >
              <Image
                src={currentMainImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Tag / Trending Badge */}
              <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 pointer-events-none">
                <span className="bg-[#3E2B1E] text-[#E0EFE6] text-[9px] sm:text-[10px] font-medium px-2.5 py-1 rounded-[5px] uppercase tracking-wider shadow-md">
                  {product.tag || 'TRENDING'}
                </span>
              </div>

              {/* Fullscreen Zoom Button */}
              <button
                onClick={() => setIsFullscreenImage(true)}
                className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-brand-800 backdrop-blur-sm flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
                aria-label="Zoom image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Mobile Wishlist Button on Top-Right */}
              <button
                onClick={() => toggleWishlist(product)}
                className="md:hidden absolute top-3 right-12 z-10 w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow-md transition-all cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-brand-700'}`} />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-brand-800 backdrop-blur-sm flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 -translate-x-0.5" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-brand-800 backdrop-blur-sm flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 translate-x-0.5" />
              </button>

              {/* Mobile Image Counter Badge */}
              <div className="md:hidden absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full pointer-events-none">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </div>

          </div>

          {/* Right Column: Product Info & Buy Actions (LG: col-span-6) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            
            {/* Header: Collection & Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-600">
                  {product.category.toUpperCase()} COLLECTION
                </span>
                <span className="w-5 h-[1.5px] bg-[#C6B09B]" />
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-bold text-brand-700 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Star Rating & Bought Count */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-amber-300'
                      }`}
                    />
                  ))}
                  <span className="font-bold text-brand-800 ml-1">
                    {product.rating}
                  </span>
                  <span className="text-muted font-normal">
                    ({product.reviewCount} reviews)
                  </span>
                </div>

                <span className="text-cream-400">|</span>
                <span className="text-muted font-medium text-xs">
                  1K+ bought this month
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-3 pt-0.5">
              <span className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-800">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm sm:text-base text-muted line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="bg-[#1F5C3B] text-white text-[11px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
              <div className="ml-auto text-xs text-right">
                <span className="inline-flex items-center gap-1.5 font-bold text-[#1F5C3B]">
                  <span className="w-2 h-2 rounded-full bg-[#1F5C3B] animate-pulse" />
                  In Stock
                </span>
                <span className="block text-[10px] text-muted">Ready to Ship</span>
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-800">
                  Color: <span className="font-normal text-brand-600">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleColorClick(c.name, c.image)}
                    className={`w-7 h-7 rounded-full p-0.5 border-2 transition-all flex items-center justify-center ${
                      selectedColor === c.name
                        ? 'border-brand-700 scale-110 shadow-sm'
                        : 'border-transparent hover:scale-105'
                    }`}
                    title={c.name}
                    aria-label={`Select ${c.name} color`}
                  >
                    <span
                      className="w-full h-full rounded-full border border-black/15 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-800">
                  Size: <span className="font-normal text-brand-600">{selectedSize}</span>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 underline underline-offset-4 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[40px] sm:min-w-[46px] h-9 sm:h-10 px-2.5 rounded-[5px] text-xs font-bold transition-all border ${
                      selectedSize === s
                        ? 'bg-[#3E2B1E] text-white border-[#3E2B1E] shadow-sm'
                        : 'bg-white text-brand-700 border-cream-300 hover:border-brand-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector + Add to Bag + Wishlist (Side by Side in 1 Row) */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
              {/* Quantity Counter */}
              <div className="inline-flex items-center border border-cream-300 rounded-[5px] bg-white h-11 sm:h-12 shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 sm:px-3 h-full text-brand-700 hover:bg-cream-100 transition-colors flex items-center justify-center cursor-pointer rounded-tl-[5px] rounded-bl-[5px]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 sm:px-3 text-xs font-bold text-brand-800 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2.5 sm:px-3 h-full text-brand-700 hover:bg-cream-100 transition-colors flex items-center justify-center cursor-pointer rounded-tr-[5px] rounded-br-[5px]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-[#3E2B1E] hover:bg-brand-800 active:scale-[0.99] text-white h-11 sm:h-12 rounded-[5px] font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              {/* Add to Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`h-11 sm:h-12 px-3 sm:px-4 rounded-[5px] border flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-sm tracking-wide transition-all shrink-0 cursor-pointer ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-cream-300 text-brand-800 hover:bg-cream-100'
                }`}
                title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Short Description Paragraph */}
            <p className="text-xs sm:text-sm text-muted leading-relaxed pt-1">
              {product.description}
            </p>

            {/* 3 Feature Highlight Badges */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-[6px] bg-cream-200/70 border border-cream-300/80">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-600 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[11.5px] font-bold text-brand-800 leading-tight">
                    Premium Fabric
                  </span>
                  <span className="text-[9.5px] text-muted truncate">
                    {product.details?.material || 'Silk-Cotton Blend'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 border-l border-cream-300/80 pl-2">
                <Wind className="w-4 h-4 text-brand-600 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[11.5px] font-bold text-brand-800 leading-tight">
                    Breathable
                  </span>
                  <span className="text-[9.5px] text-muted truncate">
                    All-Day Comfort
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 border-l border-cream-300/80 pl-2">
                <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[11.5px] font-bold text-brand-800 leading-tight">
                    Perfect for
                  </span>
                  <span className="text-[9.5px] text-muted truncate">
                    Festive Occasions
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Assurance Row */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-cream-300 text-[11.5px] sm:text-[11px] text-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="leading-tight">100% Authentic Fabric</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="leading-tight">7-Day Easy Exchange</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="leading-tight">Free Shipping above ₹999</span>
              </div>
            </div>

          </div>

        </div>

        {/* Product Tabs Section */}
        <div className="mt-14 sm:mt-20 pt-10 border-t border-cream-300">
          
          {/* Tabs Navigation */}
          <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto lg:overflow-x-hidden no-scrollbar border-b border-cream-300 pb-3">
            {[
              { id: 'details', label: 'Product Details' },
              { id: 'care', label: 'Fabric & Care' },
              { id: 'sizing', label: 'Size Guide' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-sm sm:text-base font-semibold pb-2 transition-all relative whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-brand-800 font-bold'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#3E2B1E] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="py-8">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left details */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="font-heading text-2xl font-bold text-brand-800">
                    Product Details
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    This {product.name} is designed for the modern man who values tradition. Tailored with a rich textured weave and finished with premium detailing, it offers the perfect blend of comfort and elegance for special occasions.
                  </p>

                  <ul className="space-y-2.5 pt-2 text-sm text-brand-800">
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span><strong>Fabric:</strong> {product.details?.material || product.fabric}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span><strong>Color:</strong> {product.details?.color || selectedColor}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span><strong>Set Includes:</strong> {product.details?.setIncludes || 'Kurta (Bottom not included)'}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span><strong>Work:</strong> {product.details?.work || 'Subtle woven texture with premium finish'}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span><strong>Occasion:</strong> {product.details?.occasion || 'Weddings, Diwali, Festive Gatherings'}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span><strong>Fit:</strong> {product.details?.fit || 'Regular Fit'}</span>
                    </li>
                  </ul>
                </div>

                {/* Right Macro Fabric Close-up */}
                <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-cream-300 shadow-md group">
                  <Image
                    src="/images/shopby/heritage-fabric.jpg"
                    alt="Fabric weave macro texture"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-brand-800 shadow">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="max-w-2xl space-y-4 text-sm text-muted">
                <h3 className="font-heading text-2xl font-bold text-brand-800">
                  Fabric & Care Instructions
                </h3>
                <p>
                  {product.details?.care || 'Dry clean recommended to preserve delicate fibers, luster, and embroidery detailing.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-cream-200 rounded-lg text-center font-medium text-xs text-brand-800">
                    Dry Clean Recommended
                  </div>
                  <div className="p-3 bg-cream-200 rounded-lg text-center font-medium text-xs text-brand-800">
                    Iron On Low Heat
                  </div>
                  <div className="p-3 bg-cream-200 rounded-lg text-center font-medium text-xs text-brand-800">
                    Do Not Bleach
                  </div>
                  <div className="p-3 bg-cream-200 rounded-lg text-center font-medium text-xs text-brand-800">
                    Store in Cotton Bag
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div className="max-w-3xl space-y-4">
                <h3 className="font-heading text-2xl font-bold text-brand-800">
                  Standard Size Chart (Inches)
                </h3>
                <div className="overflow-x-auto border border-cream-300 rounded-xl bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-cream-200 text-brand-800 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Size</th>
                        <th className="p-3">Chest</th>
                        <th className="p-3">Shoulder</th>
                        <th className="p-3">Length</th>
                        <th className="p-3">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200 text-brand-700">
                      <tr>
                        <td className="p-3 font-bold">S</td>
                        <td className="p-3">38"</td>
                        <td className="p-3">17.5"</td>
                        <td className="p-3">40"</td>
                        <td className="p-3">24.5"</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">M</td>
                        <td className="p-3">40"</td>
                        <td className="p-3">18"</td>
                        <td className="p-3">42"</td>
                        <td className="p-3">25"</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">L</td>
                        <td className="p-3">42"</td>
                        <td className="p-3">18.5"</td>
                        <td className="p-3">44"</td>
                        <td className="p-3">25.5"</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">XL</td>
                        <td className="p-3">44"</td>
                        <td className="p-3">19"</td>
                        <td className="p-3">46"</td>
                        <td className="p-3">26"</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">XXL</td>
                        <td className="p-3">46"</td>
                        <td className="p-3">19.5"</td>
                        <td className="p-3">48"</td>
                        <td className="p-3">26.5"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-4 text-sm text-muted">
                <h3 className="font-heading text-2xl font-bold text-brand-800">
                  Shipping & Return Policy
                </h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Dispatched within 24-48 hours.</li>
                  <li>Standard delivery in 3-5 business days across India.</li>
                  <li>Express next-day delivery available in select metro cities.</li>
                  <li>Hassle-free 7-day exchange and returns from delivery date.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-brand-800">
                      Customer Reviews
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold">{product.rating} out of 5</span>
                      <span className="text-muted">({product.reviewCount} verified ratings)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-white border border-cream-300">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-brand-800">Aditya Verma</span>
                      <span className="text-muted">Verified Buyer • 2 days ago</span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-brand-700 leading-relaxed">
                      "Absolutely magnificent craftsmanship! The fabric quality and embroidery finish is top tier. Wore it to my brother's wedding and received tons of compliments."
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-cream-300">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-brand-800">Rajesh Sharma</span>
                      <span className="text-muted">Verified Buyer • 1 week ago</span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-brand-700 leading-relaxed">
                      "Fit is perfect and very comfortable for long festive events. Definitely recommended!"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* You May Also Like Section */}
        <div className="mt-12 sm:mt-16 pt-10 border-t border-cream-300">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-600 block mb-1">
                — SIMILAR STYLES
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-700">
                You May Also Like
              </h2>
            </div>
            <Link
              href="/#shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors uppercase tracking-wider"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-6">
            {relatedProducts.map((rel) => {
              const currentSelectedColor = selectedRelatedColors[rel.id]?.name || rel.colors[0]?.name;
              const currentImage = selectedRelatedColors[rel.id]?.image || rel.image;
              const isRelWishlisted = isInWishlist(rel.id);

              return (
                <div
                  key={rel.id}
                  className="group flex flex-col bg-white rounded-[5px] overflow-hidden border border-cream-300 shadow-sm hover:shadow-luxury-hover transition-all duration-500"
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-[4/4.8] lg:aspect-[4/4.1] bg-cream-200 overflow-hidden">
                    <Link href={`/product/${rel.id}`} className="block w-full h-full">
                      <Image
                        src={currentImage}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                      />
                    </Link>

                    {/* Tag badge */}
                    {rel.tag && (
                      <span className="absolute top-1 left-0.5 sm:top-1 sm:-left-0.5 bg-brand-500 text-white text-[7.5px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[3px] shadow uppercase tracking-wider z-10 pointer-events-none">
                        {rel.tag}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(rel);
                      }}
                      className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
                        isRelWishlisted
                          ? 'bg-white text-red-500 fill-red-500'
                          : 'bg-white/90 text-brand-700 hover:text-red-500 hover:bg-white'
                      }`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRelWishlisted ? 'fill-red-500' : ''}`} />
                    </button>

                    {/* Quick View & Add to Cart Buttons */}
                    <div className="absolute inset-x-2 sm:inset-x-2.5 bottom-2 sm:bottom-2.5 flex items-center gap-1.5 sm:gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickView(rel);
                        }}
                        className="flex-1 bg-white/95 backdrop-blur-sm hover:bg-white text-brand-700 py-1.5 px-2 sm:px-2.5 rounded-[4px] text-[9.5px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 shadow-md border border-cream-300 transition-all hover:shadow-lg active:scale-95 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-600" />
                        <span>Quick View</span>
                      </button>
                      <button
                        onClick={(e) => handleQuickAddRelated(rel, e)}
                        className="bg-brand-500 hover:bg-brand-600 active:scale-95 text-white p-1.5 sm:p-2 rounded-[4px] shadow-md transition-all flex items-center justify-center cursor-pointer"
                        title="Add to Bag"
                        aria-label="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4 lg:p-4 flex-1 flex flex-col justify-between space-y-2 lg:space-y-2.5">
                    <div>
                      {/* Stars */}
                      <div className="flex items-center gap-1 sm:gap-1.5 text-amber-500 text-xs mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                i < Math.floor(rel.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-amber-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-muted">
                          ({rel.reviewCount})
                        </span>
                      </div>

                      <Link
                        href={`/product/${rel.id}`}
                        className="font-heading text-sm sm:text-base md:text-lg font-bold text-brand-700 line-clamp-1 hover:text-brand-500 transition-colors block"
                      >
                        {rel.name}
                      </Link>

                      <p className="text-[11px] sm:text-xs text-muted mt-0.5 line-clamp-1">
                        {rel.fabric}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-cream-200 flex items-center justify-between gap-1">
                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-heading text-base sm:text-lg md:text-xl font-bold text-brand-700">
                          ₹{rel.price}
                        </span>
                        {rel.originalPrice && (
                          <span className="text-[10px] sm:text-xs text-muted line-through">
                            ₹{rel.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Color Swatches */}
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {rel.colors.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => handleRelatedColorSelect(rel.id, c.name, c.image || rel.image)}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                              currentSelectedColor === c.name
                                ? 'ring-2 ring-brand-500 scale-110'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                            aria-label={`Select ${c.name} color`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-brand-900/60 backdrop-blur-sm"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative bg-cream-100 rounded-2xl max-w-lg w-full p-6 border border-cream-300 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-cream-300">
              <h3 className="font-heading text-xl font-bold text-brand-800 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-brand-600" /> Size Guide
              </h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-muted hover:text-brand-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 text-xs space-y-3">
              <p className="text-muted">
                All measurements are in inches. For a relaxed comfortable fit, choose your exact chest size.
              </p>
              <div className="overflow-x-auto border border-cream-300 rounded-lg bg-white">
                <table className="w-full text-left">
                  <thead className="bg-cream-200 font-bold text-brand-800">
                    <tr>
                      <th className="p-2.5">Size</th>
                      <th className="p-2.5">Chest</th>
                      <th className="p-2.5">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">38"</td><td className="p-2.5">40"</td></tr>
                    <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">40"</td><td className="p-2.5">42"</td></tr>
                    <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">42"</td><td className="p-2.5">44"</td></tr>
                    <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">44"</td><td className="p-2.5">46"</td></tr>
                    <tr><td className="p-2.5 font-bold">XXL</td><td className="p-2.5">46"</td><td className="p-2.5">48"</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview */}
      {isFullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsFullscreenImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full aspect-[3/4]">
            <Image
              src={galleryImages[activeImageIndex]}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar (Appears smoothly when scrolling down) */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-cream-300 px-3.5 sm:px-4 py-2.5 shadow-[0_-6px_25px_rgba(0,0,0,0.12)] transition-all duration-300 transform ${
          showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
      
          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
           

            {/* Quantity Stepper */}
            <div className="inline-flex items-center border border-cream-300 rounded-[5px] bg-white h-10 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 h-full text-brand-700 hover:bg-cream-100 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-bold text-brand-800 select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 h-full text-brand-700 hover:bg-cream-100 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 bg-[#3E2B1E] hover:bg-brand-800 active:scale-[0.98] text-white h-10 px-3.5 sm:px-4 rounded-[5px] font-semibold text-xs tracking-wide shadow-md transition-all shrink-0 cursor-pointer flex-1
              "
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>


             {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-10 h-10 rounded-[5px] border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isWishlisted
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-white border-cream-300 text-brand-800 hover:bg-cream-100'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
      </div>

      <Footer />
    </main>
  );
}
