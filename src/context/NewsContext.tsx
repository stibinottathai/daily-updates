"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { NewsArticle, User, Toast } from '../types';
import { supabase } from '../lib/supabase';

interface NewsContextType {
  articles: NewsArticle[];
  user: User;
  isLoading: boolean;
  toasts: Toast[];
  bookmarks: string[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  addArticle: (article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  deleteArticle: (id: string) => Promise<boolean>;
  updateArticle: (id: string, article: Partial<NewsArticle>) => Promise<boolean>;
  logout: () => Promise<void>;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  submitContactMessage: (email: string, content: string) => Promise<boolean>;
  fetchContactMessages: () => Promise<any[]>;
  deleteContactMessage: (id: string) => Promise<boolean>;
  clearAllMessages: () => Promise<boolean>;
  refreshAuth: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [user, setUser] = useState<User>({ email: '', isAuthenticated: false });
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Prevent hydration mismatch by using a mounted state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Use a stable default during SSR and initial hydration
  const currentTheme = mounted ? theme : 'dark';

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return newTheme;
    });
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Load bookmarks from local storage
  useEffect(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse bookmarks');
      }
    }
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const newBookmarks = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  const submitContactMessage = useCallback(async (email: string, content: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{ email, content }]);
    
    if (error) {
      addToast(`Error: ${error.message}`, 'error');
      return false;
    }

    addToast('Message sent successfully', 'success');
    return true;
  }, [addToast]);

  const fetchContactMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      addToast(`Error: ${error.message}`, 'error');
      return [];
    }
    return data || [];
  }, [addToast]);

  const deleteContactMessage = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) {
      addToast(`Failed to delete message: ${error.message}`, 'error');
      return false;
    }
    
    addToast('Message deleted successfully', 'success');
    return true;
  }, [addToast]);

  const clearAllMessages = useCallback(async () => {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (error) {
      addToast(`Failed to clear messages: ${error.message}`, 'error');
      return false;
    }
    
    addToast('All messages cleared successfully', 'success');
    return true;
  }, [addToast]);

  const refreshAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setUser({
        id: session.user.id,
        email: session.user.email || '',
        role: data?.role || 'sub_admin',
        isAuthenticated: true,
      });
    } else {
      setUser({ email: '', isAuthenticated: false });
    }
  }, []);

  // Fetch articles and auth state
  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        addToast('Failed to load articles', 'error');
      } else if (data) {
        setArticles(data as NewsArticle[]);
      }
    };

    const init = async () => {
      setIsLoading(true);
      await fetchArticles();
      await refreshAuth();
      setIsLoading(false);
    };

    init();

    // Listen for changes on auth state
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        refreshAuth();
      } else {
        setUser({ email: '', isAuthenticated: false });
      }
    });

    // Real-time subscription for articles
    const articleSub = supabase.channel('public:articles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, payload => {
        if (payload.eventType === 'INSERT') {
          setArticles(prev => [payload.new as NewsArticle, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setArticles(prev => prev.map(a => a.id === payload.new.id ? payload.new as NewsArticle : a));
        } else if (payload.eventType === 'DELETE') {
          setArticles(prev => prev.filter(a => a.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      authSub.unsubscribe();
      supabase.removeChannel(articleSub);
    };
  }, [addToast, refreshAuth]);

  const addArticle = async (article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('articles').insert([{...article, author_id: user.id}]);
    if (error) {
      addToast(`Error: ${error.message}`, 'error');
      return false;
    }
    addToast('Article published successfully', 'success');
    return true;
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      addToast(`Error: ${error.message}`, 'error');
      return false;
    }
    addToast('Article deleted', 'success');
    return true;
  };

  const updateArticle = async (id: string, updatedFields: Partial<NewsArticle>) => {
    const { error } = await supabase.from('articles').update(updatedFields).eq('id', id);
    if (error) {
      addToast(`Error: ${error.message}`, 'error');
      return false;
    }
    addToast('Article updated', 'success');
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser({ email: '', isAuthenticated: false });
    addToast('Logged out successfully', 'info');
  };

  return (
      <NewsContext.Provider value={{
        articles, user, isLoading, toasts, bookmarks, theme: currentTheme, toggleTheme,
        addArticle, deleteArticle, updateArticle, logout,
        addToast, toggleBookmark, isBookmarked,
        submitContactMessage, fetchContactMessages, deleteContactMessage,
        clearAllMessages, refreshAuth
      }}>
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
