import { redirect } from 'next/navigation';
import { cache } from 'react';
import { supabase } from '../../../lib/supabase';
import ArticleDetailClient from '../../../components/ArticleDetailClient';
import type { NewsArticle } from '../../../types';
import { articlePath, absoluteUrl, baseMetadata, detectArticleLanguage, getLocaleForLanguage, getShareImageUrl, slugify, truncateDescription, SITE_NAME } from '../../../lib/seo';

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const slugWithUuidPattern = /^(.*)-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;

const getArticleByParam = cache(async (param: string): Promise<NewsArticle | null> => {
  const decodedParam = decodeURIComponent(param);

  if (uuidPattern.test(decodedParam)) {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', decodedParam)
      .single();

    return (data as NewsArticle | null) || null;
  }

  const suffixedMatch = decodedParam.match(slugWithUuidPattern);
  if (suffixedMatch) {
    const articleId = suffixedMatch[2];

    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .single();

    if (data) {
      return data as NewsArticle;
    }
  }

  const { data } = await supabase
    .from('articles')
    .select('id,title')
    .order('created_at', { ascending: false });

  const matchedArticle = ((data as Pick<NewsArticle, 'id' | 'title'>[] | null) || [])
    .find(article => slugify(article.title) === decodedParam);

  if (!matchedArticle) {
    return null;
  }

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', matchedArticle.id)
    .single();

  return (article as NewsArticle | null) || null;
});

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const article = await getArticleByParam(id);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'This InkFlow article could not be found.',
    };
  }

  const language = detectArticleLanguage(article);
  let shareImageValue = article.image_url;
  if (!shareImageValue && article.content) {
    const imgMatch = article.content.match(/!\[.*?\]\((.*?)\)/);
    if (imgMatch && imgMatch[1]) {
      shareImageValue = imgMatch[1];
    } else {
      const htmlImgMatch = article.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (htmlImgMatch && htmlImgMatch[1]) {
        shareImageValue = htmlImgMatch[1];
      }
    }
  }

  const shareImage = getShareImageUrl(shareImageValue);
  const metadata = baseMetadata({
    title: article.title,
    description: truncateDescription(article.excerpt),
    path: articlePath(article),
    image: shareImage,
    type: 'article',
    locale: getLocaleForLanguage(language),
  });

  const tags = [article.category, 'article', 'publishing', 'stories'];
  if (article.sub_category) {
    tags.push(article.sub_category);
  }

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: {
        [language]: absoluteUrl(articlePath(article)),
      },
    },
    keywords: tags.join(', '),
    category: article.category,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at || article.created_at,
      section: article.category,
      tags: tags,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;

  return (
    <ArticleDetailClient article={null} articleId={id} language="en" />
  );
}
