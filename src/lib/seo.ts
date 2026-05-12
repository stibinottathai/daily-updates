import type { Metadata } from 'next';
import type { NewsArticle } from '../types';

export const SITE_NAME = 'Daily Updates';
export const SITE_TAGLINE = 'Latest World News, Business, Tech, Health and Sports';
export const DEFAULT_DESCRIPTION =
  'Daily Updates brings you the latest world news, business, technology, health, sports and culture stories, curated fresh every day.';
export const SITE_LOCALE = 'en_US';
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4262255714876275';
export const MALAYALAM_LOCALE = 'ml_IN';

const MALAYALAM_TEXT_PATTERN = /[\u0D00-\u0D7F]/u;

/**
 * Single source of truth for the production domain.
 * Only reads NEXT_PUBLIC_SITE_URL — never VERCEL_URL or any Vercel-injected
 * variable — so sitemap / canonical URLs always point to the live domain,
 * even on preview deployments.
 */
export const PRODUCTION_DOMAIN = 'https://www.dailyupdatesnews.online';

export const siteUrl = (() => {
  // Deliberately ignore VERCEL_URL: it changes per deployment and would
  // send crawlers to staging domains instead of the live site.
  const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim();

  if (!configured) return PRODUCTION_DOMAIN;

  const withProtocol = configured.startsWith('http')
    ? configured
    : `https://${configured}`;

  return withProtocol.replace(/\/$/, '');
})();

// PNG is required — LinkedIn, WhatsApp, and most crawlers reject SVG for OG images.
export const defaultOgImage = `${siteUrl}/og-image.png`;

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('//')) {
    return `https:${path}`;
  }

  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getShareImageUrl(imageValue?: string | null): string {
  const image = imageValue?.trim();

  if (!image) {
    return defaultOgImage;
  }

  let src = image;
  if (image.startsWith('<')) {
    src = image.match(/\bsrc=["']([^"']+)["']/i)?.[1]?.trim() || defaultOgImage;
  }

  return encodeURI(src);
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
    .replace(/^-+|-+$/g, '');

  return slug;
}

export function detectArticleLanguage(article: Pick<NewsArticle, 'title' | 'excerpt' | 'content'>): 'en' | 'ml' {
  const articleText = `${article.title}\n${article.excerpt}\n${article.content}`;
  return MALAYALAM_TEXT_PATTERN.test(articleText) ? 'ml' : 'en';
}

export function getLocaleForLanguage(language: 'en' | 'ml'): string {
  return language === 'ml' ? MALAYALAM_LOCALE : SITE_LOCALE;
}

export function categoryPath(category: string): string {
  return `/category/${slugify(category)}`;
}

export function articlePath(article: Pick<NewsArticle, 'title' | 'id'>): string {
  const slug = slugify(article.title);
  if (!slug) {
    return `/article/${article.id}`;
  }
  return `/article/${slug}`;
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
  locale = SITE_LOCALE,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  locale?: string;
}): Metadata {
  const resolvedTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
      types: {
        'application/rss+xml': absoluteUrl('/rss.xml'),
      },
    },
    openGraph: {
      type,
      locale,
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
      site: '@DailyUpdates',
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
