'use client';

import { useActionState, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { createProduct, updateProduct, type ProductFormState } from '@/actions/admin/products';
import VideoUploader from '@/components/admin/VideoUploader';
import { type VariantRow, emptyVariant } from './VariantsEditor';
import ColorStockManager from './ColorStockManager';
import ColorImageMapper, { type ColorRow, type GalleryImage } from './ColorImageMapper';
import FaqsEditor, { type FaqRow } from './FaqsEditor';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Loader2,
  CheckCircle2,
  EyeOff,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Rocket,
  Check,
} from 'lucide-react';

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-700';
const cardClass = 'rounded-2xl border border-cream-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 sm:space-y-5';

function slugPreview(text: string) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type Category = { id: string; name: string; parent_id?: string | null };
type ProductImageRow = { id: string; image_url: string; sort_order: number; variant_name: string | null; color: string | null };
type ProductVariantRow = {
  id: string;
  variant_name: string;
  color: string | null;
  color_hex: string | null;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  is_active: boolean;
};
type SizeChartRow = { size: string; chest?: string; shoulder?: string; length?: string; sleeve?: string };
type ProductFaqRow = { id: string; question: string; answer: string; display_order: number };

type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  color: string | null;
  fabric: string | null;
  fit_type: string | null;
  care_instructions: string | null;
  occasion: string | null;
  badge: string | null;
  colors: ColorRow[] | null;
  details: Record<string, string> | null;
  featured_image_url: string | null;
  video_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  is_featured: boolean;
  product_images?: ProductImageRow[];
  product_variants?: ProductVariantRow[];
  product_faqs?: ProductFaqRow[];
};

