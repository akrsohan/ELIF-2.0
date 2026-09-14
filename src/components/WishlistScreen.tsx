import React from 'react';
import { PRODUCTS } from '../data/catalog';
import { Product, TabType } from '../types';

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
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleAddAllToBag = () => {
    wishlistedProducts.forEach((product) => {
      onQuickAddToCart(product);
    });
    onShowToast(`Added all ${wishlistedProducts.length} items to your shopping bag.`);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-16 selection:bg-[#ffdeaa]">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700]">
            Personal Archive
          </span>
          <h1 className="font-display text-[28px] sm:text-[32px] text-[#1d1b15] tracking-tight">
            Curated Wishlist
          </h1>
          <p className="text-[13px] text-[#4b4640] mt-0.5">
            {wishlistedProducts.length}{' '}
            {wishlistedProducts.length === 1 ? 'silhouette' : 'silhouettes'} saved for contemplation.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={handleAddAllToBag}
            className="text-[11px] font-semibold uppercase tracking-wider text-[#7d5700] hover:underline cursor-pointer"
          >
            Move All To Bag
          </button>
        )}
      </div>

      {/* Wishlist Items List */}
      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="flex bg-[#f3ede3] rounded-xl p-3 shadow-sm border border-[#e8e2d8] gap-3 relative"
            >
              <div
                onClick={() => onOpenProductDetail(product)}
                className="w-20 sm:w-24 h-28 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-[#ede7dd] cursor-pointer"
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
                      className="text-[15px] font-semibold text-[#1d1b15] truncate cursor-pointer hover:text-[#7d5700] transition-colors"
                    >
                      {product.name}
                    </h3>
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className="text-[#4b4640] hover:text-[#ba1a1a] p-1 cursor-pointer transition-colors active:scale-90"
                      aria-label="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  <p className="text-[12px] text-[#4b4640] truncate mt-0.5">
                    {product.subtitle}
                  </p>
                  <p className="text-[16px] font-semibold text-[#1d1b15] mt-1">
                    {product.currency}
                    {product.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onQuickAddToCart(product)}
                    className="flex-1 h-10 rounded-lg bg-[#1d1b19] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-transform hover:bg-[#7d5700] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#f3ede3] rounded-xl border border-[#e8e2d8] p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#ede7dd] flex items-center justify-center text-[#7d5700] mb-4">
            <span className="material-symbols-outlined text-[32px]">favorite</span>
          </div>
          <h2 className="font-display text-[22px] text-[#1d1b15] mb-2">
            Your archive is presently empty
          </h2>
          <p className="text-[13px] text-[#4b4640] max-w-[280px] mb-6 leading-relaxed">
            Tap the heart icon on any piece while exploring to preserve silhouettes in your private salon.
          </p>
          <button
            onClick={() => onNavigateTab('home')}
            className="h-12 px-6 rounded-lg bg-[#1d1b19] text-white text-[12px] font-semibold uppercase tracking-wider active:scale-95 transition-all hover:bg-[#7d5700] cursor-pointer"
          >
            Discover Autumn Solace ’25
          </button>
        </div>
      )}
    </div>
  );
};
