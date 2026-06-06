"use client";

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LogIn, LogOut, Settings, Users, Menu, X as XIcon, Moon, Sun, ChevronDown, Search, Plus } from 'lucide-react';
import { CATEGORIES } from '../types';
import { useNews } from '../context/NewsContext';
import { categoryFromSlug, categoryPath } from '../lib/seo';
import { supabase } from '../lib/supabase';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout, theme, toggleTheme, addToast, refreshAuth } = useNews();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathCategorySlug = pathname.startsWith('/category/') ? pathname.split('/')[2] : null;
  const currentCategory = pathCategorySlug
    ? categoryFromSlug(pathCategorySlug, CATEGORIES)
    : searchParams.get('category');
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(Boolean(searchParams.get('q')));
  const [searchDraft, setSearchDraft] = useState(searchParams.get('q') ?? '');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const searchQuery = searchParams.get('q') ?? '';
  const searchTimerRef = useRef<number | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close More dropdown on outside click (important for mobile)
  useEffect(() => {
    if (!moreDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      const clickedButton = moreButtonRef.current?.contains(e.target as Node);
      const clickedDropdown = dropdownRef.current?.contains(e.target as Node);
      if (!clickedButton && !clickedDropdown) {
        setMoreDropdownOpen(false);
      }
    };
    // Use mousedown/pointerdown but NOT touchstart — touchstart fires before click and kills navigation
    document.addEventListener('pointerdown', handler);
    return () => {
      document.removeEventListener('pointerdown', handler);
    };
  }, [moreDropdownOpen]);

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        addToast(error.message, 'error');
      } else {
        addToast('Sign up successful! You can now log in.', 'success');
        setIsSignUp(false);
      }
    } else {
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
    }
    setLoginLoading(false);
  };

  const visibleCategories = CATEGORIES.slice(0, 6);
  const hiddenCategories = CATEGORIES.slice(6);
  const themeLabel = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="masthead">
        <div className="container masthead-inner">
            <Link href="/" className="logo" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
              <Logo />
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
            {mounted ? (
              <button onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', marginRight: '1rem' }}>
                <ThemeIcon size={16} />
              </button>
            ) : (
              <button aria-label="Light Mode" title="Light Mode" className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', marginRight: '1rem' }}>
                <Sun size={16} />
              </button>
            )}
            {user.isAuthenticated ? (
              <>
                <Link href="/admin" className="btn btn-primary animate-fade-in" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={14} /> Write
                </Link>
                {user.role === 'super_admin' && (
                  <Link href="/manage-users" className="meta-text" style={{ color: 'var(--text-main)' }}>
                    <Users size={16} /> Creators
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
                <button onClick={() => { setIsSignUp(false); setLoginModalOpen(true); }} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LogIn size={14} /> Join / Sign In
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
              {mounted ? (
                <button onClick={() => { toggleTheme(); setMobileMenuOpen(false); }} aria-label={themeLabel} className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ThemeIcon size={16} />
                  {themeLabel}
                </button>
              ) : (
                <button aria-label="Light Mode" className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun size={16} />
                  Light Mode
                </button>
              )}
            </div>
             {user.isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/admin" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)} style={{ justifyContent: 'flex-start' }}>
                  <Plus size={14} /> Write Story
                </Link>
                {user.role === 'super_admin' && (
                  <Link href="/manage-users" className="meta-text" onClick={() => setMobileMenuOpen(false)}>
                    <Users size={16} /> Manage Creators
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
                <button onClick={() => { setIsSignUp(false); setLoginModalOpen(true); setMobileMenuOpen(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                  <LogIn size={14} /> Join / Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
      
      {/* Category Sub Navbar */}
      <nav className="category-nav">
        <div className="container category-list">
          <Link href="/" className={`cat-link ${!currentCategory ? 'active' : ''}`}>
            Home
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
              onMouseEnter={() => {
                if (window.innerWidth >= 768) {
                  if (dropdownTimeoutRef.current) {
                    clearTimeout(dropdownTimeoutRef.current);
                    dropdownTimeoutRef.current = null;
                  }
                  setMoreDropdownOpen(true);
                  if (moreButtonRef.current) {
                    const r = moreButtonRef.current.getBoundingClientRect();
                    setDropdownPos({ top: r.bottom, left: r.left });
                  }
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= 768) {
                  dropdownTimeoutRef.current = setTimeout(() => {
                    setMoreDropdownOpen(false);
                  }, 500); // Increased to 500ms for stability
                }
              }}
            >
              <button
                ref={moreButtonRef}
                className={`cat-link ${hiddenCategories.includes(currentCategory as any) ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', outline: 'none' }}
                onClick={() => {
                  const next = !moreDropdownOpen;
                  setMoreDropdownOpen(next);
                  if (next && moreButtonRef.current) {
                    const r = moreButtonRef.current.getBoundingClientRect();
                    setDropdownPos({ top: r.bottom, left: r.left });
                  }
                }}
              >
                More <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: moreDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              
              {moreDropdownOpen && dropdownPos && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'fixed',
                    top: dropdownPos.top,
                    left: Math.min(dropdownPos.left, window.innerWidth - 240),
                    zIndex: 9999,
                    minWidth: '220px',
                    paddingTop: '8px', // Acts as a bridge between button and menu
                    marginTop: '-4px' // Overlap slightly to ensure no gap
                  }}
                  onMouseEnter={() => {
                    if (dropdownTimeoutRef.current) {
                      clearTimeout(dropdownTimeoutRef.current);
                      dropdownTimeoutRef.current = null;
                    }
                  }}
                  onMouseLeave={() => {
                    if (window.innerWidth >= 768) {
                      dropdownTimeoutRef.current = setTimeout(() => {
                        setMoreDropdownOpen(false);
                      }, 500);
                    }
                  }}
                >
                <div style={{ 
                    zIndex: 9999,
                    backgroundColor: 'rgba(21, 23, 34, 0.75)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
                    borderRadius: 'var(--radius-md)',
                    minWidth: '200px',
                    padding: '0.5rem 0',
                    border: '1px solid var(--border-color)',
                    animation: 'fadeInUp 0.2s ease-out'
                  }}
                >
                  {/* Header */}
                  <div style={{ padding: '0.75rem 1.25rem 0.6rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '3px', height: '14px', background: 'var(--accent-gold)', borderRadius: '2px', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>More Categories</span>
                  </div>
                  {/* Items */}
                  <div style={{ padding: '0.5rem 0.5rem' }}>
                    {hiddenCategories.map(category => (
                      <Link 
                        key={category} 
                        href={categoryPath(category)} 
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 0.85rem', 
                          color: currentCategory === category ? 'var(--accent-gold)' : 'var(--text-main)',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: currentCategory === category ? 700 : 500,
                          borderRadius: '8px',
                          transition: 'background 0.15s, color 0.15s',
                          background: currentCategory === category ? 'rgba(232,197,71,0.08)' : 'transparent',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = currentCategory === category ? 'rgba(232,197,71,0.08)' : 'transparent'; (e.currentTarget as HTMLElement).style.color = currentCategory === category ? 'var(--accent-gold)' : 'var(--text-main)'; }}
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentCategory === category ? 'var(--accent-gold)' : 'var(--text-muted)', flexShrink: 0 }} />
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
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

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{isSignUp ? 'Join InkFlow' : 'Sign In'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {isSignUp ? 'Create an account to start sharing your stories.' : 'Welcome back! Access your writer panel.'}
              </p>
            </div>

            <form onSubmit={handleAuth}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={loginLoading}
                  placeholder="writer@inkflow.com"
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
                {loginLoading ? (isSignUp ? 'Joining...' : 'Signing in...') : (isSignUp ? 'Join Now' : 'Sign In')}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isSignUp ? 'Already have an account?' : 'Want to start writing?'}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up / Join'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
