import React, { useState } from 'react';
import { PRODUCTS } from '../data/catalog';
import { Product } from '../types';

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
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickKeywords = [
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
        return (
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="w-full bg-[#fff9ee] p-4 border-b border-[#e8e2d8] shadow-lg pt-[calc(1rem+env(safe-area-inset-top,0px))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#7d5700] text-[20px]">
              search
            </span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by silhouette, garment, or textile..."
              className="w-full h-12 pl-10 pr-10 rounded-xl bg-[#f3ede3] border border-[#cec5bd] text-[#1d1b15] text-[14px] placeholder:text-[#4b4640]/60 focus:outline-none focus:ring-1 focus:ring-[#7d5700]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 text-[#4b4640] hover:text-[#1d1b15] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-3 h-12 text-[12px] font-semibold uppercase tracking-wider text-[#1d1b15] hover:text-[#7d5700] cursor-pointer active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>

        {/* Quick keywords */}
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5700] shrink-0">
            Suggested:
          </span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#ede7dd] text-[#1d1b15] hover:bg-[#ffc55f] hover:text-[#755100] transition-colors shrink-0 cursor-pointer"
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
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4b4640] mb-3">
                Found {searchResults.length}{' '}
                {searchResults.length === 1 ? 'match' : 'matches'} for "{query}"
              </p>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 bg-[#f3ede3] rounded-xl border border-[#e8e2d8] hover:border-[#7d5700] transition-all cursor-pointer shadow-sm"
                    >
                      <img
                        src={p.image}
                        alt={p.alt}
                        className="w-16 h-20 object-cover rounded-lg bg-[#ede7dd]"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-semibold text-[#1d1b15] truncate">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-[#4b4640] truncate">
                          {p.subtitle}
                        </p>
                        <p className="text-[14px] font-semibold text-[#7d5700] mt-1">
                          {p.currency}
                          {p.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-[#f3ede3] rounded-xl p-6 border border-[#e8e2d8]">
                  <p className="font-display text-[18px] text-[#1d1b15]">
                    No pieces matched your search
                  </p>
                  <p className="text-[12px] text-[#4b4640] mt-1">
                    Try searching for "Alpaca", "Turtleneck", or "Trench".
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-[#4b4640] text-[13px]">
              Type a garment or textile name to search the Autumn Solace ’25 collection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
