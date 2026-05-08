import type { Metadata } from 'next';
import { baseMetadata } from '../../lib/seo';
import ContactPageClient from '../../components/ContactPageClient';

export const metadata: Metadata = baseMetadata({
  title: 'Contact Us',
  description: 'Reach out to the Daily Updates team.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactPageClient />;
}