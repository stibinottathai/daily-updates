"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * This tiny component is the ONLY part that calls useSearchParams().
 * It must be wrapped in <Suspense> by its parent, but because it renders
 * nothing visible, the Suspense fallback is invisible (null) — keeping
 * the article grid fully server-rendered in the initial HTML.
 */
export default function SearchParamsSync({
  onSync,
}: {
  onSync: (q: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onSync(searchParams.get('q') ?? '');
  }, [searchParams, onSync]);

  return null;
}
