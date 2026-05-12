import type { Metadata } from 'next';
import { baseMetadata, SITE_NAME } from '../../lib/seo';

export const metadata: Metadata = baseMetadata({
  title: 'About this page',
  description: `Learn more about ${SITE_NAME} and how this site is structured.`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '4rem 0 5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="card-category">About</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', marginTop: '1rem', marginBottom: '0.75rem' }}>About this page</h1>
        </div>

        <div className="contact-page-card" style={{ display: 'grid', gap: '1.5rem' }}>
          <section>
            <p style={{ marginTop: 0 }}>
              Welcome to {SITE_NAME}, your trusted destination for the latest news, trending stories, and informative
              updates from around the world.
            </p>
            <p>
              Our mission is to deliver accurate, timely, and easy-to-understand news content covering a wide range of topics
              including:
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
              At {SITE_NAME}, we believe that information should be accessible, reliable, and engaging. Our goal is to
              keep readers informed with quality content and a smooth reading experience across all devices.
            </p>
          </section>

          <section>
            <h2>We are committed to:</h2>
            <ul>
              <li>Publishing informative and trustworthy content</li>
              <li>Covering trending and important topics</li>
              <li>Maintaining a user-friendly experience</li>
              <li>Continuously improving our platform</li>
            </ul>
            <p>
              Whether you are looking for breaking news, technology updates, or trending stories, we aim to provide content that
              keeps you connected and informed.
            </p>
            <p>
              Thank you for visiting {SITE_NAME} and being part of our growing community.
            </p>
          </section>

          <section>
            <h2>Our Editorial Team</h2>
            <p>
              {SITE_NAME} is powered by a dedicated team of journalists and content creators who are passionate about
              reporting the news that matters. Our team includes experienced staff writers and subject matter experts
              committed to the highest standards of journalistic integrity.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-gold)', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800 }}>DU</div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Editorial Desk</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily News Operations</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-gold)', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800 }}>ST</div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Staff Writers</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Global Correspondents</p>
              </div>
            </div>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>If you have any questions, suggestions, or business inquiries, feel free to contact us:</p>
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