"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LogIn, LogOut, Settings, Users, Menu, X as XIcon, MessageSquare, Moon, Sun, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../types';
import { useNews } from '../context/NewsContext';
import ContactUsModal from './ContactUsModal';

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useNews();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setContactModalOpen(false);
  }, [pathname]);

  const visibleCategories = CATEGORIES.slice(0, 9);
  const hiddenCategories = CATEGORIES.slice(9);
  const themeLabel = mounted ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Theme';
  const ThemeIcon = mounted ? (theme === 'dark' ? Sun : Moon) : null;

  return (
    <>
      <nav className="masthead">
        <div className="container masthead-inner">
          <Link href="/" className="logo">
            <span>Daily Updates</span>
            <span className="logo-accent">Premium News</span>
          </Link>
          
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
                <button onClick={() => setContactModalOpen(true)} className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={16} /> Contact Us
                </button>
                <Link href="/login" className="meta-text" style={{ color: 'var(--text-muted)' }}>
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
                <button onClick={() => { setContactModalOpen(true); setMobileMenuOpen(false); }} className="meta-text" style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={16} /> Contact Us
                </button>
                <Link href="/login" className="meta-text" onClick={() => setMobileMenuOpen(false)}>
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
          <Link href="/" className={`cat-link ${!currentCategory ? 'active' : ''}`}>
            Latest
          </Link>
          {visibleCategories.map(category => (
            <Link 
              key={category} 
              href={`/?category=${category}`} 
              className={`cat-link ${currentCategory === category ? 'active' : ''}`}
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
                      href={`/?category=${category}`} 
                      className="dropdown-item"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        color: currentCategory === category ? 'var(--accent-gold)' : 'var(--text-main)',
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => setMoreDropdownOpen(false)}
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
    </>
  );
}
