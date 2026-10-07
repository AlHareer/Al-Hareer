'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  AlertCircle,
  Megaphone,
  BookOpen,
  Users,
  Milestone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Quote,
  Feather,
  Scissors,
  Compass,
  Award,
  RotateCcw,
} from 'lucide-react';
import { updateSiteSetting } from '@/actions/admin/siteSettings';
import { STORY_SETTINGS_DEFAULTS, type SiteSettingsDefaults } from '@/lib/siteSettingsSchema';
import ImageUploader from '@/components/admin/ImageUploader';

const inputClass =
  'w-full rounded-xl border border-cream-200 bg-cream-50/50 px-3.5 py-2.5 text-base sm:text-sm text-brand-700 placeholder:text-muted focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all';
const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted';

const VALUE_ICONS = [Feather, Scissors, Compass, Award];

type ChapterTab = 'hero' | 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'cta';

const TAB_CONFIG: {
  id: ChapterTab;
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
    desc: 'Main title & arch header',
    icon: Megaphone,
    fields: [
      'story_hero_eyebrow',
      'story_hero_title',
      'story_hero_subtitle',
      'story_hero_calligraphy_line1',
      'story_hero_calligraphy_line2',
      'story_hero_image',
    ],
  },
  {
    id: 'ch1',
    step: 'Ch 01',
    label: 'The Genesis',
    desc: 'Why we started & pull-quote',
    icon: BookOpen,
    fields: [
      'story_ch1_eyebrow',
      'story_ch1_heading',
      'story_ch1_paragraph1',
      'story_ch1_paragraph2',
      'story_ch1_quote',
      'story_ch1_quote_attribution',
      'story_ch1_image1',
      'story_ch1_image1_caption',
      'story_ch1_image2',
      'story_ch1_image2_caption',
    ],
  },
  {
    id: 'ch2',
    step: 'Ch 02',
    label: 'The Weavers',
    desc: 'Artisans & 2 slow stats',
    icon: Users,
    fields: [
      'story_ch2_eyebrow',
      'story_ch2_heading',
      'story_ch2_paragraph1',
      'story_ch2_paragraph2',
      'story_ch2_weaver_name',
      'story_ch2_weaver_desc',
      'story_ch2_stats_items',
      'story_ch2_image',
    ],
  },
  {
    id: 'ch3',
    step: 'Ch 03',
    label: 'Milestones',
    desc: '4 timeline milestones',
    icon: Milestone,
    fields: [
      'story_ch3_eyebrow',
      'story_ch3_heading',
      'story_ch3_subtitle',
      'story_milestones_items',
    ],
  },
  {
    id: 'ch4',
    step: 'Ch 04',
    label: 'Core Values',
    desc: '4 philosophy pillars',
    icon: ShieldCheck,
    fields: ['story_ch4_eyebrow', 'story_ch4_heading', 'story_values_items'],
  },
  {
    id: 'cta',
    step: 'CTA',
    label: 'Footer Banner',
    desc: 'Bottom call to action',
    icon: ArrowRight,
    fields: ['story_cta_heading', 'story_cta_subtitle', 'story_cta_button1_text', 'story_cta_button2_text'],
  },
];

