import React, { useState, useEffect, useCallback } from 'react';
// FIX: Removed unused Outlet import
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { User, Transaction, Category } from './types';
import { MOCK_USER, MOCK_TRANSACTIONS, MOCK_CATEGORIES } from './data/mockData';

// Main layout for authenticated users
// FIX: Updated props for MainLayout to accept children and the correct type for setIsMobileNavOpen
const MainLayout: React.FC<{
  user: User;
  onLogout: () => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}> = ({ user, onLogout, isMobileNavOpen, setIsMobileNavOpen, children }) => {
  const location = useLocation();

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname, setIsMobileNavOpen]);

  return (
    <div className="relative flex w-full min-h-screen">
      <SideNav
        user={user}
        onLogout={onLogout}
        isMobileNavOpen={isMobileNavOpen}
        onCloseMobileNav={() => setIsMobileNavOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <MobileHeader onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto mt-16 md:mt-0">
          <div className="max-w-7xl mx-auto">
            {/* FIX: Render children instead of Outlet */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();

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
    navigate('/');
  }, [navigate]);

  const handleLogin = (rememberMe: boolean) => {
    setIsAuthenticated(true);
    if (rememberMe) {
      localStorage.setItem('financeAppIsAuthenticated', 'true');
    }
    navigate('/');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('financeAppIsAuthenticated');
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
      <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/" />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <MainLayout 
              user={user} 
              onLogout={handleLogout} 
              isMobileNavOpen={isMobileNavOpen}
              setIsMobileNavOpen={setIsMobileNavOpen}
            >
              <Routes>
                  <Route path="/" element={<DashboardPage transactions={transactions} categories={categories} />} />
                  <Route path="/transactions/add" element={<AddTransactionPage categories={categories} addTransaction={addTransaction} />} />
                  <Route path="/transactions" element={<AllTransactionsPage transactions={transactions} categories={categories} />} />
                  <Route path="/categories" element={<CategoriesPage categories={categories} setCategories={setCategories} />} />
                  <Route path="/reports" element={<ReportsPage transactions={transactions} categories={categories} />} />
                  <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
                  <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;