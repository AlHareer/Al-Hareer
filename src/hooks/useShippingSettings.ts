'use client';

import { useState, useEffect } from 'react';
import { getShippingSettings } from '@/actions/admin/shipping';
import type { ShippingSettings } from '@/actions/admin/shipping';

// While the DB fetch is in flight nothing is assumed: zeros mean "not loaded / not set",
// and the UI hides free-shipping / COD-fee text instead of flashing invented numbers.
const FALLBACK: ShippingSettings = { flat_rate: 0, free_threshold: 0, cod_charge: 0 };

// Module-level cache so multiple components on the same page share one fetch
let _cached: ShippingSettings | null = null;
let _promise: Promise<ShippingSettings> | null = null;

export function useShippingSettings(): ShippingSettings {
  const [settings, setSettings] = useState<ShippingSettings>(_cached ?? FALLBACK);

  useEffect(() => {
    if (_cached) { setSettings(_cached); return; }
    if (!_promise) _promise = getShippingSettings();
    _promise.then((s) => { _cached = s; setSettings(s); });
  }, []);

  return settings;
}
