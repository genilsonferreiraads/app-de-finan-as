import React, { useState } from 'react';
import { Page } from '../types';

interface LoginPageProps {
  onLogin: (rememberMe: boolean) => void;
  setActivePage: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, setActivePage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(rememberMe);
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-primary/10 p-12 text-center">
        <span className="material-symbols-outlined text-primary text-8xl mb-6">account_balance_wallet</span>
        <h1 className="text-4xl font-black text-text-light dark:text-text-dark mb-3">Bem-vindo de volta!</h1>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-sm">Acesse sua conta para gerenciar suas finanças de forma inteligente e eficiente.</p>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-md">
          <div className="text-left mb-10">
            <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Entrar na sua conta</h2>
            <p className="text-text-muted-light dark:text-text-muted-dark mt-2">Olá! Por favor, insira seus dados.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">mail</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="form-input flex w-full rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark h-12 pl-10 pr-4 text-base"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-text-light dark:text-text-dark" htmlFor="password">
                  Senha
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('forgot-password'); }} className="text-sm font-medium text-primary hover:underline">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">lock</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input flex w-full rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark h-12 pl-10 pr-4 text-base"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted-light dark:text-text-muted-dark">
                  Lembrar de mim
                </label>
              </div>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Entrar
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
            Não tem uma conta?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('sign-up'); }} className="font-medium text-primary hover:underline">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
