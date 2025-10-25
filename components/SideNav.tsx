import React from 'react';
import { NavLink } from 'react-router-dom';
import { User } from '../types';

interface SideNavProps {
  user: User;
  onLogout: () => void;
  isMobileNavOpen: boolean;
  onCloseMobileNav: () => void;
}

interface NavItemProps {
  icon: string;
  label: string;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to }) => {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-primary/20 text-text-light dark:text-text-dark font-medium'
            : 'hover:bg-primary/10'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>{icon}</span>
          <p className="text-sm leading-normal">{label}</p>
        </>
      )}
    </NavLink>
  );
};

const SideNav: React.FC<SideNavProps> = ({ user, onLogout, isMobileNavOpen, onCloseMobileNav }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity ${
          isMobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobileNav}
        aria-hidden="true"
      ></div>

      {/* Side Navigation */}
      <aside
        className={`
          flex flex-col w-64 p-4 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark
          fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col flex-grow justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
              <span className="text-xl font-bold">FinanceApp</span>
            </div>
            <div className="flex flex-col gap-2">
              <NavItem icon="dashboard" label="Dashboard" to="/" />
              <NavItem icon="add_circle" label="Nova Transação" to="/transactions/add" />
              <NavItem icon="receipt_long" label="Transações" to="/transactions" />
              <NavItem icon="sell" label="Categorias" to="/categories" />
              <NavItem icon="bar_chart" label="Relatórios" to="/reports" />
              <NavItem icon="person" label="Perfil" to="/profile" />
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-border-light dark:border-border-dark pt-4">
             <div className="flex items-center gap-3 p-2">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: `url("${user.avatarUrl}")`}}></div>
                <div className="flex flex-col overflow-hidden">
                  <h1 className="text-base font-medium leading-normal truncate">{user.name}</h1>
                  <p className="text-sm font-normal leading-normal text-text-muted-light dark:text-text-muted-dark truncate">{user.email}</p>
                </div>
              </div>
              <div
                onClick={onLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
                <p className="text-sm font-medium leading-normal">Sair</p>
              </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideNav;
