import React, { useState, useEffect, useCallback } from 'react';
import SideNav from './components/SideNav';
import MobileHeader from './components/MobileHeader';
import DashboardPage from './pages/DashboardPage';
import AddTransactionPage from './pages/AddTransactionPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import AllTransactionsPage from './pages/AllTransactionsPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { Page, User, Transaction, Category } from './types';
import { MOCK_USER, MOCK_TRANSACTIONS, MOCK_CATEGORIES } from './data/mockData';
import { RechartsRoot } from 'recharts';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('financeAppIsAuthenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...newTransaction, id: Date.now().toString() }, ...prev]);
    setActivePage('dashboard');
  }, []);

  const handleSetActivePage = (page: Page) => {
    setActivePage(page);
    setIsMobileNavOpen(false);
  };

  const handleLogin = (rememberMe: boolean) => {
    setIsAuthenticated(true);
    if (rememberMe) {
      localStorage.setItem('financeAppIsAuthenticated', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('financeAppIsAuthenticated');
    setActivePage('dashboard');
    setIsMobileNavOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage transactions={transactions} categories={categories} setActivePage={handleSetActivePage} />;
      case 'transactions':
        return <AddTransactionPage categories={categories} addTransaction={addTransaction} setActivePage={handleSetActivePage} />;
      case 'all-transactions':
        return <AllTransactionsPage transactions={transactions} categories={categories} />;
      case 'categories':
        return <CategoriesPage categories={categories} setCategories={setCategories} />;
      case 'reports':
        return <ReportsPage transactions={transactions} categories={categories} />;
      case 'profile':
        return <ProfilePage user={user} setUser={setUser} />;
      case 'sign-up':
        return <SignUpPage setActivePage={handleSetActivePage} />;
      case 'forgot-password':
        return <ForgotPasswordPage setActivePage={handleSetActivePage} />;
      default:
        return <DashboardPage transactions={transactions} categories={categories} setActivePage={handleSetActivePage} />;
    }
  };
  
  if (!isAuthenticated) {
    if (activePage === 'sign-up') return <SignUpPage setActivePage={handleSetActivePage} />;
    if (activePage === 'forgot-password') return <ForgotPasswordPage setActivePage={handleSetActivePage} />;
    return <LoginPage onLogin={handleLogin} setActivePage={handleSetActivePage} />;
  }

  return (
    <div className="relative flex w-full min-h-screen">
      <SideNav 
        activePage={activePage} 
        setActivePage={handleSetActivePage} 
        user={user} 
        onLogout={handleLogout}
        isMobileNavOpen={isMobileNavOpen}
        onCloseMobileNav={() => setIsMobileNavOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <MobileHeader onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto mt-16 md:mt-0">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;