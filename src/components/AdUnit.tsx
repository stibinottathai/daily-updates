"use client";

import { useEffect, useState } from 'react';
import { ADSENSE_CLIENT_ID } from '../lib/seo';
import { useCookieConsent } from './CookieConsent';

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
  return null;
}