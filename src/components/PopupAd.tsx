"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ADSENSE_CLIENT_ID } from '../lib/seo';

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
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const excludedRoutes = ['/login', '/admin', '/manage-users'];
  const isExcludedRoute = excludedRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isExcludedRoute) {
      return;
    }

    const lastShown = Number(localStorage.getItem(popupStorageKey) || '0');
    const shouldShow = !lastShown || Date.now() - lastShown >= popupCooldownMs;

    if (!shouldShow) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
      localStorage.setItem(popupStorageKey, String(Date.now()));

      if (adsenseClient && popupSlot) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.warn('Popup ad failed to initialize:', error);
        }
      }
    }, popupDelayMs);

    return () => window.clearTimeout(timer);
  }, [isMounted, isExcludedRoute]);

  if (!isMounted || isExcludedRoute || !isOpen) {
    return null;
  }

  return (
    <div className="popup-ad-overlay" role="dialog" aria-modal="true" aria-label="Sponsored popup ad">
      <div className="popup-ad-card animate-fade-in">
        <button
          type="button"
          className="popup-ad-close"
          aria-label="Close ad"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>

        <div className="popup-ad-label">Sponsored</div>

        {adsenseClient && popupSlot ? (
          <ins
            className="adsbygoogle popup-ad-slot"
            style={{ display: 'block' }}
            data-ad-client={adsenseClient}
            data-ad-slot={popupSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="popup-ad-fallback">
            <strong>Popup ad space</strong>
            <span>Add `NEXT_PUBLIC_ADSENSE_CLIENT` and `NEXT_PUBLIC_ADSENSE_SLOT_POPUP` to show a live AdSense popup here.</span>
          </div>
        )}
      </div>
    </div>
  );
}