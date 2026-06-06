"use client";

import Script from 'next/script';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ADSENSE_CLIENT_ID } from '../lib/seo';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type ConsentStatus = 'loading' | 'undecided' | 'accepted' | 'rejected';

type CookieConsentContextValue = {
  status: ConsentStatus;
  hasConsent: boolean;
  hasDecision: boolean;
  adsenseReady: boolean;
  acceptConsent: () => void;
  rejectConsent: () => void;
  resetConsent: () => void;
};

const CONSENT_STORAGE_KEY = 'inkflow_cookie_consent';
const adsenseClient = ADSENSE_CLIENT_ID;

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function readStoredConsent(): Exclude<ConsentStatus, 'loading' | 'undecided'> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'accepted' || stored === 'rejected') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read cookie consent preference:', error);
  }

  return null;
}

function writeStoredConsent(value: 'accepted' | 'rejected') {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch (error) {
    console.warn('Failed to save cookie consent preference:', error);
  }
}

function clearStoredConsent() {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear cookie consent preference:', error);
  }
}

function ConsentBanner({ onAccept, onReject }: { onAccept: () => void; onReject: () => void; }) {
  return (
    <div className="cookie-consent-banner" role="dialog" aria-modal="false" aria-label="Cookie consent banner">
      <div className="cookie-consent-panel">
        <div className="cookie-consent-copy">
          <p className="cookie-consent-eyebrow">Cookie Preferences</p>
          <h2>Choose how we use cookies</h2>
          <p>
            We use essential cookies to keep the site working. With your consent, we also load Google AdSense and
            limited analytics that help support and improve InkFlow.
          </p>
          <p>
            You can accept or reject non-essential cookies now, and change this choice later from the footer.
          </p>
        </div>

        <div className="cookie-consent-actions">
          <button type="button" className="btn btn-outline" onClick={onReject}>
            Reject non-essential
          </button>
          <button type="button" className="btn btn-primary" onClick={onAccept}>
            Accept all
          </button>
        </div>

        <a className="cookie-consent-link" href="/privacy-policy">
          Read privacy policy
        </a>
      </div>
    </div>
  );
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>('loading');
  const [adsenseReady, setAdsenseReady] = useState(false);

  useEffect(() => {
    const storedConsent = readStoredConsent();
    setStatus(storedConsent || 'undecided');
  }, []);

  useEffect(() => {
    if (status !== 'accepted') {
      setAdsenseReady(false);
    }
  }, [status]);

  const setConsent = (nextStatus: 'accepted' | 'rejected') => {
    writeStoredConsent(nextStatus);
    setStatus(nextStatus);
  };

  const resetConsent = () => {
    clearStoredConsent();
    setAdsenseReady(false);
    setStatus('undecided');
  };

  const contextValue = useMemo<CookieConsentContextValue>(() => ({
    status,
    hasConsent: status === 'accepted',
    hasDecision: status === 'accepted' || status === 'rejected',
    adsenseReady,
    acceptConsent: () => setConsent('accepted'),
    rejectConsent: () => setConsent('rejected'),
    resetConsent,
  }), [adsenseReady, status]);

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}

      {status === 'accepted' && adsenseClient && (
        <Script
          id="adsense-loader"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
          onLoad={() => setAdsenseReady(true)}
          onError={() => setAdsenseReady(false)}
        />
      )}

      {status === 'undecided' && (
        <ConsentBanner onAccept={() => setConsent('accepted')} onReject={() => setConsent('rejected')} />
      )}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    return {
      status: 'loading' as ConsentStatus,
      hasConsent: false,
      hasDecision: false,
      adsenseReady: false,
      acceptConsent: () => {},
      rejectConsent: () => {},
      resetConsent: () => {},
    };
  }

  return context;
}

export function CookiePreferencesButton() {
  const { resetConsent } = useCookieConsent();

  return (
    <button
      type="button"
      className="footer-link-button"
      onClick={resetConsent}
    >
      Cookie Preferences
    </button>
  );
}