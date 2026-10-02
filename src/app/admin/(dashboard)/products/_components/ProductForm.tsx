'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { createProduct, updateProduct, type ProductFormState } from '@/actions/admin/products';
import ImageUploader from '@/components/admin/ImageUploader';
import VideoUploader from '@/components/admin/VideoUploader';
import VariantsEditor, { type VariantRow, emptyVariant } from './VariantsEditor';
import ColorImageMapper, { type ColorRow, type GalleryImage } from './ColorImageMapper';
import FaqsEditor, { type FaqRow } from './FaqsEditor';
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  CheckCircle2,
  EyeOff,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Sliders,
  HelpCircle,
  Globe,
  Tag,
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

type Category = { id: string; name: string };
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

export default function ProductForm({ product, categories }: { product?: ProductRecord; categories: Category[] }) {
  const isEditing = !!product;
  const action = isEditing ? updateProduct : createProduct;
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, {});

  const [name, setName] = useState(product?.name ?? '');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [featuredImage, setFeaturedImage] = useState<string | null>(product?.featured_image_url ?? null);
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

  const [faqs, setFaqs] = useState<FaqRow[]>(
    product?.product_faqs?.slice().sort((a, b) => a.display_order - b.display_order).map((f) => ({ question: f.question, answer: f.answer })) ?? []
  );

  const [details, setDetails] = useState<Record<string, string>>(product?.details ?? {});

  // SEO live preview helpers
  const [seoTitle, setSeoTitle] = useState(product?.seo_title ?? '');
  const [seoDesc, setSeoDesc] = useState(product?.seo_description ?? '');

  const liveSlug = isEditing ? product.slug : slugPreview(name) || 'product-slug';

  return (
    <form action={formAction} className="space-y-6 max-w-full">
      {isEditing && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="featured_image_url" value={featuredImage || ''} />
      <input type="hidden" name="video_url" value={videoUrl || ''} />
      <input type="hidden" name="is_active" value={isActive ? 'on' : 'off'} />
      <input type="hidden" name="is_featured" value={isFeatured ? 'on' : 'off'} />
      <input type="hidden" name="details_json" value={JSON.stringify(details)} />

      {/* Top Header & Quick Action Bar */}
      <div className="sticky top-0 z-20 -mx-4 -mt-2 px-4 py-3 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-cream-200/80 transition-all sm:mx-0 sm:mt-0 sm:px-0 sm:py-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0">
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
                    isActive ? 'bg-green-100 text-green-800' : 'bg-cream-200 text-muted'
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-luxury hover:shadow-luxury-hover disabled:opacity-60 transition-all cursor-pointer"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              <span>{pending ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {state?.error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm font-semibold text-red-700 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Main Content) - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: General Details */}
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
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="name"
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
                name="short_description"
                rows={2}
                defaultValue={product?.short_description ?? ''}
                placeholder="A brief 1-2 sentence hook shown on product cards and quick search..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Full Description</label>
              <textarea
                name="description"
                rows={6}
                defaultValue={product?.description ?? ''}
                placeholder="Complete description covering royal craftsmanship, fabric richness, fit silhouette, and occasion styling notes..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Section 2: Sizes, Stock & Pricing (Variants) */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <Layers className="h-4 w-4 text-brand-600" />
              <div>
                <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Sizes &amp; Inventory</h2>
                <p className="text-xs text-muted">Define sizes, individual inventory counts, and selling prices.</p>
              </div>
            </div>
            <VariantsEditor variants={variants} onChange={setVariants} />
          </div>

          {/* Section 3: Photo Gallery & Swatches */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <ImageIcon className="h-4 w-4 text-brand-600" />
              <div>
                <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Product Media &amp; Swatches</h2>
                <p className="text-xs text-muted">High-resolution catalog gallery, color swatches, and optional video.</p>
              </div>
            </div>

            <ColorImageMapper
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

          {/* Section 4: Specifications & Details */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <Sliders className="h-4 w-4 text-brand-600" />
              <div>
                <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Specifications &amp; Craft Details</h2>
                <p className="text-xs text-muted">Fabric composition, fit, care instructions, and set components.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Primary Fabric</label>
                <input
                  name="fabric"
                  defaultValue={product?.fabric ?? ''}
                  placeholder="e.g. Pure Silk, Chanderi, Cotton"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Primary Color</label>
                <input
                  name="color"
                  defaultValue={product?.color ?? ''}
                  placeholder="e.g. Ivory White, Midnight Blue"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Fit Silhouette</label>
                <input
                  name="fit_type"
                  defaultValue={product?.fit_type ?? ''}
                  placeholder="e.g. Tailored Fit, Regular Fit, Slim"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Occasion</label>
                <input
                  name="occasion"
                  defaultValue={product?.occasion ?? ''}
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

              <div className="sm:col-span-2">
                <label className={labelClass}>Care Instructions</label>
                <input
                  name="care_instructions"
                  defaultValue={product?.care_instructions ?? ''}
                  placeholder="e.g. Dry clean recommended. Do not bleach. Cool iron."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 5: FAQs */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <HelpCircle className="h-4 w-4 text-brand-600" />
              <div>
                <h2 className="font-heading text-sm sm:text-base font-bold text-brand-700">Frequently Asked Questions</h2>
                <p className="text-xs text-muted">Customer questions displayed on this product's page.</p>
              </div>
            </div>
            <FaqsEditor faqs={faqs} onChange={setFaqs} />
          </div>
        </div>

        {/* Right Column (Sidebar) - 4 cols */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* Card 1: Visibility & Publishing */}
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

          {/* Card 2: Primary Thumbnail */}
          <div className={cardClass}>
            <div className="border-b border-cream-200 pb-3">
              <h3 className="font-heading text-sm font-bold text-brand-700">Main Featured Image</h3>
              <p className="text-[11px] text-muted mt-0.5">Primary thumbnail shown on collection cards &amp; cart.</p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-cream-200 bg-cream-50/40">
              <ImageUploader
                value={featuredImage}
                onChange={(v) => setFeaturedImage(v as string | null)}
                folder="/al-hareer/products"
                previewClassName="h-44 w-44 rounded-xl shadow-xs"
              />
              <p className="text-[11px] text-muted mt-2 text-center">
                Recommended: 3:4 portrait ratio (e.g. 1200 x 1600px)
              </p>
            </div>
          </div>

          {/* Card 3: Organization & Tags */}
          <div className={cardClass}>
            <div className="border-b border-cream-200 pb-3">
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-brand-600" />
                <h3 className="font-heading text-sm font-bold text-brand-700">Categorization</h3>
              </div>
              <p className="text-[11px] text-muted mt-0.5">Organize into collections and product types.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Collection / Category</label>
                <select name="category_id" defaultValue={product?.category_id ?? ''} className={inputClass}>
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Merchandise Badge</label>
                <input
                  name="badge"
                  defaultValue={product?.badge ?? ''}
                  placeholder="e.g. BESTSELLER, NEW ARRIVAL"
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-muted">Displays as a golden corner tag on the store card.</p>
              </div>
            </div>
          </div>

          {/* Card 4: Search Engine Optimization (SEO) */}
          <div className={cardClass}>
            <div className="border-b border-cream-200 pb-3">
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-brand-600" />
                <h3 className="font-heading text-sm font-bold text-brand-700">Search Engine Preview</h3>
              </div>
              <p className="text-[11px] text-muted mt-0.5">How this appears on Google and WhatsApp shares.</p>
            </div>

            <div className="space-y-3.5">
              {/* Google Snippet Preview Box */}
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
                  <span className={`text-[10px] ${seoTitle.length > 60 ? 'text-red-500 font-bold' : 'text-muted'}`}>
                    {seoTitle.length}/60
                  </span>
                </div>
                <input
                  name="seo_title"
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
                  <span className={`text-[10px] ${seoDesc.length > 160 ? 'text-red-500 font-bold' : 'text-muted'}`}>
                    {seoDesc.length}/160
                  </span>
                </div>
                <textarea
                  name="seo_description"
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
      </div>

      {/* Bottom Save Action Footer */}
      <div className="flex items-center gap-3 border-t border-cream-200 pt-6 pb-12">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-8 py-3 text-xs sm:text-sm font-semibold text-white shadow-luxury hover:shadow-luxury-hover disabled:opacity-60 transition-all cursor-pointer"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{pending ? 'Saving Product...' : isEditing ? 'Save Changes' : 'Create Product'}</span>
        </button>

        <Link
          href="/admin/products"
          className="rounded-xl border border-cream-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-brand-700 hover:bg-cream-100 transition-colors shadow-2xs"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
