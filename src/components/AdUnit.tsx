"use client";

import { useEffect, useState } from 'react';
import { ADSENSE_CLIENT_ID } from '../lib/seo';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const adsenseClient = ADSENSE_CLIENT_ID;

type AdUnitProps = {
  slot: string;
  label?: string;
  className?: string;
};

export default function AdUnit({ slot, label = 'Advertisement', className = '' }: AdUnitProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !adsenseClient || !slot || typeof window === 'undefined') {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn('AdSense slot failed to initialize:', error);
    }
  }, [isMounted, slot]);

  if (!isMounted || !adsenseClient || !slot) {
    return (
      <aside className={`ad-slot ad-slot-placeholder ${className}`.trim()} aria-label={label}>
        <span className="ad-slot-label">{label}</span>
        <strong>Configure AdSense to display this space.</strong>
        <span>Add NEXT_PUBLIC_ADSENSE_CLIENT and a slot id in your environment.</span>
      </aside>
    );
  }

  return (
    <aside className={`ad-slot ${className}`.trim()} aria-label={label}>
      <span className="ad-slot-label">{label}</span>
      <ins
        className="adsbygoogle ad-slot-ins"
        style={{ display: 'block' }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}