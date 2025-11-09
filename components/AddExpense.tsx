
import React, { useState, useEffect, useCallback } from 'react';
import { View } from '../App';
import { Categories, ExpenseCategory } from '../types';
import { BackIcon, LoaderIcon } from './icons/Icons';
import { useSupabase } from '../contexts/SupabaseContext';

interface AddExpenseProps {
  setView: (view: View) => void;
  expenseId?: string | null;
}

const AddExpense: React.FC<AddExpenseProps> = ({ setView, expenseId }) => {
  const { client: supabase } = useSupabase();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!expenseId;

  const fetchExpense = useCallback(async () => {
    if (!expenseId || !supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', expenseId)
      .single();
    
    if (error) {
      setError('Could not fetch expense data.');
    } else if (data) {
      setName(data.name);
      setAmount(data.amount.toString());
      setBank(data.bank);
      setCategory(data.category);
    }
    setLoading(false);
  }, [expenseId, supabase]);

  useEffect(() => {
    if (isEditing) {
      fetchExpense();
    }
  }, [isEditing, fetchExpense]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase client is not initialized.');
      return;
    }
    if (!name || !amount || !bank || !category) {
      setError('Please fill out all fields.');
      return;
    }
    setError(null);
    setLoading(true);

    const expenseData = {
      name,
      amount: parseFloat(amount),
      bank,
      category,
    };

    const { error: dbError } = isEditing
      ? await supabase.from('expenses').update(expenseData).eq('id', expenseId)
      : await supabase.from('expenses').insert([expenseData]);


    if (dbError) {
      setError(dbError.message);
      setLoading(false);
    } else {
      setView('dashboard');
    }
  };

  if (isEditing && loading && !name) {
     return (
        <div className="flex justify-center items-center h-64">
          <LoaderIcon />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Loading expense...</span>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex items-center gap-4">
        <button
          onClick={() => setView('dashboard')}
          className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <BackIcon />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Expense' : 'Add Expense'}</h1>
      </header>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Expense Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Groceries"
            className="mt-1 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 75.50"
              step="0.01"
              className="mt-1 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bank
            </label>
            <input
              type="text"
              id="bank"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              placeholder="e.g., Chase"
              className="mt-1 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </span>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-4">
            {Categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`p-4 rounded-lg text-center font-semibold transition-all duration-200 border-2 ${
                  category === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 px-4 rounded-lg shadow-sm hover:bg-primary-hover transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <LoaderIcon /> : (isEditing ? 'Save Changes' : 'Add Expense')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
