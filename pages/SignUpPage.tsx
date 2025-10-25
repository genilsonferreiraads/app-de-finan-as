import React from 'react';
import { Page } from '../types';

interface SignUpPageProps {
  setActivePage: (page: Page) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ setActivePage }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Conta criada com sucesso! Você será redirecionado para o login.');
    setActivePage('dashboard'); // Will be redirected to login page by App.tsx
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      <div className="w-full flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <span className="material-symbols-outlined text-primary text-6xl mb-4">account_balance_wallet</span>
            <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Crie sua conta</h2>
            <p className="text-text-muted-light dark:text-text-muted-dark mt-2">Comece a gerenciar suas finanças hoje.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2" htmlFor="name">
                Nome completo
              </label>
              <input id="name" type="text" placeholder="Seu nome" required className="form-input flex w-full rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark h-12 px-4 text-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" placeholder="seu@email.com" required className="form-input flex w-full rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark h-12 px-4 text-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2" htmlFor="password">
                Senha
              </label>
              <input id="password" type="password" placeholder="••••••••" required className="form-input flex w-full rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark h-12 px-4 text-base" />
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Criar conta
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
            Já tem uma conta?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('dashboard'); }} className="font-medium text-primary hover:underline">
              Fazer login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
