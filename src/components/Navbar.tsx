"use client";

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LogIn, LogOut, Settings, Users, Menu, X as XIcon, Moon, Sun, ChevronDown, Search } from 'lucide-react';
import { CATEGORIES } from '../types';
import { useNews } from '../context/NewsContext';
import { categoryFromSlug, categoryPath } from '../lib/seo';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { user, logout, theme, toggleTheme, addToast, refreshAuth } = useNews();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathCategorySlug = pathname.startsWith('/category/') ? pathname.split('/')[2] : null;
  const currentCategory = pathCategorySlug
    ? categoryFromSlug(pathCategorySlug, CATEGORIES)
    : searchParams.get('category');
  
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(Boolean(searchParams.get('q')));
  const [searchDraft, setSearchDraft] = useState(searchParams.get('q') ?? '');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const searchQuery = searchParams.get('q') ?? '';
  const searchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSearchDraft(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmedQuery = searchDraft.trim();

      if (trimmedQuery) {
        params.set('q', trimmedQuery);
        setSearchOpen(true);
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
  }, [pathname, router, searchDraft, searchParams]);

  useLayoutEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    
    if (error) {
      addToast(error.message, 'error');
    } else {
      await refreshAuth();
      addToast('Logged in successfully', 'success');
      setLoginModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
      router.push('/admin');
    }
    setLoginLoading(false);
  };

  const visibleCategories = CATEGORIES.slice(0, 9);
  const hiddenCategories = CATEGORIES.slice(9);
  const themeLabel = mounted ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Theme';
  const ThemeIcon = mounted ? (theme === 'dark' ? Sun : Moon) : null;

  return (
    <>
      <nav className="masthead">
        <div className="container masthead-inner">
          <Link href="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <span>Daily Updates</span>
            <span className="logo-accent">Premium News</span>
          </Link>

          <div className="navbar-search-shell">
            <button
              type="button"
              className="navbar-search-trigger"
              aria-label="Open search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(prev => !prev)}
            >
              <Search size={18} />
            </button>

            {searchOpen && (
              <form
                className="navbar-search"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <Search size={16} className="navbar-search-icon" />
                <input
                  type="search"
                  className="navbar-search-input"
                  placeholder="Search articles..."
                  aria-label="Search articles"
                  value={searchDraft}
                  autoFocus
                  onChange={(e) => setSearchDraft(e.target.value)}
                />
              </form>
            )}
          </div>
          
          <div className="nav-actions" style={{ display: 'none' }} id="desktop-actions">
            <button onClick={toggleTheme} className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', marginRight: '1rem' }}>
              {ThemeIcon ? <ThemeIcon size={16} /> : <span style={{ display: 'inline-block', width: '16px', height: '16px' }} />} 
            </button>
            {user.isAuthenticated ? (
              <>
                {user.role === 'super_admin' && (
                  <Link href="/manage-users" className="meta-text" style={{ color: 'var(--text-main)' }}>
                    <Users size={16} /> Users
                  </Link>
                )}
                <Link href="/admin" className="meta-text" style={{ color: 'var(--text-main)' }}>
                  <Settings size={16} /> Dashboard
                </Link>
                <button onClick={() => { logout(); router.push('/'); }} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/contact" className="meta-text" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Contact Us
                </Link>
                <button onClick={() => setLoginModalOpen(true)} className="meta-text" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LogIn size={16} /> Admin
                </button>
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
          <div style={{ padding: '1rem', background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50 }}>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <button onClick={() => { toggleTheme(); setMobileMenuOpen(false); }} className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {ThemeIcon ? <ThemeIcon size={16} /> : <span style={{ display: 'inline-block', width: '16px', height: '16px' }} />} 
                {themeLabel}
              </button>
            </div>
             {user.isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {user.role === 'super_admin' && (
                  <Link href="/manage-users" className="meta-text" onClick={() => setMobileMenuOpen(false)}>
                    <Users size={16} /> Manage Users
                  </Link>
                )}
                <Link href="/admin" className="meta-text" onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={16} /> Dashboard
                </Link>
                <button onClick={() => { logout(); router.push('/'); setMobileMenuOpen(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/contact" className="meta-text" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      
      {/* Category Sub Navbar */}
      <nav className="category-nav">
        <div className="container category-list">
          <Link href="/" className={`cat-link ${!currentCategory ? 'active' : ''}`}>
            Latest
          </Link>
          {visibleCategories.map(category => (
            <Link 
              key={category} 
              href={categoryPath(category)} 
              className={`cat-link ${currentCategory === category ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {category}
            </Link>
          ))}
          {hiddenCategories.length > 0 && (
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setMoreDropdownOpen(true)}
              onMouseLeave={() => setMoreDropdownOpen(false)}
            >
              <button 
                className={`cat-link ${hiddenCategories.includes(currentCategory as any) ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', outline: 'none' }}
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              >
                More <ChevronDown size={14} />
              </button>
              
              {moreDropdownOpen && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    right: 0, 
                    background: 'var(--surface-color)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    minWidth: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.5rem 0'
                  }}
                >
                  {hiddenCategories.map(category => (
                    <Link 
                      key={category} 
                      href={categoryPath(category)} 
                      className="dropdown-item"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        color: currentCategory === category ? 'var(--accent-gold)' : 'var(--text-main)',
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      
      {/* Small hack for desktop actions visibility */}
      <style>{`
        @media (min-width: 768px) {
          #desktop-actions { display: flex !important; }
          #mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {loginModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', position: 'relative' }}>
            {/* Close Button */}
            <button 
              onClick={() => setLoginModalOpen(false)}
              style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-muted)', 
                cursor: 'pointer' 
              }}
              title="Close"
            >
              <XIcon size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Login</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Access the dashboard to manage news.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={loginLoading}
                  placeholder="editor@dailyupdates.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  disabled={loginLoading}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
