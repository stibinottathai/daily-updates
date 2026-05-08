"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNews } from '../../context/NewsContext';
import { supabase } from '../../lib/supabase';
import { LogIn, X } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, addToast, refreshAuth } = useNews();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user.isAuthenticated) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      addToast(error.message, 'error');
    } else {
      await refreshAuth();
      addToast('Logged in successfully', 'success');
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
      padding: '2rem 0',
      background: 'radial-gradient(circle at top, rgba(232, 197, 71, 0.08), transparent 35%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 65%)',
    }}>
      <div className="animate-fade-in stagger-1" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '2.5rem', 
        background: 'rgba(18, 18, 18, 0.72)', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-md)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Accent top border */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-gold)' }}></div>
        
        {/* Close Button */}
        <button 
          onClick={() => router.push('/')}
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
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Access the dashboard to manage news.
          </p>
        </div>

        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="editor@dailyupdates.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem' }} disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
