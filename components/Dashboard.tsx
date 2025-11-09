
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Expense } from '../types';
import ExpenseItem from './ExpenseItem';
import { View } from '../App';
import { PlusIcon, LoaderIcon } from './icons/Icons';

interface DashboardProps {
  setView: (view: View) => void;
  onEdit: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, onEdit }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();

    const channel = supabase
      .channel('public:expenses')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        (payload) => {
          console.log('Change received!', payload);
          // Just refetch all for simplicity, could be optimized to handle specific events
          fetchExpenses(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSpent = expenses.reduce((acc, expense) => acc + (expense.is_paid ? Number(expense.amount) : 0), 0);
  const upcomingBills = expenses.reduce((acc, expense) => acc + (!expense.is_paid ? Number(expense.amount) : 0), 0);

  const markAsPaid = async (id: string) => {
    const originalExpenses = [...expenses];
    const updatedExpenses = expenses.map(exp => 
      exp.id === id ? { ...exp, is_paid: true } : exp
    );
    setExpenses(updatedExpenses);

    const { error } = await supabase
      .from('expenses')
      .update({ is_paid: true, paid_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      setError('Failed to update expense. Please try again.');
      setExpenses(originalExpenses); // Revert on error
    }
  };
  
  const deleteExpense = async (id: string) => {
    const originalExpenses = [...expenses];
    setExpenses(expenses.filter(exp => exp.id !== id));

    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
        setError('Failed to delete expense. Please try again.');
        setExpenses(originalExpenses); // Revert on error
    }
  };


  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back to your dashboard.</p>
        </div>
        <button
          onClick={() => setView('add')}
          className="hidden sm:flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-primary-hover transition-colors duration-200"
        >
          <PlusIcon />
          Add Expense
        </button>
      </header>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Bills</h2>
          <p className="text-3xl font-bold text-orange-500">${upcomingBills.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-2xl shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderIcon />
            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading expenses...</span>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No expenses yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Click 'Add Expense' to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.map((expense) => (
              <ExpenseItem key={expense.id} expense={expense} onMarkAsPaid={markAsPaid} onEdit={onEdit} onDelete={deleteExpense} />
            ))}
          </ul>
        )}
      </div>
      
      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setView('add')}
        className="sm:hidden fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-transform duration-200 transform hover:scale-105 active:scale-95"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export default Dashboard;
