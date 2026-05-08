import { supabase } from '../../lib/supabase';
import type { NewsArticle } from '../../types';
import { absoluteUrl, articlePath, DEFAULT_DESCRIPTION, escapeXml, SITE_NAME } from '../../lib/seo';

export const revalidate = 1800;

export async function GET() {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  const articles = ((data as NewsArticle[] | null) || []);
  const items = articles.map(article => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${absoluteUrl(articlePath(article))}</link>
      <guid isPermaLink="true">${absoluteUrl(articlePath(article))}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <category>${escapeXml(article.category)}</category>
      <author>${escapeXml(article.author)}</author>
      <pubDate>${new Date(article.created_at).toUTCString()}</pubDate>
      ${article.image_url ? `<enclosure url="${escapeXml(article.image_url)}" type="image/jpeg" />` : ''}
    </item>
  `).join('');

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${absoluteUrl('/')}</link>
    <description>${escapeXml(DEFAULT_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
    },
  });
}
