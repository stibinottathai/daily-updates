import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { NewsProvider } from '../context/NewsContext';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/ToastContainer';
import VisitorTracker from '../components/VisitorTracker';
import PopupAd from '../components/PopupAd';
import Logo from '../components/Logo';
import { CookieConsentProvider, CookiePreferencesButton } from '../components/CookieConsent';
import { baseMetadata, categoryPath, DEFAULT_DESCRIPTION, defaultOgImage, SITE_NAME, SITE_TAGLINE } from '../lib/seo';
import { CATEGORIES } from '../types';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dailyupdatesnews.online'),
  applicationName: SITE_NAME,
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
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
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
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dailyupdatesnews.online').replace(/\/$/, '');
  const themeInitScript = `
    (() => {
      try {
        let savedTheme = null;
        try {
          savedTheme = localStorage.getItem('theme');
        } catch (error) {}
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
          ? savedTheme
          : (systemPrefersLight ? 'light' : 'dark');

        document.documentElement.setAttribute('data-theme', initialTheme);
        document.documentElement.style.colorScheme = initialTheme;
      } catch (error) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme init must run before first paint to prevent flash-of-wrong-theme */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <NewsProvider>
          <CookieConsentProvider>
            <React.Suspense fallback={<div style={{ height: '60px' }}>Loading...</div>}>
              <Navbar />
            </React.Suspense>
            <React.Suspense fallback={null}>
              <VisitorTracker />
            </React.Suspense>
            <PopupAd />
            <Script
              id="json-ld-site"
              type="application/ld+json"
              strategy="beforeInteractive"
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
                    <a href="/">
                      <Logo />
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
                    {CATEGORIES.slice(6).map(category => (
                      <a key={category} href={categoryPath(category)}>{category}</a>
                    ))}
                  </div>
                </div>

                <div className="footer-column">
                  <h3>Company</h3>
                  <div className="footer-links">
                    <a href="/about">About this page</a>
                    <a href="/contact">Contact Us</a>
                    <a href="/privacy-policy">Privacy Policy</a>
                    <CookiePreferencesButton />
                    <a href="/terms">Terms</a>
                  </div>
                </div>
              </div>

              <div className="container footer-bottom">
                <p suppressHydrationWarning>Copyright {new Date().getFullYear()} Daily Updates. All rights reserved.</p>
                <div>
                  <a href="/robots.txt">Robots</a>
                  <a href="/sitemap.xml">Sitemap</a>
                </div>
              </div>
            </footer>
            <ToastContainer />
          </CookieConsentProvider>
        </NewsProvider>
      </body>
    </html>
  );
}
