'use client';

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Phone,
  Mail,
  Share2,
  Wallet,
  Sparkles,
  Check,
  AlertCircle,
  ShieldCheck,
  Loader2,
  ArrowUpRight,
  Globe,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, WhatsAppIcon } from '@/components/ui/SocialIcons';
import { updateBrandSetting, type BrandSettings } from '@/actions/admin/siteBrandSettings';

const CATEGORY_META = {
  brand: {
    label: 'Store Name & Tagline',
    badge: 'Basic Info',
    description: 'Your store name and short subtitle shown on the website.',
    icon: Building2,
    accentBg: 'bg-[#CFAC64]/10 text-[#B08F4F] border-[#CFAC64]/60',
  },
  contact: {
    label: 'Contact Information',
    badge: 'Phone & Email',
    description: 'Phone number, email, and WhatsApp for customer support.',
    icon: Phone,
    accentBg: 'bg-[#024F5F]/10 text-[#024F5F] border-[#CFAC64]/60',
  },
  social: {
    label: 'Social Media Links',
    badge: 'Social',
    description: 'Links to your Instagram, Facebook, and YouTube accounts.',
    icon: Share2,
    accentBg: 'bg-[#024F5F]/10 text-[#024F5F] border-[#CFAC64]/60',
  },
  checkout: {
    label: 'Payment Method',
    badge: 'Payments',
    description: 'Choose if customers can pay with Cash on Delivery (COD).',
    icon: Wallet,
    accentBg: 'bg-[#024F5F]/10 text-[#024F5F] border-[#CFAC64]/60',
  },
} as const;

const CATEGORY_ORDER: Array<keyof typeof CATEGORY_META> = ['brand', 'contact', 'social', 'checkout'];

type SaveResult = { category: string; success: boolean; error?: string };

