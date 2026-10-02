'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, ImageOff } from 'lucide-react';
import { deleteHeroSlide, toggleHeroSlideActive, reorderHeroSlides } from '@/actions/admin/heroSlides';

type HeroSlide = {
  id: string;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  is_active: boolean;
};

export default function HeroSlidesList({ slides }: { slides: HeroSlide[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleToggle = (id: string, active: boolean) => {
    startTransition(async () => {
      await toggleHeroSlideActive(id, active);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      return;
    }
    startTransition(async () => {
      await deleteHeroSlide(id);
      setConfirmingId(null);
      router.refresh();
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const reordered = [...slides];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    startTransition(async () => {
      await reorderHeroSlides(reordered.map((s) => s.id));
      router.refresh();
    });
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted">Slides rotate on the homepage hero banner in the order below.</p>
        <Link
          href="/admin/hero-slides/new"
          className="inline-flex items-center justify-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> New Slide
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="rounded-xl border border-cream-300 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-muted">No hero slides yet — create your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="flex flex-col gap-4 rounded-xl border border-cream-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(index, 'up')}
                  disabled={pending || index === 0}
                  className="rounded p-1 text-muted hover:bg-cream-100 hover:text-brand-600 disabled:opacity-30 transition-all"
                  title="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={pending || index === slides.length - 1}
                  className="rounded p-1 text-muted hover:bg-cream-100 hover:text-brand-600 disabled:opacity-30 transition-all"
                  title="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-cream-300 bg-cream-100">
                {slide.image_url ? (
                  <Image src={slide.image_url} alt="" fill sizes="112px" className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-light">
                    <ImageOff className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-brand-700">{slide.title || 'Untitled slide'}</p>
                {slide.subtitle && <p className="truncate text-xs text-muted">{slide.subtitle}</p>}
                {slide.button_text && (
                  <p className="mt-0.5 text-[11px] text-muted-light">
                    Button: <span className="font-semibold">{slide.button_text}</span>
                    {slide.button_link && <span className="ml-1">→ {slide.button_link}</span>}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted">
                  <input
                    type="checkbox"
                    checked={slide.is_active}
                    disabled={pending}
                    onChange={(e) => handleToggle(slide.id, e.target.checked)}
                  />
                  Active
                </label>
                <Link
                  href={`/admin/hero-slides/${slide.id}/edit`}
                  className="rounded-lg p-2 text-muted hover:text-brand-600 hover:bg-brand-500/10 transition-all"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(slide.id)}
                  disabled={pending}
                  className={`rounded-lg p-2 transition-all ${
                    confirmingId === slide.id ? 'text-red-600 bg-red-50' : 'text-muted hover:text-red-500 hover:bg-red-50'
                  }`}
                  title={confirmingId === slide.id ? 'Click again to confirm' : 'Delete'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
