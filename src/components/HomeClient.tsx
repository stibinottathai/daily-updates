"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useNews } from '../context/NewsContext';
import { Bookmark, Search, Clock } from 'lucide-react';
import { getReadingTime, formatDate, type NewsArticle } from '../types';
import { articlePath } from '../lib/seo';
import AdUnit from './AdUnit';

const homeAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || '';
const homeSidebarAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_SIDEBAR || '';

const hasImage = (url?: string) => Boolean(url?.trim());

export default function HomeClient({
  articles,
  initialCategory,
  serverLoadFailed = false,
}: {
  articles: NewsArticle[];
  initialCategory: string | null;
  serverLoadFailed?: boolean;
}) {
  const { articles: liveArticles, isLoading, toggleBookmark, isBookmarked } = useNews();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const searchTimerRef = useRef<number | null>(null);
  const selectedCategory = initialCategory;
  const displayArticles = articles.length > 0 ? articles : liveArticles;
  const isRecovering = serverLoadFailed && isLoading && displayArticles.length === 0;

  useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery) {
        params.set('q', trimmedQuery);
      } else {
        params.delete('q');
      }

      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 350);

    return () => {
      if (searchTimerRef.current) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, [pathname, router, searchParams, searchQuery]);

  // Filter logic
  let filteredArticles = selectedCategory 
    ? displayArticles.filter(a => a.category === selectedCategory)
    : displayArticles;
    
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.excerpt.toLowerCase().includes(q)
    );
  }

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const regularArticles = filteredArticles.slice(1, 7); // Show next 6

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
        <h1 style={{ fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }} className="animate-fade-in stagger-1">
          {searchQuery ? 'Search Results' : selectedCategory || 'Top Stories'}
        </h1>
        
        <div className="home-page-search animate-fade-in stagger-1" style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="form-input" 
            style={{ paddingLeft: '2.5rem', borderRadius: '2rem', width: '100%' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isRecovering ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }} className="animate-fade-in stagger-2">
          <p>Loading the latest stories...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }} className="animate-fade-in stagger-2">
          <p>No stories found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="editorial-grid">
            {/* Featured Article */}
            {featuredArticle && (
              <article className="article-card featured-card animate-fade-in stagger-2">
                {hasImage(featuredArticle.image_url) && (
                  <Link href={articlePath(featuredArticle)}>
                    <div className={`card-image-wrapper ${featuredArticle.image_url.trim().startsWith('<') ? 'is-html' : ''}`}>
                      {featuredArticle.image_url.trim().startsWith('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: featuredArticle.image_url.trim() }} style={{ width: '100%' }} />
                      ) : (
                        <Image
                          src={featuredArticle.image_url}
                          alt={featuredArticle.title}
                          fill
                          priority
                          className="card-image"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                    </div>
                  </Link>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="card-category">{featuredArticle.category}</span>
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleBookmark(featuredArticle.id); }}
                      style={{ background: 'none', border: 'none', color: isBookmarked(featuredArticle.id) ? 'var(--accent-gold)' : 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Bookmark size={20} fill={isBookmarked(featuredArticle.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <Link href={articlePath(featuredArticle)}>
                    <h2 className="card-title">{featuredArticle.title}</h2>
                    <p className="card-excerpt" style={{ fontSize: '1.1rem' }}>{featuredArticle.excerpt}</p>
                  </Link>
                  <div className="meta-text">
                    <span>{formatDate(featuredArticle.created_at)}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {getReadingTime(featuredArticle.content)} min read</span>
                  </div>
                </div>
              </article>
            )}

            {/* Sidebar Articles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {regularArticles.slice(0, 3).map((article, idx) => (
                <div key={article.id}>
                  <article className={`article-card animate-fade-in stagger-${(idx % 3) + 2}`} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="card-category">{article.category}</span>
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleBookmark(article.id); }}
                        style={{ background: 'none', border: 'none', color: isBookmarked(article.id) ? 'var(--accent-gold)' : 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                      >
                        <Bookmark size={16} fill={isBookmarked(article.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <Link href={articlePath(article)}>
                      <h3 className="card-title" style={{ fontSize: '1.25rem' }}>{article.title}</h3>
                    </Link>
                    <div className="meta-text" style={{ marginTop: '0.5rem' }}>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                  </article>

                  {idx === 1 && (
                    <AdUnit slot={homeSidebarAdSlot} label="Sponsored" className="home-sidebar-ad-slot" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AdUnit slot={homeAdSlot} label="Sponsored" className="home-ad-slot" />

          {/* Secondary Grid */}
          {regularArticles.length > 3 && (
            <div className="secondary-grid">
              {regularArticles.slice(3).map((article) => (
                <article key={article.id} className="article-card animate-fade-in stagger-3">
                  {hasImage(article.image_url) && (
                    <Link href={articlePath(article)}>
                      <div className={`card-image-wrapper ${article.image_url.trim().startsWith('<') ? 'is-html' : ''}`}>
                        {article.image_url.trim().startsWith('<') ? (
                          <div dangerouslySetInnerHTML={{ __html: article.image_url.trim() }} style={{ width: '100%' }} />
                        ) : (
                          <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className="card-image"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'contain' }}
                          />
                        )}
                      </div>
                    </Link>
                  )}
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="card-category">{article.category}</span>
                    </div>
                    <Link href={articlePath(article)}>
                      <h3 className="card-title" style={{ fontSize: '1.25rem' }}>{article.title}</h3>
                    </Link>
                    <div className="meta-text" style={{ marginTop: '1rem' }}>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
