import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, LogOut, Settings, Users, Menu, X as XIcon, MessageSquare } from 'lucide-react';
import { CATEGORIES } from './types';
import { NewsProvider, useNews } from './context/NewsContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ArticleDetail from './pages/ArticleDetail';
import { useState } from 'react';
import './index.css';

const ToastContainer = () => {
  const { toasts } = useNews();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
};

const ContactUsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { submitContactMessage } = useNews();
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wordCount > 100) return;
    
    setLoading(true);
    const success = await submitContactMessage(email, content);
    setLoading(false);
    if (success) {
      setEmail('');
      setContent('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={24} color="var(--accent-gold)" /> Contact Us
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <XIcon size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Message</span>
              <span style={{ color: wordCount > 100 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                {wordCount} / 100 words
              </span>
            </label>
            <textarea 
              className="form-input" 
              rows={5} 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              required 
              placeholder="How can we help you?"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading || wordCount > 100 || wordCount === 0}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useNews();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Parse current category from query params
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');

  return (
    <>
      <nav className="masthead">
        <div className="container masthead-inner">
          <Link to="/" className="logo">
            <span>Daily Updates</span>
            <span className="logo-accent">Premium News</span>
          </Link>
          
          <div className="nav-actions" style={{ display: 'none' }} id="desktop-actions">
            {user.isAuthenticated ? (
              <>
                {user.role === 'super_admin' && (
                  <Link to="/manage-users" className="meta-text" style={{ color: 'var(--text-main)' }}>
                    <Users size={16} /> Users
                  </Link>
                )}
                <Link to="/admin" className="meta-text" style={{ color: 'var(--text-main)' }}>
                  <Settings size={16} /> Dashboard
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setContactModalOpen(true)} className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={16} /> Contact Us
                </button>
                <Link to="/login" className="meta-text" style={{ color: 'var(--text-muted)' }}>
                  <LogIn size={16} /> Admin
                </Link>
              </>
            )}
          </div>
          
          <button 
            id="mobile-menu-btn"
            className="btn btn-outline" 
            style={{ padding: '0.4rem', border: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div style={{ padding: '1rem', background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', position: 'absolute', top: '100%', left: 0, right: 0 }}>
             {user.isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {user.role === 'super_admin' && (
                  <Link to="/manage-users" className="meta-text" onClick={() => setMobileMenuOpen(false)}>
                    <Users size={16} /> Manage Users
                  </Link>
                )}
                <Link to="/admin" className="meta-text" onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={16} /> Dashboard
                </Link>
                <button onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => { setContactModalOpen(true); setMobileMenuOpen(false); }} className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={16} /> Contact Us
                </button>
                <Link to="/login" className="meta-text" onClick={() => setMobileMenuOpen(false)}>
                  <LogIn size={16} /> Admin Login
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      
      <ContactUsModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
      
      {/* Category Sub Navbar */}
      <nav className="category-nav">
        <div className="container category-list">
          <Link to="/" className={`cat-link ${!currentCategory ? 'active' : ''}`}>
            Latest
          </Link>
          {CATEGORIES.map(category => (
            <Link 
              key={category} 
              to={`/?category=${category}`} 
              className={`cat-link ${currentCategory === category ? 'active' : ''}`}
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Small hack for desktop actions visibility */}
      <style>{`
        @media (min-width: 768px) {
          #desktop-actions { display: flex !important; }
          #mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};

function App() {
  return (
    <NewsProvider>
      <Router>
        <Navbar />
        <main className="container" style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
          </Routes>
        </main>
        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p className="meta-text" style={{ justifyContent: 'center' }}>© {new Date().getFullYear()} Daily Updates. All rights reserved.</p>
        </footer>
        <ToastContainer />
      </Router>
    </NewsProvider>
  );
}

export default App;