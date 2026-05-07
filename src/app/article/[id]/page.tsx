import { supabase } from '../../../lib/supabase';
import ArticleDetailClient from '../../../components/ArticleDetailClient';
import type { NewsArticle } from '../../../types';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 0; // Disable cache

type Props = {
  params: Promise<{ id: string }>
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { data } = await supabase
    .from('articles')
    .select('title, excerpt, image_url')
    .eq('id', params.id)
    .single();

  if (!data) return { title: 'Article Not Found' };

  return {
    title: `${data.title} | Daily Updates`,
    description: data.excerpt,
    openGraph: {
      images: [data.image_url],
    },
  }
}

export default async function ArticlePage(props: Props) {
  const params = await props.params;
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Article not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The article you are looking for does not exist or has been removed.</p>
        <a href="/" className="btn btn-outline">Return Home</a>
      </div>
    );
  }

  return <ArticleDetailClient article={data as NewsArticle} />;
}