function SwitchToggle({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
        checked ? 'border-brand-200 bg-brand-50/30' : 'border-cream-200 bg-cream-50/50 hover:bg-cream-100/50'
      }`}
    >
      <div className="pr-3 select-none">
        <p className="text-xs font-semibold text-brand-700">{label}</p>
        {description && <p className="text-[11px] text-muted mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        aria-label={label}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-brand-500' : 'bg-cream-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

const STEPS = [
  { id: 'basic', label: 'Basic Info', icon: Sparkles, desc: 'Name, description & category' },
  { id: 'inventory', label: 'Sizes, Colors & Stock', icon: Layers, desc: 'Sizes, color swatches, price & stock' },
  { id: 'media', label: 'Media & Details', icon: ImageIcon, desc: 'Photos, swatches, video & specs' },
  { id: 'publish', label: 'Publish & SEO', icon: Rocket, desc: 'Visibility, thumbnail & search preview' },
] as const;
type StepId = (typeof STEPS)[number]['id'];

export default function ProductForm({ product, categories }: { product?: ProductRecord; categories: Category[] }) {
  const isEditing = !!product;
  const action = isEditing ? updateProduct : createProduct;
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, {});

  const [step, setStep] = useState<StepId>('basic');
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const [name, setName] = useState(product?.name ?? '');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [videoUrl, setVideoUrl] = useState<string | null>(product?.video_url ?? null);

  const [colors, setColors] = useState<ColorRow[]>(product?.colors ?? []);
  const [gallery, setGallery] = useState<GalleryImage[]>(
    (product?.product_images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ image_url: img.image_url, sort_order: img.sort_order }))
  );

  const [variants, setVariants] = useState<VariantRow[]>(
    product?.product_variants?.length
      ? product.product_variants.map((v) => ({
          variant_name: v.variant_name,
          color: v.color ?? '',
          color_hex: v.color_hex ?? '',
          price: String(v.price),
          original_price: v.original_price != null ? String(v.original_price) : '',
          stock_quantity: String(v.stock_quantity),
          is_active: v.is_active,
        }))
      : [emptyVariant('Standard')]
  );

  // The Sizes & Inventory table (VariantsEditor) is the single source of
  // truth for "which colors does this product have" — Color Swatches below
  // just attaches a hex + photo to each name that shows up here, so the two
  // can never drift apart or require the same name to be typed twice.
  const variantColorNames = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color.trim()).filter(Boolean))),
    [variants]
  );
  // name -> hex, taken from the variant rows (the hex picked in the color
  // manager). Saved both on each variant (color_hex) and on products.colors.
  const variantColorHex = useMemo(() => {
    const map: Record<string, string> = {};
    for (const v of variants) {
      const n = v.color.trim();
      if (n && v.color_hex && !map[n]) map[n] = v.color_hex;
    }
    return map;
  }, [variants]);
  const colorSyncKey = variantColorNames.map((n) => `${n}:${variantColorHex[n] ?? ''}`).join('|');
  useEffect(() => {
    setColors((prev) => {
      const next = variantColorNames.map((name) => {
        const existing = prev.find((c) => c.name === name);
        const hex = variantColorHex[name] || existing?.hex || '#CFAC64';
        return existing ? { ...existing, hex } : { name, hex, image: null, images: [] };
      });
      const same =
        next.length === prev.length &&
        next.every((c, i) => prev[i]?.name === c.name && prev[i]?.hex === c.hex);
      return same ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorSyncKey]);

  // The main thumbnail is simply the gallery's first (cover) photo — no
  // separate upload. Falls back to the first color's first photo, then to
  // whatever was already saved on an existing product.
  const featuredImage =
    gallery.slice().sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url ||
    colors.find((c) => c.images?.length)?.images?.[0] ||
    product?.featured_image_url ||
    null;

  // Every text/select field lives in state (not in the DOM) so nothing is
  // lost when a step unmounts; the hidden inputs below always submit them.
  const [fields, setFields] = useState({
    short_description: product?.short_description ?? '',
    description: product?.description ?? '',
    category_id: product?.category_id ?? '',
    badge: product?.badge ?? '',
    fabric: product?.fabric ?? '',
    color: product?.color ?? '',
    fit_type: product?.fit_type ?? '',
    occasion: product?.occasion ?? '',
    care_instructions: product?.care_instructions ?? '',
  });
  const setField = (key: keyof typeof fields, value: string) => setFields((f) => ({ ...f, [key]: value }));

  const [faqs, setFaqs] = useState<FaqRow[]>(
    product?.product_faqs?.slice().sort((a, b) => a.display_order - b.display_order).map((f) => ({ question: f.question, answer: f.answer })) ?? []
  );

  const [details, setDetails] = useState<Record<string, string>>(() => {
    const { sizeChart: _sizeChart, ...rest } = (product?.details ?? {}) as Record<string, unknown>;
    return rest as Record<string, string>;
  });
  const [sizeChart, setSizeChart] = useState<SizeChartRow[]>(
    (((product?.details ?? {}) as { sizeChart?: SizeChartRow[] }).sizeChart) ?? []
  );
  const chartSizes = useMemo(
    () => Array.from(new Set(variants.map((v) => v.variant_name.trim()).filter(Boolean))),
    [variants]
  );
  const setChartCell = (size: string, key: keyof Omit<SizeChartRow, 'size'>, value: string) => {
    setSizeChart((prev) => {
      const exists = prev.some((r) => r.size === size);
      return exists ? prev.map((r) => (r.size === size ? { ...r, [key]: value } : r)) : [...prev, { size, [key]: value }];
    });
  };

  // SEO live preview helpers
  const [seoTitle, setSeoTitle] = useState(product?.seo_title ?? '');
  const [seoDesc, setSeoDesc] = useState(product?.seo_description ?? '');

  const liveSlug = isEditing ? product.slug : slugPreview(name) || 'product-slug';

  const goNext = () => stepIndex < STEPS.length - 1 && setStep(STEPS[stepIndex + 1].id);
  const goPrev = () => stepIndex > 0 && setStep(STEPS[stepIndex - 1].id);

  return (
    <form action={formAction} className="space-y-6 max-w-full">
      {isEditing && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="featured_image_url" value={featuredImage || ''} />
      <input type="hidden" name="video_url" value={videoUrl || ''} />
      <input type="hidden" name="is_active" value={isActive ? 'on' : 'off'} />
      <input type="hidden" name="is_featured" value={isFeatured ? 'on' : 'off'} />
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="seo_title" value={seoTitle} />
      <input type="hidden" name="seo_description" value={seoDesc} />
      {(Object.keys(fields) as (keyof typeof fields)[]).map((k) => (
        <input key={k} type="hidden" name={k} value={fields[k]} />
      ))}
      <input
        type="hidden"
        name="details_json"
        value={JSON.stringify({
          ...details,
          sizeChart: sizeChart.filter((r) => chartSizes.includes(r.size) && (r.chest || r.shoulder || r.length || r.sleeve)),
        })}
      />
      {/* Centralized here (rather than inside each step's own component) so a
          step that isn't currently shown still submits its data. */}
      <input type="hidden" name="variants_json" value={JSON.stringify(variants)} />
      <input type="hidden" name="colors_json" value={JSON.stringify(colors.filter((c) => variantColorNames.includes(c.name)))} />
      <input type="hidden" name="images_json" value={JSON.stringify(gallery)} />
      <input type="hidden" name="faqs_json" value={JSON.stringify(faqs)} />

      {/* Top Header & Quick Action Bar */}
      <div className="sticky top-0 z-30 -mx-4 -mt-2 px-4 py-3 bg-[#F6F1EC] border-b border-cream-200 shadow-sm transition-all sm:mx-0 sm:mt-0 sm:top-2 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/products"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 bg-white text-muted hover:border-brand-400 hover:text-brand-600 transition-colors shadow-2xs shrink-0"
              title="Back to Products"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Link href="/admin/products" className="hover:text-brand-700 transition-colors">
                  Products
                </Link>
                <span>/</span>
                <span className="font-semibold text-brand-700">{isEditing ? 'Edit' : 'New Product'}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <h1 className="font-heading text-lg sm:text-2xl font-bold text-brand-700 truncate max-w-xs sm:max-w-md md:max-w-lg">
                  {name || (isEditing ? 'Untitled Product' : 'Add New Product')}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? 'bg-[#F6F1EC] text-[#024F5F]' : 'bg-cream-200 text-muted'
                  }`}
                >
                  {isActive ? <CheckCircle2 className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  <span>{isActive ? 'Active' : 'Draft'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isEditing && product.slug && (
              <Link
                href={`/product/${encodeURIComponent(product.slug)}`}
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs font-semibold text-brand-700 hover:border-brand-400 hover:bg-cream-50 shadow-2xs transition-all"
              >
                <span>View on Store</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted" />
              </Link>
            )}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#CFAC64] hover:bg-[#B08F4F] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-luxury hover:shadow-luxury-hover disabled:opacity-60 transition-all cursor-pointer"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              <span>{pending ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {state?.error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#CFAC64] bg-[#F6F1EC] p-4 text-xs sm:text-sm font-semibold text-[#024F5F] shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-[#024F5F] shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Step Progress Tracker — click any step to jump straight to it; all
          steps' data is always part of the form, so nothing is lost by
          saving from a step other than the one you filled in last. */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-white border border-cream-200/80 p-2 sm:p-2.5 rounded-2xl shadow-2xs overflow-x-auto no-scrollbar">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActiveStep = step === s.id;
          const isDone = i < stepIndex;
          return (
            <button
              type="button"
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex shrink-0 items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActiveStep
                  ? 'bg-brand-700 text-white shadow-sm'
                  : isDone
                    ? 'bg-[#F6F1EC] text-[#024F5F]'
                    : 'text-muted hover:bg-cream-100'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActiveStep ? 'bg-white/20 text-white' : isDone ? 'bg-[#024F5F] text-white' : 'bg-cream-200 text-muted'
                }`}
              >
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
              <Icon className="h-3.5 w-3.5 sm:hidden" />
            </button>
          );
        })}
      </div>

      {/* STEP 1: BASIC INFO */}
      {step === 'basic' && (
        <div className="space-y-6">
          <div className={cardClass}>
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <div>
                <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">General Information</h2>
                <p className="text-xs text-muted">Title, search slug, and product storytelling.</p>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Product Name <span className="text-[#024F5F]">*</span>
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Imperial Ivory Embroidered Sherwani"
                className={`${inputClass} text-sm font-semibold`}
              />
              <p className="mt-1.5 font-mono text-[11px] text-muted flex items-center gap-1">
                <span>URL Preview:</span>
                <span className="text-brand-600 font-medium">/product/{liveSlug}</span>
              </p>
            </div>

            <div>
              <label className={labelClass}>Short Summary</label>
              <textarea
                rows={2}
                value={fields.short_description}
                onChange={(e) => setField('short_description', e.target.value)}
                placeholder="A brief 1-2 sentence hook shown on product cards and quick search..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Full Description</label>
              <textarea
                rows={6}
                value={fields.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="Complete description covering royal craftsmanship, fabric richness, fit silhouette, and occasion styling notes..."
                className={inputClass}
              />
            </div>
          </div>

          <div className={cardClass}>
            <div className="border-b border-cream-200 pb-3">
              <h3 className="font-heading text-sm font-bold text-brand-700">Categorization</h3>
              <p className="text-[11px] text-muted mt-0.5">Organize into collections and add a merchandise badge.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Collection / Category</label>
                <select value={fields.category_id} onChange={(e) => setField('category_id', e.target.value)} className={inputClass}>
                  <option value="">Select a category</option>
                  {categories
                    .filter((c) => !c.parent_id)
                    .map((parent) => {
                      const children = categories.filter((c) => c.parent_id === parent.id);
                      if (children.length === 0) {
                        return (
                          <option key={parent.id} value={parent.id}>
                            {parent.name}
                          </option>
                        );
                      }
                      return (
                        <optgroup key={parent.id} label={parent.name}>
                          <option value={parent.id}>{parent.name} — General</option>
                          {children.map((child) => (
                            <option key={child.id} value={child.id}>
                              {child.name}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                </select>
              </div>

              <div>
                <label className={labelClass}>Merchandise Badge</label>
                <input
                  value={fields.badge}
                onChange={(e) => setField('badge', e.target.value)}
                  placeholder="e.g. BESTSELLER, NEW ARRIVAL"
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-muted">Displays as a golden corner tag on the store card.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: SIZES, COLORS & STOCK — the core mapping table, full width
          and uncluttered so it isn't competing with unrelated sections. */}
      {step === 'inventory' && (
        <div className={cardClass}>
          <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
            <Layers className="h-4 w-4 text-brand-600" />
            <div>
              <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Sizes, Colors &amp; Stock</h2>
              <p className="text-xs text-muted">
                Pick sizes, add color swatches (hex saved with each color), then set price &amp; stock per size for every
                color. Colors added here carry through to the photo mapping in the next step.
              </p>
            </div>
          </div>
          <ColorStockManager variants={variants} onChange={setVariants} />
        </div>
      )}

      {/* STEP 3: MEDIA & DETAILS */}
      {step === 'media' && (
        <div className="space-y-6">
          <div className={cardClass}>
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <ImageIcon className="h-4 w-4 text-brand-600" />
              <div>
                <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Product Media &amp; Swatches</h2>
                <p className="text-xs text-muted">High-resolution catalog gallery, color swatches, and optional video.</p>
              </div>
            </div>

            <ColorImageMapper
              colorNames={variantColorNames}
              colors={colors}
              onColorsChange={setColors}
              images={gallery}
              onImagesChange={setGallery}
            />

            <div className="border-t border-cream-200 pt-4 space-y-2">
              <label className={labelClass}>Showcase Video (Optional)</label>
              <VideoUploader
                value={videoUrl}
                onChange={setVideoUrl}
                folder="/al-hareer/products/videos"
              />
              <p className="text-[11px] text-muted">Upload a product video or paste a YouTube / Vimeo link. Shown on the product detail page.</p>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <div>
                <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Specifications &amp; Craft Details</h2>
                <p className="text-xs text-muted">Fabric composition, fit, care instructions, and set components.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Primary Fabric</label>
                <input
                  value={fields.fabric}
                onChange={(e) => setField('fabric', e.target.value)}
                  placeholder="e.g. Pure Silk, Chanderi, Cotton"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Primary Color</label>
                <input
                  value={fields.color}
                onChange={(e) => setField('color', e.target.value)}
                  placeholder="e.g. Ivory White, Midnight Blue"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Fit Silhouette</label>
                <input
                  value={fields.fit_type}
                onChange={(e) => setField('fit_type', e.target.value)}
                  placeholder="e.g. Tailored Fit, Regular Fit, Slim"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Occasion</label>
                <input
                  value={fields.occasion}
                onChange={(e) => setField('occasion', e.target.value)}
                  placeholder="e.g. Wedding, Festive, Haldi, Mehendi"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Set Includes</label>
                <input
                  value={details.setIncludes ?? ''}
                  onChange={(e) => setDetails({ ...details, setIncludes: e.target.value })}
                  placeholder="e.g. Kurta with Pajama & Dupatta"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Work / Craftsmanship</label>
                <input
                  value={details.work ?? ''}
                  onChange={(e) => setDetails({ ...details, work: e.target.value })}
                  placeholder="e.g. Zardozi Embroidery, Thread Work"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className={labelClass}>Size Chart (optional)</label>
                <p className="text-[11px] text-muted -mt-1">
                  Measurements in inches for each size. Leave blank to hide the Size Guide on the product page.
                </p>
                {chartSizes.length === 0 ? (
                  <p className="text-xs text-muted">Add sizes in the Sizes, Colors &amp; Stock step first.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-cream-200 bg-white">
                    <table className="w-full text-xs text-left min-w-[480px]">
                      <thead className="bg-cream-100/80 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-cream-200">
                        <tr>
                          <th className="py-2 px-3 w-24">Size</th>
                          <th className="py-2 px-3">Chest</th>
                          <th className="py-2 px-3">Shoulder</th>
                          <th className="py-2 px-3">Length</th>
                          <th className="py-2 px-3">Sleeve</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-200">
                        {chartSizes.map((size) => {
                          const row = sizeChart.find((r) => r.size === size) ?? { size };
                          return (
                            <tr key={size}>
                              <td className="py-2 px-3 font-bold text-brand-700">{size}</td>
                              {(['chest', 'shoulder', 'length', 'sleeve'] as const).map((col) => (
                                <td key={col} className="py-2 px-3">
                                  <input
                                    value={row[col] ?? ''}
                                    onChange={(e) => setChartCell(size, col, e.target.value)}
                                    placeholder='e.g. 40"'
                                    className={inputClass}
                                  />
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Care Instructions</label>
                <input
                  value={fields.care_instructions}
                onChange={(e) => setField('care_instructions', e.target.value)}
                  placeholder="e.g. Dry clean recommended. Do not bleach. Cool iron."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <div>
                <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Frequently Asked Questions</h2>
                <p className="text-xs text-muted">Customer questions displayed on this product's page.</p>
              </div>
            </div>
            <FaqsEditor faqs={faqs} onChange={setFaqs} />
          </div>
        </div>
      )}

      {/* STEP 4: PUBLISH & SEO */}
      {step === 'publish' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <div className={cardClass}>
              <div className="border-b border-cream-200 pb-3">
                <h3 className="font-heading text-sm font-bold text-brand-700">Publishing Status</h3>
                <p className="text-[11px] text-muted mt-0.5">Control product availability across your store.</p>
              </div>
              <div className="space-y-2.5">
                <SwitchToggle
                  label="Product Active"
                  description={isActive ? 'Visible to customers and open for orders' : 'Hidden as draft from visitors'}
                  checked={isActive}
                  onToggle={() => setIsActive((v) => !v)}
                />
                <SwitchToggle
                  label="Featured on Homepage"
                  description={isFeatured ? 'Displayed in curated home showcase' : 'Not pinned to homepage'}
                  checked={isFeatured}
                  onToggle={() => setIsFeatured((v) => !v)}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="border-b border-cream-200 pb-3">
              <h3 className="font-heading text-sm font-bold text-brand-700">Search Engine Preview</h3>
              <p className="text-[11px] text-muted mt-0.5">How this appears on Google and WhatsApp shares.</p>
            </div>

            <div className="space-y-3.5">
              <div className="rounded-xl border border-cream-200 bg-cream-50/60 p-3 text-xs space-y-1">
                <p className="text-[11px] text-muted truncate">
                  alhareer.com › product › {liveSlug}
                </p>
                <p className="font-semibold text-brand-700 truncate text-xs sm:text-sm">
                  {seoTitle || name || 'Product Name | Al Hareer'}
                </p>
                <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                  {seoDesc || product?.short_description || 'Shop luxury handcrafted ethnic menswear from Al Hareer.'}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Meta Title</label>
                  <span className={`text-[10px] ${seoTitle.length > 60 ? 'text-[#024F5F] font-bold' : 'text-muted'}`}>
                    {seoTitle.length}/60
                  </span>
                </div>
                <input
                  maxLength={70}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. Classic White Kurta Pajama | Al Hareer"
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Meta Description</label>
                  <span className={`text-[10px] ${seoDesc.length > 160 ? 'text-[#024F5F] font-bold' : 'text-muted'}`}>
                    {seoDesc.length}/160
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={170}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Concise summary for search engines..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Navigation Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-cream-200 pt-6 pb-12">
        <button
          type="button"
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-brand-700 hover:bg-cream-100 transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-xl border border-cream-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-brand-700 hover:bg-cream-100 transition-colors shadow-2xs"
          >
            Cancel
          </Link>

          {stepIndex < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-luxury transition-all cursor-pointer"
            >
              <span>Next: {STEPS[stepIndex + 1].label}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-[#CFAC64] hover:bg-[#B08F4F] px-8 py-3 text-xs sm:text-sm font-semibold text-white shadow-luxury hover:shadow-luxury-hover disabled:opacity-60 transition-all cursor-pointer"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{pending ? 'Saving Product...' : isEditing ? 'Save Changes' : 'Create Product'}</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
