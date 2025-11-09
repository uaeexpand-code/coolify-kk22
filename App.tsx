
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import Settings from './components/Settings';
import { SupabaseProvider, useSupabase } from './contexts/SupabaseContext';
import { LoaderIcon } from './components/icons/Icons';

export type View = 'dashboard' | 'add' | 'settings';

const Main: React.FC = () => {
  const { client, loading } = useSupabase();
  const [view, setView] = useState<View>('dashboard');
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !client) {
      setView('settings');
    } else if (!loading && client && view === 'settings') {
      setView('dashboard');
    }
  }, [client, loading, view]);

  const handleEdit = (id: string) => {
    setEditingExpenseId(id);
    setView('add');
  };

  const handleViewChange = (newView: View) => {
    if (newView === 'dashboard') {
      setEditingExpenseId(null);
    }
    setView(newView);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon />
        <span className="ml-2 text-gray-500 dark:text-gray-400">Initializing...</span>
      </div>
    );
  }

  if (!client || view === 'settings') {
    return <Settings setView={handleViewChange} />;
  }
  
  return (
    <main>
      {view === 'dashboard' && <Dashboard setView={handleViewChange} onEdit={handleEdit} />}
      {view === 'add' && <AddExpense setView={handleViewChange} expenseId={editingExpenseId} />}
    </main>
  );
};

const App: React.FC = () => {
  return (
    <SupabaseProvider>
      <div className="min-h-screen text-gray-800 dark:text-gray-200">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <Main />
        </div>
      </div>
    </SupabaseProvider>
  );
};

export default App;
