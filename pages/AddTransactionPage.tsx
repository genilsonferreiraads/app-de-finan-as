import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, Transaction } from '../types';

interface AddTransactionPageProps {
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionPage: React.FC<AddTransactionPageProps> = ({ categories, addTransaction }) => {
  const navigate = useNavigate();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories.find(c => c.type === 'expense' || c.type === 'all')?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleTypeChange = (newType: 'expense' | 'income') => {
    setType(newType);
    const firstCategory = categories.find(c => c.type === newType || c.type === 'all');
    if (firstCategory) {
      setCategoryId(firstCategory.id);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !date || !description) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    addTransaction({
      type,
      amount: parseFloat(amount),
      categoryId,
      date,
      description,
    });
    
    setAmount('');
    setDescription('');
    setFile(null);
  };

  const filteredCategories = categories.filter(c => c.type === type || c.type === 'all');

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 pb-8">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-text-light dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Adicionar Nova Transação</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark text-base font-normal leading-normal">Preencha os detalhes abaixo para registrar uma despesa ou receita.</p>
        </div>
      </div>
      <div className="bg-white dark:bg-card-dark p-8 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <h3 className="text-text-light dark:text-text-dark text-base font-bold leading-tight tracking-[-0.015em] pb-3">Tipo de Transação</h3>
            <div className="flex h-12 w-full items-center justify-center rounded-lg bg-background-light dark:bg-background-dark p-1">
              <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${type === 'expense' ? 'bg-white dark:bg-card-dark shadow-sm text-text-light dark:text-white' : 'text-text-muted-light dark:text-text-muted-dark'}`}>
                <span className="material-symbols-outlined mr-2 text-expense-red">arrow_downward</span>
                <span className="truncate">Despesa</span>
                <input checked={type === 'expense'} onChange={() => handleTypeChange('expense')} className="invisible w-0" name="transaction_type" type="radio" value="Despesa"/>
              </label>
              <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${type === 'income' ? 'bg-white dark:bg-card-dark shadow-sm text-text-light dark:text-white' : 'text-text-muted-light dark:text-text-muted-dark'}`}>
                <span className="material-symbols-outlined mr-2 text-income-green">arrow_upward</span>
                <span className="truncate">Receita</span>
                <input checked={type === 'income'} onChange={() => handleTypeChange('income')} className="invisible w-0" name="transaction_type" type="radio" value="Receita"/>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Valor</p>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted-light dark:text-text-muted-dark">R$</span>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-10 pr-4 text-base font-normal leading-normal" placeholder="0,00" step="0.01" type="number" required />
              </div>
            </label>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Categoria</p>
              <div className="relative">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="form-select flex w-full min-w-0 flex-1 appearance-none resize-none overflow-hidden rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 text-base font-normal leading-normal" required>
                  {filteredCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">expand_more</span>
              </div>
            </label>
          </div>
          <label className="flex flex-col">
            <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Data</p>
            <div className="relative">
              <input value={date} onChange={(e) => setDate(e.target.value)} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-base font-normal leading-normal" type="date" required />
              <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">calendar_today</span>
            </div>
          </label>
          <label className="flex flex-col">
            <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Descrição</p>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-text-light dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark min-h-[100px] placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark p-3 text-base font-normal leading-normal" placeholder="Ex: Almoço com cliente no restaurante" required></textarea>
          </label>
          <div className="flex flex-col">
            <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Anexar Comprovante (Opcional)</p>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border-light dark:border-border-dark border-dashed rounded-lg cursor-pointer bg-background-light dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-4xl">cloud_upload</span>
                  <p className="mb-2 text-sm text-text-muted-light dark:text-gray-400">
                    {file ? file.name : <><span className="font-semibold">Clique para enviar</span> ou arraste e solte</>}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG ou PDF (MAX. 5MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 pt-4">
            <button onClick={() => navigate('/')} type="button" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-transparent text-text-muted-light dark:text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors">
              <span className="truncate">Cancelar</span>
            </button>
            <button type="submit" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-text-light text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
              <span className="truncate">Adicionar Transação</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTransactionPage;
