import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { NewsProvider } from '../context/NewsContext';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/ToastContainer';
import { baseMetadata, DEFAULT_DESCRIPTION, defaultOgImage, SITE_NAME, SITE_TAGLINE, siteUrl } from '../lib/seo';

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
          <main className="container" style={{ minHeight: '80vh' }}>
            {children}
          </main>
          <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p className="meta-text" style={{ justifyContent: 'center' }}>© {new Date().getFullYear()} Daily Updates. All rights reserved.</p>
          </footer>
          <ToastContainer />
        </NewsProvider>
      </body>
    </html>
  );
}
