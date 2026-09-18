import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, X, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { getProductSlug } from '../utils/slug';

export const WishlistPage: React.FC = () => {
  const { language, t, localizeProduct, formatPrice, formatNumber } = useLanguage();
  const { products, wishlistIds, toggleWishlist, quickAddToCart, showToast } = useStore();

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleAddAllToBag = () => {
    wishlistedProducts.forEach((product) => {
      quickAddToCart(product);
    });
    showToast(
      language === 'bn'
        ? `উইশলিস্টের ${formatNumber(wishlistedProducts.length)}টি পোশাক কার্টে যুক্ত করা হয়েছে!`
        : `Added all ${wishlistedProducts.length} items to your shopping bag.`
    );
  };

  return (
    <div className="flex flex-col w-full pb-16 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* 1. BREADCRUMBS */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#35523a] mb-5 py-1"
      >
        <Link to="/" className="hover:text-[#0f2113] hover:underline">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <span className="text-[#0f2113] font-black">
          {language === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}
        </span>
      </nav>

      {/* 2. HEADER */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2d6636] block">
            {language === 'bn' ? 'ব্যক্তিগত পছন্দতালিকা' : 'Personal Archive'}
          </span>
          <h1 className="font-display font-black text-[24px] sm:text-[34px] text-[#18281b] tracking-[-0.015em] mt-0.5">
            {t.wishlistTitle}
          </h1>
          <p className="text-[12.5px] sm:text-[14px] text-[#3a4d3d] mt-0.5 font-bold">
            {formatNumber(wishlistedProducts.length)} {t.wishlistCountText}
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            type="button"
            onClick={handleAddAllToBag}
            className="text-[11px] font-black uppercase tracking-wider text-[#2d6636] hover:underline cursor-pointer bg-[#eaf3e7] px-3.5 py-1.5 rounded-xl border border-[#bedec0] shadow-xs active:scale-95 transition-all"
          >
            {language === 'bn' ? 'সবগুলো ব্যাগে নিন' : 'Move All To Bag'}
          </button>
        )}
      </div>

      {/* 3. WISHLIST ITEMS GRID */}
      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 mb-10">
          {wishlistedProducts.map((product) => {
            const localized = localizeProduct(product);
            const prodSlug = getProductSlug(product);

            return (
              <div
                key={product.id}
                className="flex bg-white rounded-2xl p-3 shadow-xs border border-[#bedec0] gap-3 relative hover:shadow-md hover:border-[#2d6636]/40 transition-all"
              >
                <Link
                  to={`/product/${prodSlug}`}
                  className="w-22 sm:w-26 h-28 sm:h-34 shrink-0 rounded-xl overflow-hidden bg-[#edf4ea]"
                >
                  <img
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    src={product.image}
                    alt={product.alt}
                  />
                </Link>

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <Link to={`/product/${prodSlug}`}>
                        <h3 className="font-display font-black text-[14px] sm:text-[16px] text-[#18281b] truncate hover:text-[#2d6636] transition-colors">
                          {localized.name}
                        </h3>
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className="text-[#3a4d3d] hover:text-[#ba1a1a] p-1 cursor-pointer transition-colors active:scale-90"
                        aria-label="Remove from wishlist"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] sm:text-[12px] text-[#3a4d3d] truncate mt-0.5 font-bold">
                      {localized.subtitle}
                    </p>
                    <p className="text-[14px] sm:text-[16px] font-black text-[#18281b] mt-1.5">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2">
                    <button
                      type="button"
                      onClick={() => quickAddToCart(product)}
                      className="flex-1 h-8.5 rounded-xl bg-[#0f2113] text-white text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-transform hover:bg-[#2d6636] cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'ব্যাগে নিন' : 'Add to Bag'}</span>
                    </button>
                    <Link
                      to={`/product/${prodSlug}`}
                      className="h-8.5 px-3 rounded-xl bg-[#edf6eb] text-[#0f2113] text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center border border-[#bedeb8] hover:bg-[#dcefe0] transition-colors"
                    >
                      {language === 'bn' ? 'দেখুন' : 'View'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#f1f6ee] rounded-2xl border border-[#d6e5d2] p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#e7f0e3] flex items-center justify-center text-[#2d6636] mb-4">
            <Heart className="w-8 h-8 text-[#2d6636]" />
          </div>
          <h2 className="font-display font-bold text-[22px] text-[#18281b] mb-2">
            {t.wishlistEmpty}
          </h2>
          <p className="text-[13px] text-[#3a4d3d] max-w-[340px] mb-6 leading-relaxed font-medium">
            {t.wishlistEmptySub}
          </p>
          <Link
            to="/shop"
            className="h-12 px-6 rounded-xl bg-[#0f2113] text-white text-[12px] font-black uppercase tracking-wider active:scale-95 transition-all hover:bg-[#1b5e28] flex items-center gap-2 shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>{t.exploreCollections}</span>
          </Link>
        </div>
      )}
    </div>
  );
};
