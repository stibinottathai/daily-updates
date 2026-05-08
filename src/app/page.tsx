import React from 'react';
import { redirect } from 'next/navigation';
import { supabase } from '../lib/supabase';
import HomeClient from '../components/HomeClient';
import { CATEGORIES, type NewsArticle } from '../types';
import { baseMetadata, categoryPath, DEFAULT_DESCRIPTION } from '../lib/seo';

export const revalidate = 60;

export const metadata = baseMetadata({
  title: 'Latest News',
  description: DEFAULT_DESCRIPTION,
  path: '/',
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams.category;
  const initialCategory = typeof categoryParam === 'string' ? categoryParam : null;

  if (initialCategory && CATEGORIES.includes(initialCategory as typeof CATEGORIES[number])) {
    redirect(categoryPath(initialCategory));
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return (
      <React.Suspense fallback={<div style={{ minHeight: '60vh' }}>Loading...</div>}>
        <HomeClient articles={[]} initialCategory={initialCategory} serverLoadFailed />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={<div style={{ minHeight: '60vh' }}>Loading...</div>}>
      <HomeClient articles={data as NewsArticle[]} initialCategory={initialCategory} />
    </React.Suspense>
  );
}
