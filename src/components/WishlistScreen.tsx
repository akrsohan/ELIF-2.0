import React from 'react';
import { PRODUCTS } from '../data/catalog';
import { Product, TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WishlistScreenProps {
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickAddToCart: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
  onNavigateTab: (tab: TabType) => void;
  onShowToast: (message: string) => void;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  wishlistIds,
  onToggleWishlist,
  onQuickAddToCart,
  onOpenProductDetail,
  onNavigateTab,
  onShowToast,
}) => {
  const { language, t, localizeProduct, formatPrice, formatNumber } = useLanguage();
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleAddAllToBag = () => {
    wishlistedProducts.forEach((product) => {
      onQuickAddToCart(product);
    });
    onShowToast(
      language === 'bn'
        ? `উইশলিস্টের ${formatNumber(wishlistedProducts.length)}টি পোশাক কার্টে যুক্ত করা হয়েছে!`
        : `Added all ${wishlistedProducts.length} items to your shopping bag.`
    );
  };

  return (
    <div className="flex flex-col w-full px-2 sm:px-4 pt-1 sm:pt-2 pb-16 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-4 px-1 sm:px-0">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2d6636] block">
            {language === 'bn' ? 'ব্যক্তিগত পছন্দতালিকা' : 'Personal Archive'}
          </span>
          <h1 className="font-display font-black text-[24px] sm:text-[32px] text-[#18281b] tracking-[-0.015em] mt-0.5">
            {t.wishlistTitle}
          </h1>
          <p className="text-[12.5px] sm:text-[13px] text-[#3a4d3d] mt-0.5 font-bold">
            {formatNumber(wishlistedProducts.length)} {t.wishlistCountText}
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={handleAddAllToBag}
            className="text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider text-[#2d6636] hover:underline cursor-pointer bg-[#eaf3e7] px-2.5 py-1 rounded-lg border border-[#bedec0]"
          >
            {language === 'bn' ? 'সব ব্যাগে নিন' : 'Move All To Bag'}
          </button>
        )}
      </div>

      {/* Wishlist Items List (PC Responsive Grid) */}
      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 mb-10 px-1 sm:px-0">
          {wishlistedProducts.map((product) => {
            const localized = localizeProduct(product);
            return (
              <div
                key={product.id}
                className="flex bg-[#f1f6ee] rounded-2xl p-2.5 sm:p-3 shadow-xs border border-[#d6e5d2] gap-2.5 sm:gap-3 relative hover:shadow-md hover:border-[#2d6636]/40 transition-all"
              >
                <div
                  onClick={() => onOpenProductDetail(product)}
                  className="w-20 sm:w-24 h-26 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-[#e7f0e3] cursor-pointer"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={product.image}
                    alt={product.alt}
                  />
                </div>

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        onClick={() => onOpenProductDetail(product)}
                        className="font-display font-black text-[14px] sm:text-[16px] text-[#18281b] truncate cursor-pointer hover:text-[#2d6636] transition-colors"
                      >
                        {localized.name}
                      </h3>
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className="text-[#3a4d3d] hover:text-[#ba1a1a] p-1 cursor-pointer transition-colors active:scale-90"
                        aria-label="Remove from wishlist"
                      >
                        <span className="material-symbols-outlined text-[17px]">close</span>
                      </button>
                    </div>

                    <p className="text-[11px] sm:text-[12px] text-[#3a4d3d] truncate mt-0.5 font-bold">
                      {localized.subtitle}
                    </p>
                    <p className="text-[14px] sm:text-[15px] font-black text-[#18281b] mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1.5">
                    <button
                      onClick={() => onOpenProductDetail(product)}
                      className="flex-1 h-8 sm:h-9 rounded-lg bg-[#0f2113] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-transform hover:bg-[#2d6636] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span>{t.viewDetails}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#f1f6ee] rounded-xl border border-[#d6e5d2] p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#e7f0e3] flex items-center justify-center text-[#2d6636] mb-4">
            <span className="material-symbols-outlined text-[32px]">favorite</span>
          </div>
          <h2 className="font-display font-medium text-[22px] text-[#18281b] mb-2">
            {t.wishlistEmpty}
          </h2>
          <p className="text-[13px] text-[#3a4d3d] max-w-[320px] mb-6 leading-relaxed font-normal">
            {t.wishlistEmptySub}
          </p>
          <button
            onClick={() => onNavigateTab('home')}
            className="h-12 px-6 rounded-lg bg-[#2d6636] text-white text-[12px] font-medium uppercase tracking-wider active:scale-95 transition-all hover:bg-[#23522b] cursor-pointer"
          >
            {t.exploreCollections}
          </button>
        </div>
      )}
    </div>
  );
};
