import type { Metadata } from 'next';
import { baseMetadata } from '../../lib/seo';

export const metadata: Metadata = baseMetadata({
  title: 'Privacy Policy',
  description: 'Read the Daily Updates privacy policy.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ padding: '4rem 0 5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="card-category">Legal</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', marginTop: '1rem', marginBottom: '0.75rem' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text-muted)' }}>Last Updated: May 8, 2026</p>
        </div>

        <div className="contact-page-card" style={{ display: 'grid', gap: '1.5rem' }}>
          <section>
            <p style={{ marginTop: 0 }}>
              Welcome to [Your Website Name]. Your privacy is important to us. This Privacy Policy explains how we collect,
              use, and protect your information when you visit our website.
            </p>
            <p>By using our website, you agree to the terms outlined in this Privacy Policy.</p>
          </section>

          <section>
            <h2>Information We Collect</h2>
            <p>When you visit our website, we may collect certain information automatically, including:</p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited</li>
              <li>Date and time of visits</li>
              <li>Referral sources</li>
            </ul>
            <p>If you contact us directly, we may also collect information such as your name and email address.</p>
          </section>

          <section>
            <h2>Cookies and Web Technologies</h2>
            <p>Our website uses cookies and similar technologies to:</p>
            <ul>
              <li>Improve website performance</li>
              <li>Analyze traffic and user behavior</li>
              <li>Personalize user experience</li>
              <li>Display relevant advertisements</li>
            </ul>
            <p>You can disable cookies through your browser settings if you prefer.</p>
          </section>

          <section>
            <h2>Google AdSense and Advertising</h2>
            <p>
              We may use Google AdSense and other third-party advertising services to display advertisements on our website.
            </p>
            <p>
              Google and its partners may use cookies to serve ads based on users’ previous visits to this website or other websites.
            </p>
            <p>
              Google’s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and
              other websites on the internet.
            </p>
            <p>
              Users may opt out of personalized advertising by visiting: Google Ads Settings.
            </p>
            <p>
              For more information about how Google uses data, visit: Google Privacy & Terms.
            </p>
          </section>

          <section>
            <h2>Third-Party Services</h2>
            <p>
              We may use third-party services including analytics providers, advertising partners, and embedded content providers.
            </p>
            <p>These third-party services may collect information according to their own privacy policies.</p>
          </section>

          <section>
            <h2>External Links</h2>
            <p>
              Our website may contain links to external websites. We are not responsible for the privacy practices or content of
              third-party websites.
            </p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>
              We take reasonable security measures to protect user information from unauthorized access, misuse, or disclosure.
            </p>
            <p>However, no method of transmission over the internet is completely secure.</p>
          </section>

          <section>
            <h2>Children’s Privacy</h2>
            <p>
              Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any updates will be posted on this page with the revised date.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>If you have any questions or concerns regarding this Privacy Policy, you may contact us at:</p>
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