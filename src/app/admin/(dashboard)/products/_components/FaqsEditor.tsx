'use client';

import { Plus, Trash2, HelpCircle } from 'lucide-react';

export type FaqRow = { question: string; answer: string };

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10';

export default function FaqsEditor({ faqs, onChange }: { faqs: FaqRow[]; onChange: (faqs: FaqRow[]) => void }) {
  const update = (idx: number, key: keyof FaqRow, value: string) => {
    onChange(faqs.map((f, i) => (i === idx ? { ...f, [key]: value } : f)));
  };

  const add = () => onChange([...faqs, { question: '', answer: '' }]);
  const remove = (idx: number) => onChange(faqs.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3.5">
      {faqs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50/50 p-5 text-center">
          <HelpCircle className="h-6 w-6 text-muted/60 mx-auto mb-1.5" />
          <p className="text-xs text-muted">No custom FAQs yet. Add questions like sizing, fabric care, or delivery time.</p>
          <button
            type="button"
            onClick={add}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add First Question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl border border-cream-200 bg-white p-3.5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center justify-center rounded-lg bg-cream-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                  Q{i + 1}
                </span>
                <input
                  placeholder="e.g. Is the fabric pre-shrunk?"
                  value={f.question}
                  onChange={(e) => update(i, 'question', e.target.value)}
                  className={`${inputClass} font-medium`}
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="shrink-0 p-2 text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC] rounded-lg transition-colors"
                  title="Delete question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                placeholder="Write the clear answer here..."
                rows={2}
                value={f.answer}
                onChange={(e) => update(i, 'answer', e.target.value)}
                className={inputClass}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={add}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 py-1"
          >
            <Plus className="h-4 w-4" /> Add Another Question
          </button>
        </div>
      )}
    </div>
  );
}
