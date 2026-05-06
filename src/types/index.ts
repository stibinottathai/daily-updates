export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  category: string;
}

export const CATEGORIES = [
  'World',
  'Business',
  'Technology',
  'Science',
  'Health',
  'Sports',
  'Entertainment'
];

export interface User {
  id?: string;
  email: string;
  role?: 'super_admin' | 'admin' | 'sub_admin';
  isAuthenticated: boolean;
}
