import React, { useState } from 'react';
import { CartItem, TabType } from '../types';

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
      onShowToast('10% Dhaka Atelier privilege applied.');
    } else if (code === 'BKASH15' || code === 'ELIFVIP') {
      setDiscountPercent(15);
      onShowToast('15% VIP customer courtesy applied.');
    } else {
      onShowToast('Invalid coupon. Try: DHAKA10 or BKASH15');
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-28 selection:bg-[#ffdeaa]">
      {/* Header */}
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700]">
          Haute Acquisition • বাংলাদেশ
        </span>
        <h1 className="font-display text-[28px] sm:text-[32px] text-[#1d1b15] tracking-tight">
          Shopping Bag
        </h1>
        <p className="text-[13px] text-[#4b4640] mt-0.5">
          {cartItems.length} {cartItems.length === 1 ? 'creation' : 'creations'} selected • Delivered from Dhaka Atelier
        </p>
      </div>

      {/* Cart Items & Order Summary (Desktop Responsive 2-Column Grid) */}
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-10">
          {/* Left Column: Delivery & Items List */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            {/* Free Shipping Tier Banner */}
            <div className="bg-[#f9f3e9] border border-[#cec5bd]/60 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#1d1b15] mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#7d5700]">local_shipping</span>
                  {isFreeShipping ? 'Complimentary Bangladesh Delivery Unlocked' : `Add ৳${(freeShippingThreshold - subtotal).toLocaleString()} for Free Delivery`}
                </span>
                <span className="text-[#7d5700]">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#ede7dd] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7d5700] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex flex-col gap-3">
          {cartItems.map((item, index) => (
            <div
              key={`${item.product.id}-${item.size}-${index}`}
              className="flex bg-[#f3ede3] rounded-xl p-3 shadow-sm border border-[#e8e2d8] gap-3 relative"
            >
              <div className="w-20 sm:w-24 h-28 shrink-0 rounded-lg overflow-hidden bg-[#ede7dd]">
                <img
                  className="w-full h-full object-cover"
                  src={item.product.image}
                  alt={item.product.alt}
                />
              </div>

              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-[15px] font-semibold text-[#1d1b15] truncate">
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-[#4b4640] hover:text-[#ba1a1a] p-1 cursor-pointer transition-colors active:scale-90"
                      aria-label="Remove item"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-[#4b4640] mt-0.5">
                    {item.color} • Size: {item.size}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#e8e2d8]/70">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-[#ffffff] rounded-lg border border-[#cec5bd] h-8 px-0.5">
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      className="w-8 h-full flex items-center justify-center text-[#1d1b15] hover:text-[#7d5700] active:scale-95 transition-transform cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <span className="material-symbols-outlined text-[14px]">remove</span>
                    </button>
                    <span className="w-7 text-center text-[12px] font-semibold text-[#1d1b15]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-[#1d1b15] hover:text-[#7d5700] active:scale-95 transition-transform cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>

                  <span className="text-[16px] font-semibold text-[#1d1b15]">
                    {item.product.currency}
                    {item.product.price * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Complimentary Gift Box Option */}
          <div className="bg-[#f3ede3] rounded-xl p-3.5 border border-[#e8e2d8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#7d5700]">redeem</span>
              <div>
                <p className="text-[13px] font-semibold text-[#1d1b15]">
                  Atelier Monogram Gift Packaging
                </p>
                <p className="text-[11px] text-[#4b4640]">
                  Embossed archival box & bronze grosgrain ribbon (Complimentary)
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeGiftWrap}
              onChange={(e) => setIncludeGiftWrap(e.target.checked)}
              className="w-5 h-5 accent-[#7d5700] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Sticky Order Summary & Checkout */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 flex flex-col gap-4">
          <div className="bg-[#f3ede3] rounded-xl p-4 sm:p-5 border border-[#e8e2d8] space-y-4 shadow-sm">
            <h2 className="font-display text-[18px] text-[#1d1b15] font-semibold border-b border-[#ded5cb] pb-2.5">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Code (Try: AUTUMN25, DHAKA10)"
                className="flex-1 min-w-0 h-11 px-3 rounded-lg bg-[#ffffff] border border-[#cec5bd] text-[#1d1b15] text-[12px] uppercase placeholder:normal-case placeholder:text-[#4b4640]/60 focus:outline-none focus:ring-1 focus:ring-[#7d5700]"
              />
              <button
                type="submit"
                className="h-11 px-4 rounded-lg bg-[#1d1b19] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-[#7d5700] active:scale-95 transition-all cursor-pointer shrink-0"
              >
                Apply
              </button>
            </form>

            {/* Order Financial Breakdown */}
            <div className="space-y-2.5 pt-1 text-[13px]">
              <div className="flex justify-between text-[#4b4640]">
                <span>Bag Subtotal ({cartItems.length} items)</span>
                <span className="font-semibold text-[#1d1b15]">৳{subtotal.toLocaleString()}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-[#7d5700]">
                  <span>Promotional Courtesy ({discountPercent}%)</span>
                  <span className="font-semibold">-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-[#4b4640]">
                <span>Nationwide Courier (Pathao/Steadfast)</span>
                <span className="font-semibold text-[#7d5700]">
                  {isFreeShipping ? 'Complimentary' : `৳${shippingCost}`}
                </span>
              </div>

              <div className="flex justify-between text-[#4b4640]">
                <span>VAT / Tax (Bangladesh)</span>
                <span className="font-semibold text-[#1d1b15]">Included in Price</span>
              </div>

              <div className="border-t border-[#cec5bd] pt-3 flex justify-between items-baseline text-[16px]">
                <span className="font-semibold text-[#1d1b15]">Total Due</span>
                <span className="font-display text-[22px] sm:text-[24px] font-bold text-[#1d1b15]">
                  ৳{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Primary Checkout CTA */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={onOpenCheckout}
              className="w-full h-12 sm:h-13 bg-[#ffc55f] text-[#755100] hover:bg-[#ffdeaa] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>

            {/* Trust badges */}
            <div className="pt-2 border-t border-[#cec5bd]/40 flex flex-col gap-2 text-[11px] text-[#4b4640]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#2e7d32]">verified_user</span>
                <span>Cash on Delivery (পণ্য দেখে মূল্য পরিশোধ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#7d5700]">sync</span>
                <span>7-Day Hassle-Free Size Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className="py-20 text-center bg-[#f3ede3] rounded-xl border border-[#e8e2d8] p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#ede7dd] flex items-center justify-center text-[#7d5700] mb-4">
            <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
          </div>
          <h2 className="font-display text-[22px] text-[#1d1b15] mb-2">
            Your shopping bag is empty
          </h2>
          <p className="text-[13px] text-[#4b4640] max-w-[280px] mb-6 leading-relaxed">
            Select silhouettes from Autumn Solace ’25 or explore curated knitwear and tailoring.
          </p>
          <button
            onClick={() => onNavigateTab('home')}
            className="h-12 px-6 rounded-lg bg-[#1d1b19] text-white text-[12px] font-semibold uppercase tracking-wider active:scale-95 transition-all hover:bg-[#7d5700] cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      )}
    </div>
  );
};
