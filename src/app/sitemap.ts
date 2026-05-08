import type { MetadataRoute } from 'next';
import { supabase } from '../lib/supabase';
import { CATEGORIES, type NewsArticle } from '../types';
import { absoluteUrl, articlePath, categoryPath } from '../lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const { data } = await supabase
    .from('articles')
    .select('id, title, updated_at, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...CATEGORIES.map(category => ({
      url: absoluteUrl(categoryPath(category)),
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = ((data as Pick<NewsArticle, 'id' | 'title' | 'updated_at' | 'created_at'>[] | null) || [])
    .map(article => ({
      url: absoluteUrl(articlePath(article as NewsArticle)),
      lastModified: new Date(article.updated_at || article.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  return [...staticRoutes, ...articleRoutes];
}
