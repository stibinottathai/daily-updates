import { redirect } from 'next/navigation';
import HomeClient from '../components/HomeClient';
import { CATEGORIES } from '../types';
import { baseMetadata, categoryPath, DEFAULT_DESCRIPTION } from '../lib/seo';

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

  return (
    <HomeClient
      articles={null}
      initialCategory={initialCategory}
      initialSearchQuery={initialSearchQuery}
    />
  );
}
