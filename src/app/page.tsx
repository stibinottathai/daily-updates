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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams.category;
  const initialCategory = typeof categoryParam === 'string' ? categoryParam : null;
  const initialSearchQuery = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';

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
      <HomeClient
        articles={[]}
        initialCategory={initialCategory}
        initialSearchQuery={initialSearchQuery}
        serverLoadFailed
      />
    );
  }

  return (
    <HomeClient
      articles={data as NewsArticle[]}
      initialCategory={initialCategory}
      initialSearchQuery={initialSearchQuery}
    />
  );
}
