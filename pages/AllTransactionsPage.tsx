import React, { useState, useMemo } from 'react';
import { Transaction, Category } from '../types';

const AllTransactionsPage: React.FC<{ transactions: Transaction[], categories: Category[] }> = ({ transactions, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        if (categoryFilter !== 'all' && t.categoryId !== categoryFilter) return false;
        if (searchTerm && !t.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, typeFilter, categoryFilter]);
  
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">Todas as Transações</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Veja e filtre todo o seu histórico de transações.</p>
      </header>
      
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-border-light dark:border-border-dark">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="relative md:col-span-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input 
                type="text" 
                placeholder="Buscar por descrição..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full rounded-lg pl-10 h-12 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
            </div>
            <div className="relative">
                 <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="form-select flex w-full min-w-0 flex-1 appearance-none resize-none overflow-hidden rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 text-base font-normal leading-normal">
                    <option value="all">Todos os Tipos</option>
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">expand_more</span>
            </div>
            <div className="relative">
                 <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="form-select flex w-full min-w-0 flex-1 appearance-none resize-none overflow-hidden rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 text-base font-normal leading-normal">
                    <option value="all">Todas as Categorias</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">expand_more</span>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm overflow-hidden border border-border-light dark:border-border-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Descrição</th>
                <th scope="col" className="px-6 py-3">Categoria</th>
                <th scope="col" className="px-6 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t, index) => (
                <tr key={t.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-card-dark' : 'bg-gray-50 dark:bg-card-dark/50'} border-b dark:border-border-dark`}>
                  <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{t.description}</th>
                  <td className="px-6 py-4">{categoryMap.get(t.categoryId)?.name || 'N/A'}</td>
                  <td className={`px-6 py-4 text-right font-semibold ${t.type === 'income' ? 'text-positive' : 'text-negative'}`}>
                    {t.type === 'income' ? '+' : '-'}R$ {t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-5xl">search_off</span>
                <p className="mt-2">Nenhuma transação encontrada com os filtros atuais.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTransactionsPage;