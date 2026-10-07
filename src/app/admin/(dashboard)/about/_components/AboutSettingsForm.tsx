'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  AlertCircle,
  Megaphone,
  ShieldCheck,
  Layers,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RotateCcw,
  Shirt,
  Scissors,
  Leaf,
  Award,
  Sparkles,
} from 'lucide-react';
import { updateSiteSetting } from '@/actions/admin/siteSettings';
import { ABOUT_SETTINGS_DEFAULTS, type SiteSettingsDefaults } from '@/lib/siteSettingsSchema';
import ImageUploader from '@/components/admin/ImageUploader';

const inputClass =
  'w-full rounded-xl border border-cream-200 bg-cream-50/50 px-3.5 py-2.5 text-base sm:text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all';
const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted';

const PILLAR_ICONS = [Shirt, Scissors, Leaf, Award];

type AboutTab = 'hero' | 'pillars' | 'process' | 'stats' | 'cta';

const TAB_CONFIG: {
  id: AboutTab;
  step: string;
  label: string;
  desc: string;
  icon: any;
  fields: string[];
}[] = [
  {
    id: 'hero',
    step: 'Intro',
    label: 'Top Banner',
    desc: 'Main title & subtitle',
    icon: Megaphone,
    fields: [
      'about_hero_eyebrow',
      'about_hero_title',
      'about_hero_subtitle',
      'about_hero_calligraphy_line1',
      'about_hero_calligraphy_line2',
      'about_hero_image',
    ],
  },
  {
    id: 'pillars',
    step: 'Pillars',
    label: 'Four Pillars',
    desc: '4 core brand differences',
    icon: ShieldCheck,
    fields: [
      'about_pillars_eyebrow',
      'about_pillars_heading',
      'about_pillars_subtitle',
      'about_pillars_items',
    ],
  },
  {
    id: 'process',
    step: 'Process',
    label: 'Artisanal Journey',
    desc: '4 production steps (01-04)',
    icon: Layers,
    fields: [
      'about_process_eyebrow',
      'about_process_heading',
      'about_process_subtitle',
      'about_process_items',
    ],
  },
  {
    id: 'stats',
    step: 'Stats',
    label: 'Stats Strip',
    desc: '4 social proof metrics',
    icon: BarChart3,
    fields: ['about_stats_items'],
  },
  {
    id: 'cta',
    step: 'CTA',
    label: 'Bottom Banner',
    desc: 'Shop invitation & button',
    icon: ArrowRight,
    fields: ['about_cta_heading', 'about_cta_subtitle', 'about_cta_button_text'],
  },
];

