'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';
import type { ContentSettings } from '@/lib/siteSettings';
import { getColorStartPrice } from '@/lib/products';

export default function FeaturedCollection({ products, settings }: { products: Product[]; settings: ContentSettings }) {
  const [selectedColors, setSelectedColors] = useState<{ [productId: string]: { name: string; image: string } }>({});
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView, showToast } = useUI();

  const displayedProducts = products;

  const handleColorSelect = (productId: string, colorName: string, imageSrc: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: { name: colorName, image: imageSrc },
    }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const activeColor = selectedColors[product.id]?.name || product.colors[0]?.name;
    const activeSize = product.sizes[0] || 'M';
    addToCart(product, activeColor, activeSize, 1);
    showToast(`Added ${product.name} to Cart!`);
  };

  return (
    <section id="shop" className="py-10 sm:py-16 md:py-14 bg-cream-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-cream-300">
          <div className="text-center md:text-left">
            <span className="tag-pill">— SHOP Al Hareer</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-700">
              {settings.home_featured_heading || 'Featured Products'}
            </h2>
            <p className="text-sm sm:text-base text-muted mt-1 max-w-xl mx-auto md:mx-0">
              Traditional styles, made by hand.
            </p>
          </div>

        </div>

        {/* Product Grid: Exactly 8 products (2 cols mobile, 3 cols tablet, 4 cols desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-6 mt-8 sm:mt-10">
          {displayedProducts.map((product) => {
            const currentSelectedColor = selectedColors[product.id]?.name || product.colors[0]?.name;
            const currentImage = selectedColors[product.id]?.image || product.image;
            const cardPrice = getColorStartPrice(product, currentSelectedColor);
            const isWishlisted = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-[5px] overflow-hidden border border-cream-300 shadow-sm hover:shadow-luxury-hover transition-all duration-500"
              >
                {/* Product Image Container */}
                <div className="relative aspect-[4/4.8] lg:aspect-[4/4.1] bg-cream-200 overflow-hidden">
                  <Link href={currentSelectedColor ? `/product/${product.id}?color=${encodeURIComponent(currentSelectedColor)}` : `/product/${product.id}`} className="block w-full h-full">
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

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
                      isWishlisted
                        ? 'bg-white text-[#024F5F] fill-[#024F5F]'
                        : 'bg-white/90 text-brand-700 hover:text-[#024F5F] hover:bg-white'
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-[#024F5F]' : ''}`} />
                  </button>

                  {/* Always Active Quick View & Add to Cart Buttons */}
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
                      onClick={(e) => handleQuickAdd(product, e)}
                      className="bg-[#CFAC64] hover:bg-[#B08F4F] active:scale-95 text-white p-1.5 sm:p-2 rounded-[4px] shadow-md transition-all flex items-center justify-center cursor-pointer"
                      title="Add to Cart"
                      aria-label="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 lg:p-4 flex-1 flex flex-col justify-between space-y-2 lg:space-y-2.5">
                  <div>
                    {/* Stars */}
                    {product.reviewCount > 0 && (
                      <div className="flex items-center gap-1 sm:gap-1.5 text-[#B08F4F] text-xs mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-[#CFAC64] text-[#CFAC64]'
                                  : 'text-[#B08F4F]'
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
                      href={currentSelectedColor ? `/product/${product.id}?color=${encodeURIComponent(currentSelectedColor)}` : `/product/${product.id}`}
                      className="font-heading text-sm sm:text-base md:text-lg font-bold text-brand-700 line-clamp-1 hover:text-brand-500 transition-colors block"
                    >
                      {product.name}
                    </Link>

                    <p className="text-[11px] sm:text-xs text-muted mt-0.5 line-clamp-1">
                      {product.fabric}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-cream-200 flex items-center justify-between gap-1">
                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-heading text-base sm:text-lg md:text-xl font-bold text-brand-700">
                        ₹{cardPrice.price}
                      </span>
                      {cardPrice.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-muted line-through">
                          ₹{cardPrice.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Color Swatches */}
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

        {/* View All CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#CFAC64] hover:bg-[#B08F4F] text-white font-semibold text-sm sm:text-base tracking-wide transition-all duration-300 shadow-sm hover:shadow-luxury group cursor-pointer w-full max-w-[320px] justify-center mx-auto"
          >
            <span>Shop Now</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
