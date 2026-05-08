"use client";

import { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useNews } from '../context/NewsContext';

export default function ContactPageClient() {
  const { submitContactMessage } = useNews();
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (wordCount > 100) {
      return;
    }

    setLoading(true);
    const success = await submitContactMessage(email, content);
    setLoading(false);

    if (success) {
      setEmail('');
      setContent('');
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0 5rem' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="card-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={14} /> Get in touch
          </span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', marginTop: '1rem', marginBottom: '1rem' }}>
            Contact Us
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '760px', fontSize: '1.05rem' }}>
            Send feedback, story tips, corrections, or partnership requests. We read every message and aim to reply as soon as possible.
          </p>
        </div>

        <div className="contact-page-grid">
          <section className="contact-page-card">
            <h2 style={{ marginBottom: '1rem' }}>Send a message</h2>
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
                  <span style={{ color: wordCount > 100 ? 'var(--danger)' : 'var(--text-muted)' }}>
                    {wordCount} / 100 words
                  </span>
                </label>
                <textarea
                  className="form-input"
                  rows={7}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  placeholder="Tell us what you need..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || wordCount > 100 || wordCount === 0}
                style={{ width: '100%' }}
              >
                {loading ? 'Sending...' : <><Send size={14} /> Send Message</>}
              </button>
            </form>
          </section>

          <aside className="contact-page-card contact-page-side">
            <h2 style={{ marginBottom: '1rem' }}>Other ways to connect</h2>
            <div className="contact-info-item">
              <Mail size={18} />
              <div>
                <strong>Email</strong>
                <p>Use the form to send a direct message.</p>
              </div>
            </div>
            <div className="contact-info-item">
              <MessageSquare size={18} />
              <div>
                <strong>Feedback</strong>
                <p>Send corrections, suggestions, or editorial notes.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}