'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { createCategory, updateCategory, type CategoryFormState } from '@/actions/admin/categories';
import { ChevronDown } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { ArrowLeft, Loader2 } from 'lucide-react';

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:bg-white focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-700';

function slugPreview(text: string) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type Category = {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  parent_id?: string | null;
};

type ParentOption = { id: string; name: string };

export default function CategoryForm({ category, parentOptions = [] }: { category?: Category; parentOptions?: ParentOption[] }) {
  const isEditing = !!category;
  const action = isEditing ? updateCategory : createCategory;
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(action, {});

  const [imageUrl, setImageUrl] = useState<string | null>(category?.image_url ?? null);
  const [name, setName] = useState(category?.name ?? '');
  const [isActive, setIsActive] = useState(category?.is_active ?? true);

  return (
    <div className="max-w-2xl">
      {/* Back button & Title */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/categories"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 bg-white text-muted hover:border-brand-400 hover:text-brand-600 transition-colors shadow-2xs"
          title="Back to Categories"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-heading text-xl font-bold text-brand-700">
            {isEditing ? 'Edit Category' : 'New Category'}
          </h1>
          <p className="text-xs text-muted">
            {isEditing ? `Update details for "${category.name}"` : 'Add a new product category to your store.'}
          </p>
        </div>
      </div>

      <form action={formAction} className="rounded-2xl border border-cream-300 bg-white p-5 sm:p-7 shadow-2xs space-y-5">
        {isEditing && <input type="hidden" name="id" value={category.id} />}
        <input type="hidden" name="image_url" value={imageUrl || ''} />
        <input type="hidden" name="is_active" value={isActive ? 'on' : 'off'} />

        {/* Error notification */}
        {state?.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {state.error}
          </div>
        )}

        {/* Category Name */}
        <div>
          <label className={labelClass}>
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Daily Wear, Festive, Wedding"
            className={inputClass}
          />
          {name && (
            <p className="mt-1 font-mono text-[11px] text-muted">
              Slug: /{isEditing && category.slug ? category.slug : slugPreview(name)}
            </p>
          )}
        </div>

        {/* Parent Category */}
        <div>
          <label className={labelClass}>Parent Category</label>
          <div className="relative">
            <select
              name="parent_id"
              defaultValue={category?.parent_id ?? ''}
              className={`${inputClass} appearance-none pr-9`}
            >
              <option value="">— None (top-level category) —</option>
              {parentOptions
                .filter((p) => p.id !== category?.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          </div>
          <p className="mt-1 text-[11px] text-muted">Choose a parent to make this a sub-category.</p>
        </div>

        {/* Cover Image */}
        <div>
          <label className={labelClass}>Category Image</label>
          <ImageUploader
            value={imageUrl}
            onChange={(v) => setImageUrl(v as string | null)}
            folder="/al-hareer/categories"
            previewClassName="h-32 w-32 sm:h-36 sm:w-36"
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={category?.description ?? ''}
            placeholder="Short description for this category (optional)"
            className={inputClass}
          />
        </div>

        {/* Sort Order & Visibility Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className={labelClass}>Sort Order</label>
            <input
              type="number"
              name="sort_order"
              defaultValue={category?.sort_order ?? 0}
              className={inputClass}
            />
            <p className="mt-1 text-[11px] text-muted">0 appears first, then 1, 2, 3...</p>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 transition-colors">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'
                    }`}
                  />
                  <span className="text-xs font-semibold text-brand-700">
                    {isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-[10px] text-muted mt-0.5">
                  {isActive ? 'Visible in store' : 'Draft / Hidden'}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => setIsActive((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                  isActive ? 'bg-emerald-600' : 'bg-stone-300'
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
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 border-t border-cream-200 pt-5">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-luxury hover:shadow-luxury-hover disabled:opacity-60 transition-all"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{pending ? 'Saving...' : isEditing ? 'Update Category' : 'Save Category'}</span>
          </button>

          <Link
            href="/admin/categories"
            className="rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-brand-700 hover:bg-cream-100 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
