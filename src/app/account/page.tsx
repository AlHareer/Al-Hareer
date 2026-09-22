'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
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
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useUI } from '@/context/UIContext';
import { useAuth } from '@/context/AuthContext';

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
}

// Default initial order dataset (matching the user's mockup screenshot)
const INITIAL_ORDERS: Order[] = [
  {
    id: '#BNF1001',
    productName: 'Embroidered Anarkali Suit',
    productImage: '/images/your-image-19.jpg',
    date: '12 Sep 2025',
    status: 'Delivered',
    total: 1799,
    itemsCount: 1,
    items: [
      {
        name: 'Embroidered Anarkali Suit',
        size: 'M',
        color: 'Emerald Green',
        qty: 1,
        price: 1799,
        image: '/images/your-image-19.jpg',
      },
    ],
    shippingAddress: {
      fullName: 'Sana Khan',
      phone: '+91 98765 43210',
      address: 'Flat 402, Royal Palms Residency, MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
    },
    paymentMethod: 'UPI (GPay / PhonePe)',
  },
  {
    id: '#BNF1002',
    productName: 'Chiffon Dupatta Kurta Set',
    productImage: '/images/shopby/festive.jpg',
    date: '05 Sep 2025',
    status: 'Shipped',
    total: 499,
    itemsCount: 1,
    items: [
      {
        name: 'Chiffon Dupatta Kurta Set',
        size: 'L',
        color: 'Rose Pink',
        qty: 1,
        price: 499,
        image: '/images/shopby/festive.jpg',
      },
    ],
    shippingAddress: {
      fullName: 'Sana Khan',
      phone: '+91 98765 43210',
      address: 'Flat 402, Royal Palms Residency, MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
    },
    paymentMethod: 'Credit Card (VISA)',
  },
  {
    id: '#BNF1003',
    productName: 'Pearl Drop Silk Kurta',
    productImage: '/images/shopby/wedding.jpg',
    date: '28 Aug 2025',
    status: 'Delivered',
    total: 399,
    itemsCount: 1,
    items: [
      {
        name: 'Pearl Drop Silk Kurta',
        size: 'S',
        color: 'Ivory Gold',
        qty: 1,
        price: 399,
        image: '/images/shopby/wedding.jpg',
      },
    ],
    shippingAddress: {
      fullName: 'Sana Khan',
      phone: '+91 98765 43210',
      address: 'Plot 12, Gulmohar Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400050',
    },
    paymentMethod: 'Cash on Delivery',
  },
];

