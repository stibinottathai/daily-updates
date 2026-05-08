import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { NewsProvider } from '../context/NewsContext';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/ToastContainer';
import VisitorTracker from '../components/VisitorTracker';
import { baseMetadata, categoryPath, DEFAULT_DESCRIPTION, defaultOgImage, SITE_NAME, SITE_TAGLINE, siteUrl } from '../lib/seo';
import { CATEGORIES } from '../types';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  keywords: [
    'daily news',
    'world news',
    'business news',
    'technology news',
    'health news',
    'sports news',
    'latest headlines',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
    },
  },
  ...baseMetadata({
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    image: defaultOgImage,
  }),
  title: {
    default: `${SITE_NAME} - ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <NewsProvider>
          <React.Suspense fallback={<div style={{ height: '60px' }}>Loading...</div>}>
            <Navbar />
          </React.Suspense>
          <React.Suspense fallback={null}>
            <VisitorTracker />
          </React.Suspense>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'Organization',
                    '@id': `${siteUrl}/#organization`,
                    name: SITE_NAME,
                    url: siteUrl,
                    logo: `${siteUrl}/favicon.svg`,
                  },
                  {
                    '@type': 'WebSite',
                    '@id': `${siteUrl}/#website`,
                    url: siteUrl,
                    name: SITE_NAME,
                    description: DEFAULT_DESCRIPTION,
                    publisher: {
                      '@id': `${siteUrl}/#organization`,
                    },
                    potentialAction: {
                      '@type': 'SearchAction',
                      target: `${siteUrl}/?q={search_term_string}`,
                      'query-input': 'required name=search_term_string',
                    },
                  },
                ],
              }),
            }}
          />
          <main className="container" style={{ minHeight: '80vh' }}>
            {children}
          </main>
          <footer className="site-footer">
            <div className="container footer-grid">
              <div className="footer-brand">
                <a href="/" className="logo">
                  <span>Daily Updates</span>
                  <span className="logo-accent">Premium News</span>
                </a>
                <p>
                  Timely world, business, technology, health and sports coverage curated for readers who want the essential story fast.
                </p>
              </div>

              <div className="footer-column">
                <h3>Sections</h3>
                <div className="footer-links">
                  {CATEGORIES.slice(0, 6).map(category => (
                    <a key={category} href={categoryPath(category)}>{category}</a>
                  ))}
                </div>
              </div>

              <div className="footer-column">
                <h3>More News</h3>
                <div className="footer-links">
                  {CATEGORIES.slice(6, 12).map(category => (
                    <a key={category} href={categoryPath(category)}>{category}</a>
                  ))}
                </div>
              </div>

              <div className="footer-column">
                <h3>Company</h3>
                <div className="footer-links">
                  <a href="/">Latest Stories</a>
                  <a href="/category/world">World Desk</a>
                  <a href="/category/business">Business Desk</a>
                  <a href="/login">Admin Login</a>
                </div>
              </div>
            </div>

            <div className="container footer-bottom">
              <p>Copyright {new Date().getFullYear()} Daily Updates. All rights reserved.</p>
              <div>
                <a href="/robots.txt">Robots</a>
                <a href="/sitemap.xml">Sitemap</a>
              </div>
            </div>
          </footer>
          <ToastContainer />
        </NewsProvider>
      </body>
    </html>
  );
}
