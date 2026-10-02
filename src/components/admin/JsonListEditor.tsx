'use client';

const inputClass =
  'w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-brand-700 placeholder:text-muted-light transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500/20';
const fieldLabelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted';

export type JsonListFieldConfig = { key: string; label: string; type?: 'text' | 'textarea' };

/**
 * Controlled editor for a fixed-length array of small objects (e.g. 4
 * trust-bar items, 4 about-page pillars). The item count is fixed by
 * `items`'s length (no add/remove) since these arrays back fixed-column grid
 * layouts on the storefront that would break with a different count.
 * Serialization (to a hidden form input, or a `values` map entry via
 * JSON.stringify) is the caller's job — this component just edits the array.
 */
export default function JsonListEditor({
  items,
  onChange,
  fields,
  cardTitle,
}: {
  items: Record<string, string>[];
  onChange: (items: Record<string, string>[]) => void;
  fields: JsonListFieldConfig[];
  cardTitle: (index: number) => string;
}) {
  const updateField = (idx: number, key: string, value: string) => {
    onChange(items.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-lg border border-cream-300 bg-cream-50/60 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-600">{cardTitle(idx)}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className={fieldLabelClass}>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    rows={2}
                    value={item[f.key] ?? ''}
                    onChange={(e) => updateField(idx, f.key, e.target.value)}
                    className={inputClass}
                  />
                ) : (
                  <input
                    value={item[f.key] ?? ''}
                    onChange={(e) => updateField(idx, f.key, e.target.value)}
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
