import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, X, Lock, ArrowRight, ShoppingBag, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { getProductSlug } from '../utils/slug';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t, localizeProduct, formatPrice, formatNumber } = useLanguage();
  const { cartItems, updateCartQuantity, removeCartItem, showToast } = useStore();

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
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'DHAKA10' || code === 'AUTUMN25') {
      setDiscountPercent(10);
      showToast(
        language === 'bn'
          ? '১০% ঢাকা অঁতেলিয়ে ডিসকাউন্ট প্রয়োগ করা হয়েছে।'
          : '10% Dhaka Atelier privilege applied.'
      );
    } else if (code === 'BKASH15' || code === 'ELIFVIP') {
      setDiscountPercent(15);
      showToast(
        language === 'bn'
          ? '১৫% ভিআইপি প্রিভিলেজ ডিসকাউন্ট সক্রিয় হয়েছে।'
          : '15% VIP customer courtesy applied.'
      );
    } else {
      showToast(
        language === 'bn'
          ? 'ভুল কুপন কোড। চেষ্টা করুন: DHAKA10 বা BKASH15'
          : 'Invalid coupon. Try: DHAKA10 or BKASH15'
      );
    }
  };

  return (
    <div className="flex flex-col w-full pb-20 selection:bg-[#d6edd2] selection:text-[#18281b]">
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
          {language === 'bn' ? 'শপিং ব্যাগ' : 'Shopping Bag'}
        </span>
      </nav>

      {/* 2. HEADER */}
      <div className="mb-5">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2d6636] block">
          {language === 'bn' ? 'অর্ডার প্রক্রিয়া • বাংলাদেশ' : 'Haute Acquisition • Bangladesh'}
        </span>
        <h1 className="font-display font-black text-[24px] sm:text-[34px] text-[#18281b] tracking-[-0.015em] mt-0.5">
          {t.bagTitle}
        </h1>
        <p className="text-[12.5px] sm:text-[14px] text-[#3a4d3d] mt-0.5 font-bold">
          {formatNumber(cartItems.length)} {t.bagItemCount} •{' '}
          {language === 'bn' ? 'ঢাকা অঁতেলিয়ে থেকে এক্সপ্রেস ডেলিভারি' : 'Express Delivery from Dhaka Atelier'}
        </p>
      </div>

      {/* 3. CART CONTENT OR EMPTY STATE */}
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left: Items List & Free Delivery Bar */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            {/* Free Shipping Progress */}
            <div className="bg-[#edf6eb] border border-[#bedec0] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-[11.5px] font-black text-[#0f2113] mb-2 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#1b5e28]" />
                  {isFreeShipping
                    ? (language === 'bn' ? 'সারাদেশে ফ্রি ডেলিভারি সক্রিয়!' : 'Complimentary Bangladesh Delivery Unlocked')
                    : (language === 'bn'
                        ? `ফ্রি ডেলিভারির জন্য আরও ৳${(freeShippingThreshold - subtotal).toLocaleString()} এর কেনাকাটা করুন`
                        : `Add ৳${(freeShippingThreshold - subtotal).toLocaleString()} for Free Delivery`)}
                </span>
                <span className="text-[#1b5e28] font-black">{formatNumber(progressPercent)}%</span>
              </div>
              <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden border border-[#bedec0]">
                <div
                  className="h-full bg-[#1b5e28] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-3">
              {cartItems.map((item, index) => {
                const localized = localizeProduct(item.product);
                const prodSlug = getProductSlug(item.product);

                return (
                  <div
                    key={`${item.product.id}-${item.size}-${index}`}
                    className="flex bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-[#bedec0] gap-3 sm:gap-4 relative hover:border-[#1b5e28]/50 transition-all"
                  >
                    <Link
                      to={`/product/${prodSlug}`}
                      className="w-22 sm:w-26 h-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-[#edf4ea]"
                    >
                      <img
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        src={item.product.image}
                        alt={item.product.alt}
                      />
                    </Link>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <Link to={`/product/${prodSlug}`}>
                            <h3 className="font-display font-black text-[14px] sm:text-[16px] text-[#0f2113] truncate hover:text-[#1b5e28] transition-colors">
                              {localized.name}
                            </h3>
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeCartItem(index)}
                            className="text-[#3a4d3d] hover:text-[#ba1a1a] p-1 cursor-pointer transition-colors active:scale-90"
                            aria-label="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[11.5px] text-[#335639] mt-0.5 font-bold">
                          {item.color} • {language === 'bn' ? 'সাইজ:' : 'Size:'} {item.size}
                        </p>
                        <p className="text-[14px] sm:text-[16px] font-black text-[#0f2113] mt-1.5">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>

                      {/* Quantity row */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#edf4ea] mt-2">
                        <div className="flex items-center rounded-lg bg-[#edf6eb] border border-[#bedeb8] p-0.5">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(index, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white text-[#0f2113] flex items-center justify-center font-bold text-[12px] cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-black text-[12px] text-[#0f2113]">
                            {formatNumber(item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(index, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-white text-[#0f2113] flex items-center justify-center font-bold text-[12px] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <Link
                          to={`/product/${prodSlug}`}
                          className="text-[11px] font-bold text-[#1b5e28] underline hover:text-[#0f2113]"
                        >
                          {language === 'bn' ? 'পোশাক দেখুন' : 'View Piece'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Order Summary & Checkout Action */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 sticky top-24">
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-[#bedec0] flex flex-col gap-4">
              <h2 className="font-display font-black text-[18px] sm:text-[20px] text-[#0f2113] pb-3 border-b border-[#edf4ea]">
                {language === 'bn' ? 'অর্ডার সারসংক্ষেপ' : 'Order Summary'}
              </h2>

              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={language === 'bn' ? 'কুপন কোড (যেমন: DHAKA10)' : 'Coupon Code (e.g. DHAKA10)'}
                  className="flex-1 px-3 py-2 text-[12px] bg-[#edf6eb] border border-[#bedeb8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f2113] text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:bg-[#1b5e28] transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                </button>
              </form>

              {/* Gift wrapping toggle */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#edf6eb] border border-[#bedeb8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGiftWrap}
                  onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                  className="accent-[#1b5e28] w-4 h-4 rounded cursor-pointer"
                />
                <div className="text-[12px]">
                  <span className="font-black text-[#0f2113] block">
                    {language === 'bn' ? 'বিনামূল্যে অঁতেলিয়ে গিফট বক্স' : 'Complimentary Atelier Gift Box'}
                  </span>
                  <span className="text-[#35573a] text-[11px]">
                    {language === 'bn' ? 'প্যারিসিয়ান সিল্ক রিবন ও কার্ড সহ' : 'Includes custom ribbon & seal'}
                  </span>
                </div>
              </label>

              {/* Cost breakdown */}
              <div className="space-y-2 text-[13px] pt-2 border-t border-[#edf4ea]">
                <div className="flex justify-between text-[#305335]">
                  <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="font-bold text-[#0f2113]">{formatPrice(subtotal)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#1b5e28] font-bold">
                    <span>{language === 'bn' ? `প্রিভিলেজ ডিসকাউন্ট (${formatNumber(discountPercent)}%)` : `Privilege Discount (${discountPercent}%)`}</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#305335]">
                  <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Estimated Delivery'}</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-[#1b5e28] font-black uppercase tracking-wider text-[11px]">
                        {language === 'bn' ? 'ফ্রি' : 'FREE'}
                      </span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[16px] sm:text-[18px] font-black text-[#0f2113] pt-3 border-t border-[#edf4ea]">
                  <span>{language === 'bn' ? 'সর্বমোট' : 'Total Payable'}</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full h-13 rounded-2xl bg-[#0f2113] text-white font-black text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-[#1a3a20] active:scale-98 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>{language === 'bn' ? 'চেকআউট পেজে যান' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#3a583e]">
                {language === 'bn'
                  ? '🔒 নিরাপদ পেমেন্ট • ক্যাশ অন ডেলিভারি ও বিকাশ সাপোর্টেড'
                  : '🔒 Secure Checkout • Cash on Delivery & bKash Supported'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center bg-[#f1f6ee] rounded-3xl border border-[#d6e5d2] p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#e7f0e3] flex items-center justify-center text-[#2d6636] mb-4">
            <ShoppingBag className="w-8 h-8 text-[#2d6636]" />
          </div>
          <h2 className="font-display font-bold text-[22px] text-[#18281b] mb-2">
            {t.bagEmpty}
          </h2>
          <p className="text-[13px] text-[#3a4d3d] max-w-[340px] mb-6 leading-relaxed font-medium">
            {t.bagEmptySub}
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
