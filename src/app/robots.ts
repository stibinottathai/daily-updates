import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/login', '/manage-users'],
    },
    sitemap: [`${base}/sitemap.xml`],
  };
}
