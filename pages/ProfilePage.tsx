import React, { useState, ChangeEvent } from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  setUser: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    setUser({ name, email, avatarUrl: avatar });
    
    if (currentPassword && newPassword) {
      alert('Senha alterada com sucesso! (Simulação)');
      setCurrentPassword('');
      setNewPassword('');
    } else if (currentPassword || newPassword) {
      alert('Por favor, preencha a senha atual e a nova senha para alterá-la.');
    } else {
      alert('Alterações salvas com sucesso!');
    }
  };
  
  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatarUrl);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <>
      <header className="flex flex-wrap justify-between gap-3 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-[-0.03em] text-text-light dark:text-text-dark">Perfil</h1>
          <p className="text-base font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">Gerencie suas informações pessoais e de perfil.</p>
        </div>
      </header>

      <section className="p-6 mb-8 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Foto de Perfil</h2>
        <div className="flex items-center gap-6">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20" style={{ backgroundImage: `url("${avatar}")` }}></div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label htmlFor="avatar-upload" className="cursor-pointer px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Carregar nova foto
            </label>
            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            <button onClick={() => setAvatar('https://picsum.photos/seed/default/200/200')} className="px-4 py-2 text-sm font-semibold border rounded-lg border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-white/10">
              Remover
            </button>
          </div>
        </div>
      </section>

      <section className="p-6 mb-8 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] mb-1">Informações Pessoais</h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">Atualize seu nome e endereço de e-mail.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col">
            <p className="text-sm font-medium leading-normal pb-2 text-text-light dark:text-text-dark">Nome</p>
            <input value={name} onChange={(e) => setName(e.target.value)} className="form-input flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 text-base" />
          </label>
          <label className="flex flex-col">
            <p className="text-sm font-medium leading-normal pb-2 text-text-light dark:text-text-dark">Email</p>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-input flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 text-base" />
          </label>
        </div>
      </section>

      <section className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] mb-1">Senha</h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">Altere sua senha. Use uma senha forte e única.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col">
            <p className="text-sm font-medium leading-normal pb-2 text-text-light dark:text-text-dark">Senha Atual</p>
            <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-input flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 text-base" placeholder="••••••••" type="password" />
          </label>
          <label className="flex flex-col">
            <p className="text-sm font-medium leading-normal pb-2 text-text-light dark:text-text-dark">Nova Senha</p>
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-input flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 text-base" placeholder="••••••••" type="password" />
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-4 mt-8">
        <button onClick={handleCancel} className="px-5 py-2.5 text-sm font-semibold border rounded-lg border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-white/10">
          Cancelar
        </button>
        <button onClick={handleSaveChanges} className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Salvar Alterações
        </button>
      </div>
    </>
  );
};

export default ProfilePage;