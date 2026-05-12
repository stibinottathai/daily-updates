"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useCookieConsent } from './CookieConsent';

const VISITOR_ID_KEY = 'daily_updates_visitor_id';
const IGNORED_PREFIXES = ['/login', '/manage-users'];

function getVisitorId() {
  const existing = localStorage.getItem(VISITOR_ID_KEY);

  if (existing) {
    return existing;
  }

  const nextId = crypto.randomUUID();
  localStorage.setItem(VISITOR_ID_KEY, nextId);
  return nextId;
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasConsent } = useCookieConsent();

  useEffect(() => {
    if (!hasConsent || !pathname || IGNORED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
      return;
    }

    const queryString = searchParams.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    supabase
      .rpc('record_site_visit', {
        p_page_path: pagePath,
        p_visitor_id: getVisitorId(),
        p_user_agent: navigator.userAgent,
      })
      .then(({ error }) => {
        if (error) {
          console.warn('Visitor tracking failed:', error.message);
        }
      });
  }, [hasConsent, pathname, searchParams]);

  return null;
}
