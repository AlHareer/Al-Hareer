'use client';

import { useState, useEffect } from 'react';
import { getShippingSettings } from '@/actions/admin/shipping';
import type { ShippingSettings } from '@/actions/admin/shipping';

// Sensible display defaults while the DB fetch is in-flight
const FALLBACK: ShippingSettings = { flat_rate: 0, free_threshold: 999, cod_charge: 49 };

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
