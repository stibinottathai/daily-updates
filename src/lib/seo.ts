import type { Metadata } from 'next';
import type { NewsArticle } from '../types';

export const SITE_NAME = 'Daily Updates';
export const SITE_TAGLINE = 'Latest World News, Business, Tech, Health and Sports';
export const DEFAULT_DESCRIPTION =
  'Daily Updates brings you the latest world news, business, technology, health, sports and culture stories, curated fresh every day.';

export const siteUrl = (() => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL ||
    'https://daily-updates-black.vercel.app';

  const withProtocol = configuredUrl.startsWith('http')
    ? configuredUrl
    : `https://${configuredUrl}`;

  return withProtocol.replace(/\/$/, '');
})();

export const defaultOgImage = `${siteUrl}/og-image.svg`;

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
    .replace(/^-+|-+$/g, '');

  return slug || 'story';
}

export function categoryPath(category: string): string {
  return `/category/${slugify(category)}`;
}

export function articlePath(article: Pick<NewsArticle, 'title'>): string {
  return `/article/${slugify(article.title)}`;
}

export function categoryFromSlug(slug: string, categories: readonly string[]): string | null {
  return categories.find(category => slugify(category) === slugify(slug)) || null;
}

export function truncateDescription(value: string, maxLength = 160): string {
  const compact = value.replace(/\s+/g, ' ').trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 1).replace(/\s+\S*$/, '')}...`;
}

export function baseMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = defaultOgImage,
  type = 'website',
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const resolvedTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: resolvedTitle,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
  };
}
