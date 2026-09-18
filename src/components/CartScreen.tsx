import React, { useState } from 'react';
import { CartItem, TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenCheckout: () => void;
  onNavigateTab: (tab: TabType) => void;
  onShowToast: (message: string) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  onNavigateTab,
  onShowToast,
}) => {
  const { language, t, localizeProduct, formatPrice, formatNumber } = useLanguage();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 5000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping || cartItems.length === 0 ? 0 : 120;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'DHAKA10' || code === 'AUTUMN25') {
      setDiscountPercent(10);
      onShowToast(
        language === 'bn'
          ? '১০% ঢাকা অঁতেলিয়ে ডিসকাউন্ট প্রয়োগ করা হয়েছে।'
          : '10% Dhaka Atelier privilege applied.'
      );
    } else if (code === 'BKASH15' || code === 'ELIFVIP') {
      setDiscountPercent(15);
      onShowToast(
        language === 'bn'
          ? '১৫% ভিআইপি প্রিভিলেজ ডিসকাউন্ট সক্রিয় হয়েছে।'
          : '15% VIP customer courtesy applied.'
      );
    } else {
      onShowToast(
        language === 'bn'
          ? 'ভুল কুপন কোড। চেষ্টা করুন: DHAKA10 বা BKASH15'
          : 'Invalid coupon. Try: DHAKA10 or BKASH15'
      );
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="flex flex-col w-full px-2 sm:px-4 pt-1 sm:pt-2 pb-28 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* Header */}
      <div className="mb-3 px-1 sm:px-0">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2d6636] block">
          {language === 'bn' ? 'অর্ডার প্রক্রিয়া • বাংলাদেশ' : 'Haute Acquisition • Bangladesh'}
        </span>
        <h1 className="font-display font-black text-[24px] sm:text-[30px] text-[#18281b] tracking-[-0.015em] mt-0.5">
          {t.bagTitle}
        </h1>
        <p className="text-[12.5px] sm:text-[13px] text-[#3a4d3d] mt-0.5 font-bold">
          {formatNumber(cartItems.length)} {t.bagItemCount} • {language === 'bn' ? 'ঢাকা অঁতেলিয়ে থেকে ডেলিভারি' : 'Delivered from Dhaka Atelier'}
        </p>
      </div>

      {/* Cart Items & Order Summary (Desktop Responsive 2-Column Grid) */}
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start mb-10 px-1 sm:px-0">
          {/* Left Column: Delivery & Items List */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3 sm:gap-4">
            {/* Free Shipping Tier Banner */}
            <div className="bg-[#f1f6ee] border border-[#d6e5d2] rounded-2xl p-3 sm:p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#18281b] mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#2d6636]">local_shipping</span>
                  {isFreeShipping
                    ? (language === 'bn' ? 'সারাদেশে ফ্রি ডেলিভারি আনলক হয়েছে' : 'Complimentary Bangladesh Delivery Unlocked')
                    : (language === 'bn'
                        ? `ফ্রি ডেলিভারির জন্য আরও ৳${(freeShippingThreshold - subtotal).toLocaleString()} এর অর্ডার করুন`
                        : `Add ৳${(freeShippingThreshold - subtotal).toLocaleString()} for Free Delivery`)}
                </span>
                <span className="text-[#2d6636] font-black">{formatNumber(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#e7f0e3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2d6636] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {cartItems.map((item, index) => {
                const localized = localizeProduct(item.product);
                return (
                  <div
                    key={`${item.product.id}-${item.size}-${index}`}
                    className="flex bg-[#f1f6ee] rounded-2xl p-2.5 sm:p-3 shadow-xs border border-[#d6e5d2] gap-2.5 sm:gap-3 relative"
                  >
                    <div className="w-20 sm:w-24 h-26 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-[#e7f0e3]">
                      <img
                        className="w-full h-full object-cover"
                        src={item.product.image}
                        alt={item.product.alt}
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-display font-black text-[14px] sm:text-[15px] text-[#18281b] truncate">
                            {localized.name}
                          </h3>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-[#3a4d3d] hover:text-[#ba1a1a] p-1 cursor-pointer transition-colors active:scale-90"
                            aria-label="Remove item"
                          >
                            <span className="material-symbols-outlined text-[17px]">close</span>
                          </button>
                        </div>

                        <p className="text-[11px] sm:text-[11.5px] text-[#3a4d3d] mt-0.5 font-bold">
                          {item.color} • {language === 'bn' ? 'সাইজ:' : 'Size:'} {item.size}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#d6e5d2]">
                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-[#ffffff] rounded-lg border border-[#c8dac4] h-7 sm:h-8 px-0.5">
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="w-7 sm:w-8 h-full flex items-center justify-center text-[#18281b] hover:text-[#2d6636] active:scale-95 transition-transform cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-[13px]">remove</span>
                          </button>
                          <span className="w-6 sm:w-7 text-center text-[12px] font-black text-[#18281b]">
                            {formatNumber(item.quantity)}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="w-7 sm:w-8 h-full flex items-center justify-center text-[#18281b] hover:text-[#2d6636] active:scale-95 transition-transform cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-[13px]">add</span>
                          </button>
                        </div>

                        <div className="text-right">
                          {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                            <span className="text-[11px] line-through text-[#829985] block font-semibold leading-none mb-0.5">
                              {formatPrice(item.product.compareAtPrice * item.quantity)}
                            </span>
                          )}
                          <span className="text-[14px] sm:text-[15px] font-black text-[#18281b]">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complimentary Gift Box Option */}
            <div className="bg-[#f1f6ee] rounded-2xl p-3 sm:p-3.5 border border-[#d6e5d2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#2d6636]">redeem</span>
                <div>
                  <p className="text-[12.5px] sm:text-[13px] font-black text-[#18281b]">
                    {language === 'bn' ? 'অঁতেলিয়ে স্পেশাল গিফট বক্স প্যাকিং' : 'Atelier Monogram Gift Packaging'}
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] text-[#3a4d3d] font-bold">
                    {language === 'bn'
                      ? 'প্রিমিয়াম আর্ট বক্স ও সিল্ক রিবন ফিতা (সম্পূর্ণ ফ্রি)'
                      : 'Embossed archival box & bronze grosgrain ribbon (Complimentary)'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeGiftWrap}
                onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                className="w-5 h-5 accent-[#2d6636] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Sticky Order Summary & Checkout */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 flex flex-col gap-4">
            <div className="bg-[#f1f6ee] rounded-2xl p-3.5 sm:p-5 border border-[#d6e5d2] space-y-3.5 sm:space-y-4 shadow-xs">
              <h2 className="font-display text-[16px] sm:text-[18px] text-[#18281b] font-black border-b border-[#d6e5d2] pb-2">
                {t.orderSummary}
              </h2>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={language === 'bn' ? 'কুপন কোড (যেমন: DHAKA10, BKASH15)' : 'Code (Try: AUTUMN25, DHAKA10)'}
                  className="flex-1 min-w-0 h-10 sm:h-11 px-3 rounded-xl bg-[#ffffff] border border-[#c8dac4] text-[#18281b] text-[11px] sm:text-[12px] uppercase font-bold placeholder:font-normal placeholder:normal-case placeholder:text-[#3a4d3d]/60 focus:outline-none focus:ring-1 focus:ring-[#2d6636]"
                />
                <button
                  type="submit"
                  className="h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl bg-[#0f2113] text-white text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider hover:bg-[#2d6636] active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                </button>
              </form>

              {/* Order Financial Breakdown */}
              <div className="space-y-2 pt-1 text-[12.5px] sm:text-[13px]">
                <div className="flex justify-between text-[#3a4d3d] font-bold">
                  <span>{t.subtotal} ({formatNumber(cartItems.length)} {t.bagItemCount})</span>
                  <span className="font-black text-[#18281b]">{formatPrice(subtotal)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#2d6636] font-bold">
                    <span>{language === 'bn' ? `প্রমোশনাল ছাড় (${formatNumber(discountPercent)}%)` : `Promotional Courtesy (${discountPercent}%)`}</span>
                    <span className="font-black">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#3a4d3d] font-bold">
                  <span>{t.deliveryFee}</span>
                  <span className="font-black text-[#2d6636]">
                    {isFreeShipping ? (language === 'bn' ? 'ফ্রি' : 'Complimentary') : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="flex justify-between text-[#3a4d3d] font-bold">
                  <span>{language === 'bn' ? 'ভ্যাট / ট্যাক্স (বাংলাদেশ)' : 'VAT / Tax (Bangladesh)'}</span>
                  <span className="font-black text-[#18281b]">{language === 'bn' ? 'মূল্যে অন্তর্ভুক্ত' : 'Included in Price'}</span>
                </div>

                <div className="border-t border-[#d6e5d2] pt-2.5 flex justify-between items-baseline text-[15px] sm:text-[16px]">
                  <span className="font-black text-[#18281b]">{t.totalAmount}</span>
                  <span className="text-[19px] sm:text-[22px] font-black text-[#18281b]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={onOpenCheckout}
                className="w-full h-12 sm:h-13 bg-[#d6edd2] text-[#15381a] hover:bg-[#c7e7c2] font-black text-[12px] sm:text-[13px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm cursor-pointer border border-[#bce4b6]"
              >
                <span>{t.checkout}</span>
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </button>

              {/* Trust badges */}
              <div className="pt-2 border-t border-[#d6e5d2] flex flex-col gap-1.5 text-[10.5px] sm:text-[11px] text-[#3a4d3d] font-bold">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#2d6636]">verified_user</span>
                  <span>{t.trustCod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#2d6636]">sync</span>
                  <span>{t.trustReturn}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center bg-[#f1f6ee] rounded-xl border border-[#d6e5d2] p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#e7f0e3] flex items-center justify-center text-[#2d6636] mb-4">
            <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
          </div>
          <h2 className="font-display font-medium text-[22px] text-[#18281b] mb-2">
            {t.bagEmpty}
          </h2>
          <p className="text-[13px] text-[#3a4d3d] max-w-[320px] mb-6 leading-relaxed font-normal">
            {t.bagEmptySub}
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
