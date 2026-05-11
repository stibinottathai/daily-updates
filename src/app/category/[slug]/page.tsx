import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import HomeClient from '../../../components/HomeClient';
import { CATEGORIES, NEWS_REGIONS, INDIA_REGIONS, SPORTS_TYPES, type NewsArticle } from '../../../types';
import { baseMetadata, categoryFromSlug, categoryPath, truncateDescription } from '../../../lib/seo';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function logCategoryFetchWarning(error: unknown, context: string) {
  if (error && typeof error === 'object') {
    const supabaseError = error as { code?: string; message?: string; details?: string; hint?: string };
    console.warn('Category article fetch warning:', {
      context,
      code: supabaseError.code,
      message: supabaseError.message,
      details: supabaseError.details,
      hint: supabaseError.hint,
    });
    return;
  }

  console.warn('Category article fetch warning:', { context, error });
}

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

  // Resolve region slug back to a display name
  let regionFilter: string | null = null;
  if (category === 'News' && regionParam) {
    const matched = NEWS_REGIONS.find(
      r => r.toLowerCase().replace(/[^a-z0-9]+/g, '-') === regionParam
    );
    regionFilter = matched ?? null;
  } else if (category === 'India' && regionParam) {
    const matched = INDIA_REGIONS.find(
      r => r.toLowerCase().replace(/[^a-z0-9]+/g, '-') === regionParam
    );
    regionFilter = matched ?? null;
  } else if (category === 'Sports' && regionParam) {
    const matched = SPORTS_TYPES.find(
      r => r.toLowerCase().replace(/[^a-z0-9]+/g, '-') === regionParam
    );
    regionFilter = matched ?? null;
  }

  let data: NewsArticle[] | null = null;
  let error: unknown = null;

  if ((category === 'News' || category === 'India' || category === 'Sports') && regionFilter) {
    const regionResult = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('sub_category', regionFilter)
      .order('created_at', { ascending: false });

    data = regionResult.data as NewsArticle[] | null;
    error = regionResult.error;

    if (error) {
      logCategoryFetchWarning(error, `Falling back to all ${category} articles for ${regionFilter}`);

      const fallbackResult = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      data = fallbackResult.data as NewsArticle[] | null;
      error = fallbackResult.error;
    }
  } else {
    const categoryResult = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    data = categoryResult.data as NewsArticle[] | null;
    error = categoryResult.error;
  }

  if (error) {
    logCategoryFetchWarning(error, `Unable to fetch articles for ${category}`);
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
