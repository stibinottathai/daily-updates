"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useNews } from '../context/NewsContext';
import { Bookmark, Search, Clock } from 'lucide-react';
import { getReadingTime, formatDate, type NewsArticle } from '../types';

export default function HomeClient({ articles, initialCategory }: { articles: NewsArticle[], initialCategory: string | null }) {
  const { toggleBookmark, isBookmarked } = useNews();
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCategory = initialCategory;

  // Filter logic
  let filteredArticles = selectedCategory 
    ? articles.filter(a => a.category === selectedCategory)
    : articles;
    
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
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }} className="animate-fade-in stagger-1">
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

      {filteredArticles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }} className="animate-fade-in stagger-2">
          <p>No stories found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="editorial-grid">
            {/* Featured Article */}
            {featuredArticle && (
              <article className="article-card featured-card animate-fade-in stagger-2">
                <Link href={`/article/${featuredArticle.id}`}>
                  <div className="card-image-wrapper">
                    <img src={featuredArticle.image_url} alt={featuredArticle.title} className="card-image" />
                  </div>
                </Link>
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
                  <Link href={`/article/${featuredArticle.id}`}>
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
                <article key={article.id} className={`article-card animate-fade-in stagger-${(idx % 3) + 2}`} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="card-category">{article.category}</span>
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleBookmark(article.id); }}
                      style={{ background: 'none', border: 'none', color: isBookmarked(article.id) ? 'var(--accent-gold)' : 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    >
                      <Bookmark size={16} fill={isBookmarked(article.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <Link href={`/article/${article.id}`}>
                    <h3 className="card-title" style={{ fontSize: '1.25rem' }}>{article.title}</h3>
                  </Link>
                  <div className="meta-text" style={{ marginTop: '0.5rem' }}>
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Secondary Grid */}
          {regularArticles.length > 3 && (
            <div className="secondary-grid">
              {regularArticles.slice(3).map((article) => (
                <article key={article.id} className="article-card animate-fade-in stagger-3">
                  <Link href={`/article/${article.id}`}>
                    <div className="card-image-wrapper">
                      <img src={article.image_url} alt={article.title} className="card-image" />
                    </div>
                  </Link>
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="card-category">{article.category}</span>
                    </div>
                    <Link href={`/article/${article.id}`}>
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
