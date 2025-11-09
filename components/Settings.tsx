
import React, { useState } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { LoaderIcon } from './icons/Icons';
import { View } from '../App';


interface SettingsProps {
  setView: (view: View) => void;
}

const Settings: React.FC<SettingsProps> = ({ setView }) => {
  const { setCredentials } = useSupabase();
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !key) {
      setError('Both fields are required.');
      return;
    }
    setError('');
    setLoading(true);

    // The setCredentials function will handle creating the client and saving to localStorage.
    // The main App component will automatically detect the new client and switch views.
    setCredentials(url, key);
    
    // A small delay to allow context to update, though it's often instant.
    // The primary view switching logic is now in App.tsx's useEffect.
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -my-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Setup Connection</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                Enter your Supabase project credentials to get started.
            </p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p>{error}</p></div>}
        
        <form className="space-y-6" onSubmit={handleSave}>
            <div>
                <label htmlFor="supabase-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Supabase URL
                </label>
                <input
                    id="supabase-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-project-ref.supabase.co"
                    className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    required
                />
            </div>
            <div>
                <label htmlFor="supabase-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Supabase Anon Key
                </label>
                <input
                    id="supabase-key"
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    required
                />
            </div>
            
             <div className="text-xs text-gray-500 dark:text-gray-400">
                You can find these in your Supabase project dashboard under <strong>Project Settings &gt; API</strong>.
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-primary-hover transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? <LoaderIcon /> : 'Save and Connect'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
