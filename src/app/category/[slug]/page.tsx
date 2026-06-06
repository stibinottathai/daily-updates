import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import HomeClient from '../../../components/HomeClient';
import { CATEGORIES, type NewsArticle } from '../../../types';
import { baseMetadata, categoryFromSlug, categoryPath, truncateDescription } from '../../../lib/seo';
import { ARTICLE_LIST_COLUMNS, ARTICLE_LIST_LIMIT } from '../../../lib/articles';

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

  let data: NewsArticle[] | null = null;
  let error: unknown = null;

  const categoryResult = await supabase
    .from('articles')
    .select(ARTICLE_LIST_COLUMNS)
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(ARTICLE_LIST_LIMIT);

  data = categoryResult.data as unknown as NewsArticle[] | null;
  error = categoryResult.error;

  if (error) {
    logCategoryFetchWarning(error, `Unable to fetch articles for ${category}`);
    return (
      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{category} News</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '42rem', margin: '0 auto 1.5rem' }}>
          We could not load articles for this section right now.
        </p>
        <a href={categoryPath(category)} className="btn btn-outline">Retry</a>
      </section>
    );
  }

  return (
    <HomeClient articles={data as NewsArticle[]} initialCategory={category} initialSearchQuery={initialSearchQuery} />
  );
}
