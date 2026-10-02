'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import BrandLogo from '@/components/layout/BrandLogo';
import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowUp, Leaf, ShieldCheck, Truck } from 'lucide-react';
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  WhatsAppIcon,
  LinkedInIcon,
} from '@/components/ui/SocialIcons';
import { getFooterSettings, getSocialLinks, type ContentSettings } from '@/lib/siteSettings';

const FALLBACK_CONTACT: ContentSettings = {
  home_contact_phone: '+91 73966 90308',
  home_contact_email: 'support@alhareer.com',
  home_contact_address: 'Jabalpur, Madhya Pradesh, India',
};
const FALLBACK_SOCIAL: ContentSettings = {
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  youtube_url: 'https://youtube.com',
  whatsapp_number: '917396690308',
};

export default function Footer() {
  const [contact, setContact] = useState<ContentSettings>(FALLBACK_CONTACT);
  const [social, setSocial] = useState<ContentSettings>(FALLBACK_SOCIAL);

  useEffect(() => {
    getFooterSettings().then(setContact).catch(() => {});
    getSocialLinks().then(setSocial).catch(() => {});
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#FAF6F0] border-t border-[#E2D7C7] text-brand-700 overflow-hidden">
      {/* Background Decorative Watermark (Mandala on Far Left) */}
      <div className="pointer-events-none absolute -left-16 -top-10 w-80 h-80 opacity-15 text-gold select-none -z-0">
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-current fill-none" strokeWidth="0.8">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="50" />
          <circle cx="100" cy="100" r="30" />
          <path d="M100 10 L100 190 M10 100 L190 100 M36 36 L164 164 M36 164 L164 36" />
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d="M100 100 L100 20 A80 80 0 0 1 140 30 Z"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 md:pb-8 relative z-10">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 pb-12 border-b border-[#E2D7C7]/80 items-start">
          
          {/* COLUMN 1: Brand Info, Socials, & "Wear Your Story" (lg: 4 cols) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            {/* Brand Logo & Tagline */}
            <div>
              <BrandLogo size="lg" />
              <div className="w-8 h-[2px] bg-gold mt-3 mb-3" />
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-[#655B53] leading-relaxed max-w-xs">
              Keeping tradition alive in every thread. Contemporary ethnic wear designed for elegance, comfort, and heritage.
            </p>

            {/* 5 Social Media Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={social.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#EDE4D6] hover:bg-[#4A3525] hover:text-white text-[#4A3525] flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={social.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#EDE4D6] hover:bg-[#4A3525] hover:text-white text-[#4A3525] flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={social.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#EDE4D6] hover:bg-[#4A3525] hover:text-white text-[#4A3525] flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/${social.whatsapp_number}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#EDE4D6] hover:bg-[#4A3525] hover:text-white text-[#4A3525] flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#EDE4D6] hover:bg-[#4A3525] hover:text-white text-[#4A3525] flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Signature: "— Wear Your Story" */}
            <div className="flex items-center gap-3 pt-3">
              <span className="w-7 h-[1.5px] bg-[#655B53]" />
              <span className="font-script-luxury text-2xl text-[#655B53] tracking-wide select-none">
                Wear Your Story
              </span>
            </div>
          </div>

          {/* COLUMNS 2 & 3: Quick Links & Customer Help (2-columns on mobile, 4 cols on desktop) */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Quick Links */}
            <div className="space-y-3">
              <div>
                <h4 className="font-heading text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#2B231D]">
                  QUICK LINKS
                </h4>
                <div className="w-6 h-[1.5px] bg-gold mt-1.5" />
              </div>
              <ul className="space-y-3 text-xs sm:text-[13px] text-[#655B53] pt-1">
                <li>
                  <a href="/" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Home
                  </a>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Shop Collection
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Moments &amp; Collections
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/story" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Our Heritage Story
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Help */}
            <div className="space-y-3">
              <div>
                <h4 className="font-heading text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#2B231D]">
                  CUSTOMER HELP
                </h4>
                <div className="w-6 h-[1.5px] bg-gold mt-1.5" />
              </div>
              <ul className="space-y-3 text-xs sm:text-[13px] text-[#655B53] pt-1">
                <li>
                  <Link href="/faq" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    FAQs &amp; Support
                  </Link>
                </li>
                <li>
                  <a href="/#contact" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Shipping &amp; Handling
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Easy 7-Day Returns
                  </a>
                </li>
                <li>
                  <a href="/#shop" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Size Guide &amp; Fit
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Track Your Order
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#2B231D] hover:translate-x-0.5 transition-all inline-block">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* COLUMN 4: Get In Touch (lg: 2.5 cols) */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-3">
            <div>
              <h4 className="font-heading text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#2B231D]">
                GET IN TOUCH
              </h4>
              <div className="w-6 h-[1.5px] bg-gold mt-1.5" />
            </div>
            <div className="space-y-3.5 pt-1">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EDE4D6] flex items-center justify-center text-[#4A3525] flex-shrink-0 mt-0.5 shadow-sm">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <a
                    href={`tel:+91${contact.home_contact_phone.replace(/\D/g, '').slice(-10)}`}
                    className="text-xs sm:text-[13px] font-semibold text-[#2B231D] hover:text-[#4A3525] transition-colors block"
                  >
                    {contact.home_contact_phone}
                  </a>
                  <span className="text-[10.5px] text-[#8C8178] block">
                    Mon - Sat, 10:00 AM - 7:00 PM
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EDE4D6] flex items-center justify-center text-[#4A3525] flex-shrink-0 mt-0.5 shadow-sm">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <a
                    href={`mailto:${contact.home_contact_email}`}
                    className="text-xs sm:text-[13px] font-semibold text-[#2B231D] hover:text-[#4A3525] transition-colors block"
                  >
                    {contact.home_contact_email}
                  </a>
                  <span className="text-[10.5px] text-[#8C8178] block">
                    We reply within 24 hours
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EDE4D6] flex items-center justify-center text-[#4A3525] flex-shrink-0 mt-0.5 shadow-sm">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs sm:text-[13px] font-semibold text-[#2B231D] block">
                    {contact.home_contact_address}
                  </span>
                  <span className="text-[10.5px] text-[#8C8178] block">
                    Our Studio &amp; Head Office
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 5: "TRADITION MEETS MODERN LIVING" & Architectural Arch Photo (lg: 2 cols) */}
          <div className="lg:col-span-2 flex items-center justify-between sm:justify-start lg:justify-end gap-5 lg:gap-4 w-full pt-2 lg:pt-0">
            {/* Slogan with Gold Bar */}
            <div className="space-y-1 select-none">
              <p className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.24em] text-[#4A3525] uppercase leading-relaxed">
                TRADITION<br />
                MEETS<br />
                MODERN<br />
                LIVING
              </p>
              <div className="w-7 h-[2px] bg-gold mt-2" />
            </div>

            {/* Architectural Arch Photo */}
            <div className="relative w-28 sm:w-32 lg:w-36 h-36 sm:h-44 lg:h-48 rounded-t-full overflow-hidden shadow-md border-2 border-[#E2D7C7] flex-shrink-0 bg-cream-200">
              <Image
                src={contact.footer_arch_image || '/images/footer-arch.jpg'}
                alt="Tradition Meets Modern Living"
                fill
                sizes="(max-width: 640px) 120px, 150px"
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

        {/* BOTTOM BAR: Copyright, Trust Badges, Payment Methods, Policies, Back to Top */}
        <div className="pt-6 sm:pt-8 flex flex-col xl:flex-row items-center justify-between gap-4 sm:gap-6 text-xs text-[#655B53]">
          
          {/* Copyright */}
          <p className="text-[11px] sm:text-xs text-[#655B53] text-center xl:text-left whitespace-nowrap">
            © {new Date().getFullYear()} Al Hareer Ethnic Wear. All rights reserved.
          </p>

          {/* Policy Links & Back to Top */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <a href="#" className="hover:text-[#2B231D] transition-colors">
              Privacy Policy
            </a>
            <span className="text-[#D6C7B2]">|</span>
            <a href="#" className="hover:text-[#2B231D] transition-colors">
              Terms of Service
            </a>        
            <span className="text-[#D6C7B2]">|</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 font-semibold text-[#2B231D] hover:text-brand-500 transition-colors cursor-pointer"
            >
              Back to Top <ArrowUp className="w-3 h-3 ml-0.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
