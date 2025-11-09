
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';

export type View = 'dashboard' | 'add';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingExpenseId(id);
    setView('add');
  };

  const handleViewChange = (newView: View) => {
    if (newView === 'dashboard') {
      setEditingExpenseId(null);
    }
    setView(newView);
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <main>
          {view === 'dashboard' && <Dashboard setView={handleViewChange} onEdit={handleEdit} />}
          {view === 'add' && <AddExpense setView={handleViewChange} expenseId={editingExpenseId} />}
        </main>
      </div>
    </div>
  );
};

export default App;
