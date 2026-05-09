"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ArticleDetailClient from '../../components/ArticleDetailClient';
import { useNews } from '../../context/NewsContext';
import type { NewsArticle, VisitorStats } from '../../types';
import { CATEGORIES, formatDate } from '../../types';
import { Plus, Edit2, Trash2, X, BarChart3, FileText, LayoutDashboard, MessageSquare, Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Quote, Link as LinkIcon, Eye, Image as ImageIcon } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading, articles, addArticle, deleteArticle, updateArticle, fetchContactMessages, deleteContactMessage, clearAllMessages, fetchVisitorStats } = useNews();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<NewsArticle>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'write' | 'preview' | 'seo'>('write');
  const [activeTab, setActiveTab] = useState<'articles' | 'messages'>('articles');
  const [messages, setMessages] = useState<any[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    topPages: [],
  });
  const [topPagesExpanded, setTopPagesExpanded] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchContactMessages().then(data => setMessages(data));
  }, [fetchContactMessages, activeTab]);

  useEffect(() => {
    if (user.isAuthenticated) {
      fetchVisitorStats().then(setVisitorStats);
    }
  }, [fetchVisitorStats, user.isAuthenticated]);

  useEffect(() => {
    if (!isLoading && !user.isAuthenticated) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user.isAuthenticated) {
    return (
      <div className="container" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
        <div style={{
          width: '100%',
          maxWidth: '720px',
          padding: '3rem',
          borderRadius: '1.25rem',
          border: '1px solid var(--border-color)',
          background: 'rgba(18, 18, 18, 0.55)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.28)'
        }}>
          <p className="card-category" style={{ marginBottom: '1rem' }}>Admin</p>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Loading dashboard...</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Preparing the editorial dashboard and checking your session.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    let success = false;
    
    let finalContent = currentArticle.content || '';
    if (isHtmlMode && !finalContent.startsWith('<!-- FORMAT:HTML -->')) {
      finalContent = `<!-- FORMAT:HTML -->\n${finalContent}`;
    }

    const articleToSave = {
      ...currentArticle,
      content: finalContent,
      image_url: currentArticle.image_url?.trim() || '',
    };
    if (currentArticle.id) {
      success = await updateArticle(currentArticle.id, articleToSave);
    } else {
      success = await addArticle(articleToSave as Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>);
    }
    setSubmitting(false);
    if (success) {
      setIsEditing(false);
      setCurrentArticle({});
      setIsHtmlMode(false);
    }
  };

  const editArticle = (article: NewsArticle) => {
    let content = article.content || '';
    if (content.startsWith('<!-- FORMAT:HTML -->')) {
      setIsHtmlMode(true);
      content = content.replace('<!-- FORMAT:HTML -->\n', '').replace('<!-- FORMAT:HTML -->', '');
    } else {
      setIsHtmlMode(false);
    }
    setCurrentArticle({ ...article, content });
    setActiveEditorTab('write');
    setIsEditing(true);
  };

  const insertContent = (before: string, after = '', placeholder = 'text') => {
    const textarea = contentRef.current;
    const content = currentArticle.content || '';
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? content.length;
    const selected = content.slice(start, end) || placeholder;
    const nextContent = `${content.slice(0, start)}${before}${selected}${after}${content.slice(end)}`;

    setCurrentArticle({ ...currentArticle, content: nextContent });

    requestAnimationFrame(() => {
      textarea?.focus();
      const selectionStart = start + before.length;
      textarea?.setSelectionRange(selectionStart, selectionStart + selected.length);
    });
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = contentRef.current;
    const content = currentArticle.content || '';
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? content.length;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const selected = content.slice(lineStart, end) || 'New point';
    const lines = selected.split('\n');
    const numbered = prefix === '1. ';
    const formatted = lines
      .map((line, index) => `${numbered ? `${index + 1}. ` : prefix}${line.replace(/^(\s*[-*>#]|\d+\.)\s+/, '')}`)
      .join('\n');
    const nextContent = `${content.slice(0, lineStart)}${formatted}${content.slice(end)}`;

    setCurrentArticle({ ...currentArticle, content: nextContent });

    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(lineStart, lineStart + formatted.length);
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      await deleteArticle(id);
    }
  };

  const handleMessageDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to clear this message?')) {
      const success = await deleteContactMessage(id);
      if (success) {
        setMessages(messages.filter(m => m.id !== id));
      }
    }
  };

  const handleClearAllMessages = async () => {
    if (messages.length === 0) return;
    if (window.confirm('Are you sure you want to clear ALL messages? This action cannot be undone.')) {
      const success = await clearAllMessages();
      if (success) {
        setMessages([]);
      }
    }
  };

  // Stats calculation
  const totalArticles = articles.length;
  const myArticles = articles.filter(a => a.author_id === user.id).length;
  const popularCategory = Object.entries(
    articles.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const visibleTopPages = topPagesExpanded ? visitorStats.topPages : visitorStats.topPages.slice(0, 3);

  if (isEditing) {
    return (
      <div className="animate-fade-in stagger-1" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.75rem', margin: 0 }}>
            {currentArticle.id ? 'Edit Story' : 'Compose Story'}
          </h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setActiveEditorTab('write')}
              style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', fontWeight: activeEditorTab === 'write' ? 'bold' : 'normal', color: activeEditorTab === 'write' ? 'var(--accent-gold)' : 'var(--text-muted)' }}
            >
              Write
            </button>
            <button 
              onClick={() => setActiveEditorTab('preview')}
              style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', fontWeight: activeEditorTab === 'preview' ? 'bold' : 'normal', color: activeEditorTab === 'preview' ? 'var(--accent-gold)' : 'var(--text-muted)' }}
            >
              Preview
            </button>
            <button 
              onClick={() => setActiveEditorTab('seo')}
              style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', fontWeight: activeEditorTab === 'seo' ? 'bold' : 'normal', color: activeEditorTab === 'seo' ? 'var(--accent-gold)' : 'var(--text-muted)' }}
            >
              SEO & Meta
            </button>
          </div>
          <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ flex: 1 }}>
            {activeEditorTab === 'write' && (
              <div className="animate-fade-in">
                <div className="form-group">
                  <label className="form-label">Headline</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}
                    value={currentArticle.title || ''}
                    onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})}
                    required
                    placeholder="Enter a compelling headline..."
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-input"
                      value={currentArticle.category || ''}
                      onChange={e => setCurrentArticle({...currentArticle, category: e.target.value})}
                      required
                    >
                      <option value="" disabled>Select a category...</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author Byline</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentArticle.author || ''}
                      onChange={e => setCurrentArticle({...currentArticle, author: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Image <span style={{ textTransform: 'none', letterSpacing: 0 }}>(URL or &lt;img&gt; tag — optional)</span></label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={currentArticle.image_url || ''}
                    onChange={e => setCurrentArticle({...currentArticle, image_url: e.target.value})}
                    placeholder={`Option 1 — Plain URL:\nhttps://i.postimg.cc/your-image.png\n\nOption 2 — HTML img tag:\n<img src="https://i.postimg.cc/your-image.png" alt="Description" style="width:100%; height:auto; border-radius:10px;" />`}
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Paste an image URL <em>or</em> a full <code>&lt;img&gt;</code> tag with custom styles (e.g. <code>width:100%; height:auto; object-fit:cover;</code>) for full control over how the image displays.
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Excerpt / Subtitle</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={currentArticle.excerpt || ''}
                    onChange={e => setCurrentArticle({...currentArticle, excerpt: e.target.value})}
                    required
                    placeholder="A brief summary that appears on cards..."
                  />
                </div>
                
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Article Body</label>
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                      <button 
                        type="button" 
                        onClick={() => setIsHtmlMode(false)}
                        style={{ padding: '0.25rem 0.75rem', background: !isHtmlMode ? 'var(--surface-color)' : 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: !isHtmlMode ? 'bold' : 'normal', color: !isHtmlMode ? 'var(--text-color)' : 'var(--text-muted)', boxShadow: !isHtmlMode ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}
                      >
                        Plain Text (Markdown)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsHtmlMode(true)}
                        style={{ padding: '0.25rem 0.75rem', background: isHtmlMode ? 'var(--surface-color)' : 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: isHtmlMode ? 'bold' : 'normal', color: isHtmlMode ? 'var(--text-color)' : 'var(--text-muted)', boxShadow: isHtmlMode ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}
                      >
                        HTML
                      </button>
                    </div>
                  </div>
                  
                  {!isHtmlMode && (
                    <div className="editor-toolbar" aria-label="Article formatting tools">
                    <button type="button" className="editor-tool" onClick={() => insertContent('**', '**', 'bold text')} title="Bold">
                      <Bold size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertContent('*', '*', 'italic text')} title="Italic">
                      <Italic size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertLinePrefix('# ')} title="Heading 1">
                      <Heading1 size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertLinePrefix('## ')} title="Heading 2">
                      <Heading2 size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertLinePrefix('### ')} title="Heading 3">
                      <Heading3 size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertLinePrefix('#### ')} title="Heading 4">
                      <Heading4 size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertLinePrefix('##### ')} title="Heading 5">
                      <Heading5 size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertLinePrefix('###### ')} title="Heading 6">
                      <Heading6 size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertLinePrefix('- ')} title="Bullet list">
                      <List size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertLinePrefix('1. ')} title="Numbered list">
                      <ListOrdered size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertLinePrefix('> ')} title="Quote">
                      <Quote size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertContent('[', '](https://example.com)', 'link text')} title="Link">
                      <LinkIcon size={16} />
                    </button>
                    <button type="button" className="editor-tool" onClick={() => insertContent('![', '](https://images.unsplash.com/photo-...)', 'image caption')} title="Insert Inline Image">
                      <ImageIcon size={16} />
                    </button>
                  </div>
                  )}
                  <textarea
                    ref={contentRef}
                    className="form-input"
                    rows={16}
                    style={{ lineHeight: 1.6, fontFamily: isHtmlMode ? 'monospace' : 'inherit' }}
                    value={currentArticle.content || ''}
                    onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})}
                    required
                    placeholder={isHtmlMode ? "<h1>Write your HTML code here...</h1>\n<p>It will be rendered exactly as written.</p>" : "Write your story here..."}
                  />
                </div>
              </div>
            )}

            {activeEditorTab === 'preview' && (
              <div className="animate-fade-in" style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div>
                  <ArticleDetailClient 
                    article={{
                      ...currentArticle,
                      id: currentArticle.id || 'preview-id',
                      title: currentArticle.title || 'Untitled',
                      excerpt: currentArticle.excerpt || 'No excerpt provided.',
                      content: isHtmlMode 
                        ? `<!-- FORMAT:HTML -->\n${currentArticle.content || ''}`
                        : currentArticle.content || 'Start writing your story to see the preview.',
                      category: currentArticle.category || CATEGORIES[0],
                      author: currentArticle.author || 'Anonymous',
                      image_url: currentArticle.image_url || '',
                      created_at: currentArticle.created_at || new Date().toISOString(),
                    } as NewsArticle} 
                  />
                </div>
              </div>
            )}

            {activeEditorTab === 'seo' && (
              <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Title Optimization (SEO Title)</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Optimal length: 50-60 characters.</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, background: 'var(--bg-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min(((currentArticle.title?.length || 0) / 60) * 100, 100)}%`, 
                        background: (currentArticle.title?.length || 0) >= 50 && (currentArticle.title?.length || 0) <= 60 ? '#10b981' : (currentArticle.title?.length || 0) > 60 ? '#ef4444' : '#f59e0b'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentArticle.title?.length || 0} / 60 chars</span>
                  </div>
                  {(currentArticle.title?.length || 0) > 60 && (
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>Your title is too long and may be truncated in search results.</p>
                  )}
                </div>

                <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Excerpt Optimization (Meta Description)</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Optimal length: 150-160 characters.</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, background: 'var(--bg-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min(((currentArticle.excerpt?.length || 0) / 160) * 100, 100)}%`, 
                        background: (currentArticle.excerpt?.length || 0) >= 150 && (currentArticle.excerpt?.length || 0) <= 160 ? '#10b981' : (currentArticle.excerpt?.length || 0) > 160 ? '#ef4444' : '#f59e0b'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentArticle.excerpt?.length || 0} / 160 chars</span>
                  </div>
                </div>

                <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Content Readability</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
                      <p className="meta-text" style={{ marginBottom: '0.25rem' }}>Word Count</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                        {(currentArticle.content?.trim() || '').split(/\s+/).filter(Boolean).length}
                      </p>
                    </div>
                    <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
                      <p className="meta-text" style={{ marginBottom: '0.25rem' }}>Est. Reading Time</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                        {Math.max(1, Math.ceil(((currentArticle.content?.trim() || '').split(/\s+/).filter(Boolean).length) / 200))} min
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <strong style={{ color: 'var(--text-color)' }}>Keyword Check:</strong> Search engines look for your category ({currentArticle.category || 'None'}) as a primary keyword.
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      <li style={{ color: (currentArticle.title?.toLowerCase().includes((currentArticle.category || '').toLowerCase()) ? '#10b981' : '#f59e0b') }}>
                        In Title: {currentArticle.title?.toLowerCase().includes((currentArticle.category || '').toLowerCase()) ? 'Yes' : 'No'}
                      </li>
                      <li style={{ color: (currentArticle.excerpt?.toLowerCase().includes((currentArticle.category || '').toLowerCase()) ? '#10b981' : '#f59e0b') }}>
                        In Excerpt: {currentArticle.excerpt?.toLowerCase().includes((currentArticle.category || '').toLowerCase()) ? 'Yes' : 'No'}
                      </li>
                      <li style={{ color: ((currentArticle.content?.toLowerCase().includes((currentArticle.category || '').toLowerCase())) ? '#10b981' : '#f59e0b') }}>
                        In Content: {currentArticle.content?.toLowerCase().includes((currentArticle.category || '').toLowerCase()) ? 'Yes' : 'No'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '2rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in stagger-1">
      <div className="dashboard-header">
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Editorial Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage articles, track performance, and publish new content.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setCurrentArticle({ author: user.email, category: CATEGORIES[0] });
            setIsHtmlMode(false);
            setActiveEditorTab('write');
            setIsEditing(true);
          }}
        >
          <Plus size={18} /> Compose Story
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(232, 197, 71, 0.1)', color: 'var(--accent-gold)', padding: '1rem', borderRadius: '50%' }}>
            <Eye size={24} />
          </div>
          <div>
            <p className="meta-text" style={{ marginBottom: '0.25rem' }}>Site Visits</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>{visitorStats.totalVisits}</p>
            <p style={{ color: 'var(--text-muted)', margin: '0.15rem 0 0', fontSize: '0.85rem' }}>{visitorStats.todayVisits} today</p>
          </div>
        </div>
        <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(232, 197, 71, 0.1)', color: 'var(--accent-gold)', padding: '1rem', borderRadius: '50%' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="meta-text" style={{ marginBottom: '0.25rem' }}>Unique Visitors</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>{visitorStats.uniqueVisitors}</p>
            <p style={{ color: 'var(--text-muted)', margin: '0.15rem 0 0', fontSize: '0.85rem' }}>Browsers/devices</p>
          </div>
        </div>
        <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(232, 197, 71, 0.1)', color: 'var(--accent-gold)', padding: '1rem', borderRadius: '50%' }}>
            <FileText size={24} />
          </div>
          <div>
            <p className="meta-text" style={{ marginBottom: '0.25rem' }}>Total Articles</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>{totalArticles}</p>
          </div>
        </div>
        <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(232, 197, 71, 0.1)', color: 'var(--accent-gold)', padding: '1rem', borderRadius: '50%' }}>
            <LayoutDashboard size={24} />
          </div>
          <div>
            <p className="meta-text" style={{ marginBottom: '0.25rem' }}>Top Category</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', textTransform: 'capitalize' }}>{popularCategory}</p>
          </div>
        </div>
        <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(232, 197, 71, 0.1)', color: 'var(--accent-gold)', padding: '1rem', borderRadius: '50%' }}>
            <LayoutDashboard size={24} />
          </div>
          <div>
            <p className="meta-text" style={{ marginBottom: '0.25rem' }}>Your Stories</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>{myArticles}</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Top Visited Pages</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Site visits count page loads. Unique visitors count each browser/device once.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {visitorStats.topPages.length > 3 && (
              <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 0.7rem' }} onClick={() => setTopPagesExpanded(prev => !prev)}>
                {topPagesExpanded ? 'Shrink' : 'Expand'}
              </button>
            )}
            <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 0.7rem' }} onClick={() => fetchVisitorStats().then(setVisitorStats)}>
              Refresh
            </button>
          </div>
        </div>
        {visitorStats.topPages.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Visitor data will appear here after the analytics table is created and the site receives traffic.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {visibleTopPages.map(page => (
              <div key={page.path} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.path}</span>
                <span className="meta-text">{page.visits} visits</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('articles')}
          style={{ 
            background: 'none', border: 'none', padding: '1rem 0', cursor: 'pointer',
            color: activeTab === 'articles' ? 'var(--accent-gold)' : 'var(--text-muted)',
            borderBottom: activeTab === 'articles' ? '2px solid var(--accent-gold)' : '2px solid transparent',
            fontWeight: activeTab === 'articles' ? 'bold' : 'normal',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FileText size={18} /> Published Content
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          style={{ 
            background: 'none', border: 'none', padding: '1rem 0', cursor: 'pointer',
            color: activeTab === 'messages' ? 'var(--accent-gold)' : 'var(--text-muted)',
            borderBottom: activeTab === 'messages' ? '2px solid var(--accent-gold)' : '2px solid transparent',
            fontWeight: activeTab === 'messages' ? 'bold' : 'normal',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <MessageSquare size={18} /> Inbox ({messages.length})
        </button>
      </div>
      
      {activeTab === 'articles' ? (
        <div className="table-container">
          <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Published</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No articles published yet.</td>
              </tr>
            ) : (
              articles.map(article => (
                <tr key={article.id}>
                  <td style={{ fontWeight: '500', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{article.title}</td>
                  <td><span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{article.category}</span></td>
                  <td>{article.author}</td>
                  <td>{formatDate(article.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem' }} onClick={() => editArticle(article)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="btn btn-destructive" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleDelete(article.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      ) : (
        <div>
          {messages.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button className="btn btn-destructive" onClick={handleClearAllMessages}>
                <Trash2 size={16} /> Clear All Messages
              </button>
            </div>
          )}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sender Email</th>
                  <th>Message Content</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No messages found.</td>
                </tr>
              ) : (
                messages.map(msg => (
                  <tr key={msg.id}>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(msg.created_at)}</td>
                    <td style={{ fontWeight: '500' }}>{msg.email}</td>
                    <td style={{ maxWidth: '400px' }}>{msg.content}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-destructive" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleMessageDelete(msg.id)}>
                          <Trash2 size={14} /> Clear
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}

    </div>
  );
}
