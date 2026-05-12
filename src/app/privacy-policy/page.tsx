import type { Metadata } from 'next';
import { baseMetadata, SITE_NAME } from '../../lib/seo';

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
          <p style={{ color: 'var(--text-muted)' }}>Last Updated: May 12, 2026</p>
        </div>

        <div className="contact-page-card" style={{ display: 'grid', gap: '1.5rem' }}>
          <section>
            <p style={{ marginTop: 0 }}>
              Welcome to {SITE_NAME}. Your privacy is important to us. This Privacy Policy explains how we collect,
              use, and protect your information when you visit our website.
            </p>
            <p>
              By using our website, you agree to the terms outlined in this Privacy Policy. Where required by law, we ask
              for your consent before loading non-essential cookies or advertising technologies.
            </p>
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
            <h2>Data Retention</h2>
            <p>
              We keep personal data only for as long as we need it for the purposes described in this policy, unless a
              longer retention period is required by law, dispute resolution, or security needs.
            </p>

            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>Data</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Retention period</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>IP address, browser type, device info, page visits, and referral sources</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Up to 30 days in server or security logs, then deleted or anonymized.</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Used for security, abuse prevention, and basic diagnostics.</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>Visitor analytics records</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Until they are deleted or anonymized by us, typically reviewed on an ongoing basis.</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Includes page path, visitor ID, and user agent data used for reporting.</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>Contact form messages and email address</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Until we no longer need the message, or until it is deleted by an administrator; generally up to 24 months.</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Kept to respond to enquiries and maintain records of support requests.</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>Theme, bookmarks, cookie consent, and popup frequency storage</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Until you clear browser storage or change the setting.</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Stored locally on your device.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 0.5rem 0.75rem 0' }}>Google AdSense cookies</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>Varies by cookie and Google settings.</td>
                    <td style={{ padding: '0.75rem 0 0.75rem 0.5rem' }}>Controlled by Google; see Google’s privacy and cookie documentation.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Cookies and Similar Technologies</h2>
            <p>
              Our website uses cookies and similar technologies, including browser storage such as localStorage, to keep the
              site functional, remember preferences, support analytics, and display advertising after consent where required.
            </p>
            <p>
              Some of these items are essential for the site to work. Others are non-essential and are only used after you
              accept them through the cookie banner.
            </p>

            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>Name</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Provider</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Purpose</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Retention</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>theme</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Daily Updates</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Remembers your light/dark mode preference.</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Until you clear browser storage.</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>bookmarks</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Daily Updates</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Stores saved articles on your device.</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Until you clear browser storage.</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>daily_updates_cookie_consent</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Daily Updates</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Stores your cookie consent choice.</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Until you change or clear your preference.</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>daily_updates_visitor_id</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Daily Updates</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Helps count unique visitors in site analytics.</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Until you clear browser storage.</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem 0.75rem 0' }}>daily_updates_popup_ad_last_shown</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Daily Updates</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0.5rem' }}>Prevents the popup ad from showing too often.</td>
                    <td style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0 0.75rem 0.5rem' }}>Until you clear browser storage.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 0.5rem 0.75rem 0' }}>Google AdSense cookies</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>Google</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>Delivers, measures, personalizes, and secures advertising.</td>
                    <td style={{ padding: '0.75rem 0 0.75rem 0.5rem' }}>Varies by cookie and Google settings; controlled by Google.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1rem' }}>
              You can disable or remove cookies and browser storage through your browser settings, and you can change your
              non-essential cookie choice at any time using the Cookie Preferences link in the footer.
            </p>
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
            <h2>Cookie Preferences and Consent</h2>
            <p>
              We show a cookie preference banner for visitors in jurisdictions where consent is required, including the EU
              and California. Essential cookies remain in use to keep the site functional, but Google AdSense, visitor
              analytics, and similar non-essential tools are only activated after you choose to accept them.
            </p>
            <p>
              You can change your choice at any time using the Cookie Preferences link in the footer. If you reject
              non-essential cookies, those services will stay disabled unless you later change your preference.
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
            <h2>Governing Law and Jurisdiction</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of India.
            </p>
            <p>
              Any dispute arising out of or relating to this Privacy Policy will be subject to the exclusive jurisdiction
              of the competent courts in India, to the extent permitted by applicable law.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>If you have any questions or concerns regarding this Privacy Policy, you may contact us at:</p>
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