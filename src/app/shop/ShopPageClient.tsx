'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  X,
  Star,
  Eye,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw as ReturnIcon,
  LayoutGrid,
  Grid3X3,
  Columns2,
  List,
  Check,
  Search,
  Home,
  Headphones,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product } from '@/types';
import type { CategoryItem } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';
import { subscribeNewsletter } from '@/actions/customerContact';
import { useShippingSettings } from '@/hooks/useShippingSettings';

export default function ShopPageClient({ products, categories }: { products: Product[]; categories: CategoryItem[] }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView, showToast } = useUI();
  const shipping = useShippingSettings();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [tempMinPrice, setTempMinPrice] = useState<string>('0');
  const [tempMaxPrice, setTempMaxPrice] = useState<string>('5000');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('Featured');
  const [viewColumns, setViewColumns] = useState<number>(4); // 4, 3, 2, or 1 (list)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterLoading, setNewsletterLoading] = useState<boolean>(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setNewsletterLoading(true);
    const result = await subscribeNewsletter(newsletterEmail);
    setNewsletterLoading(false);

    if (!result.success) {
      showToast(result.error || 'Failed to subscribe. Please try again.', 'error');
      return;
    }
    setNewsletterEmail('');
    showToast("🎉 You're subscribed! Watch your inbox for updates.", 'success');
  };

  // Synchronize filters with URL search parameters (e.g. from Navbar Mega Menu links)
  useEffect(() => {
    const syncFiltersFromUrl = (e?: any) => {
      if (typeof window === 'undefined') return;
      let searchStr = window.location.search;
      if (e?.detail?.href && e.detail.href.includes('?')) {
        searchStr = '?' + e.detail.href.split('?')[1];
      }
      const params = new URLSearchParams(searchStr);
      const categoryParam = params.get('category');
      const occasionParam = params.get('occasion');
      const fabricParam = params.get('fabric');

      if (categoryParam) {
        setSelectedCategory(categoryParam === 'all' ? 'All Products' : categoryParam);
      } else {
        setSelectedCategory('All Products');
      }

      if (occasionParam) {
        setSelectedOccasions([occasionParam]);
      } else {
        setSelectedOccasions([]);
      }

      if (fabricParam) {
        setSelectedFabrics([fabricParam]);
      } else {
        setSelectedFabrics([]);
      }

      setSelectedColor('');
      setSelectedSizes([]);
      setCurrentPage(1);
      setIsMobileFilterOpen(false);
    };

    syncFiltersFromUrl();
    window.addEventListener('popstate', syncFiltersFromUrl);
    window.addEventListener('shop-filter-sync', syncFiltersFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFiltersFromUrl);
      window.removeEventListener('shop-filter-sync', syncFiltersFromUrl);
    };
  }, []);

  // Accordion Collapse States
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    categories: true,
    price: true,
    size: true,
    color: true,
    occasion: true,
    fabric: true,
  });

  // Track user-selected preview color per product
  const [cardSelectedColors, setCardSelectedColors] = useState<{
    [productId: string]: { name: string; image: string };
  }>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Category definitions — hierarchical: parent with optional children array
  type CatEntry = { label: string; type: string; children?: { label: string; type: string }[] };
  const categoriesList = useMemo((): CatEntry[] => {
    const parents = categories.filter((c) => !c.parentId);
    const childrenOf = (id: string) => categories.filter((c) => c.parentId === id);
    const result: CatEntry[] = [{ label: 'All Products', type: 'all' }];
    for (const p of parents) {
      const kids = childrenOf(p.id).map((ch) => ({ label: ch.name, type: ch.slug }));
      result.push({ label: p.name, type: p.slug, children: kids.length > 0 ? kids : undefined });
    }
    return result;
  }, [categories]);

  // Which parent slugs are expanded in the sidebar accordion
  const [expandedParents, setExpandedParents] = useState<string[]>([]);
  const toggleParent = (type: string) =>
    setExpandedParents((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));

  // Auto-expand the parent when a child category is selected (e.g. from URL param)
  useEffect(() => {
    for (const cat of categoriesList) {
      if (cat.children?.some((ch) => ch.type === selectedCategory)) {
        setExpandedParents((prev) => (prev.includes(cat.type) ? prev : [...prev, cat.type]));
        break;
      }
    }
  }, [selectedCategory, categoriesList]);

  // Available Sizes
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  // Available Filter Colors matching screenshot
  const colorOptions = [
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Beige', hex: '#D2B48C' },
    { name: 'Green', hex: '#1E4620' },
    { name: 'Navy', hex: '#182945' },
    { name: 'Black', hex: '#111111' },
    { name: 'Maroon', hex: '#7A1C24' },
    { name: 'Blue', hex: '#3B6E96' },
  ];

  // Occasions & Fabrics
  const occasionOptions = ['Festive', 'Wedding', 'Casual', 'Formal'];
  const fabricOptions = ['Cotton', 'Silk', 'Linen', 'Blended'];

  // Handle Quick Add to Cart
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const activeColor = cardSelectedColors[product.id]?.name || product.colors[0]?.name || 'Standard';
    const activeSize = product.sizes[0] || 'M';
    addToCart(product, activeColor, activeSize, 1);
    showToast(`Added ${product.name} to Cart!`);
  };

  // Handle Color Swatch Click
  const handleColorSwatchClick = (
    productId: string,
    colorName: string,
    imageSrc: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setCardSelectedColors((prev) => ({
      ...prev,
      [productId]: { name: colorName, image: imageSrc },
    }));
  };

  // Toggle Size
  const toggleSize = (size: string) => {
    setCurrentPage(1);
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Toggle Occasion
  const toggleOccasion = (occ: string) => {
    setCurrentPage(1);
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  // Toggle Fabric
  const toggleFabric = (fab: string) => {
    setCurrentPage(1);
    setSelectedFabrics((prev) =>
      prev.includes(fab) ? prev.filter((f) => f !== fab) : [...prev, fab]
    );
  };

  // Apply Price
  const applyPriceFilter = () => {
    setCurrentPage(1);
    const min = Math.max(0, parseInt(tempMinPrice, 10) || 0);
    const max = Math.max(min, parseInt(tempMaxPrice, 10) || 5000);
    setMinPrice(min);
    setMaxPrice(max);
    showToast(`Price filtered: ₹${min} – ₹${max}`, 'info');
  };

  // Clear All Filters
  const clearAllFilters = () => {
    setSelectedCategory('All Products');
    setMinPrice(0);
    setMaxPrice(5000);
    setTempMinPrice('0');
    setTempMaxPrice('5000');
    setSelectedSizes([]);
    setSelectedColor('');
    setSelectedOccasions([]);
    setSelectedFabrics([]);
    setSortBy('Featured');
    setCurrentPage(1);
    showToast('Filters cleared', 'info');
  };

  // Active filters count for mobile indicator
  const activeFiltersCount =
    (selectedCategory !== 'All Products' ? 1 : 0) +
    (minPrice > 0 || maxPrice < 5000 ? 1 : 0) +
    selectedSizes.length +
    (selectedColor ? 1 : 0) +
    selectedOccasions.length +
    selectedFabrics.length;

  // When selectedCategory is a PARENT (e.g. "men"), match it and every child's
  // slug too (e.g. "men-saudi", "men-designer", ...) — a parent category has
  // no products of its own, only its children do.
  //
  // When selectedCategory is a STYLE (e.g. "style:omani", from a homepage
  // circle), match that style across every audience that has it — "men-omani",
  // "boys-omani", "kids-omani" — so one click shows the style everywhere it
  // exists, not just under whichever audience the homepage image came from.
  const selectedCategorySlugs = useMemo(() => {
    if (selectedCategory === 'All Products') return null;

    // Legacy style: prefix support
    const styleKey = selectedCategory.startsWith('style:')
      ? selectedCategory.slice('style:'.length)
      : null;

    // Exact match — parent or child
    const exact = categories.find((c) => c.slug === selectedCategory);
    if (exact) {
      if (!exact.parentId) {
        const children = categories.filter((c) => c.parentId === exact.id);
        return [exact.slug, ...children.map((c) => c.slug)];
      }
      return [exact.slug];
    }

    // Suffix match: "saudi" matches men-saudi, boys-saudi, kids-saudi
    const suffix = styleKey ?? selectedCategory;
    const suffixMatches = categories.filter(
      (c) => c.slug === suffix || c.slug.endsWith(`-${suffix}`)
    );
    return suffixMatches.length > 0 ? suffixMatches.map((c) => c.slug) : [selectedCategory];
  }, [selectedCategory, categories]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategorySlugs && !selectedCategorySlugs.includes(product.category)) {
        return false;
      }

      // Price filter
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => product.sizes.includes(s));
        if (!hasSize) return false;
      }

      // Color filter
      if (selectedColor) {
        const hasColor = product.colors.some((c) =>
          c.name.toLowerCase().includes(selectedColor.toLowerCase())
        );
        if (!hasColor) return false;
      }

      // Occasion filter
      if (selectedOccasions.length > 0) {
        const productOcc = (product.details?.occasion || product.category || '').toLowerCase();
        const matchesOcc = selectedOccasions.some((occ) =>
          productOcc.includes(occ.toLowerCase())
        );
        if (!matchesOcc) return false;
      }

      // Fabric filter
      if (selectedFabrics.length > 0) {
        const productFabric = (product.fabric || product.details?.material || '').toLowerCase();
        const matchesFabric = selectedFabrics.some((fab) =>
          productFabric.includes(fab.toLowerCase())
        );
        if (!matchesFabric) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Customer Rating') return b.rating - a.rating;
      if (sortBy === 'Newest Arrivals') {
        const aNew = a.tag === 'NEW' ? 1 : 0;
        const bNew = b.tag === 'NEW' ? 1 : 0;
        return bNew - aNew;
      }
      return 0; // 'Featured' retains default order
    });
  }, [
    products,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedSizes,
    selectedColor,
    selectedOccasions,
    selectedFabrics,
    sortBy,
  ]);

  // Category counts — count products per category slug
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { 'All Products': products.length };
    for (const p of products) {
      if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    // Add children counts into parent totals (keep direct products too)
    for (const cat of categoriesList) {
      if (cat.children && cat.children.length > 0) {
        const childrenTotal = cat.children.reduce((sum, ch) => sum + (counts[ch.type] ?? 0), 0);
        counts[cat.type] = (counts[cat.type] || 0) + childrenTotal;
      }
    }
    return counts;
  }, [products, categoriesList]);

  // Display label for the currently selected category
  const selectedCategoryLabel = useMemo(() => {
    if (selectedCategory === 'All Products') return 'All Products';
    if (selectedCategory.startsWith('style:')) {
      const style = selectedCategory.slice('style:'.length);
      const match = categories.find((c) => c.slug.endsWith(`-${style}`));
      return match ? match.name : style;
    }
    for (const cat of categoriesList) {
      if (cat.type === selectedCategory) return cat.label;
      const child = cat.children?.find((ch) => ch.type === selectedCategory);
      if (child) return child.label;
    }
    return selectedCategory;
  }, [selectedCategory, categoriesList, categories]);

  // Pagination calculations (8 items per page)
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  // Reset or adjust currentPage if filtered results has fewer pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const currentDisplayProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const getPaginationItems = (current: number, total: number): (number | string)[] => {
    if (total <= 4) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    // Pattern: Arrow, 1 to 3, ..., last number, Arrow
    if (current <= 3) {
      return [1, 2, 3, '...', total];
    }
    if (current >= total - 1) {
      return [1, '...', total - 2, total - 1, total];
    }
    return [1, '...', current, '...', total];
  };

  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const scrollToCatalog = () => {
    const el = document.getElementById('shop-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2B231D] selection:bg-[#4A3525] selection:text-white">
      {/* Header / Navbar */}
      <Navbar />

      {/* 1. TOP HERO BANNER (Luxury Minimalist with Arch & Olive Branch) */}
      <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#E8DFD5]">
        {/* Decorative Background Graphic: Arch Alcove & Botanical Olive Leaves */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] md:w-[48%] lg:w-[42%] pointer-events-none select-none overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/images/shop-banner-arch.jpg"
              alt="AL HAREER Shop Collection - Wear Your Story"
              fill
              priority
              className="object-cover object-right opacity-30 sm:opacity-90"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Smooth gradient blend for background transition */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/70 to-transparent sm:via-[#FAF6F0]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0]/60 to-transparent sm:hidden" />
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-12 pt-3 sm:pt-4 lg:pt-4 pb-3.5 sm:pb-5 lg:pb-5 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#7A6F66] mb-2.5 sm:mb-3.5 lg:mb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[#7A6F66] hover:text-[#2B231D] transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#7A6F66]" />
              <span>Home</span>
            </Link>
            <span className="text-[#A89C8F] font-light">&gt;</span>
            <span className="font-semibold text-[#2B231D]">Shop</span>
          </nav>

          {/* Main Banner Content */}
          <div className="relative flex items-center justify-between lg:justify-center gap-4">
            {/* Center (Desktop) / Left (Mobile): Tagline, Title & Subtitle */}
            <div className="max-w-[260px] sm:max-w-md md:max-w-lg lg:max-w-xl lg:mx-auto lg:text-center flex flex-col items-start lg:items-center">
              {/* Collection Tagline */}
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-1.5 justify-start lg:justify-center">
                <span className="w-5 sm:w-7 lg:w-8 h-[1.5px] bg-[#4A3525]"></span>
                <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#4A3525] uppercase">
                  OUR COLLECTION
                </span>
                <span className="hidden lg:inline-block w-8 h-[1.5px] bg-[#4A3525]"></span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-black text-[#1F1813] tracking-tight leading-[1.08] mb-1">
                Shop
              </h1>

              {/* Subtitle */}
              <p className="font-body text-[#7A6F66] text-xs sm:text-sm font-normal leading-snug">
                Tradition Looks Better On You
              </p>
            </div>

            {/* Right: Elegant Calligraphy "Wear Your Story" with Underline */}
            <div className="flex flex-col items-center justify-center text-center select-none shrink-0 lg:absolute lg:right-6 xl:right-12 lg:top-1/2 lg:-translate-y-1/2 sm:pr-16 md:pr-24 lg:pr-0">
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#7A6F66] leading-none tracking-wide">
                Wear
              </span>
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#7A6F66] leading-none tracking-wide mt-0.5">
                Your Story
              </span>
              <div className="w-4 sm:w-5 h-[1.5px] bg-[#9E9185] mx-auto mt-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CATALOG SECTION (Toolbar, Filters & Product Grid) */}
      <section id="shop-catalog" className="pt-4 sm:pt-6 pb-8 sm:pb-10">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Toolbar Header (Mobile & Desktop Responsive) */}
          <div className="pb-5 sm:pb-6 border-b border-[#E8DFD5] space-y-3">
            
            {/* Mobile View: Side-by-Side Modern Bar (< md) */}
            <div className="flex md:hidden items-center gap-2.5 w-full">
              {/* Left Button: Filter Drawer Trigger */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex-1 h-10 inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F7F2EB] text-[#2B231D] px-3 rounded-lg text-xs font-semibold border border-[#DACDC0] shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                aria-label="Open Filters"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#4A3525]" />
                <span>Filters</span>
                {activeFiltersCount > 0 ? (
                  <span className="bg-[#4A3525] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#8C8178]">({filteredProducts.length})</span>
                )}
              </button>

              {/* Right Button: Sort Dropdown */}
              <div className="flex-1 relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 appearance-none bg-white border border-[#DACDC0] text-[#2B231D] font-medium text-xs rounded-lg pl-3 pr-8 cursor-pointer focus:outline-none focus:border-[#4A3525] shadow-xs transition-colors"
                >
                  <option value="Featured">Sort: Featured</option>
                  <option value="Price: Low to High">Sort: Low to High</option>
                  <option value="Price: High to Low">Sort: High to Low</option>
                  <option value="Customer Rating">Sort: Rating</option>
                  <option value="Newest Arrivals">Sort: Newest</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#7A6F66] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Sub-Row: Category & Product Count (< md) */}
            <div className="flex md:hidden items-center justify-between text-[11px] text-[#7A6F66] px-0.5">
              <span>
                Category: <strong className="font-semibold text-[#2B231D]">{selectedCategoryLabel}</strong>
              </span>
              <span>
                Showing{' '}
                <strong className="font-semibold text-[#2B231D]">
                  {filteredProducts.length === 0
                    ? '0'
                    : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                        currentPage * itemsPerPage,
                        filteredProducts.length
                      )}`}
                </strong>{' '}
                of <strong className="font-semibold text-[#2B231D]">{filteredProducts.length}</strong>
              </span>
            </div>

            {/* Desktop View: Full Toolbar (>= md) */}
            <div className="hidden md:flex items-center justify-between gap-4">
              {/* Left: Category Indicator */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6F66]">
                <span className="font-medium text-[#2B231D]">{selectedCategoryLabel}</span>
                <span className="text-[#A89C8F]">•</span>
                <span>{filteredProducts.length} items</span>
              </div>

              {/* Right: Controls (Sort By + Grid View Switchers + Product Counter) */}
              <div className="flex items-center justify-end gap-5">
                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-[#7A6F66] whitespace-nowrap">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-[#DACDC0] text-[#2B231D] font-medium text-xs sm:text-sm rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:border-[#4A3525] transition-colors"
                    >
                      <option value="Featured">Featured</option>
                      <option value="Price: Low to High">Price: Low to High</option>
                      <option value="Price: High to Low">Price: High to Low</option>
                      <option value="Customer Rating">Customer Rating</option>
                      <option value="Newest Arrivals">Newest Arrivals</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#7A6F66] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Grid Column Layout Icons */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#DACDC0]">
                  {/* 4 Column */}
                  <button
                    onClick={() => setViewColumns(4)}
                    className={`p-1.5 rounded transition-colors ${
                      viewColumns === 4
                        ? 'bg-[#4A3525] text-white shadow-xs'
                        : 'text-[#7A6F66] hover:text-[#2B231D]'
                    }`}
                    title="4 Columns"
                    aria-label="4 columns view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>

                  {/* 3 Column */}
                  <button
                    onClick={() => setViewColumns(3)}
                    className={`p-1.5 rounded transition-colors ${
                      viewColumns === 3
                        ? 'bg-[#4A3525] text-white shadow-xs'
                        : 'text-[#7A6F66] hover:text-[#2B231D]'
                    }`}
                    title="3 Columns"
                    aria-label="3 columns view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>

                  {/* List View */}
                  <button
                    onClick={() => setViewColumns(1)}
                    className={`p-1.5 rounded transition-colors ${
                      viewColumns === 1
                        ? 'bg-[#4A3525] text-white shadow-xs'
                        : 'text-[#7A6F66] hover:text-[#2B231D]'
                    }`}
                    title="List View"
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Counter */}
                <span className="text-xs text-[#7A6F66] whitespace-nowrap">
                  Showing{' '}
                  <span className="font-semibold text-[#2B231D]">
                    {filteredProducts.length === 0
                      ? '0'
                      : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                          currentPage * itemsPerPage,
                          filteredProducts.length
                        )}`}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-[#2B231D]">
                    {filteredProducts.length} products
                  </span>
                </span>
              </div>
            </div>

          </div>

          {/* Catalog Layout: Sidebar Filters + Products Grid */}
          <div className="flex flex-col lg:flex-row gap-8 items-start mt-8">
            
            {/* DESKTOP SIDEBAR FILTERS (Sticky & Responsive) */}
            <aside className="hidden lg:block w-64 shrink-0 space-y-2 select-none p-4 rounded-[5px] bg-white border border-[#E8DFD5] shadow-xs sticky top-24 lg:h-[calc(100vh-110px)] overflow-y-auto no-scrollbar transition-all">
              
              {/* 1. Categories Accordion */}
              <div className="border-b border-[#E8DFD5] pb-2">
                <button
                  onClick={() => toggleSection('categories')}
                  className="w-full flex items-center justify-between text-left py-1 group cursor-pointer"
                >
                  <span className="font-heading text-lg font-bold text-[#2B231D] group-hover:text-[#4A3525] transition-colors">
                    Categories
                  </span>
                  {openSections.categories ? (
                    <ChevronUp className="w-4 h-4 text-[#7A6F66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A6F66]" />
                  )}
                </button>

                {openSections.categories && (
                  <div className="mt-3 space-y-0.5">
                    {categoriesList.map((cat) => {
                      const catKey = cat.type === 'all' ? 'All Products' : cat.type;
                      const isSelected = selectedCategory === catKey;
                      const count = categoryCounts[catKey] ?? 0;
                      const hasChildren = cat.children && cat.children.length > 0;
                      const isExpanded = expandedParents.includes(cat.type);

                      return (
                        <div key={cat.type}>
                          <div className={`flex items-center rounded-md transition-all ${isSelected ? 'bg-[#EAE2D7]' : 'hover:bg-[#F2ECE3]'}`}>
                            {/* Label — selects the category */}
                            <button
                              onClick={() => { setSelectedCategory(catKey); setCurrentPage(1); if (hasChildren && !isExpanded) toggleParent(cat.type); }}
                              className={`flex-1 flex items-center justify-between text-xs sm:text-sm py-2 pl-3 pr-1 cursor-pointer ${isSelected ? 'text-[#2B231D] font-bold' : 'text-[#5C5147]'}`}
                            >
                              <span>{cat.label}</span>
                              <span className={`text-xs ${isSelected ? 'text-[#4A3525] font-bold' : 'text-[#8C8074]'}`}>({count})</span>
                            </button>
                            {/* Chevron — only expands/collapses, doesn't change selection */}
                            {hasChildren && (
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleParent(cat.type); }}
                                className="px-2 py-2 cursor-pointer text-[#7A6F66] hover:text-[#4A3525]"
                              >
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            )}
                          </div>

                          {hasChildren && isExpanded && (
                            <div className="ml-2 mt-0.5 space-y-0.5">
                              {cat.children!.map((child) => {
                                const childSelected = selectedCategory === child.type;
                                const childCount = categoryCounts[child.type] ?? 0;
                                return (
                                  <button
                                    key={child.type}
                                    onClick={() => { setSelectedCategory(child.type); setCurrentPage(1); }}
                                    className={`w-full flex items-center justify-between text-xs sm:text-sm py-1.5 pl-6 pr-3 rounded-md transition-all cursor-pointer ${
                                      childSelected
                                        ? 'bg-[#EAE2D7] text-[#2B231D] font-bold shadow-xs'
                                        : 'text-[#5C5147] hover:bg-[#F2ECE3] hover:text-[#2B231D]'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <span className="text-[#A89C8F]">↳</span>
                                      {child.label}
                                    </span>
                                    <span className={`text-xs ${childSelected ? 'text-[#4A3525] font-bold' : 'text-[#8C8074]'}`}>({childCount})</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Price Range Accordion */}
              <div className="border-b border-[#E8DFD5] pb-2">
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between text-left py-1 group cursor-pointer"
                >
                  <span className="font-heading text-lg font-bold text-[#2B231D] group-hover:text-[#4A3525] transition-colors">
                    Price Range
                  </span>
                  {openSections.price ? (
                    <ChevronUp className="w-4 h-4 text-[#7A6F66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A6F66]" />
                  )}
                </button>

                {openSections.price && (
                  <div className="mt-3 space-y-3">
                    {/* Inputs Row */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#7A6F66]">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={tempMinPrice}
                          onChange={(e) => setTempMinPrice(e.target.value)}
                          className="w-full bg-white border border-[#DACDC0] rounded-md pl-6 pr-2 py-1.5 text-xs text-[#2B231D] font-medium focus:outline-none focus:border-[#4A3525]"
                          placeholder="0"
                        />
                      </div>
                      <span className="text-[#7A6F66] text-xs font-bold">-</span>
                      <div className="flex-1 relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#7A6F66]">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={tempMaxPrice}
                          onChange={(e) => setTempMaxPrice(e.target.value)}
                          className="w-full bg-white border border-[#DACDC0] rounded-md pl-6 pr-2 py-1.5 text-xs text-[#2B231D] font-medium focus:outline-none focus:border-[#4A3525]"
                          placeholder="5000"
                        />
                      </div>
                    </div>

                    {/* Range Slider Track */}
                    <div className="pt-1">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={tempMaxPrice}
                        onChange={(e) => setTempMaxPrice(e.target.value)}
                        className="w-full accent-[#4A3525] cursor-pointer"
                      />
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={applyPriceFilter}
                      className="w-full bg-[#4A3525] hover:bg-[#36261A] text-white py-2 rounded-md text-xs font-semibold tracking-wide transition-all shadow-xs active:scale-98 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Size Accordion */}
              <div className="border-b border-[#E8DFD5] pb-2">
                <button
                  onClick={() => toggleSection('size')}
                  className="w-full flex items-center justify-between text-left py-1 group cursor-pointer"
                >
                  <span className="font-heading text-lg font-bold text-[#2B231D] group-hover:text-[#4A3525] transition-colors">
                    Size
                  </span>
                  {openSections.size ? (
                    <ChevronUp className="w-4 h-4 text-[#7A6F66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A6F66]" />
                  )}
                </button>

                {openSections.size && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {sizeOptions.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`min-w-[38px] h-9 px-2 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#4A3525] text-white border-[#4A3525] shadow-xs'
                              : 'bg-white text-[#2B231D] border-[#DACDC0] hover:border-[#4A3525]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Color Swatches Section */}
              <div className="border-b border-[#E8DFD5] pb-2">
                <button
                  onClick={() => toggleSection('color')}
                  className="w-full flex items-center justify-between text-left py-1 group cursor-pointer"
                >
                  <span className="font-heading text-lg font-bold text-[#2B231D] group-hover:text-[#4A3525] transition-colors">
                    Color
                  </span>
                  {openSections.color ? (
                    <ChevronUp className="w-4 h-4 text-[#7A6F66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A6F66]" />
                  )}
                </button>

                {openSections.color && (
                  <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                    {colorOptions.map((col) => {
                      const isSelected = selectedColor === col.name;
                      return (
                        <button
                          key={col.name}
                          onClick={() => {
                            setSelectedColor(isSelected ? '' : col.name);
                            setCurrentPage(1);
                          }}
                          className={`w-7 h-7 rounded-full transition-all relative flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-[#4A3525] scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: col.hex,
                            border: col.border ? '1px solid #D5C8B8' : 'none',
                          }}
                          title={col.name}
                          aria-label={`Filter by ${col.name}`}
                        >
                          {isSelected && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                col.name === 'White' ? 'text-black' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5. Occasion Checkboxes */}
              <div className="border-b border-[#E8DFD5] pb-2">
                <button
                  onClick={() => toggleSection('occasion')}
                  className="w-full flex items-center justify-between text-left py-1 group cursor-pointer"
                >
                  <span className="font-heading text-lg font-bold text-[#2B231D] group-hover:text-[#4A3525] transition-colors">
                    Occasion
                  </span>
                  {openSections.occasion ? (
                    <ChevronUp className="w-4 h-4 text-[#7A6F66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A6F66]" />
                  )}
                </button>

                {openSections.occasion && (
                  <div className="mt-3 space-y-2">
                    {occasionOptions.map((occ) => {
                      const isChecked = selectedOccasions.includes(occ);
                      return (
                        <label
                          key={occ}
                          className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4A3525] cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleOccasion(occ)}
                            className="w-4 h-4 rounded border-[#DACDC0] text-[#4A3525] focus:ring-0 focus:ring-offset-0 accent-[#4A3525] cursor-pointer"
                          />
                          <span className="group-hover:text-[#2B231D] font-normal">{occ}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 6. Fabric Checkboxes */}
              <div className="border-b border-[#E8DFD5] pb-2">
                <button
                  onClick={() => toggleSection('fabric')}
                  className="w-full flex items-center justify-between text-left py-1 group cursor-pointer"
                >
                  <span className="font-heading text-lg font-bold text-[#2B231D] group-hover:text-[#4A3525] transition-colors">
                    Fabric
                  </span>
                  {openSections.fabric ? (
                    <ChevronUp className="w-4 h-4 text-[#7A6F66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A6F66]" />
                  )}
                </button>

                {openSections.fabric && (
                  <div className="mt-3 space-y-2">
                    {fabricOptions.map((fab) => {
                      const isChecked = selectedFabrics.includes(fab);
                      return (
                        <label
                          key={fab}
                          className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4A3525] cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFabric(fab)}
                            className="w-4 h-4 rounded border-[#DACDC0] text-[#4A3525] focus:ring-0 focus:ring-offset-0 accent-[#4A3525] cursor-pointer"
                          />
                          <span className="group-hover:text-[#2B231D] font-normal">{fab}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearAllFilters}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold text-[#7A6F66] hover:text-[#4A3525] hover:bg-[#EFE8E0] rounded-md transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>

            </aside>

            {/* PRODUCT CATALOG GRID */}
            <main className="flex-1 w-full">
              {filteredProducts.length === 0 ? (
                /* Empty state when no products match */
                <div className="bg-white rounded-xl border border-[#E8DFD5] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#7A6F66]">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#2B231D]">
                    No Products Found
                  </h3>
                  <p className="text-sm text-[#7A6F66] max-w-md mx-auto">
                    We couldn&apos;t find any items matching your selected criteria. Try adjusting
                    or resetting your filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 bg-[#4A3525] text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#36261A] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-3 sm:gap-4 md:gap-6 ${
                    viewColumns === 4
                      ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                      : viewColumns === 3
                      ? 'grid-cols-2 md:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {currentDisplayProducts.map((product) => {
                    const currentSelectedColor =
                      cardSelectedColors[product.id]?.name || product.colors[0]?.name;
                    const currentImage =
                      cardSelectedColors[product.id]?.image || product.image;
                    const isWishlisted = isInWishlist(product.id);

                    // List view layout
                    if (viewColumns === 1) {
                      return (
                        <div
                          key={product.id}
                          className="group bg-white rounded-xl border border-[#E8DFD5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center p-4 sm:p-5 gap-5"
                        >
                          <div className="relative w-full sm:w-52 aspect-[3/3.8] rounded-[5px] overflow-hidden bg-[#FAF6F0] shrink-0">
                            <Link href={`/product/${product.id}`} className="block w-full h-full">
                              <Image
                                src={currentImage}
                                alt={product.name}
                                fill
                                sizes="240px"
                                className="object-cover object-top group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                              />
                            </Link>

                            {product.tag && (
                              <span
                                className={`absolute top-2.5 left-2.5 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-[4px] shadow-xs uppercase tracking-wider ${
                                  product.tag === '20% OFF'
                                    ? 'bg-[#8B2D2D]'
                                    : product.tag === 'NEW'
                                    ? 'bg-[#2E5A44]'
                                    : 'bg-[#2B231D]'
                                }`}
                              >
                                {product.tag}
                              </span>
                            )}

                            {/* Wishlist Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product);
                              }}
                              className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md z-10 cursor-pointer ${
                                isWishlisted
                                  ? 'bg-white text-[#8B2D2D]'
                                  : 'bg-white/95 text-[#2B231D] hover:text-[#8B2D2D] hover:bg-white'
                              }`}
                              aria-label="Toggle Wishlist"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  isWishlisted ? 'fill-[#8B2D2D] text-[#8B2D2D]' : 'stroke-[1.8]'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex-1 w-full flex flex-col justify-between space-y-3">
                            <div>
                              {product.reviewCount > 0 && (
                              <div className="flex items-center gap-1.5 text-amber-500 text-xs mb-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(product.rating)
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-amber-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] text-[#7A6F66]">
                                  ({product.reviewCount})
                                </span>
                              </div>
                              )}

                              <Link
                                href={`/product/${product.id}`}
                                className="font-heading text-lg sm:text-xl font-bold text-[#2B231D] hover:text-[#4A3525] transition-colors"
                              >
                                {product.name}
                              </Link>
                              <p className="text-xs text-[#7A6F66] mt-0.5">{product.fabric}</p>
                              <p className="text-xs text-[#5C5147] mt-2 line-clamp-2 leading-relaxed">
                                {product.description}
                              </p>

                              {/* Interactive Color Options in List View */}
                              <div className="mt-3 flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-[#4A3525]">Colors:</span>
                                <div className="flex items-center gap-1.5">
                                  {product.colors.map((c) => (
                                    <button
                                      key={c.name}
                                      onClick={(e) =>
                                        handleColorSwatchClick(
                                          product.id,
                                          c.name,
                                          c.image || product.image,
                                          e
                                        )
                                      }
                                      className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                                        currentSelectedColor === c.name
                                          ? 'ring-2 ring-[#4A3525] scale-110'
                                          : 'hover:scale-110'
                                      }`}
                                      style={{
                                        backgroundColor: c.hex,
                                        borderColor: c.hex === '#FFFFFF' ? '#D5C8B8' : 'transparent',
                                      }}
                                      title={c.name}
                                      aria-label={`Select ${c.name} color`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] text-[#7A6F66] font-medium ml-1">
                                  ({currentSelectedColor})
                                </span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between gap-3">
                              <div className="flex items-baseline gap-2">
                                <span className="font-heading text-xl font-bold text-[#2B231D]">
                                  ₹{product.price}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-xs text-[#8C8074] line-through">
                                    ₹{product.originalPrice}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openQuickView(product)}
                                  className="px-3.5 py-2 border border-[#DACDC0] hover:bg-[#FAF6F0] text-xs font-semibold rounded-[5px] transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <Eye className="w-3.5 h-3.5 text-[#4A3525]" />
                                  <span>Quick View</span>
                                </button>
                                <button
                                  onClick={(e) => handleQuickAdd(product, e)}
                                  className="bg-[#4A3525] hover:bg-[#36261A] text-white px-4 py-2 text-xs font-semibold rounded-[5px] shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Add to Bag</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Standard Grid View Card (Matches Featured Collection layout)
                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col bg-white rounded-[5px] overflow-hidden border border-cream-300 shadow-sm hover:shadow-luxury-hover transition-all duration-500"
                      >
                        {/* Product Image Frame */}
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

                          {/* Tag Badge (Top-Left) */}
                          {product.tag && (
                            <span
                              className={`absolute top-1 left-0.5 sm:top-1 sm:-left-0.5 text-white text-[7.5px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[3px] shadow uppercase tracking-wider z-10 pointer-events-none ${
                                product.tag === '20% OFF'
                                  ? 'bg-[#8B2D2D]'
                                  : product.tag === 'NEW'
                                  ? 'bg-[#2E5A44]'
                                  : 'bg-brand-500'
                              }`}
                            >
                              {product.tag}
                            </span>
                          )}

                          {/* Wishlist Heart Button (Top-Right) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product);
                            }}
                            className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10 cursor-pointer ${
                              isWishlisted
                                ? 'bg-white text-red-500 fill-red-500'
                                : 'bg-white/90 text-brand-700 hover:text-red-500 hover:bg-white'
                            }`}
                            aria-label="Toggle Wishlist"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                isWishlisted ? 'fill-red-500 text-red-500' : 'stroke-[1.8]'
                              }`}
                            />
                          </button>

                          {/* Always Active Quick View & Add to Cart Buttons */}
                          <div className="absolute inset-x-2 sm:inset-x-2.5 bottom-2 sm:bottom-2.5 flex items-center gap-1.5 sm:gap-2 z-10">
                            {/* Quick View Button */}
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

                            {/* Bag Button */}
                            <button
                              onClick={(e) => handleQuickAdd(product, e)}
                              className="bg-brand-500 hover:bg-brand-600 active:scale-95 text-white p-1.5 sm:p-2 rounded-[4px] shadow-md transition-all flex items-center justify-center cursor-pointer"
                              title="Add to Cart"
                              aria-label="Add to Cart"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Product Info Block */}
                        <div className="p-3 sm:p-4 lg:p-4 flex-1 flex flex-col justify-between space-y-2 lg:space-y-2.5">
                          <div>
                            {/* Star Rating & Review Count */}
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

                            {/* Product Title */}
                            <Link
                              href={`/product/${product.id}`}
                              className="font-heading text-sm sm:text-base md:text-lg font-bold text-brand-700 line-clamp-1 hover:text-brand-500 transition-colors block"
                            >
                              {product.name}
                            </Link>

                            {/* Fabric Subtitle */}
                            <p className="text-[11px] sm:text-xs text-muted mt-0.5 line-clamp-1">
                              {product.fabric}
                            </p>
                          </div>

                          {/* Price & Color Swatches Row */}
                          <div className="pt-2 border-t border-cream-200 flex items-center justify-between gap-1">
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
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              {product.colors.map((c) => (
                                <button
                                  key={c.name}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleColorSwatchClick(
                                      product.id,
                                      c.name,
                                      c.image || product.image,
                                      e
                                    );
                                  }}
                                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all cursor-pointer ${
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
              )}

              {/* 3. MODERN LUXURY PAGINATION BAR (Arrow -> 1 to 3 -> ... -> Number -> Arrow) */}
              {totalPages > 1 && (
                <nav
                  aria-label="Product catalog pagination"
                  className="mt-12 sm:mt-16 flex flex-col items-center justify-center gap-3 select-none"
                >
                  <div className="inline-flex items-center justify-center gap-2 sm:gap-4 p-1.5 sm:p-2 bg-white/95 backdrop-blur-md rounded-[5px] border border-[#E2D7C8] shadow-sm">
                    {/* Previous Page Arrow */}
                    <button
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage((p) => p - 1);
                          scrollToCatalog();
                        }
                      }}
                      disabled={currentPage <= 1}
                      className="group w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#DACDC0] bg-white text-[#2B231D] hover:bg-[#FAF6F0] hover:border-[#4A3525] hover:text-[#4A3525] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#DACDC0] disabled:active:scale-100 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs shrink-0"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.2] transition-transform group-hover:-translate-x-0.5" />
                    </button>

                    {/* Number Buttons & Ellipsis */}
                    {paginationItems.map((item, index) => {
                      if (typeof item === 'string') {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold text-[#8C8074] tracking-widest select-none shrink-0"
                          >
                            ...
                          </span>
                        );
                      }

                      const isCurrent = currentPage === item;
                      return (
                        <button
                          key={`page-${item}`}
                          onClick={() => {
                            setCurrentPage(item);
                            scrollToCatalog();
                          }}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-[#3E2B1E] text-white shadow-sm font-bold scale-105 border border-[#3E2B1E]'
                              : 'bg-transparent text-[#4A3525] hover:bg-[#F2ECE3] hover:text-[#2B231D] active:scale-95'
                          }`}
                          aria-current={isCurrent ? 'page' : undefined}
                          aria-label={`Page ${item}`}
                        >
                          {item}
                        </button>
                      );
                    })}

                    {/* Next Page Arrow */}
                    <button
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage((p) => p + 1);
                          scrollToCatalog();
                        }
                      }}
                      disabled={currentPage >= totalPages}
                      className="group w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#DACDC0] bg-white text-[#2B231D] hover:bg-[#FAF6F0] hover:border-[#4A3525] hover:text-[#4A3525] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#DACDC0] disabled:active:scale-100 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs shrink-0"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.2] transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  {/* Micro Page Counter */}
                  <p className="text-[11px] sm:text-xs text-[#7A6F66] font-medium tracking-wide">
                    Page <span className="font-bold text-[#2B231D]">{currentPage}</span> of{' '}
                    <span className="font-bold text-[#2B231D]">{totalPages}</span>
                  </p>
                </nav>
              )}
            </main>

          </div>
        </div>
      </section>

      {/* 2.5 SHOP BOTTOM TRUST & NEWSLETTER SECTION (MATCHING EXACT USER SCREENSHOT) */}
      <section className="pb-14 sm:pb-16 md:pb-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-5 sm:space-y-6 md:space-y-8">
          
          {/* A. TRUST & FEATURE BADGES CARD (EXACT USER SCREENSHOT) */}
          <div className="bg-[#FAF6F1] rounded-2xl sm:rounded-3xl border border-[#E8DFD5] p-6 sm:p-8 md:p-9 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8 items-center">
              
              {/* Feature 1: Free Shipping */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="text-[#3B2B1F] shrink-0">
                  <Truck className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.4]" />
                </div>
                <div>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-[#2B231D]">
                    Free Shipping
                  </h4>
                  <p className="text-xs text-[#7A6F66] mt-0.5 font-medium">
                    on orders above ₹{shipping.free_threshold.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Feature 2: Easy Returns */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="text-[#3B2B1F] shrink-0">
                  <RotateCcw className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.4]" />
                </div>
                <div>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-[#2B231D]">
                    Easy Returns
                  </h4>
                  <p className="text-xs text-[#7A6F66] mt-0.5 font-medium">
                    7-day hassle free
                  </p>
                </div>
              </div>

              {/* Feature 3: Secure Payments */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="text-[#3B2B1F] shrink-0">
                  <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.4]" />
                </div>
                <div>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-[#2B231D]">
                    Secure Payments
                  </h4>
                  <p className="text-xs text-[#7A6F66] mt-0.5 font-medium">
                    100% safe &amp; encrypted
                  </p>
                </div>
              </div>

              {/* Feature 4: Customer Support */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="text-[#3B2B1F] shrink-0">
                  <Headphones className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.4]" />
                </div>
                <div>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-[#2B231D]">
                    Customer Support
                  </h4>
                  <p className="text-xs text-[#7A6F66] mt-0.5 font-medium">
                    We&apos;re here to help
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* B. "JOIN OUR JOURNEY" NEWSLETTER BANNER (EXACT USER SCREENSHOT) */}
          <div className="bg-[#38281D] rounded-2xl sm:rounded-3xl p-6 sm:p-9 md:p-11 text-white relative overflow-hidden shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
              
              {/* Left Title & Description */}
              <div className="space-y-1.5 max-w-xl">
                <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#FAF6F1] font-normal tracking-wide">
                  Stay Updated
                </h3>
                <p className="text-xs sm:text-sm text-[#D5C7B8] font-light leading-relaxed">
                  Get offers, new arrivals, and updates by email.
                </p>
              </div>

              {/* Right Input Box with Embedded Subscribe Button */}
              <form onSubmit={handleNewsletterSubmit} className="w-full lg:max-w-md">
                <div className="bg-white rounded-xl sm:rounded-2xl p-1 sm:p-1.5 flex items-center shadow-inner gap-2 border border-white/20">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#2B231D] placeholder-[#9E9084] outline-none focus:outline-none ring-0 focus:ring-0"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="bg-[#5C4533] hover:bg-[#473426] active:scale-98 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </section>

      {/* 3. MOBILE SLIDE-OUT FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Slide-out Sheet (Modern Half-Width Sliding in from Left) */}
          <div className="fixed inset-y-0 left-0 w-[78vw] sm:w-[330px] max-w-[340px] bg-[#FAF6F0] shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300 rounded-r-2xl border-r border-[#DACDC0]">
            {/* Drawer Header */}
            <div className="px-4 py-3.5 border-b border-[#E8DFD5] flex items-center justify-between bg-white sticky top-0 z-20 rounded-tr-2xl">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#4A3525]" />
                <h3 className="font-heading text-lg font-bold text-[#2B231D]">
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#4A3525] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-[#7A6F66] hover:text-[#2B231D] hover:bg-[#F2ECE3] rounded-full transition-colors cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-4 space-y-5 flex-1 overflow-y-auto">
              
              {/* Categories */}
              <div>
                <h4 className="font-heading text-base font-bold text-[#2B231D] mb-2.5">
                  Categories
                </h4>
                <div className="space-y-0.5">
                  {categoriesList.map((cat) => {
                    const catKey = cat.type === 'all' ? 'All Products' : cat.type;
                    const isSelected = selectedCategory === catKey;
                    const hasChildren = cat.children && cat.children.length > 0;
                    const isExpanded = expandedParents.includes(cat.type);
                    return (
                      <div key={cat.type}>
                        <div className={`flex items-center rounded-md border transition-colors ${isSelected ? 'bg-[#4A3525] text-white border-[#4A3525]' : 'bg-white text-[#2B231D] border-[#DACDC0]'}`}>
                          <button
                            onClick={() => { setSelectedCategory(catKey); if (hasChildren && !isExpanded) toggleParent(cat.type); }}
                            className="flex-1 flex items-center justify-between text-xs py-2 pl-3 pr-1 font-medium"
                          >
                            <span className="truncate">{cat.label}</span>
                            <span className="text-[10px] opacity-75">({categoryCounts[catKey] ?? 0})</span>
                          </button>
                          {hasChildren && (
                            <button onClick={(e) => { e.stopPropagation(); toggleParent(cat.type); }} className={`px-2 py-2 ${isSelected ? 'text-white/70' : 'text-[#7A6F66]'}`}>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                        {hasChildren && isExpanded && (
                          <div className="ml-3 mt-0.5 space-y-0.5">
                            {cat.children!.map((child) => {
                              const childSelected = selectedCategory === child.type;
                              return (
                                <button
                                  key={child.type}
                                  onClick={() => setSelectedCategory(child.type)}
                                  className={`w-full flex items-center justify-between text-xs py-1.5 pl-5 pr-3 rounded-md font-medium transition-colors ${
                                    childSelected ? 'bg-[#4A3525] text-white font-bold' : 'bg-cream-50 text-[#5C5147] border border-[#E8DFD5]'
                                  }`}
                                >
                                  <span className="flex items-center gap-1"><span className="opacity-50">↳</span>{child.label}</span>
                                  <span className="text-[10px] opacity-75">({categoryCounts[child.type] ?? 0})</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-2 border-t border-[#E8DFD5]">
                <h4 className="font-heading text-base font-bold text-[#2B231D] mb-2.5">
                  Price Range
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="number"
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                    className="w-full bg-white border border-[#DACDC0] rounded-md px-2.5 py-1.5 text-xs text-[#2B231D]"
                    placeholder="Min"
                  />
                  <span className="text-xs font-bold text-[#7A6F66]">-</span>
                  <input
                    type="number"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    className="w-full bg-white border border-[#DACDC0] rounded-md px-2.5 py-1.5 text-xs text-[#2B231D]"
                    placeholder="Max"
                  />
                </div>
                <button
                  onClick={applyPriceFilter}
                  className="w-full bg-[#4A3525] text-white py-2 rounded-md text-xs font-semibold"
                >
                  Apply Price
                </button>
              </div>

              {/* Size */}
              <div className="pt-2 border-t border-[#E8DFD5]">
                <h4 className="font-heading text-base font-bold text-[#2B231D] mb-2.5">Size</h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {sizeOptions.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`min-w-[36px] h-8 px-2 text-xs font-bold rounded-md border ${
                          isSelected
                            ? 'bg-[#4A3525] text-white border-[#4A3525]'
                            : 'bg-white text-[#2B231D] border-[#DACDC0]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color */}
              <div className="pt-2 border-t border-[#E8DFD5]">
                <h4 className="font-heading text-base font-bold text-[#2B231D] mb-2.5">Color</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  {colorOptions.map((col) => {
                    const isSelected = selectedColor === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(isSelected ? '' : col.name)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          isSelected ? 'ring-2 ring-[#4A3525] scale-110' : ''
                        }`}
                        style={{
                          backgroundColor: col.hex,
                          border: col.border ? '1px solid #D5C8B8' : 'none',
                        }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              col.name === 'White' ? 'text-black' : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Occasion */}
              <div className="pt-2 border-t border-[#E8DFD5]">
                <h4 className="font-heading text-base font-bold text-[#2B231D] mb-2.5">Occasion</h4>
                <div className="grid grid-cols-2 gap-2">
                  {occasionOptions.map((occ) => (
                    <label
                      key={occ}
                      className="flex items-center gap-2 text-xs text-[#2B231D] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occ)}
                        onChange={() => toggleOccasion(occ)}
                        className="accent-[#4A3525]"
                      />
                      <span>{occ}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div className="pt-2 border-t border-[#E8DFD5]">
                <h4 className="font-heading text-base font-bold text-[#2B231D] mb-2.5">Fabric</h4>
                <div className="grid grid-cols-2 gap-2">
                  {fabricOptions.map((fab) => (
                    <label
                      key={fab}
                      className="flex items-center gap-2 text-xs text-[#2B231D] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFabrics.includes(fab)}
                        onChange={() => toggleFabric(fab)}
                        className="accent-[#4A3525]"
                      />
                      <span>{fab}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-3.5 border-t border-[#E8DFD5] bg-white space-y-2 sticky bottom-0 z-20 rounded-br-2xl">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#4A3525] text-white py-3 rounded-lg text-sm font-semibold shadow-md active:scale-98"
              >
                View Results ({filteredProducts.length})
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full bg-[#F2ECE3] text-[#7A6F66] hover:text-[#2B231D] py-2 rounded-lg text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
