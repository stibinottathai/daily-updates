"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useNews } from '../context/NewsContext';
import { Clock, ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { getReadingTime, formatDate, type NewsArticle } from '../types';
import { useEffect, useState } from 'react';
import AdUnit from './AdUnit';

const articleAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE || '';
const articleBottomAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM || '';

function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">
          {linkMatch[1]}
        </a>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function renderArticleContent(content: string) {
  const blocks = content.split(/\n{2,}/).filter(block => block.trim());

  return blocks.map((block, index) => {
    const lines = block.split('\n').filter(line => line.trim());
    const trimmed = block.trim();

    if (trimmed.startsWith('## ')) {
      return <h2 key={index}>{renderInline(trimmed.replace(/^##\s+/, ''))}</h2>;
    }

    // Check for image syntax: ![alt](url)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      return (
        <div key={index} className="article-body-image" style={{ margin: '2.5rem 0', textAlign: 'center' }}>
          <img 
            src={imgMatch[2]} 
            alt={imgMatch[1]} 
            style={{ 
              maxWidth: '100%', 
              borderRadius: '8px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              display: 'block',
              margin: '0 auto'
            }} 
          />
          {imgMatch[1] && (
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-muted)', 
              marginTop: '0.75rem', 
              fontStyle: 'italic',
              lineHeight: 1.4
            }}>
              {imgMatch[1]}
            </p>
          )}
        </div>
      );
    }

    if (lines.every(line => line.trim().startsWith('- '))) {
      return (
        <ul key={index}>
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>{renderInline(line.trim().replace(/^-\s+/, ''))}</li>
          ))}
        </ul>
      );
    }

    if (lines.every(line => /^\d+\.\s+/.test(line.trim()))) {
      return (
        <ol key={index}>
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>{renderInline(line.trim().replace(/^\d+\.\s+/, ''))}</li>
          ))}
        </ol>
      );
    }

    if (lines.every(line => line.trim().startsWith('> '))) {
      return (
        <blockquote key={index}>
          {lines.map(line => line.trim().replace(/^>\s+/, '')).join(' ')}
        </blockquote>
      );
    }

    return <p key={index}>{renderInline(trimmed)}</p>;
  });
}

export default function ArticleDetailClient({ article }: { article: NewsArticle }) {
  const { toggleBookmark, isBookmarked, addToast } = useNews();
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard', 'success');
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'var(--surface-color)', zIndex: 100 }}>
        <div style={{ height: '100%', background: 'var(--accent-gold)', width: `${scrollProgress * 100}%`, transition: 'width 0.1s' }}></div>
      </div>

      <article className="animate-fade-in stagger-1">
        <div className="article-hero">
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: 0 }}>
            <ArrowLeft size={16} /> Back
          </button>
          
          <span className="article-hero-category">{article.category}</span>
          <h1 className="article-hero-title">{article.title}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', marginBottom: '2rem', lineHeight: 1.6 }}>
            {article.excerpt}
          </p>
          
          <div className="article-hero-meta">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>By</span>
              <span style={{ fontWeight: 600 }}>{article.author}</span>
            </div>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Published</span>
              <span style={{ fontWeight: 600 }}>{formatDate(article.created_at)}</span>
            </div>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Read</span>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {getReadingTime(article.content)} min</span>
            </div>
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button onClick={() => toggleBookmark(article.id)} className="btn btn-outline" style={{ padding: '0.5rem' }} title="Bookmark">
                <Bookmark size={18} fill={isBookmarked(article.id) ? "currentColor" : "none"} color={isBookmarked(article.id) ? "var(--accent-gold)" : "currentColor"} />
              </button>
              <button onClick={handleShare} className="btn btn-outline" style={{ padding: '0.5rem' }} title="Share">
                <Share2 size={18} />
              </button>
            </div>
          </div>
          
          {article.image_url?.trim() && (
            <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                priority
                className="article-hero-image"
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          <AdUnit slot={articleAdSlot} label="Advertisement" className="article-ad-slot" />
        </div>

        <div className="article-body" style={{ position: 'relative' }}>
          <div style={{ 
            whiteSpace: 'pre-wrap',
            maxHeight: isExpanded ? 'none' : '400px',
            overflow: 'hidden',
            maskImage: isExpanded ? 'none' : 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: isExpanded ? 'none' : 'linear-gradient(to bottom, black 50%, transparent 100%)',
            transition: 'max-height 0.3s ease-out'
          }}>
            {renderArticleContent(article.content)}
          </div>
          
          {!isExpanded && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              paddingTop: '4rem',
              background: 'linear-gradient(to bottom, transparent, var(--bg-color) 80%)'
            }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setIsExpanded(true)}
                style={{ padding: '0.75rem 2rem', borderRadius: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
              >
                Read More
              </button>
            </div>
          )}
        </div>

        <AdUnit slot={articleBottomAdSlot} label="Sponsored" className="article-bottom-ad-slot" />
      </article>
    </>
  );
}
