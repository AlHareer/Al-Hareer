'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Package,
  Truck,
  CreditCard,
  Minus,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Zap,
  ChevronDown,
  ChevronUp,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { PRODUCTS } from '@/data/products';
import { CartItem } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { showToast } = useUI();

  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  // Shipping Method State ('standard' | 'express')
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment Method State ('upi' | 'card' | 'netbanking' | 'cod')
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');

  // Coupon State
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Order Submission State
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  const handleUpdateQty = (productId: string, color: string, size: string, newQty: number) => {
    updateQuantity(productId, color, size, newQty);
  };

  const handleRemoveItem = (productId: string, color: string, size: string) => {
    removeFromCart(productId, color, size);
    showToast('Item removed from order summary', 'info');
  };

  // Calculations directly from cart state
  const currentSubtotal = subtotal;
  const currentTotalItems = totalItems;

  const shippingCost = shippingMethod === 'express' ? 100 : 0;
  const codFee = paymentMethod === 'cod' ? (currentSubtotal >= 999 ? 0 : 49) : 0;
  const finalTotal = Math.max(0, currentSubtotal - discountAmount + shippingCost + codFee);

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'TRADITION10' || code === 'ALHAREER10') {
      const disc = Math.round(currentSubtotal * 0.1);
      setDiscountAmount(disc);
      setCouponApplied(true);
      showToast('🎉 10% Luxury Heritage Discount Applied!', 'success');
    } else if (code === 'ROYAL500' && currentSubtotal >= 2999) {
      setDiscountAmount(500);
      setCouponApplied(true);
      showToast('🎉 ₹500 Privilege Voucher Applied!', 'success');
    } else {
      showToast('Invalid coupon code. Try TRADITION10', 'error');
    }
  };

  // Form Submit / Place Order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      showToast('Please fill in your Contact Details (Name, Phone & Email)', 'error');
      return;
    }
    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pinCode.trim()) {
      showToast('Please complete your full delivery address and PIN code', 'error');
      return;
    }
    if (cart.length === 0) {
      showToast('Your shopping bag is empty. Please add items to proceed.', 'error');
      return;
    }

    setIsPlacingOrder(true);

    setTimeout(() => {
      setIsPlacingOrder(false);
      const generatedId = `BNF-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderId(generatedId);
      setOrderConfirmed(true);

      // Save real-time order and address to localStorage for Account Dashboard
      if (typeof window !== 'undefined') {
        const primaryItem = cart[0];
        const newOrder = {
          id: generatedId,
          productName: primaryItem ? primaryItem.product.name : 'Luxury Ethnic Ensemble',
          productImage: primaryItem ? (primaryItem.product.colors?.find(c => c.name === primaryItem.selectedColor)?.image || primaryItem.product.image) : '/images/your-image-19.jpg',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Processing',
          total: finalTotal,
          itemsCount: totalItems,
          items: cart.map(item => ({
            name: item.product.name,
            size: item.selectedSize,
            color: item.selectedColor,
            qty: item.quantity,
            price: item.product.price,
            image: item.product.colors?.find(c => c.name === item.selectedColor)?.image || item.product.image,
          })),
          shippingAddress: { ...formData },
          paymentMethod: paymentMethod,
        };

        try {
          const existingOrders = JSON.parse(localStorage.getItem('alhareer_orders') || '[]');
          localStorage.setItem('alhareer_orders', JSON.stringify([newOrder, ...existingOrders]));
          window.dispatchEvent(new Event('alhareer_orders_updated'));

          const existingAddresses = JSON.parse(localStorage.getItem('alhareer_saved_addresses') || '[]');
          const newAddress = {
            id: `addr-${Date.now()}`,
            name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
            isDefault: existingAddresses.length === 0,
            type: 'Home',
          };
          if (!existingAddresses.some((a: any) => a.address.toLowerCase() === formData.address.toLowerCase())) {
            localStorage.setItem('alhareer_saved_addresses', JSON.stringify([newAddress, ...existingAddresses]));
          }
        } catch (e) {
          console.error('Error saving real-time order', e);
        }
      }

      if (cart.length > 0) {
        clearCart();
      }
      showToast('🎉 Order Placed Successfully! Your royal package is being prepared.', 'success');
    }, 1400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2B231D] selection:bg-[#4A3525] selection:text-white">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 md:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* TOP HEADER & STEP INDICATOR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-[#E8DFD5] mb-8 sm:mb-10">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#2B231D] tracking-tight">
                Checkout
              </h1>
              <p className="font-body text-xs sm:text-sm text-[#7A6F66] mt-1">
                Complete your order in a few simple steps.
              </p>
            </div>

            {/* 3-Step Progress Indicator Matching Mockup */}
            <div className="flex items-center gap-2 sm:gap-4 select-none">
              {/* Step 1: Information */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2B231D] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  1
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#2B231D] mt-1.5 whitespace-nowrap">
                  Information
                </span>
              </div>

              {/* Connecting Line 1 */}
              <div className="w-10 sm:w-16 h-[2px] bg-[#2B231D] -mt-5" />

              {/* Step 2: Payment */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E5DACD] text-[#7A6F66] flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#7A6F66] mt-1.5 whitespace-nowrap">
                  Payment
                </span>
              </div>

              {/* Connecting Line 2 */}
              <div className="w-10 sm:w-16 h-[2px] bg-[#E5DACD] -mt-5" />

              {/* Step 3: Confirmation */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E5DACD] text-[#7A6F66] flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#7A6F66] mt-1.5 whitespace-nowrap">
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          {/* MAIN CHECKOUT FORM & SUMMARY GRID */}
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            
            {/* LEFT COLUMN: Shipping Address, Shipping Method, Payment Method (7 cols on lg, 8 on xl) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8">
              
              {/* 1. SHIPPING ADDRESS CARD */}
              <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#E8DFD5] shadow-xs space-y-5">
                <div className="flex items-start justify-between pb-4 border-b border-[#F0EAE1]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525]">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg sm:text-xl font-bold text-[#2B231D]">
                        1. Shipping Address
                      </h2>
                      <p className="text-xs text-[#7A6F66]">
                        Enter your delivery address
                      </p>
                    </div>
                  </div>

                  <div className="text-[12px] text-[#7A6F66] hidden sm:block">
                    <span>Already have an account? </span>
                    <Link
                      href="/account?mode=signin"
                      className="font-semibold text-[#4A3525] underline hover:text-[#2B231D]"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>

                {/* 3 Columns: Full Name, Phone Number, Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                      Full Name <span className="text-[#8B2D2D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                      Phone Number <span className="text-[#8B2D2D]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                      Email Address <span className="text-[#8B2D2D]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* SINGLE FULL-WIDTH ADDRESS (As requested: "Address 1 hi rakho full width") */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                    Address <span className="text-[#8B2D2D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House no., Building, Street, Area, Landmark"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                  />
                </div>

                {/* 3 Columns: City, State (TEXT INPUT as requested: "state jo hai select option mat do ok"), PIN Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                      City <span className="text-[#8B2D2D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter city"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                      State <span className="text-[#8B2D2D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Enter state"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                      PIN Code <span className="text-[#8B2D2D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })}
                      placeholder="6 digit PIN code"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 2. SHIPPING METHOD CARD */}
              <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#E8DFD5] shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#F0EAE1]">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#2B231D]">
                      2. Shipping Method
                    </h2>
                    <p className="text-xs text-[#7A6F66]">
                      Choose how you want to receive your order
                    </p>
                  </div>
                </div>

                {/* Two Selectable Cards Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Standard Delivery */}
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      shippingMethod === 'standard'
                        ? 'border-[#4A3525] bg-[#FAF6F1] shadow-2xs'
                        : 'border-[#E8DFD5] bg-white hover:bg-[#FAF6F1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          shippingMethod === 'standard'
                            ? 'border-[#4A3525] bg-[#4A3525]'
                            : 'border-[#A89C8F]'
                        }`}
                      >
                        {shippingMethod === 'standard' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-[#4A3525]" />
                        <div>
                          <p className="text-xs font-bold text-[#2B231D]">Standard Delivery</p>
                          <p className="text-[11px] text-[#7A6F66]">3 – 5 business days</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1E7E34] bg-[#25D366]/15 px-2 py-0.5 rounded">
                      Free
                    </span>
                  </label>

                  {/* Express Delivery */}
                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      shippingMethod === 'express'
                        ? 'border-[#4A3525] bg-[#FAF6F1] shadow-2xs'
                        : 'border-[#E8DFD5] bg-white hover:bg-[#FAF6F1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          shippingMethod === 'express'
                            ? 'border-[#4A3525] bg-[#4A3525]'
                            : 'border-[#A89C8F]'
                        }`}
                      >
                        {shippingMethod === 'express' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-[#D4AF37]" />
                        <div>
                          <p className="text-xs font-bold text-[#2B231D]">Express Delivery</p>
                          <p className="text-[11px] text-[#7A6F66]">1 – 2 business days</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#4A3525]">
                      ₹100
                    </span>
                  </label>
                </div>
              </div>

              {/* 3. PAYMENT METHOD CARD */}
              <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#E8DFD5] shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#F0EAE1]">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#2B231D]">
                      3. Payment Method
                    </h2>
                    <p className="text-xs text-[#7A6F66]">
                      Choose your preferred payment method
                    </p>
                  </div>
                </div>

                {/* Payment Options List */}
                <div className="space-y-2.5">
                  {/* UPI */}
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      paymentMethod === 'upi'
                        ? 'border-[#4A3525] bg-[#FAF6F1] shadow-2xs'
                        : 'border-[#E8DFD5] bg-white hover:bg-[#FAF6F1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'upi'
                            ? 'border-[#4A3525] bg-[#4A3525]'
                            : 'border-[#A89C8F]'
                        }`}
                      >
                        {paymentMethod === 'upi' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#2B231D]">
                        UPI (Google Pay, PhonePe, Paytm, QR)
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#2A7E4B] bg-[#25D366]/15 px-2 py-0.5 rounded tracking-wider">
                      UPI ❯
                    </span>
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      paymentMethod === 'card'
                        ? 'border-[#4A3525] bg-[#FAF6F1] shadow-2xs'
                        : 'border-[#E8DFD5] bg-white hover:bg-[#FAF6F1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'card'
                            ? 'border-[#4A3525] bg-[#4A3525]'
                            : 'border-[#A89C8F]'
                        }`}
                      >
                        {paymentMethod === 'card' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#2B231D]">
                        Credit / Debit Card
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7A6F66]">
                      <span className="bg-[#FAF6F1] px-1.5 py-0.5 rounded border border-[#DACDC0]">VISA</span>
                      <span className="bg-[#FAF6F1] px-1.5 py-0.5 rounded border border-[#DACDC0]">Mastercard</span>
                      <span className="bg-[#FAF6F1] px-1.5 py-0.5 rounded border border-[#DACDC0]">RuPay</span>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#4A3525] bg-[#FAF6F1] shadow-2xs'
                        : 'border-[#E8DFD5] bg-white hover:bg-[#FAF6F1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'netbanking'
                            ? 'border-[#4A3525] bg-[#4A3525]'
                            : 'border-[#A89C8F]'
                        }`}
                      >
                        {paymentMethod === 'netbanking' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#2B231D]">
                        Net Banking (All Indian Banks)
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8B6B52]">All 50+ Banks</span>
                  </label>

                  {/* Cash on Delivery (COD) */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      paymentMethod === 'cod'
                        ? 'border-[#4A3525] bg-[#FAF6F1] shadow-2xs'
                        : 'border-[#E8DFD5] bg-white hover:bg-[#FAF6F1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'cod'
                            ? 'border-[#4A3525] bg-[#4A3525]'
                            : 'border-[#A89C8F]'
                        }`}
                      >
                        {paymentMethod === 'cod' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-[#2B231D]">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#7A6F66]">
                      {currentSubtotal >= 999 ? 'Free COD' : '₹49 handling fee'}
                    </span>
                  </label>
                </div>

                {/* Primary CTA Place Order Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isPlacingOrder || cart.length === 0}
                    className="w-full bg-[#4A3525] hover:bg-[#36261A] text-white py-3.5 sm:py-4 px-6 rounded-xl font-heading text-base sm:text-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between cursor-pointer disabled:opacity-50"
                  >
                    {isPlacingOrder ? (
                      <span className="flex items-center gap-2 mx-auto text-sm font-sans font-medium">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing Your Order...
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-2">
                          <span>Place Order</span>
                          <ArrowRight className="w-4 h-4" />
                        </span>
                        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#7A6F66] flex items-center justify-center gap-1.5 mt-2.5">
                    <Lock className="w-3.5 h-3.5 text-[#4A3525]" />
                    <span>Secure and encrypted checkout</span>
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Order Summary & Trust Badges (5 cols on lg, 5 on xl) */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              {/* ORDER SUMMARY CARD */}
              <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#E8DFD5] shadow-xs space-y-5">
                
                {/* Header with Icon before Order Summary */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EAE1]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525] shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#2B231D]">
                        Order Summary
                      </h3>
                      <p className="text-xs text-[#7A6F66]">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Items List With Working QTY Increase/Decrease */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 no-scrollbar divide-y divide-[#F5EFE6]">
                  {cart.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#7A6F66] space-y-2">
                      <ShoppingBag className="w-8 h-8 text-[#A89C8F] mx-auto stroke-1" />
                      <p className="font-medium text-[#2B231D]">Your shopping bag is empty.</p>
                      <p className="text-[11px] text-[#7A6F66]">Add products from the store to proceed with checkout.</p>
                      <Link
                        href="/shop"
                        className="inline-block mt-2 px-4 py-2 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        Explore Shop Collection
                      </Link>
                    </div>
                  ) : (
                    cart.map((item, index) => {
                      const itemTotal = item.product.price * item.quantity;
                      const imageSrc =
                        item.product.colors?.find((c) => c.name === item.selectedColor)?.image ||
                        item.product.image;

                      return (
                        <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`} className="pt-3.5 first:pt-0 flex gap-3.5 items-start">
                          {/* Thumbnail */}
                          <div className="relative w-16 h-20 sm:w-18 sm:h-22 rounded-lg overflow-hidden bg-[#FAF6F1] border border-[#E5DACD] shrink-0">
                            <Image
                              src={imageSrc}
                              alt={item.product.name}
                              fill
                              className="object-cover object-top"
                              sizes="80px"
                            />
                          </div>

                          {/* Product Details & QTY Increase/Decrease Button */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-heading text-sm sm:text-[15px] font-bold text-[#2B231D] truncate">
                                {item.product.name}
                              </h4>
                              <span className="font-heading text-sm font-bold text-[#2B231D] shrink-0">
                                ₹{itemTotal.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#7A6F66] mt-0.5">
                              Size: <strong className="text-[#2B231D]">{item.selectedSize}</strong> | Color: <strong className="text-[#2B231D]">{item.selectedColor}</strong>
                            </p>

                            {/* USER REQUESTED FEATURE: Product QTY increase / decrease controls in Order Summary */}
                            <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center border border-[#DACDC0] rounded-md bg-[#FAF6F1] shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQty(
                                      item.product.id,
                                      item.selectedColor,
                                      item.selectedSize,
                                      item.quantity - 1
                                    )
                                  }
                                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#EDE4D6] transition-colors cursor-pointer rounded-l-md"
                                  aria-label="Decrease quantity"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 sm:w-7 text-center text-xs font-bold text-[#2B231D]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQty(
                                      item.product.id,
                                      item.selectedColor,
                                      item.selectedSize,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#EDE4D6] transition-colors cursor-pointer rounded-r-md"
                                  aria-label="Increase quantity"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                                className="text-[11px] text-[#8B2D2D] hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Subtotal & Shipping Calculation - Seamless & Modern */}
                <div className="py-3.5 border-t border-b border-[#4A3525] space-y-2.5 text-xs sm:text-[13px]">
                  <div className="flex items-center justify-between text-[#7A6F66]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2B231D]">
                      ₹{currentSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-[#1E7E34]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span>Coupon Discount</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#1E7E34]/10 text-[#1E7E34] px-1.5 py-0.5 rounded">
                          Applied
                        </span>
                      </span>
                      <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#7A6F66]">
                    <span>Shipping</span>
                    {shippingMethod === 'express' ? (
                      <span className="font-semibold text-[#2B231D]">₹100</span>
                    ) : (
                      <span className="font-bold text-[#1E7E34] bg-[#1E7E34]/10 px-2 py-0.5 rounded text-[11px]">
                        FREE
                      </span>
                    )}
                  </div>

                  {codFee > 0 && (
                    <div className="flex items-center justify-between text-[#7A6F66]">
                      <span>COD Handling</span>
                      <span className="font-semibold text-[#2B231D]">₹{codFee}</span>
                    </div>
                  )}
                </div>

                {/* Distinct Modern Total Card - Matches theme with standout presence */}
                <div className="p-1 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="block font-heading text-base sm:text-[24px] font-bold text-[#2B231D] leading-tight">
                      Total
                    </span>
                    <span className="block text-[10.5px] sm:text-[11px] text-[#8C7E72] mt-0.5">
                      Inclusive of all taxes
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg sm:text-2xl font-bold text-[#4A3525] tracking-tight">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                    {discountAmount > 0 && (
                      <span className="block text-[10.5px] font-semibold text-[#1E7E34] mt-0.5">
                        Saved ₹{discountAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Coupon Code Accordion Box */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setCouponOpen(!couponOpen)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#4A3525] hover:text-[#2B231D] py-1 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Have a coupon code?</span>
                    </span>
                    {couponOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {couponOpen && (
                    <div className="mt-2.5 pt-2 flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. TRADITION10"
                        className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] uppercase outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus:border-[#4A3525]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* 4 TRUST & SERVICE BADGES (Matching screenshot bottom row) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
                <div className="flex flex-col items-center gap-1 p-4 bg-white rounded-lg border border-[#E8DFD5] shadow-2xs">
                  <Truck className="w-6 h-6 text-[#4A3525]" />
                  <span className="font-bold text-[11px] text-[#2B231D]">Free Shipping</span>
                  <span className="text-[9.5px] text-[#7A6F66]">On orders above ₹999</span>
                </div>

                <div className="flex flex-col items-center gap-1 p-4 bg-white rounded-lg border border-[#E8DFD5] shadow-2xs">
                  <ShieldCheck className="w-6 h-6  text-[#4A3525]" />
                  <span className="font-bold text-[11px] text-[#2B231D]">Secure Payment</span>
                  <span className="text-[9.5px] text-[#7A6F66]">100% safe &amp; secure</span>
                </div>

                <div className="flex flex-col items-center gap-1 p-4 bg-white rounded-lg border border-[#E8DFD5] shadow-2xs">
                  <RotateCcw className="w-6 h-6 text-[#4A3525]" />
                  <span className="font-bold text-[11px] text-[#2B231D]">Easy Returns</span>
                  <span className="text-[9.5px] text-[#7A6F66]">7 days return policy</span>
                </div>

                <div className="flex flex-col items-center gap-1 p-4 bg-white rounded-lg border border-[#E8DFD5] shadow-2xs">
                  <Headphones className="w-6 h-6 text-[#4A3525]" />
                  <span className="font-bold text-[11px] text-[#2B231D]">Need Help?</span>
                  <span className="text-[9.5px] text-[#7A6F66]">support@alhareer.com</span>
                </div>
              </div>

            </div>

          </form>

        </div>
      </main>

      {/* ORDER CONFIRMATION MODAL OVERLAY */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 border border-[#E5DACD] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#EAF5EC] text-[#1E7E34] flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8B6B52]">
                ORDER CONFIRMED
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B231D]">
                Thank You For Your Order!
              </h3>
              <p className="text-xs text-[#7A6F66] mt-1">
                Your royal parcel is being handcrafted and pressed with care at our Jabalpur atelier.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#7A6F66]">Order ID:</span>
                <span className="font-bold text-[#4A3525] font-mono">{confirmedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6F66]">Delivery To:</span>
                <span className="font-semibold text-[#2B231D] truncate max-w-[200px]">
                  {formData.fullName || 'Guest Client'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6F66]">Payment Method:</span>
                <span className="font-semibold text-[#2B231D] uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-[#E8DFD5] pt-1.5">
                <span className="text-[#7A6F66]">Total Paid:</span>
                <span className="font-bold text-sm text-[#1E7E34]">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/shop"
                onClick={() => setOrderConfirmed(false)}
                className="w-full bg-[#4A3525] hover:bg-[#36261A] text-white py-3 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                type="button"
                onClick={() => setOrderConfirmed(false)}
                className="w-full text-xs text-[#7A6F66] hover:text-[#2B231D] py-1"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