export default function AboutSettingsForm({ settings }: { settings: SiteSettingsDefaults }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<{ success: boolean; error?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<AboutTab>('hero');

  // Initial values map
  const initialValues = useMemo(() => {
    const initial: Record<string, string> = {};
    for (const key of Object.keys(ABOUT_SETTINGS_DEFAULTS)) {
      initial[key] = settings[key]?.value ?? ABOUT_SETTINGS_DEFAULTS[key].value;
    }
    return initial;
  }, [settings]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const handleChange = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  // Track modified fields count overall
  const dirtyCount = useMemo(() => {
    let count = 0;
    for (const key of Object.keys(initialValues)) {
      if (values[key] !== initialValues[key]) count++;
    }
    return count;
  }, [values, initialValues]);

  // Track modified status per tab
  const dirtyTabs = useMemo(() => {
    const dirtySet = new Set<AboutTab>();
    for (const tab of TAB_CONFIG) {
      for (const field of tab.fields) {
        if (values[field] !== initialValues[field]) {
          dirtySet.add(tab.id);
          break;
        }
      }
    }
    return dirtySet;
  }, [values, initialValues]);

  const handleReset = () => {
    setValues(initialValues);
    setSaved(null);
  };

  // Helper for JSON parsed items
  const jsonItems = (key: string, expectedLength: number = 4): Record<string, string>[] => {
    try {
      const parsed = JSON.parse(values[key] || ABOUT_SETTINGS_DEFAULTS[key].value);
      return Array.isArray(parsed) && parsed.length === expectedLength
        ? parsed
        : JSON.parse(ABOUT_SETTINGS_DEFAULTS[key].value);
    } catch {
      return JSON.parse(ABOUT_SETTINGS_DEFAULTS[key].value);
    }
  };

  const updateJsonItem = (key: string, idx: number, field: string, val: string, expectedLength: number = 4) => {
    const current = jsonItems(key, expectedLength);
    const updated = current.map((item, i) => (i === idx ? { ...item, [field]: val } : item));
    handleChange(key, JSON.stringify(updated));
  };

  const handleSave = () => {
    setSaved(null);
    startTransition(async () => {
      const keys = Object.keys(ABOUT_SETTINGS_DEFAULTS);
      const results = await Promise.all(keys.map((key) => updateSiteSetting(key, values[key])));
      const failed = results.find((r) => !r.success);
      if (failed) {
        setSaved({ success: false, error: failed.error });
      } else {
        setSaved({ success: true });
        router.refresh();
        setTimeout(() => setSaved(null), 3000);
      }
    });
  };

  const currentTabIdx = TAB_CONFIG.findIndex((t) => t.id === activeTab);
  const prevTab = currentTabIdx > 0 ? TAB_CONFIG[currentTabIdx - 1] : null;
  const nextTab = currentTabIdx < TAB_CONFIG.length - 1 ? TAB_CONFIG[currentTabIdx + 1] : null;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Mobile-Responsive Controls & Sticky Save Bar */}
      <div className="bg-white rounded-2xl border border-cream-200/90 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                dirtyCount > 0 ? 'bg-[#CFAC64] animate-pulse' : 'bg-[#024F5F]'
              }`}
            />
            <p className="text-xs sm:text-sm text-brand-700 font-medium">
              {dirtyCount > 0 ? (
                <span>
                  <strong className="text-[#B08F4F]">{dirtyCount} unsaved</strong> changes
                </span>
              ) : (
                <span className="text-muted text-xs">All About page sections in sync</span>
              )}
            </p>
          </div>

          {/* Quick Discard Button for Mobile */}
          {dirtyCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              disabled={pending}
              className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-muted hover:text-brand-700 bg-cream-100 hover:bg-cream-200 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Discard</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
          {saved && (
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl truncate ${
                saved.success
                  ? 'text-[#024F5F] bg-[#F6F1EC] border border-[#CFAC64]'
                  : 'text-[#024F5F] bg-[#F6F1EC] border border-[#CFAC64]'
              }`}
            >
              {saved.success ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#024F5F] shrink-0" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3.5 w-3.5 text-[#024F5F] shrink-0" />
                  <span>{saved.error}</span>
                </>
              )}
            </span>
          )}

          {/* Desktop Discard Button */}
          {dirtyCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              disabled={pending}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted hover:text-brand-700 hover:bg-cream-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Discard</span>
            </button>
          )}

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-700 hover:to-brand-600 shadow-sm transition-all disabled:opacity-60 active:scale-[0.98]"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Saving…</span>
              </>
            ) : (
              'Save About Page'
            )}
          </button>
        </div>
      </div>

      {/* 1. MOBILE TABS: Smooth Horizontal Scroll Strip (< md) */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-3 px-3.5 scroll-smooth">
          {TAB_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDirty = dirtyTabs.has(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all select-none active:scale-95 ${
                  isActive
                    ? 'bg-brand-700 text-white border-brand-700 shadow-sm ring-2 ring-gold/40'
                    : 'bg-white text-brand-700 border-cream-200/90 hover:bg-cream-50'
                }`}
              >
                {isDirty && (
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#CFAC64] ring-2 ring-white"
                    title="Unsaved changes"
                  />
                )}

                <span
                  className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-gold' : 'bg-cream-100 text-muted'
                  }`}
                >
                  {tab.step}
                </span>

                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-gold' : 'text-muted'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DESKTOP TABS: 5-Column Card Grid (>= md) */}
      <div className="hidden md:grid md:grid-cols-5 gap-2.5">
        {TAB_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDirty = dirtyTabs.has(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all group ${
                isActive
                  ? 'bg-brand-700 text-white border-brand-700 shadow-md ring-2 ring-gold/40'
                  : 'bg-white text-brand-700 border-cream-200/90 hover:border-gold/50 hover:bg-cream-50/70 shadow-xs'
              }`}
            >
              {isDirty && (
                <span
                  className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#CFAC64] ring-2 ring-white"
                  title="Unsaved changes in this tab"
                />
              )}

              <div className="flex items-center gap-1.5 mb-1.5 w-full">
                <span
                  className={`text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-white/20 text-gold'
                      : 'bg-cream-100 text-muted group-hover:bg-cream-200'
                  }`}
                >
                  {tab.step}
                </span>
                <Icon
                  className={`h-3.5 w-3.5 ml-auto ${
                    isActive ? 'text-gold' : 'text-muted-light group-hover:text-brand-500'
                  }`}
                />
              </div>

              <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-brand-700'}`}>
                {tab.label}
              </span>
              <span className={`text-[10px] truncate max-w-full mt-0.5 ${isActive ? 'text-white/70' : 'text-muted'}`}>
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TOP HERO BANNER */}
      {activeTab === 'hero' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-4 sm:space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gold bg-brand-700 px-2 py-0.5 rounded-full">
                  SECTION 01
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  Top Intro Banner
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The top entrance of <code className="text-brand-600 bg-cream-100 px-1 py-0.5 rounded text-[10px] sm:text-xs">/about</code> featuring the atelier arch backdrop.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            <div>
              <label className={labelClass}>Eyebrow Tag</label>
              <input
                value={values.about_hero_eyebrow ?? ''}
                onChange={(e) => handleChange('about_hero_eyebrow', e.target.value)}
                placeholder="ABOUT US"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Main Title</label>
              <input
                value={values.about_hero_title ?? ''}
                onChange={(e) => handleChange('about_hero_title', e.target.value)}
                placeholder="About Al Hareer"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input
                value={values.about_hero_subtitle ?? ''}
                onChange={(e) => handleChange('about_hero_subtitle', e.target.value)}
                placeholder="Good Clothes, Made Well"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            <div>
              <label className={labelClass}>Calligraphy — Line 1</label>
              <input
                value={values.about_hero_calligraphy_line1 ?? ''}
                onChange={(e) => handleChange('about_hero_calligraphy_line1', e.target.value)}
                placeholder="Tradition"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Calligraphy — Line 2</label>
              <input
                value={values.about_hero_calligraphy_line2 ?? ''}
                onChange={(e) => handleChange('about_hero_calligraphy_line2', e.target.value)}
                placeholder="In Style"
                className={inputClass}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-cream-200/60">
            <label className={labelClass}>Hero Background Image</label>
            <p className="text-[11px] text-muted mb-2">
              Arch architectural photo shown on the right side of the banner. Leave empty to use the default image.
            </p>
            <ImageUploader
              value={values.about_hero_image || null}
              onChange={(v) => handleChange('about_hero_image', typeof v === 'string' ? v : '')}
              folder="about"
              multiple={false}
            />
          </div>

          {/* Banner Mini Preview */}
          <div className="rounded-xl p-4 sm:p-5 bg-[#F6F1EC] border border-cream-300 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">
              {values.about_hero_eyebrow || 'ABOUT US'}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-brand-700">
              {values.about_hero_title || 'About Al Hareer'}
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              {values.about_hero_subtitle || 'Good Clothes, Made Well'}
            </p>
          </div>
        </section>
      )}

      {/* TAB 2: FOUR PILLARS */}
      {activeTab === 'pillars' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#B08F4F] bg-[#F6F1EC] border border-[#CFAC64] px-2 py-0.5 rounded-full">
                  SECTION 02
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  Our Four Pillars
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The 4 distinguishing values that set Al Hareer apart from commercial apparel.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>Section Eyebrow</label>
              <input
                value={values.about_pillars_eyebrow ?? ''}
                onChange={(e) => handleChange('about_pillars_eyebrow', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Section Headline</label>
              <input
                value={values.about_pillars_heading ?? ''}
                onChange={(e) => handleChange('about_pillars_heading', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Section Subtitle</label>
              <input
                value={values.about_pillars_subtitle ?? ''}
                onChange={(e) => handleChange('about_pillars_subtitle', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* 4 Pillar Cards Editor */}
          <div className="pt-2 border-t border-cream-200/60 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              4 Signature Pillar Cards
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {jsonItems('about_pillars_items', 4).map((pillar, idx) => {
                const Icon = PILLAR_ICONS[idx] || ShieldCheck;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-cream-50/60 border border-cream-200/90 space-y-3 hover:border-gold/40 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-brand-700 text-gold shadow-xs">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold text-brand-700">
                          Pillar #{idx + 1}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted">Fixed Icon</span>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      <div>
                        <label className={labelClass}>Pillar Badge</label>
                        <input
                          value={pillar.badge ?? ''}
                          onChange={(e) =>
                            updateJsonItem('about_pillars_items', idx, 'badge', e.target.value, 4)
                          }
                          placeholder="e.g. Flawless Fit"
                          className="w-full rounded-lg border border-cream-200 bg-white px-2.5 py-2 text-base sm:text-xs font-bold text-brand-700"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Pillar Title</label>
                        <input
                          value={pillar.title ?? ''}
                          onChange={(e) =>
                            updateJsonItem('about_pillars_items', idx, 'title', e.target.value, 4)
                          }
                          placeholder="Bespoke Tailored Silhouette"
                          className="w-full rounded-lg border border-cream-200 bg-white px-2.5 py-2 text-base sm:text-xs font-semibold text-brand-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Pillar Description</label>
                      <textarea
                        rows={2}
                        value={pillar.desc ?? ''}
                        onChange={(e) =>
                          updateJsonItem('about_pillars_items', idx, 'desc', e.target.value, 4)
                        }
                        placeholder="Describe this pillar promise..."
                        className="w-full rounded-lg border border-cream-200 bg-white p-2.5 text-base sm:text-xs text-brand-700 leading-relaxed"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: ARTISANAL JOURNEY */}
      {activeTab === 'process' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-brand-600 bg-brand-500/10 border border-brand-200 px-2 py-0.5 rounded-full">
                  SECTION 03
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  The Artisanal Journey (Process Steps)
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The 4 step sequential manufacturing journey (01 Yarn, 02 Weaving, 03 Tailoring, 04 Packaging).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>Section Eyebrow</label>
              <input
                value={values.about_process_eyebrow ?? ''}
                onChange={(e) => handleChange('about_process_eyebrow', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Section Headline</label>
              <input
                value={values.about_process_heading ?? ''}
                onChange={(e) => handleChange('about_process_heading', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Section Subtitle</label>
              <input
                value={values.about_process_subtitle ?? ''}
                onChange={(e) => handleChange('about_process_subtitle', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* 4 Process Steps Editor */}
          <div className="pt-2 border-t border-cream-200/60 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              4 Step Artisanal Journey
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {jsonItems('about_process_items', 4).map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-cream-50/60 border border-cream-200/90 space-y-3 hover:border-gold/40 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold text-brand-800 bg-brand-100 border border-brand-200">
                      Step 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-gold uppercase">
                      Sequence #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <label className={labelClass}>Step Title</label>
                    <input
                      value={step.title ?? ''}
                      onChange={(e) =>
                        updateJsonItem('about_process_items', idx, 'title', e.target.value, 4)
                      }
                      placeholder="e.g. Traditional Loom Weaving"
                      className="w-full rounded-lg border border-cream-200 bg-white px-2.5 py-2 text-base sm:text-xs font-bold text-brand-700"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Step Description</label>
                    <textarea
                      rows={2}
                      value={step.desc ?? ''}
                      onChange={(e) =>
                        updateJsonItem('about_process_items', idx, 'desc', e.target.value, 4)
                      }
                      placeholder="Describe what happens in this step..."
                      className="w-full rounded-lg border border-cream-200 bg-white p-2.5 text-base sm:text-xs text-brand-700 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: STATS STRIP */}
      {activeTab === 'stats' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#024F5F] bg-[#F6F1EC] border border-[#CFAC64] px-2 py-0.5 rounded-full">
                  SECTION 04
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  Social Proof Stats Strip
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The 4 trust metric cards (Handloom, Customers, Weavers, Ratings) displayed on <code className="text-brand-600 bg-cream-100 px-1 py-0.5 rounded text-[10px] sm:text-xs">/about</code>.
              </p>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {jsonItems('about_stats_items', 4).map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-cream-50/70 border border-cream-200 space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                    Stat Metric #{idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#024F5F]">
                    {stat.value || 'Value'}
                  </span>
                </div>

                <div>
                  <label className={labelClass}>Metric Value (e.g. 100%, 50k+, 4.9★)</label>
                  <input
                    value={stat.value ?? ''}
                    onChange={(e) =>
                      updateJsonItem('about_stats_items', idx, 'value', e.target.value, 4)
                    }
                    className="w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-base sm:text-sm font-bold text-brand-700"
                  />
                </div>

                <div>
                  <label className={labelClass}>Metric Label</label>
                  <input
                    value={stat.label ?? ''}
                    onChange={(e) =>
                      updateJsonItem('about_stats_items', idx, 'label', e.target.value, 4)
                    }
                    className="w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-base sm:text-xs text-brand-700"
                  />
                </div>

                <div>
                  <label className={labelClass}>Description Line</label>
                  <input
                    value={stat.desc ?? ''}
                    onChange={(e) =>
                      updateJsonItem('about_stats_items', idx, 'desc', e.target.value, 4)
                    }
                    className="w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-base sm:text-xs text-muted"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: FOOTER CALL TO ACTION */}
      {activeTab === 'cta' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded-full">
                  SECTION 05
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  Bottom Call-to-Action Banner
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The final shop invitation banner at the base of <code className="text-brand-600 bg-cream-100 px-1 py-0.5 rounded text-[10px] sm:text-xs">/about</code>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>Headline</label>
              <input
                value={values.about_cta_heading ?? ''}
                onChange={(e) => handleChange('about_cta_heading', e.target.value)}
                placeholder="Shop Al Hareer"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input
                value={values.about_cta_subtitle ?? ''}
                onChange={(e) => handleChange('about_cta_subtitle', e.target.value)}
                placeholder="Kurtas, kurta sets, and waistcoats, made by hand."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Button Text</label>
              <input
                value={values.about_cta_button_text ?? ''}
                onChange={(e) => handleChange('about_cta_button_text', e.target.value)}
                placeholder="Shop Now"
                className={inputClass}
              />
            </div>
          </div>

          {/* Mini Preview of CTA */}
          <div className="rounded-xl p-4 sm:p-5 bg-[#00303A] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#CFAC64]/30 shadow-md text-center sm:text-left">
            <div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-[#F6F1EC]">
                {values.about_cta_heading || 'Shop Al Hareer'}
              </h4>
              <p className="text-xs text-white/70 mt-0.5">
                {values.about_cta_subtitle || 'Kurtas, kurta sets, and waistcoats, made by hand.'}
              </p>
            </div>
            <span className="w-full sm:w-auto text-center px-4 py-2 rounded-xl text-xs font-semibold text-[#00303A] bg-gradient-to-r from-[#CFAC64] to-[#CFAC64] shadow-xs pointer-events-none whitespace-nowrap">
              {values.about_cta_button_text || 'Shop Now'} &rarr;
            </span>
          </div>
        </section>
      )}

      {/* Bottom Step Navigation Bar (100% Mobile Responsive) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          {prevTab ? (
            <button
              type="button"
              onClick={() => setActiveTab(prevTab.id)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-brand-700 bg-white border border-cream-200 hover:bg-cream-50 shadow-xs transition-all active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Back: {prevTab.step}</span>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextTab && (
            <button
              type="button"
              onClick={() => setActiveTab(nextTab.id)}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-brand-700 bg-cream-100 hover:bg-cream-200 border border-cream-300/80 shadow-xs transition-all active:scale-95 ${
                !prevTab ? 'col-span-2' : ''
              }`}
            >
              <span className="truncate">Next: {nextTab.step}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </button>
          )}
        </div>

        {/* Save button at bottom */}
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#CFAC64] hover:bg-[#B08F4F] shadow-sm transition-all disabled:opacity-60 active:scale-95"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span>Saving…</span>
            </>
          ) : (
            'Save About Page'
          )}
        </button>
      </div>
    </div>
  );
}
