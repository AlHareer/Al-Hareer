'use client';

import { useState, useEffect } from 'react';
import { getQuantityDiscountSettings } from '@/actions/admin/quantityDiscount';
import type { QuantityDiscountSettings } from '@/actions/admin/quantityDiscount';

const DEFAULTS: QuantityDiscountSettings = { enabled: false, tiers: [] };
let _cached: QuantityDiscountSettings | null = null;
let _promise: Promise<QuantityDiscountSettings> | null = null;

export function useQuantityDiscountSettings(): QuantityDiscountSettings {
  const [settings, setSettings] = useState<QuantityDiscountSettings>(_cached ?? DEFAULTS);

  useEffect(() => {
    if (_cached) { setSettings(_cached); return; }
    if (!_promise) _promise = getQuantityDiscountSettings();
    _promise.then((s) => { _cached = s; setSettings(s); });
  }, []);

  return settings;
}

/** Returns the discount amount (₹) for a given item count. 0 if disabled or no match. */
export function computeQuantityDiscount(settings: QuantityDiscountSettings, totalItems: number): number {
  if (!settings.enabled || totalItems === 0 || settings.tiers.length === 0) return 0;
  const sorted = [...settings.tiers].sort((a, b) => b.min_quantity - a.min_quantity);
  const match = sorted.find((t) => totalItems >= t.min_quantity);
  return match ? match.discount : 0;
}

/** Returns the next tier the customer hasn't yet unlocked (for progress nudge). */
export function nextQuantityTier(settings: QuantityDiscountSettings, totalItems: number) {
  if (!settings.enabled || settings.tiers.length === 0) return null;
  const sorted = [...settings.tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  return sorted.find((t) => totalItems < t.min_quantity) ?? null;
}