export default function StorySettingsForm({ settings }: { settings: SiteSettingsDefaults }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<{ success: boolean; error?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<ChapterTab>('hero');

  // Initial values map
  const initialValues = useMemo(() => {
    const initial: Record<string, string> = {};
    for (const key of Object.keys(STORY_SETTINGS_DEFAULTS)) {
      initial[key] = settings[key]?.value ?? STORY_SETTINGS_DEFAULTS[key].value;
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
    const dirtySet = new Set<ChapterTab>();
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
  const jsonItems = (key: string, expectedLength: number): Record<string, string>[] => {
    try {
      const parsed = JSON.parse(values[key] || STORY_SETTINGS_DEFAULTS[key].value);
      return Array.isArray(parsed) && parsed.length === expectedLength
        ? parsed
        : JSON.parse(STORY_SETTINGS_DEFAULTS[key].value);
    } catch {
      return JSON.parse(STORY_SETTINGS_DEFAULTS[key].value);
    }
  };

  const updateJsonItem = (key: string, idx: number, field: string, val: string, expectedLength: number) => {
    const current = jsonItems(key, expectedLength);
    const updated = current.map((item, i) => (i === idx ? { ...item, [field]: val } : item));
    handleChange(key, JSON.stringify(updated));
  };

  const handleSave = () => {
    setSaved(null);
    startTransition(async () => {
      const keys = Object.keys(STORY_SETTINGS_DEFAULTS);
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
                <span className="text-muted text-xs">All chapters in sync</span>
              )}
            </p>
          </div>

          {/* Quick Discard Button for Mobile (top right) */}
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

          {/* Save Button (Full width on mobile) */}
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
              'Save Story Page'
            )}
          </button>
        </div>
      </div>

      {/* 1. MOBILE TABS: Smooth Horizontal Scroll Strip (Visible on mobile/tablet) */}
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
                {/* Unsaved Dot */}
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

      {/* 2. DESKTOP TABS: 6-Column Card Grid (Visible on Desktop) */}
      <div className="hidden md:grid md:grid-cols-6 gap-2">
        {TAB_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDirty = dirtyTabs.has(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-start p-3 rounded-2xl border text-left transition-all group ${
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

      {/* TAB 1: TOP BANNER (HERO) */}
      {activeTab === 'hero' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-4 sm:space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gold bg-brand-700 px-2 py-0.5 rounded-full">
                  INTRO
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  Top Hero Banner
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The top entrance of <code className="text-brand-600 bg-cream-100 px-1 py-0.5 rounded text-[10px] sm:text-xs">/story</code> with the arched architectural graphic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            <div>
              <label className={labelClass}>Eyebrow Tag</label>
              <input
                value={values.story_hero_eyebrow ?? ''}
                onChange={(e) => handleChange('story_hero_eyebrow', e.target.value)}
                placeholder="OUR STORY"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Main Title</label>
              <input
                value={values.story_hero_title ?? ''}
                onChange={(e) => handleChange('story_hero_title', e.target.value)}
                placeholder="Our Story"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle Tagline</label>
              <input
                value={values.story_hero_subtitle ?? ''}
                onChange={(e) => handleChange('story_hero_subtitle', e.target.value)}
                placeholder="Rooted in Tradition. Styled for Today."
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            <div>
              <label className={labelClass}>Calligraphy — Line 1</label>
              <input
                value={values.story_hero_calligraphy_line1 ?? ''}
                onChange={(e) => handleChange('story_hero_calligraphy_line1', e.target.value)}
                placeholder="Wear"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Calligraphy — Line 2</label>
              <input
                value={values.story_hero_calligraphy_line2 ?? ''}
                onChange={(e) => handleChange('story_hero_calligraphy_line2', e.target.value)}
                placeholder="Your Legacy"
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
              value={values.story_hero_image || null}
              onChange={(v) => handleChange('story_hero_image', typeof v === 'string' ? v : '')}
              folder="story"
              multiple={false}
            />
          </div>

          {/* Banner Mini Preview */}
          <div className="rounded-xl p-4 sm:p-5 bg-[#F6F1EC] border border-cream-300 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">
              {values.story_hero_eyebrow || 'OUR STORY'}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-brand-700">
              {values.story_hero_title || 'Our Story'}
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              {values.story_hero_subtitle || 'Rooted in Tradition. Styled for Today.'}
            </p>
          </div>
        </section>
      )}

      {/* TAB 2: CHAPTER 01 - THE GENESIS */}
      {activeTab === 'ch1' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#B08F4F] bg-[#F6F1EC] border border-[#CFAC64] px-2 py-0.5 rounded-full">
                  CHAPTER 01
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  The Genesis &amp; Pull-Quote
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The origin narrative explaining why Al Hareer was founded and the founding pull-quote.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>Chapter Eyebrow</label>
              <input
                value={values.story_ch1_eyebrow ?? ''}
                onChange={(e) => handleChange('story_ch1_eyebrow', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Chapter Headline</label>
              <input
                value={values.story_ch1_heading ?? ''}
                onChange={(e) => handleChange('story_ch1_heading', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>First Paragraph (The Problem)</label>
              <textarea
                rows={3}
                value={values.story_ch1_paragraph1 ?? ''}
                onChange={(e) => handleChange('story_ch1_paragraph1', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Second Paragraph (The Solution)</label>
              <textarea
                rows={3}
                value={values.story_ch1_paragraph2 ?? ''}
                onChange={(e) => handleChange('story_ch1_paragraph2', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Pull-Quote with Live Storefront Preview */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[#F6F1EC] border border-cream-300 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
              <Quote className="h-4 w-4 text-gold shrink-0" />
              <span>Featured Pull-Quote Callout</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Quote Statement</label>
                <textarea
                  rows={2}
                  value={values.story_ch1_quote ?? ''}
                  onChange={(e) => handleChange('story_ch1_quote', e.target.value)}
                  className="w-full rounded-xl border border-cream-200 bg-white p-3 text-base sm:text-sm text-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className={labelClass}>Attribution</label>
                <input
                  value={values.story_ch1_quote_attribution ?? ''}
                  onChange={(e) => handleChange('story_ch1_quote_attribution', e.target.value)}
                  className="w-full rounded-xl border border-cream-200 bg-white px-3 py-2 text-base sm:text-sm text-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* Live Pull Quote Box */}
            <div className="border-l-3 border-gold pl-3.5 py-2.5 bg-white/90 rounded-r-xl shadow-xs">
              <p className="text-xs sm:text-sm text-brand-700 italic font-serif leading-relaxed">
                &ldquo;{values.story_ch1_quote || 'Quote statement appears here...'}&rdquo;
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gold mt-1.5">
                — {values.story_ch1_quote_attribution || 'Al Hareer'}
              </p>
            </div>
          </div>

          {/* Chapter 1 Images */}
          <div className="pt-3 border-t border-cream-200/60 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              Chapter 1 — Split Portrait Images
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Left Portrait Image</label>
                <p className="text-[11px] text-muted mb-2">First portrait in the 2-column image grid.</p>
                <ImageUploader
                  value={values.story_ch1_image1 || null}
                  onChange={(v) => handleChange('story_ch1_image1', typeof v === 'string' ? v : '')}
                  folder="story"
                  multiple={false}
                />
                <input
                  value={values.story_ch1_image1_caption ?? ''}
                  onChange={(e) => handleChange('story_ch1_image1_caption', e.target.value)}
                  placeholder="Generational Weft"
                  className={`${inputClass} mt-2`}
                />
              </div>
              <div>
                <label className={labelClass}>Right Portrait Image</label>
                <p className="text-[11px] text-muted mb-2">Second portrait (offset lower) in the grid.</p>
                <ImageUploader
                  value={values.story_ch1_image2 || null}
                  onChange={(v) => handleChange('story_ch1_image2', typeof v === 'string' ? v : '')}
                  folder="story"
                  multiple={false}
                />
                <input
                  value={values.story_ch1_image2_caption ?? ''}
                  onChange={(e) => handleChange('story_ch1_image2_caption', e.target.value)}
                  placeholder="Modern Tailoring"
                  className={`${inputClass} mt-2`}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: CHAPTER 02 - THE WEAVERS */}
      {activeTab === 'ch2' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-brand-600 bg-brand-500/10 border border-brand-200 px-2 py-0.5 rounded-full">
                  CHAPTER 02
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  The Artisans &amp; Slow-Fashion Stats
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                Spotlight the artisan families, handloom ethics, and 2 key slow-craft stats.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>Chapter Eyebrow</label>
              <input
                value={values.story_ch2_eyebrow ?? ''}
                onChange={(e) => handleChange('story_ch2_eyebrow', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Chapter Headline</label>
              <input
                value={values.story_ch2_heading ?? ''}
                onChange={(e) => handleChange('story_ch2_heading', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>First Paragraph (Handloom Craftsmanship)</label>
              <textarea
                rows={3}
                value={values.story_ch2_paragraph1 ?? ''}
                onChange={(e) => handleChange('story_ch2_paragraph1', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Second Paragraph (Direct Weaver Partnerships)</label>
              <textarea
                rows={3}
                value={values.story_ch2_paragraph2 ?? ''}
                onChange={(e) => handleChange('story_ch2_paragraph2', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Featured Weaver — Family / Name</label>
              <input
                value={values.story_ch2_weaver_name ?? ''}
                onChange={(e) => handleChange('story_ch2_weaver_name', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Featured Weaver — Heritage / City</label>
              <input
                value={values.story_ch2_weaver_desc ?? ''}
                onChange={(e) => handleChange('story_ch2_weaver_desc', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Chapter 2 Weaver Image */}
          <div className="pt-3 border-t border-cream-200/60">
            <label className={labelClass}>Featured Weaver Portrait Image</label>
            <p className="text-[11px] text-muted mb-2">
              The large portrait photo shown on the left alongside the weaver story. Leave empty to use the default.
            </p>
            <ImageUploader
              value={values.story_ch2_image || null}
              onChange={(v) => handleChange('story_ch2_image', typeof v === 'string' ? v : '')}
              folder="story"
              multiple={false}
            />
          </div>

          {/* 2 Stat Callouts */}
          <div className="pt-3 border-t border-cream-200/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-700">
                2 Key Stat Callout Badges
              </label>
              <span className="text-[11px] text-muted">Shown alongside the weaver portrait</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {jsonItems('story_ch2_stats_items', 2).map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-cream-50/70 border border-cream-200 space-y-2.5 sm:space-y-3 shadow-xs"
                >
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                    Stat Callout #{idx + 1}
                  </span>
                  <div>
                    <label className={labelClass}>Stat Value (e.g. 100%, Fair-Pay)</label>
                    <input
                      value={stat.value ?? ''}
                      onChange={(e) =>
                        updateJsonItem('story_ch2_stats_items', idx, 'value', e.target.value, 2)
                      }
                      className="w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-base sm:text-sm font-bold text-brand-700"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stat Label</label>
                    <input
                      value={stat.label ?? ''}
                      onChange={(e) =>
                        updateJsonItem('story_ch2_stats_items', idx, 'label', e.target.value, 2)
                      }
                      className="w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-base sm:text-xs text-brand-700"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description Line</label>
                    <input
                      value={stat.desc ?? ''}
                      onChange={(e) =>
                        updateJsonItem('story_ch2_stats_items', idx, 'desc', e.target.value, 2)
                      }
                      className="w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-base sm:text-xs text-muted"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: CHAPTER 03 - MILESTONES */}
      {activeTab === 'ch3' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#024F5F] bg-[#F6F1EC] border border-[#CFAC64] px-2 py-0.5 rounded-full">
                  CHAPTER 03
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  Timeline &amp; Historical Milestones
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The 4 landmark steps illustrating our expansion from 2018 to today.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>Chapter Eyebrow</label>
              <input
                value={values.story_ch3_eyebrow ?? ''}
                onChange={(e) => handleChange('story_ch3_eyebrow', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Headline</label>
              <input
                value={values.story_ch3_heading ?? ''}
                onChange={(e) => handleChange('story_ch3_heading', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input
                value={values.story_ch3_subtitle ?? ''}
                onChange={(e) => handleChange('story_ch3_subtitle', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* 4 Timeline Milestones Editor */}
          <div className="pt-2 border-t border-cream-200/60 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              4 Historical Timeline Nodes
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {jsonItems('story_milestones_items', 4).map((milestone, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-cream-50/50 border border-cream-200/90 space-y-3 hover:border-gold/40 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold text-[#024F5F] bg-[#F6F1EC] border border-[#CFAC64]">
                      <Milestone className="h-3 w-3" />
                      Milestone {idx + 1}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-gold">
                      Node #{idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                    <div className="xs:col-span-1">
                      <label className={labelClass}>Year / Era</label>
                      <input
                        value={milestone.year ?? ''}
                        onChange={(e) =>
                          updateJsonItem('story_milestones_items', idx, 'year', e.target.value, 4)
                        }
                        placeholder="2018"
                        className="w-full rounded-lg border border-cream-200 bg-white px-2.5 py-2 text-base sm:text-xs font-bold text-brand-700"
                      />
                    </div>
                    <div className="xs:col-span-2">
                      <label className={labelClass}>Milestone Title</label>
                      <input
                        value={milestone.title ?? ''}
                        onChange={(e) =>
                          updateJsonItem('story_milestones_items', idx, 'title', e.target.value, 4)
                        }
                        placeholder="The First Kurtas"
                        className="w-full rounded-lg border border-cream-200 bg-white px-2.5 py-2 text-base sm:text-xs font-semibold text-brand-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Milestone Narrative</label>
                    <textarea
                      rows={2}
                      value={milestone.desc ?? ''}
                      onChange={(e) =>
                        updateJsonItem('story_milestones_items', idx, 'desc', e.target.value, 4)
                      }
                      placeholder="What happened during this phase?"
                      className="w-full rounded-lg border border-cream-200 bg-white p-2.5 text-base sm:text-xs text-brand-700 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: CHAPTER 04 - CORE VALUES */}
      {activeTab === 'ch4' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#024F5F] bg-[#F6F1EC] border border-[#CFAC64] px-2 py-0.5 rounded-full">
                  CHAPTER 04
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  Foundational Beliefs &amp; Core Values
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The 4 philosophical values driving our design and fabric sourcing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>Chapter Eyebrow</label>
              <input
                value={values.story_ch4_eyebrow ?? ''}
                onChange={(e) => handleChange('story_ch4_eyebrow', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Headline</label>
              <input
                value={values.story_ch4_heading ?? ''}
                onChange={(e) => handleChange('story_ch4_heading', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* 4 Core Value Cards */}
          <div className="pt-2 border-t border-cream-200/60 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              4 Philosophy Pillar Cards
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {jsonItems('story_values_items', 4).map((valueCard, idx) => {
                const Icon = VALUE_ICONS[idx] || ShieldCheck;
                return (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-cream-50/50 border border-cream-200/90 space-y-3 hover:border-gold/40 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-brand-700 text-gold shadow-xs shrink-0">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold text-brand-700">
                          Pillar #{idx + 1}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted">Fixed Icon</span>
                    </div>

                    <div>
                      <label className={labelClass}>Pillar Title</label>
                      <input
                        value={valueCard.title ?? ''}
                        onChange={(e) =>
                          updateJsonItem('story_values_items', idx, 'title', e.target.value, 4)
                        }
                        placeholder="e.g. Master Tailoring"
                        className="w-full rounded-lg border border-cream-200 bg-white px-2.5 py-2 text-base sm:text-xs font-bold text-brand-700"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Pillar Description</label>
                      <textarea
                        rows={2}
                        value={valueCard.desc ?? ''}
                        onChange={(e) =>
                          updateJsonItem('story_values_items', idx, 'desc', e.target.value, 4)
                        }
                        placeholder="Explain this brand promise..."
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

      {/* TAB 6: FOOTER CALL TO ACTION */}
      {activeTab === 'cta' && (
        <section className="bg-white rounded-2xl border border-cream-200/90 p-4 sm:p-6 md:p-7 shadow-xs space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded-full">
                  FOOTER CTA
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700">
                  Bottom Call-to-Action Banner
                </h3>
              </div>
              <p className="text-xs text-muted mt-1">
                The final invitation at the base of <code className="text-brand-600 bg-cream-100 px-1 py-0.5 rounded text-[10px] sm:text-xs">/story</code> directing patrons to the shop.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>Headline</label>
              <input
                value={values.story_cta_heading ?? ''}
                onChange={(e) => handleChange('story_cta_heading', e.target.value)}
                placeholder="Shop Our Collection"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input
                value={values.story_cta_subtitle ?? ''}
                onChange={(e) => handleChange('story_cta_subtitle', e.target.value)}
                placeholder="Handmade kurtas, kurta sets, and waistcoats."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Button 1 Label</label>
              <input
                value={values.story_cta_button1_text ?? ''}
                onChange={(e) => handleChange('story_cta_button1_text', e.target.value)}
                placeholder="Explore The Catalog"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Button 2 Label</label>
              <input
                value={values.story_cta_button2_text ?? ''}
                onChange={(e) => handleChange('story_cta_button2_text', e.target.value)}
                placeholder="About Our Atelier"
                className={inputClass}
              />
            </div>
          </div>

          {/* Mini Preview of CTA */}
          <div className="rounded-xl p-4 sm:p-5 bg-[#00303A] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#CFAC64]/30 shadow-md text-center sm:text-left">
            <div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-[#F6F1EC]">
                {values.story_cta_heading || 'Shop Our Collection'}
              </h4>
              <p className="text-xs text-white/70 mt-0.5">
                {values.story_cta_subtitle || 'Handmade kurtas, kurta sets, and waistcoats.'}
              </p>
            </div>
            <span className="w-full sm:w-auto text-center px-4 py-2 rounded-xl text-xs font-semibold text-[#00303A] bg-gradient-to-r from-[#CFAC64] to-[#CFAC64] shadow-xs pointer-events-none whitespace-nowrap">
              Shop Now &rarr;
            </span>
          </div>
        </section>
      )}

      {/* Bottom Step Navigation Bar (100% Mobile Responsive) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
        {/* Mobile 2-column or desktop split buttons */}
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
            'Save All Changes'
          )}
        </button>
      </div>
    </div>
  );
}
