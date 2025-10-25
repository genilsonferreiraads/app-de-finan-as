export type Page = 'dashboard' | 'transactions' | 'categories' | 'reports' | 'profile' | 'all-transactions' | 'sign-up' | 'forgot-password';

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string; // YYYY-MM-DD
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense' | 'all';
}
