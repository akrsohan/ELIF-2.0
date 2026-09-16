import React, { useState } from 'react';
import { PRODUCTS } from '../data/catalog';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { language, t, localizeProduct, formatPrice } = useLanguage();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickKeywords =
    language === 'bn'
      ? ['কোকুন কোট', 'কাশ্মীরি শাল', 'টার্টলনেক', 'ট্রেভারটাইন ব্যাগ', 'সিল্ক শার্ট', 'বুটস']
      : [
          'Cocoon Coat',
          'Cashmere',
          'Turtleneck',
          'Travertine Bag',
          'Wool Trouser',
          'Silk Shirt',
          'Ankle Boots',
        ];

  const searchResults = query.trim()
    ? PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        const loc = localizeProduct(p);
        return (
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          loc.name.toLowerCase().includes(q) ||
          loc.subtitle.toLowerCase().includes(q) ||
          loc.category.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="w-full bg-[#faf7eb] p-4 border-b border-[#ded6be] shadow-lg pt-[calc(1rem+env(safe-area-inset-top,0px))] selection:bg-[#d6edd2] selection:text-[#18281b]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#2d6636] text-[20px]">
              search
            </span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full h-12 pl-10 pr-10 rounded-xl bg-[#f1f6ee] border border-[#d6e5d2] text-[#18281b] text-[14px] placeholder:text-[#3a4d3d]/60 focus:outline-none focus:ring-1 focus:ring-[#2d6636]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 text-[#3a4d3d] hover:text-[#18281b] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-3 h-12 text-[12px] font-semibold uppercase tracking-wider text-[#18281b] hover:text-[#2d6636] cursor-pointer active:scale-95 transition-all"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
        </div>

        {/* Quick keywords */}
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d6636] shrink-0">
            {language === 'bn' ? 'পরামর্শ:' : 'Suggested:'}
          </span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#f1f6ee] border border-[#d6e5d2] text-[#18281b] hover:bg-[#d6edd2] hover:border-[#bce4b6] transition-colors shrink-0 cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      <div
        className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full no-scrollbar"
        onClick={onClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          {query.trim() ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#3a4d3d] mb-3">
                {language === 'bn'
                  ? `"${query}" এর জন্য ${searchResults.length}টি ফলাফল পাওয়া গেছে`
                  : `Found ${searchResults.length} ${searchResults.length === 1 ? 'match' : 'matches'} for "${query}"`}
              </p>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((p) => {
                    const locProduct = localizeProduct(p);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-3 bg-[#f1f6ee] rounded-xl border border-[#d6e5d2] hover:border-[#2d6636] transition-all cursor-pointer shadow-xs"
                      >
                        <img
                          src={p.image}
                          alt={locProduct.name}
                          className="w-16 h-20 object-cover rounded-lg bg-[#e7f0e3]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-[14px] font-semibold text-[#18281b] truncate">
                            {locProduct.name}
                          </h4>
                          <p className="text-[11px] text-[#3a4d3d] truncate">
                            {locProduct.subtitle}
                          </p>
                          <p className="text-[14px] font-semibold text-[#2d6636] mt-1">
                            {formatPrice(p.price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center bg-[#f1f6ee] rounded-xl p-6 border border-[#d6e5d2]">
                  <p className="font-display text-[18px] text-[#18281b]">
                    {language === 'bn' ? 'কোনো পোশাক খুঁজে পাওয়া যায়নি' : 'No pieces matched your search'}
                  </p>
                  <p className="text-[12px] text-[#3a4d3d] mt-1">
                    {language === 'bn' ? '"শাল", "কোট", অথবা "সিল্ক" লিখে অনুসন্ধান করুন।' : 'Try searching for "Alpaca", "Turtleneck", or "Trench".'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-[#3a4d3d] text-[13px]">
              {language === 'bn'
                ? 'পোশাকের ধরন বা ম্যাটেরিয়ালের নাম দিয়ে কালেকশন অনুসন্ধান করুন।'
                : 'Type a garment or textile name to search the Autumn Solace ’25 collection.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
