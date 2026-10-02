'use client';

import { Plus, Trash2, CheckCircle2, EyeOff } from 'lucide-react';

export type VariantRow = {
  variant_name: string;
  color: string;
  color_hex: string;
  price: string;
  original_price: string;
  stock_quantity: string;
  is_active: boolean;
};

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50/70 px-3 py-2 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10';

export const emptyVariant = (name = ''): VariantRow => ({
  variant_name: name,
  color: '',
  color_hex: '',
  price: '',
  original_price: '',
  stock_quantity: '10',
  is_active: true,
});

export default function VariantsEditor({
  variants,
  onChange,
}: {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
}) {
  const update = (idx: number, key: keyof VariantRow, value: string | boolean) => {
    onChange(variants.map((v, i) => (i === idx ? { ...v, [key]: value } : v)));
  };

  const add = (name = '') => onChange([...variants, emptyVariant(name)]);
  const remove = (idx: number) => {
    if (variants.length <= 1) {
      // Keep at least one empty row
      onChange([emptyVariant()]);
      return;
    }
    onChange(variants.filter((_, i) => i !== idx));
  };

  const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock_quantity, 10) || 0), 0);
  const activeCount = variants.filter((v) => v.is_active).length;

  // Quick preset helper
  const applyPreset = (presetSizes: string[]) => {
    const basePrice = variants[0]?.price || '';
    const baseOriginal = variants[0]?.original_price || '';
    const baseStock = variants[0]?.stock_quantity || '10';
    const baseColor = variants[0]?.color || '';
    const baseHex = variants[0]?.color_hex || '';

    const newVariants = presetSizes.map((sz) => ({
      variant_name: sz,
      color: baseColor,
      color_hex: baseHex,
      price: basePrice,
      original_price: baseOriginal,
      stock_quantity: baseStock,
      is_active: true,
    }));
    onChange(newVariants);
  };

  return (
    <div className="space-y-3.5">
      <input type="hidden" name="variants_json" value={JSON.stringify(variants)} />

      {/* Header bar with summary & quick presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-cream-100/60 px-3.5 py-2 text-xs">
        <div className="flex items-center gap-2 text-muted font-medium">
          <span>
            {variants.length} {variants.length === 1 ? 'Size' : 'Sizes'} ({activeCount} active)
          </span>
          <span>·</span>
          <span>Total Stock: <strong className="text-brand-700">{totalStock}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-muted hidden sm:inline">Quick Fill:</span>
          <button
            type="button"
            onClick={() => applyPreset(['S', 'M', 'L', 'XL'])}
            className="rounded-md border border-cream-300 bg-white px-2 py-0.5 font-medium text-brand-700 hover:bg-cream-100 transition-colors shadow-2xs"
            title="Populate sizes S, M, L, XL"
          >
            S, M, L, XL
          </button>
          <button
            type="button"
            onClick={() => applyPreset(['38', '40', '42', '44'])}
            className="rounded-md border border-cream-300 bg-white px-2 py-0.5 font-medium text-brand-700 hover:bg-cream-100 transition-colors shadow-2xs"
            title="Populate kurta sizes 38, 40, 42, 44"
          >
            38, 40, 42, 44
          </button>
          <button
            type="button"
            onClick={() => applyPreset(['Free Size'])}
            className="rounded-md border border-cream-300 bg-white px-2 py-0.5 font-medium text-brand-700 hover:bg-cream-100 transition-colors shadow-2xs"
            title="Single Free Size variant"
          >
            Free Size
          </button>
        </div>
      </div>

      {/* Desktop Table View (>= lg) */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-cream-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/80 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-cream-200">
            <tr>
              <th className="py-2.5 px-3 w-[18%]">Size / Name *</th>
              <th className="py-2.5 px-3 w-[22%]">Color &amp; Swatch</th>
              <th className="py-2.5 px-3 w-[16%]">Selling Price (₹) *</th>
              <th className="py-2.5 px-3 w-[16%]">Regular Price (₹)</th>
              <th className="py-2.5 px-3 w-[12%]">Stock *</th>
              <th className="py-2.5 px-3 w-[10%] text-center">Status</th>
              <th className="py-2.5 px-3 w-[6%] text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200 bg-white">
            {variants.map((v, i) => (
              <tr key={i} className="hover:bg-cream-50/50 transition-colors">
                <td className="py-2 px-3">
                  <input
                    required
                    placeholder="e.g. M, 40"
                    value={v.variant_name}
                    onChange={(e) => update(i, 'variant_name', e.target.value)}
                    className={inputClass}
                  />
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <input
                      placeholder="Color name"
                      value={v.color}
                      onChange={(e) => update(i, 'color', e.target.value)}
                      className={inputClass}
                    />
                    <div className="relative shrink-0" title="Click to pick swatch color">
                      <input
                        type="color"
                        value={/^#[0-9a-f]{6}$/i.test(v.color_hex) ? v.color_hex : '#cccccc'}
                        onChange={(e) => update(i, 'color_hex', e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded-lg border border-cream-300 bg-cream-50 p-0.5 transition-transform hover:scale-105"
                      />
                    </div>
                  </div>
                </td>
                <td className="py-2 px-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs font-semibold">₹</span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      placeholder="1499"
                      value={v.price}
                      onChange={(e) => update(i, 'price', e.target.value)}
                      className={`${inputClass} pl-6 font-medium`}
                    />
                  </div>
                </td>
                <td className="py-2 px-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/60 text-xs font-semibold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="2499"
                      value={v.original_price}
                      onChange={(e) => update(i, 'original_price', e.target.value)}
                      className={`${inputClass} pl-6 text-muted`}
                    />
                  </div>
                </td>
                <td className="py-2 px-3">
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    placeholder="10"
                    value={v.stock_quantity}
                    onChange={(e) => update(i, 'stock_quantity', e.target.value)}
                    className={`${inputClass} font-medium`}
                  />
                </td>
                <td className="py-2 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => update(i, 'is_active', !v.is_active)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                      v.is_active
                        ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        : 'bg-cream-100 text-muted border border-cream-300 hover:bg-cream-200'
                    }`}
                  >
                    {v.is_active ? <CheckCircle2 className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{v.is_active ? 'Active' : 'Hidden'}</span>
                  </button>
                </td>
                <td className="py-2 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove variant"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card View (< lg) */}
      <div className="lg:hidden space-y-3">
        {variants.map((v, i) => (
          <div key={i} className="rounded-xl border border-cream-200 bg-white p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-cream-100 pb-2">
              <span className="text-xs font-bold text-brand-700">
                Variant #{i + 1} {v.variant_name ? `(${v.variant_name})` : ''}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => update(i, 'is_active', !v.is_active)}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-all ${
                    v.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-cream-100 text-muted border border-cream-300'
                  }`}
                >
                  {v.is_active ? 'Active' : 'Hidden'}
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1 text-muted hover:text-red-500 hover:bg-red-50 rounded-md"
                  title="Remove variant"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-brand-700 block mb-1">Size / Name *</label>
                <input
                  required
                  placeholder="e.g. M, L, 42"
                  value={v.variant_name}
                  onChange={(e) => update(i, 'variant_name', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-700 block mb-1">Color (Optional)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    placeholder="Color"
                    value={v.color}
                    onChange={(e) => update(i, 'color', e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="color"
                    value={/^#[0-9a-f]{6}$/i.test(v.color_hex) ? v.color_hex : '#cccccc'}
                    onChange={(e) => update(i, 'color_hex', e.target.value)}
                    className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-cream-300 bg-cream-50 p-0.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-700 block mb-1">Selling Price (₹) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  placeholder="1499"
                  value={v.price}
                  onChange={(e) => update(i, 'price', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-700 block mb-1">Regular Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="2499"
                  value={v.original_price}
                  onChange={(e) => update(i, 'original_price', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-brand-700 block mb-1">Stock Quantity *</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  placeholder="10"
                  value={v.stock_quantity}
                  onChange={(e) => update(i, 'stock_quantity', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Variant button */}
      <button
        type="button"
        onClick={() => add()}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-300 bg-brand-50/40 py-2.5 text-xs font-semibold text-brand-700 hover:border-brand-500 hover:bg-brand-50 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Add Another Size / Variant</span>
      </button>
    </div>
  );
}