export default function SettingsForm({ initialSettings }: { initialSettings: BrandSettings }) {
  const [settings, setSettings] = useState<BrandSettings>(initialSettings);
  const [savedSettings, setSavedSettings] = useState<BrandSettings>(initialSettings);
  const [pending, startTransition] = useTransition();
  const [savingCategory, setSavingCategory] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveResult | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleSaveSection = (category: string, keys: string[]) => {
    setSaveStatus(null);
    setSavingCategory(category);
    startTransition(async () => {
      const results = await Promise.all(keys.map((key) => updateBrandSetting(key, settings[key].value)));
      const failed = results.find((r) => !r.success);
      setSavingCategory(null);
      if (failed) {
        setSaveStatus({ category, success: false, error: failed.error });
      } else {
        setSavedSettings((prev) => {
          const next = { ...prev };
          keys.forEach((k) => {
            next[k] = { ...settings[k] };
          });
          return next;
        });
        setSaveStatus({ category, success: true });
        setTimeout(() => setSaveStatus(null), 3000);
      }
    });
  };

  // Group settings by category
  const grouped = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const [key, item] of Object.entries(settings)) {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(key);
    }
    return map;
  }, [settings]);

  // Check if a category has changes
  const hasChangesInCategory = (category: string) => {
    const keys = grouped[category] || [];
    return keys.some((k) => settings[k]?.value !== savedSettings[k]?.value);
  };

  const isCodActive = settings.cod_enabled?.value !== 'false';
  const isRazorpayActive = settings.razorpay_enabled?.value !== 'false';
  const hasWhatsApp = Boolean(settings.whatsapp_number?.value?.trim());
  const hasSupportEmail = Boolean(settings.contact_email?.value?.trim());
  const connectedSocialsCount = [
    settings.instagram_url?.value,
    settings.facebook_url?.value,
    settings.youtube_url?.value,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* 1. Store Summary Card */}
      <div className="rounded-2xl border border-cream-200/90 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#CFAC64] text-white font-heading font-bold text-lg text-gold">
              {(settings.brand_name?.value || 'AH').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-brand-700">
                  {settings.brand_name?.value || 'Al Hareer'}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F1EC] border border-[#CFAC64] px-2 py-0.5 text-[10px] font-bold text-[#024F5F]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#024F5F] animate-pulse" />
                  Live Store
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                {settings.tagline?.value || 'Tradition in Style'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`px-2.5 py-1 rounded-lg border font-medium ${
                isCodActive
                  ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]'
                  : 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]'
              }`}
            >
              COD: {isCodActive ? 'On' : 'Off'}
            </span>

            <span
              className={`px-2.5 py-1 rounded-lg border font-medium ${
                isRazorpayActive
                  ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]'
                  : 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]'
              }`}
            >
              Razorpay: {isRazorpayActive ? 'On' : 'Off'}
            </span>

            <span className="px-2.5 py-1 rounded-lg border border-cream-200 bg-cream-50 text-brand-700 font-medium">
              WhatsApp: {hasWhatsApp ? 'Set' : 'Not set'}
            </span>

            <span className="px-2.5 py-1 rounded-lg border border-cream-200 bg-cream-50 text-brand-700 font-medium">
              {connectedSocialsCount} Social Links
            </span>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-cream-300 bg-white text-brand-700 hover:bg-cream-50 font-semibold"
            >
              <Globe className="h-3.5 w-3.5 text-gold" />
              <span>Open Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Settings Sections */}
      <div className="space-y-5">
        {CATEGORY_ORDER.map((category) => {
          const keys = grouped[category] || [];
          if (!keys.length) return null;

          const meta = CATEGORY_META[category];
          const Icon = meta.icon;
          const isSaving = pending && savingCategory === category;
          const isCategoryModified = hasChangesInCategory(category);
          const currentResult = saveStatus?.category === category ? saveStatus : null;

          return (
            <div
              key={category}
              className={`rounded-2xl border bg-white shadow-xs transition-all ${
                isCategoryModified ? 'border-brand-400 ring-1 ring-brand-400/20' : 'border-cream-200/90'
              }`}
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200/80 p-4 sm:px-5 sm:py-3.5 bg-cream-50/40 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${meta.accentBg}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-sm sm:text-base font-bold text-brand-700">{meta.label}</h3>
                      {isCategoryModified && (
                        <span className="text-[10px] font-bold text-[#B08F4F] bg-[#F6F1EC] px-2 py-0.5 rounded-full">
                          ● Unsaved changes
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted">{meta.description}</p>
                  </div>
                </div>

                {/* Save Button & Feedback */}
                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  {currentResult && (
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        currentResult.success
                          ? 'bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64]'
                          : 'bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64]'
                      }`}
                    >
                      {currentResult.success ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#024F5F]" /> Saved successfully
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-[#024F5F]" /> {currentResult.error || 'Failed to save'}
                        </>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSaveSection(category, keys)}
                    disabled={isSaving}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all ${
                      isCategoryModified
                        ? 'bg-brand-600 hover:bg-brand-700 text-white'
                        : 'bg-cream-100 hover:bg-cream-200 text-brand-700 border border-cream-200'
                    } disabled:opacity-60`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" /> Save
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Section Body */}
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {keys.map((key) => {
                    const item = settings[key];

                    // Cash on Delivery Option
                    if (key === 'cod_enabled') {
                      const isOn = item.value !== 'false';
                      return (
                        <div key={key} className="sm:col-span-2">
                          <button
                            type="button"
                            onClick={() => handleChange(key, isOn ? 'false' : 'true')}
                            className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all ${
                              isOn
                                ? 'border-[#CFAC64] bg-[#F6F1EC]/60'
                                : 'border-cream-200 bg-cream-50/40'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-heading text-sm font-bold text-brand-700">
                                  Cash on Delivery (COD)
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    isOn
                                      ? 'bg-[#F6F1EC] text-[#024F5F]'
                                      : 'bg-cream-200 text-muted'
                                  }`}
                                >
                                  {isOn ? 'Active' : 'Turned Off'}
                                </span>
                              </div>
                              <p className="text-xs text-muted mt-1">
                                Allow customers to pay cash when their order arrives at their doorstep.
                              </p>
                            </div>

                            <span
                              className={`relative flex h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
                                isOn ? 'bg-[#024F5F]' : 'bg-cream-400'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                                  isOn ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </span>
                          </button>
                        </div>
                      );
                    }

                    // Online Payment (Razorpay) Option
                    if (key === 'razorpay_enabled') {
                      const isOn = item.value !== 'false';
                      return (
                        <div key={key} className="sm:col-span-2">
                          <button
                            type="button"
                            onClick={() => handleChange(key, isOn ? 'false' : 'true')}
                            className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all ${
                              isOn
                                ? 'border-[#CFAC64] bg-[#F6F1EC]/60'
                                : 'border-cream-200 bg-cream-50/40'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-heading text-sm font-bold text-brand-700">
                                  Online Payment (Razorpay)
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    isOn
                                      ? 'bg-[#F6F1EC] text-[#024F5F]'
                                      : 'bg-cream-200 text-muted'
                                  }`}
                                >
                                  {isOn ? 'Active' : 'Turned Off'}
                                </span>
                              </div>
                              <p className="text-xs text-muted mt-1">
                                Allow customers to pay by UPI, Card, or Net Banking via Razorpay.
                              </p>
                            </div>

                            <span
                              className={`relative flex h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
                                isOn ? 'bg-[#024F5F]' : 'bg-cream-400'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                                  isOn ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </span>
                          </button>
                        </div>
                      );
                    }

                    // Field Configurations in Simple English
                    let iconNode = <Building2 className="h-4 w-4 text-muted" />;
                    let placeholder = 'Enter here';
                    let label = key;
                    let helperText = '';
                    let isUrl = false;

                    if (key === 'brand_name') {
                      iconNode = <Building2 className="h-4 w-4 text-[#B08F4F]" />;
                      placeholder = 'Al Hareer';
                      label = 'Store Name';
                      helperText = 'Shown on the website logo and header.';
                    } else if (key === 'tagline') {
                      iconNode = <Sparkles className="h-4 w-4 text-[#B08F4F]" />;
                      placeholder = 'Tradition in Style';
                      label = 'Store Tagline';
                      helperText = 'Short subtitle shown under your store name.';
                    } else if (key === 'contact_email') {
                      iconNode = <Mail className="h-4 w-4 text-[#024F5F]" />;
                      placeholder = 'support@alhareer.com';
                      label = 'Support Email';
                      helperText = 'Email where customers can reach you.';
                    } else if (key === 'contact_phone') {
                      iconNode = <Phone className="h-4 w-4 text-[#024F5F]" />;
                      placeholder = '+91 98765 43210';
                      label = 'Phone Number';
                      helperText = 'Contact phone number shown on the website.';
                    } else if (key === 'whatsapp_number') {
                      iconNode = <WhatsAppIcon className="h-4 w-4 text-[#024F5F]" />;
                      placeholder = '919876543210';
                      label = 'WhatsApp Number';
                      helperText = 'Number for WhatsApp chat button (include country code, like 919876543210).';
                    } else if (key === 'instagram_url') {
                      iconNode = <InstagramIcon className="h-4 w-4 text-[#024F5F]" />;
                      placeholder = 'https://instagram.com/alhareer';
                      label = 'Instagram Link';
                      isUrl = true;
                    } else if (key === 'facebook_url') {
                      iconNode = <FacebookIcon className="h-4 w-4 text-[#024F5F]" />;
                      placeholder = 'https://facebook.com/alhareer';
                      label = 'Facebook Link';
                      isUrl = true;
                    } else if (key === 'youtube_url') {
                      iconNode = <YoutubeIcon className="h-4 w-4 text-[#024F5F]" />;
                      placeholder = 'https://youtube.com/@alhareer';
                      label = 'YouTube Link';
                      isUrl = true;
                    }

                    return (
                      <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-brand-700">
                            {label}
                          </label>
                          {isUrl && item.value && (
                            <a
                              href={item.value}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-500 hover:text-brand-700 transition-colors"
                            >
                              Open link <ArrowUpRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        <div className="relative flex items-center">
                          <div className="absolute left-3.5 flex items-center pointer-events-none">
                            {iconNode}
                          </div>
                          <input
                            type={key === 'contact_email' ? 'email' : 'text'}
                            value={item.value || ''}
                            onChange={(e) => handleChange(key, e.target.value)}
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-cream-200 bg-cream-50/40 pl-10 pr-4 py-2 text-base sm:text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all font-medium"
                          />
                        </div>

                        {helperText && (
                          <p className="text-[11px] text-muted leading-relaxed">
                            {helperText}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
