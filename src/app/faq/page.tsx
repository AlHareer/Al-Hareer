'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Search,
  ChevronDown,
  Phone,
  Mail,
  HelpCircle,
  Truck,
  RotateCcw,
  Scissors,
  Sparkles,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<string | null>('q-1');

  const categories = [
    'All',
    'Sizing & Custom Fit',
    'Orders & Shipping',
    'Returns & Exchanges',
    'Fabric & Craftsmanship',
    'Atelier & Bespoke',
  ];

  const faqData: FAQItem[] = [
    // Sizing & Custom Fit
    {
      id: 'q-1',
      category: 'Sizing & Custom Fit',
      question: 'How do I choose the correct size for my Kurta Pajama set?',
      answer:
        'Our garments are tailored with a classic relaxed royal fit. We recommend choosing your standard chest size (e.g., Size 38 for a 38-inch chest). Each product page includes an exact measurement chart in inches and centimeters for chest, shoulder, sleeve length, and kurta length. If you fall between two sizes, we recommend sizing up for traditional drape comfort.',
    },
    {
      id: 'q-2',
      category: 'Sizing & Custom Fit',
      question: 'Do you offer complimentary custom made-to-measure tailoring?',
      answer:
        'Yes! For all festive and wedding kurta sets, we provide complimentary custom tailoring. After placing your order, select "Custom Sizing" or contact our concierge via WhatsApp (+91 73966 90308). Our master patternmaker will note your specific height, chest, waist, and sleeve preferences before hand-cutting your fabric.',
    },
    {
      id: 'q-3',
      category: 'Sizing & Custom Fit',
      question: 'Can I request alteration if the fit is not 100% satisfactory upon delivery?',
      answer:
        'Absolutely. We offer one complimentary alteration service on all purchases within 10 days of delivery. Our courier partners will pick up the garment from your doorstep and our master tailors will adjust the hem, sleeves, or collar to your exact liking.',
    },

    // Orders & Shipping
    {
      id: 'q-4',
      category: 'Orders & Shipping',
      question: 'What are your delivery timelines across India?',
      answer:
        'Ready-to-wear items are dispatched within 24 to 48 hours of order confirmation. Standard transit time is 3 to 5 business days for major metro cities (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata) and 4 to 6 business days for other regions. You will receive an automated SMS and WhatsApp tracking link as soon as your package is dispatched.',
    },
    {
      id: 'q-5',
      category: 'Orders & Shipping',
      question: 'Do you offer Cash on Delivery (COD) and free shipping?',
      answer:
        'Yes! We provide complimentary free express shipping on all orders above ₹999 across India. Cash on Delivery (COD) is available on orders up to ₹15,000 across all serviceable pin codes with zero extra convenience fees.',
    },
    {
      id: 'q-6',
      category: 'Orders & Shipping',
      question: 'Do you ship internationally to the US, UK, Canada, and UAE?',
      answer:
        'Yes, we ship globally via DHL Express and FedEx. International delivery typically takes 6 to 9 business days. For international orders, please connect directly with our international desk at support@alhareer.com or on WhatsApp for assisted checkout and customs duty documentation.',
    },

    // Returns & Exchanges
    {
      id: 'q-7',
      category: 'Returns & Exchanges',
      question: 'What is your return and exchange policy?',
      answer:
        'We offer a seamless 7-day hassle-free exchange and return policy. If you wish to exchange a size, color, or request a full refund, simply write to support@alhareer.com or message us on WhatsApp with your Order ID. Our courier partners will arrange a reverse pickup from your address within 24 to 48 hours.',
    },
    {
      id: 'q-8',
      category: 'Returns & Exchanges',
      question: 'How long does it take to receive a refund once a return is picked up?',
      answer:
        'Once your returned item arrives at our Jabalpur atelier and completes a quick 14-point quality inspection, your refund is initiated immediately. For prepaid orders (UPI/Cards/Netbanking), refunds reflect in your original payment method within 3 to 5 business days. For COD orders, refunds are transferred instantly via UPI or NEFT bank transfer.',
    },

    // Fabric & Craftsmanship
    {
      id: 'q-9',
      category: 'Fabric & Craftsmanship',
      question: 'What fabrics do you use in your Kurtas and Sets?',
      answer:
        'We exclusively work with artisanal natural fibers: 100% pure Chanderi silk, handloom Mulmul, organic slub cotton, natural linen, and woven jacquard brocades. Every yard of fabric is pre-washed and treated to prevent color bleeding and shrinkage while ensuring breathable all-day comfort.',
    },
    {
      id: 'q-10',
      category: 'Fabric & Craftsmanship',
      question: 'How should I care for and wash my Al Hareer ethnic garments?',
      answer:
        'For our pure Silk, Chanderi, and Embroidered Wedding Kurtas, we strictly recommend dry cleaning to preserve the sheen of metallic zari and resham threadwork. For pure Cotton and Linen sets, gentle hand washing with cold water and mild liquid detergent is recommended. Always dry in shade and iron inside out on low-to-medium heat.',
    },

    // Atelier & Bespoke
    {
      id: 'q-11',
      category: 'Atelier & Bespoke',
      question: 'How can I visit your Jabalpur Flagship Atelier?',
      answer:
        'Our atelier is located in Civil Lines, Jabalpur, Madhya Pradesh 482001. We are open Monday through Saturday from 10:30 AM to 8:30 PM, and Sunday from 11:00 AM to 6:00 PM. We offer complimentary valet parking and private dressing suites. Walk-ins are always warmly welcomed, though scheduling an appointment ensures a dedicated senior stylist.',
    },
    {
      id: 'q-12',
      category: 'Atelier & Bespoke',
      question: 'Can you curate coordinated outfits for groomsmen and wedding parties?',
      answer:
        'Yes! Bespoke wedding styling is our hallmark. We specialize in coordinating groom and groomsmen ensembles with matching color tones, custom embroidery motifs, and customized keepsake packaging. We offer special tiered wedding party pricing. Email concierge@alhareer.com or WhatsApp our wedding desk for a private consultation.',
    },
    {
      id: 'q-13',
      category: 'Atelier & Bespoke',
      question: 'Can I book a live video styling session before purchasing?',
      answer:
        'Yes! If you are unable to visit our Jabalpur studio, we offer private 1-on-1 video consultations via WhatsApp or Zoom. Our senior stylist will present fabric textures, drape folds, and true-to-life colors under studio lighting to help you choose the ideal ensemble.',
    },
  ];

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
              alt="Al Hareer Concierge Support"
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
            <span className="font-semibold text-[#2B231D]">FAQs &amp; Help</span>
          </nav>

          {/* Centered Banner Header on Desktop */}
          <div className="relative flex items-center justify-between lg:justify-center gap-4">
            <div className="max-w-[320px] sm:max-w-md md:max-w-lg lg:max-w-xl lg:mx-auto lg:text-center flex flex-col items-start lg:items-center">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-1.5 justify-start lg:justify-center">
                <span className="w-5 sm:w-7 lg:w-8 h-[1.5px] bg-[#4A3525]"></span>
                <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#4A3525] uppercase">
                  HELP &amp; CONCIERGE DESK
                </span>
                <span className="hidden lg:inline-block w-8 h-[1.5px] bg-[#4A3525]"></span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-black text-[#1F1813] tracking-tight leading-[1.08] mb-1">
                Frequently Asked Questions
              </h1>

              <p className="font-body text-[#7A6F66] text-xs sm:text-sm font-normal leading-snug">
                Everything you need to know about our tailoring, shipping, custom fits, and heritage fabrics.
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

      {/* 2. SEARCH BAR & QUICK CATEGORY CHIPS */}
      <section className="py-6 sm:py-8 bg-[#FAF6F0]">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Box */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. custom size, delivery time, returns, fabric...)"
              className="w-full text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl bg-white border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] shadow-2xs focus:outline-none focus:border-[#4A3525] transition-all"
            />
            <Search className="w-4 h-4 text-[#8B6B52] absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8B6B52] hover:text-[#4A3525] px-2 py-1 bg-[#F5EFE6] rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-medium whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#4A3525] text-white shadow-xs'
                      : 'bg-white text-[#7A6F66] border border-[#E5DACD] hover:bg-[#EFE8E0] hover:text-[#2B231D]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. ACCORDION FAQ LIST */}
      <section className="py-4 sm:py-8 pb-14 bg-[#FAF6F0] flex-1">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DFD5] p-8 space-y-3">
              <HelpCircle className="w-10 h-10 text-[#8B6B52] mx-auto stroke-1" />
              <p className="font-heading text-xl font-bold text-[#2B231D]">
                No matching answers found
              </p>
              <p className="text-xs sm:text-sm text-[#7A6F66] max-w-md mx-auto">
                We couldn&apos;t find an answer matching &ldquo;{searchQuery}&rdquo;. Feel free to reach out to our concierge team directly.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/917396690308?text=Hello%20Al%20Hareer%20Concierge,%20I%20have%20a%20question."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A3525] text-white text-xs font-semibold hover:bg-[#36261A] transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Ask On WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openIndex === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-[#E8DFD5] bg-white overflow-hidden shadow-2xs transition-all hover:border-[#DACDC0]"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-[#2B231D] hover:text-[#4A3525] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A3525] shrink-0" />
                        <span>{faq.question}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8B6B52] transition-transform duration-200 shrink-0 ml-2 ${
                          isOpen ? 'rotate-180 text-[#4A3525]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-[#7A6F66] leading-relaxed border-t border-[#F5EFE6] pt-3 animate-in fade-in duration-200 bg-[#FCFAF7]/50">
                        <p>{faq.answer}</p>
                        <div className="mt-3 pt-2.5 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] text-[#A89C8F]">
                          <span>Category: <strong className="text-[#8B6B52]">{faq.category}</strong></span>
                          <span>Was this helpful?</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. NEED MORE ASSISTANCE BANNER */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#EFE8E0] border border-[#DACDC0] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-8 space-y-1 text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6B52]">
                  — PERSONAL STYLING CONCIERGE
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2B231D]">
                  Still have questions or need custom assistance?
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6F66] leading-relaxed">
                  Our dedicated styling concierges are available 6 days a week to assist with fittings, customized wedding trousseau orders, or studio appointments.
                </p>
              </div>

              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5 justify-center">
                <a
                  href="https://wa.me/917396690308?text=Hello%20Al%20Hareer,%20I%20have%20a%20question%20about%20my%20order."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Page Form</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
