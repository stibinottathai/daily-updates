import type { Metadata } from 'next';
import { baseMetadata, SITE_NAME } from '../../lib/seo';

export const metadata: Metadata = baseMetadata({
  title: 'About',
  description: `Learn about ${SITE_NAME}, the team behind it, and the editorial standards we follow.`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '4rem 0 5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="card-category">About</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', marginTop: '1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            About {SITE_NAME}
          </h1>
          <p style={{ margin: 0, maxWidth: '68ch', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            InkFlow is a modern article writing and sharing platform designed to connect creative minds, independent thinkers, and passionate writers.
          </p>
        </div>

        <div className="contact-page-card" style={{ display: 'grid', gap: '1.75rem' }}>
          <section>
            <h2 style={{ marginTop: 0, fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Our Vision</h2>
            <p style={{ marginTop: 0 }}>
              At InkFlow, we believe that writing and reading deep, meaningful stories should be beautiful, clean, and accessible. In a world full of quick summaries and endless notifications, we created a space dedicated to depth, clarity, and thoughtful insight.
            </p>
            <p>
              Writers of all kinds use InkFlow to share their perspective across various themes, including:
            </p>
            <ul>
              <li>Technology & Software Design</li>
              <li>Business, Startups & Leadership</li>
              <li>Productivity & Self-Growth</li>
              <li>Science & Innovation</li>
              <li>Creative Writing, Design & Lifestyle</li>
            </ul>
            <p>
              Anyone can join, start drafting, and publish their articles with our clean, markdown-friendly writer portal.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700 }}>The Community</h2>
            <p style={{ marginTop: 0 }}>
              InkFlow is powered by its writers, editors, and readers. Unlike traditional news desks with rigid structures, we support an open contributor system where anyone can create a profile and start publishing articles.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Writers & Creators</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Independent authors drafting, polishing, and sharing original perspectives directly with their audience.
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Community Readers</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Finding high-quality pieces, bookmarking articles to read later, and engaging with creative works.
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Site Support</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Keeping the platform fast, stable, and highly responsive so writers can focus entirely on words.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Our Publishing Values</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Value Originality</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  We encourage original stories, detailed guides, and insights built on primary experiences.
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Clean Design</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Our reader layout focuses solely on the story, avoiding pop-up ads and clutter.
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Writer Ownership</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Writers keep total control over their drafts, edit histories, and are credited on bylines.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Contact & Support</h2>
            <p style={{ marginTop: 0 }}>
              Questions about writing guidelines, platform features, or reports can be sent to:
            </p>
            <ul>
              <li>Email: dailyupdatesnewss@gmail.com</li>
              <li>Website: https://www.dailyupdatesnews.online</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}