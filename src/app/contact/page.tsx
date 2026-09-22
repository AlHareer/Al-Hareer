'use client';

import React, { useState } from 'react';
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
  ArrowRight,
  Scissors,
  Gift,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Newsletter from '@/components/sections/Newsletter';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { useUI } from '@/context/UIContext';

export default function ContactPage() {
  const { showToast } = useUI();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Bespoke Kurta Sets',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inquiryTypes = [
    'Bespoke Kurta Sets',
    'Wedding & Groomswear',
    'Studio Visit Appointment',
    'Custom Sizing & Fit',
    'Bulk / Corporate Gifting',
    'Order Status & Support',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('✨ Thank you! Our styling concierge will contact you within 24 hours.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Bespoke Kurta Sets',
        subject: '',
        message: '',
      });
    }, 1000);
  };

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
              alt="Al Hareer Heritage Atelier"
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
            <span className="font-semibold text-[#2B231D]">Contact Us</span>
          </nav>

          {/* Centered Banner Header on Desktop */}
          <div className="relative flex items-center justify-between lg:justify-center gap-4">
            <div className="max-w-[300px] sm:max-w-md md:max-w-lg lg:max-w-xl lg:mx-auto lg:text-center flex flex-col items-start lg:items-center">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-1.5 justify-start lg:justify-center">
                <span className="w-5 sm:w-7 lg:w-8 h-[1.5px] bg-[#4A3525]"></span>
                <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#4A3525] uppercase">
                  GET IN TOUCH WITH CONCIERGE
                </span>
                <span className="hidden lg:inline-block w-8 h-[1.5px] bg-[#4A3525]"></span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-black text-[#1F1813] tracking-tight leading-[1.08] mb-1">
                Contact Al Hareer
              </h1>

              <p className="font-body text-[#7A6F66] text-xs sm:text-sm font-normal leading-snug">
                Personal Styling, Bespoke Orders &amp; Flagship Atelier Visits
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

      {/* 2. THREE KEY CONTACT CARDS */}
      <section className="py-8 sm:py-12 bg-[#FAF6F0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Card 1: Phone & WhatsApp */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F5EFE6] text-[#4A3525] flex items-center justify-center mb-5 group-hover:bg-[#4A3525] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6B52]">
                  Direct Voice &amp; WhatsApp
                </span>
                <h3 className="font-heading text-xl font-bold text-[#2B231D] mt-1 mb-2">
                  Call Our Concierge
                </h3>
              
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-sm text-[#2B231D]">+91 73966 90308</p>
                  <p className="text-[#8B6B52] flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Mon – Sat: 10:00 AM – 8:30 PM IST</span>
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#F0EAE1] grid grid-cols-2 gap-2">
                <a
                  href="tel:+917396690308"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#FAF6F1] hover:bg-[#4A3525] text-[#4A3525] hover:text-white text-xs font-semibold transition-colors border border-[#E5DACD]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/917396690308?text=Hello%20Al%20Hareer%20Concierge,%20I%20would%20like%20to%20inquire%20about%20your%20collection."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] text-[#1E7E34] hover:text-white text-xs font-semibold transition-colors border border-[#25D366]/30"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Card 2: Email Support */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F5EFE6] text-[#4A3525] flex items-center justify-center mb-5 group-hover:bg-[#4A3525] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6B52]">
                  Electronic Concierge
                </span>
                <h3 className="font-heading text-xl font-bold text-[#2B231D] mt-1 mb-2">
                  Email Stylist Team
                </h3>
               
                <div className="space-y-1 text-xs">
                  <a href="mailto:support@alhareer.com" className="font-semibold text-sm text-[#2B231D] hover:text-[#4A3525] block">
                    support@alhareer.com
                  </a>
                  <p className="text-[#8B6B52] flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7E4B]" />
                    <span>Average reply within 12–24 business hours</span>
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#F0EAE1]">
                <a
                  href="mailto:support@alhareer.com"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#FAF6F1] hover:bg-[#4A3525] text-[#4A3525] hover:text-white text-xs font-semibold transition-colors border border-[#E5DACD]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Write to Concierge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 3: Flagship Atelier */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F5EFE6] text-[#4A3525] flex items-center justify-center mb-5 group-hover:bg-[#4A3525] group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6B52]">
                  Design Studio &amp; Atelier
                </span>
                <h3 className="font-heading text-xl font-bold text-[#2B231D] mt-1 mb-2">
                  Visit Jabalpur Atelier
                </h3>
               
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-sm text-[#2B231D]">
                    Civil Lines, Jabalpur, Madhya Pradesh 482001
                  </p>
                  <p className="text-[#8B6B52] flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Complimentary Valet &amp; Private Fitting Suite</span>
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#F0EAE1]">
                <a
                  href="#map-section"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#FAF6F1] hover:bg-[#4A3525] text-[#4A3525] hover:text-white text-xs font-semibold transition-colors border border-[#E5DACD]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Map &amp; Directions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM & STUDIO EXPERIENCE (TWO COLUMNS) */}
      <section className="py-6 sm:py-10 bg-[#FAF6F0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT: Contact & Bespoke Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-[#E8DFD5] shadow-xs">
              <div className="mb-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8B6B52]">
                  — WRITE TO US
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2B231D] mt-1">
                  Send Us A Message
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6F66] mt-1.5">
                  Have a question about custom fittings, bespoke groomswear, or order dispatch? Fill out the inquiry form and our concierge will get back to you promptly.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-xl bg-[#FAF6F1] border border-[#E5DACD] text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#4A3525] text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-7 h-7 text-[#F5E6BE]" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-[#2B231D]">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A6F66] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Al Hareer. Our senior styling advisor will review your inquiry and connect with you via phone or email within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A3525] text-white text-xs font-semibold hover:bg-[#36261A] transition-colors"
                  >
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Inquiry Type Select Option */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                      Select Inquiry Type <span className="text-[#8B2D2D]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full appearance-none text-xs sm:text-sm px-4 py-3 pr-10 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] focus:outline-none focus:border-[#4A3525] focus:bg-white transition-all cursor-pointer font-medium"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type} className="bg-white text-[#2B231D] py-1">
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#4A3525]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                        Your Full Name <span className="text-[#8B2D2D]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vikramaditya Sharma"
                        className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] focus:outline-none focus:border-[#4A3525] focus:bg-white transition-all"
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
                        placeholder="vikram@example.com"
                        className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] focus:outline-none focus:border-[#4A3525] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 73966 90308"
                        className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] focus:outline-none focus:border-[#4A3525] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Wedding Kurta Fitting Consultation"
                        className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] focus:outline-none focus:border-[#4A3525] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2B231D] mb-1.5">
                      Your Message or Consultation Details <span className="text-[#8B2D2D]">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your requirements, preferred occasion date, or size details..."
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] text-[#2B231D] placeholder-[#A89C8F] focus:outline-none focus:border-[#4A3525] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A3525] hover:bg-[#36261A] text-white text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-lg transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[#A89C8F]">
                    🔒 Your personal details are completely private and secured under our privacy guarantee.
                  </p>
                </form>
              )}
            </div>

            {/* RIGHT: Studio Highlights & Experience (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Luxury Studio Visual Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E8DFD5] bg-[#EFE8E0] shadow-xs min-h-[220px]">
                <div className="relative w-full h-48 sm:h-56">
                  <Image
                    src="/images/footer-arch.jpg"
                    alt="Al Hareer Heritage Studio"
                    fill
                    className="object-cover object-center"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-white/95 backdrop-blur-xs text-[#2B231D] px-2.5 py-1 rounded shadow-xs">
                      ATELIER PRIVILEGE
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-heading text-xl font-bold leading-tight mb-1">
                      The Jabalpur Flagship Atelier
                    </p>
                    <p className="text-xs text-white/80 font-light">
                      Step into an era of regal hospitality, personalized drapery, and heritage tailoring.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Feature Pillars */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8DFD5] shadow-xs space-y-5">
                <h4 className="font-heading text-lg font-bold text-[#2B231D] pb-3 border-b border-[#F0EAE1]">
                  Why Connect With Our Atelier
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525] shrink-0 mt-0.5">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B231D] text-sm">Made-to-Measure Customization</p>
                      <p className="text-[#7A6F66] text-xs leading-relaxed mt-0.5">
                        Complimentary bespoke collar, shoulder, and hem adjustments tailored to your posture.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525] shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B231D] text-sm">Pure Artisanal Textiles</p>
                      <p className="text-[#7A6F66] text-xs leading-relaxed mt-0.5">
                        Direct access to handloom Chanderi silk, breathable pure slub cotton, and woven Nehru jacket brocades.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525] shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B231D] text-sm">Private Video Styling Call</p>
                      <p className="text-[#7A6F66] text-xs leading-relaxed mt-0.5">
                        Can’t visit Jabalpur? Book a live 1-on-1 WhatsApp video session to inspect fabrics and colors in natural light.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-center text-[#4A3525] shrink-0 mt-0.5">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B231D] text-sm">Signature Keepsake Gift Box</p>
                      <p className="text-[#7A6F66] text-xs leading-relaxed mt-0.5">
                        Each garment is hand-pressed, perfumed with aromatic herbal extracts, and packed in luxury presentation boxes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Quick Box */}
                <div className="pt-3 border-t border-[#F0EAE1]">
                  <a
                    href="https://wa.me/917396690308?text=Hello%20Al%20Hareer%20Concierge,%20I%20would%20like%20to%20schedule%20a%20private%20styling%20appointment."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                        <WhatsAppIcon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-[#1E7E34]">Direct WhatsApp Concierge</p>
                        <p className="text-[11px] text-[#554D46]">Fastest response under 15 minutes</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1E7E34] group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE MODERN GOOGLE MAP SECTION */}
      <section id="map-section" className="py-10 sm:py-16 bg-[#F5EFE6] border-t border-b border-[#E8DFD5] scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-6 h-[1.5px] bg-[#4A3525]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#8B6B52]">
                LOCATION &amp; DIRECTIONS
              </span>
              <span className="w-6 h-[1.5px] bg-[#4A3525]" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#2B231D]">
              Visit Our Jabalpur Studio
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6F66] mt-2">
              Centrally situated in Civil Lines, Jabalpur. Easy access from Jabalpur Railway Station (10 mins) and Dumna Airport (25 mins).
            </p>
          </div>

          {/* Map & Studio Info Box Container */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E2D7C7] shadow-lg bg-white">
            
            {/* Responsive Google Maps Embed */}
            <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] bg-[#EFE8E0]">
              <iframe
                title="Al Hareer Flagship Atelier Location in Jabalpur"
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
            <div className="lg:absolute lg:bottom-6 lg:left-6 lg:max-w-sm w-full bg-white/95 backdrop-blur-md p-5 sm:p-6 lg:rounded-xl border-t lg:border border-[#E5DACD] shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A3525]">
                  Atelier Open Today
                </span>
              </div>

              <h4 className="font-heading text-lg font-bold text-[#2B231D]">
                Al Hareer Heritage Atelier
              </h4>
              <p className="text-xs text-[#7A6F66] mt-1 leading-relaxed">
                Civil Lines, Jabalpur, Madhya Pradesh 482001, India
              </p>

              <div className="my-3.5 py-3 border-y border-[#F0EAE1] space-y-1.5 text-xs text-[#554D46]">
                <div className="flex items-center justify-between">
                  <span className="text-[#7A6F66]">Monday – Saturday:</span>
                  <span className="font-semibold text-[#2B231D]">10:30 AM – 8:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A6F66]">Sunday:</span>
                  <span className="font-semibold text-[#2B231D]">11:00 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-[#8B6B52]">
                  <span>Valet Parking:</span>
                  <span className="font-semibold">Complimentary Available</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="https://maps.google.com/?q=Civil+Lines+Jabalpur+Madhya+Pradesh"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#4A3525] hover:bg-[#36261A] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
                <a
                  href="tel:+917396690308"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#FAF6F1] hover:bg-[#EFE8E0] text-[#2B231D] text-xs font-semibold border border-[#DACDC0] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#4A3525]" />
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
