"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase';

const VISITOR_ID_KEY = 'daily_updates_visitor_id';
const TRACKED_SESSION_KEY = 'daily_updates_tracked_paths';
const IGNORED_PREFIXES = ['/admin', '/login', '/manage-users'];

function getVisitorId() {
  const existing = localStorage.getItem(VISITOR_ID_KEY);

  if (existing) {
    return existing;
  }

  const nextId = crypto.randomUUID();
  localStorage.setItem(VISITOR_ID_KEY, nextId);
  return nextId;
}

function getTrackedPaths() {
  try {
    return JSON.parse(sessionStorage.getItem(TRACKED_SESSION_KEY) || '[]') as string[];
  } catch {
    return [];
  }
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
    const trackedPaths = getTrackedPaths();

    if (trackedPaths.includes(pagePath)) {
      return;
    }

    sessionStorage.setItem(TRACKED_SESSION_KEY, JSON.stringify([...trackedPaths, pagePath]));

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
