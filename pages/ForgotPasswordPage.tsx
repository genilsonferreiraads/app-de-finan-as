import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Se o e-mail estiver correto, você receberá um link para redefinir sua senha.');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      <div className="w-full flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <span className="material-symbols-outlined text-primary text-6xl mb-4">lock_reset</span>
            <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Redefinir Senha</h2>
            <p className="text-text-muted-light dark:text-text-muted-dark mt-2">Digite seu e-mail e enviaremos um link para você voltar à sua conta.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" placeholder="seu@email.com" required className="form-input flex w-full rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark h-12 px-4 text-base" />
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Enviar link de redefinição
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
            Lembrou a senha?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
