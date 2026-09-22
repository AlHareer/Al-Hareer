'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, subtotal } = useCart();
  const { showToast } = useUI();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2999;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-100 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-cream-300 flex items-center justify-between bg-cream-200/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-500" />
              <h3 className="font-heading text-xl font-bold text-brand-700">Your Shopping Bag</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-muted hover:text-brand-700 rounded-full hover:bg-cream-300/50 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3 bg-cream-200 border-b border-cream-300">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> You unlocked Free Express Shipping!
              </p>
            ) : (
              <p className="text-xs text-muted">
                Add <span className="font-bold text-brand-700">₹{freeShippingThreshold - subtotal}</span> more for <span className="font-semibold text-brand-500">Free Express Shipping</span>
              </p>
            )}
            <div className="w-full bg-cream-300 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-cream-200 flex items-center justify-center text-muted">
                  <ShoppingBag className="w-8 h-8 text-brand-400" />
                </div>
                <h4 className="font-heading text-xl font-semibold text-brand-700">Your Bag is Empty</h4>
                <p className="text-sm text-muted max-w-xs mx-auto">
                  Looks like you haven&apos;t added any traditional ensembles yet.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary mt-2"
                >
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-4 p-3 bg-cream-50 rounded-lg border border-cream-300 shadow-sm relative group"
                >
                  <div className="relative w-20 h-24 rounded overflow-hidden flex-shrink-0 bg-cream-200">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading font-semibold text-base text-brand-700 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted mt-1">
                        <span>Size: <strong className="text-brand-700">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-brand-700">{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-cream-300 rounded bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-1 text-muted hover:text-brand-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-brand-700 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1 text-muted hover:text-brand-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-brand-700">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                    }
                    className="absolute top-2 right-2 text-muted-light hover:text-red-600 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-cream-300 bg-cream-50 space-y-4">
              {/* Price summary */}
              <div className="space-y-2 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-700">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-medium">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '₹149'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-brand-700 pt-2.5 border-t border-cream-300">
                  <span>Total Amount</span>
                  <span>₹{(subtotal + (subtotal >= freeShippingThreshold ? 0 : 149)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full btn-primary py-3.5 text-sm tracking-wider uppercase font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                {isCheckingOut ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Order...
                  </span>
                ) : (
                  <>
                    Proceed To Checkout <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
