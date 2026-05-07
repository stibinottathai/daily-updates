import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { NewsProvider } from '../context/NewsContext';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/ToastContainer';

export const metadata: Metadata = {
  title: 'Daily Updates - Premium News',
  description: 'A premium platform for your daily updates and news.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
