'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ChevronDown,
  Loader2,
  FolderTree,
} from 'lucide-react';
import { createFaq, updateFaq, type FaqFormState } from '@/actions/admin/faqs';

const OTHER_VALUE = '__other__';

type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  is_active: boolean;
  show_on_home: boolean;
};

export default function FaqForm({ faq, categories = [] }: { faq?: Faq; categories?: string[] }) {
  const isEditing = !!faq;
  const action = isEditing ? updateFaq : createFaq;
  const [state, formAction, pending] = useActionState<FaqFormState, FormData>(action, {});

  // Form State for Live Preview
  const [isActive, setIsActive] = useState(faq?.is_active ?? true);
  const [showOnHome, setShowOnHome] = useState(faq?.show_on_home ?? false);
  const [question, setQuestion] = useState(faq?.question ?? '');
  const [answer, setAnswer] = useState(faq?.answer ?? '');

  const initialIsKnown = !faq?.category || categories.includes(faq.category);
  const [categorySelect, setCategorySelect] = useState(
    initialIsKnown ? faq?.category ?? categories[0] ?? '' : OTHER_VALUE
  );
  const [customCategory, setCustomCategory] = useState(initialIsKnown ? '' : faq?.category ?? '');
  const [previewOpen, setPreviewOpen] = useState(true);

  const isOther = categorySelect === OTHER_VALUE;
  const resolvedCategory = isOther ? customCategory.trim() || 'Custom Category' : categorySelect;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl">
      {/* Left Column: The Form */}
      <form
        action={formAction}
        className="lg:col-span-7 space-y-6 rounded-2xl border border-cream-200/80 bg-white p-5 sm:p-7 shadow-2xs"
      >
        {isEditing && <input type="hidden" name="id" value={faq.id} />}
        <input type="hidden" name="category" value={isOther ? customCategory : categorySelect} />
        <input type="hidden" name="is_active" value={isActive ? 'on' : 'off'} />
        <input type="hidden" name="show_on_home" value={showOnHome ? 'on' : 'off'} />

        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-cream-200 pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-200/70 text-brand-700">
            <HelpCircle className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-brand-700">
              {isEditing ? 'Edit FAQ Details' : 'Create New FAQ'}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Fill in the question, answer, and category. Preview updates live on the right.
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Category Selection */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Category
            </label>
            <span className="text-[11px] text-muted">Organizes FAQs into tabs on storefront</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={categorySelect}
              onChange={(e) => setCategorySelect(e.target.value)}
              className="w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3.5 py-2.5 text-sm text-brand-700 font-medium focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-2xs"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value={OTHER_VALUE}>+ Custom Category…</option>
            </select>

            {isOther && (
              <input
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type custom category name…"
                className="w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3.5 py-2.5 text-sm text-brand-700 font-medium focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-2xs"
              />
            )}
          </div>
        </div>

        {/* Question Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Question Title
            </label>
            <span className="text-[11px] text-muted">{question.length} chars</span>
          </div>
          <input
            required
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Do you offer custom made-to-measure sizing for Kurta Sets?"
            className="w-full rounded-xl border border-cream-300 bg-cream-50/50 px-4 py-2.5 text-sm font-semibold text-brand-700 placeholder:text-muted/50 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-2xs"
          />
          <p className="text-[11px] text-muted-light">
            Write a clear, concise question that visitors frequently ask before ordering.
          </p>
        </div>

        {/* Answer Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Answer Description
            </label>
            <span className="text-[11px] text-muted">
              {answer.trim() ? answer.trim().split(/\s+/).length : 0} words
            </span>
          </div>
          <textarea
            required
            name="answer"
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write the full, helpful response shown to customers when they click the question…"
            className="w-full rounded-xl border border-cream-300 bg-cream-50/50 p-4 text-sm text-brand-700 placeholder:text-muted/50 leading-relaxed focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-2xs"
          />
          <p className="text-[11px] text-muted-light">
            Line breaks are preserved on the storefront.
          </p>
        </div>

        {/* Visibility Setting */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-brand-700 block">
            Storefront Visibility
          </label>
          <button
            type="button"
            onClick={() => setIsActive((prev) => !prev)}
            className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all cursor-pointer ${
              isActive
                ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70'
                : 'border-cream-300 bg-cream-50/40 hover:bg-cream-100/60'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-bold text-brand-700">
                  {isActive ? 'Published & Visible' : 'Hidden Draft'}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {isActive ? 'Live on Storefront' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                {isActive
                  ? 'This question is currently visible to visitors on /faq.'
                  : 'Hidden from visitors. Only admins can see this in the dashboard.'}
              </p>
            </div>

            <span
              className={`relative flex h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                isActive ? 'bg-emerald-600' : 'bg-cream-400'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
          </button>
        </div>

        {/* Homepage Feature */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-brand-700 block">
            Homepage Display
          </label>
          <button
            type="button"
            onClick={() => setShowOnHome((prev) => !prev)}
            className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all cursor-pointer ${
              showOnHome
                ? 'border-blue-300 bg-blue-50/40 hover:bg-blue-50/70'
                : 'border-cream-300 bg-cream-50/40 hover:bg-cream-100/60'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-bold text-brand-700">
                  {showOnHome ? 'Shown on Homepage' : 'Not on Homepage'}
                </span>
                {showOnHome && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                    Homepage
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-0.5">
                {showOnHome
                  ? 'This FAQ will appear in the homepage preview section.'
                  : 'Only shown on the /faq page, not on the homepage.'}
              </p>
            </div>
            <span
              className={`relative flex h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                showOnHome ? 'bg-blue-600' : 'bg-cream-400'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition duration-200 ease-in-out ${
                  showOnHome ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 border-t border-cream-200 pt-5">
          <button
            type="submit"
            disabled={pending || (isOther && !customCategory.trim())}
            className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving FAQ…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> {isEditing ? 'Update FAQ' : 'Publish FAQ'}
              </>
            )}
          </button>

          <Link
            href="/admin/faqs"
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-muted hover:text-brand-700 hover:bg-cream-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Right Column: Live Storefront Accordion Mockup */}
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-2xl border border-cream-300/80 bg-gradient-to-br from-white via-cream-50/50 to-cream-100/60 p-5 shadow-2xs space-y-4 sticky top-24">
          <div className="flex items-center justify-between border-b border-cream-200/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-700 border border-brand-200/60">
                <Sparkles className="h-4 w-4 text-brand-600" />
              </span>
              <div>
                <h3 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-700">
                  Storefront Accordion Preview
                </h3>
                <p className="text-[11px] text-muted">Live customer view on /faq</p>
              </div>
            </div>

            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {isActive ? 'Live' : 'Hidden'}
            </span>
          </div>

          {/* Interactive Accordion Mockup Card */}
          <div className="rounded-xl border border-cream-300 bg-white shadow-sm overflow-hidden transition-all">
            <div
              onClick={() => setPreviewOpen((prev) => !prev)}
              className="p-4 cursor-pointer hover:bg-cream-50/50 transition-colors flex items-start justify-between gap-3 select-none"
            >
              <div className="space-y-1 min-w-0">
                <span className="inline-block rounded-full bg-brand-50 border border-brand-200/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                  {resolvedCategory}
                </span>
                <p className="font-heading text-sm font-bold text-brand-700 leading-snug">
                  {question.trim() || 'Your FAQ question title will appear here…'}
                </p>
              </div>

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-100 text-brand-600 mt-1">
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    previewOpen ? 'rotate-180' : ''
                  }`}
                />
              </span>
            </div>

            {previewOpen && (
              <div className="border-t border-cream-200/80 bg-cream-50/30 p-4 text-xs text-brand-700 leading-relaxed whitespace-pre-line">
                {answer.trim() ||
                  'Your detailed FAQ answer content will be rendered here. Customers can click to expand and read this advice.'}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-brand-50 border border-brand-200/60 p-3 text-[11px] text-brand-700 leading-relaxed">
            <span className="font-bold">Helpful Tip:</span> For luxury garments, answering questions about chest sizing, length customization, and fabric care builds immense buyer trust!
          </div>
        </div>
      </div>
    </div>
  );
}
