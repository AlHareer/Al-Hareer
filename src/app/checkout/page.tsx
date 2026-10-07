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
  ShieldCheck,
  RotateCcw,
  Headphones,
  ChevronDown,
  ChevronUp,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { useAuth } from '@/context/AuthContext';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import Script from 'next/script';
import { placeOrder, verifyRazorpayPayment, cancelPendingOrder, validateCoupon, getPaymentSettings } from '@/actions/checkout';
import { getFooterSettings } from '@/lib/siteSettings';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { useQuantityDiscountSettings, computeQuantityDiscount } from '@/hooks/useQuantityDiscount';
import { CartItem } from '@/types';
import { getVariantImage } from '@/lib/products';
import { getAddressesForUser, type SavedAddress } from '@/lib/orders';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { showToast } = useUI();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const shipping = useShippingSettings();
  const qtySettings = useQuantityDiscountSettings();

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

  // Prefill contact details for a signed-in customer (only fields they
  // haven't already typed into — never clobber in-progress edits).
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name,
      email: prev.email || user.email,
      phone: prev.phone || user.phone || prev.phone,
    }));
  }, [user]);

  // Fill the delivery address from the customer's saved addresses: the default
  // one (else the newest) loads automatically into empty fields.
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    if (!user) {
      setSavedAddresses([]);
      return;
    }
    let cancelled = false;
    getAddressesForUser()
      .then((list) => {
        if (cancelled) return;
        setSavedAddresses(list);
        const preferred = list.find((a) => a.isDefault) ?? list[0];
        if (!preferred) return;
        // Only auto-fill when nothing has been typed into the address yet.
        setFormData((prev) => {
          if (prev.address || prev.city || prev.pinCode) return prev;
          return {
            ...prev,
            fullName: preferred.name || prev.fullName,
            phone: (preferred.phone || '').replace(/\D/g, '').slice(-10) || prev.phone,
            address: [preferred.address, preferred.addressLine2].filter(Boolean).join(', '),
            city: preferred.city,
            state: preferred.state,
            pinCode: preferred.pinCode,
          };
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod');
  const [codEnabled, setCodEnabled] = useState(true);
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);

  useEffect(() => {
    getPaymentSettings()
      .then(({ codEnabled, razorpayEnabled }) => {
        setCodEnabled(codEnabled);
        setRazorpayEnabled(razorpayEnabled);
        // If the customer's default selection just got disabled, switch to whichever is left.
        setPaymentMethod((current) => {
          if (current === 'cod' && !codEnabled && razorpayEnabled) return 'online';
          if (current === 'online' && !razorpayEnabled && codEnabled) return 'cod';
          return current;
        });
      })
      .catch(() => {});
  }, []);

  // Coupon State
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  // Contact info from settings
  const [contactEmail, setContactEmail] = useState('');
  const [hasReturnsPolicy, setHasReturnsPolicy] = useState(false);
  useEffect(() => {
    getFooterSettings().then((s) => {
      setContactEmail(s.home_contact_email || '');
      setHasReturnsPolicy(Boolean(s.policy_returns?.trim()));
    });
  }, []);

  // Order Submission State
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [confirmedPaymentId, setConfirmedPaymentId] = useState('');

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

  // Same rule as the cart drawer: flat rate unless the free-shipping threshold is met.
  const shippingCost = currentSubtotal >= shipping.free_threshold ? 0 : shipping.flat_rate;
  const codFee = paymentMethod === 'cod' ? (currentSubtotal >= shipping.free_threshold ? 0 : shipping.cod_charge) : 0;
  const qtyDiscountAmount = computeQuantityDiscount(qtySettings, currentTotalItems);
  const finalTotal = Math.max(0, currentSubtotal - discountAmount - qtyDiscountAmount + shippingCost + codFee);

  // Apply Coupon
  const handleApplyCoupon = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const code = couponCode.trim();
    if (!code) return;
    setIsCouponLoading(true);
    try {
      const result = await validateCoupon(code, currentSubtotal);
      if (result.valid) {
        setDiscountAmount(result.discount);
        setCouponApplied(true);
        showToast(result.displayMsg, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch {
      showToast('Unable to validate coupon. Please try again.', 'error');
    } finally {
      setIsCouponLoading(false);
    }
  };

  // Form Submit / Place Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showToast('Please sign in to place your order', 'error');
      return;
    }
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      showToast('Please fill in your Contact Details (Name, Phone & Email)', 'error');
      return;
    }
    if (formData.phone.replace(/\D/g, '').length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pinCode.trim()) {
      showToast('Please complete your full delivery address and PIN code', 'error');
      return;
    }
    if (formData.pinCode.length !== 6) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }
    if (cart.length === 0) {
      showToast('Your shopping bag is empty. Please add items to proceed.', 'error');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const { data: sessionData } = await createBrowserSupabaseClient().auth.getSession();
      const result = await placeOrder({
        cart,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        subtotal: currentSubtotal,
        shippingCost,
        discountAmount: discountAmount + qtyDiscountAmount,
        couponCode: couponApplied ? couponCode.trim().toUpperCase() : undefined,
        total: finalTotal,
        paymentMethod,
        accessToken: sessionData.session?.access_token,
      });

      if (result.isRazorpay) {
        // @ts-ignore
        if (typeof window === 'undefined' || !window.Razorpay) {
          showToast('Payment gateway is still loading. Please wait and try again.', 'error');
          setIsPlacingOrder(false);
          return;
        }
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: result.amount,
          currency: 'INR',
          name: 'Al Hareer',
          description: 'Order Payment',
          order_id: result.razorpayOrderId,
          modal: {
            ondismiss: () => { cancelPendingOrder(result.orderId, result.razorpayOrderId) },
          },
          handler: async (response: any) => {
            try {
              const verifyRes = await verifyRazorpayPayment(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature,
                result.orderId
              );
              if (verifyRes.success) {
                setConfirmedOrderId(result.orderNumber);
                setConfirmedPaymentId(response.razorpay_payment_id || '');
                setOrderConfirmed(true);
                clearCart();
                showToast('🎉 Order Placed Successfully! Your royal package is being prepared.', 'success');
              } else {
                showToast('Payment verification failed. Please contact support.', 'error');
              }
            } catch {
              showToast(`Payment received but confirmation failed. Contact support with order ${result.orderNumber}.`, 'error');
            }
          },
          prefill: { name: formData.fullName, contact: formData.phone, email: formData.email },
          theme: { color: '#024F5F' },
        };
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          cancelPendingOrder(result.orderId, result.razorpayOrderId);
          showToast('Payment failed: ' + response.error.description, 'error');
        });
        rzp.open();
        setIsPlacingOrder(false);
        return;
      }

      setConfirmedOrderId(result.orderNumber);
      setOrderConfirmed(true);
      clearCart();
      showToast('🎉 Order Placed Successfully! Your royal package is being prepared.', 'success');
    } catch (err) {
      console.error('Failed to place order', err);
      showToast('Something went wrong placing your order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1EC] text-[#00303A] selection:bg-[#024F5F] selection:text-white">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 md:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* TOP HEADER & STEP INDICATOR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-[#CFAC64] mb-8 sm:mb-10">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#00303A] tracking-tight">
                Checkout
              </h1>
              <p className="font-body text-xs sm:text-sm text-[#024F5F] mt-1">
                Complete your order in a few simple steps.
              </p>
            </div>

            {/* 3-Step Progress Indicator Matching Mockup */}
            <div className="flex items-center gap-2 sm:gap-4 select-none">
              {/* Step 1: Information */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00303A] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  1
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#00303A] mt-1.5 whitespace-nowrap">
                  Information
                </span>
              </div>

              {/* Connecting Line 1 */}
              <div className="w-10 sm:w-16 h-[2px] bg-[#00303A] -mt-5" />

              {/* Step 2: Payment */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#CFAC64] text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#024F5F] mt-1.5 whitespace-nowrap">
                  Payment
                </span>
              </div>

              {/* Connecting Line 2 */}
              <div className="w-10 sm:w-16 h-[2px] bg-[#CFAC64] -mt-5" />

              {/* Step 3: Confirmation */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#CFAC64] text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#024F5F] mt-1.5 whitespace-nowrap">
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          {/* MAIN CHECKOUT FORM & SUMMARY GRID */}
          <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            
            {/* LEFT COLUMN: Shipping Address, Shipping Method, Payment Method (7 cols on lg, 8 on xl) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8">
              
              {/* 1. SHIPPING ADDRESS CARD */}
              <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#CFAC64] shadow-xs space-y-5">
                <div className="flex items-start justify-between pb-4 border-b border-[#F6F1EC]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F]">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg sm:text-xl font-bold text-[#00303A]">
                        1. Shipping Address
                      </h2>
                      <p className="text-xs text-[#024F5F]">
                        Enter your delivery address
                      </p>
                    </div>
                  </div>

                  {!isLoggedIn && (
                    <div className="text-[12px] text-[#024F5F] hidden sm:block">
                      <span>Already have an account? </span>
                      <Link
                        href="/account?mode=signin"
                        className="font-semibold text-[#024F5F] underline hover:text-[#00303A]"
                      >
                        Sign in
                      </Link>
                    </div>
                  )}
                </div>

                {/* Login is required to place an order */}
                {!authLoading && !isLoggedIn && (
                  <div className="rounded-xl border border-[#CFAC64] bg-[#F6F1EC] p-4 text-sm text-[#00303A] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="font-medium">Please sign in or create an account to place your order.</p>
                    <div className="flex gap-2 shrink-0">
                      <Link href="/account?mode=signin" className="bg-[#CFAC64] hover:bg-[#B08F4F] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                        Sign In
                      </Link>
                      <Link href="/account?mode=register" className="border border-[#CFAC64] text-[#00303A] px-4 py-2 rounded-lg text-xs font-bold hover:bg-white transition-colors">
                        Create Account
                      </Link>
                    </div>
                  </div>
                )}

                {/* 3 Columns: Full Name, Phone Number, Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                      Full Name <span className="text-[#024F5F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                      Phone Number <span className="text-[#024F5F]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                      Email Address <span className="text-[#024F5F]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* SINGLE FULL-WIDTH ADDRESS (As requested: "Address 1 hi rakho full width") */}
                <div>
                  <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                    Address <span className="text-[#024F5F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House no., Street, Area"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                  />
                </div>

                {/* 3 Columns: City, State (TEXT INPUT as requested: "state jo hai select option mat do ok"), PIN Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                      City <span className="text-[#024F5F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter city"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                      State <span className="text-[#024F5F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Enter state"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                      PIN Code <span className="text-[#024F5F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })}
                      placeholder="6 digit PIN code"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 2. PAYMENT METHOD CARD */}
              <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#CFAC64] shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#F6F1EC]">
                  <div className="w-9 h-9 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#00303A]">
                      2. Payment Method
                    </h2>
                    <p className="text-xs text-[#024F5F]">
                      Choose your preferred payment method
                    </p>
                  </div>
                </div>

                {/* Payment Options — Online & COD */}
                <div className="space-y-2.5">
                  {/* Online Payment */}
                  {razorpayEnabled && (
                  <label
                    onClick={() => setPaymentMethod('online')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      paymentMethod === 'online'
                        ? 'border-[#024F5F] bg-[#F6F1EC] shadow-2xs'
                        : 'border-[#CFAC64] bg-white hover:bg-[#F6F1EC]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'online'
                            ? 'border-[#024F5F] bg-[#024F5F]'
                            : 'border-[#CFAC64]'
                        }`}
                      >
                        {paymentMethod === 'online' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-[#00303A]">
                          Online Payment
                        </span>
                        <p className="text-[11px] text-[#024F5F] mt-0.5">UPI, Card, Net Banking</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#024F5F] font-semibold">No extra fee</span>
                  </label>
                  )}

                  {/* Cash on Delivery (COD) */}
                  {codEnabled && (
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      paymentMethod === 'cod'
                        ? 'border-[#024F5F] bg-[#F6F1EC] shadow-2xs'
                        : 'border-[#CFAC64] bg-white hover:bg-[#F6F1EC]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'cod'
                            ? 'border-[#024F5F] bg-[#024F5F]'
                            : 'border-[#CFAC64]'
                        }`}
                      >
                        {paymentMethod === 'cod' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-[#00303A]">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#024F5F]">
                      {currentSubtotal >= shipping.free_threshold ? 'Free COD' : `₹${shipping.cod_charge} handling fee`}
                    </span>
                  </label>
                  )}

                  {!razorpayEnabled && !codEnabled && (
                    <p className="w-fit max-w-full text-xs text-[#B08F4F] px-3.5 py-2.5 rounded-xl border border-[#CFAC64] bg-[#F6F1EC]">
                      No payment methods are currently available. Please contact support.
                    </p>
                  )}
                </div>

                {/* Primary CTA Place Order Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isPlacingOrder || cart.length === 0 || authLoading || !isLoggedIn}
                    className="w-full bg-[#CFAC64] hover:bg-[#B08F4F] text-white py-3.5 sm:py-4 px-6 rounded-xl font-heading text-base sm:text-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between cursor-pointer disabled:opacity-50"
                  >
                    {isPlacingOrder ? (
                      <span className="flex items-center gap-2 mx-auto text-sm font-sans font-medium">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing Your Order...
                      </span>
                    ) : (
                      <>
                        <span>Place Order</span>
                        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#024F5F] flex items-center justify-center gap-1.5 mt-2.5">
                    <Lock className="w-3.5 h-3.5 text-[#024F5F]" />
                    <span>Secure and encrypted checkout</span>
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Order Summary & Trust Badges (5 cols on lg, 5 on xl) */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              {/* ORDER SUMMARY CARD */}
              <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#CFAC64] shadow-xs space-y-5">
                
                {/* Header with Icon before Order Summary */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#F6F1EC]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F] shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#00303A]">
                        Order Summary
                      </h3>
                      <p className="text-xs text-[#024F5F]">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Items List With Working QTY Increase/Decrease */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 no-scrollbar divide-y divide-[#F6F1EC]">
                  {cart.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#024F5F] space-y-2">
                      <ShoppingBag className="w-8 h-8 text-[#CFAC64] mx-auto stroke-1" />
                      <p className="font-medium text-[#00303A]">Your shopping bag is empty.</p>
                      <p className="text-[11px] text-[#024F5F]">Add products from the store to proceed with checkout.</p>
                      <Link
                        href="/shop"
                        className="inline-block mt-2 px-4 py-2 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        Explore Shop Collection
                      </Link>
                    </div>
                  ) : (
                    cart.map((item, index) => {
                      const itemTotal = item.product.price * item.quantity;
                      const imageSrc = getVariantImage(item.product, item.selectedSize, item.selectedColor);

                      return (
                        <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`} className="pt-3.5 first:pt-0 flex gap-3.5 items-start">
                          {/* Thumbnail */}
                          <div className="relative w-16 h-20 sm:w-18 sm:h-22 rounded-lg overflow-hidden bg-[#F6F1EC] border border-[#CFAC64] shrink-0">
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
                              <h4 className="font-heading text-sm sm:text-[15px] font-bold text-[#00303A] truncate">
                                {item.product.name}
                              </h4>
                              <span className="font-heading text-sm font-bold text-[#00303A] shrink-0">
                                ₹{itemTotal.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#024F5F] mt-0.5">
                              Size: <strong className="text-[#00303A]">{item.selectedSize}</strong> | Color: <span className="inline-block w-3.5 h-3.5 rounded-full border border-cream-300 align-middle mr-1" style={{ backgroundColor: item.product.colors.find((c) => c.name === item.selectedColor)?.hex || '#CCCCCC' }} /><strong className="text-[#00303A]">{item.selectedColor}</strong>
                            </p>

                            {/* USER REQUESTED FEATURE: Product QTY increase / decrease controls in Order Summary */}
                            <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center border border-[#CFAC64] rounded-md bg-[#F6F1EC] shadow-2xs">
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
                                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#024F5F] hover:text-[#00303A] hover:bg-[#F6F1EC] transition-colors cursor-pointer rounded-l-md"
                                  aria-label="Decrease quantity"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 sm:w-7 text-center text-xs font-bold text-[#00303A]">
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
                                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#024F5F] hover:text-[#00303A] hover:bg-[#F6F1EC] transition-colors cursor-pointer rounded-r-md"
                                  aria-label="Increase quantity"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                                className="text-[11px] text-[#024F5F] hover:underline flex items-center gap-1"
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
                <div className="py-3.5 border-t border-b border-[#024F5F] space-y-2.5 text-xs sm:text-[13px]">
                  <div className="flex items-center justify-between text-[#024F5F]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#00303A]">
                      ₹{currentSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-[#024F5F]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span>Coupon Discount</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#024F5F]/10 text-[#024F5F] px-1.5 py-0.5 rounded">
                          Applied
                        </span>
                      </span>
                      <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {qtyDiscountAmount > 0 && (
                    <div className="flex items-center justify-between text-[#024F5F]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span>Quantity Discount</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#024F5F]/10 text-[#024F5F] px-1.5 py-0.5 rounded">
                          Auto
                        </span>
                      </span>
                      <span className="font-bold">-₹{qtyDiscountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#024F5F]">
                    <span>Shipping</span>
                    {shippingCost > 0 ? (
                      <span className="font-semibold text-[#00303A]">₹{shippingCost.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="font-bold text-[#024F5F] bg-[#024F5F]/10 px-2 py-0.5 rounded text-[11px]">
                        FREE
                      </span>
                    )}
                  </div>

                  {codFee > 0 && (
                    <div className="flex items-center justify-between text-[#024F5F]">
                      <span>COD Handling</span>
                      <span className="font-semibold text-[#00303A]">₹{codFee}</span>
                    </div>
                  )}
                </div>

                {/* Distinct Modern Total Card - Matches theme with standout presence */}
                <div className="p-1 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="block font-heading text-base sm:text-[24px] font-bold text-[#00303A] leading-tight">
                      Total
                    </span>
                    <span className="block text-[10.5px] sm:text-[11px] text-[#024F5F] mt-0.5">
                      Inclusive of all taxes
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg sm:text-2xl font-bold text-[#024F5F] tracking-tight">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                    {discountAmount > 0 && (
                      <span className="block text-[10.5px] font-semibold text-[#024F5F] mt-0.5">
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
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#024F5F] hover:text-[#00303A] py-1 cursor-pointer"
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
                        placeholder="Enter coupon code"
                        className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] uppercase outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus:border-[#024F5F]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isCouponLoading || !couponCode.trim()}
                        className="bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCouponLoading ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            <span>Checking...</span>
                          </span>
                        ) : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Trust & service badges: each one only appears when real data backs it */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
                {shipping.free_threshold > 0 && (
                  <div className="flex flex-col items-center gap-1 p-4 bg-white rounded-lg border border-[#CFAC64] shadow-2xs">
                    <Truck className="w-6 h-6 text-[#024F5F]" />
                    <span className="font-bold text-[11px] text-[#00303A]">Free Shipping</span>
                    <span className="text-[9.5px] text-[#024F5F]">On orders above ₹{shipping.free_threshold.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {razorpayEnabled && (
                  <div className="flex flex-col items-center gap-1 p-4 bg-white rounded-lg border border-[#CFAC64] shadow-2xs">
                    <ShieldCheck className="w-6 h-6  text-[#024F5F]" />
                    <span className="font-bold text-[11px] text-[#00303A]">Online Payments</span>
                    <span className="text-[9.5px] text-[#024F5F]">Processed by Razorpay</span>
                  </div>
                )}

                {hasReturnsPolicy && (
                  <Link href="/policies/returns" className="flex flex-col items-center gap-1 p-4 bg-white rounded-lg border border-[#CFAC64] shadow-2xs hover:bg-[#F6F1EC]/60 transition-colors">
                    <RotateCcw className="w-6 h-6 text-[#024F5F]" />
                    <span className="font-bold text-[11px] text-[#00303A]">Returns &amp; Exchanges</span>
                    <span className="text-[9.5px] text-[#024F5F]">Read our policy</span>
                  </Link>
                )}

                {contactEmail && (
                  <div className="flex flex-col items-center gap-1 p-4 bg-white rounded-lg border border-[#CFAC64] shadow-2xs">
                    <Headphones className="w-6 h-6 text-[#024F5F]" />
                    <span className="font-bold text-[11px] text-[#00303A]">Need Help?</span>
                    <span className="text-[9.5px] text-[#024F5F] break-all">{contactEmail}</span>
                  </div>
                )}
              </div>

            </div>

          </form>

        </div>
      </main>

      {/* ORDER CONFIRMATION MODAL OVERLAY */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00303A]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 border border-[#CFAC64] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#F6F1EC] text-[#024F5F] flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#024F5F]">
                ORDER CONFIRMED
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#00303A]">
                Thank You For Your Order!
              </h3>
              <p className="text-xs text-[#024F5F] mt-1">
                Your order is being prepared with care and will be on its way soon.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#024F5F]">Order ID:</span>
                <span className="font-bold text-[#024F5F] font-mono">{confirmedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#024F5F]">Delivery To:</span>
                <span className="font-semibold text-[#00303A] truncate max-w-[200px]">
                  {formData.fullName || 'Guest Client'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#024F5F]">Payment Method:</span>
                <span className="font-semibold text-[#00303A] uppercase">{paymentMethod}</span>
              </div>
              {confirmedPaymentId && (
                <div className="flex justify-between gap-3">
                  <span className="text-[#024F5F] shrink-0">Payment ID:</span>
                  <span className="font-bold text-[#024F5F] font-mono break-all text-right select-all">{confirmedPaymentId}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#CFAC64] pt-1.5">
                <span className="text-[#024F5F]">Total Paid:</span>
                <span className="font-bold text-sm text-[#024F5F]">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/shop"
                onClick={() => setOrderConfirmed(false)}
                className="w-full bg-[#CFAC64] hover:bg-[#B08F4F] text-white py-3 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                type="button"
                onClick={() => setOrderConfirmed(false)}
                className="w-full text-xs text-[#024F5F] hover:text-[#00303A] py-1"
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
