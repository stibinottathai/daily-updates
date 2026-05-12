"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useNews } from '../context/NewsContext';
import { Bookmark, Search, Clock, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { getReadingTime, formatDate, getDisplayCategory, type NewsArticle } from '../types';
import { articlePath } from '../lib/seo';
import AdUnit from './AdUnit';

const homeAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || '';

const hasImage = (url?: string) => Boolean(url?.trim());

/** Returns the number of grid items to show per page based on current viewport */
function useItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(20); // default to desktop
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setItemsPerPage(20);      // desktop: 5 rows × 4 cols
      else if (w >= 768) setItemsPerPage(9);   // tablet:  3 rows × 3 cols
      else setItemsPerPage(8);                  // mobile:  4 rows × 2 cols
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return itemsPerPage;
}

export default function HomeClient({
  articles,
  initialCategory,
  initialRegion = null,
  serverLoadFailed = false,
}: {
  articles: NewsArticle[];
  initialCategory: string | null;
  initialRegion?: string | null;
  serverLoadFailed?: boolean;
}) {
  const { articles: liveArticles, isLoading, toggleBookmark, isBookmarked, addToast } = useNews();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = useItemsPerPage();
  const searchTimerRef = useRef<number | null>(null);
  const selectedCategory = initialCategory;
  const displayArticles = articles.length > 0 ? articles : (selectedCategory ? [] : liveArticles);
  const isRecovering = serverLoadFailed && isLoading && displayArticles.length === 0;

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

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

  // Add region/sub_category filtering
  if (initialRegion) {
    filteredArticles = filteredArticles.filter(a => a.sub_category === initialRegion);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q)
    );
  }

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = filteredArticles.slice(1); // Everything after the hero

  const totalPages = Math.ceil(gridArticles.length / itemsPerPage);
  const paginatedArticles = gridArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const target = document.getElementById('news-grid-start');
    if (target) {
      const offset = 80; // Optional offset for fixed navbar
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShare = async (article: NewsArticle) => {
    const url = `${window.location.origin}${articlePath(article)}`;
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(url);
      addToast('Article link copied', 'success');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        addToast('Could not share this article', 'error');
      }
    }
  };

  const pageTitle = searchQuery
    ? 'Search Results'
    : initialRegion
    ? `${initialRegion} News`
    : selectedCategory || 'Home';

  return (
    <div>
      {/* Header Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
        <h1 style={{ fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }} className="animate-fade-in stagger-1">
          {pageTitle}
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
          {/* Hero + Trending Sidebar */}
          {featuredArticle && (
            <div className="hero-sidebar-grid" style={{ marginBottom: '3rem' }}>
              {/* Left: Featured/Hero Article */}
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
                          unoptimized
                          className="card-image"
                          sizes="(max-width: 768px) 100vw, 65vw"
                          style={{ objectFit: 'contain', backgroundColor: '#f0f0f0' }}
                        />
                      )}
                    </div>
                  </Link>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="card-category">{getDisplayCategory(featuredArticle)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(featuredArticle.id)}
                        style={{ background: 'none', border: 'none', color: isBookmarked(featuredArticle.id) ? 'var(--accent-gold)' : 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        title="Bookmark"
                        aria-label="Bookmark article"
                      >
                        <Bookmark size={20} fill={isBookmarked(featuredArticle.id) ? "currentColor" : "none"} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShare(featuredArticle)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        title="Share"
                        aria-label="Share article"
                      >
                        <Share2 size={19} />
                      </button>
                    </div>
                  </div>
                  <Link href={articlePath(featuredArticle)}>
                    <h2 className="card-title">{featuredArticle.title}</h2>
                    <p className="card-excerpt" style={{ fontSize: '1.05rem' }}>{featuredArticle.excerpt}</p>
                  </Link>
                  <div className="meta-text">
                    <span>{formatDate(featuredArticle.created_at)}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {getReadingTime(featuredArticle.content)} min read</span>
                  </div>
                </div>
              </article>

              {/* Right: Trending Now Sidebar */}
              <aside className="trending-sidebar animate-fade-in stagger-3">
                <div className="trending-header">
                  <span className="trending-bar" />
                  <h2 className="trending-title">Trending Now</h2>
                </div>
                <ol className="trending-list">
                  {gridArticles.slice(0, 7).map((article, idx) => (
                    <li key={article.id} className="trending-item">
                      <span className="trending-number">{String(idx + 1).padStart(2, '0')}</span>
                      <div className="trending-content">
                        <span className="card-category" style={{ fontSize: '0.65rem' }}>{getDisplayCategory(article)}</span>
                        <Link href={articlePath(article)} className="trending-link">
                          {article.title}
                        </Link>
                        <span className="trending-date">{formatDate(article.created_at)}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          )}

          {/* Divider */}
          <div id="news-grid-start" style={{ borderTop: '2px solid var(--border-color)', marginBottom: '2rem' }} />

          {/* Uniform 4-Column Grid */}
          {paginatedArticles.length > 0 && (
            <div className="home-news-grid">
              {paginatedArticles.map((article, idx) => (
                <article key={article.id} className={`article-card animate-fade-in stagger-${(idx % 4) + 1}`}>
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
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            style={{ objectFit: 'contain' }}
                          />
                        )}
                      </div>
                    </Link>
                  )}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span className="card-category">{getDisplayCategory(article)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(article.id)}
                          style={{ background: 'none', border: 'none', color: isBookmarked(article.id) ? 'var(--accent-gold)' : 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          title="Bookmark"
                          aria-label="Bookmark article"
                        >
                          <Bookmark size={15} fill={isBookmarked(article.id) ? "currentColor" : "none"} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShare(article)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          title="Share"
                          aria-label="Share article"
                        >
                          <Share2 size={15} />
                        </button>
                      </div>
                    </div>
                    <Link href={articlePath(article)}>
                      <h3 className="card-title" style={{ fontSize: '1.1rem' }}>{article.title}</h3>
                    </Link>
                    <div className="meta-text" style={{ marginTop: '0.5rem' }}>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Ad Unit between grid and pagination */}
          <AdUnit slot={homeAdSlot} label="Sponsored" className="home-ad-slot" />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="News pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '2.5rem 0', flexWrap: 'wrap' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Show first, last, current and neighbours; ellipsis otherwise
                const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                const isEllipsisBefore = page === 2 && currentPage > 4;
                const isEllipsisAfter = page === totalPages - 1 && currentPage < totalPages - 3;
                if (!show) return null;
                if (isEllipsisBefore || isEllipsisAfter) {
                  return <span key={page} style={{ color: 'var(--text-muted)', padding: '0 0.25rem' }}>…</span>;
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>

              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                Page {currentPage} of {totalPages}
              </span>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
