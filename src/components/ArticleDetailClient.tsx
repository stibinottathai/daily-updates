"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useNews } from '../context/NewsContext';
import { Clock, ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { getReadingTime, formatDate, getDisplayCategory, type NewsArticle } from '../types';
import { useEffect, useState } from 'react';
import AdUnit from './AdUnit';
import { sanitizeHtml } from '../lib/sanitizeHtml';

const articleAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE || '';
const articleBottomAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM || '';

function renderInline(text: string) {
  const parts = text.split(/(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      return (
        <span key={index} className="inline-image" style={{ display: 'inline-block', margin: '0 0.5rem', verticalAlign: 'middle' }}>
          <img 
            src={imgMatch[2]} 
            alt={imgMatch[1]} 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '150px',
              borderRadius: '4px', 
              display: 'inline-block',
            }} 
          />
        </span>
      );
    }

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
  if (content.startsWith('<!-- FORMAT:HTML -->')) {
    const htmlContent = content.replace('<!-- FORMAT:HTML -->\n', '').replace('<!-- FORMAT:HTML -->', '');
    return <div className="article-content html-mode" dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }} />;
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: { type: 'ul' | 'ol', items: string[] } | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ');
      elements.push(<p key={`p-${elements.length}`}>{renderInline(text)}</p>);
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${elements.length}`}>
            {currentList.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`}>
            {currentList.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
          </ol>
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Headers
    const hMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (hMatch) {
      flushParagraph();
      flushList();
      const level = hMatch[1].length;
      const text = hMatch[2];
      const Tag = `h${level}` as any;
      
      const styles: Record<number, React.CSSProperties> = {
        1: { fontSize: '2.5rem', marginBottom: '1.5rem', marginTop: '2.5rem', fontWeight: 800 },
        2: {}, // Uses global CSS
        3: { fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem', fontWeight: 700 },
        4: { fontSize: '1.25rem', marginBottom: '0.75rem', marginTop: '1.5rem', fontWeight: 600 },
        5: { fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1.25rem', fontWeight: 600 },
        6: { fontSize: '1rem', marginBottom: '0.5rem', marginTop: '1rem', fontWeight: 600, textTransform: 'uppercase' as const }
      };
      
      elements.push(<Tag key={`h-${elements.length}`} style={styles[level]}>{renderInline(text)}</Tag>);
      continue;
    }

    // Images
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushParagraph();
      flushList();
      elements.push(
        <div key={`img-${elements.length}`} className="article-body-image" style={{ margin: '2.5rem 0', textAlign: 'center' }}>
          <img 
            src={imgMatch[2]} 
            alt={imgMatch[1]} 
            style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'block', margin: '0 auto' }} 
          />
          {imgMatch[1] && (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontStyle: 'italic', lineHeight: 1.4 }}>
              {imgMatch[1]}
            </p>
          )}
        </div>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith('- ')) {
      flushParagraph();
      if (currentList && currentList.type !== 'ul') flushList();
      if (!currentList) currentList = { type: 'ul', items: [] };
      currentList.items.push(line.substring(2));
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      if (currentList && currentList.type !== 'ol') flushList();
      if (!currentList) currentList = { type: 'ol', items: [] };
      currentList.items.push(line.replace(/^\d+\.\s+/, ''));
      continue;
    }

    // Otherwise, it's text for a paragraph
    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();

  return <div className="article-content">{elements}</div>;
}

export default function ArticleDetailClient({ article, language }: { article: NewsArticle; language: 'en' | 'ml' }) {
  const { toggleBookmark, isBookmarked, addToast } = useNews();
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);

  const byline = article.author?.trim() || 'Anonymous';

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

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard', 'success');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        addToast('Could not share this article', 'error');
      }
    }
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'var(--surface-color)', zIndex: 100 }}>
        <div style={{ height: '100%', background: 'var(--accent-gold)', width: `${scrollProgress * 100}%`, transition: 'width 0.1s' }}></div>
      </div>

      <article className="animate-fade-in stagger-1" lang={language} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="article-hero">
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: 0 }}>
            <ArrowLeft size={16} /> Back
          </button>
          
          <span className="article-hero-category">{getDisplayCategory(article)}</span>
          <h1 className="article-hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.03em', margin: '1rem 0 1.5rem' }}>{article.title}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', marginBottom: '2rem', lineHeight: 1.6, fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
            {article.excerpt}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 600 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-amber) 0%, hsl(320, 85%, 60%) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: '#fff',
                textTransform: 'uppercase'
              }}>
                {byline.charAt(0)}
              </div>
              {byline}
            </span>
          </div>
          
          <div className="article-hero-meta" style={{ display: 'flex', gap: '1.5rem', padding: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
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
            article.image_url.trim().startsWith('<') ? (
              <div 
                style={{ width: '100%', maxWidth: '900px', margin: '0 auto 2rem auto', borderRadius: '12px', overflow: 'hidden' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.image_url.trim()) }}
              />
            ) : (
              <div style={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto 2rem auto', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  priority
                  className="article-hero-image"
                  sizes="(max-width: 900px) 100vw, 900px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )
          )}
        </div>

        <div className="article-body" style={{ position: 'relative', fontFamily: 'var(--font-display)', fontSize: '1.2rem', lineHeight: 1.8 }}>
          <div style={{ 
            whiteSpace: article.content.startsWith('<!-- FORMAT:HTML -->') ? 'normal' : 'pre-wrap'
          }}>
            {renderArticleContent(article.content)}
          </div>
        </div>

        {/* Creator Profile Card at Bottom */}
        <div className="glass-panel" style={{ 
          marginTop: '4rem', 
          padding: '2rem', 
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-amber) 0%, hsl(320, 85%, 60%) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#fff',
            textTransform: 'uppercase',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)'
          }}>
            {byline.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Written by {byline}</h4>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Writer and contributor on InkFlow. Sharing stories and ideas on topics across technology, culture, design, and science.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
