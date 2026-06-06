"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ADSENSE_CLIENT_ID } from '../lib/seo';
import { useCookieConsent } from './CookieConsent';

const adsenseClient = ADSENSE_CLIENT_ID;
const popupSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_POPUP || '';
const popupDelayMs = Number(process.env.NEXT_PUBLIC_ADSENSE_POPUP_DELAY_MS || '2500');
const popupCooldownMs = Number(process.env.NEXT_PUBLIC_ADSENSE_POPUP_COOLDOWN_MS || `${15 * 60 * 1000}`);
const popupStorageKey = 'daily_updates_popup_ad_last_shown';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function PopupAd() {
  return null;
}