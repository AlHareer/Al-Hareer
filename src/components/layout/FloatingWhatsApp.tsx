'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp, Phone } from 'lucide-react';
import { getFooterSettings } from '@/lib/siteSettings';

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [phone, setPhone] = useState('+91 73966 90308');

  // Hide on all admin dashboard routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    getFooterSettings()
      .then((s) => setPhone(s.home_contact_phone))
      .catch(() => {});
  }, []);

  const digits = phone.replace(/\D/g, '').slice(-10);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <aside
      aria-label="Floating Quick Actions"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 select-none"
    >
      {/* 1. SCROLL TO TOP BUTTON (Appears when scrolled down) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F6F1EC] hover:bg-[#B08F4F] text-[#024F5F] hover:text-white border border-[#CFAC64] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group animate-in fade-in zoom-in duration-300"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.2] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* 2. DIRECT CALL BUTTON */}
      <a
        href={`tel:+91${digits}`}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#CFAC64] hover:bg-[#CFAC64] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer border border-[#CFAC64]/30"
        aria-label="Call Al Hareer Customer Care"
      >
        <Phone className="w-5 h-5 stroke-[2] group-hover:rotate-12 transition-transform" />
      </a>

      {/* 3. WHATSAPP CHAT BUTTON (USING USER'S CUSTOM SVG) */}
      <a
        href={`https://wa.me/91${digits}?text=Hi%20Al%20Hareer,%20I'd%20like%20to%20know%20more%20about%20your%20Kurta%20Pajama%20collection!`}
        target="_blank"
        rel="noreferrer"
        className="relative block rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-xl cursor-pointer"
        aria-label="Chat with Al Hareer on WhatsApp"
      >
        {/* User's Exact Custom WhatsApp SVG */}
        <svg
          className="w-12 h-12 sm:w-13 sm:h-13 transition-transform duration-300"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
            fill="#CFAC64"
          />
          <path
            d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
            fill="url(#paint0_linear_whatsapp_custom)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.1894 29.3854 13.5046 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
            fill="white"
          />
          <path
            d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_whatsapp_custom"
              x1="26.5"
              y1="7"
              x2="4"
              y2="28"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#024F5F" />
              <stop offset="1" stopColor="#024F5F" />
            </linearGradient>
          </defs>
        </svg>
      </a>
    </aside>
  );
}
