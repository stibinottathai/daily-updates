import type { Metadata } from 'next';
import { baseMetadata, SITE_NAME } from '../../lib/seo';

export const metadata: Metadata = baseMetadata({
  title: 'Editorial Team',
  description: `Meet the editorial team behind ${SITE_NAME}, our byline policy, and how we handle accountability.`,
  path: '/editorial-team',
});

const communityRoles = [
  {
    role: 'Writers & Creators',
    name: 'Open Contributor Policy',
    description: 'Any registered user on InkFlow can write and publish articles directly to the feed, keeping ownership of their words and creative direction.',
  },
  {
    role: 'Editor Review',
    name: 'Community Guidelines Desk',
    description: 'Reviews reported content to ensure all publications adhere to standard community rules on originality, harassment, and transparency.',
  },
  {
    role: 'Publishing Support',
    name: 'Operations Team',
    description: 'Keeps the underlying platform stable, fast, and accessible across all devices so your ideas are presented cleanly.',
  },
];

const guidelines = [
  'Share original insights, tutorials, or perspectives that add value to readers.',
  'Format your articles cleanly using headers, bullet lists, and standard inline styling.',
  'Always cite original sources and give proper credits for images or research facts.',
  'Write under your own name or transparent pseudonyms; transparent bylines build trust.',
];

export default function EditorialTeamPage() {
  return (
    <div className="container" style={{ padding: '4rem 0 5rem' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="card-category">Community</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', marginTop: '1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            Writing Guidelines
          </h1>
          <p style={{ margin: 0, maxWidth: '68ch', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            InkFlow is a creator-first platform. We want to make sure everyone writes with clarity, respects readers, and builds trust through transparency.
          </p>
        </div>

        <div className="contact-page-card" style={{ display: 'grid', gap: '1.75rem' }}>
          <section>
            <h2 style={{ marginTop: 0, fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Ownership & Bylines</h2>
            <p style={{ marginTop: 0 }}>
              All articles carry the direct name of their author. As a writer, you hold the copyright to your story. Bylines should state your actual name or professional handle to establish ownership and transparency.
            </p>
          </section>

          <section>
            <h2 style={{ marginTop: 0, fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Community Guidelines</h2>
            <ul style={{ marginTop: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {guidelines.map((guideline, i) => (
                <li key={i}>{guideline}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ marginTop: 0, fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Platform Structure</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {communityRoles.map(role => (
                <div key={role.role} style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{role.role}</h3>
                  <p style={{ margin: '0 0 0.65rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                    {role.name}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ marginTop: 0, fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Support & Reports</h2>
            <p style={{ marginTop: 0 }}>
              If you have questions about copyright, need to report plagiarism, or require assistance with your writer account, contact{' '}
              <a href="mailto:dailyupdatesnewss@gmail.com" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>
                dailyupdatesnewss@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}