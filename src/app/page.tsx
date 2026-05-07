import { supabase } from '../lib/supabase';
import HomeClient from '../components/HomeClient';
import type { NewsArticle } from '../types';

export const revalidate = 0; // Disable cache for news

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams.category;
  const initialCategory = typeof categoryParam === 'string' ? categoryParam : null;
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return <HomeClient articles={[]} initialCategory={initialCategory} serverLoadFailed />;
  }

  return <HomeClient articles={data as NewsArticle[]} initialCategory={initialCategory} />;
}
