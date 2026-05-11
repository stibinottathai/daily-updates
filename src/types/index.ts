export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  author_id?: string;
  category: string;
  sub_category?: string | null;
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
  'News',
  'World',
  'India',
  'Business',
  'Technology',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
  'Politics',
  'Blog',
  'Travel',
  'Lifestyle',
  'Automotive',
  'Education',
  'Environment'
] as const;

export const NEWS_REGIONS = [
  'US & Canada',
  'UK',
  'Africa',
  'Asia',
  'Australia',
  'Europe',
  'Latin America',
  'Middle East',
] as const;

export const INDIA_REGIONS = [
  'Kerala',
  'Tamil Nadu',
  'Karnataka',
  'Mumbai',
  'Gujarat',
  'Kolkata',
  'Delhi',
] as const;

export const SPORTS_TYPES = [
  'Cricket',
  'Football',
  'Hockey',
  'Badminton',
  'Tennis',
  'Athletics',
  'Basketball',
  'WWE',
  'Formula 1',
] as const;

export type NewsRegion = typeof NEWS_REGIONS[number];
export type IndiaRegion = typeof INDIA_REGIONS[number];
export type SportsType = typeof SPORTS_TYPES[number];

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

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  topPages: Array<{
    path: string;
    visits: number;
  }>;
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
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Using manual UTC formatting to ensure perfect consistency between server and client
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}
