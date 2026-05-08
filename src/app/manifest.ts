import type { MetadataRoute } from 'next';
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '../lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#101114',
    theme_color: '#101114',
    icons: [
      {
        src: '/favicon.svg',
        sizes: '64x64',
        type: 'image/svg+xml',
      },
    ],
  };
}
