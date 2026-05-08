"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (!pathname || IGNORED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
      return;
    }

    const queryString = searchParams.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    supabase
      .from('site_visits')
      .insert({
        page_path: pagePath,
        visitor_id: getVisitorId(),
        user_agent: navigator.userAgent,
      })
      .then(({ error }) => {
        if (error) {
          console.warn('Visitor tracking failed:', error.message);
        }
      });
  }, [pathname, searchParams]);

  return null;
}
