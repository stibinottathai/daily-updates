import { redirect } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import ArticleDetailClient from '../../../components/ArticleDetailClient';
import type { NewsArticle } from '../../../types';
import { articlePath, absoluteUrl, baseMetadata, getShareImageUrl, slugify, truncateDescription, SITE_NAME } from '../../../lib/seo';

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getArticleByParam(param: string): Promise<NewsArticle | null> {
  if (uuidPattern.test(param)) {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', param)
      .single();

    return (data as NewsArticle | null) || null;
  }

  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  return ((data as NewsArticle[] | null) || []).find(article => slugify(article.title) === param) || null;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const article = await getArticleByParam(id);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'This Daily Updates story could not be found.',
    };
  }

  const shareImage = getShareImageUrl(article.image_url);
  const metadata = baseMetadata({
    title: article.title,
    description: truncateDescription(article.excerpt),
    path: articlePath(article),
    image: shareImage,
    type: 'article',
  });

  const tags = [article.category, 'news'];
  if (article.sub_category) {
    tags.push(article.sub_category);
  }

  return {
    ...metadata,
    authors: [{ name: article.author || SITE_NAME }],
    keywords: tags.join(', '),
    category: article.category,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at || article.created_at,
      authors: [article.author || SITE_NAME],
      section: article.category,
      tags: tags,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleByParam(id);

  if (!article) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Article not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The article you are looking for does not exist or has been removed.</p>
        <a href="/" className="btn btn-outline">Return Home</a>
      </div>
    );
  }

  if (id !== slugify(article.title)) {
    redirect(articlePath(article));
  }

  const shareImage = getShareImageUrl(article.image_url);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: truncateDescription(article.excerpt),
    image: [absoluteUrl(shareImage)],
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Person',
      name: article.author || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${absoluteUrl('/')}#organization`,
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(articlePath(article)),
    },
    articleSection: article.category,
    keywords: [article.category, 'latest news', 'breaking news'].join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ArticleDetailClient article={article} />
    </>
  );
}
