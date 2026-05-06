import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { NewsArticle, User } from '../types';

interface NewsContextType {
  articles: NewsArticle[];
  user: User;
  addArticle: (article: Omit<NewsArticle, 'id' | 'date'>) => void;
  deleteArticle: (id: string) => void;
  updateArticle: (id: string, article: Partial<NewsArticle>) => void;
  login: (username: string) => void;
  logout: () => void;
}

const initialArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    excerpt: 'Exploring the latest trends in React, edge computing, and serverless architectures.',
    content: 'Full article content here...',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    author: 'Jane Doe',
    date: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Sustainable Technology Innovations',
    excerpt: 'How tech companies are shifting towards green energy and reducing their carbon footprint.',
    content: 'Full article content here...',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',
    author: 'John Smith',
    date: new Date().toISOString()
  }
];

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [user, setUser] = useState<User>({ username: '', isAuthenticated: false });

  const addArticle = (article: Omit<NewsArticle, 'id' | 'date'>) => {
    const newArticle = {
      ...article,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setArticles([newArticle, ...articles]);
  };

  const deleteArticle = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  const updateArticle = (id: string, updatedFields: Partial<NewsArticle>) => {
    setArticles(articles.map(a => a.id === id ? { ...a, ...updatedFields } : a));
  };

  const login = (username: string) => {
    setUser({ username, isAuthenticated: true });
  };

  const logout = () => {
    setUser({ username: '', isAuthenticated: false });
  };

  return (
    <NewsContext.Provider value={{ articles, user, addArticle, deleteArticle, updateArticle, login, logout }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
