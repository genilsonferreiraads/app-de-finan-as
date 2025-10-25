import React from 'react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between w-full h-16 px-4 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
        <span className="text-xl font-bold">FinanceApp</span>
      </div>
      <button 
        onClick={onMenuClick} 
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600"
        aria-label="Abrir menu de navegação"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
};

export default MobileHeader;