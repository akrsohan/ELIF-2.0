import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ArrowRight,
  BookOpen,
  Calendar,
  ShieldCheck,
  Truck,
  CreditCard,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { getProductSlug } from '../utils/slug';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t, localizeProduct, localizeCategory, formatNumber, formatPrice } = useLanguage();
  const { products, categories, isLoadingCatalog, wishlistIds, toggleWishlist, setStoryModalOpen } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categoryChips = [
    { key: 'All', label: t.filterAll },
    ...categories.map((c) => ({
      key: c.name,
      label: localizeCategory(c.name),
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
      {/* 1. LUXURY EDITORIAL SHOWCASE BANNER (Visible on Desktop/Tablet only, Hidden on Mobile) */}
      <div className="hidden md:block mb-6 sm:mb-8">
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#e5f3e2] via-[#eef7ec] to-[#dcefe0] text-[#0f2113] p-5 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(24,40,27,0.06)] border border-[#b8dab2] flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Subtle Ambient Background Decorative Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#cbe8c4]/40 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#dfefe0]/60 rounded-full blur-2xl pointer-events-none -z-0" />

          {/* Left Content Area */}
          <div className="max-w-2xl z-10">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#0f2113] bg-[#ffffff]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#aed2a7] shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1e7e34]"></span>
                </span>
                {language === 'bn' ? 'ঢাকা ফ্ল্যাগশিপ অঁতেলিয়ে' : 'Dhaka Flagship Atelier'}
              </span>
              <span className="text-[#88aa8d] font-bold">•</span>
              <Link
                to="/collections/autumn-solace"
                className="text-[10.5px] sm:text-[12px] text-[#1b4e25] uppercase tracking-[0.18em] font-black bg-[#d6edd2]/80 hover:bg-[#c3e4be] px-3 py-1 rounded-full border border-[#bedeb8] transition-colors"
              >
                {language === 'bn' ? 'অটাম সোলাস ’২৫ কালেকশন' : 'Autumn Solace ’25'}
              </Link>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-[26px] sm:text-[38px] lg:text-[45px] leading-[1.14] tracking-[-0.03em] text-[#0b1b0e] mb-3">
              {language === 'bn'
                ? 'বাঙালি ঐতিহ্য ও আধুনিক টেইলরিংয়ের মেলবন্ধন'
                : 'Refined Bangladeshi Craft & Modern Tailoring'}
            </h1>

            {/* Description Subtitle */}
            <p className="text-[13.5px] sm:text-[15.5px] text-[#1c3c22] leading-relaxed mb-5 font-bold">
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

            {/* Action Buttons & Quick Navigation */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                to="/shop"
                className="h-11 px-6 rounded-xl bg-[#0f2113] hover:bg-[#1f4726] text-white font-black text-[12px] uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 group"
              >
                <span>{language === 'bn' ? 'সব পোশাক দেখুন' : 'Explore All Pieces'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/atelier"
                className="h-11 px-5 rounded-xl bg-white/95 hover:bg-white text-[#0f2113] font-black text-[12px] uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all border border-[#afd4a8] shadow-xs active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-[#1c642c]" />
                <span>{language === 'bn' ? 'অঁতেলিয়ে ডসিয়ার' : 'Atelier Dossier'}</span>
              </Link>

              <Link
                to="/salon"
                className="h-11 px-4 rounded-xl bg-[#dcf0dc] hover:bg-[#cbe8cb] text-[#0f2113] font-black text-[12px] uppercase tracking-wider flex items-center gap-1.5 transition-all border border-[#afd4a8]"
              >
                <Calendar className="w-4 h-4 text-[#1c642c]" />
                <span>{language === 'bn' ? 'স্যালন ফিটিং' : 'Salon Fitting'}</span>
              </Link>
            </div>

            {/* Micro Provenance Tag */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-black text-[#1c4422] pt-1">
              <span className="flex items-center gap-1">
                <span className="text-[#f59e0b]">★</span>
                <span>4.9/5 Rating (1,400+ Clients in Bangladesh)</span>
              </span>
              <span className="text-[#88aa8d]">•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#1c642c]" />
                <span>100% Handcrafted Certified Silks</span>
              </span>
            </div>
          </div>

          {/* Trust Highlights 2x2 Grid */}
          <div className="w-full lg:w-[380px] grid grid-cols-2 gap-2.5 sm:gap-3 z-10 shrink-0">
            {/* Card 1: Nationwide Delivery */}
            <div className="group bg-white/95 hover:bg-white backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#badbb3] hover:border-[#1c642c] shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#e2f2df] group-hover:bg-[#0f2113] group-hover:text-white text-[#1c642c] flex items-center justify-center transition-all shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-[#1c642c]">
                    {t.trustDelivery}
                  </span>
                </div>
                <p className="text-[13px] sm:text-[13.5px] font-black text-[#0c1a0e] leading-snug">
                  {language === 'bn' ? 'ঢাকা ২৪-৪৮ ঘণ্টায়' : '24–48h in Dhaka'}
                </p>
                <p className="text-[11px] text-[#2c5231] font-bold mt-0.5">
                  Pathao / Steadfast
                </p>
              </div>
            </div>

            {/* Card 2: COD & bKash */}
            <div className="group bg-white/95 hover:bg-white backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#badbb3] hover:border-[#1c642c] shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#e2f2df] group-hover:bg-[#0f2113] group-hover:text-white text-[#1c642c] flex items-center justify-center transition-all shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-[#1c642c]">
                    {t.trustCod}
                  </span>
                </div>
                <p className="text-[13px] sm:text-[13.5px] font-black text-[#0c1a0e] leading-snug">
                  {language === 'bn' ? 'পণ্য দেখে পেমেন্ট' : 'Inspect Doorstep'}
                </p>
                <p className="text-[11px] text-[#2c5231] font-bold mt-0.5">
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি ও বিকাশ' : 'COD & bKash Option'}
                </p>
              </div>
            </div>

            {/* Card 3: Free Exchange */}
            <div className="group bg-white/95 hover:bg-white backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#badbb3] hover:border-[#1c642c] shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#e2f2df] group-hover:bg-[#0f2113] group-hover:text-white text-[#1c642c] flex items-center justify-center transition-all shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-[#1c642c]">
                    {t.trustReturn}
                  </span>
                </div>
                <p className="text-[13px] sm:text-[13.5px] font-black text-[#0c1a0e] leading-snug">
                  {language === 'bn' ? 'ফ্রি সাইজ এক্সচেঞ্জ' : 'Complimentary Swap'}
                </p>
                <p className="text-[11px] text-[#2c5231] font-bold mt-0.5">
                  {language === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ' : '7-Day Easy Exchange'}
                </p>
              </div>
            </div>

            {/* Card 4: 100% Certified Silk */}
            <div className="group bg-white/95 hover:bg-white backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#badbb3] hover:border-[#1c642c] shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#e2f2df] group-hover:bg-[#0f2113] group-hover:text-white text-[#1c642c] flex items-center justify-center transition-all shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-[#1c642c]">
                    {t.trustAuthentic}
                  </span>
                </div>
                <p className="text-[13px] sm:text-[13.5px] font-black text-[#0c1a0e] leading-snug">
                  {language === 'bn' ? 'খাঁটি ও সার্টিফাইড' : '100% Certified Silk'}
                </p>
                <p className="text-[11px] text-[#2c5231] font-bold mt-0.5">
                  OEKO-TEX Standard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATALOG HEADER & FILTER BAR */}
      <div className="pt-2 sm:pt-0 mb-4">
        <div className="mb-3">
          <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.22em] text-[#1b5e28] block">
            {t.collectionEyebrow}
          </span>
          <h2 className="font-display font-black text-[26px] sm:text-[36px] text-[#0a180d] tracking-[-0.02em] leading-tight mt-0.5">
            {t.catalogHeading}
          </h2>
          <p className="text-[13px] sm:text-[14.5px] text-[#1c3821] leading-relaxed mt-0.5 font-bold">
            {t.catalogTagline}
          </p>
        </div>

        {/* Category Filter Chips with Link and In-Place filtering */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar">
          {categoryChips.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`shrink-0 h-9 px-4 rounded-full text-[11.5px] font-black uppercase tracking-wider flex items-center transition-all cursor-pointer ${
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

      {/* 3. PRIMARY CLOTHING PRODUCT GRID (Each card links directly to /product/:slug) */}
      <section id="catalog-grid-section" className="w-full mb-12">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#f1f6ee] rounded-2xl border border-[#d6e5d2]">
            <p className="text-[15px] font-semibold text-[#18281b]">{t.noResults}</p>
            <p className="text-[12px] text-[#3a4d3d] mt-1">
              {language === 'bn'
                ? 'অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা "সব কালেকশন" সিলেক্ট করুন।'
                : 'Try searching with another keyword or select "All Clothing".'}
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-3 px-4 py-2 rounded-xl bg-[#2d6636] text-white text-[11px] font-black uppercase tracking-wider cursor-pointer"
            >
              {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product) => {
              const localized = localizeProduct(product);
              const isWishlisted = wishlistIds.includes(product.id);
              const prodSlug = getProductSlug(product);
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
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs transition-all duration-300 border border-[#bedec0] hover:shadow-md hover:border-[#1b5e28]/60"
                >
                  {/* Image & Wishlist Container */}
                  <Link
                    to={`/product/${prodSlug}`}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-[#e7f0e3] block"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                    />

                    {/* Wishlist button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      aria-label={`${t.wishlistLabel}: ${localized.name}`}
                      className={`absolute top-2 right-2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform shadow-xs cursor-pointer ${
                        isWishlisted ? 'text-[#1b5e28]' : 'text-[#18281b]'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted ? 'fill-[#1b5e28] text-[#1b5e28]' : 'text-[#18281b]'
                        }`}
                      />
                    </button>

                    {/* Badges */}
                    {product.tag && (
                      <span
                        className={`absolute bottom-2 left-2 text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-black ${
                          product.tag === 'Best Seller'
                            ? 'bg-[#d6edd2] text-[#15381a] border border-[#bce4b6]'
                            : product.tag === 'Limited'
                            ? 'bg-[#1b5e28] text-white'
                            : 'bg-[#0f2113]/90 backdrop-blur-sm text-white'
                        }`}
                      >
                        {tagLabel}
                      </span>
                    )}
                  </Link>

                  {/* Product Details & Actions */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[9.5px] sm:text-[10.5px] text-[#1b5e28] uppercase tracking-wider font-black mb-1">
                        <Link
                          to={`/category/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                          className="truncate hover:underline"
                        >
                          {localized.category}
                        </Link>
                        <span className="shrink-0 text-[#15461e] font-black bg-[#d6edd2] px-1.5 py-0.5 rounded-xs text-[8.5px] sm:text-[9px]">
                          COD
                        </span>
                      </div>

                      <Link to={`/product/${prodSlug}`}>
                        <h3 className="font-display font-black text-[14px] sm:text-[16px] text-[#0a180d] leading-snug hover:text-[#1b5e28] transition-colors line-clamp-1">
                          {localized.name}
                        </h3>
                      </Link>

                      <p className="text-[11px] sm:text-[12px] text-[#224027] mt-0.5 line-clamp-1 font-bold">
                        {localized.subtitle}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#edf4ea] mt-2 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[8.5px] sm:text-[9.5px] text-[#305335] block uppercase tracking-wider leading-none font-black">
                          {language === 'bn' ? 'মূল্য' : 'Price'}
                        </span>
                        <span className="text-[14px] sm:text-[16.5px] font-black text-[#09150c] tracking-tight block truncate">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <Link
                        to={`/product/${prodSlug}`}
                        aria-label={`View ${localized.name}`}
                        className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-[#0f2113] hover:bg-[#1b5e28] text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center active:scale-95 transition-all shadow-2xs shrink-0"
                      >
                        {language === 'bn' ? 'দেখুন' : 'View'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. CLEAN TRUST & ASSURANCE FOOTER */}
      <div className="w-full pb-8">
        <div className="bg-[#eaf3e7] rounded-3xl p-6 border border-[#badbb3] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center shadow-xs">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#1b5e28] flex items-center justify-center mb-2 shadow-2xs border border-[#badbb3]">
              <Truck className="w-5 h-5" />
            </div>
            <p className="text-[13.5px] font-black text-[#0a180d]">{t.trustDelivery}</p>
            <p className="text-[11.5px] text-[#224027] font-bold">{t.trustDeliverySub}</p>
          </div>

          <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-l sm:border-r border-[#c4e0c0] pt-4 sm:pt-0">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#1b5e28] flex items-center justify-center mb-2 shadow-2xs border border-[#badbb3]">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-[13.5px] font-black text-[#0a180d]">{t.trustCod}</p>
            <p className="text-[11.5px] text-[#224027] font-bold">{t.trustCodSub}</p>
          </div>

          <div className="flex flex-col items-center border-t sm:border-t-0 border-[#c4e0c0] pt-4 sm:pt-0">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#1b5e28] flex items-center justify-center mb-2 shadow-2xs border border-[#badbb3]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <p className="text-[13.5px] font-black text-[#0a180d]">{t.trustReturn}</p>
            <p className="text-[11.5px] text-[#224027] font-bold">{t.trustReturnSub}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
