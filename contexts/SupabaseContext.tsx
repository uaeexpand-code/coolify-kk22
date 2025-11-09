
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  client: SupabaseClient | null;
  loading: boolean;
  setCredentials: (url: string, key: string) => void;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabaseUrl = localStorage.getItem('SUPABASE_URL');
    const supabaseKey = localStorage.getItem('SUPABASE_KEY');

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      setClient(supabase);
    }
    setLoading(false);
  }, []);

  const setCredentials = (url: string, key: string) => {
    try {
        const supabase = createClient(url, key);
        localStorage.setItem('SUPABASE_URL', url);
        localStorage.setItem('SUPABASE_KEY', key);
        setClient(supabase);
    } catch (error) {
        console.error("Failed to create Supabase client:", error);
        alert("Invalid Supabase credentials. Please check and try again.");
    }
  };
  

  return (
    <SupabaseContext.Provider value={{ client, loading, setCredentials }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
