"use client";

import { useNews } from '../context/NewsContext';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ className, style }: LogoProps) {
  const { theme } = useNews();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to logo-dark if not mounted (since background is usually dark/masthead color)
  // or use logo.png as default.
  // The user says logo-dark.png is for dark mode.
  const logoSrc = mounted && theme === 'light' ? '/logo.png' : '/logo-dark.png';

  return (
    <img 
      src={logoSrc} 
      alt="Daily Updates Logo" 
      className={className}
      style={{ 
        height: '45px', 
        width: '160px', 
        objectFit: 'contain',
        objectPosition: 'left center',
        ...style 
      }} 
    />
  );
}
