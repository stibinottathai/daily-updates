import type { Metadata } from 'next';
import { baseMetadata } from '../../lib/seo';

export const metadata: Metadata = baseMetadata({
  title: 'Terms',
  description: 'Read the Daily Updates terms of use.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: '4rem 0 5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="card-category">Legal</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', marginTop: '1rem', marginBottom: '0.75rem' }}>Terms and Conditions</h1>
          <p style={{ color: 'var(--text-muted)' }}>Last Updated: May 8, 2026</p>
        </div>

        <div className="contact-page-card" style={{ display: 'grid', gap: '1.5rem' }}>
          <section>
            <p style={{ marginTop: 0 }}>
              Welcome to [Your Website Name]. By accessing and using this website, you agree to comply with and be bound by the
              following Terms and Conditions.
            </p>
            <p>If you do not agree with any part of these terms, please do not use our website.</p>
          </section>

          <section>
            <h2>Use of Website</h2>
            <p>The content provided on this website is for general informational purposes only.</p>
            <p>You agree to use this website lawfully and in a way that does not:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Harm the website or its users</li>
              <li>Attempt unauthorized access to website systems</li>
              <li>Disrupt website functionality</li>
            </ul>
          </section>

          <section>
            <h2>Intellectual Property</h2>
            <p>
              All content published on this website, including articles, text, logos, graphics, and design elements, is the property
              of [Your Website Name] unless otherwise stated.
            </p>
            <p>
              Unauthorized copying, reproduction, or redistribution of website content is prohibited without permission.
            </p>
          </section>

          <section>
            <h2>Content Accuracy</h2>
            <p>
              We strive to provide accurate and up-to-date information. However, we do not guarantee the completeness, reliability,
              or accuracy of any content published on this website.
            </p>
            <p>Any action you take based on the information found on this website is strictly at your own risk.</p>
          </section>

          <section>
            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites for additional information or services.
            </p>
            <p>We are not responsible for the content, privacy policies, or practices of any external websites.</p>
          </section>

          <section>
            <h2>Advertisements</h2>
            <p>
              This website may display advertisements provided by third-party advertising networks, including Google AdSense.
            </p>
            <p>
              We are not responsible for the products, services, or content promoted through third-party advertisements.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              [Your Website Name] and its owners shall not be held liable for any losses, damages, or issues arising from the use of
              this website.
            </p>
          </section>

          <section>
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify or update these Terms and Conditions at any time without prior notice.
            </p>
            <p>Any changes will be effective immediately upon posting on this page.</p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>If you have any questions regarding these Terms and Conditions, you may contact us at:</p>
            <ul>
              <li>Email: [your-email@example.com]</li>
              <li>Website: [your website URL]</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}