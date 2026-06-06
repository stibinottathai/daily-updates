import { notFound } from 'next/navigation';
import HomeClient from '../../../components/HomeClient';
import { CATEGORIES } from '../../../types';
import { baseMetadata, categoryFromSlug, categoryPath, truncateDescription } from '../../../lib/seo';

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
    title: `${category}`,
    description: truncateDescription(
      `Read the latest articles on ${category.toLowerCase()} from InkFlow.`
    ),
    path: categoryPath(category),
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const category = categoryFromSlug(slug, CATEGORIES);
  const initialSearchQuery = typeof resolvedSearch.q === 'string' ? resolvedSearch.q : '';

  if (!category) {
    notFound();
  }

  return (
    <HomeClient
      articles={null}
      initialCategory={category}
      initialSearchQuery={initialSearchQuery}
    />
  );
}
