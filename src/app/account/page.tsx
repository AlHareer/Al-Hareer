'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import OrderTracking from '@/components/account/OrderTracking';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  X,
  Heart,
  MapPin,
  Settings,
  LogOut,
  LayoutDashboard,
  Package,
  Truck,
  RotateCcw,
  Headphones,
  ChevronRight,
  Plus,
  ShoppingBag,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  FileText,
  Sparkles,
  Check,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useUI } from '@/context/UIContext';
import { useAuth } from '@/context/AuthContext';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { createCustomerAccount, updateCustomerProfile } from '@/actions/customerAuth';
import { getOrdersForUser, getAddressesForUser } from '@/lib/orders';
import { cancelOwnOrder, addCustomerAddress } from '@/actions/customerAccount';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { getFooterSettings } from '@/lib/siteSettings';

export interface OrderItem {
  name: string;
  size?: string;
  color?: string;
  qty?: number;
  price?: number;
  image?: string;
}

export interface OrderShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface Order {
  id: string;
  productName: string;
  productImage: string;
  date: string;
  status: string;
  total: number;
  itemsCount: number;
  items?: OrderItem[];
  shippingAddress: OrderShippingAddress;
  paymentMethod: string;
  createdAt?: string;
  updatedAt?: string;
  // Shipment details the admin enters on the order (all optional).
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

type OrderStatusFilter = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const ORDER_STATUS_TABS: { id: OrderStatusFilter; label: string }[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

const getStatusBadge = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') {
    return {
      bg: 'bg-[#F6F1EC] text-[#024F5F] border-[#F6F1EC]',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: 'Delivered',
    };
  }
  if (s === 'shipped') {
    return {
      bg: 'bg-[#F6F1EC] text-[#024F5F] border-[#F6F1EC]',
      icon: <Truck className="w-3.5 h-3.5" />,
      label: 'Shipped',
    };
  }
  if (s === 'processing') {
    return {
      bg: 'bg-[#F6F1EC] text-[#B08F4F] border-[#F6F1EC]',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Processing',
    };
  }
  if (s === 'pending') {
    return {
      bg: 'bg-[#F6F1EC] text-[#B08F4F] border-[#F6F1EC]',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: 'Pending',
    };
  }
  if (s === 'cancelled') {
    return {
      bg: 'bg-[#F6F1EC] text-[#024F5F] border-[#F6F1EC]',
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: 'Cancelled',
    };
  }
  return {
    bg: 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]',
    icon: <Package className="w-3.5 h-3.5" />,
    label: status || 'Pending',
  };
};

const getTrackingSteps = (status: string) => {
  const s = (status || '').toLowerCase();

  if (s === 'cancelled') {
    return [
      {
        title: 'Order Placed',
        desc: 'We received your bespoke order request',
        date: '12 Sep 2025, 10:30 AM',
        completed: true,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Order Cancelled',
        desc: 'Order was cancelled as requested',
        date: '12 Sep 2025, 11:15 AM',
        completed: true,
        current: true,
        isCancelled: true,
      },
      {
        title: 'Refund Processed',
        desc: '100% refund credited back to your payment mode',
        date: '12 Sep 2025, 02:40 PM',
        completed: true,
        current: false,
        isCancelled: false,
      },
    ];
  }

  if (s === 'delivered') {
    return [
      {
        title: 'Order Confirmed',
        desc: 'Payment verified & order booked with atelier',
        date: '12 Sep 2025, 10:30 AM',
        completed: true,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Bespoke Quality Check',
        desc: 'Examined, steamed and packaged in royal gift box',
        date: '13 Sep 2025, 02:15 PM',
        completed: true,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Dispatched via Royal BlueDart',
        desc: 'AWB: BNF-EXP-88912 | Mumbai Sorting Hub',
        date: '14 Sep 2025, 09:45 AM',
        completed: true,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Out for Delivery',
        desc: 'Courier executive assigned: Rahul S. (+91 98112 34567)',
        date: '15 Sep 2025, 11:20 AM',
        completed: true,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Delivered',
        desc: 'Handed over to Sana Khan with OTP verification',
        date: '15 Sep 2025, 03:45 PM',
        completed: true,
        current: true,
        isCancelled: false,
      },
    ];
  }

  if (s === 'shipped') {
    return [
      {
        title: 'Order Confirmed',
        desc: 'Payment verified & order booked with atelier',
        date: '05 Sep 2025, 11:20 AM',
        completed: true,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Bespoke Quality Check',
        desc: 'Examined, steamed and packaged in royal gift box',
        date: '06 Sep 2025, 04:00 PM',
        completed: true,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Dispatched via Royal BlueDart',
        desc: 'AWB: BNF-EXP-99201 | In transit to Mumbai Hub',
        date: '07 Sep 2025, 08:30 AM',
        completed: true,
        current: true,
        isCancelled: false,
      },
      {
        title: 'Out for Delivery',
        desc: 'Expected when package reaches local delivery hub',
        date: 'Expected Tomorrow',
        completed: false,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Delivery',
        desc: 'Direct handoff at your doorstep',
        date: 'Estimated 24–48 Hours',
        completed: false,
        current: false,
        isCancelled: false,
      },
    ];
  }

  if (s === 'processing') {
    return [
      {
        title: 'Order Confirmed',
        desc: 'Payment verified & order placed successfully',
        date: 'Recent',
        completed: true,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Atelier Preparation & Quality Check',
        desc: 'Artisans handcrafting, tailoring & luxury gift packaging',
        date: 'In Progress',
        completed: true,
        current: true,
        isCancelled: false,
      },
      {
        title: 'Dispatched to Courier',
        desc: 'Handover to priority express logistics partner',
        date: 'Scheduled in 24 Hours',
        completed: false,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Out for Delivery',
        desc: 'Courier on the way to your shipping address',
        date: 'Upcoming',
        completed: false,
        current: false,
        isCancelled: false,
      },
      {
        title: 'Delivery',
        desc: 'Expected doorstep delivery',
        date: 'Estimated 3–4 Days',
        completed: false,
        current: false,
        isCancelled: false,
      },
    ];
  }

  // Default / Pending
  return [
    {
      title: 'Order Submitted',
      desc: 'Order received and awaiting warehouse confirmation',
      date: 'Just Now',
      completed: true,
      current: true,
      isCancelled: false,
    },
    {
      title: 'Payment & Verification',
      desc: 'Checking payment authorization and atelier stock',
      date: 'In Progress',
      completed: false,
      current: false,
      isCancelled: false,
    },
    {
      title: 'Preparation & Packaging',
      desc: 'Atelier team will pack with royal seals',
      date: 'Upcoming',
      completed: false,
      current: false,
      isCancelled: false,
    },
    {
      title: 'Dispatched & Tracking',
      desc: 'Live tracking number will be assigned',
      date: 'Upcoming',
      completed: false,
      current: false,
      isCancelled: false,
    },
    {
      title: 'Doorstep Delivery',
      desc: 'Safe and contactless royal delivery',
      date: 'Estimated 4–5 Days',
      completed: false,
      current: false,
      isCancelled: false,
    },
  ];
};

function AuthAndDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shipping = useShippingSettings();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';
  const initialTab = searchParams.get('tab') || 'dashboard';

  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const { showToast } = useUI();
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();

  // Sync tab with search params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      // Order tracking now lives inside My Orders (order details popup).
      setActiveTab(tab === 'track' ? 'orders' : tab);
    }
  }, [searchParams]);

  // Reset tracking search & result when switching tabs
  useEffect(() => {
    setTrackOrderNumber('');
    setTrackedOrderResult(null);
    setTrackError('');
  }, [activeTab]);

  // Real orders & addresses, loaded from Supabase for the signed-in user
  // (RLS restricts these queries to the current user's own rows — see
  // db/schema.sql's `own_rows` policies).
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Awaited<ReturnType<typeof getAddressesForUser>>>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<OrderStatusFilter>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const loadStoredData = async () => {
    if (!isLoggedIn) {
      setOrders([]);
      setAddresses([]);
      return;
    }
    setOrdersLoading(true);
    try {
      const [realOrders, realAddresses] = await Promise.all([getOrdersForUser(), getAddressesForUser()]);
      setOrders(realOrders);
      setAddresses(realAddresses);
    } catch (e) {
      console.error('Error loading account data from Supabase', e);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    loadStoredData();
  }, [isLoggedIn]);

  // Filtered orders & badge count computations
  const filterCounts = {
    all: orders.length,
    pending: orders.filter((o) => (o.status || '').toLowerCase() === 'pending').length,
    processing: orders.filter((o) => (o.status || '').toLowerCase() === 'processing').length,
    shipped: orders.filter((o) => (o.status || '').toLowerCase() === 'shipped').length,
    delivered: orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length,
    cancelled: orders.filter((o) => (o.status || '').toLowerCase() === 'cancelled').length,
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      orderFilter === 'all' || (order.status || '').toLowerCase() === orderFilter;
    const query = orderSearchQuery.trim().toLowerCase();
    const searchMatch =
      query === '' ||
      order.id.toLowerCase().includes(query) ||
      order.productName.toLowerCase().includes(query) ||
      (order.items &&
        order.items.some((it: any) => it.name && it.name.toLowerCase().includes(query)));
    return statusMatch && searchMatch;
  });

  // Handle Cancel Order — persists to Supabase (own_rows RLS on orders is
  // SELECT-only, so this goes through a server action that re-checks
  // ownership before writing).
  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    const result = await cancelOwnOrder(user.id, orderId);
    if (!result.success) {
      showToast(result.error || 'Failed to cancel order.', 'error');
      return;
    }
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o));
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
    }
    showToast(`Order ${orderId} has been cancelled.`, 'info');
  };

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Register Form State
  const [registerData, setRegisterData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  // Account Settings Form State (synced with logged-in user)
  const [settingsData, setSettingsData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setSettingsData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
      });
      setNewAddressForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    type: 'Home',
    setAsDefault: false,
  });

  // Track Order States
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [trackedOrderResult, setTrackedOrderResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState('');
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [supportEmail, setSupportEmail] = useState('');

  useEffect(() => {
    getFooterSettings().then((s) => setSupportEmail(s.home_contact_email as string || ''));
  }, []);

  // Handle Refresh Tracking Data & Clear Input
  const handleRefreshTracking = () => {
    setIsRefreshing(true);
    setTrackOrderNumber('');
    setTrackedOrderResult(null);
    setTrackError('');
    loadStoredData();

    setTimeout(() => {
      setIsRefreshing(false);
      showToast('🔄 Search cleared & tracking refreshed!', 'success');
    }, 400);
  };

  // Handle Live Track Order Submit
  const handleTrackOrderSubmit = (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const idToSearch = (customId || trackOrderNumber).trim().toUpperCase();
    if (!idToSearch) {
      setTrackError('Please enter an order number (e.g. #BNF1001)');
      showToast('Please enter an order number to track', 'error');
      return;
    }

    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === idToSearch ||
        o.id.replace('#', '').toUpperCase() === idToSearch.replace('#', '')
    );

    if (found) {
      setTrackedOrderResult(found);
      setTrackError('');
      setIsTrackingModalOpen(true);
      showToast(`📦 Live tracking retrieved for order ${found.id}`, 'success');
    } else {
      setTrackedOrderResult(null);
      setTrackError(`No order found matching "${idToSearch}". Check the order number and try again.`);
      showToast('No matching order found in your account.', 'error');
    }
  };

  // Password visibility toggles
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Terms Modal
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Handle Sign In Submit — real Supabase Auth
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredEmail = signInData.email.trim().toLowerCase();
    const enteredPassword = signInData.password.trim();

    if (!enteredEmail || !enteredPassword) {
      showToast('Please enter both your email address and password', 'error');
      return;
    }

    setIsLoading(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email: enteredEmail, password: enteredPassword });
    setIsLoading(false);

    if (error) {
      showToast(error.message.includes('Invalid login') ? 'Incorrect email or password.' : error.message, 'error');
      return;
    }
    showToast('🎉 Welcome back! Signed in successfully.', 'success');
  };

  // Handle Register Submit — real Supabase Auth (no email confirmation step for now)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerData.fullName.trim() ||
      !registerData.phone.trim() ||
      !registerData.email.trim() ||
      !registerData.password.trim()
    ) {
      showToast('Please fill in all required registration fields', 'error');
      return;
    }

    if (registerData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      showToast('Passwords do not match. Please verify.', 'error');
      return;
    }

    if (!registerData.agreeTerms) {
      showToast('Please agree to the Terms of Service & Privacy Policy', 'error');
      return;
    }

    setIsLoading(true);
    const result = await createCustomerAccount(
      registerData.fullName.trim(),
      registerData.phone.trim(),
      registerData.email.trim(),
      registerData.password
    );

    if (!result.success) {
      setIsLoading(false);
      showToast(result.error || 'Failed to create account.', 'error');
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: registerData.email.trim().toLowerCase(),
      password: registerData.password,
    });
    setIsLoading(false);

    if (error) {
      showToast('Account created — please sign in.', 'info');
      setMode('signin');
      return;
    }
    showToast('🎉 Account created successfully! Welcome to Al Hareer.', 'success');
  };

  // Handle Save Settings — updates name/phone (email changes need a
  // confirmation flow we're deferring until Brevo is wired in, so email
  // stays read-only here for now).
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsData.name.trim() || !settingsData.email.trim()) {
      showToast('Name and email cannot be empty', 'error');
      return;
    }
    const supabase = createBrowserSupabaseClient();
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: settingsData.name.trim(), phone: settingsData.phone.trim() },
    });
    if (authError) {
      showToast(authError.message, 'error');
      return;
    }
    if (user) {
      await updateCustomerProfile(user.id, settingsData.name.trim(), settingsData.phone.trim());
    }
    showToast('✅ Account details updated successfully!', 'success');
  };

  // Handle Add Address — persists to Supabase (own_rows RLS on addresses is
  // SELECT-only, so this goes through a server action).
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (
      !newAddressForm.address.trim() ||
      !newAddressForm.city.trim() ||
      !newAddressForm.state.trim() ||
      !newAddressForm.pinCode.trim()
    ) {
      showToast('Please complete all address fields', 'error');
      return;
    }
    const result = await addCustomerAddress(user.id, {
      name: newAddressForm.name,
      phone: newAddressForm.phone,
      address: newAddressForm.address,
      addressLine2: newAddressForm.addressLine2,
      city: newAddressForm.city,
      state: newAddressForm.state,
      pinCode: newAddressForm.pinCode,
      addressType: newAddressForm.type,
      isDefault: addresses.length === 0 || newAddressForm.setAsDefault,
    });
    if (!result.success) {
      showToast(result.error || 'Failed to save address.', 'error');
      return;
    }
    await loadStoredData();
    setIsAddAddressOpen(false);
    setNewAddressForm({
      name: user.name || '',
      phone: user.phone || '',
      address: '',
      addressLine2: '',
      city: '',
      state: '',
      pinCode: '',
      type: 'Home',
      setAsDefault: false,
    });
    showToast('📍 New address saved successfully!', 'success');
  };

  // Handle Logout
  const handleLogout = () => {
    logout();
    showToast('👋 You have been safely logged out.', 'info');
  };

  // Display details for logged-in profile
  const displayName = user?.name || 'Guest';
  const displayEmail = user?.email || '';
  const userInitial = displayName.charAt(0).toUpperCase() || 'G';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-[#F6F1EC] flex flex-col justify-between selection:bg-[#024F5F] selection:text-white pb-20 lg:pb-0">
      {/* 1. SITE NAVBAR */}
      <Navbar />

      {/* 2. MAIN BODY: DASHBOARD (IF LOGGED IN) OR AUTH CARD (IF LOGGED OUT) */}
      <main className="flex-1 py-4 sm:py-7 md:py-10">
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-10">
          
          {authLoading ? (
            <div className="flex items-center justify-center py-24 text-sm text-[#024F5F]">Loading your account…</div>
          ) : isLoggedIn ? (
            /* ========================================================================= */
            /* VIEW 1: FULL USER ACCOUNT DASHBOARD (MATCHING USER SCREENSHOT)            */
            /* ========================================================================= */
            <div className="space-y-4 sm:space-y-6">
              
              {/* MOBILE HORIZONTAL NAVIGATION TABS (Only visible on screens < lg) */}
              <div className="lg:hidden -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none overscroll-x-contain">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 ${
                      activeTab === 'dashboard'
                        ? 'bg-[#00303A] text-white shadow-xs'
                        : 'bg-white text-[#024F5F] border border-[#CFAC64] hover:bg-[#F6F1EC]'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 ${
                      activeTab === 'orders'
                        ? 'bg-[#00303A] text-white shadow-xs'
                        : 'bg-white text-[#024F5F] border border-[#CFAC64] hover:bg-[#F6F1EC]'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Orders ({orders.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('addresses')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 ${
                      activeTab === 'addresses'
                        ? 'bg-[#00303A] text-white shadow-xs'
                        : 'bg-white text-[#024F5F] border border-[#CFAC64] hover:bg-[#F6F1EC]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Addresses ({addresses.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 ${
                      activeTab === 'settings'
                        ? 'bg-[#00303A] text-white shadow-xs'
                        : 'bg-white text-[#024F5F] border border-[#CFAC64] hover:bg-[#F6F1EC]'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start animate-in fade-in duration-300">
                
                {/* LEFT SIDEBAR: User Info & Navigation Menu (Desktop) */}
                <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 space-y-6">
                  <div className="bg-white rounded-2xl border border-[#CFAC64] shadow-2xs p-5 sm:p-6 space-y-6">
                    
                    {/* User Profile Header */}
                    <div className="flex items-center gap-3.5 pb-5 border-b border-[#F6F1EC]">
                      <div className="w-14 h-14 rounded-full bg-[#F6F1EC] text-[#024F5F] font-heading font-bold text-2xl flex items-center justify-center border border-[#CFAC64] shrink-0 shadow-xs">
                        {userInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-base sm:text-lg font-bold text-[#00303A] truncate leading-tight">
                          {displayName}
                        </h3>
                        <p className="text-xs text-[#024F5F] truncate mt-0.5">
                          {displayEmail}
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('settings')}
                          className="text-[11px] font-semibold text-[#024F5F] hover:text-[#024F5F] underline underline-offset-2 mt-1 transition-colors cursor-pointer"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>

                    {/* Sidebar Navigation Tabs */}
                    <nav className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          activeTab === 'dashboard'
                            ? 'bg-[#F6F1EC] text-[#00303A] shadow-2xs font-bold'
                            : 'text-[#024F5F] hover:text-[#00303A] hover:bg-[#F6F1EC]'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#024F5F]" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          activeTab === 'orders'
                            ? 'bg-[#F6F1EC] text-[#00303A] shadow-2xs font-bold'
                            : 'text-[#024F5F] hover:text-[#00303A] hover:bg-[#F6F1EC]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-[#024F5F]" />
                          <span>My Orders</span>
                        </span>
                        <span className="text-[10.5px] font-bold bg-[#F6F1EC] px-2 py-0.5 rounded-full text-[#024F5F] border border-[#CFAC64]">
                          {orders.length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('addresses')}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          activeTab === 'addresses'
                            ? 'bg-[#F6F1EC] text-[#00303A] shadow-2xs font-bold'
                            : 'text-[#024F5F] hover:text-[#00303A] hover:bg-[#F6F1EC]'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-[#024F5F]" />
                        <span>Addresses</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          activeTab === 'settings'
                            ? 'bg-[#F6F1EC] text-[#00303A] shadow-2xs font-bold'
                            : 'text-[#024F5F] hover:text-[#00303A] hover:bg-[#F6F1EC]'
                        }`}
                      >
                        <Settings className="w-4 h-4 text-[#024F5F]" />
                        <span>Account Settings</span>
                      </button>

                      <div className="pt-2 border-t border-[#F6F1EC]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#024F5F] hover:bg-[#024F5F]/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </nav>

                  </div>
                </aside>

                {/* RIGHT MAIN CONTENT AREA */}
                <div className="lg:col-span-9 xl:col-span-9 space-y-5 sm:space-y-7">
                  
                  {/* ------------------------------------------------------------- */}
                  {/* SUB-TAB A: DASHBOARD OVERVIEW (EXACT USER SCREENSHOT)          */}
                  {/* ------------------------------------------------------------- */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-4 sm:space-y-6 md:space-y-7 animate-in fade-in duration-200">
                      
                      {/* 1. HERO WELCOME BANNER (With Style Lives Here Calligraphy & Floral Element) */}
                      <div className="rounded-2xl bg-gradient-to-r from-[#F6F1EC] via-[#F6F1EC] to-[#F6F1EC] border border-[#CFAC64] p-5 sm:p-7 md:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden shadow-2xs">
                        {/* Left Welcome Copy */}
                        <div className="space-y-1 sm:space-y-1.5 z-10 max-w-lg">
                          <p className="text-xs sm:text-sm text-[#024F5F] font-medium tracking-wide">
                            Welcome Back,
                          </p>
                          <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-[#00303A] tracking-tight leading-tight">
                            {displayName}
                          </h1>
                          <p className="text-xs sm:text-sm text-[#024F5F] pt-0.5">
                            Manage your orders, wishlist and account details.
                          </p>
                        </div>

                        {/* Right Calligraphy & Aesthetic Floral Asset */}
                        <div className="flex items-center gap-3 sm:gap-6 z-10 select-none self-end sm:self-center shrink-0">
                          <div className="flex flex-col items-end">
                            <span className="font-script text-2xl sm:text-3xl md:text-5xl text-[#00303A] leading-none">
                              Style Lives Here
                            </span>
                            <div className="w-28 sm:w-44 h-[1.6px] bg-[#024F5F] mt-1.5 sm:mt-2" />
                          </div>
                        </div>
                      </div>

                      {/* 2. THREE STAT SUMMARY CARDS ROW */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        {/* Card 1: Total Orders */}
                        <div
                          onClick={() => setActiveTab('orders')}
                          className="bg-white rounded-xl sm:rounded-2xl border border-[#CFAC64] p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 shadow-2xs hover:border-[#CFAC64] transition-all cursor-pointer group text-center sm:text-left"
                        >
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F] group-hover:scale-105 transition-transform shrink-0">
                            <Package className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-lg sm:text-2xl font-bold text-[#00303A] leading-none">
                              {orders.length}
                            </p>
                            <p className="text-[10px] sm:text-xs text-[#024F5F] mt-1 font-medium truncate">
                              Total Orders
                            </p>
                          </div>
                        </div>

                        {/* Card 2: Saved Addresses */}
                        <div
                          onClick={() => setActiveTab('addresses')}
                          className="bg-white rounded-xl sm:rounded-2xl border border-[#CFAC64] p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 shadow-2xs hover:border-[#CFAC64] transition-all cursor-pointer group text-center sm:text-left"
                        >
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F] group-hover:scale-105 transition-transform shrink-0">
                            <MapPin className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-lg sm:text-2xl font-bold text-[#00303A] leading-none">
                              {addresses.length}
                            </p>
                            <p className="text-[10px] sm:text-xs text-[#024F5F] mt-1 font-medium truncate">
                              Addresses
                            </p>
                          </div>
                        </div>

                        {/* Card 3: Member Tier */}
                        <div
                          onClick={() => setActiveTab('settings')}
                          className="bg-white rounded-xl sm:rounded-2xl border border-[#CFAC64] p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 shadow-2xs hover:border-[#CFAC64] transition-all cursor-pointer group text-center sm:text-left"
                        >
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F] group-hover:scale-105 transition-transform shrink-0">
                            <UserIcon className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-xs sm:text-base font-bold text-[#00303A] leading-none truncate">
                              Member
                            </p>
                            <p className="text-[9.5px] sm:text-[11px] text-[#024F5F] mt-1 font-medium truncate">
                              {memberSince}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 3. TWO-COLUMN SPLIT: RECENT ORDERS (LEFT) & QUICK ACTIONS (RIGHT) */}
                      <div className="grid grid-cols-1 gap-5 lg:gap-6 items-start">
                        
                        {/* Left: Recent Orders Table Card (Exact Screenshot Match) */}
                        <div className="bg-white rounded-2xl border border-[#CFAC64] shadow-2xs p-4 sm:p-6 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-[#F6F1EC]">
                            <h3 className="font-heading text-base sm:text-lg font-bold text-[#00303A]">
                              Recent Orders
                            </h3>
                            <button
                              type="button"
                              onClick={() => setActiveTab('orders')}
                              className="text-xs font-bold text-[#024F5F] hover:text-[#024F5F] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>View All</span>
                            </button>
                          </div>

                          {/* Desktop Structured Table Header */}
                          <div className="hidden sm:grid sm:grid-cols-[minmax(0,1.4fr)_9.5rem_5.5rem_5.5rem_4.5rem_3.5rem] gap-3 text-[11px] font-bold text-[#024F5F] px-3 py-2 bg-[#F6F1EC] rounded-xl border border-[#F6F1EC]">
                            <div>Product</div>
                            <div>Order ID</div>
                            <div>Date</div>
                            <div>Status</div>
                            <div>Total</div>
                            <div className="text-right">Action</div>
                          </div>

                          {/* Table Body / Rows */}
                          <div className="divide-y divide-[#F6F1EC]">
                            {orders.slice(0, 5).map((order) => (
                              <div
                                key={order.id}
                                className="py-3 first:pt-0 sm:first:pt-1 last:pb-0"
                              >
                                {/* Desktop Row */}
                                <div className="hidden sm:grid sm:grid-cols-[minmax(0,1.4fr)_9.5rem_5.5rem_5.5rem_4.5rem_3.5rem] gap-3 items-center px-3 py-1 text-xs">
                                  {/* Product Thumbnail & Title */}
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="relative w-10 h-12 rounded-md bg-[#F6F1EC] border border-[#CFAC64] overflow-hidden shrink-0">
                                      <Image
                                        src={order.productImage}
                                        alt={order.productName}
                                        fill
                                        className="object-cover object-top"
                                        sizes="40px"
                                      />
                                    </div>
                                    <h4 className="font-heading text-xs font-bold text-[#00303A] truncate leading-tight">
                                      {order.productName}
                                    </h4>
                                  </div>

                                  {/* Order ID */}
                                  <div className="text-xs font-semibold text-[#024F5F] whitespace-nowrap">
                                    {order.id}
                                  </div>

                                  {/* Date */}
                                  <div className="text-xs text-[#024F5F] whitespace-nowrap">
                                    {order.date}
                                  </div>

                                  {/* Status Badge */}
                                  <div>
                                    <span
                                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                                        order.status === 'Delivered'
                                          ? 'bg-[#F6F1EC] text-[#024F5F] border border-[#F6F1EC]'
                                          : order.status === 'Shipped'
                                          ? 'bg-[#F6F1EC] text-[#024F5F] border border-[#F6F1EC]'
                                          : 'bg-[#F6F1EC] text-[#B08F4F] border border-[#F6F1EC]'
                                      }`}
                                    >
                                      {order.status}
                                    </span>
                                  </div>

                                  {/* Total */}
                                  <div className="font-sans text-xs font-bold text-[#00303A] whitespace-nowrap">
                                    ₹{order.total.toLocaleString('en-IN')}
                                  </div>

                                  {/* Action Button */}
                                  <div className="text-right">
                  <button
                                      type="button"
                                      onClick={() => setSelectedOrder(order)}
                                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F6F1EC] hover:bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64] transition-colors cursor-pointer"
                                    >
                                      View
                                    </button>
                                  </div>
                                </div>

                                {/* Mobile Row Card */}
                                <div className="sm:hidden flex items-center justify-between gap-2.5">
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="relative w-11 h-14 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] overflow-hidden shrink-0">
                                      <Image
                                        src={order.productImage}
                                        alt={order.productName}
                                        fill
                                        className="object-cover object-top"
                                        sizes="45px"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-heading text-xs font-bold text-[#00303A] truncate">
                                        {order.productName}
                                      </h4>
                                      <p className="text-[10.5px] text-[#024F5F] truncate mt-0.5">
                                        {order.id} • {order.date}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-bold text-[#00303A]">
                                          ₹{order.total.toLocaleString('en-IN')}
                                        </span>
                                        <span
                                          className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-md ${
                                            order.status === 'Delivered'
                                              ? 'bg-[#F6F1EC] text-[#024F5F]'
                                              : order.status === 'Shipped'
                                              ? 'bg-[#F6F1EC] text-[#024F5F]'
                                              : 'bg-[#F6F1EC] text-[#B08F4F]'
                                          }`}
                                        >
                                          {order.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                  <button
                                      type="button"
                                      onClick={() => setSelectedOrder(order)}
                                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F6F1EC] hover:bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64] transition-colors cursor-pointer active:scale-95"
                                    >
                                      View
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Quick Actions Card */}
                        <div className="bg-white rounded-2xl border border-[#CFAC64] shadow-2xs p-4 sm:p-6 space-y-3.5">
                          <h3 className="font-heading text-base sm:text-lg font-bold text-[#00303A] pb-3 border-b border-[#F6F1EC]">
                            Quick Actions
                          </h3>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                            {/* Action 1: Track Order */}
                            <div
                              onClick={() => setActiveTab('orders')}
                              className="p-3 sm:p-4 rounded-xl bg-[#F6F1EC]/70 hover:bg-[#F6F1EC] border border-[#CFAC64] transition-all cursor-pointer group flex flex-col justify-between active:scale-95"
                            >
                              <div className="flex items-start justify-between">
                                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#024F5F]" />
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CFAC64] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="mt-2.5 sm:mt-3">
                                <h4 className="font-heading text-xs sm:text-sm font-bold text-[#00303A]">
                                  My Orders
                                </h4>
                                <p className="text-[10px] sm:text-[10.5px] text-[#024F5F] mt-0.5 truncate">
                                  Track &amp; manage
                                </p>
                              </div>
                            </div>

                            {/* Action 2: View Wishlist */}
                            <Link
                              href="/wishlist"
                              className="p-3 sm:p-4 rounded-xl bg-[#F6F1EC]/70 hover:bg-[#F6F1EC] border border-[#CFAC64] transition-all cursor-pointer group flex flex-col justify-between active:scale-95"
                            >
                              <div className="flex items-start justify-between">
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#024F5F]" />
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CFAC64] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="mt-2.5 sm:mt-3">
                                <h4 className="font-heading text-xs sm:text-sm font-bold text-[#00303A]">
                                  Wishlist
                                </h4>
                                <p className="text-[10px] sm:text-[10.5px] text-[#024F5F] mt-0.5 truncate">
                                  Saved items
                                </p>
                              </div>
                            </Link>

                            {/* Action 3: Manage Addresses */}
                            <div
                              onClick={() => setActiveTab('addresses')}
                              className="p-3 sm:p-4 rounded-xl bg-[#F6F1EC]/70 hover:bg-[#F6F1EC] border border-[#CFAC64] transition-all cursor-pointer group flex flex-col justify-between active:scale-95"
                            >
                              <div className="flex items-start justify-between">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#024F5F]" />
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CFAC64] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="mt-2.5 sm:mt-3">
                                <h4 className="font-heading text-xs sm:text-sm font-bold text-[#00303A]">
                                  Addresses
                                </h4>
                                <p className="text-[10px] sm:text-[10.5px] text-[#024F5F] mt-0.5 truncate">
                                  Manage shipping
                                </p>
                              </div>
                            </div>

                            {/* Action 4: Account Settings */}
                            <div
                              onClick={() => setActiveTab('settings')}
                              className="p-3 sm:p-4 rounded-xl bg-[#F6F1EC]/70 hover:bg-[#F6F1EC] border border-[#CFAC64] transition-all cursor-pointer group flex flex-col justify-between active:scale-95"
                            >
                              <div className="flex items-start justify-between">
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#024F5F]" />
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CFAC64] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="mt-2.5 sm:mt-3">
                                <h4 className="font-heading text-xs sm:text-sm font-bold text-[#00303A]">
                                  Settings
                                </h4>
                                <p className="text-[10px] sm:text-[10.5px] text-[#024F5F] mt-0.5 truncate">
                                  Profile & info
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                    
                      {/* 4. DISCOVER MORE STYLES PROMO BANNER */}
                      <div className="rounded-2xl bg-[#F6F1EC] border border-[#CFAC64] p-5 sm:p-7 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-2xs">
                        <div className="space-y-1">
                          <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#00303A]">
                            Discover More Styles
                          </h3>
                          <p className="text-xs sm:text-sm text-[#024F5F]">
                            Explore our latest collections and bespoke seasonal couture.
                          </p>
                        </div>

                        <Link
                          href="/shop"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#CFAC64] hover:bg-[#B08F4F] text-white px-6 py-3 rounded-xl font-heading text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
                        >
                          <span>Continue Shopping</span>
                        </Link>
                      </div>

                      {/* 5. FOUR TRUST & SERVICE BADGES (BOTTOM ROW) */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
                        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#CFAC64] shadow-2xs flex items-center gap-2.5 sm:gap-3">
                          <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#024F5F] shrink-0 stroke-[1.8]" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#00303A] truncate">Free Shipping</p>
                            <p className="text-[10px] text-[#024F5F] truncate">Above ₹{shipping.free_threshold.toLocaleString('en-IN')}</p>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#CFAC64] shadow-2xs flex items-center gap-2.5 sm:gap-3">
                          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#024F5F] shrink-0 stroke-[1.8]" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#00303A] truncate">100% Secure</p>
                            <p className="text-[10px] text-[#024F5F] truncate">Safe &amp; encrypted</p>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#CFAC64] shadow-2xs flex items-center gap-2.5 sm:gap-3">
                          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-[#024F5F] shrink-0 stroke-[1.8]" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#00303A] truncate">Easy Returns</p>
                            <p className="text-[10px] text-[#024F5F] truncate">7 days return</p>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#CFAC64] shadow-2xs flex items-center gap-2.5 sm:gap-3">
                          <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-[#024F5F] shrink-0 stroke-[1.8]" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#00303A] truncate">Need Help?</p>
                            <p className="text-[10px] text-[#024F5F] truncate">{supportEmail || 'Contact Support'}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                {/* ------------------------------------------------------------- */}
                {/* SUB-TAB B: FULL MY ORDERS VIEW WITH MODERN FILTERS & EMPTY STATE */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'orders' && (
                  <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
                    {/* Header & Filter Card */}
                    <div className="bg-white rounded-2xl border border-[#CFAC64] shadow-2xs p-4 sm:p-7 space-y-4 sm:space-y-5">
                      {/* Top Title & Search / Explore Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#F6F1EC]">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h2 className="font-heading text-lg sm:text-2xl md:text-3xl font-bold text-[#00303A]">
                              Order History
                            </h2>
                            <span className="text-xs font-bold bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64] px-2.5 py-0.5 rounded-full">
                              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#024F5F] mt-1">
                            Open any order to track its progress, view shipping details and download the invoice.
                          </p>
                        </div>

                        {/* Search & Shop CTA */}
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 text-[#024F5F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={orderSearchQuery}
                              onChange={(e) => setOrderSearchQuery(e.target.value)}
                              placeholder="Search by ID or product..."
                              className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                            />
                            {orderSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setOrderSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#024F5F] hover:text-[#00303A] p-0.5 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <Link
                            href="/shop"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F6F1EC] hover:bg-[#F6F1EC] text-[#024F5F] text-xs font-semibold rounded-xl border border-[#CFAC64] transition-colors shrink-0"
                          >
                            <span>Explore Catalog</span>
                          </Link>
                        </div>
                      </div>

                      {/* Status Filter Tabs (Pills with real-time counts) */}
                      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none overscroll-x-contain">
                          {ORDER_STATUS_TABS.map((tab) => {
                            const count = filterCounts[tab.id];
                            const isActive = orderFilter === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setOrderFilter(tab.id)}
                                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 active:scale-95 ${
                                  isActive
                                    ? 'bg-[#00303A] text-white shadow-xs'
                                    : 'bg-[#F6F1EC] text-[#024F5F] hover:text-[#00303A] hover:bg-[#F6F1EC] border border-[#CFAC64]'
                                }`}
                              >
                                <span>{tab.label}</span>
                                <span
                                  className={`text-[10px] sm:text-[10.5px] px-1.5 py-0.2 rounded-full font-semibold ${
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-white text-[#024F5F] border border-[#CFAC64]'
                                  }`}
                                >
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Orders List OR Empty State */}
                    {filteredOrders.length > 0 ? (
                      <div className="space-y-3 sm:space-y-4">
                        {filteredOrders.map((order) => {
                          const badge = getStatusBadge(order.status);
                          const isMultiItem = order.items && Array.isArray(order.items) && order.items.length > 1;
                          const displayImage = order.items && order.items[0]?.image ? order.items[0].image : order.productImage;
                          const displayTitle = order.productName;
                          const canCancel = ['pending', 'processing'].includes((order.status || '').toLowerCase());

                          return (
                            <div
                              key={order.id}
                              className="bg-white rounded-2xl border border-[#CFAC64] shadow-2xs hover:border-[#CFAC64] transition-all overflow-hidden"
                            >
                              {/* Order Card Top Bar */}
                              <div className="p-3.5 sm:px-6 sm:py-3.5 bg-[#F6F1EC]/60 border-b border-[#F6F1EC] flex flex-wrap items-center justify-between gap-2.5">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[#024F5F]">Order:</span>
                                    <span className="font-heading font-bold text-[#00303A]">{order.id}</span>
                                  </div>
                                  <span className="text-[#CFAC64] hidden sm:inline">•</span>
                                  <div className="flex items-center gap-1.5 text-[#024F5F]">
                                    <span>Placed on {order.date}</span>
                                  </div>
                                  <span className="text-[#CFAC64] hidden md:inline">•</span>
                                  <div className="hidden md:flex items-center gap-1.5 text-[#024F5F]">
                                    <span>{order.paymentMethod || 'Online Payment'}</span>
                                  </div>
                                </div>

                                <span
                                  className={`text-[10.5px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border inline-flex items-center gap-1.5 ${badge.bg}`}
                                >
                                  {badge.icon}
                                  <span>{badge.label}</span>
                                </span>
                              </div>

                              {/* Order Card Main Content */}
                              <div className="p-3.5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
                                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                                  <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] overflow-hidden shrink-0 shadow-xs">
                                    <Image
                                      src={displayImage || '/images/your-image-19.jpg'}
                                      alt={displayTitle}
                                      fill
                                      className="object-cover object-top"
                                      sizes="(max-width: 640px) 70px, 90px"
                                    />
                                  </div>

                                  <div className="min-w-0 space-y-1 flex-1">
                                    <h3 className="font-heading text-xs sm:text-base font-bold text-[#00303A] truncate leading-tight">
                                      {displayTitle}
                                    </h3>

                                    {order.items && order.items.length > 1 && (
                                      <p className="text-[11px] sm:text-xs text-[#024F5F] font-semibold">
                                        + {order.items.length - 1} more {order.items.length - 1 === 1 ? 'item' : 'items'} in package
                                      </p>
                                    )}

                                    <p className="text-[11px] sm:text-xs text-[#024F5F] flex items-center gap-1 pt-0.5">
                                      <MapPin className="w-3 h-3 text-[#024F5F] shrink-0" />
                                      <span className="truncate">
                                        Deliver to {order.shippingAddress?.fullName || displayName} • {order.shippingAddress?.city || 'Mumbai'}
                                      </span>
                                    </p>

                                    <div className="pt-1 flex items-center gap-2.5">
                                      <span className="font-heading text-sm sm:text-lg font-bold text-[#00303A]">
                                        ₹{order.total.toLocaleString('en-IN')}
                                      </span>
                                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#024F5F] bg-[#F6F1EC] px-2 py-0.5 rounded-full border border-[#F6F1EC]">
                                        Free Delivery
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Card Action Buttons */}
                                <div className="grid grid-cols-2 sm:flex sm:flex-row md:flex-col items-stretch justify-end gap-2 shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-[#F6F1EC]">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                  >
                                    <span>View Details</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      showToast(`📄 Downloading invoice receipt for ${order.id}...`, 'info');
                                    }}
                                    className="px-3.5 py-2 sm:px-4 sm:py-2 bg-[#F6F1EC] hover:bg-[#F6F1EC] text-[#024F5F] text-xs font-semibold rounded-xl border border-[#CFAC64] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Invoice</span>
                                  </button>

                                  {canCancel && (
                  <button
                                      type="button"
                                      onClick={() => handleCancelOrder(order.id)}
                                      className="col-span-2 sm:col-span-1 px-3 py-1.5 text-[11px] font-semibold text-[#024F5F] hover:bg-[#F6F1EC]/60 rounded-xl transition-colors cursor-pointer text-center active:scale-95"
                                    >
                                      Cancel Order
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* EMPTY STATE (EXACT USER REQUIREMENT) */
                      <div className="bg-white rounded-2xl border border-[#CFAC64] shadow-2xs p-6 sm:p-14 text-center space-y-4 animate-in fade-in duration-200">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F] shadow-xs mx-auto">
                          <ShoppingBag className="w-7 h-7 sm:w-10 sm:h-10 stroke-[1.5]" />
                        </div>
                        <div>
                          <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#00303A]">
                            {orderFilter === 'all' && !orderSearchQuery
                              ? 'No orders placed yet.'
                              : orderSearchQuery
                              ? `No orders matching "${orderSearchQuery}"`
                              : `No ${orderFilter} orders found.`}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#024F5F] mt-1.5 max-w-sm mx-auto leading-relaxed">
                            Add items to your cart and checkout to see them here.
                          </p>
                        </div>

                        <div className="pt-2">
                          <Link
                            href="/shop"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#CFAC64] hover:bg-[#B08F4F] text-white px-7 py-3 rounded-xl font-heading text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Start Shopping</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SUB-TAB C: SAVED ADDRESSES                                    */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'addresses' && (
                  <div className="bg-white rounded-2xl border border-[#CFAC64] shadow-2xs p-4 sm:p-7 md:p-8 space-y-4 sm:space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-4 border-b border-[#F6F1EC]">
                      <div>
                        <h2 className="font-heading text-lg sm:text-2xl font-bold text-[#00303A]">
                          Saved Addresses ({addresses.length})
                        </h2>
                        <p className="text-xs text-[#024F5F] mt-0.5">
                          Manage your shipping and delivery destinations.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(true)}
                        className="px-3.5 py-2 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New</span>
                      </button>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center space-y-3">
                        <div className="w-14 h-14 rounded-full bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F]">
                          <MapPin className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-heading text-base font-bold text-[#00303A]">No saved addresses</h4>
                          <p className="text-xs text-[#024F5F] max-w-xs">Add a delivery address to make checkout faster.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddAddressOpen(true)}
                          className="mt-2 px-5 py-2.5 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Your First Address</span>
                        </button>
                      </div>
                    ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-4 sm:p-5 rounded-xl border relative space-y-2.5 transition-all ${
                            addr.isDefault
                              ? 'border-[#024F5F] bg-[#F6F1EC]'
                              : 'border-[#CFAC64] bg-white hover:border-[#CFAC64]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F6F1EC] border border-[#CFAC64] text-[#024F5F]">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-[#024F5F] bg-[#024F5F]/10 px-2 py-0.5 rounded-full">
                                Default Address
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-heading text-sm font-bold text-[#00303A]">
                              {addr.name}
                            </h4>
                            <p className="text-xs text-[#024F5F] leading-relaxed mt-1">
                              {addr.address}, {addr.city}, {addr.state} – {addr.pinCode}
                            </p>
                            <p className="text-xs text-[#024F5F] font-semibold mt-1">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SUB-TAB F: ACCOUNT SETTINGS                                   */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'settings' && (
                  <div className="bg-white rounded-2xl border border-[#CFAC64] shadow-2xs p-4 sm:p-7 md:p-8 space-y-4 sm:space-y-6 animate-in fade-in duration-200">
                    <div className="pb-4 border-b border-[#F6F1EC]">
                      <h2 className="font-heading text-lg sm:text-2xl font-bold text-[#00303A]">
                        Account Profile &amp; Preferences
                      </h2>
                      <p className="text-xs text-[#024F5F] mt-0.5">
                        Update your personal credentials and contact settings.
                      </p>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsData.name}
                          onChange={(e) => setSettingsData({ ...settingsData, name: e.target.value })}
                          className="w-full text-xs sm:text-sm px-3.5 py-3 sm:py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={settingsData.email}
                            onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                            className="w-full text-xs sm:text-sm px-3.5 py-3 sm:py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={settingsData.phone}
                            onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                            className="w-full text-xs sm:text-sm px-3.5 py-3 sm:py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-3 bg-[#00303A] hover:bg-[#CFAC64] text-white font-heading text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
          ) : (
            /* ========================================================================= */
            /* VIEW 2: AUTH CARD (SIGN IN / REGISTER) FOR LOGGED OUT USERS               */
            /* ========================================================================= */
            <div className="flex items-center justify-center py-4 sm:py-10">
              <div className="w-full max-w-[500px] sm:max-w-[520px] bg-white rounded-2xl border border-[#CFAC64] shadow-[0_15px_45px_-15px_rgba(0,48,58,0.09)] p-5 sm:p-8 md:p-10 relative z-10 transition-all duration-300">
                
                {/* VIEW A: SIGN IN FORM */}
                {mode === 'signin' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="mb-5 sm:mb-6">
                      <h1 className="font-heading text-xl sm:text-3xl font-bold text-[#00303A]">
                        Sign In
                      </h1>
                      <p className="text-xs sm:text-sm text-[#024F5F] mt-1">
                        Welcome back! Please sign in to continue.
                      </p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-3.5 sm:space-y-4">
                      {/* Email */}
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#024F5F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={signInData.email}
                          onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                          placeholder="Email address"
                          className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#024F5F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showSignInPassword ? 'text' : 'password'}
                          required
                          value={signInData.password}
                          onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                          placeholder="Password"
                          className="w-full text-xs sm:text-sm pl-10 pr-11 py-3 sm:py-3.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#024F5F] hover:text-[#00303A] p-1 cursor-pointer transition-colors"
                        >
                          {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Remember Me */}
                      <div className="flex items-center pt-0.5 text-xs sm:text-[13px]">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-[#024F5F]">
                          <input
                            type="checkbox"
                            checked={signInData.rememberMe}
                            onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                            className="w-4 h-4 rounded border-[#CFAC64] text-[#024F5F] accent-[#024F5F] cursor-pointer"
                          />
                          <span>Remember me</span>
                        </label>
                      </div>

                      {/* Sign In CTA Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-[#CFAC64] hover:bg-[#CFAC64] text-white py-3 sm:py-3.5 px-6 rounded-xl font-heading text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2 text-xs font-sans font-medium">
                              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              Signing in...
                            </span>
                          ) : (
                            <>
                              <span>Sign In</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Switch to Register */}
                      <div className="text-center pt-2.5 text-xs sm:text-[13px] text-[#024F5F]">
                        <span>Don&apos;t have an account? </span>
                        <button
                          type="button"
                          onClick={() => {
                            setMode('register');
                            router.replace('/account?mode=register', { scroll: false });
                          }}
                          className="font-bold text-[#024F5F] hover:text-[#024F5F] underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Create an Account
                        </button>
                      </div>

                      {/* Terms */}
                      <p className="text-[10.5px] sm:text-xs text-[#024F5F] text-center pt-2 leading-relaxed border-t border-[#F6F1EC]/80 mt-3.5">
                        By signing in, you agree to our{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[#024F5F] hover:text-[#024F5F] underline font-medium cursor-pointer"
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[#024F5F] hover:text-[#024F5F] underline font-medium cursor-pointer"
                        >
                          Privacy Policy
                        </button>
                        .
                      </p>
                    </form>
                  </div>
                )}

                {/* VIEW B: REGISTER FORM */}
                {mode === 'register' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="mb-5 sm:mb-6">
                      <h1 className="font-heading text-xl sm:text-3xl font-bold text-[#00303A]">
                        Create Account
                      </h1>
                      <p className="text-xs sm:text-sm text-[#024F5F] mt-1">
                        Join our community and start shopping.
                      </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-[#024F5F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={registerData.fullName}
                            onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                            placeholder="Full Name"
                            className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                          />
                        </div>

                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#024F5F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            placeholder="Phone Number"
                            className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#024F5F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          placeholder="Email address"
                          className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#024F5F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="Password"
                          className="w-full text-xs sm:text-sm pl-10 pr-11 py-3 sm:py-3.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#024F5F] hover:text-[#00303A] p-1 cursor-pointer transition-colors"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#024F5F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          placeholder="Confirm Password"
                          className="w-full text-xs sm:text-sm pl-10 pr-11 py-3 sm:py-3.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#024F5F] focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#024F5F] hover:text-[#00303A] p-1 cursor-pointer transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Terms */}
                      <div className="pt-0.5">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11.5px] sm:text-[12.5px] text-[#024F5F] leading-relaxed">
                          <input
                            type="checkbox"
                            required
                            checked={registerData.agreeTerms}
                            onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                            className="mt-0.5 w-4 h-4 rounded border-[#CFAC64] text-[#024F5F] accent-[#024F5F] cursor-pointer shrink-0"
                          />
                          <span>
                            I agree to the{' '}
                            <button
                              type="button"
                              onClick={() => setShowTermsModal(true)}
                              className="text-[#024F5F] hover:text-[#024F5F] underline font-semibold cursor-pointer"
                            >
                              Terms of Service
                            </button>{' '}
                            and{' '}
                            <button
                              type="button"
                              onClick={() => setShowTermsModal(true)}
                              className="text-[#024F5F] hover:text-[#024F5F] underline font-semibold cursor-pointer"
                            >
                              Privacy Policy
                            </button>
                            .
                          </span>
                        </label>
                      </div>

                      {/* Submit */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-[#CFAC64] hover:bg-[#CFAC64] text-white py-3 sm:py-3.5 px-6 rounded-xl font-heading text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2 text-xs font-sans font-medium">
                              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              Creating Account...
                            </span>
                          ) : (
                            <>
                              <span>Create Account</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Switch to Sign In */}
                      <div className="text-center pt-2.5 text-xs sm:text-[13px] text-[#024F5F]">
                        <span>Already have an account? </span>
                        <button
                          type="button"
                          onClick={() => {
                            setMode('signin');
                            router.replace('/account?mode=signin', { scroll: false });
                          }}
                          className="font-bold text-[#024F5F] hover:text-[#024F5F] underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </main>

      {/* 3. ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-[#00303A]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full h-full sm:h-auto max-w-none sm:max-w-3xl bg-white rounded-none sm:rounded-2xl border-0 sm:border border-[#CFAC64] shadow-2xl p-4 pt-5 sm:p-8 relative sm:max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-[#024F5F] hover:text-[#00303A] rounded-full hover:bg-[#F6F1EC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3.5 border-b border-[#F6F1EC]">
              <div className="flex items-center justify-between pr-8">
                <div>
                  <span className="text-[10px] sm:text-[10.5px] font-bold text-[#024F5F] uppercase tracking-wider">
                    Order Details
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#00303A]">
                    {selectedOrder.id}
                  </h3>
                </div>
                <span
                  className={`text-[10.5px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border inline-flex items-center gap-1.5 ${
                    getStatusBadge(selectedOrder.status).bg
                  }`}
                >
                  {getStatusBadge(selectedOrder.status).icon}
                  <span>{selectedOrder.status}</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#024F5F] mt-1">
                Placed on {selectedOrder.date} • {selectedOrder.paymentMethod || 'Online Payment'}
              </p>
            </div>

            <div className="py-3.5 space-y-3.5">
              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#00303A]">Ordered Ensembles:</p>
                {selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((it: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-[#F6F1EC] border border-[#CFAC64]"
                    >
                      <div className="relative w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden bg-white shrink-0 border border-[#CFAC64]">
                        <Image
                          src={it.image || selectedOrder.productImage || '/images/your-image-19.jpg'}
                          alt={it.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-[#00303A] truncate">
                          {it.name}
                        </h4>
                        <p className="text-[10.5px] sm:text-[11px] text-[#024F5F] mt-0.5">
                          {it.size ? `Size: ${it.size}` : ''} {it.color ? `• Color: ${it.color}` : ''} • Qty: {it.qty || 1}
                        </p>
                        <p className="font-heading text-xs sm:text-sm font-bold text-[#024F5F] mt-1">
                          ₹{((it.price || selectedOrder.total) * (it.qty || 1)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F1EC] border border-[#CFAC64]">
                    <div className="relative w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden bg-white shrink-0 border border-[#CFAC64]">
                      <Image
                        src={selectedOrder.productImage}
                        alt={selectedOrder.productName}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-xs sm:text-sm font-bold text-[#00303A] truncate">
                        {selectedOrder.productName}
                      </h4>
                      <p className="text-xs text-[#024F5F] mt-0.5">
                        Quantity: {selectedOrder.itemsCount || 1}
                      </p>
                      <p className="font-heading text-xs sm:text-sm font-bold text-[#024F5F] mt-1">
                        ₹{selectedOrder.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-[#F6F1EC]/60 border border-[#CFAC64] text-xs space-y-1">
                <p className="font-bold text-[#00303A]">Shipping Address:</p>
                <p className="text-[#024F5F] font-medium">
                  {selectedOrder.shippingAddress?.fullName || displayName}
                </p>
                <p className="text-[#024F5F]">
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city},{' '}
                  {selectedOrder.shippingAddress?.state} – {selectedOrder.shippingAddress?.pinCode}
                </p>
                <p className="text-[#024F5F]">
                  Phone: {selectedOrder.shippingAddress?.phone || '+91 98765 43210'}
                </p>
              </div>

              {/* Live tracking timeline + courier details */}
              <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#CFAC64]">
                <OrderTracking order={selectedOrder} showSummary={false} />
              </div>

              {/* Price Breakdown */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-[#F6F1EC]/40 border border-[#CFAC64] text-xs space-y-1">
                <div className="flex justify-between text-[#024F5F]">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#024F5F]">
                  <span>Shipping Fee</span>
                  <span className="text-[#024F5F] font-semibold">Free Express</span>
                </div>
                <div className="flex justify-between font-bold text-[#00303A] pt-1.5 border-t border-[#CFAC64]">
                  <span>Total Amount</span>
                  <span className="font-heading text-sm">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  showToast(`📄 Downloading invoice receipt for ${selectedOrder.id}...`, 'info');
                }}
                className="w-full py-2.5 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
              >
                Download Invoice Receipt
              </button>

              {['pending', 'processing'].includes((selectedOrder.status || '').toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="w-full py-2 bg-[#F6F1EC] hover:bg-[#F6F1EC] text-[#024F5F] text-xs font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3.5 LIVE SHIPMENT TRACKING MODAL */}
      {isTrackingModalOpen && trackedOrderResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#00303A]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#CFAC64] shadow-2xl p-4 sm:p-7 relative max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setIsTrackingModalOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 text-[#024F5F] hover:text-[#00303A] rounded-full hover:bg-[#F6F1EC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pb-3.5 border-b border-[#F6F1EC]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[10.5px] font-bold text-[#024F5F] uppercase tracking-wider">
                  Live Shipment Tracking
                </span>
                <span className="w-2 h-2 rounded-full bg-[#024F5F] animate-ping" />
              </div>
              <div className="flex items-center justify-between pr-8 mt-1">
                <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#00303A]">
                  {trackedOrderResult.id}
                </h3>
                <span
                  className={`text-[10.5px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border inline-flex items-center gap-1.5 ${
                    getStatusBadge(trackedOrderResult.status).bg
                  }`}
                >
                  {getStatusBadge(trackedOrderResult.status).icon}
                  <span>{trackedOrderResult.status}</span>
                </span>
              </div>
              <p className="text-xs text-[#024F5F] mt-0.5">
                <strong className="text-[#00303A] font-heading">{trackedOrderResult.productName}</strong>
              </p>
            </div>

            <div className="pt-4">
              <OrderTracking order={trackedOrderResult} />
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-3.5 mt-2 border-t border-[#F6F1EC]">
              <Link
                href="/contact"
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#CFAC64] text-[#024F5F] hover:bg-[#F6F1EC] text-xs font-semibold text-center transition-colors active:scale-95"
              >
                Support
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsTrackingModalOpen(false);
                  showToast(`📄 Tracking slip generated for ${trackedOrderResult.id}`, 'info');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#00303A] hover:bg-[#024F5F] text-white text-xs font-bold font-heading text-center shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                Download Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD ADDRESS MODAL */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#00303A]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#CFAC64] shadow-2xl p-4.5 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddAddressOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 text-[#024F5F] hover:text-[#00303A] rounded-full hover:bg-[#F6F1EC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-base sm:text-lg font-bold text-[#00303A] pb-3 border-b border-[#F6F1EC]">
              Add New Address
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-3 pt-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#00303A] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.name}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:border-[#024F5F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00303A] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newAddressForm.phone}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:border-[#024F5F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00303A] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.address}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                  placeholder="House, street, landmark"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:border-[#024F5F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00303A] mb-1">Apartment, Suite, etc. (Optional)</label>
                <input
                  type="text"
                  value={newAddressForm.addressLine2}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, addressLine2: e.target.value })}
                  placeholder="Flat / floor / building name"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:border-[#024F5F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#00303A] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:border-[#024F5F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#00303A] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.state}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:border-[#024F5F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00303A] mb-1">PIN Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={newAddressForm.pinCode}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, pinCode: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] outline-none focus:border-[#024F5F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00303A] mb-1.5">Address Type</label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddressForm({ ...newAddressForm, type: t })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        newAddressForm.type === t
                          ? 'bg-[#024F5F] text-white border-[#024F5F]'
                          : 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64] hover:bg-[#F6F1EC]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAddressForm.setAsDefault}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, setAsDefault: e.target.checked })}
                  className="h-4 w-4 accent-[#024F5F]"
                />
                <span className="text-xs font-medium text-[#00303A]">Set as default address</span>
              </label>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="flex-1 py-2.5 px-3 border border-[#CFAC64] text-xs font-semibold text-[#024F5F] rounded-xl hover:bg-[#F6F1EC] transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors active:scale-95"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. TERMS OF SERVICE MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#00303A]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#CFAC64] shadow-2xl p-5 sm:p-8 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-3.5 right-3.5 p-1.5 text-[#024F5F] hover:text-[#00303A] rounded-full hover:bg-[#F6F1EC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3.5">
              <ShieldCheck className="w-5 h-5 text-[#024F5F]" />
              <h3 className="font-heading text-base sm:text-xl font-bold text-[#00303A]">
                Terms of Service &amp; Privacy Policy
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-[#024F5F] leading-relaxed">
              <p>
                <strong className="text-[#00303A]">1. Welcome to Al Hareer:</strong> By accessing and using our website, you agree to comply with and be bound by these terms regarding luxury heritage shopping, bespoke tailoring, and order processing.
              </p>
              <p>
                <strong className="text-[#00303A]">2. Data Privacy:</strong> We strictly protect your privacy. Your personal information, contact credentials, and delivery addresses are encrypted and never shared with unauthorized third parties.
              </p>
              <p>
                <strong className="text-[#00303A]">3. Order &amp; Delivery:</strong> Orders are verified before dispatch. Standard delivery arrives within 3–5 business days, and Express Delivery arrives in 1–2 business days.
              </p>
              <p>
                <strong className="text-[#00303A]">4. 7-Day Hassle-Free Returns:</strong> Items in original condition with intact brand tags may be returned or exchanged within 7 days of delivery.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="w-full mt-5 py-2.5 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
            >
              I Understand &amp; Agree
            </button>
          </div>
        </div>
      )}

      {/* 8. SITE FOOTER */}
      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F1EC] flex items-center justify-center text-[#024F5F] font-heading">
          Loading your royal profile...
        </div>
      }
    >
      <AuthAndDashboardContent />
    </Suspense>
  );
}
