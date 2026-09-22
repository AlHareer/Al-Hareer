'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, ShoppingBag, Heart, ShieldCheck, ArrowRight, Minus, Plus } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductQuickViewModal() {
  const { quickViewProduct, closeQuickView, showToast } = useUI();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [previewImage, setPreviewImage] = useState<string>('');

  if (!quickViewProduct) return null;

  const activeColor = selectedColor || quickViewProduct.colors[0]?.name || 'Standard';
  const activeSize = selectedSize || quickViewProduct.sizes[0] || 'M';
  const currentImage = previewImage || quickViewProduct.image;
  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleColorChange = (colorName: string, imageSrc?: string) => {
    setSelectedColor(colorName);
    if (imageSrc) {
      setPreviewImage(imageSrc);
    }
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
      <div className="relative bg-[#FAF6F0] rounded-t-2xl sm:rounded-xl shadow-2xl max-w-xl md:max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto no-scrollbar border border-cream-300 z-10 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        
        {/* Floating Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-3 right-3 z-30 w-7 h-7 sm:w-8 sm:h-8 bg-black/50 hover:bg-black/75 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer shadow-md"
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
              <span className="absolute top-2.5 left-2.5 bg-[#3E2B1E] text-[#E0EFE6] text-[8.5px] sm:text-[9.5px] font-semibold px-2 py-0.5 rounded-[4px] shadow-sm uppercase tracking-wider pointer-events-none">
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
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(quickViewProduct.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-amber-300'
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
                <span className="ml-auto text-[9.5px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded">
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
                      onClick={() => handleColorChange(c.name, c.image)}
                      className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full border p-0.5 transition-all flex items-center justify-center cursor-pointer ${
                        activeColor === c.name
                          ? 'border-brand-700 scale-110 shadow-sm'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-full h-full rounded-full border border-black/10 shadow-inner"
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
                          ? 'bg-[#3E2B1E] text-white border-[#3E2B1E] shadow-sm'
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
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#3E2B1E] hover:bg-brand-800 active:scale-[0.98] text-white h-9 rounded-[5px] text-xs font-semibold tracking-wide shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`w-9 h-9 rounded-[5px] border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-cream-300 text-brand-800 hover:bg-cream-100'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Bottom Details Link & Micro Assurance */}
              <div className="flex items-center justify-between text-[10.5px] pt-1 border-t border-cream-200/80 text-muted">
                <Link
                  href={`/product/${quickViewProduct.id}`}
                  onClick={closeQuickView}
                  className="font-semibold text-brand-700 hover:text-brand-900 underline underline-offset-2 flex items-center gap-1"
                >
                  Full Details & Guide <ArrowRight className="w-3 h-3" />
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
