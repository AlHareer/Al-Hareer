'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle } from 'lucide-react';
import { updateSiteSetting } from '@/actions/admin/siteSettings';
import { HOME_SETTINGS_DEFAULTS, type SiteSettingsDefaults } from '@/lib/siteSettingsSchema';
import JsonListEditor from '@/components/admin/JsonListEditor';
import ImageUploader from '@/components/admin/ImageUploader';

const inputClass =
  'w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 text-sm text-brand-700 placeholder:text-muted-light transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500/20';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-widest text-brand-600';
const sectionClass = 'rounded-xl border border-cream-300 bg-white p-6 shadow-sm space-y-5';
const sectionHeadingClass = 'font-heading text-lg font-bold text-brand-700';

type MomentCard = { title: string; subtitle: string; image: string };
type OccasionCard = { title: string; tag: string; image: string; link?: string };
type KurtaStyleCard = { name: string; slug: string; image: string; link: string };

export default function HomeSettingsForm({ settings }: { settings: SiteSettingsDefaults }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<{ success: boolean; error?: string } | null>(null);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const key of Object.keys(HOME_SETTINGS_DEFAULTS)) {
      initial[key] = settings[key]?.value ?? HOME_SETTINGS_DEFAULTS[key].value;
    }
    return initial;
  });

  const handleChange = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  // --- Trust bar ---
  let trustBarItems: Record<string, string>[] = [];
  try {
    const parsed = JSON.parse(values.home_trustbar_items || HOME_SETTINGS_DEFAULTS.home_trustbar_items.value);
    trustBarItems = Array.isArray(parsed) && parsed.length === 4 ? parsed : JSON.parse(HOME_SETTINGS_DEFAULTS.home_trustbar_items.value);
  } catch {
    trustBarItems = JSON.parse(HOME_SETTINGS_DEFAULTS.home_trustbar_items.value);
  }

  // --- Moments cards ---
  const parseMomentCards = (): MomentCard[] => {
    try {
      const parsed = JSON.parse(values.home_moments_cards || HOME_SETTINGS_DEFAULTS.home_moments_cards.value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { /* ignore */ }
    return JSON.parse(HOME_SETTINGS_DEFAULTS.home_moments_cards.value);
  };
  const momentCards = parseMomentCards();
  const updateMomentCard = (idx: number, field: keyof MomentCard, val: string) => {
    const updated = momentCards.map((c, i) => i === idx ? { ...c, [field]: val } : c);
    handleChange('home_moments_cards', JSON.stringify(updated));
  };

  // --- Occasion cards ---
  const parseOccasionCards = (): OccasionCard[] => {
    try {
      const parsed = JSON.parse(values.home_shopby_occasions || HOME_SETTINGS_DEFAULTS.home_shopby_occasions.value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { /* ignore */ }
    return JSON.parse(HOME_SETTINGS_DEFAULTS.home_shopby_occasions.value);
  };
  const occasionCards = parseOccasionCards();
  const updateOccasionCard = (idx: number, field: keyof OccasionCard, val: string) => {
    const updated = occasionCards.map((c, i) => i === idx ? { ...c, [field]: val } : c);
    handleChange('home_shopby_occasions', JSON.stringify(updated));
  };
  const addOccasionCard = () => {
    handleChange('home_shopby_occasions', JSON.stringify([...occasionCards, { title: '', tag: '', image: '' }]));
  };
  const removeOccasionCard = (idx: number) => {
    handleChange('home_shopby_occasions', JSON.stringify(occasionCards.filter((_, i) => i !== idx)));
  };

  // --- Kurta style cards ---
  const parseKurtaStyles = (): KurtaStyleCard[] => {
    try {
      const parsed = JSON.parse(values.home_kurta_styles || HOME_SETTINGS_DEFAULTS.home_kurta_styles.value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { /* ignore */ }
    return JSON.parse(HOME_SETTINGS_DEFAULTS.home_kurta_styles.value);
  };
  const kurtaStyles = parseKurtaStyles();
  const updateKurtaStyle = (idx: number, field: keyof KurtaStyleCard, val: string) => {
    const updated = kurtaStyles.map((s, i) => i === idx ? { ...s, [field]: val } : s);
    handleChange('home_kurta_styles', JSON.stringify(updated));
  };
  const addKurtaStyle = () => {
    handleChange('home_kurta_styles', JSON.stringify([...kurtaStyles, { name: '', slug: '', image: '', link: '' }]));
  };
  const removeKurtaStyle = (idx: number) => {
    handleChange('home_kurta_styles', JSON.stringify(kurtaStyles.filter((_, i) => i !== idx)));
  };

  const handleSave = () => {
    setSaved(null);
    startTransition(async () => {
      const keys = Object.keys(HOME_SETTINGS_DEFAULTS);
      const results = await Promise.all(keys.map((key) => updateSiteSetting(key, values[key])));
      const failed = results.find((r) => !r.success);
      if (failed) {
        setSaved({ success: false, error: failed.error });
      } else {
        setSaved({ success: true });
        router.refresh();
        setTimeout(() => setSaved(null), 2500);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Save bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-cream-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          General homepage text &amp; images — live on the storefront as soon as you save.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          {saved && (
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${saved.success ? 'text-green-600' : 'text-red-600'}`}>
              {saved.success ? (
                <><Check className="h-3.5 w-3.5" /> Saved</>
              ) : (
                <><AlertCircle className="h-3.5 w-3.5" /> {saved.error}</>
              )}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm disabled:opacity-60 transition-all"
          >
            {pending ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Trust Bar */}
      <div className={sectionClass}>
        <div>
          <h3 className={sectionHeadingClass}>Trust Bar</h3>
          <p className="mt-1 text-xs text-muted">The scrolling strip of 4 trust pillars below the hero banner. Icons stay fixed by position — only the text is editable.</p>
        </div>
        <JsonListEditor
          items={trustBarItems}
          onChange={(items) => handleChange('home_trustbar_items', JSON.stringify(items))}
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'subtitle', label: 'Subtitle' },
          ]}
          cardTitle={(i) => `Item ${i + 1}`}
        />
      </div>

      {/* Split Banner */}
      <div className={sectionClass}>
        <h3 className={sectionHeadingClass}>Split Banner (Crafted For Comfort)</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Headline (press Enter for the 2nd, italicized line)</label>
            <textarea
              value={values.home_splitbanner_heading ?? ''}
              onChange={(e) => handleChange('home_splitbanner_heading', e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              value={values.home_splitbanner_description ?? ''}
              onChange={(e) => handleChange('home_splitbanner_description', e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Left Portrait Image</label>
            <ImageUploader
              value={values.home_splitbanner_image1 || null}
              onChange={(v) => handleChange('home_splitbanner_image1', typeof v === 'string' ? v : '')}
              folder="/al-hareer/home/splitbanner"
              previewClassName="aspect-[3/4] w-36"
            />
          </div>
          <div>
            <label className={labelClass}>Right Fabric Image</label>
            <ImageUploader
              value={values.home_splitbanner_image2 || null}
              onChange={(v) => handleChange('home_splitbanner_image2', typeof v === 'string' ? v : '')}
              folder="/al-hareer/home/splitbanner"
              previewClassName="aspect-[3/4] w-36"
            />
          </div>
        </div>
      </div>

      {/* About Teaser */}
      <div className={sectionClass}>
        <div>
          <h3 className={sectionHeadingClass}>About Teaser Block</h3>
          <p className="mt-1 text-xs text-muted">This block is shown on both the Home and About pages.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Headline (press Enter for the 2nd, italicized line)</label>
            <textarea
              value={values.home_aboutteaser_heading ?? ''}
              onChange={(e) => handleChange('home_aboutteaser_heading', e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>First Paragraph</label>
            <textarea
              value={values.home_aboutteaser_paragraph ?? ''}
              onChange={(e) => handleChange('home_aboutteaser_paragraph', e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Second Paragraph</label>
            <textarea
              value={values.home_aboutteaser_paragraph2 ?? ''}
              onChange={(e) => handleChange('home_aboutteaser_paragraph2', e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Main Image</label>
            <ImageUploader
              value={values.home_aboutteaser_image || null}
              onChange={(v) => handleChange('home_aboutteaser_image', typeof v === 'string' ? v : '')}
              folder="/al-hareer/home/about"
              previewClassName="h-28 w-24"
            />
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className={sectionClass}>
        <h3 className={sectionHeadingClass}>Our Story</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Headline (press Enter for the 2nd, italicized line)</label>
            <textarea
              value={values.home_ourstory_heading ?? ''}
              onChange={(e) => handleChange('home_ourstory_heading', e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              value={values.home_ourstory_paragraph ?? ''}
              onChange={(e) => handleChange('home_ourstory_paragraph', e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Left Image</label>
            <ImageUploader
              value={values.home_ourstory_image1 || null}
              onChange={(v) => handleChange('home_ourstory_image1', typeof v === 'string' ? v : '')}
              folder="/al-hareer/home/ourstory"
              previewClassName="h-28 w-20"
            />
          </div>
          <div>
            <label className={labelClass}>Right Image</label>
            <ImageUploader
              value={values.home_ourstory_image2 || null}
              onChange={(v) => handleChange('home_ourstory_image2', typeof v === 'string' ? v : '')}
              folder="/al-hareer/home/ourstory"
              previewClassName="h-28 w-20"
            />
          </div>
        </div>
      </div>

      {/* Moments & Celebrations */}
      <div className={sectionClass}>
        <div>
          <h3 className={sectionHeadingClass}>Moments &amp; Celebrations</h3>
          <p className="mt-1 text-xs text-muted">Section heading + 3 occasion cards with title, subtitle, and image.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Headline (press Enter for the 2nd, italicized line)</label>
            <textarea
              value={values.home_moments_heading ?? ''}
              onChange={(e) => handleChange('home_moments_heading', e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              value={values.home_moments_paragraph ?? ''}
              onChange={(e) => handleChange('home_moments_paragraph', e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        {/* 3 moment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-cream-200">
          {momentCards.map((card, idx) => (
            <div key={idx} className="space-y-3 rounded-lg border border-cream-200 bg-cream-50 p-4">
              <p className="text-xs font-bold text-brand-700 uppercase tracking-wider">Card {idx + 1}</p>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  value={card.title}
                  onChange={(e) => updateMomentCard(idx, 'title', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Subtitle</label>
                <input
                  value={card.subtitle}
                  onChange={(e) => updateMomentCard(idx, 'subtitle', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Image</label>
                <ImageUploader
                  value={card.image || null}
                  onChange={(v) => updateMomentCard(idx, 'image', typeof v === 'string' ? v : '')}
                  folder="/al-hareer/home/moments"
                  previewClassName="aspect-[3/4] w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shop By Category */}
      <div className={sectionClass}>
        <div>
          <h3 className={sectionHeadingClass}>Shop By Category</h3>
          <p className="mt-1 text-xs text-muted">Section heading, subtitle, and custom images per category. If no image is set, the featured product image is used automatically.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Heading</label>
            <input
              value={values.home_showcase_heading ?? ''}
              onChange={(e) => handleChange('home_showcase_heading', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              value={values.home_showcase_subtitle ?? ''}
              onChange={(e) => handleChange('home_showcase_subtitle', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        {/* Per-type image + label overrides */}
        {(() => {
          const TYPES = ['Kurtas', 'Kurta Sets', 'Pajamas', 'Waistcoats', 'Accessories'];
          let imgOverrides: Record<string, string> = {};
          try { imgOverrides = JSON.parse(values.home_showcase_images || '{}'); } catch { /* ignore */ }
          let lblOverrides: Record<string, string> = {};
          try { lblOverrides = JSON.parse(values.home_showcase_labels || '{}'); } catch { /* ignore */ }
          let lnkOverrides: Record<string, string> = {};
          try { lnkOverrides = JSON.parse(values.home_showcase_links || '{}'); } catch { /* ignore */ }

          const updateImage = (type: string, url: string) => {
            handleChange('home_showcase_images', JSON.stringify({ ...imgOverrides, [type]: url }));
          };
          const updateLabel = (type: string, label: string) => {
            handleChange('home_showcase_labels', JSON.stringify({ ...lblOverrides, [type]: label }));
          };
          const updateLink = (type: string, link: string) => {
            handleChange('home_showcase_links', JSON.stringify({ ...lnkOverrides, [type]: link }));
          };

          return (
            <div className="pt-2 border-t border-cream-200 space-y-3">
              <p className="text-xs text-muted">
                <span className="font-semibold text-brand-700">First card</span> = big block (portrait 3:4 ratio recommended) &nbsp;|&nbsp;
                <span className="font-semibold text-brand-700">Cards 2–5</span> = small blocks (landscape 4:3 ratio recommended)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {TYPES.map((type, idx) => {
                  const isFirst = idx === 0;
                  return (
                    <div key={type} className={`space-y-2 rounded-lg border p-3 ${isFirst ? 'border-brand-300 bg-brand-50/30' : 'border-cream-200 bg-cream-50'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">{type}</p>
                        {isFirst && <span className="text-[9px] bg-brand-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">BIG</span>}
                      </div>
                      <div>
                        <label className={labelClass}>Display Name</label>
                        <input
                          value={lblOverrides[type] ?? type}
                          onChange={(e) => updateLabel(type, e.target.value)}
                          placeholder={type}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Redirect Link</label>
                        <input
                          value={lnkOverrides[type] ?? ''}
                          onChange={(e) => updateLink(type, e.target.value)}
                          placeholder={`/shop?category=${type}`}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Image {isFirst ? '(3:4 portrait)' : '(4:3 landscape)'}</label>
                        <ImageUploader
                          value={imgOverrides[type] || null}
                          onChange={(v) => updateImage(type, typeof v === 'string' ? v : '')}
                          folder="/al-hareer/home/showcase"
                          previewClassName={isFirst ? 'aspect-[3/4] w-full' : 'aspect-[4/3] w-full'}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Featured Collection */}
      <div className={sectionClass}>
        <h3 className={sectionHeadingClass}>Featured Collection</h3>
        <div className="max-w-sm">
          <label className={labelClass}>Heading</label>
          <input
            value={values.home_featured_heading ?? ''}
            onChange={(e) => handleChange('home_featured_heading', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Shop By Kurta Type */}
      <div className={sectionClass}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className={sectionHeadingClass}>Shop By Kurta Type</h3>
            <p className="mt-1 text-xs text-muted">Circle row on homepage — each card links to <code>/shop?category=slug</code>.</p>
          </div>
          <button
            type="button"
            onClick={addKurtaStyle}
            className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-cream-100 hover:bg-cream-200 border border-cream-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            + Add Card
          </button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Heading</label>
            <input
              value={values.home_kurtatype_heading ?? ''}
              onChange={(e) => handleChange('home_kurtatype_heading', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              value={values.home_kurtatype_subtitle ?? ''}
              onChange={(e) => handleChange('home_kurtatype_subtitle', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2 border-t border-cream-200">
          {kurtaStyles.map((style, idx) => (
            <div key={idx} className="space-y-3 rounded-lg border border-cream-200 bg-cream-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-brand-700 uppercase tracking-wider">Card {idx + 1}</p>
                <button
                  type="button"
                  onClick={() => removeKurtaStyle(idx)}
                  className="text-[11px] text-red-500 hover:text-red-700 font-semibold transition-colors"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className={labelClass}>Name</label>
                <input
                  value={style.name}
                  onChange={(e) => updateKurtaStyle(idx, 'name', e.target.value)}
                  placeholder="e.g. Saudi"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input
                  value={style.slug}
                  onChange={(e) => updateKurtaStyle(idx, 'slug', e.target.value)}
                  placeholder="e.g. saudi"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Link</label>
                <input
                  value={style.link || ''}
                  onChange={(e) => updateKurtaStyle(idx, 'link', e.target.value)}
                  placeholder="/shop?category=saudi"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Image</label>
                <ImageUploader
                  value={style.image || null}
                  onChange={(v) => updateKurtaStyle(idx, 'image', typeof v === 'string' ? v : '')}
                  folder="/al-hareer/home/kurta-styles"
                  previewClassName="aspect-square w-full rounded-full overflow-hidden"
                  objectFit="cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shop By Occasion */}
      <div className={sectionClass}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className={sectionHeadingClass}>Shop By Occasion</h3>
            <p className="mt-1 text-xs text-muted">Section heading + occasion cards with title, badge tag, and image.</p>
          </div>
          <button
            type="button"
            onClick={addOccasionCard}
            className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-cream-100 hover:bg-cream-200 border border-cream-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            + Add Card
          </button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Heading</label>
            <input
              value={values.home_occasions_heading ?? ''}
              onChange={(e) => handleChange('home_occasions_heading', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              value={values.home_occasions_subtitle ?? ''}
              onChange={(e) => handleChange('home_occasions_subtitle', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2 border-t border-cream-200">
          {occasionCards.map((card, idx) => (
            <div key={idx} className="space-y-3 rounded-lg border border-cream-200 bg-cream-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-brand-700 uppercase tracking-wider">Card {idx + 1}</p>
                <button
                  type="button"
                  onClick={() => removeOccasionCard(idx)}
                  className="text-[11px] text-red-500 hover:text-red-700 font-semibold transition-colors"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  value={card.title}
                  onChange={(e) => updateOccasionCard(idx, 'title', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Badge Tag</label>
                <input
                  value={card.tag}
                  onChange={(e) => updateOccasionCard(idx, 'tag', e.target.value)}
                  placeholder="e.g. SHAADI, EID MUBARAK"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Shop Link</label>
                <input
                  value={card.link ?? ''}
                  onChange={(e) => updateOccasionCard(idx, 'link', e.target.value)}
                  placeholder="e.g. /shop?occasion=Wedding"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Image</label>
                <ImageUploader
                  value={card.image || null}
                  onChange={(v) => updateOccasionCard(idx, 'image', typeof v === 'string' ? v : '')}
                  folder="/al-hareer/home/occasions"
                  previewClassName="aspect-[3/4] w-full bg-cream-100"
                  objectFit="cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className={sectionClass}>
        <h3 className={sectionHeadingClass}>Contact Section</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            { key: 'home_contact_heading', label: 'Headline' },
            { key: 'home_contact_subtitle', label: 'Subtitle', rows: 2 },
            { key: 'home_contact_phone', label: 'Phone Number' },
            { key: 'home_contact_email', label: 'Support Email' },
            { key: 'home_contact_address', label: 'Address' },
            { key: 'home_contact_hours', label: 'Business Hours' },
          ].map((field) => (
            <div key={field.key} className={'rows' in field ? 'sm:col-span-2' : ''}>
              <label className={labelClass}>{field.label}</label>
              {'rows' in field ? (
                <textarea
                  value={values[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={field.rows as number}
                  className={inputClass}
                />
              ) : (
                <input
                  value={values[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={inputClass}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted pt-1">Social media links (Instagram, Facebook, YouTube, WhatsApp) are managed in <strong>Settings → Brand &amp; Contact</strong>.</p>
      </div>

      {/* Newsletter */}
      <div className={sectionClass}>
        <h3 className={sectionHeadingClass}>Newsletter / Privilege Club</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Headline (press Enter for the 2nd, italicized line)</label>
            <textarea
              value={values.home_newsletter_heading ?? ''}
              onChange={(e) => handleChange('home_newsletter_heading', e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Subtitle</label>
            <textarea
              value={values.home_newsletter_subtitle ?? ''}
              onChange={(e) => handleChange('home_newsletter_subtitle', e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Right Panel Image</label>
            <ImageUploader
              value={values.home_newsletter_image || null}
              onChange={(v) => handleChange('home_newsletter_image', typeof v === 'string' ? v : '')}
              folder="/al-hareer/home/newsletter"
              previewClassName="h-28 w-24"
            />
          </div>
        </div>
      </div>

      {/* Footer Image */}
      <div className="rounded-xl border border-cream-200 bg-white p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700">Footer</h4>
        <div className="max-w-[200px]">
          <label className={labelClass}>Arch Portrait Image</label>
          <ImageUploader
            value={values.footer_arch_image || null}
            onChange={(v) => handleChange('footer_arch_image', typeof v === 'string' ? v : '')}
            folder="/al-hareer/home/footer"
            previewClassName="h-28 w-24"
          />
        </div>
      </div>
    </div>
  );
}
