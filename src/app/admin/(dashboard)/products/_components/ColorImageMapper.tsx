'use client';

import { useState } from 'react';
import { Palette, Info, Upload, CheckCircle2, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export type ColorRow = { name: string; hex: string; image: string | null; images?: string[] };
export type GalleryImage = { image_url: string; sort_order: number };

export const emptyColor = (name = ''): ColorRow => ({ name, hex: '#CFAC64', image: null, images: [] });

export default function ColorImageMapper({
  colorNames,
  colors,
  onColorsChange,
  images,
  onImagesChange,
  folder = '/al-hareer/products',
}: {
  // The exact color names in use on the Sizes & Inventory table below — this
  // is the single source of truth for "which colors does this product have".
  // Renaming/adding/removing a color happens there; here you just attach a
  // hex swatch and a photo set (picked from the shared gallery) to each one.
  colorNames: string[];
  colors: ColorRow[];
  onColorsChange: (colors: ColorRow[]) => void;
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  folder?: string;
}) {
  const [activeColor, setActiveColor] = useState<string>('');

  const tabColor = colorNames.includes(activeColor) ? activeColor : colorNames[0] || '';

  const getColor = (name: string): ColorRow => {
    const found = colors.find((c) => c.name === name);
    if (!found) return emptyColor(name);
    // Older products only stored a single `image` per color — treat it as a one-photo set.
    if (!found.images?.length && found.image) return { ...found, images: [found.image] };
    return found;
  };

  const setColorField = (name: string, patch: Partial<ColorRow>) => {
    const existing = colors.some((c) => c.name === name);
    const next = existing
      ? colors.map((c) => (c.name === name ? { ...c, ...patch } : c))
      : [...colors, { ...emptyColor(name), ...patch }];
    onColorsChange(next);
  };

  const setColorImages = (name: string, imgs: string[]) => {
    setColorField(name, { images: imgs, image: imgs[0] ?? null });
  };

  const galleryUrls = images.slice().sort((a, b) => a.sort_order - b.sort_order).map((i) => i.image_url);
  const addToGallery = (urls: string[]) => {
    const merged = [...galleryUrls, ...urls];
    onImagesChange(merged.map((url, i) => ({ image_url: url, sort_order: i })));
  };
  const deleteFromGallery = (url: string) => {
    onImagesChange(galleryUrls.filter((u) => u !== url).map((u, i) => ({ image_url: u, sort_order: i })));
    onColorsChange(colors.map((c) => ({ ...c, images: (c.images ?? []).filter((u) => u !== url), image: c.image === url ? (c.images ?? []).find((u) => u !== url) ?? null : c.image })));
  };

  const handleUploadForColor = async (urls: string[]) => {
    addToGallery(urls);
    if (tabColor) setColorImages(tabColor, [...(getColor(tabColor).images ?? []), ...urls]);
  };

  const activeImages = getColor(tabColor).images ?? [];

  return (
    <div className="space-y-6">
      {/* General Gallery Upload */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-700">Photo Gallery</label>
          <p className="text-xs text-muted mt-0.5">
            Upload every photo you have for this product here first — you'll pick which ones belong to each color below. The first photo (star) is used as the main thumbnail on cards and the cart.
          </p>
        </div>
        <div className="rounded-xl border border-cream-200 bg-cream-50/40 p-4">
          <ImageUploader
            value={galleryUrls}
            onChange={(v) => onImagesChange((v as string[]).map((url, i) => ({ image_url: url, sort_order: i })))}
            multiple
            showCoverPicker
            folder={folder}
            previewClassName="h-28 w-28 sm:h-32 sm:w-32"
          />
        </div>
      </div>

      {/* Variant Gallery Studio */}
      <div className="space-y-3 border-t border-cream-200 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-brand-600" />
            <label className="text-xs font-bold uppercase tracking-wider text-brand-700">Color Gallery Mapping</label>
          </div>
          {colorNames.length > 0 && (
            <span className="text-xs font-medium text-muted">{colorNames.length} {colorNames.length === 1 ? 'color' : 'colors'}</span>
          )}
        </div>

        {colorNames.length === 0 ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-cream-300 bg-cream-50/50 p-4">
            <Info className="h-4 w-4 text-muted shrink-0 mt-0.5" />
            <p className="text-xs text-muted">
              No colors yet. Add a color name to any row in <strong className="text-brand-700">Sizes &amp; Inventory</strong> above —
              it will show up here so you can attach its own photos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Color Tabs */}
            <div className="flex flex-wrap gap-2 bg-cream-50/60 p-2.5 rounded-2xl border border-cream-200">
              {colorNames.map((name) => {
                const c = getColor(name);
                const hex = /^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : '#CFAC64';
                const isActive = tabColor === name;
                const count = (c.images ?? []).length;
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setActiveColor(name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                        : 'bg-white text-brand-700 border-cream-300 hover:border-brand-400'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-cream-300 shrink-0" style={{ backgroundColor: hex }} />
                    <span>{name}</span>
                    <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-muted'}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {tabColor && (
              <div className="rounded-2xl border border-cream-200 bg-white p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Photos for</span>
                    <span className="inline-block h-4 w-4 rounded-full border border-cream-300" style={{ backgroundColor: /^#[0-9a-f]{6}$/i.test(getColor(tabColor).hex) ? getColor(tabColor).hex : '#CFAC64' }} />
                    <span className="text-sm font-bold text-brand-700">{tabColor}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-muted">{activeImages.length} photo{activeImages.length === 1 ? '' : 's'} attached</span>
                </div>

                {/* Selected images reorder strip */}
                {activeImages.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted block">Photo order</span>
                    <div className="flex flex-wrap gap-2.5 p-2.5 bg-cream-50/60 border border-cream-200 rounded-xl">
                      {activeImages.map((url, idx) => (
                        <div key={url} className="relative w-14 h-18 rounded-lg overflow-hidden border border-cream-300 bg-white flex flex-col">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-12 object-cover" />
                          <div className="flex items-center justify-between bg-brand-700 px-1 py-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const next = [...activeImages];
                                [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                                setColorImages(tabColor, next);
                              }}
                              className="text-white disabled:opacity-30"
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                            <span className="text-[8px] text-white/80">{idx + 1}</span>
                            <button
                              type="button"
                              disabled={idx === activeImages.length - 1}
                              onClick={() => {
                                const next = [...activeImages];
                                [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                                setColorImages(tabColor, next);
                              }}
                              className="text-white disabled:opacity-30"
                            >
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Upload box for this color */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5 text-brand-600" />
                      <span className="text-[11px] font-bold uppercase text-brand-700">Upload for {tabColor}</span>
                    </div>
                    {/* value is always empty on purpose: this box only uploads NEW photos,
                        which land in the shared gallery and get attached to this color.
                        Existing photos are shown/toggled in the grid beside it. */}
                    <ImageUploader
                      value={[]}
                      onChange={(v) => handleUploadForColor(v as string[])}
                      multiple
                      folder={folder}
                      previewClassName="h-24 w-24"
                    />
                  </div>

                  {/* Gallery picker grid */}
                  <div className="lg:col-span-8 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-muted">Select from gallery</span>
                      <span className="text-[10px] text-muted">Click to toggle · trash to delete everywhere</span>
                    </div>
                    {galleryUrls.length === 0 ? (
                      <div className="p-6 border border-dashed border-cream-300 rounded-xl text-center text-xs text-muted bg-cream-50/40">
                        No photos in the gallery yet. Upload some above.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto p-2.5 bg-cream-50/50 rounded-xl border border-cream-200">
                        {galleryUrls.map((url, idx) => {
                          const isChecked = activeImages.includes(url);
                          return (
                            <div
                              key={url}
                              onClick={() => {
                                const next = isChecked ? activeImages.filter((u) => u !== url) : [...activeImages, url];
                                setColorImages(tabColor, next);
                              }}
                              className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                                isChecked ? 'border-brand-600 ring-2 ring-brand-500/25' : 'border-cream-300/80 opacity-75 hover:opacity-100'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFromGallery(url);
                                }}
                                className="absolute top-1 left-1 z-10 w-5 h-5 bg-[#024F5F] hover:bg-[#00303A] text-white rounded-full flex items-center justify-center shadow-xs"
                                title="Delete this photo entirely"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </button>
                              {isChecked ? (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-brand-700 text-white rounded-full flex items-center justify-center border border-white">
                                  <CheckCircle2 className="h-3 w-3" />
                                </div>
                              ) : (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-white/80 text-muted rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Plus className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
