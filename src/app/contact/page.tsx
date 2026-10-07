'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  Calendar,
  Navigation,
  ChevronDown,
  Scissors,
  Gift,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Newsletter from '@/components/sections/Newsletter';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { useUI } from '@/context/UIContext';
import { submitInquiry } from '@/actions/customerContact';
import { getFooterSettings, type ContentSettings } from '@/lib/siteSettings';

const FALLBACK_CONTACT: ContentSettings = {
  home_contact_phone: '+91 73966 90308',
  home_contact_email: 'support@alhareer.com',
  home_contact_address: 'Civil Lines, Jabalpur, Madhya Pradesh 482001, India',
  home_contact_hours: 'Mon – Sat: 10:30 AM – 8:30 PM · Sun: 11:00 AM – 6:00 PM',
  home_contact_calligraphy_line1: 'Tradition',
  home_contact_calligraphy_line2: 'In Style',
};

export default function ContactPage() {
  const { showToast } = useUI();
  const [contact, setContact] = useState<ContentSettings>(FALLBACK_CONTACT);
  useEffect(() => {
    getFooterSettings().then(setContact).catch(() => {});
  }, []);
  const digits = contact.home_contact_phone.replace(/\D/g, '').slice(-10);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Kurta Sets',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inquiryTypes = [
    'Kurta Sets',
    'Wedding Wear',
    'Store Visit',
    'Sizing & Fit',
    'Bulk Orders',
    'Order Support',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    setIsSubmitting(true);
    const subject = [formData.inquiryType, formData.subject.trim()].filter(Boolean).join(' — ');
    const result = await submitInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject,
      message: formData.message,
    });
    setIsSubmitting(false);

    if (!result.success) {
      showToast(result.error || 'Something went wrong. Please try again.', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('✨ Thanks! We\'ll get back to you within 24 hours.', 'success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiryType: 'Kurta Sets',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1EC] text-[#00303A] selection:bg-[#024F5F] selection:text-white">
      <Navbar />

      {/* 1. TOP HERO / SECTION INTRO */}
      <section className="relative overflow-hidden bg-[#F6F1EC] border-b border-[#CFAC64]">
        {/* Background Decorative Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] md:w-[48%] lg:w-[42%] pointer-events-none select-none overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/images/shop-banner-arch.jpg"
              alt="Al Hareer Store"
              fill
              priority
              className="object-cover object-right opacity-30 sm:opacity-80"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F6F1EC] via-[#F6F1EC]/80 to-transparent sm:via-[#F6F1EC]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F6F1EC]/60 to-transparent sm:hidden" />
          </div>
        </div>

        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-12 pt-3 sm:pt-4 lg:pt-4 pb-4 sm:pb-6 lg:pb-6 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#024F5F] mb-2.5 sm:mb-3.5 lg:mb-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[#024F5F] hover:text-[#00303A] transition-colors">
              <Home className="w-3.5 h-3.5 text-[#024F5F]" />
              <span>Home</span>
            </Link>
            <span className="text-[#CFAC64] font-light">&gt;</span>
            <span className="font-semibold text-[#00303A]">Contact Us</span>
          </nav>

          {/* Centered Banner Header on Desktop */}
          <div className="relative flex items-center justify-between lg:justify-center gap-4">
            <div className="max-w-[300px] sm:max-w-md md:max-w-lg lg:max-w-xl lg:mx-auto lg:text-center flex flex-col items-start lg:items-center">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-1.5 justify-start lg:justify-center">
                <span className="w-5 sm:w-7 lg:w-8 h-[1.5px] bg-[#024F5F]"></span>
                <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#024F5F] uppercase">
                  GET IN TOUCH
                </span>
                <span className="hidden lg:inline-block w-8 h-[1.5px] bg-[#024F5F]"></span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-bold text-[#00303A] tracking-tight leading-[1.08] mb-1">
                Contact Al Hareer
              </h1>

              <p className="font-body text-[#024F5F] text-xs sm:text-sm font-normal leading-snug">
                Questions, orders, or store visits — we're here to help
              </p>
            </div>

            {/* Right Calligraphy */}
            <div className="flex flex-col items-center justify-center text-center select-none shrink-0 lg:absolute lg:right-6 xl:right-12 lg:top-1/2 lg:-translate-y-1/2 sm:pr-16 md:pr-24 lg:pr-0">
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#024F5F] leading-none tracking-wide">
                {contact.home_contact_calligraphy_line1}
              </span>
              <span className="font-script text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#024F5F] leading-none tracking-wide mt-0.5">
                {contact.home_contact_calligraphy_line2}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE KEY CONTACT CARDS */}
      <section className="py-8 sm:py-12 bg-[#F6F1EC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Card 1: Phone & WhatsApp */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#CFAC64] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F6F1EC] text-[#024F5F] flex items-center justify-center mb-5 group-hover:bg-[#B08F4F] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#024F5F]">
                  Call &amp; WhatsApp
                </span>
                <h3 className="font-heading text-xl font-bold text-[#00303A] mt-1 mb-2">
                  Call Us
                </h3>
              
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-sm text-[#00303A]">{contact.home_contact_phone}</p>
                  <p className="text-[#024F5F] flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{contact.home_contact_hours}</span>
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#F6F1EC] grid grid-cols-2 gap-2">
                <a
                  href={`tel:+91${digits}`}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#F6F1EC] hover:bg-[#B08F4F] text-[#024F5F] hover:text-white text-xs font-semibold transition-colors border border-[#CFAC64]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/91${digits}?text=Hi,%20I'd%20like%20to%20know%20more%20about%20your%20collection.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#024F5F]/10 hover:bg-[#B08F4F] text-[#024F5F] hover:text-white text-xs font-semibold transition-colors border border-[#024F5F]/30"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Card 2: Email Support */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#CFAC64] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F6F1EC] text-[#024F5F] flex items-center justify-center mb-5 group-hover:bg-[#B08F4F] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#024F5F]">
                  Email
                </span>
                <h3 className="font-heading text-xl font-bold text-[#00303A] mt-1 mb-2">
                  Email Us
                </h3>

                <div className="space-y-1 text-xs">
                  <a href={`mailto:${contact.home_contact_email}`} className="font-semibold text-sm text-[#00303A] hover:text-[#024F5F] block">
                    {contact.home_contact_email}
                  </a>
                  <p className="text-[#024F5F] flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#024F5F]" />
                    <span>Average reply within 12–24 business hours</span>
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#F6F1EC]">
                <a
                  href={`mailto:${contact.home_contact_email}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#F6F1EC] hover:bg-[#B08F4F] text-[#024F5F] hover:text-white text-xs font-semibold transition-colors border border-[#CFAC64]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send an Email</span>
                </a>
              </div>
            </div>

            {/* Card 3: Flagship Atelier */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#CFAC64] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F6F1EC] text-[#024F5F] flex items-center justify-center mb-5 group-hover:bg-[#B08F4F] group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#024F5F]">
                  Our Store
                </span>
                <h3 className="font-heading text-xl font-bold text-[#00303A] mt-1 mb-2">
                  Visit Us in Jabalpur
                </h3>

                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-sm text-[#00303A]">
                    {contact.home_contact_address}
                  </p>
                  <p className="text-[#024F5F] flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Free parking &amp; fitting room</span>
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#F6F1EC]">
                <a
                  href="#map-section"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#F6F1EC] hover:bg-[#B08F4F] text-[#024F5F] hover:text-white text-xs font-semibold transition-colors border border-[#CFAC64]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Map &amp; Directions</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM & STUDIO EXPERIENCE (TWO COLUMNS) */}
      <section className="py-6 sm:py-10 bg-[#F6F1EC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT: Contact & Bespoke Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-[#CFAC64] shadow-xs">
              <div className="mb-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#024F5F]">
                  — WRITE TO US
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#00303A] mt-1">
                  Send Us A Message
                </h2>
                <p className="text-xs sm:text-sm text-[#024F5F] mt-1.5">
                  Have a question about sizing, an order, or anything else? Fill out the form below and we'll get back to you soon.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-xl bg-[#F6F1EC] border border-[#CFAC64] text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#024F5F] text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-7 h-7 text-[#F6F1EC]" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-[#00303A]">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#024F5F] max-w-md mx-auto leading-relaxed">
                    Thanks for reaching out. We'll get back to you by phone or email within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#CFAC64] text-white text-xs font-semibold hover:bg-[#B08F4F] transition-colors"
                  >
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Inquiry Type Select Option */}
                  <div>
                    <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                      What is this about? <span className="text-[#024F5F]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full appearance-none text-xs sm:text-sm px-4 py-3 pr-10 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] focus:outline-none focus:border-[#024F5F] focus:bg-white transition-all cursor-pointer font-medium"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type} className="bg-white text-[#00303A] py-1">
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#024F5F]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                        Your Name <span className="text-[#024F5F]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vikram Sharma"
                        className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] focus:outline-none focus:border-[#024F5F] focus:bg-white transition-all"
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
                        placeholder="vikram@example.com"
                        className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] focus:outline-none focus:border-[#024F5F] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 73966 90308"
                        className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] focus:outline-none focus:border-[#024F5F] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Wedding kurta fitting"
                        className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] focus:outline-none focus:border-[#024F5F] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#00303A] mb-1.5">
                      Your Message <span className="text-[#024F5F]">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you need..."
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] text-[#00303A] placeholder-[#CFAC64] focus:outline-none focus:border-[#024F5F] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-lg transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[#CFAC64]">
                    🔒 Your information is kept private and secure.
                  </p>
                </form>
              )}
            </div>

            {/* RIGHT: Studio Highlights & Experience (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Luxury Studio Visual Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#CFAC64] bg-[#F6F1EC] shadow-xs min-h-[220px]">
                <div className="relative w-full h-48 sm:h-56">
                  <Image
                    src="/images/footer-arch.jpg"
                    alt="Al Hareer Store"
                    fill
                    className="object-cover object-center"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00303A]/85 via-[#00303A]/35 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-white/95 backdrop-blur-xs text-[#00303A] px-2.5 py-1 rounded shadow-xs">
                      VISIT US
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-heading text-xl font-bold leading-tight mb-1">
                      Our Jabalpur Store
                    </p>
                    <p className="text-xs text-white/80 font-light">
                      Come see our fabrics and get help finding the right fit.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Feature Pillars */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#CFAC64] shadow-xs space-y-5">
                <h4 className="font-heading text-lg font-bold text-[#00303A] pb-3 border-b border-[#F6F1EC]">
                  Why Visit Us
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F] shrink-0 mt-0.5">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#00303A] text-sm">Free Alterations</p>
                      <p className="text-[#024F5F] text-xs leading-relaxed mt-0.5">
                        We'll adjust the collar, shoulders, and length so it fits you properly, at no extra cost.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F] shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#00303A] text-sm">See the Fabric in Person</p>
                      <p className="text-[#024F5F] text-xs leading-relaxed mt-0.5">
                        Check out our Chanderi silk, cotton, and other fabrics before you buy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F] shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#00303A] text-sm">Video Call Option</p>
                      <p className="text-[#024F5F] text-xs leading-relaxed mt-0.5">
                        Can't make it to Jabalpur? Book a WhatsApp video call and we'll show you the fabrics and colors.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F6F1EC] border border-[#CFAC64] flex items-center justify-center text-[#024F5F] shrink-0 mt-0.5">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#00303A] text-sm">Gift Packaging</p>
                      <p className="text-[#024F5F] text-xs leading-relaxed mt-0.5">
                        Every order is neatly pressed and packed, ready to gift.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Quick Box */}
                <div className="pt-3 border-t border-[#F6F1EC]">
                  <a
                    href={`https://wa.me/91${digits}?text=Hi,%20I'd%20like%20to%20book%20a%20visit.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#024F5F]/10 border border-[#024F5F]/30 hover:bg-[#024F5F]/20 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#CFAC64] text-white flex items-center justify-center shadow-xs">
                        <WhatsAppIcon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-[#024F5F]">WhatsApp Us</p>
                        <p className="text-[11px] text-[#024F5F]">Usually reply within 15 minutes</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE MODERN GOOGLE MAP SECTION */}
      <section id="map-section" className="py-10 sm:py-16 bg-[#F6F1EC] border-t border-b border-[#CFAC64] scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-6 h-[1.5px] bg-[#024F5F]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#024F5F]">
                LOCATION &amp; DIRECTIONS
              </span>
              <span className="w-6 h-[1.5px] bg-[#024F5F]" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#00303A]">
              Visit Our Jabalpur Store
            </h2>
            <p className="text-xs sm:text-sm text-[#024F5F] mt-2">
              Located in Civil Lines, Jabalpur — 10 minutes from the railway station, 25 minutes from the airport.
            </p>
          </div>

          {/* Map & Studio Info Box Container */}
          <div className="relative rounded-2xl overflow-hidden border border-[#CFAC64] shadow-lg bg-white">
            
            {/* Responsive Google Maps Embed */}
            <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] bg-[#F6F1EC]">
              <iframe
                title="Al Hareer Store Location in Jabalpur"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117362.7788484931!2d79.87059714341999!3d23.175787680190138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1a0fb6ce7f%3A0x436ee49e6f6f1524!2sJabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-[1.02] opacity-95"
              />
            </div>

            {/* Floating Luxury Location Card (Overlay on desktop, block on mobile) */}
            <div className="lg:absolute lg:bottom-6 lg:left-6 lg:max-w-sm w-full bg-white/95 backdrop-blur-md p-5 sm:p-6 lg:rounded-xl border-t lg:border border-[#CFAC64] shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#024F5F] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#024F5F]">
                  Open Today
                </span>
              </div>

              <h4 className="font-heading text-lg font-bold text-[#00303A]">
                Al Hareer Store
              </h4>
              <p className="text-xs text-[#024F5F] mt-1 leading-relaxed">
                {contact.home_contact_address}
              </p>

              <div className="my-3.5 py-3 border-y border-[#F6F1EC] space-y-1.5 text-xs text-[#024F5F]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#024F5F]">Hours:</span>
                  <span className="font-semibold text-[#00303A] text-right">{contact.home_contact_hours}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-[#024F5F]">
                  <span>Parking:</span>
                  <span className="font-semibold">Free</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="https://maps.google.com/?q=Civil+Lines+Jabalpur+Madhya+Pradesh"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#CFAC64] hover:bg-[#B08F4F] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
                <a
                  href={`tel:+91${digits}`}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#F6F1EC] hover:bg-[#F6F1EC] text-[#00303A] text-xs font-semibold border border-[#CFAC64] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#024F5F]" />
                  <span>Call</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}
