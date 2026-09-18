import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { getProductSlug } from '../utils/slug';
import { PriceDisplay } from '../components/PriceDisplay';

export const CollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, localizeProduct, localizeCategory, formatPrice } = useLanguage();
  const { products, collections, wishlistIds, toggleWishlist, quickAddToCart } = useStore();

  const collection = collections.find(
    (c) => c.slug.toLowerCase() === slug?.toLowerCase() || c.id.toLowerCase() === slug?.toLowerCase()
  );

  if (!collection) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 selection:bg-[#d6edd2] selection:text-[#18281b]">
        <h1 className="font-display text-[26px] font-black text-[#0f2113] mb-3">
          {language === 'bn' ? 'কালেকশন পাওয়া যায়নি' : 'Collection Not Found'}
        </h1>
        <Link
          to="/collections"
          className="px-5 py-2.5 bg-[#0f2113] text-white rounded-xl text-[12px] font-black uppercase tracking-wider"
        >
          {language === 'bn' ? 'সকল কালেকশন দেখুন' : 'Browse All Collections'}
        </Link>
      </div>
    );
  }

  // Filter products for this collection
  const collectionProducts = products.filter((p) => {
    if (!collection.categoryFilter || collection.categoryFilter === 'All') return true;
    return p.category.toLowerCase().includes(collection.categoryFilter.toLowerCase());
  });

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
        <Link to="/collections" className="hover:text-[#0f2113] hover:underline whitespace-nowrap">
          {language === 'bn' ? 'কালেকশন' : 'Collections'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <span className="text-[#0f2113] font-black truncate">{collection.title}</span>
      </nav>

      {/* 2. HERO EDITORIAL SHOWCASE */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0f2113] text-white p-6 sm:p-10 lg:p-12 mb-10 shadow-xl">
        <div className="absolute inset-0 opacity-40">
          <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2113] via-[#0f2113]/80 to-transparent" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-[#a8e6a1] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md mb-3 border border-white/15">
            {collection.collectionNumber}
          </span>
          <h1 className="font-display text-[30px] sm:text-[42px] font-black tracking-tight leading-tight">
            {collection.title}
          </h1>
          <p className="text-[14px] sm:text-[16px] text-[#d6edd2] font-medium leading-relaxed mt-2">
            {collection.subtitle}
          </p>
          <p className="text-[13px] text-white/80 leading-relaxed mt-4 max-w-xl">
            {collection.description}
          </p>
        </div>
      </div>

      {/* 3. PRODUCTS IN THIS COLLECTION */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1b5e28]">
            {language === 'bn' ? 'কালেকশনের অন্তর্ভুক্ত' : 'Collection Inventory'}
          </span>
          <h2 className="font-display text-[22px] sm:text-[26px] font-black text-[#0b1b0e]">
            {language === 'bn' ? 'নির্বাচিত পোশাক ও অনুষঙ্গ' : 'Curated Garments & Objects'}
          </h2>
        </div>
      </div>

      {collectionProducts.length === 0 ? (
        <div className="py-16 px-6 text-center bg-[#f1f6ee] rounded-3xl border border-[#d6e5d2] max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#1b5e28] flex items-center justify-center mx-auto mb-3 shadow-xs border border-[#badbb3]">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="font-display text-[20px] font-bold text-[#0a180d]">
            {language === 'bn' ? 'এই কালেকশনে কোনো পোশাক পাওয়া যায়নি' : 'No pieces in this collection yet'}
          </h2>
          <p className="text-[13px] text-[#2c4b31] mt-1.5 max-w-md mx-auto">
            {language === 'bn'
              ? 'অন্যান্য কালেকশন বা শপ পেজ ঘুরে দেখার আমন্ত্রণ রইল।'
              : 'Please check other collections or visit our main shop catalog.'}
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2113] hover:bg-[#1b5e28] text-white text-[11px] font-black uppercase tracking-wider transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'bn' ? 'সকল কালেকশন' : 'All Collections'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {collectionProducts.map((product) => {
            const localized = localizeProduct(product);
            const isWish = wishlistIds.includes(product.id);
            const prodSlug = getProductSlug(product);

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#bedec0] shadow-xs hover:shadow-md transition-all"
              >
                <div className="relative aspect-[3/4] bg-[#edf4ea] overflow-hidden">
                  <Link to={`/product/${prodSlug}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={localized.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

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
                    <div className="min-w-0">
                      <PriceDisplay
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        size="md"
                        layout="stacked"
                        showDiscountBadge={true}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
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
