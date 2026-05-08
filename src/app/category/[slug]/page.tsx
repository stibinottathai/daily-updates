import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import HomeClient from '../../../components/HomeClient';
import { CATEGORIES, type NewsArticle } from '../../../types';
import { baseMetadata, categoryFromSlug, categoryPath, truncateDescription } from '../../../lib/seo';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categoryFromSlug(slug, CATEGORIES);

  if (!category) {
    notFound();
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching category articles:', error);
    return (
      <React.Suspense fallback={<div style={{ minHeight: '60vh' }}>Loading...</div>}>
        <HomeClient articles={[]} initialCategory={category} serverLoadFailed />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={<div style={{ minHeight: '60vh' }}>Loading...</div>}>
      <HomeClient articles={data as NewsArticle[]} initialCategory={category} />
    </React.Suspense>
  );
}
