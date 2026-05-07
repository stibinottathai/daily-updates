"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useNews } from '../../context/NewsContext';
import type { NewsArticle } from '../../types';
import { CATEGORIES, formatDate } from '../../types';
import { Plus, Edit2, Trash2, X, BarChart3, FileText, LayoutDashboard, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading, articles, addArticle, deleteArticle, updateArticle, fetchContactMessages, deleteContactMessage, clearAllMessages } = useNews();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<NewsArticle>>({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'messages'>('articles');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchContactMessages().then(data => setMessages(data));
  }, [fetchContactMessages, activeTab]);

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
    if (currentArticle.id) {
      success = await updateArticle(currentArticle.id, currentArticle);
    } else {
      success = await addArticle(currentArticle as Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>);
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
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
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="meta-text" style={{ marginBottom: '0.25rem' }}>Your Stories</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>{myArticles}</p>
          </div>
        </div>
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
                <label className="form-label">Hero Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={currentArticle.image_url || ''}
                  onChange={e => setCurrentArticle({...currentArticle, image_url: e.target.value})}
                  required
                  placeholder="https://images.unsplash.com/..."
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
                <textarea
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
