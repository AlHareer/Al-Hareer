'use client';

import { useState } from 'react';
import { CheckCircle2, EyeOff, Plus, Star, Trash2, Zap, X } from 'lucide-react';
import { type VariantRow } from './VariantsEditor';

const inputClass =
  'w-full min-w-0 rounded-xl border border-cream-300 bg-cream-50/70 px-3 py-2 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-700';

const SIZE_PRESETS = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const COLOR_PRESETS = [
  { name: 'Black', hex: '#0F0F0F' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Off-White', hex: '#FAF9F6' },
  { name: 'Cream', hex: '#FDF6E2' },
  { name: 'Beige', hex: '#E1D9C1' },
  { name: 'Grey', hex: '#8A8A8A' },
  { name: 'Navy', hex: '#1A2536' },
  { name: 'Sky Blue', hex: '#8EC5E8' },
  { name: 'Olive', hex: '#4D5844' },
  { name: 'Emerald Green', hex: '#046B4B' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Gold', hex: '#CFAC64' },
];

const HEX_RE = /^#[0-9a-f]{6}$/i;
const safeHex = (hex: string) => (HEX_RE.test(hex) ? hex : '#CCCCCC');

export default function ColorStockManager({
  variants,
  onChange,
}: {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
}) {
  const [activeColor, setActiveColor] = useState<string>('');
  const [customSize, setCustomSize] = useState('');
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#8A1525');
  const [bulkMrp, setBulkMrp] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // Everything below is derived from the flat variants list, so the server
  // contract (one row per size+color) is unchanged.
  const sizes = Array.from(new Set(variants.map((v) => v.variant_name.trim()).filter(Boolean)));
  const colorOrder = Array.from(new Set(variants.map((v) => v.color.trim()).filter(Boolean)));
  const colorHex = (name: string) => variants.find((v) => v.color.trim() === name && v.color_hex)?.color_hex || '#CCCCCC';

  // With no colors yet, the single "no color" group (color = '') is what's edited.
  const groups = colorOrder.length ? colorOrder : [''];
  const tab = groups.includes(activeColor) ? activeColor : groups[0];

  const rowFor = (color: string, size: string) =>
    variants.find((v) => v.color.trim() === color && v.variant_name.trim() === size);

  const flash = (m: string) => {
    setMessage(m);
    setTimeout(() => setMessage(null), 2200);
  };

  const patchRow = (color: string, size: string, patch: Partial<VariantRow>) => {
    onChange(
      variants.map((v) => (v.color.trim() === color && v.variant_name.trim() === size ? { ...v, ...patch } : v))
    );
  };

  const newRow = (color: string, hex: string, size: string, template?: VariantRow): VariantRow => ({
    variant_name: size,
    color,
    color_hex: color ? hex : '',
    price: template?.price ?? '',
    original_price: template?.original_price ?? '',
    stock_quantity: template?.stock_quantity ?? '10',
    is_active: true,
  });

  // ---- Sizes ----
  const addSize = (raw: string) => {
    const size = raw.trim();
    if (!size) return;
    if (sizes.some((s) => s.toLowerCase() === size.toLowerCase())) return;
    const next = [...variants];
    for (const color of groups) {
      const template = variants.find((v) => v.color.trim() === color);
      next.push(newRow(color, colorHex(color), size, template));
    }
    onChange(next);
  };
  const removeSize = (size: string) => onChange(variants.filter((v) => v.variant_name.trim() !== size));
  const toggleSize = (size: string) => (sizes.includes(size) ? removeSize(size) : addSize(size));

  // ---- Colors ----
  const addColor = (rawName: string, hex: string) => {
    const name = rawName.trim();
    if (!name) {
      flash('Enter a color name first.');
      return;
    }
    if (colorOrder.some((c) => c.toLowerCase() === name.toLowerCase())) {
      flash(`"${name}" is already added.`);
      return;
    }
    // First real color: adopt the placeholder "no color" rows instead of duplicating them.
    if (colorOrder.length === 0) {
      const adopted = variants.map((v) => ({ ...v, color: name, color_hex: hex }));
      onChange(adopted.length ? adopted : [newRow(name, hex, 'Standard')]);
      setActiveColor(name);
      return;
    }
    const sizeList = sizes.length ? sizes : ['Standard'];
    const template = variants.find((v) => v.color.trim() === colorOrder[0]);
    onChange([...variants, ...sizeList.map((s) => newRow(name, hex, s, template))]);
    setActiveColor(name);
  };

  const removeColor = (name: string) => {
    const remaining = variants.filter((v) => v.color.trim() !== name);
    if (remaining.length === 0) {
      onChange(variants.map((v) => ({ ...v, color: '', color_hex: '' })));
      return;
    }
    onChange(remaining);
  };

  const makeDefault = (name: string) => {
    const first = variants.filter((v) => v.color.trim() === name);
    const rest = variants.filter((v) => v.color.trim() !== name);
    onChange([...first, ...rest]);
  };

  const toggleColorPreset = (p: { name: string; hex: string }) => {
    const existing = colorOrder.find((c) => c.toLowerCase() === p.name.toLowerCase());
    if (existing) removeColor(existing);
    else addColor(p.name, p.hex);
  };

  // ---- Bulk fill ----
  const applyBulk = (targetColors: string[]) => {
    if (bulkMrp === '' && bulkPrice === '' && bulkStock === '') {
      flash('Enter MRP, Sale Price, or Stock to bulk apply.');
      return;
    }
    onChange(
      variants.map((v) =>
        targetColors.includes(v.color.trim())
          ? {
              ...v,
              ...(bulkMrp !== '' ? { original_price: bulkMrp } : {}),
              ...(bulkPrice !== '' ? { price: bulkPrice } : {}),
              ...(bulkStock !== '' ? { stock_quantity: bulkStock } : {}),
            }
          : v
      )
    );
    flash(targetColors.length > 1 ? 'Applied to all colors & sizes.' : `Applied to all sizes of ${targetColors[0] || 'this product'}.`);
  };

  const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock_quantity, 10) || 0), 0);

  return (
    <div className="space-y-6">
      {/* STEP A: SIZES */}
      <div className="rounded-2xl border border-cream-200 bg-cream-50/40 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
          <div>
            <label className={`${labelClass} mb-0`}>1. Available Sizes</label>
            <p className="text-[11px] text-muted mt-0.5">Click a size to add or remove it for every color.</p>
          </div>
          <span className="text-[11px] font-semibold text-muted">{sizes.length} size{sizes.length === 1 ? '' : 's'}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SIZE_PRESETS.map((s) => {
            const on = sizes.includes(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => toggleSize(s)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                  on ? 'bg-brand-700 text-white border-brand-700 shadow-sm' : 'bg-white text-brand-700 border-cream-300 hover:border-brand-400'
                }`}
              >
                {s}
              </button>
            );
          })}
          {sizes
            .filter((s) => !SIZE_PRESETS.includes(s))
            .map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-xl border border-brand-700 bg-brand-700 text-white text-xs font-bold"
              >
                {s}
                <button type="button" onClick={() => removeSize(s)} className="rounded-md p-0.5 hover:bg-white/20" title="Remove size">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
        </div>

        <div className="flex gap-2 max-w-sm">
          <input
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSize(customSize);
                setCustomSize('');
              }
            }}
            placeholder="Custom size e.g. 38, 40"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => {
              addSize(customSize);
              setCustomSize('');
            }}
            className="shrink-0 rounded-xl bg-brand-700 hover:bg-brand-800 px-4 text-xs font-semibold text-white"
          >
            Add
          </button>
        </div>
      </div>

      {/* STEP B: COLORS */}
      <div className="rounded-2xl border border-cream-200 bg-cream-50/40 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
          <div>
            <label className={`${labelClass} mb-0`}>2. Color Swatches</label>
            <p className="text-[11px] text-muted mt-0.5">Click the star on a swatch to make it the default color shown first.</p>
          </div>
          <span className="text-[11px] font-semibold text-muted">{colorOrder.length} color{colorOrder.length === 1 ? '' : 's'}</span>
        </div>

        {colorOrder.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-cream-300 rounded-xl text-xs text-muted bg-white">
            No colors yet — pick from the presets or create a custom one below. (Optional if the product has just one color.)
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {colorOrder.map((name, i) => {
              const isDefault = i === 0;
              return (
                <div
                  key={name}
                  className={`inline-flex items-center gap-2.5 pl-3 pr-1.5 py-2 rounded-2xl border bg-white text-xs ${
                    isDefault ? 'border-brand-500 ring-2 ring-brand-500/15' : 'border-cream-300'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-cream-300 shrink-0" style={{ backgroundColor: safeHex(colorHex(name)) }} />
                  <span className="font-bold text-brand-700">{name}</span>
                  <span className="font-mono text-[10px] text-muted uppercase">{safeHex(colorHex(name))}</span>
                  <button
                    type="button"
                    onClick={() => makeDefault(name)}
                    title={isDefault ? 'Default color' : 'Make default'}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 ${
                      isDefault ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-muted border-cream-300 hover:text-brand-700'
                    }`}
                  >
                    <Star className={`h-3 w-3 ${isDefault ? 'fill-white' : ''}`} />
                    {isDefault && <span className="text-[9px] font-bold uppercase">Default</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeColor(name)}
                    title="Delete color"
                    className="rounded-lg p-1.5 text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 rounded-xl border border-cream-200 bg-white p-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block">Quick add presets</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COLOR_PRESETS.map((p) => {
                const on = colorOrder.some((c) => c.toLowerCase() === p.name.toLowerCase());
                return (
                  <button
                    type="button"
                    key={p.name}
                    onClick={() => toggleColorPreset(p)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all ${
                      on ? 'bg-brand-700 text-white border-brand-700' : 'bg-cream-50/60 text-brand-700 border-cream-300 hover:border-brand-400'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-cream-300 shrink-0" style={{ backgroundColor: p.hex }} />
                    <span className="truncate flex-1">{p.name}</span>
                    {on && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-cream-200 bg-white p-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block">Custom color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={safeHex(customColorHex)}
                onChange={(e) => setCustomColorHex(e.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-cream-300 bg-cream-50 p-0.5"
                title="Pick color"
              />
              <input
                value={customColorHex}
                onChange={(e) => setCustomColorHex(e.target.value)}
                placeholder="#RRGGBB"
                className={`${inputClass} w-28 font-mono uppercase`}
              />
            </div>
            <input
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addColor(customColorName, safeHex(customColorHex));
                  setCustomColorName('');
                }
              }}
              placeholder="Color name e.g. Royal Blue"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => {
                addColor(customColorName, safeHex(customColorHex));
                setCustomColorName('');
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 py-2.5 text-xs font-semibold text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add this color
            </button>
          </div>
        </div>
      </div>

      {/* STEP C: PRICE & STOCK PER COLOR */}
      <div className="rounded-2xl border border-cream-200 bg-cream-50/40 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
          <div>
            <label className={`${labelClass} mb-0`}>3. Price &amp; Stock</label>
            <p className="text-[11px] text-muted mt-0.5">Set MRP, sale price and stock for each size of each color.</p>
          </div>
          <span className="text-[11px] font-semibold text-muted">Total stock: <strong className="text-brand-700">{totalStock}</strong></span>
        </div>

        {sizes.length === 0 ? (
          <div className="p-5 border border-dashed border-cream-300 rounded-xl text-center text-xs text-muted bg-white">
            Add at least one size above to set price and stock.
          </div>
        ) : (
          <>
            {colorOrder.length > 0 && (
              <div className="flex flex-wrap gap-2 bg-white p-2.5 rounded-2xl border border-cream-200">
                {colorOrder.map((name, i) => {
                  const on = tab === name;
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => setActiveColor(name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        on ? 'bg-brand-700 text-white border-brand-700 shadow-sm' : 'bg-cream-50/60 text-brand-700 border-cream-300 hover:border-brand-400'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-cream-300" style={{ backgroundColor: safeHex(colorHex(name)) }} />
                      {name}
                      {i === 0 && <Star className={`h-3 w-3 ${on ? 'fill-white' : 'fill-brand-600 text-brand-600'}`} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bulk fill */}
            <div className="rounded-xl border border-cream-200 bg-white p-3.5 space-y-3">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-brand-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Fast bulk fill</span>
                <span className="text-[10px] text-muted">fill once, apply to all</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input type="number" min="0" placeholder="Bulk MRP (₹)" value={bulkMrp} onChange={(e) => setBulkMrp(e.target.value)} className={inputClass} />
                <input type="number" min="0" placeholder="Bulk Sale Price (₹)" value={bulkPrice} onChange={(e) => setBulkPrice(e.target.value)} className={inputClass} />
                <input type="number" min="0" placeholder="Bulk Stock" value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyBulk([tab])}
                  className="rounded-xl bg-brand-700 hover:bg-brand-800 px-3.5 py-2 text-[11px] font-semibold text-white"
                >
                  Apply to all sizes{tab ? ` (${tab})` : ''}
                </button>
                {colorOrder.length > 1 && (
                  <button
                    type="button"
                    onClick={() => applyBulk(colorOrder)}
                    className="rounded-xl border border-cream-300 bg-white hover:bg-cream-100 px-3.5 py-2 text-[11px] font-semibold text-brand-700"
                  >
                    Apply to ALL colors &amp; sizes
                  </button>
                )}
              </div>
              {message && <p className="text-[11px] font-semibold text-[#024F5F]">{message}</p>}
            </div>

            {/* Size-wise table for the active color */}
            <div className="rounded-xl border border-cream-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[520px]">
                  <thead className="bg-cream-100/80 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-cream-200">
                    <tr>
                      <th className="py-2.5 px-3 w-24">Size</th>
                      <th className="py-2.5 px-3">MRP (Regular)</th>
                      <th className="py-2.5 px-3">Sale Price *</th>
                      <th className="py-2.5 px-3">Stock *</th>
                      <th className="py-2.5 px-3 text-center w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {sizes.map((size) => {
                      const row = rowFor(tab, size);
                      if (!row) return null;
                      return (
                        <tr key={size} className="hover:bg-cream-50/50">
                          <td className="py-2 px-3 font-bold text-brand-700 text-sm">{size}</td>
                          <td className="py-2 px-3">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/70 text-xs font-semibold">₹</span>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="2499"
                                value={row.original_price}
                                onChange={(e) => patchRow(tab, size, { original_price: e.target.value })}
                                className={`${inputClass} pl-6 ${
                                  row.original_price !== '' && Number(row.original_price) <= Number(row.price || 0) && Number(row.price) > 0
                                    ? 'border-[#024F5F] bg-[#F6F1EC]'
                                    : ''
                                }`}
                              />
                            </div>
                            {row.original_price !== '' && Number(row.price) > 0 && Number(row.original_price) <= Number(row.price) && (
                              <p className="mt-1 text-[10px] font-semibold text-[#024F5F]">MRP must be higher than the sale price</p>
                            )}
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
                                value={row.price}
                                onChange={(e) => patchRow(tab, size, { price: e.target.value })}
                                className={`${inputClass} pl-6 font-semibold`}
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
                              value={row.stock_quantity}
                              onChange={(e) => patchRow(tab, size, { stock_quantity: e.target.value })}
                              className={`${inputClass} font-semibold`}
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => patchRow(tab, size, { is_active: !row.is_active })}
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                                row.is_active
                                  ? 'bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64]'
                                  : 'bg-cream-100 text-muted border border-cream-300'
                              }`}
                            >
                              {row.is_active ? <CheckCircle2 className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                              <span>{row.is_active ? 'Active' : 'Hidden'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
