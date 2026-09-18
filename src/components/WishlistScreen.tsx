import React from 'react';
import { Product, TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

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
  const { products } = useStore();
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

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

      {wishlistedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-[#bedec0] text-center">
          <span className="material-symbols-outlined text-[48px] text-[#2d6636]/40 mb-2">
            favorite_border
          </span>
          <h3 className="font-display font-black text-[18px] text-[#18281b]">
            {t.wishlistEmpty}
          </h3>
          <p className="text-[12.5px] text-[#3a4d3d] max-w-xs mt-1 mb-5">
            {t.wishlistEmptySub}
          </p>
          <button
            onClick={() => onNavigateTab('shop')}
            className="h-10 px-5 rounded-xl bg-[#18281b] hover:bg-[#2d6636] text-white text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            {t.exploreCollections}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {wishlistedProducts.map((product) => {
            const localized = localizeProduct(product);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#bedec0] overflow-hidden flex flex-col justify-between group shadow-2xs hover:shadow-sm transition-all"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#18281b] text-white flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">favorite</span>
                  </button>
                </div>

                <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[9.5px] text-[#2d6636] uppercase font-black tracking-wider block">
                      {localized.category}
                    </span>
                    <h4
                      onClick={() => onOpenProductDetail(product)}
                      className="font-display font-black text-[13px] sm:text-[14px] text-[#18281b] line-clamp-1 cursor-pointer hover:underline"
                    >
                      {localized.name}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-[#edf4ea] mt-2 flex items-center justify-between">
                    <span className="font-black text-[13px] text-[#18281b]">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => onQuickAddToCart(product)}
                      className="px-2.5 py-1 bg-[#18281b] hover:bg-[#2d6636] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      + {language === 'bn' ? 'ব্যাগ' : 'Bag'}
                    </button>
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
