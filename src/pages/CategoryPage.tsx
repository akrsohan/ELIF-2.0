import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { getCategorySlug, getProductSlug } from '../utils/slug';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, localizeProduct, localizeCategory, formatPrice, formatNumber } = useLanguage();
  const { products, categories, wishlistIds, toggleWishlist, quickAddToCart } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  // Match category from dynamic categories
  const categoryCard = categories.find((c) => c.slug.toLowerCase() === slug?.toLowerCase());
  const currentCategoryName = categoryCard ? categoryCard.name : (slug ? slug.replace(/-/g, ' ') : 'Category');

  // Filter products matching this category
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (!slug) return true;
      const pCatSlug = getCategorySlug(p.category);
      return pCatSlug === slug.toLowerCase() || p.category.toLowerCase().includes(slug.toLowerCase());
    });

    if (sortBy === 'price-low') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      return [...list].filter((p) => p.tag === 'New').concat(list.filter((p) => p.tag !== 'New'));
    }
    return list;
  }, [products, slug, sortBy]);

  return (
    <div className="w-full pb-16 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* 1. BREADCRUMBS */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#35523a] mb-5 overflow-x-auto no-scrollbar py-1"
      >
        <Link to="/" className="hover:text-[#0f2113] hover:underline whitespace-nowrap">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <Link to="/categories" className="hover:text-[#0f2113] hover:underline whitespace-nowrap">
          {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <span className="text-[#0f2113] font-black truncate">
          {localizeCategory(currentCategoryName)}
        </span>
      </nav>

      {/* 2. EDITORIAL CATEGORY HERO HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#e5f3e2] via-[#eef7ec] to-[#dcefe0] p-6 sm:p-8 lg:p-10 border border-[#b8dab2] mb-8 shadow-[0_6px_25px_rgba(24,40,27,0.05)]">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10.5px] font-black uppercase tracking-[0.2em] text-[#1b5e28] bg-white/90 px-3 py-1 rounded-full border border-[#bedeb8] shadow-2xs">
              {language === 'bn' ? 'অঁতেলিয়ে সেকশন' : 'Atelier Department'}
            </span>
            <span className="text-[11px] font-bold text-[#234b28]">
              {formatNumber(filteredProducts.length)} {language === 'bn' ? 'টি পোশাক' : 'Pieces'}
            </span>
          </div>

          <h1 className="font-display text-[28px] sm:text-[36px] lg:text-[40px] font-black text-[#0a190d] tracking-tight leading-tight">
            {localizeCategory(currentCategoryName)}
          </h1>

          <p className="text-[13px] sm:text-[14px] text-[#1e3c23] font-medium leading-relaxed mt-2">
            {language === 'bn'
              ? 'প্রিমিয়াম রাজাকীয় সিল্ক, বেবি আলপাকা ও ভার্জিন উলের অভিজাত ডিজাইন। ঢাকা ও সারাদেশে দ্রুত ডেলিভারি।'
              : 'Structured tailored silhouettes loomed with Bengal raw silk, baby alpaca, and unbleached European wool.'}
          </p>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6 mt-4 border-t border-[#bedeb8]/70">
          {categories.map((cat) => {
            const isCurrent = cat.slug === slug;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                  isCurrent
                    ? 'bg-[#0f2113] text-white border-[#0f2113] shadow-xs'
                    : 'bg-white/80 text-[#1f3b25] border-[#bedeb8] hover:bg-white'
                }`}
              >
                {localizeCategory(cat.name)}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. SORT & FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#bedec0]">
        <span className="text-[12px] font-black uppercase tracking-wider text-[#144f20]">
          {language === 'bn'
            ? `প্রদর্শন করা হচ্ছে (${formatNumber(filteredProducts.length)}টি পোশাক)`
            : `Showing ${filteredProducts.length} Atelier Pieces`}
        </span>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="category-sort" className="text-[11.5px] font-bold text-[#2d4d31]">
            {language === 'bn' ? 'সর্ট করুন:' : 'Sort by:'}
          </label>
          <select
            id="category-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#f0f6ee] text-[#102414] font-bold text-[11.5px] px-3 py-1.5 rounded-xl border border-[#badbb3] focus:outline-none focus:ring-1 focus:ring-[#1b5e28] cursor-pointer"
          >
            <option value="featured">{t.sortFeatured}</option>
            <option value="price-low">{t.sortPriceLow}</option>
            <option value="price-high">{t.sortPriceHigh}</option>
            <option value="newest">{t.sortNewest}</option>
          </select>
        </div>
      </div>

      {/* 4. PRODUCT GRID / EMPTY STATE */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 px-6 text-center bg-[#f1f6ee] rounded-3xl border border-[#d6e5d2] max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#1b5e28] flex items-center justify-center mx-auto mb-3 shadow-xs border border-[#badbb3]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-display text-[20px] font-bold text-[#0a180d]">
            {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো পোশাক পাওয়া যায়নি' : 'No pieces available in this category'}
          </h2>
          <p className="text-[13px] text-[#2c4b31] mt-1.5 max-w-md mx-auto">
            {language === 'bn'
              ? 'অন্য কোনো ক্যাটাগরি অথবা সম্পূর্ণ ক্যাটালগ দেখতে নিচের বাটনে ক্লিক করুন।'
              : 'Explore other curated categories or check back soon as our atelier restocks.'}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2113] hover:bg-[#1b5e28] text-white text-[11px] font-black uppercase tracking-wider transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#eaf3e7] text-[#0f2113] border border-[#bedec0] text-[11px] font-black uppercase tracking-wider transition-colors shadow-xs"
            >
              {language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => {
            const localized = localizeProduct(product);
            const isWish = wishlistIds.includes(product.id);
            const prodSlug = getProductSlug(product);

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#bedec0] shadow-xs hover:shadow-md transition-all"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[3/4] bg-[#edf4ea] overflow-hidden">
                  <Link to={`/product/${prodSlug}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={localized.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Wishlist button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist toggle"
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border shadow-xs transition-all active:scale-90 cursor-pointer ${
                      isWish
                        ? 'bg-[#d6edd2] border-[#aed6a3] text-[#15381a]'
                        : 'bg-white/90 border-[#bedec0] text-[#0f2113] hover:bg-white'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isWish ? 'fill-[#1b5e28] text-[#1b5e28]' : 'text-[#0f2113]'
                      }`}
                    />
                  </button>

                  {/* Tag */}
                  {product.tag && (
                    <span className="absolute top-2.5 left-2.5 bg-[#0f2113]/90 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                      {product.tag === 'Best Seller'
                        ? t.tagBestSeller
                        : product.tag === 'Limited'
                        ? t.tagLimited
                        : product.tag === 'New'
                        ? t.tagNew
                        : product.tag}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1b5e28]">
                      {localizeCategory(product.category)}
                    </span>
                    <Link to={`/product/${prodSlug}`}>
                      <h3 className="font-display text-[14px] sm:text-[15px] font-bold text-[#0b1b0e] hover:text-[#1b5e28] transition-colors line-clamp-1 mt-0.5">
                        {localized.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#335639] font-medium line-clamp-1 mt-0.5">
                      {localized.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#edf4ea] flex items-center justify-between gap-1">
                    <div>
                      <span className="text-[14px] sm:text-[15px] font-black text-[#0a190d]">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => quickAddToCart(product)}
                        title={language === 'bn' ? 'দ্রুত ব্যাগে যোগ' : 'Quick Add to Bag'}
                        className="w-8 h-8 rounded-xl bg-[#edf6eb] text-[#0f2113] hover:bg-[#0f2113] hover:text-white flex items-center justify-center border border-[#bedeb8] transition-all cursor-pointer active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/product/${prodSlug}`}
                        className="h-8 px-2.5 rounded-xl bg-[#0f2113] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center hover:bg-[#1b4320] transition-colors"
                      >
                        {language === 'bn' ? 'দেখুন' : 'View'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
