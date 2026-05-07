"use client";

import { useState } from 'react';
import { MessageSquare, X as XIcon } from 'lucide-react';
import { useNews } from '../context/NewsContext';

export default function ContactUsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
}
