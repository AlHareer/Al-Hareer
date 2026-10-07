'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, WhatsAppIcon } from '@/components/ui/SocialIcons';
import { useUI } from '@/context/UIContext';
import type { ContentSettings } from '@/lib/siteSettings';
import { submitInquiry } from '@/actions/customerContact';

export default function ContactSection({ settings }: { settings: ContentSettings }) {
  const { showToast } = useUI();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await submitInquiry(formData);
    setIsSubmitting(false);

    if (!result.success) {
      showToast(result.error || 'Failed to send your message. Please try again.', 'error');
      return;
    }

    showToast('✉️ Message sent successfully! Our stylist will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <section id="contact" className="py-10 sm:py-16 md:py-14 bg-[#024F5F]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-[11px] uppercase tracking-[2.5px] font-semibold text-[#CFAC64] mb-2">— GET IN TOUCH</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {settings.home_contact_heading}
          </h2>
          <p className="text-sm sm:text-base text-white/85 mt-2">
            {settings.home_contact_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-cream-200 p-8 sm:p-10 rounded-2xl border border-cream-300 shadow-sm space-y-8">
            <div>
              <h3 className="font-heading text-2xl font-bold text-brand-700">
                Contact Information
              </h3>
              <p className="text-sm text-muted mt-1">
                Our support stylists are dedicated to ensuring a seamless experience.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 border border-cream-300 flex items-center justify-center text-brand-500 flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-brand-700 uppercase tracking-wide">
                    Call Us
                  </h4>
                  <a
                    href={`tel:+91${settings.home_contact_phone.replace(/\D/g, '').slice(-10)}`}
                    className="text-sm text-muted hover:text-brand-500 font-medium transition-colors"
                  >
                    {settings.home_contact_phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 border border-cream-300 flex items-center justify-center text-brand-500 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-brand-700 uppercase tracking-wide">
                    Email Us
                  </h4>
                  <a
                    href={`mailto:${settings.home_contact_email}`}
                    className="text-sm text-muted hover:text-brand-500 font-medium transition-colors"
                  >
                    {settings.home_contact_email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-100 border border-cream-300 flex items-center justify-center text-brand-500 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-brand-700 uppercase tracking-wide">
                    Business Hours
                  </h4>
                  <p className="text-sm text-muted">
                    {settings.home_contact_hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-4 border-t border-cream-300">
              <h5 className="text-xs uppercase font-bold tracking-wider text-brand-700 mb-3">
                Follow Al Hareer
              </h5>
              <div className="flex items-center gap-3">
                {(settings.instagram_url || 'https://instagram.com') !== '#' && (
                  <a
                    href={settings.instagram_url || 'https://instagram.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white border border-cream-300 flex items-center justify-center text-brand-700 hover:bg-[#B08F4F] hover:text-white transition-all shadow-sm"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
                {(settings.facebook_url || 'https://facebook.com') !== '#' && (
                  <a
                    href={settings.facebook_url || 'https://facebook.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white border border-cream-300 flex items-center justify-center text-brand-700 hover:bg-[#B08F4F] hover:text-white transition-all shadow-sm"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
                {(settings.youtube_url || 'https://youtube.com') !== '#' && (
                  <a
                    href={settings.youtube_url || 'https://youtube.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white border border-cream-300 flex items-center justify-center text-brand-700 hover:bg-[#B08F4F] hover:text-white transition-all shadow-sm"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`https://wa.me/${settings.whatsapp_number || `91${settings.home_contact_phone?.replace(/\D/g, '').slice(-10)}`}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-cream-300 flex items-center justify-center text-brand-700 hover:bg-[#B08F4F] hover:text-white transition-all shadow-sm"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-cream-300 shadow-sm">
            <h3 className="font-heading text-2xl font-bold text-brand-700 mb-6">
              Send Us A Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-cream-300 bg-cream-50 focus:bg-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. name@example.com"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-cream-300 bg-cream-50 focus:bg-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 73966 90308"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-cream-300 bg-cream-50 focus:bg-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Custom Sizing / Order Query"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-cream-300 bg-cream-50 focus:bg-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with your traditional wardrobe?"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-cream-300 bg-cream-50 focus:bg-white focus:outline-none focus:border-brand-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-primary px-8 py-3.5 text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
