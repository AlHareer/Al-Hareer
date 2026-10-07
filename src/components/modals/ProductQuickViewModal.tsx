'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Minus, Plus } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getVariantImage } from '@/lib/products';

export default function ProductQuickViewModal() {
  const { quickViewProduct, closeQuickView, showToast } = useUI();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!quickViewProduct) return null;

  const activeColor = selectedColor || quickViewProduct.colors[0]?.name || 'Standard';
  const activeSize = selectedSize || quickViewProduct.sizes[0] || 'M';
  const currentImage = getVariantImage(quickViewProduct, activeSize, activeColor);
  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, activeColor, activeSize, quantity);
    closeQuickView();
    showToast(`Added ${quantity} × ${quickViewProduct.name} (${activeSize}) to Bag!`);
  };

  const discountPercent = quickViewProduct.originalPrice
    ? Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)
    : 20;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeQuickView}
      />

      {/* Modal Dialog (Compact & Mobile-Optimized Bottom Sheet / Popup) */}
      <div className="relative bg-[#F6F1EC] rounded-t-2xl sm:rounded-xl shadow-2xl max-w-xl md:max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto no-scrollbar border border-cream-300 z-10 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        
        {/* Floating Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-3 right-3 z-30 w-7 h-7 sm:w-8 sm:h-8 bg-[#00303A]/50 hover:bg-[#00303A]/75 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer shadow-md"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-0 sm:gap-4 items-stretch">
          
          {/* Left / Top: Product Image (Mobile: compact aspect / Desktop: col-span-5) */}
          <div className="sm:col-span-5 relative h-56 xs:h-64 sm:h-full min-h-[220px] sm:min-h-[340px] bg-cream-200 overflow-hidden">
            <Image
              src={currentImage}
              alt={quickViewProduct.name}
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              unoptimized
              className="object-cover object-top"
            />

            {/* Tag Badge */}
            {quickViewProduct.tag && (
              <span className="absolute top-2.5 left-2.5 bg-[#00303A] text-[#F6F1EC] text-[8.5px] sm:text-[9.5px] font-semibold px-2 py-0.5 rounded-[4px] shadow-sm uppercase tracking-wider pointer-events-none">
                {quickViewProduct.tag}
              </span>
            )}

            {/* Discount Badge */}
            <span className="absolute bottom-2.5 left-2.5 bg-brand-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-[4px] shadow pointer-events-none">
              {discountPercent}% OFF
            </span>
          </div>

          {/* Right / Bottom: Compact Details & Purchase Controls (Desktop: col-span-7) */}
          <div className="sm:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-3.5 sm:space-y-4">
            
            {/* Header: Collection & Title */}
            <div className="space-y-1">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-600">
                {quickViewProduct.category.toUpperCase()} COLLECTION
              </span>
              
              <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-800 leading-snug line-clamp-2">
                {quickViewProduct.name}
              </h3>

              {/* Rating & In-Stock Pill */}
              <div className="flex items-center gap-2 pt-0.5">
                {quickViewProduct.reviewCount > 0 && (
                  <>
                    <div className="flex text-[#B08F4F]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(quickViewProduct.rating)
                              ? 'fill-[#CFAC64] text-[#CFAC64]'
                              : 'text-[#B08F4F]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-brand-800">
                      {quickViewProduct.rating}
                    </span>
                    <span className="text-[10px] text-muted">
                      ({quickViewProduct.reviewCount})
                    </span>
                  </>
                )}
                <span className="ml-auto text-[9.5px] font-bold text-[#024F5F] bg-[#F6F1EC]/90 px-1.5 py-0.5 rounded">
                  In Stock
                </span>
              </div>
            </div>

            {/* Compact Price Block */}
            <div className="flex items-baseline gap-2 py-1 border-y border-cream-200/80">
              <span className="font-heading text-xl sm:text-2xl font-bold text-brand-800">
                ₹{quickViewProduct.price}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-xs text-muted line-through">
                  ₹{quickViewProduct.originalPrice}
                </span>
              )}
              <span className="text-[10.5px] text-muted ml-auto truncate max-w-[130px]">
                {quickViewProduct.fabric}
              </span>
            </div>

            {/* Color & Size Selectors (Compact Grid) */}
            <div className="space-y-2.5">
              {/* Color Select */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-brand-800">
                  Color: <span className="font-normal text-muted">{activeColor}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleColorChange(c.name)}
                      className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full border p-0.5 transition-all flex items-center justify-center cursor-pointer ${
                        activeColor === c.name
                          ? 'border-brand-700 scale-110 shadow-sm'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-full h-full rounded-full border border-[#00303A]/10 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Select */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-brand-800">
                  Size: <span className="font-normal text-muted">{activeSize}</span>
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {quickViewProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[30px] h-7 px-1.5 text-[11px] font-bold rounded-[4px] border transition-all cursor-pointer ${
                        activeSize === s
                          ? 'bg-[#00303A] text-white border-[#00303A] shadow-sm'
                          : 'bg-white text-brand-700 border-cream-300 hover:border-brand-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Unified Action Bar: Quantity + Add to Bag + Wishlist */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2">
                {/* Compact Quantity */}
                <div className="inline-flex items-center border border-cream-300 rounded-[5px] bg-white h-9 shrink-0">
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

                {/* Primary Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#CFAC64] hover:bg-[#B08F4F] active:scale-[0.98] text-white h-9 rounded-[5px] text-xs font-semibold tracking-wide shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`w-9 h-9 rounded-[5px] border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#F6F1EC] border-[#CFAC64] text-[#024F5F]'
                      : 'bg-white border-cream-300 text-brand-800 hover:bg-cream-100'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#024F5F] text-[#024F5F]' : ''}`} />
                </button>
              </div>

              {/* Bottom Details Link & Micro Assurance */}
              <div className="flex items-center justify-between text-[10.5px] pt-1 border-t border-cream-200/80 text-muted">
                <Link
                  href={`/product/${quickViewProduct.id}`}
                  onClick={closeQuickView}
                  className="font-semibold text-brand-700 hover:text-brand-900 underline underline-offset-2 flex items-center gap-1"
                >
                  Full Details & Guide
                </Link>
                <div className="flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-3 h-3 text-brand-600" />
                  <span>100% Authentic</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
