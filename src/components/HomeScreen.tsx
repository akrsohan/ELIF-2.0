import React, { useState } from 'react';
import { Product, TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { PriceDisplay } from './PriceDisplay';

interface HomeScreenProps {
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
  onOpenStory?: () => void;
  onNavigateTab: (tab: TabType, categoryFilter?: string) => void;
  onShowToast: (message: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  wishlistIds,
  onToggleWishlist,
  onQuickAddToCart,
  onOpenProductDetail,
  onOpenStory,
  onNavigateTab,
  onShowToast,
}) => {
  const { language, t, localizeProduct, formatNumber, formatPrice } = useLanguage();
  const { products, categories, isLoading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const dynamicCategories = [
    { key: 'All', label: t.filterAll, count: products.length },
    ...categories.map((c) => ({
      key: c.name,
      label: language === 'bn' ? (c.name_bn || c.name) : c.name,
      count: products.filter((p) => p.category.toLowerCase() === c.name.toLowerCase()).length,
    })),
  ];

  const filteredProducts = products.filter((p) => {
    return (
      selectedCategory === 'All' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(p.category.toLowerCase())
    );
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex flex-col w-full selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* Luxury Editorial Showcase Banner on Tablet & PC */}
      <div className="hidden md:block px-3 sm:px-4 mb-8">
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#e5f3e2] via-[#eef7ec] to-[#dcefe0] text-[#0f2113] p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(24,40,27,0.06)] border border-[#b8dab2] flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle Ambient Background Decorative Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#cbe8c4]/40 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#dfefe0]/60 rounded-full blur-2xl pointer-events-none -z-0" />

          {/* Left Content Area */}
          <div className="max-w-2xl z-10">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#0f2113] bg-[#ffffff]/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#aed2a7] shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1e7e34]"></span>
                </span>
                {language === 'bn' ? 'ঢাকা ফ্ল্যাগশিপ অঁতেলিয়ে' : 'Dhaka Flagship Atelier'}
              </span>
              <span className="text-[#88aa8d] font-bold">•</span>
              <span className="text-[11px] sm:text-[12px] text-[#1b4e25] uppercase tracking-[0.18em] font-black bg-[#d6edd2]/80 px-3 py-1 rounded-full border border-[#bedeb8]">
                {language === 'bn' ? 'অটাম সোলাস ’২৫ কালেকশন' : 'Autumn Solace ’25 Collection'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-[30px] sm:text-[38px] lg:text-[45px] leading-[1.14] tracking-[-0.03em] text-[#0b1b0e] mb-3.5">
              {language === 'bn'
                ? 'বাঙালি ঐতিহ্য ও আধুনিক টেইলরিংয়ের মেলবন্ধন'
                : 'Refined Bangladeshi Craft & Modern Tailoring'}
            </h1>

            {/* Description Subtitle */}
            <p className="text-[14px] sm:text-[15.5px] text-[#1c3c22] leading-relaxed mb-6 font-bold">
              {language === 'bn' ? (
                <>
                  <span className="font-black text-[#0b1b0e]">রাজশাহী র সিল্ক</span>, কাশ্মীরি উল ও বেলজিয়ান লিনেনের নিখুঁত কারুকাজ। সারাদেশে{' '}
                  <span className="font-black text-[#0b1b0e]">ক্যাশ অন ডেলিভারি (COD)</span> এবং ঢাকায়{' '}
                  <span className="font-black text-[#0b1b0e]">২৪-৪৮ ঘণ্টায় এক্সপ্রেস হোম ডেলিভারি</span>।
                </>
              ) : (
                <>
                  Pure silhouettes marrying{' '}
                  <span className="font-black text-[#0b1b0e]">Bengal raw mulberry silks</span>, fine alpaca, and unbleached European wool. Supported by doorstep{' '}
                  <span className="font-black text-[#0b1b0e]">Cash on Delivery</span> and{' '}
                  <span className="font-black text-[#0b1b0e]">24h Dhaka express dispatch</span>.
                </>
              )}
            </p>

            {/* Action Buttons & Quick Trust Assurance */}
            <div className="flex flex-wrap items-center gap-3.5 mb-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  const el = document.getElementById('catalog-grid-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-11 px-6 rounded-xl bg-[#0f2113] hover:bg-[#1f4726] text-white font-black text-[12px] uppercase tracking-wider flex items-center gap-2.5 cursor-pointer transition-all shadow-[0_4px_14px_rgba(15,33,19,0.25)] hover:shadow-lg active:scale-95 group"
              >
                <span>{language === 'bn' ? 'পোশাক কালেকশন দেখুন' : 'Explore Silhouettes'}</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-y-0.5 transition-transform">
                  arrow_downward
                </span>
              </button>
              {onOpenStory && (
                <button
                  type="button"
                  onClick={onOpenStory}
                  className="h-11 px-5 rounded-xl bg-[#ffffff]/90 hover:bg-[#ffffff] text-[#0f2113] font-black text-[12px] uppercase tracking-wider flex items-center gap-2 cursor-pointer border border-[#bedeb8] transition-all shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#1b4e25]">auto_stories</span>
                  <span>{language === 'bn' ? 'অঁতেলিয়ে গল্প' : 'Atelier Heritage'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Grid Section */}
      <section id="catalog-grid-section" className="px-3 sm:px-4 mb-12">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {dynamicCategories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.key
                  ? 'bg-[#0f2113] text-white shadow-xs'
                  : 'bg-[#edf6eb] text-[#1c3c22] hover:bg-[#dcf0dc]'
              }`}
            >
              {c.label} ({formatNumber(c.count)})
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-3 border border-[#bedeb8] animate-pulse">
                <div className="aspect-[3/4] bg-[#edf6eb] rounded-xl mb-3" />
                <div className="h-4 bg-[#edf6eb] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#edf6eb] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const localized = localizeProduct(product);
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="rounded-2xl bg-white border border-[#bedeb8] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div
                    onClick={() => onOpenProductDetail(product)}
                    className="relative aspect-[3/4] bg-[#edf6eb] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={localized.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isWishlisted ? 'bg-[#0f2113] text-white' : 'bg-white/90 text-[#0f2113] hover:bg-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isWishlisted ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#1b5e28] block mb-0.5">
                        {localized.category}
                      </span>
                      <h3
                        onClick={() => onOpenProductDetail(product)}
                        className="font-display font-black text-[14px] sm:text-[16px] text-[#0f2113] line-clamp-1 cursor-pointer hover:underline"
                      >
                        {localized.name}
                      </h3>
                      <p className="text-[11px] sm:text-[12px] text-[#2c4e31] line-clamp-1 mt-0.5 font-medium">
                        {localized.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#edf4ea] mt-3 flex items-center justify-between">
                      <PriceDisplay
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        size="md"
                        layout="stacked"
                        showDiscountBadge={true}
                      />
                      <button
                        type="button"
                        onClick={() => onQuickAddToCart(product)}
                        className="px-3 py-1.5 rounded-lg bg-[#0f2113] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#1b5e28] transition-colors cursor-pointer"
                      >
                        {language === 'bn' ? '+ ব্যাগ' : '+ Bag'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#bedec0] p-6">
            <span className="material-symbols-outlined text-[42px] text-[#1b5e28] mb-2 opacity-60">inventory_2</span>
            <h3 className="font-display font-black text-[18px] text-[#0f2113]">
              {language === 'bn' ? 'কোনো পোশাক পাওয়া যায়নি' : 'No garments found'}
            </h3>
            <p className="text-[12.5px] text-[#2c4e31] mt-1">
              {language === 'bn'
                ? 'সুপাবেস ডাটাবেসে পোশাক যোগ করার পর এখানে প্রদর্শিত হবে।'
                : 'Garments added in Supabase will appear here.'}
            </p>
          </div>
        )}
      </section>

      {/* Clean Trust Assurance */}
      <div className="w-full px-4 pb-8">
        <div className="bg-[#eaf3e7] rounded-2xl p-5 border border-[#badbb3] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center shadow-xs">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-white text-[#1b5e28] flex items-center justify-center mb-1.5 shadow-2xs border border-[#badbb3]">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <p className="text-[13px] font-black text-[#0a180d]">{t.trustDelivery}</p>
            <p className="text-[11px] text-[#224027] font-bold">{t.trustDeliverySub}</p>
          </div>

          <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-l sm:border-r border-[#c4e0c0] pt-3 sm:pt-0">
            <div className="w-9 h-9 rounded-xl bg-white text-[#1b5e28] flex items-center justify-center mb-1.5 shadow-2xs border border-[#badbb3]">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <p className="text-[13px] font-black text-[#0a180d]">{t.trustCod}</p>
            <p className="text-[11px] text-[#224027] font-bold">{t.trustCodSub}</p>
          </div>

          <div className="flex flex-col items-center border-t sm:border-t-0 border-[#c4e0c0] pt-3 sm:pt-0">
            <div className="w-9 h-9 rounded-xl bg-white text-[#1b5e28] flex items-center justify-center mb-1.5 shadow-2xs border border-[#badbb3]">
              <span className="material-symbols-outlined text-[20px]">published_with_changes</span>
            </div>
            <p className="text-[13px] font-black text-[#0a180d]">{t.trustReturn}</p>
            <p className="text-[11px] text-[#224027] font-bold">{t.trustReturnSub}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
