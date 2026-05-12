import type { Metadata } from 'next';
import { baseMetadata, SITE_NAME } from '../../lib/seo';

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
          <p style={{ color: 'var(--text-muted)' }}>Last Updated: May 12, 2026</p>
        </div>

        <div className="contact-page-card" style={{ display: 'grid', gap: '1.5rem' }}>
          <section>
            <p style={{ marginTop: 0 }}>
              Welcome to {SITE_NAME}. By accessing and using this website, you agree to comply with and be bound by the
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
              of {SITE_NAME} unless otherwise stated.
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
              {SITE_NAME} and its owners shall not be held liable for any losses, damages, or issues arising from the use of
              this website.
            </p>
          </section>

          <section>
            <h2>Changes to Terms</h2>
            <p>
              We may update these Terms and Conditions from time to time.
            </p>
            <p>
              For material changes, we will provide at least 30 days' notice by posting the revised terms on this page and
              updating the Last Updated date above. Non-material changes may take effect when posted.
            </p>
          </section>

          <section>
            <h2>Version History</h2>
            <p>We keep a simple public record of meaningful Terms updates so readers can see what changed.</p>
            <ul>
              <li><strong>May 12, 2026:</strong> Added advance notice language for material changes and a version history section.</li>
            </ul>
          </section>

          <section>
            <h2>Governing Law and Jurisdiction</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of India.
            </p>
            <p>
              Any dispute arising out of or relating to these Terms or your use of this website will be subject to the
              exclusive jurisdiction of the competent courts in India, to the extent permitted by applicable law.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>If you have any questions regarding these Terms and Conditions, you may contact us at:</p>
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