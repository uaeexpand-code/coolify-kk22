
export const Categories = ['Food', 'Home Bills', 'Others'] as const;
export type ExpenseCategory = typeof Categories[number];

export interface Expense {
  id: string;
  created_at: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  bank: string;
  is_paid: boolean;
  paid_at: string | null;
}
