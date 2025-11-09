
import React from 'react';
import { Expense } from '../types';
import { FoodIcon, HomeIcon, OtherIcon, BankIcon, EditIcon, TrashIcon, CheckCircleIcon } from './icons/Icons';

interface ExpenseItemProps {
  expense: Expense;
  onMarkAsPaid: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case 'Food':
      return <FoodIcon />;
    case 'Home Bills':
      return <HomeIcon />;
    default:
      return <OtherIcon />;
  }
};

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onMarkAsPaid, onEdit, onDelete }) => {
  const formattedDate = new Date(expense.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <li className={`flex items-center justify-between p-4 transition-opacity duration-300 ${expense.is_paid ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
          <CategoryIcon category={expense.category} />
        </div>
        <div>
          <p className={`font-semibold text-gray-900 dark:text-white ${expense.is_paid ? 'line-through' : ''}`}>
            {expense.name}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{formattedDate}</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <BankIcon />
            <span>{expense.bank}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="font-bold text-lg text-gray-900 dark:text-white">
          ${Number(expense.amount).toFixed(2)}
        </span>
        <div className="flex items-center gap-1">
          {!expense.is_paid && (
            <button
              onClick={() => onMarkAsPaid(expense.id)}
              className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full transition-colors"
              aria-label="Mark as paid"
            >
              <CheckCircleIcon />
            </button>
          )}
           <button
            onClick={() => onEdit(expense.id)}
            className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Edit"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
            aria-label="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ExpenseItem;
