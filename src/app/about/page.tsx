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
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', marginTop: '1rem', marginBottom: '0.75rem' }}>
            About {SITE_NAME}
          </h1>
          <p style={{ margin: 0, maxWidth: '68ch', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            We built {SITE_NAME} to make it easier to follow the stories that matter, understand where they came from,
            and trust how they were put together.
          </p>
        </div>

        <div className="contact-page-card" style={{ display: 'grid', gap: '1.75rem' }}>
          <section>
            <h2 style={{ marginTop: 0 }}>Our Story</h2>
            <p style={{ marginTop: 0 }}>
              {SITE_NAME} began as a simple idea: local readers deserve a fast, readable news source that still feels
              careful and accountable. The site grew around the need for a daily update stream that could cover both
              breaking headlines and useful context without overwhelming people.
            </p>
            <p>
              Today, we focus on a practical mix of news, explainers, and updates across topics including:
            </p>
            <ul>
              <li>Technology</li>
              <li>Business</li>
              <li>Entertainment</li>
              <li>Sports</li>
              <li>World News</li>
              <li>Lifestyle</li>
              <li>Kerala and Local Updates</li>
            </ul>
            <p>
              The goal is straightforward: publish news that is useful, readable, and easy to verify.
            </p>
          </section>

          <section>
            <h2>Team</h2>
            <p style={{ marginTop: 0 }}>
              {SITE_NAME} is run by a small editorial team that combines reporting, editing, and technical maintenance.
              That keeps decisions close to the content and makes corrections easier to move quickly.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Editorial Desk</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Plans coverage, checks framing, and makes sure stories stay clear and useful.
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Writers and Reporters</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Gather information from primary sources, draft updates, and add context where it helps readers.
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Product and Site Ops</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Keeps the site fast, stable, and accessible across devices so the journalism stays easy to read.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>Editorial Standards</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Verify first</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  We prefer primary sources, official statements, and direct evidence before publication.
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Correct openly</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  If something is wrong, we update it quickly and make the correction clear in the story.
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Avoid noise</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Headlines should be accurate, not exaggerated. We avoid filler and keep language plain.
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Separate news from opinion</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Reporting stays factual, and any analysis or commentary is clearly framed as such.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>Contact</h2>
            <p style={{ marginTop: 0 }}>
              Questions, corrections, or collaboration requests can be sent to:
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