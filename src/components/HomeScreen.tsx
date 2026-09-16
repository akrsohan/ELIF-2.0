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
    <div className="flex flex-col w-full selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* 1. TOP HERO BANNER & TRUST BAR (Tablet & PC Expanded Hero) */}
      <div className="hidden md:block px-3 sm:px-4 mb-8">
        {/* Luxury Editorial Showcase Banner on Tablet & PC */}
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
                  className="h-11 px-5 rounded-xl bg-white/95 hover:bg-white text-[#0f2113] font-black text-[12px] uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all border border-[#afd4a8] shadow-xs hover:shadow-md active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#1c642c]">auto_stories</span>
                  <span>{language === 'bn' ? 'অঁতেলিয়ে ডসিয়ার' : 'Atelier Dossier'}</span>
                </button>
              )}
            </div>

            {/* Micro Provenance Tag */}
            <div className="flex flex-wrap items-center gap-4 text-[11.5px] font-black text-[#1c4422] pt-1">
              <span className="flex items-center gap-1.5">
                <span className="text-[#f59e0b]">★</span>
                <span>4.9/5 Rating (1,400+ Dhaka Clients)</span>
              </span>
              <span className="text-[#88aa8d]">•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#1c642c]">verified</span>
                <span>100% Handcrafted Certified Silks</span>
              </span>
            </div>
          </div>

          {/* Trust Highlights 2x2 Grid (Elevated Cards with Crisp Icons & High Contrast) */}
          <div className="w-full lg:w-[380px] grid grid-cols-2 gap-3 z-10 shrink-0">
            {/* Card 1: Nationwide Delivery */}
            <div className="group bg-white/95 hover:bg-white backdrop-blur-md p-4 rounded-2xl border border-[#badbb3] hover:border-[#1c642c] shadow-[0_2px_10px_rgba(20,40,24,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#e2f2df] group-hover:bg-[#0f2113] group-hover:text-white text-[#1c642c] flex items-center justify-center transition-all shadow-2xs shrink-0">
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1c642c]">
                    {t.trustDelivery}
                  </span>
                </div>
                <p className="text-[13.5px] font-black text-[#0c1a0e] leading-snug">
                  {language === 'bn' ? 'ঢাকা ২৪-৪৮ ঘণ্টায়' : '24–48h in Dhaka'}
                </p>
                <p className="text-[11.5px] text-[#2c5231] font-bold mt-0.5">
                  Pathao / Steadfast
                </p>
              </div>
            </div>

            {/* Card 2: COD & bKash */}
            <div className="group bg-white/95 hover:bg-white backdrop-blur-md p-4 rounded-2xl border border-[#badbb3] hover:border-[#1c642c] shadow-[0_2px_10px_rgba(20,40,24,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#e2f2df] group-hover:bg-[#0f2113] group-hover:text-white text-[#1c642c] flex items-center justify-center transition-all shadow-2xs shrink-0">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1c642c]">
                    {t.trustCod}
                  </span>
                </div>
                <p className="text-[13.5px] font-black text-[#0c1a0e] leading-snug">
                  {language === 'bn' ? 'পণ্য দেখে পেমেন্ট' : 'Inspect Doorstep'}
                </p>
                <p className="text-[11.5px] text-[#2c5231] font-bold mt-0.5">
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি ও বিকাশ' : 'COD & bKash Option'}
                </p>
              </div>
            </div>

            {/* Card 3: Free Exchange */}
            <div className="group bg-white/95 hover:bg-white backdrop-blur-md p-4 rounded-2xl border border-[#badbb3] hover:border-[#1c642c] shadow-[0_2px_10px_rgba(20,40,24,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#e2f2df] group-hover:bg-[#0f2113] group-hover:text-white text-[#1c642c] flex items-center justify-center transition-all shadow-2xs shrink-0">
                    <span className="material-symbols-outlined text-[18px]">published_with_changes</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1c642c]">
                    {t.trustReturn}
                  </span>
                </div>
                <p className="text-[13.5px] font-black text-[#0c1a0e] leading-snug">
                  {language === 'bn' ? 'ফ্রি সাইজ এক্সচেঞ্জ' : 'Complimentary Swap'}
                </p>
                <p className="text-[11.5px] text-[#2c5231] font-bold mt-0.5">
                  {language === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ' : '7-Day Easy Exchange'}
                </p>
              </div>
            </div>

            {/* Card 4: 100% Certified Silk */}
            <div className="group bg-white/95 hover:bg-white backdrop-blur-md p-4 rounded-2xl border border-[#badbb3] hover:border-[#1c642c] shadow-[0_2px_10px_rgba(20,40,24,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#e2f2df] group-hover:bg-[#0f2113] group-hover:text-white text-[#1c642c] flex items-center justify-center transition-all shadow-2xs shrink-0">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1c642c]">
                    {t.trustAuthentic}
                  </span>
                </div>
                <p className="text-[13.5px] font-black text-[#0c1a0e] leading-snug">
                  {language === 'bn' ? 'খাঁটি ও সার্টিফাইড' : '100% Certified Silk'}
                </p>
                <p className="text-[11.5px] text-[#2c5231] font-bold mt-0.5">
                  OEKO-TEX Standard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATALOG HEADER */}
      <div className="px-4 mb-4">
        <div className="mb-3">
          <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.22em] text-[#1b5e28]">
            {t.collectionEyebrow}
          </span>
          <h2 className="font-display font-black text-[28px] sm:text-[36px] text-[#0a180d] tracking-[-0.02em] leading-tight mt-0.5">
            {t.catalogHeading}
          </h2>
          <p className="text-[13px] sm:text-[14.5px] text-[#1c3821] leading-relaxed mt-0.5 font-bold">
            {t.catalogTagline}
          </p>
        </div>

        {/* Category Filter Chips */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
          style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`shrink-0 h-8.5 px-3.5 rounded-full text-[11.5px] font-black uppercase tracking-wider flex items-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f2113] text-white shadow-sm border border-[#0f2113]'
                    : 'bg-[#eaf3e7] text-[#0f2113] hover:bg-[#dcefe0] border border-[#c4e0c0]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between pt-2.5 text-[12px] text-[#1c3821] font-bold border-t border-[#d1e5cd] mt-2">
          <span>
            {formatNumber(filteredProducts.length)} {t.showingItems}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#305335] font-bold">{t.sortBy}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#eaf3e7] border border-[#bedec0] rounded-md px-2.5 py-1 text-[11.5px] font-black text-[#0f2113] focus:outline-none cursor-pointer"
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
          <div className="py-16 text-center bg-[#f1f6ee] rounded-xl border border-[#d6e5d2]">
            <span className="material-symbols-outlined text-[36px] text-[#5c725f] mb-2">
              checkroom
            </span>
            <p className="text-[15px] font-semibold text-[#18281b]">{t.noResults}</p>
            <p className="text-[12px] text-[#3a4d3d] mt-1">
              {language === 'bn'
                ? 'অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা "সব কালেকশন" সিলেক্ট করুন।'
                : 'Try searching with another keyword or select "All Clothing".'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-1.5 rounded-lg bg-[#2d6636] text-white text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
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
                  className="group flex flex-col bg-[#f1f6ee] rounded-xl overflow-hidden shadow-xs transition-all duration-300 border border-[#d6e5d2] hover:shadow-md cursor-pointer hover:border-[#2d6636]/50"
                >
                  {/* Image & Wishlist Container */}
                  <div
                    onClick={() => onOpenProductDetail(product)}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-[#e7f0e3] cursor-pointer"
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
                      className={`absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform shadow-sm cursor-pointer ${
                        isWishlisted ? 'text-[#2d6636]' : 'text-[#18281b]'
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
                            ? 'bg-[#d6edd2] text-[#15381a] border border-[#bce4b6]'
                            : product.tag === 'Limited'
                            ? 'bg-[#2d6636] text-white'
                            : 'bg-[#18281b]/85 backdrop-blur-sm text-white'
                        }`}
                      >
                        {tagLabel}
                      </span>
                    )}
                  </div>

                  {/* Product Details & Actions */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between bg-white/40">
                    <div>
                      <div className="flex items-center justify-between text-[10.5px] text-[#1b5e28] uppercase tracking-wider font-black mb-1">
                        <span>{localized.category}</span>
                        <span className="text-[#15461e] font-black bg-[#d6edd2] px-1.5 py-0.2 rounded-sm text-[9px]">COD AVAILABLE</span>
                      </div>

                      <h3
                        onClick={() => onOpenProductDetail(product)}
                        className="font-display font-black text-[15.5px] sm:text-[16.5px] text-[#0a180d] leading-snug cursor-pointer hover:text-[#1b5e28] transition-colors line-clamp-1"
                      >
                        {localized.name}
                      </h3>

                      <p className="text-[12px] text-[#224027] mt-0.5 line-clamp-1 font-bold">
                        {localized.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#cee2cb] mt-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[9.5px] text-[#305335] block uppercase tracking-wider leading-none font-black">
                          {language === 'bn' ? 'মূল্য' : 'Price'}
                        </span>
                        <span className="text-[16px] sm:text-[17px] font-black text-[#09150c] tracking-tight">
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
                        className="h-8.5 sm:h-9 px-3 sm:px-3.5 rounded-lg bg-[#0f2113] text-white hover:bg-[#1b5e28] font-black text-[10.5px] sm:text-[11.5px] uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
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
