import type { Metadata } from 'next';
import { baseMetadata, SITE_NAME } from '../../lib/seo';

export const metadata: Metadata = baseMetadata({
  title: 'Editorial Team',
  description: `Meet the editorial team behind ${SITE_NAME}, our byline policy, and how we handle accountability.`,
  path: '/editorial-team',
});

const teamMembers = [
  {
    role: 'Editorial Desk',
    name: 'Daily Updates Editorial Desk',
    description: 'Coordinates coverage, verifies copy, and publishes the final newsroom version of each story when no individual byline is attached.',
  },
  {
    role: 'Writers and Reporters',
    name: 'Staff Contributors',
    description: 'Produce original reporting, source material, and timely updates with visible bylines on published stories.',
  },
  {
    role: 'Fact-Checking and Standards',
    name: 'Editorial Review',
    description: 'Checks names, dates, context, and source references before publication and during corrections.',
  },
  {
    role: 'Product and Site Operations',
    name: 'Publishing Support',
    description: 'Keeps the site fast, accessible, and stable so editorial work is easy to read and trust on any device.',
  },
];

const standards = [
  'Every article should have a visible byline or a clearly labeled editorial desk credit.',
  'Updates should be corrected openly when a factual issue is found.',
  'Opinion and analysis should not be presented as straight reporting.',
  'Primary and official sources are preferred whenever they are available.',
];

export default function EditorialTeamPage() {
  return (
    <div className="container" style={{ padding: '4rem 0 5rem' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="card-category">Editorial</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', marginTop: '1rem', marginBottom: '0.75rem' }}>
            Editorial Team
          </h1>
          <p style={{ margin: 0, maxWidth: '68ch', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Readers should know who is responsible for a story. This page explains how we attribute articles, how our
            team is structured, and what standards guide our newsroom.
          </p>
        </div>

        <div className="contact-page-card" style={{ display: 'grid', gap: '1.75rem' }}>
          <section>
            <h2 style={{ marginTop: 0 }}>Byline Policy</h2>
            <p style={{ marginTop: 0 }}>
              Published stories carry a named author whenever one is available. When a story is published by the news
              desk, the byline will state <strong>Daily Updates Editorial Desk</strong> so the ownership is still clear.
            </p>
          </section>

          <section>
            <h2 style={{ marginTop: 0 }}>Team Roles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {teamMembers.map(member => (
                <div key={member.role} style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{member.role}</h3>
                  <p style={{ margin: '0 0 0.65rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                    {member.name}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ marginTop: 0 }}>Editorial Standards</h2>
            <ul style={{ marginTop: 0, paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {standards.map(standard => (
                <li key={standard}>{standard}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ marginTop: 0 }}>Contact</h2>
            <p style={{ marginTop: 0 }}>
              Questions about authorship, corrections, or editorial policy can be sent to{' '}
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