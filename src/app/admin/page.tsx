"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useNews } from '../../context/NewsContext';
import type { NewsArticle, VisitorStats } from '../../types';
import { CATEGORIES, formatDate } from '../../types';
import { Plus, Edit2, Trash2, X, BarChart3, FileText, LayoutDashboard, MessageSquare, Bold, Italic, List, ListOrdered, Heading2, Quote, Link as LinkIcon, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading, articles, addArticle, deleteArticle, updateArticle, fetchContactMessages, deleteContactMessage, clearAllMessages, fetchVisitorStats } = useNews();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<NewsArticle>>({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'messages'>('articles');
  const [messages, setMessages] = useState<any[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    topPages: [],
  });
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

  if (isLoading || !user.isAuthenticated) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    let success = false;
    const articleToSave = {
      ...currentArticle,
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
    }
  };

  const editArticle = (article: NewsArticle) => {
    setCurrentArticle(article);
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
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Top Visited Pages</h3>
          <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 0.7rem' }} onClick={() => fetchVisitorStats().then(setVisitorStats)}>
            Refresh
          </button>
        </div>
        {visitorStats.topPages.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Visitor data will appear here after the analytics table is created and the site receives traffic.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {visitorStats.topPages.map(page => (
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

      {/* Editor Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ animationDuration: '0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.75rem', margin: 0 }}>
                {currentArticle.id ? 'Edit Story' : 'Compose Story'}
              </h3>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave}>
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
                <label className="form-label">Hero Image URL <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <input
                  type="url"
                  className="form-input"
                  value={currentArticle.image_url || ''}
                  onChange={e => setCurrentArticle({...currentArticle, image_url: e.target.value})}
                  placeholder="https://images.unsplash.com/... or leave blank"
                />
                {currentArticle.image_url && (
                  <div style={{ marginTop: '1rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: '150px', background: 'var(--bg-color)', position: 'relative' }}>
                    <Image 
                      src={currentArticle.image_url} 
                      alt="Preview" 
                      fill
                      sizes="300px"
                      style={{ objectFit: 'cover' }} 
                      onError={(e) => (e.currentTarget.style.display = 'none')} 
                      onLoad={(e) => (e.currentTarget.style.display = 'block')} 
                    />
                  </div>
                )}
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
                <label className="form-label">Article Body</label>
                <div className="editor-toolbar" aria-label="Article formatting tools">
                  <button type="button" className="editor-tool" onClick={() => insertContent('**', '**', 'bold text')} title="Bold">
                    <Bold size={16} />
                  </button>
                  <button type="button" className="editor-tool" onClick={() => insertContent('*', '*', 'italic text')} title="Italic">
                    <Italic size={16} />
                  </button>
                  <button type="button" className="editor-tool" onClick={() => insertLinePrefix('## ')} title="Heading">
                    <Heading2 size={16} />
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
                </div>
                <textarea
                  ref={contentRef}
                  className="form-input"
                  rows={12}
                  style={{ lineHeight: 1.6 }}
                  value={currentArticle.content || ''}
                  onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})}
                  required
                  placeholder="Write your story here..."
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
