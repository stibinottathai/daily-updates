import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import HomeClient from '../../../components/HomeClient';
import { CATEGORIES, NEWS_REGIONS, type NewsArticle } from '../../../types';
import { baseMetadata, categoryFromSlug, categoryPath, truncateDescription } from '../../../lib/seo';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  return CATEGORIES.map(category => ({
    slug: categoryPath(category).split('/').pop()!,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = categoryFromSlug(slug, CATEGORIES);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return baseMetadata({
    title: `${category} News`,
    description: truncateDescription(
      `Read the latest ${category.toLowerCase()} news, analysis and daily headlines from Daily Updates.`
    ),
    path: categoryPath(category),
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const category = categoryFromSlug(slug, CATEGORIES);

  if (!category) {
    notFound();
  }

  // For the News category, support optional region filtering
  const regionParam = typeof resolvedSearch.region === 'string' ? resolvedSearch.region : null;

  // Resolve region slug back to a display name (e.g. 'us-canada' → 'US & Canada')
  let regionFilter: string | null = null;
  if (category === 'News' && regionParam) {
    const matched = NEWS_REGIONS.find(
      r => r.toLowerCase().replace(/[^a-z0-9]+/g, '-') === regionParam
    );
    regionFilter = matched ?? null;
  }

  let query = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (category === 'News' && regionFilter) {
    // Articles tagged with their region as sub_category or in title/category
    // For now filter by category = regionFilter OR category = 'News'
    query = query.or(`category.eq.${category},category.eq.${regionFilter}`);
  } else {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching category articles:', error);
    return (
      <React.Suspense fallback={<div style={{ minHeight: '60vh' }}>Loading...</div>}>
        <HomeClient articles={[]} initialCategory={category} initialRegion={regionFilter} serverLoadFailed />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={<div style={{ minHeight: '60vh' }}>Loading...</div>}>
      <HomeClient articles={data as NewsArticle[]} initialCategory={category} initialRegion={regionFilter} />
    </React.Suspense>
  );
}
