'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { createHeroSlide, updateHeroSlide, type HeroSlideFormState } from '@/actions/admin/heroSlides';
import ImageUploader from '@/components/admin/ImageUploader';

const inputClass =
  'w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 text-sm text-brand-700 placeholder:text-muted-light transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500/20';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-widest text-brand-600';

type HeroSlide = {
  id: string;
  image_url: string | null;
  tag: string | null;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
};

export default function HeroSlideForm({ slide }: { slide?: HeroSlide }) {
  const isEditing = !!slide;
  const action = isEditing ? updateHeroSlide : createHeroSlide;
  const [state, formAction, pending] = useActionState<HeroSlideFormState, FormData>(action, {});
  const [imageUrl, setImageUrl] = useState<string | null>(slide?.image_url ?? null);
  const [isActive, setIsActive] = useState(slide?.is_active ?? true);

  return (
    <form action={formAction} className="max-w-3xl space-y-6 rounded-2xl border border-cream-300 bg-white p-6 md:p-8 shadow-sm">
      {isEditing && <input type="hidden" name="id" value={slide.id} />}
      <input type="hidden" name="image_url" value={imageUrl || ''} />
      <input type="hidden" name="is_active" value={isActive ? 'on' : 'off'} />

      {state?.error && (
        <div className="flex items-center gap-2 rounded-lg border border-[#CFAC64] bg-[#F6F1EC] p-3.5 text-sm text-[#024F5F]">
          <span className="h-2 w-2 rounded-full bg-[#024F5F] shrink-0" />
          {state.error}
        </div>
      )}

      <div>
        <label className={labelClass}>Slide Image</label>
        <ImageUploader
          value={imageUrl}
          onChange={(v) => setImageUrl(v as string | null)}
          folder="/al-hareer/hero-slides"
          previewClassName="aspect-[3/2] w-full max-w-lg"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Tag (small overline text)</label>
          <input name="tag" defaultValue={slide?.tag ?? ''} placeholder="e.g. TIMELESS TRADITION" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Subtitle</label>
          <input name="subtitle" defaultValue={slide?.subtitle ?? ''} placeholder="A short supporting line" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Title (up to 3 lines — press Enter for a line break)</label>
          <textarea
            name="title"
            rows={3}
            defaultValue={slide?.title ?? ''}
            placeholder={'Tradition\nWears Better\nToday'}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Button Text</label>
          <input name="button_text" defaultValue={slide?.button_text ?? ''} placeholder="e.g. Shop Now" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Button Link</label>
          <input name="button_link" defaultValue={slide?.button_link ?? ''} placeholder="/shop" className={inputClass} />
        </div>
      </div>

      <div className="pt-2">
        <label className={labelClass}>Visibility Status</label>
        <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-700">
                {isActive ? 'Visible' : 'Hidden'}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  isActive
                    ? 'bg-[#F6F1EC]/80 text-[#024F5F]'
                    : 'bg-[#F6F1EC]/70 text-[#024F5F]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? 'bg-[#024F5F] animate-pulse' : 'bg-[#F6F1EC]'
                  }`}
                />
                {isActive ? 'Live on Storefront' : 'Draft'}
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              {isActive
                ? 'This banner slide is displayed in the hero carousel.'
                : 'Slide is hidden from visitors on the store.'}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              isActive ? 'bg-[#024F5F]' : 'bg-[#F6F1EC]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-cream-300 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm disabled:opacity-60 transition-all"
        >
          {pending ? 'Saving…' : isEditing ? 'Update Slide' : 'Create Slide'}
        </button>
        <Link href="/admin/hero-slides" className="text-sm font-semibold text-muted hover:text-brand-600 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  );
}