const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    name: 'Sana Khan',
    phone: '+91 98765 43210',
    address: 'Flat 402, Royal Palms Residency, MG Road, Landmark: Near City Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    isDefault: true,
    type: 'Home',
  },
  {
    id: 'addr-2',
    name: 'Sana Khan (Office)',
    phone: '+91 98765 43210',
    address: 'Level 8, Tower B, Prestige Tech Park, Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400051',
    isDefault: false,
    type: 'Office',
  },
];

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
      bg: 'bg-[#EAF5EC] text-[#1E7E34] border-[#CDE5D1]',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: 'Delivered',
    };
  }
  if (s === 'shipped') {
    return {
      bg: 'bg-[#EBF3FF] text-[#1E40AF] border-[#BFDBFE]',
      icon: <Truck className="w-3.5 h-3.5" />,
      label: 'Shipped',
    };
  }
  if (s === 'processing') {
    return {
      bg: 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Processing',
    };
  }
  if (s === 'pending') {
    return {
      bg: 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: 'Pending',
    };
  }
  if (s === 'cancelled') {
    return {
      bg: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: 'Cancelled',
    };
  }
  return {
    bg: 'bg-[#FAF6F1] text-[#4A3525] border-[#E5DACD]',
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
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';
  const initialTab = searchParams.get('tab') || 'dashboard';

  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const { showToast } = useUI();
  const { user, isLoggedIn, login, logout } = useAuth();

  // Sync tab with search params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Reset tracking search & result when switching tabs
  useEffect(() => {
    setTrackOrderNumber('');
    setTrackedOrderResult(null);
    setTrackError('');
  }, [activeTab]);

  // Real-time Orders & Addresses State
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [orderFilter, setOrderFilter] = useState<OrderStatusFilter>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Load real stored orders & addresses from localStorage on mount and sync in real time
  const loadStoredData = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedOrders = localStorage.getItem('alhareer_orders');
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed)) {
            const orderMap = new Map();
            parsed.forEach((o: any) => {
              if (o && o.id) orderMap.set(o.id, o);
            });
            INITIAL_ORDERS.forEach((o: any) => {
              if (!orderMap.has(o.id)) {
                orderMap.set(o.id, o);
              }
            });
            setOrders(Array.from(orderMap.values()));
          }
        } else {
          setOrders(INITIAL_ORDERS);
        }

        const savedAddresses = localStorage.getItem('alhareer_saved_addresses');
        if (savedAddresses) {
          const parsed = JSON.parse(savedAddresses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAddresses(parsed);
          }
        }
      } catch (e) {
        console.error('Error loading localStorage account data', e);
      }
    }
  };

  useEffect(() => {
    loadStoredData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'alhareer_orders' || e.key === 'alhareer_saved_addresses') {
        loadStoredData();
      }
    };

    const handleCustomOrderUpdate = () => {
      loadStoredData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('alhareer_orders_updated', handleCustomOrderUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('alhareer_orders_updated', handleCustomOrderUpdate);
    };
  }, []);

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

  // Handle Cancel Order in real-time
  const handleCancelOrder = (orderId: string) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: 'Cancelled' } : o
    );
    setOrders(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alhareer_orders', JSON.stringify(updated));
      window.dispatchEvent(new Event('alhareer_orders_updated'));
    }
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
    name: user?.name || 'Sana Khan',
    email: user?.email || 'sana@example.com',
    phone: user?.phone || '+91 98765 43210',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setSettingsData({
        name: user.name,
        email: user.email,
        phone: user.phone || '+91 98765 43210',
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [user]);

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    name: user?.name || 'Sana Khan',
    phone: '+91 98765 43210',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    type: 'Home',
  });

  // Track Order States
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [trackedOrderResult, setTrackedOrderResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState('');
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      if (activeTab !== 'track') {
        setIsTrackingModalOpen(true);
      }
      showToast(`📦 Live tracking retrieved for order ${found.id}`, 'success');
    } else {
      // Demo preview for custom entered ID
      const demoOrder = {
        id: idToSearch.startsWith('#') ? idToSearch : `#${idToSearch}`,
        productName: 'Royal Embroidered Anarkali Ensemble',
        productImage: '/images/your-image-19.jpg',
        date: 'Today',
        status: 'Shipped',
        total: 1799,
        itemsCount: 1,
        shippingAddress: {
          fullName: displayName,
          phone: '+91 98765 43210',
          address: 'Flat 402, Royal Palms Residency, MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
        },
        paymentMethod: 'Prepaid Royal Express',
      };
      setTrackedOrderResult(demoOrder);
      setTrackError('');
      if (activeTab !== 'track') {
        setIsTrackingModalOpen(true);
      }
      showToast(`📦 Live tracking retrieved for order ${demoOrder.id}`, 'info');
    }
  };

  // Password visibility toggles
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password Modal
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Terms Modal
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Demo Credentials from .env
  const DEMO_EMAIL = (process.env.NEXT_PUBLIC_DEMO_EMAIL || 'admin@alhareer.com').trim().toLowerCase();
  const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'AlHareer@123';

  // Handle Autofill Demo
  const handleAutofillDemo = () => {
    setSignInData({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      rememberMe: true,
    });
    showToast('✨ Demo credentials autofilled from .env!', 'info');
  };

  // Handle Sign In Submit
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredEmail = signInData.email.trim().toLowerCase();
    const enteredPassword = signInData.password.trim();

    if (!enteredEmail || !enteredPassword) {
      showToast('Please enter both your email address and password', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (enteredEmail === DEMO_EMAIL && enteredPassword === DEMO_PASSWORD) {
        login({ email: enteredEmail, name: 'Sana Khan', role: 'VIP Customer' });
        showToast('🎉 Welcome back, Sana Khan! Signed in successfully.', 'success');
      } else if (enteredEmail === DEMO_EMAIL && enteredPassword !== DEMO_PASSWORD) {
        showToast('Incorrect password for demo account. Check your .env file.', 'error');
      } else {
        const generatedName = enteredEmail.split('@')[0].replace(/[._]/g, ' ');
        const capName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
        login({ email: enteredEmail, name: capName || 'Sana Khan', role: 'VIP Member' });
        showToast(`🎉 Welcome back, ${capName}! Signed in successfully.`, 'success');
      }
    }, 600);
  };

  // Handle Register Submit
  const handleRegister = (e: React.FormEvent) => {
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
    setTimeout(() => {
      setIsLoading(false);
      login({
        email: registerData.email.trim().toLowerCase(),
        name: registerData.fullName.trim(),
        phone: registerData.phone.trim(),
        role: 'VIP Member',
      });
      showToast('🎉 Account created successfully! Welcome to Al Hareer.', 'success');
    }, 700);
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast('Please enter your registered email address', 'error');
      return;
    }
    setForgotSubmitted(true);
    showToast('Password reset link sent to your email!', 'success');
    setTimeout(() => {
      setIsForgotOpen(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 2000);
  };

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsData.name.trim() || !settingsData.email.trim()) {
      showToast('Name and email cannot be empty', 'error');
      return;
    }
    login({
      name: settingsData.name.trim(),
      email: settingsData.email.trim(),
      phone: settingsData.phone.trim(),
      role: 'VIP Member',
    });
    showToast('✅ Account details updated successfully!', 'success');
  };

  // Handle Add Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.address.trim() || !newAddressForm.city.trim() || !newAddressForm.pinCode.trim()) {
      showToast('Please complete all address fields', 'error');
      return;
    }
    const newAddr = {
      id: `addr-${Date.now()}`,
      name: newAddressForm.name,
      phone: newAddressForm.phone,
      address: newAddressForm.address,
      city: newAddressForm.city,
      state: newAddressForm.state || 'Maharashtra',
      pinCode: newAddressForm.pinCode,
      isDefault: addresses.length === 0,
      type: newAddressForm.type,
    };
    const updated = [newAddr, ...addresses];
    setAddresses(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alhareer_saved_addresses', JSON.stringify(updated));
    }
    setIsAddAddressOpen(false);
    showToast('📍 New address saved successfully!', 'success');
  };

  // Handle Logout
  const handleLogout = () => {
    logout();
    showToast('👋 You have been safely logged out.', 'info');
  };

  // Display details for logged-in profile
  const displayName = user?.name || 'Sana Khan';
  const displayEmail = user?.email || 'sana@example.com';
  const userInitial = displayName.charAt(0).toUpperCase() || 'S';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between selection:bg-[#4A3525] selection:text-white pb-20 lg:pb-0">
      {/* 1. SITE NAVBAR */}
      <Navbar />

      {/* 2. MAIN BODY: DASHBOARD (IF LOGGED IN) OR AUTH CARD (IF LOGGED OUT) */}
      <main className="flex-1 py-4 sm:py-7 md:py-10">
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-10">
          
          {isLoggedIn ? (
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
                        ? 'bg-[#2B231D] text-white shadow-xs'
                        : 'bg-white text-[#7A6F66] border border-[#E8DFD5] hover:bg-[#FAF6F1]'
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
                        ? 'bg-[#2B231D] text-white shadow-xs'
                        : 'bg-white text-[#7A6F66] border border-[#E8DFD5] hover:bg-[#FAF6F1]'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Orders ({orders.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('track')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 ${
                      activeTab === 'track'
                        ? 'bg-[#2B231D] text-white shadow-xs'
                        : 'bg-white text-[#7A6F66] border border-[#E8DFD5] hover:bg-[#FAF6F1]'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('addresses')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 ${
                      activeTab === 'addresses'
                        ? 'bg-[#2B231D] text-white shadow-xs'
                        : 'bg-white text-[#7A6F66] border border-[#E8DFD5] hover:bg-[#FAF6F1]'
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
                        ? 'bg-[#2B231D] text-white shadow-xs'
                        : 'bg-white text-[#7A6F66] border border-[#E8DFD5] hover:bg-[#FAF6F1]'
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
                  <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs p-5 sm:p-6 space-y-6">
                    
                    {/* User Profile Header */}
                    <div className="flex items-center gap-3.5 pb-5 border-b border-[#F0EAE1]">
                      <div className="w-14 h-14 rounded-full bg-[#EFE8E0] text-[#4A3525] font-heading font-bold text-2xl flex items-center justify-center border border-[#DACDC0] shrink-0 shadow-xs">
                        {userInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-base sm:text-lg font-bold text-[#2B231D] truncate leading-tight">
                          {displayName}
                        </h3>
                        <p className="text-xs text-[#7A6F66] truncate mt-0.5">
                          {displayEmail}
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('settings')}
                          className="text-[11px] font-semibold text-[#8B6B52] hover:text-[#4A3525] underline underline-offset-2 mt-1 transition-colors cursor-pointer"
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
                            ? 'bg-[#EFE8E0] text-[#2B231D] shadow-2xs font-bold'
                            : 'text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#FAF6F1]'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#4A3525]" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          activeTab === 'orders'
                            ? 'bg-[#EFE8E0] text-[#2B231D] shadow-2xs font-bold'
                            : 'text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#FAF6F1]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-[#4A3525]" />
                          <span>My Orders</span>
                        </span>
                        <span className="text-[10.5px] font-bold bg-[#FAF6F1] px-2 py-0.5 rounded-full text-[#4A3525] border border-[#E5DACD]">
                          {orders.length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('track')}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          activeTab === 'track'
                            ? 'bg-[#EFE8E0] text-[#2B231D] shadow-2xs font-bold'
                            : 'text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#FAF6F1]'
                        }`}
                      >
                        <Truck className="w-4 h-4 text-[#4A3525]" />
                        <span>Track Order</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('addresses')}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          activeTab === 'addresses'
                            ? 'bg-[#EFE8E0] text-[#2B231D] shadow-2xs font-bold'
                            : 'text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#FAF6F1]'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-[#4A3525]" />
                        <span>Addresses</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          activeTab === 'settings'
                            ? 'bg-[#EFE8E0] text-[#2B231D] shadow-2xs font-bold'
                            : 'text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#FAF6F1]'
                        }`}
                      >
                        <Settings className="w-4 h-4 text-[#4A3525]" />
                        <span>Account Settings</span>
                      </button>

                      <div className="pt-2 border-t border-[#F0EAE1]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#8B2D2D] hover:bg-[#8B2D2D]/10 transition-colors cursor-pointer"
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
                      <div className="rounded-2xl bg-gradient-to-r from-[#F6EDE3] via-[#EFE6DB] to-[#E8DDD1] border border-[#E5DACD] p-5 sm:p-7 md:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden shadow-2xs">
                        {/* Left Welcome Copy */}
                        <div className="space-y-1 sm:space-y-1.5 z-10 max-w-lg">
                          <p className="text-xs sm:text-sm text-[#7A6F66] font-medium tracking-wide">
                            Welcome Back,
                          </p>
                          <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-[#2B231D] tracking-tight leading-tight">
                            {displayName}
                          </h1>
                          <p className="text-xs sm:text-sm text-[#7A6F66] pt-0.5">
                            Manage your orders, wishlist and account details.
                          </p>
                        </div>

                        {/* Right Calligraphy & Aesthetic Floral Asset */}
                        <div className="flex items-center gap-3 sm:gap-6 z-10 select-none self-end sm:self-center shrink-0">
                          <div className="flex flex-col items-end">
                            <span className="font-script text-2xl sm:text-3xl md:text-5xl text-[#5C4533] leading-none">
                              Style Lives Here
                            </span>
                            <div className="w-28 sm:w-44 h-[1.6px] bg-[#8B6B52] mt-1.5 sm:mt-2" />
                          </div>
                        </div>
                      </div>

                      {/* 2. THREE STAT SUMMARY CARDS ROW */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        {/* Card 1: Total Orders */}
                        <div
                          onClick={() => setActiveTab('orders')}
                          className="bg-white rounded-xl sm:rounded-2xl border border-[#E8DFD5] p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 shadow-2xs hover:border-[#DACDC0] transition-all cursor-pointer group text-center sm:text-left"
                        >
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525] group-hover:scale-105 transition-transform shrink-0">
                            <Package className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-lg sm:text-2xl font-bold text-[#2B231D] leading-none">
                              {orders.length}
                            </p>
                            <p className="text-[10px] sm:text-xs text-[#7A6F66] mt-1 font-medium truncate">
                              Total Orders
                            </p>
                          </div>
                        </div>

                        {/* Card 2: Saved Addresses */}
                        <div
                          onClick={() => setActiveTab('addresses')}
                          className="bg-white rounded-xl sm:rounded-2xl border border-[#E8DFD5] p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 shadow-2xs hover:border-[#DACDC0] transition-all cursor-pointer group text-center sm:text-left"
                        >
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525] group-hover:scale-105 transition-transform shrink-0">
                            <MapPin className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-lg sm:text-2xl font-bold text-[#2B231D] leading-none">
                              {addresses.length}
                            </p>
                            <p className="text-[10px] sm:text-xs text-[#7A6F66] mt-1 font-medium truncate">
                              Addresses
                            </p>
                          </div>
                        </div>

                        {/* Card 3: Member Tier */}
                        <div
                          onClick={() => setActiveTab('settings')}
                          className="bg-white rounded-xl sm:rounded-2xl border border-[#E8DFD5] p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 shadow-2xs hover:border-[#DACDC0] transition-all cursor-pointer group text-center sm:text-left"
                        >
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525] group-hover:scale-105 transition-transform shrink-0">
                            <UserIcon className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-xs sm:text-base font-bold text-[#2B231D] leading-none truncate">
                              Member
                            </p>
                            <p className="text-[9.5px] sm:text-[11px] text-[#7A6F66] mt-1 font-medium truncate">
                              Sep 2025
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 3. TWO-COLUMN SPLIT: RECENT ORDERS (LEFT) & QUICK ACTIONS (RIGHT) */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
                        
                        {/* Left: Recent Orders Table Card (Exact Screenshot Match) */}
                        <div className="lg:col-span-7 xl:col-span-7 bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs p-4 sm:p-6 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                            <h3 className="font-heading text-base sm:text-lg font-bold text-[#2B231D]">
                              Recent Orders
                            </h3>
                            <button
                              type="button"
                              onClick={() => setActiveTab('orders')}
                              className="text-xs font-bold text-[#8B6B52] hover:text-[#4A3525] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>View All</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Desktop Structured Table Header */}
                          <div className="hidden sm:grid grid-cols-12 gap-2 text-[11px] font-bold text-[#7A6F66] px-3 py-2 bg-[#FAF6F1] rounded-xl border border-[#EFE8E0]">
                            <div className="col-span-4">Product</div>
                            <div className="col-span-2">Order ID</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-1">Total</div>
                            <div className="col-span-1 text-right">Action</div>
                          </div>

                          {/* Table Body / Rows */}
                          <div className="divide-y divide-[#F0EAE1]">
                            {orders.slice(0, 3).map((order) => (
                              <div
                                key={order.id}
                                className="py-3 first:pt-0 sm:first:pt-1 last:pb-0"
                              >
                                {/* Desktop Row */}
                                <div className="hidden sm:grid grid-cols-12 gap-2 items-center px-3 py-1 text-xs">
                                  {/* Product Thumbnail & Title */}
                                  <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                                    <div className="relative w-10 h-12 rounded-md bg-[#FAF6F1] border border-[#E5DACD] overflow-hidden shrink-0">
                                      <Image
                                        src={order.productImage}
                                        alt={order.productName}
                                        fill
                                        className="object-cover object-top"
                                        sizes="40px"
                                      />
                                    </div>
                                    <h4 className="font-heading text-xs font-bold text-[#2B231D] truncate leading-tight">
                                      {order.productName}
                                    </h4>
                                  </div>

                                  {/* Order ID */}
                                  <div className="col-span-2 text-xs font-semibold text-[#7A6F66]">
                                    {order.id}
                                  </div>

                                  {/* Date */}
                                  <div className="col-span-2 text-xs text-[#7A6F66]">
                                    {order.date}
                                  </div>

                                  {/* Status Badge */}
                                  <div className="col-span-2">
                                    <span
                                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                                        order.status === 'Delivered'
                                          ? 'bg-[#EAF5EC] text-[#1E7E34] border border-[#CDE5D1]'
                                          : order.status === 'Shipped'
                                          ? 'bg-[#EBF3FF] text-[#1E40AF] border border-[#BFDBFE]'
                                          : 'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]'
                                      }`}
                                    >
                                      {order.status}
                                    </span>
                                  </div>

                                  {/* Total */}
                                  <div className="col-span-1 font-heading text-xs font-bold text-[#2B231D]">
                                    ₹{order.total.toLocaleString('en-IN')}
                                  </div>

                                  {/* Action Button */}
                                  <div className="col-span-1 text-right">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedOrder(order)}
                                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF6F1] hover:bg-[#EFE8E0] text-[#4A3525] border border-[#E5DACD] transition-colors cursor-pointer"
                                    >
                                      View
                                    </button>
                                  </div>
                                </div>

                                {/* Mobile Row Card */}
                                <div className="sm:hidden flex items-center justify-between gap-2.5">
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="relative w-11 h-14 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] overflow-hidden shrink-0">
                                      <Image
                                        src={order.productImage}
                                        alt={order.productName}
                                        fill
                                        className="object-cover object-top"
                                        sizes="45px"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-heading text-xs font-bold text-[#2B231D] truncate">
                                        {order.productName}
                                      </h4>
                                      <p className="text-[10.5px] text-[#7A6F66] truncate mt-0.5">
                                        {order.id} • {order.date}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-bold text-[#2B231D]">
                                          ₹{order.total.toLocaleString('en-IN')}
                                        </span>
                                        <span
                                          className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-md ${
                                            order.status === 'Delivered'
                                              ? 'bg-[#EAF5EC] text-[#1E7E34]'
                                              : order.status === 'Shipped'
                                              ? 'bg-[#EBF3FF] text-[#1E40AF]'
                                              : 'bg-[#FFF7ED] text-[#C2410C]'
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
                                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#FAF6F1] hover:bg-[#EFE8E0] text-[#4A3525] border border-[#E5DACD] transition-colors cursor-pointer active:scale-95"
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
                        <div className="lg:col-span-5 xl:col-span-5 bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs p-4 sm:p-6 space-y-3.5">
                          <h3 className="font-heading text-base sm:text-lg font-bold text-[#2B231D] pb-3 border-b border-[#F0EAE1]">
                            Quick Actions
                          </h3>

                          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                            {/* Action 1: Track Order */}
                            <div
                              onClick={() => setActiveTab('track')}
                              className="p-3 sm:p-4 rounded-xl bg-[#FAF6F1]/70 hover:bg-[#FAF6F1] border border-[#E5DACD] transition-all cursor-pointer group flex flex-col justify-between active:scale-95"
                            >
                              <div className="flex items-start justify-between">
                                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A3525]" />
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A89C8F] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="mt-2.5 sm:mt-3">
                                <h4 className="font-heading text-xs sm:text-sm font-bold text-[#2B231D]">
                                  Track Order
                                </h4>
                                <p className="text-[10px] sm:text-[10.5px] text-[#7A6F66] mt-0.5 truncate">
                                  Live order status
                                </p>
                              </div>
                            </div>

                            {/* Action 2: View Wishlist */}
                            <Link
                              href="/wishlist"
                              className="p-3 sm:p-4 rounded-xl bg-[#FAF6F1]/70 hover:bg-[#FAF6F1] border border-[#E5DACD] transition-all cursor-pointer group flex flex-col justify-between active:scale-95"
                            >
                              <div className="flex items-start justify-between">
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B2D2D]" />
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A89C8F] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="mt-2.5 sm:mt-3">
                                <h4 className="font-heading text-xs sm:text-sm font-bold text-[#2B231D]">
                                  Wishlist
                                </h4>
                                <p className="text-[10px] sm:text-[10.5px] text-[#7A6F66] mt-0.5 truncate">
                                  Saved items
                                </p>
                              </div>
                            </Link>

                            {/* Action 3: Manage Addresses */}
                            <div
                              onClick={() => setActiveTab('addresses')}
                              className="p-3 sm:p-4 rounded-xl bg-[#FAF6F1]/70 hover:bg-[#FAF6F1] border border-[#E5DACD] transition-all cursor-pointer group flex flex-col justify-between active:scale-95"
                            >
                              <div className="flex items-start justify-between">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A3525]" />
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A89C8F] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="mt-2.5 sm:mt-3">
                                <h4 className="font-heading text-xs sm:text-sm font-bold text-[#2B231D]">
                                  Addresses
                                </h4>
                                <p className="text-[10px] sm:text-[10.5px] text-[#7A6F66] mt-0.5 truncate">
                                  Manage shipping
                                </p>
                              </div>
                            </div>

                            {/* Action 4: Account Settings */}
                            <div
                              onClick={() => setActiveTab('settings')}
                              className="p-3 sm:p-4 rounded-xl bg-[#FAF6F1]/70 hover:bg-[#FAF6F1] border border-[#E5DACD] transition-all cursor-pointer group flex flex-col justify-between active:scale-95"
                            >
                              <div className="flex items-start justify-between">
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A3525]" />
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A89C8F] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="mt-2.5 sm:mt-3">
                                <h4 className="font-heading text-xs sm:text-sm font-bold text-[#2B231D]">
                                  Settings
                                </h4>
                                <p className="text-[10px] sm:text-[10.5px] text-[#7A6F66] mt-0.5 truncate">
                                  Profile & info
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                    
                      {/* 4. DISCOVER MORE STYLES PROMO BANNER */}
                      <div className="rounded-2xl bg-[#FAF6F1] border border-[#E8DFD5] p-5 sm:p-7 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-2xs">
                        <div className="space-y-1">
                          <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#2B231D]">
                            Discover More Styles
                          </h3>
                          <p className="text-xs sm:text-sm text-[#7A6F66]">
                            Explore our latest collections and bespoke seasonal couture.
                          </p>
                        </div>

                        <Link
                          href="/shop"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2B231D] hover:bg-[#4A3525] text-white px-6 py-3 rounded-xl font-heading text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
                        >
                          <span>Continue Shopping</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* 5. FOUR TRUST & SERVICE BADGES (BOTTOM ROW) */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
                        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#E8DFD5] shadow-2xs flex items-center gap-2.5 sm:gap-3">
                          <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A3525] shrink-0 stroke-[1.8]" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#2B231D] truncate">Free Shipping</p>
                            <p className="text-[10px] text-[#7A6F66] truncate">Above ₹999</p>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#E8DFD5] shadow-2xs flex items-center gap-2.5 sm:gap-3">
                          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A3525] shrink-0 stroke-[1.8]" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#2B231D] truncate">100% Secure</p>
                            <p className="text-[10px] text-[#7A6F66] truncate">Safe &amp; encrypted</p>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#E8DFD5] shadow-2xs flex items-center gap-2.5 sm:gap-3">
                          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A3525] shrink-0 stroke-[1.8]" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#2B231D] truncate">Easy Returns</p>
                            <p className="text-[10px] text-[#7A6F66] truncate">7 days return</p>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#E8DFD5] shadow-2xs flex items-center gap-2.5 sm:gap-3">
                          <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A3525] shrink-0 stroke-[1.8]" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#2B231D] truncate">Need Help?</p>
                            <p className="text-[10px] text-[#7A6F66] truncate">support@alhareer.com</p>
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
                    <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs p-4 sm:p-7 space-y-4 sm:space-y-5">
                      {/* Top Title & Search / Explore Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#F0EAE1]">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h2 className="font-heading text-lg sm:text-2xl md:text-3xl font-bold text-[#2B231D]">
                              Order History
                            </h2>
                            <span className="text-xs font-bold bg-[#FAF6F1] text-[#4A3525] border border-[#E5DACD] px-2.5 py-0.5 rounded-full">
                              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#7A6F66] mt-1">
                            Track, review, and manage invoices for all your bespoke Al Hareer purchases.
                          </p>
                        </div>

                        {/* Search & Shop CTA */}
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={orderSearchQuery}
                              onChange={(e) => setOrderSearchQuery(e.target.value)}
                              placeholder="Search by ID or product..."
                              className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                            />
                            {orderSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setOrderSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6F66] hover:text-[#2B231D] p-0.5 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <Link
                            href="/shop"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF6F1] hover:bg-[#EFE8E0] text-[#4A3525] text-xs font-semibold rounded-xl border border-[#E5DACD] transition-colors shrink-0"
                          >
                            <span>Explore Catalog</span>
                            <ArrowRight className="w-3.5 h-3.5" />
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
                                    ? 'bg-[#2B231D] text-white shadow-xs'
                                    : 'bg-[#FAF6F1] text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#EFE8E0] border border-[#E8DFD5]'
                                }`}
                              >
                                <span>{tab.label}</span>
                                <span
                                  className={`text-[10px] sm:text-[10.5px] px-1.5 py-0.2 rounded-full font-semibold ${
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-white text-[#4A3525] border border-[#E5DACD]'
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
                              className="bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs hover:border-[#DACDC0] transition-all overflow-hidden"
                            >
                              {/* Order Card Top Bar */}
                              <div className="p-3.5 sm:px-6 sm:py-3.5 bg-[#FAF6F1]/60 border-b border-[#F0EAE1] flex flex-wrap items-center justify-between gap-2.5">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[#7A6F66]">Order:</span>
                                    <span className="font-heading font-bold text-[#2B231D]">{order.id}</span>
                                  </div>
                                  <span className="text-[#DACDC0] hidden sm:inline">•</span>
                                  <div className="flex items-center gap-1.5 text-[#7A6F66]">
                                    <span>Placed on {order.date}</span>
                                  </div>
                                  <span className="text-[#DACDC0] hidden md:inline">•</span>
                                  <div className="hidden md:flex items-center gap-1.5 text-[#7A6F66]">
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
                                  <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] overflow-hidden shrink-0 shadow-xs">
                                    <Image
                                      src={displayImage || '/images/your-image-19.jpg'}
                                      alt={displayTitle}
                                      fill
                                      className="object-cover object-top"
                                      sizes="(max-width: 640px) 70px, 90px"
                                    />
                                  </div>

                                  <div className="min-w-0 space-y-1 flex-1">
                                    <h3 className="font-heading text-xs sm:text-base font-bold text-[#2B231D] truncate leading-tight">
                                      {displayTitle}
                                    </h3>

                                    {order.items && order.items.length > 1 && (
                                      <p className="text-[11px] sm:text-xs text-[#8B6B52] font-semibold">
                                        + {order.items.length - 1} more {order.items.length - 1 === 1 ? 'item' : 'items'} in package
                                      </p>
                                    )}

                                    <p className="text-[11px] sm:text-xs text-[#7A6F66] flex items-center gap-1 pt-0.5">
                                      <MapPin className="w-3 h-3 text-[#8B6B52] shrink-0" />
                                      <span className="truncate">
                                        Deliver to {order.shippingAddress?.fullName || displayName} • {order.shippingAddress?.city || 'Mumbai'}
                                      </span>
                                    </p>

                                    <div className="pt-1 flex items-center gap-2.5">
                                      <span className="font-heading text-sm sm:text-lg font-bold text-[#2B231D]">
                                        ₹{order.total.toLocaleString('en-IN')}
                                      </span>
                                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#1E7E34] bg-[#EAF5EC] px-2 py-0.5 rounded-full border border-[#CDE5D1]">
                                        Free Delivery
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Card Action Buttons */}
                                <div className="grid grid-cols-2 sm:flex sm:flex-row md:flex-col items-stretch justify-end gap-2 shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-[#F0EAE1]">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                  >
                                    <span>View Details</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      showToast(`📄 Downloading invoice receipt for ${order.id}...`, 'info');
                                    }}
                                    className="px-3.5 py-2 sm:px-4 sm:py-2 bg-[#FAF6F1] hover:bg-[#EFE8E0] text-[#4A3525] text-xs font-semibold rounded-xl border border-[#E5DACD] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Invoice</span>
                                  </button>

                                  {canCancel && (
                                    <button
                                      type="button"
                                      onClick={() => handleCancelOrder(order.id)}
                                      className="col-span-2 sm:col-span-1 px-3 py-1.5 text-[11px] font-semibold text-[#991B1B] hover:bg-[#FEE2E2]/60 rounded-xl transition-colors cursor-pointer text-center active:scale-95"
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
                      <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs p-6 sm:p-14 text-center space-y-4 animate-in fade-in duration-200">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#8B6B52] shadow-xs mx-auto">
                          <ShoppingBag className="w-7 h-7 sm:w-10 sm:h-10 stroke-[1.5]" />
                        </div>
                        <div>
                          <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#2B231D]">
                            {orderFilter === 'all' && !orderSearchQuery
                              ? 'No orders placed yet.'
                              : orderSearchQuery
                              ? `No orders matching "${orderSearchQuery}"`
                              : `No ${orderFilter} orders found.`}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#7A6F66] mt-1.5 max-w-sm mx-auto leading-relaxed">
                            Add items to your cart and checkout to see them here.
                          </p>
                        </div>

                        <div className="pt-2">
                          <Link
                            href="/shop"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2B231D] hover:bg-[#4A3525] text-white px-7 py-3 rounded-xl font-heading text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Start Shopping</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SUB-TAB: DEDICATED TRACK ORDER VIEW (RIGHT SIDE DISPLAY)      */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'track' && (
                  <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
                    {/* Top Header Card */}
                    <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs p-4 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="font-heading text-lg sm:text-2xl md:text-3xl font-bold text-[#2B231D]">
                            Track Your Shipment
                          </h2>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#1E7E34] animate-pulse" />
                        </div>
                        <p className="text-xs sm:text-sm text-[#7A6F66] mt-1">
                          Real-time location, live courier updates, and estimated delivery dates.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="px-3.5 py-2 bg-[#FAF6F1] hover:bg-[#EFE8E0] text-[#4A3525] text-xs font-semibold rounded-xl border border-[#E5DACD] transition-colors self-start sm:self-auto flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>All Orders ({orders.length})</span>
                      </button>
                    </div>

                    {/* HERO TRACKING BANNER (EXACT USER MOCKUP SCREENSHOT) */}
                    <div className="rounded-2xl bg-[#FAF6F1] border border-[#E8DFD5] p-5 sm:p-9 md:p-10 relative overflow-hidden shadow-2xs">
                      {/* Right Decorative Truck Art */}
                      <div className="hidden md:flex absolute -right-6 lg:right-6 top-1/2 -translate-y-1/2 items-center justify-center pointer-events-none select-none opacity-80">
                        <div className="relative w-44 h-44 lg:w-52 lg:h-52 rounded-full bg-[#F3EBE0]/80 flex items-center justify-center">
                          <div className="absolute left-7 top-1/2 -translate-y-1/2 space-y-1.5 opacity-60">
                            <div className="w-7 h-1 bg-[#D1C0AF] rounded-full" />
                            <div className="w-11 h-1 bg-[#D1C0AF] rounded-full" />
                            <div className="w-6 h-1 bg-[#D1C0AF] rounded-full" />
                          </div>
                          <div className="w-20 h-20 text-[#A68F7B] flex items-center justify-center translate-x-2">
                            <Truck className="w-16 h-16 stroke-[1.4] text-[#A68F7B]" />
                          </div>
                        </div>
                      </div>

                      <div className="max-w-2xl mx-auto text-center relative z-10">
                        {/* Top Center Isometric Box Badge */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#E5DACD] flex items-center justify-center text-[#4A3525] shadow-xs mx-auto mb-3">
                          <Package className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.7] text-[#4A3525]" />
                        </div>

                        <h2 className="font-heading text-xl sm:text-3xl md:text-4xl font-bold text-[#2B231D] tracking-tight">
                          Track Your Shipment
                        </h2>

                        <p className="text-xs sm:text-sm text-[#7A6F66] mt-1 font-medium">
                          Enter your order number to get the latest updates.
                        </p>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleTrackOrderSubmit(e);
                          }}
                          className="mt-5 sm:mt-6"
                        >
                          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-2.5 max-w-xl mx-auto">
                            <div className="relative flex-1">
                              <Search className="w-4 h-4 text-[#8C7D70] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={trackOrderNumber}
                                onChange={(e) => {
                                  setTrackOrderNumber(e.target.value);
                                  if (trackError) setTrackError('');
                                }}
                                placeholder="Enter Order # (e.g. #BNF1001)"
                                className="w-full text-xs sm:text-sm pl-10 pr-9 py-3 sm:py-3.5 rounded-xl bg-white border border-[#DACDC0] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] shadow-2xs transition-all"
                              />
                              {trackOrderNumber && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTrackOrderNumber('');
                                    setTrackedOrderResult(null);
                                    setTrackError('');
                                  }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6F66] hover:text-[#2B231D] p-1 cursor-pointer transition-colors"
                                  title="Clear input"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="submit"
                                className="flex-1 sm:flex-none bg-[#3B2B1F] hover:bg-[#2B231D] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-heading text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
                              >
                                <span>Track</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={handleRefreshTracking}
                                disabled={isRefreshing}
                                className="bg-white hover:bg-[#FAF6F1] text-[#4A3525] border border-[#DACDC0] px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl font-heading text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95 disabled:opacity-60"
                                title="Refresh and sync tracking status"
                              >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#8B6B52]' : 'text-[#4A3525]'}`} />
                                <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
                              </button>
                            </div>
                          </div>

                          {trackError && (
                            <p className="text-xs text-[#991B1B] font-semibold mt-2">
                              {trackError}
                            </p>
                          )}

                          <p className="text-[11px] sm:text-xs text-[#8C7D70] text-center mt-2.5">
                            You can find your order number in the confirmation email.
                          </p>

                          {orders.length > 0 && (
                            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-[#E8DFD5]/70">
                              <span className="text-[11px] text-[#7A6F66] font-medium mr-1">Quick Select:</span>
                              {orders.map((o) => (
                                <button
                                  key={o.id}
                                  type="button"
                                  onClick={() => {
                                    setTrackOrderNumber(o.id);
                                    setTrackedOrderResult(o);
                                    setTrackError('');
                                    showToast(`📦 Tracking loaded for ${o.id}`, 'info');
                                  }}
                                  className={`text-[10.5px] sm:text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer active:scale-95 ${
                                    trackedOrderResult?.id === o.id
                                      ? 'bg-[#2B231D] text-white border-[#2B231D]'
                                      : 'bg-white hover:bg-[#EFE8E0] text-[#4A3525] border-[#DACDC0]'
                                  }`}
                                >
                                  {o.id} ({o.status})
                                </button>
                              ))}
                            </div>
                          )}
                        </form>
                      </div>
                    </div>

                    {/* LIVE TRACKING TIMELINE CARD (RENDERED DIRECTLY ON RIGHT SIDE ONLY AFTER TRACKING) */}
                    {trackedOrderResult && (() => {
                      const activeTracking = trackedOrderResult;
                      const badge = getStatusBadge(activeTracking.status);
                      const steps = getTrackingSteps(activeTracking.status);

                      return (
                        <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs p-4 sm:p-8 space-y-5 sm:space-y-6 animate-in fade-in duration-200">
                          {/* Top Status & ID Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-[#F0EAE1]">
                            <div>
                              <div className="flex items-center gap-2.5 sm:gap-3">
                                <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#2B231D]">
                                  {activeTracking.id}
                                </h3>
                                <span
                                  className={`text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border inline-flex items-center gap-1.5 ${badge.bg}`}
                                >
                                  {badge.icon}
                                  <span>{badge.label}</span>
                                </span>
                              </div>
                              <p className="text-xs text-[#7A6F66] mt-1">
                                Placed on {activeTracking.date} • {activeTracking.paymentMethod || 'Online Payment'}
                              </p>
                            </div>

                            <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={handleRefreshTracking}
                                disabled={isRefreshing}
                                className="px-2.5 sm:px-3.5 py-2 bg-[#FAF6F1] hover:bg-[#EFE8E0] text-[#4A3525] text-xs font-semibold rounded-xl border border-[#E5DACD] transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60 active:scale-95"
                                title="Refresh live milestones"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#8B6B52]' : ''}`} />
                                <span>{isRefreshing ? 'Syncing' : 'Refresh'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  showToast(`📄 Downloading shipping slip for ${activeTracking.id}...`, 'info');
                                }}
                                className="px-2.5 sm:px-4 py-2 bg-[#FAF6F1] hover:bg-[#EFE8E0] text-[#4A3525] text-xs font-semibold rounded-xl border border-[#E5DACD] transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Slip</span>
                              </button>

                              <Link
                                href="/contact"
                                className="px-2.5 sm:px-4 py-2 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center active:scale-95"
                              >
                                Support
                              </Link>
                            </div>
                          </div>

                          {/* Shipment Meta Details Box */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-xl bg-[#FAF6F1] border border-[#E5DACD]">
                            <div>
                              <p className="text-[10.5px] sm:text-[11px] text-[#7A6F66] font-medium">Logistics Partner</p>
                              <p className="text-xs sm:text-sm font-bold text-[#2B231D] mt-0.5">
                                Royal BlueDart Air Express
                              </p>
                            </div>

                            <div>
                              <p className="text-[10.5px] sm:text-[11px] text-[#7A6F66] font-medium">Tracking Number (AWB)</p>
                              <p className="text-xs sm:text-sm font-bold text-[#4A3525] mt-0.5 font-mono">
                                BNF-EXP-88912
                              </p>
                            </div>

                            <div>
                              <p className="text-[10.5px] sm:text-[11px] text-[#7A6F66] font-medium">Current Status</p>
                              <p className="text-xs sm:text-sm font-bold text-[#1E7E34] mt-0.5">
                                {activeTracking.status === 'Delivered'
                                  ? 'Delivered Successfully'
                                  : activeTracking.status === 'Shipped'
                                  ? 'In Transit (Arriving in 24–48h)'
                                  : 'Preparing in Atelier'}
                              </p>
                            </div>
                          </div>

                          {/* Step Timeline Progress */}
                          <div className="space-y-4 pt-1 sm:pt-2">
                            <h4 className="font-heading text-xs sm:text-sm font-bold text-[#2B231D] uppercase tracking-wider">
                              Live Shipment Milestones
                            </h4>

                            <div className="relative pl-6 sm:pl-7 space-y-5 sm:space-y-7 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5DACD]">
                              {steps.map((step: any, idx: number) => (
                                <div key={idx} className="relative group">
                                  <div
                                    className={`absolute -left-6 sm:-left-7 top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                      step.isCancelled
                                        ? 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
                                        : step.completed
                                        ? 'bg-[#2B231D] border-[#2B231D] text-white shadow-xs'
                                        : step.current
                                        ? 'bg-[#4A3525] border-[#4A3525] text-white ring-3 ring-[#4A3525]/20'
                                        : 'bg-white border-[#DACDC0] text-transparent'
                                    }`}
                                  >
                                    {step.completed || step.current ? (
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    ) : null}
                                  </div>

                                  <div className="space-y-0.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-1">
                                      <h5
                                        className={`font-heading text-xs sm:text-sm font-bold ${
                                          step.isCancelled
                                            ? 'text-[#991B1B]'
                                            : step.completed || step.current
                                            ? 'text-[#2B231D]'
                                            : 'text-[#A89C8F]'
                                        }`}
                                      >
                                        {step.title}
                                      </h5>
                                      <span className="text-[10px] sm:text-[11px] font-medium text-[#7A6F66]">
                                        {step.date}
                                      </span>
                                    </div>
                                    <p
                                      className={`text-[11px] sm:text-xs leading-relaxed ${
                                        step.completed || step.current
                                          ? 'text-[#7A6F66]'
                                          : 'text-[#B8ACA0]'
                                      }`}
                                    >
                                      {step.desc}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Destination & Ordered Items Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-[#F0EAE1]">
                            {/* Destination Card */}
                            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF6F1]/60 border border-[#E8DFD5] space-y-1.5 sm:space-y-2">
                              <p className="text-xs font-bold text-[#2B231D] flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#8B6B52]" />
                                <span>Delivery Destination</span>
                              </p>
                              <div className="text-xs text-[#7A6F66] pl-5 space-y-0.5">
                                <p className="font-bold text-[#2B231D]">
                                  {activeTracking.shippingAddress?.fullName || displayName}
                                </p>
                                <p>
                                  {activeTracking.shippingAddress?.address || 'Flat 402, Royal Palms Residency'},{' '}
                                  {activeTracking.shippingAddress?.city || 'Mumbai'} –{' '}
                                  {activeTracking.shippingAddress?.pinCode || '400001'}
                                </p>
                                <p>Phone: {activeTracking.shippingAddress?.phone || '+91 98765 43210'}</p>
                              </div>
                            </div>

                            {/* Item Card */}
                            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF6F1]/60 border border-[#E8DFD5] flex items-center gap-3 sm:gap-3.5">
                              <div className="relative w-12 h-16 sm:w-14 sm:h-18 rounded-lg bg-white border border-[#E5DACD] overflow-hidden shrink-0 shadow-2xs">
                                <Image
                                  src={activeTracking.productImage || '/images/your-image-19.jpg'}
                                  alt={activeTracking.productName}
                                  fill
                                  className="object-cover object-top"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] sm:text-[10.5px] font-bold text-[#8B6B52] uppercase">
                                  Package Contents
                                </p>
                                <h5 className="font-heading text-xs sm:text-sm font-bold text-[#2B231D] truncate mt-0.5">
                                  {activeTracking.productName}
                                </h5>
                                <p className="text-xs font-bold text-[#2B231D] mt-1">
                                  ₹{activeTracking.total.toLocaleString('en-IN')} • 1 Item
                                </p>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SUB-TAB C: SAVED ADDRESSES                                    */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'addresses' && (
                  <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs p-4 sm:p-7 md:p-8 space-y-4 sm:space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
                      <div>
                        <h2 className="font-heading text-lg sm:text-2xl font-bold text-[#2B231D]">
                          Saved Addresses ({addresses.length})
                        </h2>
                        <p className="text-xs text-[#7A6F66] mt-0.5">
                          Manage your shipping and delivery destinations.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(true)}
                        className="px-3.5 py-2 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-4 sm:p-5 rounded-xl border relative space-y-2.5 transition-all ${
                            addr.isDefault
                              ? 'border-[#4A3525] bg-[#FAF6F1]'
                              : 'border-[#E8DFD5] bg-white hover:border-[#DACDC0]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF6F1] border border-[#DACDC0] text-[#4A3525]">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-[#1E7E34] bg-[#1E7E34]/10 px-2 py-0.5 rounded-full">
                                Default Address
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-heading text-sm font-bold text-[#2B231D]">
                              {addr.name}
                            </h4>
                            <p className="text-xs text-[#7A6F66] leading-relaxed mt-1">
                              {addr.address}, {addr.city}, {addr.state} – {addr.pinCode}
                            </p>
                            <p className="text-xs text-[#4A3525] font-semibold mt-1">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SUB-TAB F: ACCOUNT SETTINGS                                   */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'settings' && (
                  <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-2xs p-4 sm:p-7 md:p-8 space-y-4 sm:space-y-6 animate-in fade-in duration-200">
                    <div className="pb-4 border-b border-[#F0EAE1]">
                      <h2 className="font-heading text-lg sm:text-2xl font-bold text-[#2B231D]">
                        Account Profile &amp; Preferences
                      </h2>
                      <p className="text-xs text-[#7A6F66] mt-0.5">
                        Update your personal credentials and contact settings.
                      </p>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsData.name}
                          onChange={(e) => setSettingsData({ ...settingsData, name: e.target.value })}
                          className="w-full text-xs sm:text-sm px-3.5 py-3 sm:py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={settingsData.email}
                            onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                            className="w-full text-xs sm:text-sm px-3.5 py-3 sm:py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={settingsData.phone}
                            onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                            className="w-full text-xs sm:text-sm px-3.5 py-3 sm:py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-3 bg-[#2B231D] hover:bg-[#4A3525] text-white font-heading text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
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
              <div className="w-full max-w-[500px] sm:max-w-[520px] bg-white rounded-2xl border border-[#E8DFD5] shadow-[0_15px_45px_-15px_rgba(43,35,29,0.09)] p-5 sm:p-8 md:p-10 relative z-10 transition-all duration-300">
                
                {/* VIEW A: SIGN IN FORM */}
                {mode === 'signin' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="mb-5 sm:mb-6">
                      <div className="flex items-center justify-between">
                        <h1 className="font-heading text-xl sm:text-3xl font-bold text-[#2B231D]">
                          Sign In
                        </h1>
                        <button
                          type="button"
                          onClick={handleAutofillDemo}
                          className="text-[10.5px] sm:text-[11px] font-semibold text-[#8B6B52] bg-[#FAF6F1] hover:bg-[#EFE8E0] border border-[#E5DACD] px-2.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                          title="Click to autofill test credentials from .env"
                        >
                          <span>⚡ Demo Login</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-[#7A6F66] mt-1">
                        Welcome back! Please sign in to continue.
                      </p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-3.5 sm:space-y-4">
                      {/* Email */}
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={signInData.email}
                          onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                          placeholder="Email address"
                          className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showSignInPassword ? 'text' : 'password'}
                          required
                          value={signInData.password}
                          onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                          placeholder="Password"
                          className="w-full text-xs sm:text-sm pl-10 pr-11 py-3 sm:py-3.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6F66] hover:text-[#2B231D] p-1 cursor-pointer transition-colors"
                        >
                          {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Remember & Forgot */}
                      <div className="flex items-center justify-between pt-0.5 text-xs sm:text-[13px]">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-[#4A3525]">
                          <input
                            type="checkbox"
                            checked={signInData.rememberMe}
                            onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                            className="w-4 h-4 rounded border-[#DACDC0] text-[#4A3525] accent-[#4A3525] cursor-pointer"
                          />
                          <span>Remember me</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setIsForgotOpen(true)}
                          className="text-[#8B6B52] hover:text-[#4A3525] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {/* Sign In CTA Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-[#2B231D] hover:bg-[#4A3525] text-white py-3 sm:py-3.5 px-6 rounded-xl font-heading text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2 text-xs font-sans font-medium">
                              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              Signing in...
                            </span>
                          ) : (
                            <>
                              <span>Sign In</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Switch to Register */}
                      <div className="text-center pt-2.5 text-xs sm:text-[13px] text-[#7A6F66]">
                        <span>Don&apos;t have an account? </span>
                        <button
                          type="button"
                          onClick={() => {
                            setMode('register');
                            router.replace('/account?mode=register', { scroll: false });
                          }}
                          className="font-bold text-[#8B6B52] hover:text-[#4A3525] underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Create an Account
                        </button>
                      </div>

                      {/* Terms */}
                      <p className="text-[10.5px] sm:text-xs text-[#7A6F66] text-center pt-2 leading-relaxed border-t border-[#F0EAE1]/80 mt-3.5">
                        By signing in, you agree to our{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[#8B6B52] hover:text-[#4A3525] underline font-medium cursor-pointer"
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[#8B6B52] hover:text-[#4A3525] underline font-medium cursor-pointer"
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
                      <h1 className="font-heading text-xl sm:text-3xl font-bold text-[#2B231D]">
                        Create Account
                      </h1>
                      <p className="text-xs sm:text-sm text-[#7A6F66] mt-1">
                        Join our community and start shopping.
                      </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={registerData.fullName}
                            onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                            placeholder="Full Name"
                            className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                          />
                        </div>

                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            placeholder="Phone Number"
                            className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          placeholder="Email address"
                          className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="Password"
                          className="w-full text-xs sm:text-sm pl-10 pr-11 py-3 sm:py-3.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6F66] hover:text-[#2B231D] p-1 cursor-pointer transition-colors"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          placeholder="Confirm Password"
                          className="w-full text-xs sm:text-sm pl-10 pr-11 py-3 sm:py-3.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none ring-0 focus:ring-0 focus:border-[#4A3525] focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6F66] hover:text-[#2B231D] p-1 cursor-pointer transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Terms */}
                      <div className="pt-0.5">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11.5px] sm:text-[12.5px] text-[#4A3525] leading-relaxed">
                          <input
                            type="checkbox"
                            required
                            checked={registerData.agreeTerms}
                            onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                            className="mt-0.5 w-4 h-4 rounded border-[#DACDC0] text-[#4A3525] accent-[#4A3525] cursor-pointer shrink-0"
                          />
                          <span>
                            I agree to the{' '}
                            <button
                              type="button"
                              onClick={() => setShowTermsModal(true)}
                              className="text-[#8B6B52] hover:text-[#4A3525] underline font-semibold cursor-pointer"
                            >
                              Terms of Service
                            </button>{' '}
                            and{' '}
                            <button
                              type="button"
                              onClick={() => setShowTermsModal(true)}
                              className="text-[#8B6B52] hover:text-[#4A3525] underline font-semibold cursor-pointer"
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
                          className="w-full bg-[#2B231D] hover:bg-[#4A3525] text-white py-3 sm:py-3.5 px-6 rounded-xl font-heading text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2 text-xs font-sans font-medium">
                              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              Creating Account...
                            </span>
                          ) : (
                            <>
                              <span>Create Account</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Switch to Sign In */}
                      <div className="text-center pt-2.5 text-xs sm:text-[13px] text-[#7A6F66]">
                        <span>Already have an account? </span>
                        <button
                          type="button"
                          onClick={() => {
                            setMode('signin');
                            router.replace('/account?mode=signin', { scroll: false });
                          }}
                          className="font-bold text-[#8B6B52] hover:text-[#4A3525] underline underline-offset-2 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#2B231D]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E8DFD5] shadow-2xl p-4 sm:p-7 relative max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-[#7A6F66] hover:text-[#2B231D] rounded-full hover:bg-[#FAF6F1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3.5 border-b border-[#F0EAE1]">
              <div className="flex items-center justify-between pr-8">
                <div>
                  <span className="text-[10px] sm:text-[10.5px] font-bold text-[#8B6B52] uppercase tracking-wider">
                    Order Details
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2B231D]">
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
              <p className="text-[11px] sm:text-xs text-[#7A6F66] mt-1">
                Placed on {selectedOrder.date} • {selectedOrder.paymentMethod || 'Online Payment'}
              </p>
            </div>

            <div className="py-3.5 space-y-3.5">
              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#2B231D]">Ordered Ensembles:</p>
                {selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((it: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-[#FAF6F1] border border-[#E5DACD]"
                    >
                      <div className="relative w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden bg-white shrink-0 border border-[#E5DACD]">
                        <Image
                          src={it.image || selectedOrder.productImage || '/images/your-image-19.jpg'}
                          alt={it.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-[#2B231D] truncate">
                          {it.name}
                        </h4>
                        <p className="text-[10.5px] sm:text-[11px] text-[#7A6F66] mt-0.5">
                          {it.size ? `Size: ${it.size}` : ''} {it.color ? `• Color: ${it.color}` : ''} • Qty: {it.qty || 1}
                        </p>
                        <p className="font-heading text-xs sm:text-sm font-bold text-[#4A3525] mt-1">
                          ₹{((it.price || selectedOrder.total) * (it.qty || 1)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF6F1] border border-[#E5DACD]">
                    <div className="relative w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden bg-white shrink-0 border border-[#E5DACD]">
                      <Image
                        src={selectedOrder.productImage}
                        alt={selectedOrder.productName}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-xs sm:text-sm font-bold text-[#2B231D] truncate">
                        {selectedOrder.productName}
                      </h4>
                      <p className="text-xs text-[#7A6F66] mt-0.5">
                        Quantity: {selectedOrder.itemsCount || 1}
                      </p>
                      <p className="font-heading text-xs sm:text-sm font-bold text-[#4A3525] mt-1">
                        ₹{selectedOrder.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAF6F1]/60 border border-[#E8DFD5] text-xs space-y-1">
                <p className="font-bold text-[#2B231D]">Shipping Address:</p>
                <p className="text-[#7A6F66] font-medium">
                  {selectedOrder.shippingAddress?.fullName || displayName}
                </p>
                <p className="text-[#7A6F66]">
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city},{' '}
                  {selectedOrder.shippingAddress?.state} – {selectedOrder.shippingAddress?.pinCode}
                </p>
                <p className="text-[#7A6F66]">
                  Phone: {selectedOrder.shippingAddress?.phone || '+91 98765 43210'}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAF6F1]/40 border border-[#E8DFD5] text-xs space-y-1">
                <div className="flex justify-between text-[#7A6F66]">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#7A6F66]">
                  <span>Shipping Fee</span>
                  <span className="text-[#1E7E34] font-semibold">Free Express</span>
                </div>
                <div className="flex justify-between font-bold text-[#2B231D] pt-1.5 border-t border-[#E8DFD5]">
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
                className="w-full py-2.5 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
              >
                Download Invoice Receipt
              </button>

              {['pending', 'processing'].includes((selectedOrder.status || '').toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="w-full py-2 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] text-xs font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#2B231D]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#E8DFD5] shadow-2xl p-4 sm:p-7 relative max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setIsTrackingModalOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 text-[#7A6F66] hover:text-[#2B231D] rounded-full hover:bg-[#FAF6F1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pb-3.5 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[10.5px] font-bold text-[#8B6B52] uppercase tracking-wider">
                  Live Shipment Tracking
                </span>
                <span className="w-2 h-2 rounded-full bg-[#1E7E34] animate-ping" />
              </div>
              <div className="flex items-center justify-between pr-8 mt-1">
                <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#2B231D]">
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
              <p className="text-xs text-[#7A6F66] mt-0.5">
                Ensemble: <strong className="text-[#2B231D] font-heading">{trackedOrderResult.productName}</strong>
              </p>
            </div>

            {/* Courier & AWB Info Card */}
            <div className="my-3.5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 sm:p-3.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-xs">
              <div>
                <p className="text-[#7A6F66] text-[10.5px] sm:text-[11px]">Courier Partner</p>
                <p className="font-bold text-[#2B231D] mt-0.5 text-xs">Royal BlueDart Express</p>
              </div>
              <div>
                <p className="text-[#7A6F66] text-[10.5px] sm:text-[11px]">Tracking Number</p>
                <p className="font-bold text-[#4A3525] mt-0.5 font-mono text-xs">BNF-EXP-88912</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[#7A6F66] text-[10.5px] sm:text-[11px]">Estimated Delivery</p>
                <p className="font-bold text-[#1E7E34] mt-0.5 text-xs">Within 24–48 Hours</p>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="py-2 space-y-3.5">
              <h4 className="font-heading text-xs font-bold text-[#2B231D] uppercase tracking-wider">
                Shipment Progress
              </h4>

              <div className="relative pl-5 sm:pl-6 space-y-4 sm:space-y-6 before:absolute before:left-2 sm:before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5DACD]">
                {getTrackingSteps(trackedOrderResult.status).map((step: any, idx: number) => (
                  <div key={idx} className="relative group">
                    {/* Circle Dot on Timeline */}
                    <div
                      className={`absolute -left-5 sm:-left-6 top-0.5 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        step.isCancelled
                          ? 'bg-[#FEE2E2] border-[#991B1B] text-[#991B1B]'
                          : step.completed
                          ? 'bg-[#2B231D] border-[#2B231D] text-white shadow-xs'
                          : step.current
                          ? 'bg-[#4A3525] border-[#4A3525] text-white ring-3 ring-[#4A3525]/20'
                          : 'bg-white border-[#DACDC0] text-transparent'
                      }`}
                    >
                      {step.completed || step.current ? (
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      ) : null}
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h5
                          className={`font-heading text-xs sm:text-sm font-bold ${
                            step.isCancelled
                              ? 'text-[#991B1B]'
                              : step.completed || step.current
                              ? 'text-[#2B231D]'
                              : 'text-[#A89C8F]'
                          }`}
                        >
                          {step.title}
                        </h5>
                        <span className="text-[10px] sm:text-[11px] font-medium text-[#7A6F66]">
                          {step.date}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] sm:text-xs mt-0.5 leading-relaxed ${
                          step.completed || step.current
                            ? 'text-[#7A6F66]'
                            : 'text-[#B8ACA0]'
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Address Preview */}
            <div className="mt-3.5 p-3 rounded-xl bg-[#FAF6F1]/60 border border-[#E8DFD5] text-xs space-y-1">
              <p className="font-bold text-[#2B231D] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8B6B52]" />
                <span>Delivery Destination:</span>
              </p>
              <p className="text-[#7A6F66] pl-5 text-[11px] sm:text-xs">
                {trackedOrderResult.shippingAddress?.fullName || displayName} •{' '}
                {trackedOrderResult.shippingAddress?.address || 'Royal Palms Residency'},{' '}
                {trackedOrderResult.shippingAddress?.city || 'Mumbai'} (
                {trackedOrderResult.shippingAddress?.pinCode || '400001'})
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-3.5 mt-2 border-t border-[#F0EAE1]">
              <Link
                href="/contact"
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#DACDC0] text-[#4A3525] hover:bg-[#FAF6F1] text-xs font-semibold text-center transition-colors active:scale-95"
              >
                Support
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsTrackingModalOpen(false);
                  showToast(`📄 Tracking slip generated for ${trackedOrderResult.id}`, 'info');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#2B231D] hover:bg-[#4A3525] text-white text-xs font-bold font-heading text-center shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                Download Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD ADDRESS MODAL */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#2B231D]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8DFD5] shadow-2xl p-4.5 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddAddressOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 text-[#7A6F66] hover:text-[#2B231D] rounded-full hover:bg-[#FAF6F1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-base sm:text-lg font-bold text-[#2B231D] pb-3 border-b border-[#F0EAE1]">
              Add New Address
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-3 pt-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#2B231D] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.name}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] outline-none focus:border-[#4A3525]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B231D] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newAddressForm.phone}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] outline-none focus:border-[#4A3525]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B231D] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.address}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                  placeholder="House, street, landmark"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] outline-none focus:border-[#4A3525]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#2B231D] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] outline-none focus:border-[#4A3525]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B231D] mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddressForm.pinCode}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, pinCode: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] outline-none focus:border-[#4A3525]"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="flex-1 py-2.5 px-3 border border-[#DACDC0] text-xs font-semibold text-[#7A6F66] rounded-xl hover:bg-[#FAF6F1] transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors active:scale-95"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. FORGOT PASSWORD MODAL */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#2B231D]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8DFD5] shadow-2xl p-5 sm:p-7 relative">
            <button
              onClick={() => setIsForgotOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 text-[#7A6F66] hover:text-[#2B231D] rounded-full hover:bg-[#FAF6F1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525] mx-auto mb-2.5">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2B231D]">
                Reset Your Password
              </h3>
              <p className="text-xs text-[#7A6F66] mt-1 max-w-xs mx-auto">
                Enter your registered email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {forgotSubmitted ? (
              <div className="p-3.5 sm:p-4 bg-[#EAF5EC] border border-[#CDE5D1] rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-[#1E7E34] mx-auto" />
                <p className="text-xs font-bold text-[#1E7E34]">Reset Link Sent!</p>
                <p className="text-[11px] text-[#4A3525]">Check your email inbox for password reset instructions.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] outline-none focus:outline-none focus:border-[#4A3525] focus:bg-white transition-all"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-[#DACDC0] text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#FAF6F1] text-xs font-semibold transition-colors cursor-pointer active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#2B231D] hover:bg-[#4A3525] text-white text-xs font-bold font-heading transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. TERMS OF SERVICE MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#2B231D]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E8DFD5] shadow-2xl p-5 sm:p-8 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-3.5 right-3.5 p-1.5 text-[#7A6F66] hover:text-[#2B231D] rounded-full hover:bg-[#FAF6F1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3.5">
              <ShieldCheck className="w-5 h-5 text-[#8B6B52]" />
              <h3 className="font-heading text-base sm:text-xl font-bold text-[#2B231D]">
                Terms of Service &amp; Privacy Policy
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-[#7A6F66] leading-relaxed">
              <p>
                <strong className="text-[#2B231D]">1. Welcome to Al Hareer:</strong> By accessing and using our website, you agree to comply with and be bound by these terms regarding luxury heritage shopping, bespoke tailoring, and order processing.
              </p>
              <p>
                <strong className="text-[#2B231D]">2. Data Privacy:</strong> We strictly protect your privacy. Your personal information, contact credentials, and delivery addresses are encrypted and never shared with unauthorized third parties.
              </p>
              <p>
                <strong className="text-[#2B231D]">3. Order &amp; Delivery:</strong> Orders are verified before dispatch. Standard delivery arrives within 3–5 business days, and Express Delivery arrives in 1–2 business days.
              </p>
              <p>
                <strong className="text-[#2B231D]">4. 7-Day Hassle-Free Returns:</strong> Items in original condition with intact brand tags may be returned or exchanged within 7 days of delivery.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="w-full mt-5 py-2.5 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
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
        <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center text-[#4A3525] font-heading">
          Loading your royal profile...
        </div>
      }
    >
      <AuthAndDashboardContent />
    </Suspense>
  );
}
