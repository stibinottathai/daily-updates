import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import type { NewsArticle } from '../types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminDashboard = () => {
  const { user, articles, addArticle, deleteArticle, updateArticle } = useNews();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<NewsArticle>>({});

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user.isAuthenticated) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentArticle.id) {
      updateArticle(currentArticle.id, currentArticle);
    } else {
      addArticle(currentArticle as Omit<NewsArticle, 'id' | 'date'>);
    }
    setIsEditing(false);
    setCurrentArticle({});
  };

  const editArticle = (article: NewsArticle) => {
    setCurrentArticle(article);
    setIsEditing(true);
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>News Management</h2>
          <p style={{ color: 'var(--muted)' }}>Manage your news articles here.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setCurrentArticle({ author: user.username });
            setIsEditing(true);
          }}
        >
          <Plus size={18} /> New Article
        </button>
      </div>

      {isEditing ? (
        <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              {currentArticle.id ? 'Edit Article' : 'Create Article'}
            </h3>
            <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
              <X size={18} /> Cancel
            </button>
          </div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={currentArticle.title || ''}
                onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-input"
                value={currentArticle.imageUrl || ''}
                onChange={e => setCurrentArticle({...currentArticle, imageUrl: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Author</label>
              <input
                type="text"
                className="form-input"
                value={currentArticle.author || ''}
                onChange={e => setCurrentArticle({...currentArticle, author: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Excerpt</label>
              <textarea
                className="form-input"
                rows={2}
                value={currentArticle.excerpt || ''}
                onChange={e => setCurrentArticle({...currentArticle, excerpt: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-input"
                rows={6}
                value={currentArticle.content || ''}
                onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Save Article</button>
          </form>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>No articles found.</td>
                </tr>
              ) : (
                articles.map(article => (
                  <tr key={article.id}>
                    <td style={{ fontWeight: '500' }}>{article.title}</td>
                    <td>{article.author}</td>
                    <td>{new Date(article.date).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => editArticle(article)}>
                          <Edit2 size={16} /> Edit
                        </button>
                        <button className="btn btn-destructive" style={{ padding: '0.25rem 0.5rem' }} onClick={() => deleteArticle(article.id)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
