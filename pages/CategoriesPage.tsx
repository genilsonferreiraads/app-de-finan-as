import React, { useState, useEffect, FormEvent } from 'react';
import { Category } from '../types';

const COLORS = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#EC4899'];

interface CategoryItemProps {
  category: Category;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, isActive, onSelect, onDelete }) => (
  <div
    onClick={onSelect}
    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
      isActive
        ? 'bg-primary/20 dark:bg-primary/30 border border-primary/50'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="size-4 rounded-full" style={{ backgroundColor: category.color }}></div>
      <p className={`font-medium ${isActive ? 'text-text-light dark:text-white' : 'text-text-light dark:text-gray-300'}`}>{category.name}</p>
    </div>
    <div className={`flex items-center gap-2 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
      <button
        className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50"
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
      >
        <span className="material-symbols-outlined text-lg">edit</span>
      </button>
      <button
        className="p-1 rounded-md text-red-500 hover:bg-red-500/10"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
        <span className="material-symbols-outlined text-lg">delete</span>
      </button>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
    <div className="bg-white dark:bg-card-dark/50 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl p-8 text-center flex flex-col justify-center items-center h-full min-h-[300px]">
        <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">category</span>
        <p className="text-text-muted-light dark:text-text-muted-dark">Selecione uma categoria para editar ou clique em 'Nova Categoria' para começar.</p>
    </div>
);

interface CategoriesPageProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, setCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState(COLORS[0]);
  const [categoryType, setCategoryType] = useState<'expense' | 'income'>('expense');
  const [searchTerm, setSearchTerm] = useState('');
  
  const isCreating = selectedCategory === null && categoryName !== '';

  useEffect(() => {
    if (selectedCategory) {
      setCategoryName(selectedCategory.name);
      setCategoryColor(selectedCategory.color);
      setCategoryType(selectedCategory.type === 'income' ? 'income' : 'expense');
    }
  }, [selectedCategory]);

  const resetForm = () => {
    setSelectedCategory(null);
    setCategoryName('');
    setCategoryColor(COLORS[0]);
    setCategoryType('expense');
  }

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleAddNew = () => {
    setSelectedCategory(null);
    setCategoryName('Nova Categoria'); // Set a temporary name to show the form
    setCategoryColor(COLORS[0]);
    setCategoryType('expense');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
        setCategories(cats => cats.filter(c => c.id !== id));
        if (selectedCategory?.id === id) {
            resetForm();
        }
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!categoryName) return;

    if (selectedCategory) {
      // Edit
      setCategories(cats => cats.map(c => c.id === selectedCategory.id ? { ...c, name: categoryName, color: categoryColor, type: categoryType } : c));
    } else {
      // Add new
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryName,
        color: categoryColor,
        type: categoryType,
      };
      setCategories(cats => [newCategory, ...cats]);
    }
    resetForm();
  };
  
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const showForm = selectedCategory !== null || isCreating;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-text-light dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tighter">Gerenciar Categorias</h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input 
                type="text" 
                placeholder="Buscar categoria..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full rounded-lg pl-10 h-12 bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
            </div>
            <button onClick={handleAddNew} className="flex-shrink-0 flex items-center justify-center rounded-lg h-12 px-4 bg-primary text-text-light hover:bg-primary/90 transition-colors gap-2 text-base font-bold">
              <span className="material-symbols-outlined">add</span>
              <span className="truncate hidden md:inline">Nova</span>
            </button>
          </div>
          <h2 className="text-text-light dark:text-white text-[22px] font-bold tracking-[-0.015em] border-b border-border-light dark:border-border-dark pb-3">Categorias</h2>
          <div className="flex flex-col gap-2">
            {filteredCategories.map(cat => (
              <CategoryItem
                key={cat.id}
                category={cat}
                isActive={selectedCategory?.id === cat.id}
                onSelect={() => handleSelectCategory(cat)}
                onDelete={() => handleDelete(cat.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          {!showForm ? (
            <EmptyState/>
          ) : (
          <div className="bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6 lg:p-8 sticky top-10">
            <h3 className="text-2xl font-bold text-text-light dark:text-white mb-6">{selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2" htmlFor="category-name">Nome da Categoria</label>
                <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark shadow-sm focus:border-primary focus:ring-primary/50" id="category-name" type="text" required />
              </div>
              <div>
                <p className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">Tipo</p>
                <div className="flex h-10 w-full max-w-xs items-center justify-center rounded-lg bg-background-light dark:bg-background-dark p-1">
                    <label className={`flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-sm font-medium ${categoryType === 'expense' ? 'bg-card-light dark:bg-card-dark' : ''}`}>
                        Despesa
                        <input type="radio" name="type" value="expense" checked={categoryType === 'expense'} onChange={() => setCategoryType('expense')} className="hidden" />
                    </label>
                    <label className={`flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-sm font-medium ${categoryType === 'income' ? 'bg-card-light dark:bg-card-dark' : ''}`}>
                        Receita
                        <input type="radio" name="type" value="income" checked={categoryType === 'income'} onChange={() => setCategoryType('income')} className="hidden" />
                    </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">Cor</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {COLORS.map(color => (
                    <button key={color} type="button" onClick={() => setCategoryColor(color)} className={`size-8 rounded-full transition-all ${categoryColor === color ? 'ring-2 ring-offset-2 ring-offset-card-light dark:ring-offset-card-dark ring-primary' : ''}`} style={{backgroundColor: color}}></button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border-light dark:border-border-dark">
                <button type="submit" className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary h-12 px-5 text-text-light text-base font-bold hover:bg-primary/90 transition-colors">Salvar</button>
                <button type="button" onClick={resetForm} className="w-full sm:w-auto flex items-center justify-center rounded-lg bg-gray-200 dark:bg-border-dark h-12 px-5 text-text-light dark:text-text-dark text-base font-medium hover:bg-gray-300 dark:hover:bg-border-dark/70 transition-colors">Cancelar</button>
              </div>
            </form>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;