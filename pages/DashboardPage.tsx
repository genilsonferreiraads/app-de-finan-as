import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Transaction, Category } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

interface StatCardProps {
    title: string;
    amount: string;
    change?: string;
    changeType?: 'positive' | 'negative';
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, change, changeType }) => (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
        <p className="text-base font-medium text-text-muted-light dark:text-text-muted-dark">{title}</p>
        <p className={`tracking-light text-3xl font-bold leading-tight ${changeType === 'positive' ? 'text-positive' : ''} ${changeType === 'negative' ? 'text-negative' : ''}`}>{amount}</p>
        {change && (
            <p className={`text-sm font-medium leading-normal flex items-center ${changeType === 'positive' ? 'text-positive' : 'text-negative'}`}>
                <span className="material-symbols-outlined text-base mr-1">{changeType === 'positive' ? 'arrow_upward' : 'arrow_downward'}</span>
                {change}
            </p>
        )}
    </div>
);

const TransactionItem: React.FC<{ transaction: Transaction, category?: Category }> = ({ transaction, category }) => (
    <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                <span className={`material-symbols-outlined ${transaction.type === 'income' ? 'text-positive' : 'text-negative'}`}>
                    {transaction.type === 'income' ? 'arrow_upward' : 'arrow_downward'}
                </span>
            </div>
            <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{category?.name || 'Uncategorized'}</p>
            </div>
        </div>
        <div className="text-right">
            <p className={`font-bold ${transaction.type === 'income' ? 'text-positive' : 'text-negative'}`}>
                {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
            </p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{new Date(transaction.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
        </div>
    </div>
);

interface DashboardPageProps {
    transactions: Transaction[];
    categories: Category[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ transactions, categories }) => {
    
    const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

    const { balance, income, expenses } = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return transactions.reduce((acc, t) => {
            const transactionDate = new Date(t.date);
            const isCurrentMonth = transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
            
            if (t.type === 'income') {
                acc.balance += t.amount;
                if (isCurrentMonth) acc.income += t.amount;
            } else {
                acc.balance -= t.amount;
                if (isCurrentMonth) acc.expenses += t.amount;
            }
            return acc;
        }, { balance: 0, income: 0, expenses: 0 });
    }, [transactions]);
    
    const chartData = useMemo(() => {
        const dataByMonth: { [key: string]: { name: string, Receitas: number, Despesas: number } } = {};
        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short' });
            if (!dataByMonth[month]) {
                dataByMonth[month] = { name: month.charAt(0).toUpperCase() + month.slice(1), Receitas: 0, Despesas: 0 };
            }
            if (t.type === 'income') {
                dataByMonth[month].Receitas += t.amount;
            } else {
                dataByMonth[month].Despesas += t.amount;
            }
        });
        return Object.values(dataByMonth).reverse();
    }, [transactions]);
    
    const pieData = useMemo(() => {
        const dataByCategory: { [key: string]: { name: string, value: number, fill: string } } = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            const category = categoryMap.get(t.categoryId);
            if(category) {
                if (!dataByCategory[category.id]) {
                    dataByCategory[category.id] = { name: category.name, value: 0, fill: category.color };
                }
                dataByCategory[category.id].value += t.amount;
            }
        });
        return Object.values(dataByCategory);
    }, [transactions, categoryMap]);
    
    const recentTransactions = transactions.slice(0, 5);

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex flex-col gap-1 mb-4 md:mb-0">
                    <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">Visão Geral</h1>
                    <p className="text-base font-normal text-text-muted-light dark:text-text-muted-dark">Aqui está um resumo da sua saúde financeira.</p>
                </div>
            </header>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Saldo Atual" amount={`R$ ${balance.toFixed(2)}`} />
                <StatCard title="Receitas do Mês" amount={`R$ ${income.toFixed(2)}`} changeType="positive" change="+10.1% vs mês passado"/>
                <StatCard title="Despesas do Mês" amount={`R$ ${expenses.toFixed(2)}`} changeType="negative" change="-3.0% vs mês passado"/>
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                <div className="lg:col-span-3 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                    <h2 className="text-lg font-bold mb-4">Balanço Mensal</h2>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Receitas" fill="#48BB78" />
                                <Bar dataKey="Despesas" fill="#F56565" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                    <h2 className="text-lg font-bold mb-4">Despesas por Categoria</h2>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                     <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
                        {pieData.map(entry => (
                             <div key={entry.name} className="flex items-center gap-2">
                                <div className="size-3 rounded-full" style={{backgroundColor: entry.fill}}></div>
                                <span>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section>
                <div className="rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Atividade Recente</h2>
                        <Link to="/transactions" className="text-sm font-bold text-primary hover:underline">Ver Todos</Link>
                    </div>
                    <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
                        {recentTransactions.map(t => <TransactionItem key={t.id} transaction={t} category={categoryMap.get(t.categoryId)} />)}
                    </div>
                </div>
            </section>
        </>
    );
};

export default DashboardPage;