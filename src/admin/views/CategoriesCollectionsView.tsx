import React, { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import {
  AdminCategory,
  AdminCollection,
  AdminView,
} from '../types';

interface CategoriesCollectionsViewProps {
  categories: AdminCategory[];
  collections: AdminCollection[];
  onNavigate: (view: AdminView) => void;
  onShowToast: (msg: string) => void;
}

export const CategoriesCollectionsView: React.FC<CategoriesCollectionsViewProps> = ({
  categories,
  collections,
  onNavigate,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'collections'>('categories');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameBn, setNewCatNameBn] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onShowToast(`Category "${newCatName}" created.`);
    setNewCatName('');
    setNewCatNameBn('');
    setIsAddCategoryOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Categories & Editorial Collections
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Curate garment classifications, seasonal capsule stories, and lookbook themes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddCategoryOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>
              {activeTab === 'categories' ? '+ Add Category' : '+ New Collection'}
            </span>
          </button>
        </div>
      </div>

      {/* Switcher Tabs */}
      <div className="flex gap-2 border-b border-[#ded6be]/80 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-t-xl text-[13px] font-bold transition-all cursor-pointer border-b-2 ${
            activeTab === 'categories'
              ? 'border-[#18281b] text-[#18281b] bg-white'
              : 'border-transparent text-[#5c725f] hover:text-[#18281b]'
          }`}
        >
          Apparel Categories ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2 rounded-t-xl text-[13px] font-bold transition-all cursor-pointer border-b-2 ${
            activeTab === 'collections'
              ? 'border-[#18281b] text-[#18281b] bg-white'
              : 'border-transparent text-[#5c725f] hover:text-[#18281b]'
          }`}
        >
          Capsule Collections ({collections.length})
        </button>
      </div>

      {/* Categories Tab Content */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs flex flex-col justify-between hover:border-[#18281b] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold bg-[#faf7ed] border border-[#ded6be] px-2 py-0.5 rounded text-[#5c725f]">
                    Slug: /{cat.slug}
                  </span>
                  <StatusBadge status={cat.status} />
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#ded6be]/70 shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[14px] text-[#18281b] group-hover:text-[#2d6636] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-[#849685]">{cat.nameBn}</p>
                  </div>
                </div>

                <p className="text-[11px] text-[#5c725f] leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#f1f6ee] flex items-center justify-between mt-4">
                <span className="text-[11px] font-semibold text-[#18281b]">
                  {cat.productCount} Garments Allocated
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onShowToast(`Editing category: ${cat.name}`)}
                    className="p-1.5 rounded-lg hover:bg-[#faf7ed] text-[#5c725f] hover:text-[#18281b] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collections Tab Content */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={col.heroImage}
                  alt={col.name}
                  className="w-20 h-20 rounded-xl object-cover border border-[#ded6be]/70 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[17px] font-bold text-[#18281b]">{col.name}</h3>
                    <StatusBadge status={col.status} />
                  </div>
                  <p className="text-[11px] text-[#849685]">
                    {col.nameBn} • Season: <strong className="text-[#18281b]">{col.season}</strong>
                  </p>
                  <p className="text-[12px] text-[#5c725f] mt-1 max-w-xl">{col.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                <span className="text-[12px] font-bold text-[#18281b]">
                  {col.productCount} Pieces
                </span>
                <button
                  type="button"
                  onClick={() => onShowToast(`Opened collection editor for ${col.name}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#f1f6ee] hover:bg-[#18281b] hover:text-white text-[#18281b] text-[11px] font-semibold border border-[#d6edd2] transition-colors cursor-pointer"
                >
                  Edit Capsule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#ded6be] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f6ee] pb-3">
              <h3 className="font-serif text-[17px] font-bold text-[#18281b]">
                Add Garment Category
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-[#849685] hover:text-[#18281b]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  placeholder="e.g. Artisanal Footwear"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
                  Category Name (বাংলা)
                </label>
                <input
                  type="text"
                  value={newCatNameBn}
                  onChange={(e) => setNewCatNameBn(e.target.value)}
                  placeholder="যেমন: লেদার ফুটওয়্যার"
                  className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#5c725f] hover:bg-[#f1f6ee]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#18281b] text-white font-semibold hover:bg-[#283d2b] transition-colors"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
