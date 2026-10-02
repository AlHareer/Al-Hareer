'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Heart,
  Trash2,
  ShoppingBag,
  Eye,
  Star,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Truck,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { Product } from '@/types';
import { useShippingSettings } from '@/hooks/useShippingSettings';

export default function WishlistPageClient({ recommendedProducts }: { recommendedProducts: Product[] }) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { openQuickView, showToast } = useUI();
  const shipping = useShippingSettings();

  // Color selection state per product card
  const [selectedColors, setSelectedColors] = useState<{
    [productId: string]: { name: string; image: string };
  }>({});

  const handleColorSelect = (productId: string, colorName: string, colorImage: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: { name: colorName, image: colorImage },
    }));
  };

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    showToast(`✨ Moved "${product.name}" to your Shopping Bag!`, 'success');
  };

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      addToCart(item);
    });
    const count = wishlist.length;
    clearWishlist();
    showToast(`✨ Moved all ${count} items to your Shopping Bag!`, 'success');
  };

  const handleClearWishlist = () => {
    if (wishlist.length === 0) return;
    clearWishlist();
    showToast('Wishlist cleared', 'info');
  };

  // Curated recommendations if wishlist is empty or for extra inspiration

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
              alt="Al Hareer Saved Wishlist"
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
            <span className="font-semibold text-[#2B231D]">Saved Wishlist</span>
          </nav>

          {/* Centered Banner Header on Desktop */}
          <div className="relative flex items-center justify-between lg:justify-center gap-4">
            <div className="max-w-[300px] sm:max-w-md md:max-w-lg lg:max-w-xl lg:mx-auto lg:text-center flex flex-col items-start lg:items-center">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-1.5 justify-start lg:justify-center">
                <span className="w-5 sm:w-7 lg:w-8 h-[1.5px] bg-[#4A3525]"></span>
                <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#4A3525] uppercase">
                  SAVED ATELIER EDITS
                </span>
                <span className="hidden lg:inline-block w-8 h-[1.5px] bg-[#4A3525]"></span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-black text-[#1F1813] tracking-tight leading-[1.08] mb-1">
                My Saved Wishlist
              </h1>

              <p className="font-body text-[#7A6F66] text-xs sm:text-sm font-normal leading-snug">
                {wishlist.length > 0
                  ? `You have ${wishlist.length} bespoke handcrafted ${
                      wishlist.length === 1 ? 'silhouette' : 'silhouettes'
                    } saved for review.`
                  : 'Curate and save your favorite royal kurtas, nehru jackets, and accessories.'}
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

      {/* 2. MAIN WISHLIST CONTENT */}
      <section className="py-4 sm:py-6 flex-1">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          {wishlist.length === 0 ? (
            /* EMPTY WISHLIST STATE */
            <div className="max-w-xl mx-auto py-4 sm:py-6 text-center space-y-2">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-white border border-[#E5DACD] shadow-sm flex items-center justify-center text-[#4A3525]">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.5] text-[#8B6B52]" />
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#4A3525] text-white flex items-center justify-center text-xs">
                  0
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B231D]">
                  Your Wishlist is Empty
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6F66] leading-relaxed max-w-md mx-auto">
                  Explore our handcrafted royal kurta pajama sets, Nehru jackets, and celebratory wedding edits to save your favorite silhouettes.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-lg transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
                >
                  <span>Explore Collection</span>
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F5EFE6] text-[#2B231D] text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-lg border border-[#DACDC0] transition-colors"
                >
                  <span>Back to Home</span>
                </Link>
              </div>

              {/* Perks Row */}
              <div className="pt-8 border-t border-[#E8DFD5] grid grid-cols-3 gap-3 text-center text-xs text-[#7A6F66]">
                <div className="flex flex-col items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#4A3525]" />
                  <span className="text-[11px] font-medium">Free Shipping &gt; ₹{shipping.free_threshold.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-[#4A3525]" />
                  <span className="text-[11px] font-medium">7-Day Easy Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4A3525]" />
                  <span className="text-[11px] font-medium">100% Artisanal Craft</span>
                </div>
              </div>
            </div>
          ) : (
            /* POPULATED WISHLIST STATE */
            <div>
              {/* Action Toolbar Header */}
              <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E8DFD5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A3525]" />
                  <p className="font-heading text-lg sm:text-xl font-bold text-[#2B231D]">
                    {wishlist.length} {wishlist.length === 1 ? 'Product' : 'Products'} Saved
                  </p>
                  <span className="text-[10px] bg-[#FAF6F1] text-[#7A6F66] px-2 py-0.5 rounded border border-[#E5DACD] font-semibold">
                    In Stock
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleMoveAllToCart}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move All to Bag</span>
                  </button>

                  <button
                    onClick={handleClearWishlist}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#FAF6F1] hover:bg-[#F3ECE1] text-[#8B2D2D] hover:text-red-700 text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-[#E5DACD] transition-colors cursor-pointer"
                    title="Clear all items from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>
                </div>
              </div>

              {/* Product Grid: Matches exact shop & featured collection card styling */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-6">
                {wishlist.map((product) => {
                  const currentSelectedColor = selectedColors[product.id]?.name || product.colors?.[0]?.name;
                  const currentImage = selectedColors[product.id]?.image || product.image;

                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col bg-white rounded-[5px] overflow-hidden border border-cream-300 shadow-sm hover:shadow-luxury-hover transition-all duration-500 relative"
                    >
                      {/* Product Image Container */}
                      <div className="relative aspect-[4/4.8] lg:aspect-[4/4.1] bg-cream-200 overflow-hidden">
                        <Link href={`/product/${product.id}`} className="block w-full h-full">
                          <Image
                            src={currentImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                          />
                        </Link>

                        {/* Tag badge */}
                        {product.tag && (
                          <span className="absolute top-1 left-0.5 sm:top-1 sm:-left-0.5 bg-brand-500 text-white text-[7.5px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[3px] shadow uppercase tracking-wider z-10 pointer-events-none">
                            {product.tag}
                          </span>
                        )}

                        {/* REPLACED: Delete / Trash Icon replacing regular Heart icon on wishlist page */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(product.id);
                            showToast(`Removed "${product.name}" from your wishlist`, 'info');
                          }}
                          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 text-[#8B2D2D] hover:bg-[#8B2D2D] hover:text-white flex items-center justify-center transition-all shadow-md z-10 cursor-pointer group/del"
                          title="Remove from Wishlist"
                          aria-label="Remove from Wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/del:scale-110 transition-transform" />
                        </button>

                        {/* Quick View & Quick Add to Cart Overlay */}
                        <div className="absolute inset-x-2 sm:inset-x-2.5 bottom-2 sm:bottom-2.5 flex items-center gap-1.5 sm:gap-2 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openQuickView(product);
                            }}
                            className="flex-1 bg-white/95 backdrop-blur-sm hover:bg-white text-brand-700 py-1.5 px-2 sm:px-2.5 rounded-[4px] text-[9.5px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 shadow-md border border-cream-300 transition-all hover:shadow-lg active:scale-95 cursor-pointer"
                          >
                            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-600" />
                            <span>Quick View</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveToCart(product);
                            }}
                            className="bg-brand-500 hover:bg-brand-600 active:scale-95 text-white p-1.5 sm:p-2 rounded-[4px] shadow-md transition-all flex items-center justify-center cursor-pointer"
                            title="Move to Cart"
                            aria-label="Move to Cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3 sm:p-4 lg:p-4 flex-1 flex flex-col justify-between space-y-2 lg:space-y-2.5">
                        <div>
                          {/* Rating Stars */}
                          {product.reviewCount > 0 && (
                            <div className="flex items-center gap-1 sm:gap-1.5 text-amber-500 text-xs mb-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                      i < Math.floor(product.rating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-amber-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-semibold text-muted">
                                ({product.reviewCount})
                              </span>
                            </div>
                          )}

                          <Link
                            href={`/product/${product.id}`}
                            className="font-heading text-sm sm:text-base md:text-lg font-bold text-brand-700 line-clamp-1 hover:text-brand-500 transition-colors block"
                          >
                            {product.name}
                          </Link>

                          <p className="text-[11px] sm:text-xs text-muted mt-0.5 line-clamp-1">
                            {product.fabric || 'Pure Artisanal Fabric'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-cream-200">
                          <div className="flex items-center justify-between gap-1 mb-2">
                            {/* Price */}
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-heading text-base sm:text-lg md:text-xl font-bold text-brand-700">
                                ₹{product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[10px] sm:text-xs text-muted line-through">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                            </div>

                            {/* Color Swatches */}
                            {product.colors && product.colors.length > 0 && (
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                {product.colors.map((c) => (
                                  <button
                                    key={c.name}
                                    onClick={() => handleColorSelect(product.id, c.name, c.image || product.image)}
                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                                      currentSelectedColor === c.name
                                        ? 'ring-2 ring-brand-500 scale-110'
                                        : 'hover:scale-110'
                                    }`}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Move to Bag Primary Action Button */}
                          <button
                            onClick={() => handleMoveToCart(product)}
                            className="w-full bg-[#4A3525] hover:bg-[#36261A] text-white py-2 px-3 rounded-[4px] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Move to Bag</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Products Carousel/Grid if user wants to discover more */}
          <div className="mt-16 pt-12 border-t border-[#E8DFD5]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6B52]">
                  — YOU MAY ALSO ADMIRE
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B231D]">
                  Trending Heritage Silhouettes
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs font-semibold text-[#4A3525] hover:text-[#2B231D] inline-flex items-center gap-1"
              >
                <span>View All 48</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {recommendedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group bg-white rounded-[5px] overflow-hidden border border-[#E8DFD5] shadow-2xs hover:shadow-sm transition-all p-2.5"
                >
                  <div className="relative aspect-[4/4.5] rounded overflow-hidden mb-2 bg-[#EFE8E0]">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="font-heading text-xs sm:text-sm font-bold text-[#2B231D] truncate group-hover:text-[#4A3525]">
                    {p.name}
                  </p>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-bold text-[#4A3525]">₹{p.price}</span>
                    <span className="text-[10px] text-[#7A6F66]">{p.fabric?.split(' ')[0]}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
