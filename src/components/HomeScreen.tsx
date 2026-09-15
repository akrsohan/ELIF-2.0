import React, { useState } from 'react';
import { PRODUCTS } from '../data/catalog';
import { Product, TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories = [
    { key: 'All', label: t.filterAll, count: PRODUCTS.length },
    { key: 'Outerwear', label: language === 'bn' ? 'ওভারওয়্যার ও জ্যাকেট' : 'Coats & Outerwear' },
    { key: 'Knitwear', label: language === 'bn' ? 'নিটওয়্যার ও সোয়েটার' : 'Knitwear & Sweaters' },
    { key: 'Silk & Shirting', label: language === 'bn' ? 'সিল্ক ও শার্ট' : 'Silk & Shirts' },
    { key: 'Trousers', label: language === 'bn' ? 'ট্রাউজার্স ও প্যান্ট' : 'Pants & Trousers' },
    { key: 'Leather Goods', label: language === 'bn' ? 'লেদার ব্যাগ ও সামগ্রী' : 'Leather & Bags' },
    { key: 'Footwear', label: language === 'bn' ? 'হ্যান্ডমেড জুতা' : 'Footwear' },
  ];

  const filteredProducts = PRODUCTS.filter((p) => {
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
    <div className="flex flex-col w-full selection:bg-[#ffdeaa] selection:text-[#271900]">
      {/* 1. TOP HERO BANNER & TRUST BAR (Visible on Tablet & PC, hidden on mobile) */}
      <div className="hidden md:block px-3 sm:px-4 mb-6">
        {/* Luxury Editorial Showcase Banner on Tablet & PC */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#1d1b19] text-white p-5 sm:p-7 lg:p-9 shadow-md border border-[#3e3833] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffc55f]">
                {language === 'bn' ? 'ঢাকা ফ্ল্যাগশিপ অঁতেলিয়ে' : 'Dhaka Flagship Atelier'}
              </span>
              <span className="text-[#878380]">•</span>
              <span className="text-[10px] sm:text-[11px] text-[#cec5bd] uppercase tracking-wider">
                {language === 'bn' ? 'অটাম সোলাস ’২৫' : 'Autumn Solace ’25'}
              </span>
            </div>
            <h1 className="font-display text-[24px] sm:text-[32px] lg:text-[38px] leading-tight font-medium text-white mb-2.5">
              {language === 'bn' ? 'বাঙালি ঐতিহ্য ও আধুনিক টেইলরিংয়ের মেলবন্ধন' : 'Refined Bangladeshi Craft & Modern Tailoring'}
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#cec5bd] leading-relaxed mb-4">
              {language === 'bn'
                ? 'রাজশাহী সিল্ক, কাশ্মীরি উল ও বেলজিয়ান লিনেনে বোনা প্রিমিয়াম পোশাক। ক্যাশ অন ডেলিভারি (COD) এবং ঢাকা সিটিতে ২৪-৪৮ ঘণ্টায় এক্সপ্রেস হোম ডেলিভারি সুবিধা।'
                : 'Pure silhouettes marrying Bengal raw mulberry silks, fine alpaca, and unbleached European wool. Supported by doorstep Cash on Delivery and 24h Dhaka express dispatch.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  const el = document.getElementById('catalog-grid-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-[#ffc55f] text-[#755100] hover:bg-[#ffdeaa] font-semibold text-[11px] sm:text-[12px] uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <span>{language === 'bn' ? 'পোশাক কালেকশন দেখুন' : 'Explore Silhouettes'}</span>
                <span className="material-symbols-outlined text-[17px]">arrow_downward</span>
              </button>
              {onOpenStory && (
                <button
                  type="button"
                  onClick={onOpenStory}
                  className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] sm:text-[12px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border border-white/20"
                >
                  <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                  <span>{language === 'bn' ? 'অঁতেলিয়ে ডসিয়ার' : 'Atelier Dossier'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Trust Highlights Grid (2 cols on mobile, 4 cols on PC) */}
          <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2.5 z-10 shrink-0">
            <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-[#ffc55f] mb-1">
                <span className="material-symbols-outlined text-[17px]">local_shipping</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{t.trustDelivery}</span>
              </div>
              <p className="text-[11px] sm:text-[12px] text-white font-semibold">
                {language === 'bn' ? 'ঢাকা ২৪-৪৮ ঘণ্টায়' : '24-48h in Dhaka'}
              </p>
              <p className="text-[10px] text-[#a8a199]">Pathao / Steadfast</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-[#ffc55f] mb-1">
                <span className="material-symbols-outlined text-[17px]">payments</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{t.trustCod}</span>
              </div>
              <p className="text-[11px] sm:text-[12px] text-white font-semibold">
                {language === 'bn' ? 'পণ্য দেখে পেমেন্ট' : 'Inspect Doorstep'}
              </p>
              <p className="text-[10px] text-[#a8a199]">
                {language === 'bn' ? 'সারাদেশে হোম ডেলিভারি' : 'Nationwide Service'}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-[#ffc55f] mb-1">
                <span className="material-symbols-outlined text-[17px]">sync</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{t.trustReturn}</span>
              </div>
              <p className="text-[11px] sm:text-[12px] text-white font-semibold">
                {language === 'bn' ? 'ফ্রি সাইজ এক্সচেঞ্জ' : 'Hassle-Free Exchange'}
              </p>
              <p className="text-[10px] text-[#a8a199]">
                {language === 'bn' ? 'সহজ এক্সচেঞ্জ পলিসি' : 'Easy Exchange Policy'}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-[#ffc55f] mb-1">
                <span className="material-symbols-outlined text-[17px]">verified</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{t.trustAuthentic}</span>
              </div>
              <p className="text-[11px] sm:text-[12px] text-white font-semibold">
                {language === 'bn' ? 'খাঁটি ও সার্টিফাইড' : '100% Certified Silk'}
              </p>
              <p className="text-[10px] text-[#a8a199]">OEKO-TEX Standard</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATALOG HEADER */}
      <div className="px-4 mb-4">
        <div className="mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700]">
            {t.collectionEyebrow}
          </span>
          <h1 className="font-display text-[26px] sm:text-[32px] text-[#1d1b15] tracking-tight leading-tight">
            {t.catalogHeading}
          </h1>
          <p className="text-[12.5px] sm:text-[13.5px] text-[#5c544d] leading-relaxed mt-0.5">
            {t.catalogTagline}
          </p>
        </div>

        {/* Category Filter Chips */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
          style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`shrink-0 h-8 px-3 rounded-full text-[11px] font-semibold uppercase tracking-wider flex items-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1d1b19] text-white shadow-sm'
                    : 'bg-[#f3ede3] text-[#1d1b15] hover:bg-[#ede7dd]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-[#4b4640] border-t border-[#e8e2d8]/80 mt-2">
          <span>
            {formatNumber(filteredProducts.length)} {t.showingItems}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#7d766f]">{t.sortBy}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f3ede3] border border-[#cec5bd] rounded-md px-2 py-1 text-[11px] font-medium text-[#1d1b15] focus:outline-none cursor-pointer"
            >
              <option value="featured">{t.sortFeatured}</option>
              <option value="price-asc">{t.sortPriceLow}</option>
              <option value="price-desc">{t.sortPriceHigh}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY CLOTHING PRODUCT GRID */}
      <section id="catalog-grid-section" className="w-full px-3 sm:px-4 mb-12">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#f3ede3] rounded-xl border border-[#e8e2d8]">
            <span className="material-symbols-outlined text-[36px] text-[#7d766f] mb-2">
              checkroom
            </span>
            <p className="text-[15px] font-semibold text-[#1d1b15]">{t.noResults}</p>
            <p className="text-[12px] text-[#4b4640] mt-1">
              {language === 'bn'
                ? 'অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা "সব কালেকশন" সিলেক্ট করুন।'
                : 'Try searching with another keyword or select "All Clothing".'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-1.5 rounded-lg bg-[#1d1b19] text-white text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
            >
              {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product) => {
              const localized = localizeProduct(product);
              const isWishlisted = wishlistIds.includes(product.id);
              const tagLabel =
                product.tag === 'Best Seller'
                  ? t.tagBestSeller
                  : product.tag === 'Limited'
                  ? t.tagLimited
                  : product.tag === 'New'
                  ? t.tagNew
                  : product.tag === 'Archive'
                  ? t.tagArchive
                  : product.tag;

              return (
                <div
                  key={product.id}
                  onClick={() => onOpenProductDetail(product)}
                  className="group flex flex-col bg-[#f3ede3] rounded-xl overflow-hidden shadow-sm transition-all duration-300 border border-[#e8e2d8] hover:shadow-md cursor-pointer"
                >
                  {/* Image & Wishlist Container */}
                  <div
                    onClick={() => onOpenProductDetail(product)}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-[#ede7dd] cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                    />

                    {/* Wishlist button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      aria-label={`${t.wishlistLabel}: ${localized.name}`}
                      className={`absolute top-2 right-2 w-9 h-9 rounded-full bg-[#fff9ee]/90 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform shadow-sm cursor-pointer ${
                        isWishlisted ? 'text-[#7d5700]' : 'text-[#1d1b15]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[19px] transition-colors"
                        style={{
                          fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Badges */}
                    {product.tag && (
                      <span
                        className={`absolute bottom-2 left-2 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                          product.tag === 'Best Seller'
                            ? 'bg-[#ffc55f] text-[#755100]'
                            : product.tag === 'Limited'
                            ? 'bg-[#7d5700] text-white'
                            : 'bg-[#1d1b19]/85 backdrop-blur-sm text-white'
                        }`}
                      >
                        {tagLabel}
                      </span>
                    )}
                  </div>

                  {/* Product Details & Actions */}
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-[#7d5700] uppercase tracking-wider font-semibold mb-0.5">
                        <span>{localized.category}</span>
                        <span className="text-[#2e7d32] font-medium">COD</span>
                      </div>

                      <h3
                        onClick={() => onOpenProductDetail(product)}
                        className="text-[14px] sm:text-[15px] font-semibold text-[#1d1b15] leading-snug cursor-pointer hover:text-[#7d5700] transition-colors line-clamp-1"
                      >
                        {localized.name}
                      </h3>

                      <p className="text-[11px] text-[#4b4640] mt-0.5 line-clamp-1">
                        {localized.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#cec5bd]/50 mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-[#7d766f] block uppercase tracking-wider leading-none">
                          {language === 'bn' ? 'মূল্য' : 'Price'}
                        </span>
                        <span className="text-[15px] sm:text-[16px] font-bold text-[#1d1b15] font-display">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProductDetail(product);
                        }}
                        aria-label={`View details for ${localized.name}`}
                        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-[#1d1b19] text-white hover:bg-[#34302c] font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all shadow-sm cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                        <span>{t.viewDetails}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. CLEAN TRUST & ASSURANCE FOOTER */}
      <div className="w-full px-4 pb-6">
        <div className="bg-[#f3ede3] rounded-xl p-4 border border-[#e8e2d8] grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[20px] text-[#7d5700] mb-1">
              local_shipping
            </span>
            <p className="text-[12px] font-bold text-[#1d1b15]">{t.trustDelivery}</p>
            <p className="text-[10px] text-[#4b4640]">{t.trustDeliverySub}</p>
          </div>

          <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-l sm:border-r border-[#e8e2d8] pt-2 sm:pt-0">
            <span className="material-symbols-outlined text-[20px] text-[#2e7d32] mb-1">
              payments
            </span>
            <p className="text-[12px] font-bold text-[#1d1b15]">{t.trustCod}</p>
            <p className="text-[10px] text-[#4b4640]">{t.trustCodSub}</p>
          </div>

          <div className="flex flex-col items-center border-t sm:border-t-0 border-[#e8e2d8] pt-2 sm:pt-0">
            <span className="material-symbols-outlined text-[20px] text-[#7d5700] mb-1">
              published_with_changes
            </span>
            <p className="text-[12px] font-bold text-[#1d1b15]">{t.trustReturn}</p>
            <p className="text-[10px] text-[#4b4640]">{t.trustReturnSub}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
