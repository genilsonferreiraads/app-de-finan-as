import React, { useState, useMemo } from 'react';
import { Transaction, Category } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Period = '7d' | '1m' | '1y';
type TransactionTypeFilter = 'all' | 'income' | 'expense';

const ReportsPage: React.FC<{ transactions: Transaction[], categories: Category[] }> = ({ transactions, categories }) => {
  const [period, setPeriod] = useState<Period>('1m');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('all');
  const [activeTab, setActiveTab] = useState<'summary' | 'details'>('summary');
  
  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    
    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.categoryId === categoryFilter);
    }
    
    // Filter by period
    const now = new Date();
    if (period === '7d') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      result = result.filter(t => new Date(t.date) >= sevenDaysAgo);
    } else if (period === '1m') {
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      result = result.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === thisMonth && tDate.getFullYear() === thisYear;
      });
    } else if (period === '1y') {
       const thisYear = new Date().getFullYear();
       result = result.filter(t => new Date(t.date).getFullYear() === thisYear);
    }
    
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, period, categoryFilter, typeFilter]);
  
  const summary = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
        if (t.type === 'income') {
            acc.income += t.amount;
        } else {
            acc.expense += t.amount;
        }
        acc.balance = acc.income - acc.expense;
        return acc;
    }, { income: 0, expense: 0, balance: 0 });
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    const dataByDate: { [key: string]: { date: string, Receitas: number, Despesas: number } } = {};
    filteredTransactions.forEach(t => {
        const dateKey = new Date(t.date).toLocaleDateString('pt-BR');
        if (!dataByDate[dateKey]) {
            dataByDate[dateKey] = { date: dateKey, Receitas: 0, Despesas: 0 };
        }
        if (t.type === 'income') {
            dataByDate[dateKey].Receitas += t.amount;
        } else {
            dataByDate[dateKey].Despesas += t.amount;
        }
    });
    return Object.values(dataByDate).reverse();
  }, [filteredTransactions]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">Relatórios Financeiros</h1>
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-border-light dark:border-border-dark">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Período</label>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setPeriod('7d')} className={`h-9 px-3 text-sm font-medium rounded-lg ${period === '7d' ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800'}`}>7 dias</button>
              <button onClick={() => setPeriod('1m')} className={`h-9 px-3 text-sm font-medium rounded-lg ${period === '1m' ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800'}`}>Este Mês</button>
              <button onClick={() => setPeriod('1y')} className={`h-9 px-3 text-sm font-medium rounded-lg ${period === '1y' ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800'}`}>Este Ano</button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 block">Categorias</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="form-select w-full rounded-lg text-gray-800 dark:text-gray-200 bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary/50 h-12 text-base font-normal">
              <option value="all">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">Tipo</p>
            <div className="flex h-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
              <button onClick={() => setTypeFilter('all')} className={`flex-1 h-full rounded-lg text-sm ${typeFilter === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}>Ambos</button>
              <button onClick={() => setTypeFilter('income')} className={`flex-1 h-full rounded-lg text-sm ${typeFilter === 'income' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}>Receitas</button>
              <button onClick={() => setTypeFilter('expense')} className={`flex-1 h-full rounded-lg text-sm ${typeFilter === 'expense' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}>Despesas</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex gap-6">
            <button onClick={() => setActiveTab('summary')} className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-semibold ${activeTab === 'summary' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>Resumo</button>
            <button onClick={() => setActiveTab('details')} className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-semibold ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>Detalhes</button>
          </nav>
        </div>

        {activeTab === 'summary' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Receitas</p><p className="mt-1 text-3xl font-bold text-revenue">R$ {summary.income.toFixed(2)}</p></div>
              <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Despesas</p><p className="mt-1 text-3xl font-bold text-expense">-R$ {summary.expense.toFixed(2)}</p></div>
              <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Final</p><p className="mt-1 text-3xl font-bold text-gray-800 dark:text-white">R$ {summary.balance.toFixed(2)}</p></div>
            </div>
             <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark">
                <h3 className="font-bold text-gray-900 dark:text-white">Evolução Financeira</h3>
                <div className="mt-4 h-80">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="Receitas" stroke="#27AE60" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="Despesas" stroke="#E74C3C" />
                        </LineChart>
                      </ResponsiveContainer>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
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
                      <td className={`px-6 py-4 text-right font-semibold ${t.type === 'income' ? 'text-revenue' : 'text-expense'}`}>
                        {t.type === 'income' ? '+' : '-'}R$ {t.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;