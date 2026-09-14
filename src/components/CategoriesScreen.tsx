import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { Product } from '../types';

interface CategoriesScreenProps {
  initialCategory?: string;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
  onShowToast: (message: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  initialCategory,
  wishlistIds,
  onToggleWishlist,
  onQuickAddToCart,
  onOpenProductDetail,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const materials = ['All', 'Baby Alpaca', 'Cashmere', 'Raw Silk', 'Virgin Wool', 'Calfskin', 'Belgian Linen'];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' ||
      p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      activeCategory.toLowerCase().includes(p.category.toLowerCase());

    const matchesMaterial =
      selectedMaterial === 'All' ||
      p.fabric.toLowerCase().includes(selectedMaterial.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(selectedMaterial.toLowerCase());

    return matchesCategory && matchesMaterial;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-16 selection:bg-[#ffdeaa]">
      {/* Screen Title */}
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700]">
          Haute Catalog
        </span>
        <h1 className="font-display text-[28px] sm:text-[32px] text-[#1d1b15] tracking-tight">
          Curated Departments
        </h1>
        <p className="text-[13px] text-[#4b4640] max-w-[360px] mt-1">
          Explore architectural cuts, heritage textiles, and timeless silhouettes.
        </p>
      </div>

      {/* Category Pills */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar mb-4"
        style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
      >
        {['All', ...CATEGORIES.map((c) => c.name)].map((catName) => {
          const isSelected = activeCategory === catName;
          return (
            <button
              key={catName}
              onClick={() => setActiveCategory(catName)}
              className={`shrink-0 h-9 px-4 rounded-full text-[11px] font-semibold uppercase tracking-wider flex items-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1d1b19] text-white shadow-sm'
                  : 'bg-[#f3ede3] text-[#1d1b15] hover:bg-[#ede7dd]'
              }`}
            >
              {catName}
            </button>
          );
        })}
        <div className="w-2 shrink-0" aria-hidden="true" />
      </div>

      {/* Material Sub-filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#f3ede3] rounded-xl border border-[#e8e2d8] mb-6">
        {/* Textile Dropdown / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5700] shrink-0">
            Textile:
          </span>
          {materials.slice(0, 5).map((mat) => (
            <button
              key={mat}
              onClick={() => setSelectedMaterial(mat)}
              className={`shrink-0 text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                selectedMaterial === mat
                  ? 'bg-[#ffc55f] text-[#755100] border-[#ffc55f]'
                  : 'bg-white text-[#4b4640] border-[#cec5bd] hover:border-[#7d5700]'
              }`}
            >
              {mat}
            </button>
          ))}
          <div className="w-1 shrink-0" aria-hidden="true" />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4b4640]">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white text-[#1d1b15] text-[11px] font-semibold py-1.5 px-2 rounded-lg border border-[#cec5bd] focus:outline-none focus:ring-1 focus:ring-[#7d5700] cursor-pointer"
          >
            <option value="featured">Editorial Curation</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-10">
        {filteredProducts.map((product) => {
          const isWishlisted = wishlistIds.includes(product.id);
          return (
            <div
              key={product.id}
              className="flex flex-col bg-[#f3ede3] rounded-xl p-2.5 shadow-sm border border-[#e8e2d8] group transition-all"
            >
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#ede7dd] mb-2.5">
                <img
                  onClick={() => onOpenProductDetail(product)}
                  className="w-full h-full object-cover cursor-pointer group-hover:scale-104 transition-transform duration-500"
                  src={product.image}
                  alt={product.alt}
                  loading="lazy"
                />

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label={`Toggle wishlist for ${product.name}`}
                  className={`absolute top-2 right-2 w-9 h-9 rounded-full bg-[#fff9ee]/85 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform shadow-sm cursor-pointer ${
                    isWishlisted ? 'text-[#7d5700]' : 'text-[#1d1b15]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{
                      fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                </button>

                {product.tag && (
                  <span
                    className={`absolute bottom-2 left-2 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                      product.tag === 'Best Seller'
                        ? 'bg-[#ffc55f] text-[#755100]'
                        : 'bg-[#1d1b19]/85 text-white backdrop-blur-sm'
                    }`}
                  >
                    {product.tag}
                  </span>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <h3
                  onClick={() => onOpenProductDetail(product)}
                  className="text-[14px] font-semibold text-[#1d1b15] truncate cursor-pointer hover:text-[#7d5700] transition-colors"
                >
                  {product.name}
                </h3>
                <p className="text-[11px] text-[#4b4640] mb-2 line-clamp-1">
                  {product.subtitle}
                </p>

                <div className="flex items-center justify-between mt-auto pt-1 border-t border-[#e8e2d8]/80">
                  <span className="text-[15px] font-semibold text-[#1d1b15]">
                    {product.currency}
                    {product.price.toLocaleString()}
                  </span>

                  <button
                    onClick={() => onQuickAddToCart(product)}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-[#e8e2d8] text-[#1d1b15] flex items-center justify-center active:bg-[#7d5700] active:text-white transition-all cursor-pointer hover:bg-[#ffc55f] hover:text-[#755100]"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-16 text-center bg-[#f3ede3] rounded-xl border border-[#e8e2d8] p-6">
          <p className="font-display text-[20px] text-[#1d1b15] mb-2">
            No pieces match this filter
          </p>
          <p className="text-[13px] text-[#4b4640] mb-4">
            Try resetting your material or category selection.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSelectedMaterial('All');
            }}
            className="h-10 px-5 rounded-lg bg-[#1d1b19] text-white text-[11px] font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
