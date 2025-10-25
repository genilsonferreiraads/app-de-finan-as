
import { User, Transaction, Category } from '../types';

export const MOCK_USER: User = {
  name: 'Ana de Souza',
  email: 'ana.souza@email.com',
  avatarUrl: 'https://picsum.photos/seed/user1/200/200',
};

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentação', color: '#A78BFA', type: 'expense' },
  { id: '2', name: 'Transporte', color: '#60A5FA', type: 'expense' },
  { id: '3', name: 'Moradia', color: '#F87171', type: 'expense' },
  { id: '4', name: 'Lazer', color: '#38B2AC', type: 'expense' },
  { id: '5', name: 'Salário', color: '#FBBF24', type: 'income' },
  { id: '6', name: 'Reembolso', color: '#34D399', type: 'income' },
  { id: '7', name: 'Supermercado', color: '#EC4899', type: 'expense' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'expense', amount: 250.80, description: 'Supermercado Pão de Açúcar', categoryId: '7', date: '2023-03-15' },
  { id: 't2', type: 'income', amount: 5500.00, description: 'Salário - Empresa X', categoryId: '5', date: '2023-03-05' },
  { id: 't3', type: 'expense', amount: 35.50, description: 'Pagamento Uber', categoryId: '2', date: '2023-03-14' },
  { id: 't4', type: 'expense', amount: 78.90, description: 'iFood', categoryId: '1', date: '2023-03-12' },
  { id: 't5', type: 'income', amount: 300.00, description: 'Reembolso Projeto Y', categoryId: '6', date: '2023-03-10' },
  { id: 't6', type: 'expense', amount: 1200.00, description: 'Aluguel', categoryId: '3', date: '2023-03-01' },
  { id: 't7', type: 'income', amount: 2300.00, description: 'Salário - Empresa X', categoryId: '5', date: '2023-02-05' },
  { id: 't8', type: 'expense', amount: 450.00, description: 'Conta de luz', categoryId: '3', date: '2023-02-20' },
  { id: 't9', type: 'expense', amount: 150.00, description: 'Show', categoryId: '4', date: '2023-02-18' },
  { id: 't10', type: 'income', amount: 1500.00, description: 'Salário - Empresa X', categoryId: '5', date: '2023-01-05' },
  { id: 't11', type: 'expense', amount: 300.00, description: 'Jantar com amigos', categoryId: '1', date: '2023-01-25' },
];
