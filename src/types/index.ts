export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  author_id?: string;
  category: string;
  created_at: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  email: string;
  content: string;
  created_at: string;
}

export const CATEGORIES = [
  'World',
  'Business',
  'Technology',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
  'Politics',
  'Travel',
  'Lifestyle',
  'Automotive',
  'Education',
  'Environment'
] as const;

export type Category = typeof CATEGORIES[number];

export interface User {
  id?: string;
  email: string;
  role?: 'super_admin' | 'admin' | 'sub_admin';
  isAuthenticated: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

/** Estimate reading time in minutes from article content */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/** Format a date string to a readable format */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
