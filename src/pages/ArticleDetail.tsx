import { useParams, useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { Clock, ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { getReadingTime, formatDate } from '../types';
import { useEffect, useState } from 'react';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { articles, toggleBookmark, isBookmarked, addToast } = useNews();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  const article = articles.find(a => a.id === id);

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

  if (!article) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Article not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The article you are looking for does not exist or has been removed.</p>
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Return Home
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'var(--surface-color)', zIndex: 100 }}>
        <div style={{ height: '100%', background: 'var(--accent-gold)', width: `${scrollProgress * 100}%`, transition: 'width 0.1s' }}></div>
      </div>

      <article className="animate-fade-in stagger-1">
        <div className="article-hero">
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: 0 }}>
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
          
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="article-hero-image"
          />
        </div>

        <div className="article-body">
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {article.content}
          </div>
        </div>
      </article>
    </>
  );
};

export default ArticleDetail;