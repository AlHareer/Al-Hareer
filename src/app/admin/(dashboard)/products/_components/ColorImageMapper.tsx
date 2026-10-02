'use client';

import { Plus, Trash2, Palette } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export type ColorRow = { name: string; hex: string; image: string | null };
export type GalleryImage = { image_url: string; sort_order: number };

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50/70 px-3 py-2 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10';

export const emptyColor = (): ColorRow => ({ name: '', hex: '#1e293b', image: null });

export default function ColorImageMapper({
  colors,
  onColorsChange,
  images,
  onImagesChange,
  folder = '/al-hareer/products',
}: {
  colors: ColorRow[];
  onColorsChange: (colors: ColorRow[]) => void;
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  folder?: string;
}) {
  const updateColor = (idx: number, key: keyof ColorRow, value: string | null) => {
    onColorsChange(colors.map((c, i) => (i === idx ? { ...c, [key]: value } : c)));
  };
  const addColor = () => onColorsChange([...colors, emptyColor()]);
  const removeColor = (idx: number) => onColorsChange(colors.filter((_, i) => i !== idx));

  const galleryUrls = images.slice().sort((a, b) => a.sort_order - b.sort_order).map((i) => i.image_url);
  const setGalleryUrls = (urls: string[]) => {
    onImagesChange(urls.map((url, i) => ({ image_url: url, sort_order: i })));
  };

  return (
    <div className="space-y-6">
      <input type="hidden" name="colors_json" value={JSON.stringify(colors)} />
      <input type="hidden" name="images_json" value={JSON.stringify(images)} />

      {/* Gallery Images Section */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-700">Photo Gallery</label>
          <p className="text-xs text-muted mt-0.5">
            Upload multiple high-resolution photos. Drag or click the star to set the cover image.
          </p>
        </div>
        <div className="rounded-xl border border-cream-200 bg-cream-50/40 p-4">
          <ImageUploader
            value={galleryUrls}
            onChange={(v) => setGalleryUrls(v as string[])}
            multiple
            showCoverPicker
            folder={folder}
            previewClassName="h-28 w-28 sm:h-32 sm:w-32"
          />
        </div>
      </div>

      {/* Color Swatches Section */}
      <div className="space-y-3 border-t border-cream-200 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-brand-600" />
              <label className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Color Options &amp; Swatches
              </label>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Optional color circles shown on the product page for customer selection.
            </p>
          </div>
          {colors.length > 0 && (
            <span className="text-xs font-medium text-muted">{colors.length} {colors.length === 1 ? 'color' : 'colors'}</span>
          )}
        </div>

        {colors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50/50 p-4 text-center">
            <p className="text-xs text-muted">No custom color swatches added. Single color or variant colors will be used.</p>
            <button
              type="button"
              onClick={addColor}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add Color Swatch
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {colors.map((c, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-cream-200 bg-white p-3 shadow-2xs"
              >
                {/* Color preview circle & color picker */}
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0" title="Click to pick swatch color">
                    <input
                      type="color"
                      value={/^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : '#cccccc'}
                      onChange={(e) => updateColor(i, 'hex', e.target.value)}
                      className="h-9 w-9 cursor-pointer rounded-xl border border-cream-300 bg-cream-50 p-0.5 shadow-2xs"
                    />
                  </div>
                  <input
                    placeholder="#RRGGBB"
                    value={c.hex}
                    onChange={(e) => updateColor(i, 'hex', e.target.value)}
                    className={`${inputClass} w-24 font-mono uppercase text-xs`}
                  />
                </div>

                {/* Color Name */}
                <div className="flex-1 min-w-0">
                  <input
                    placeholder="Color Name (e.g. Navy Blue, Off-White)"
                    value={c.name}
                    onChange={(e) => updateColor(i, 'name', e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Optional Swatch Image */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-muted hidden sm:inline">Fabric sample:</span>
                  <ImageUploader
                    value={c.image}
                    onChange={(v) => updateColor(i, 'image', v as string | null)}
                    folder={folder}
                    previewClassName="h-9 w-9 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(i)}
                    className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto sm:ml-0"
                    title="Remove color swatch"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addColor}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 py-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Another Color
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
