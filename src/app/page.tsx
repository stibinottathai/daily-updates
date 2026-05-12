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
      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Latest News</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '42rem', margin: '0 auto 1.5rem' }}>
          We could not load the latest stories from the news source right now.
        </p>
        <a href="/" className="btn btn-outline">Retry</a>
      </section>
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
