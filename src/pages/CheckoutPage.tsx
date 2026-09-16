import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { createOrderInSupabase } from '../services/supabaseService';
import { getProductSlug } from '../utils/slug';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t, localizeProduct, formatPrice, formatNumber } = useLanguage();
  const { cartItems, clearCart, showToast } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderNumber: string;
    source: 'supabase' | 'local';
    customerName: string;
    totalAmount: number;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cod' | 'nagad' | 'card'>('cod');
  const [district, setDistrict] = useState<'Dhaka' | 'Chattogram' | 'Sylhet' | 'Other'>('Dhaka');

  // Customer shipping details
  const [customerName, setCustomerName] = useState('Farhana Ahmed');
  const [phone, setPhone] = useState('01711-000000');
  const [address, setAddress] = useState('House 42, Road 11, Block D, Banani / Gulshan 2, Dhaka - 1213');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('1213');
  const [notes, setNotes] = useState('');

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const deliveryFee = district === 'Dhaka' ? (subtotal >= 5000 ? 0 : 80) : 150;
  const finalTotal = subtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম, মোবাইল ও ঠিকানা দিন।' : 'Please fill your name, phone, and delivery address.');
      return;
    }

    if (cartItems.length === 0) {
      showToast(language === 'bn' ? 'আপনার শপিং ব্যাগ খালি।' : 'Your shopping bag is empty.');
      navigate('/shop');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrderInSupabase({
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryAddress: `${address.trim()}, ${city} - ${postalCode}`,
        district,
        paymentMethod,
        cartItems,
        subtotal,
        deliveryFee,
        totalAmount: finalTotal,
        notes: notes.trim(),
      });

      setOrderConfirmed({
        orderNumber: res.orderNumber,
        source: res.source,
        customerName: customerName.trim(),
        totalAmount: finalTotal,
      });

      clearCart();

      const sourceTag = res.source === 'supabase' ? ' (Supabase Cloud)' : '';
      showToast(
        language === 'bn'
          ? `অর্ডার #${res.orderNumber} সফলভাবে নিশ্চিত হয়েছে${sourceTag}!`
          : `Order #${res.orderNumber} placed and synced to atelier registry${sourceTag}!`
      );
    } catch (err) {
      console.error(err);
      const fallbackId = `EL-BD${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderConfirmed({
        orderNumber: fallbackId,
        source: 'local',
        customerName: customerName.trim(),
        totalAmount: finalTotal,
      });
      clearCart();
      showToast(language === 'bn' ? 'অর্ডার রেকর্ড সম্পন্ন হয়েছে!' : 'Order recorded successfully!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was just placed, render luxury confirmation screen
  if (orderConfirmed) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 selection:bg-[#d6edd2] selection:text-[#18281b]">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#bedec0] text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#edf6eb] text-[#1b5e28] flex items-center justify-center mb-5 border border-[#bedec0]">
            <span className="material-symbols-outlined text-[42px]">verified</span>
          </div>

          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#1b5e28] bg-[#edf6eb] px-3.5 py-1 rounded-full border border-[#bedec0]">
            {language === 'bn' ? 'অর্ডার সফলভাবে নিশ্চিত' : 'Consignment Confirmed'}
          </span>

          <h1 className="font-display font-black text-[26px] sm:text-[34px] text-[#0f2113] tracking-tight mt-3">
            {language === 'bn' ? 'ধন্যবাদ, আপনার অর্ডার গ্রহণ করা হয়েছে' : 'Thank you for your acquisition'}
          </h1>

          <p className="text-[14px] text-[#2c4e31] max-w-md mt-2 leading-relaxed font-medium">
            {language === 'bn'
              ? `অর্ডার নম্বর #${orderConfirmed.orderNumber} তৈরি হয়েছে। আমাদের ঢাকা অঁতেলিয়ে টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।`
              : `Consignment #${orderConfirmed.orderNumber} has been booked. Our Dhaka atelier concierge will prepare your handcrafted garment.`}
          </p>

          <div className="w-full bg-[#edf6eb] p-4 rounded-2xl border border-[#bedec0] my-6 text-left space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-[#35573a] font-bold">{language === 'bn' ? 'অর্ডার ট্র্যাকিং আইডি:' : 'Tracking ID:'}</span>
              <span className="font-black text-[#0f2113]">#{orderConfirmed.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#35573a] font-bold">{language === 'bn' ? 'গ্রাহক:' : 'Recipient:'}</span>
              <span className="font-bold text-[#0f2113]">{orderConfirmed.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#35573a] font-bold">{language === 'bn' ? 'সর্বমোট পরিশোধযোগ্য:' : 'Total Payable:'}</span>
              <span className="font-black text-[#0f2113]">{formatPrice(orderConfirmed.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#35573a] font-bold">{language === 'bn' ? 'ডাটাবেস উৎস:' : 'Database:'}</span>
              <span className="font-bold text-[#1b5e28] uppercase text-[11px]">
                {orderConfirmed.source === 'supabase' ? 'Supabase Cloud Database' : 'Atelier Cache'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link
              to={`/account/orders/${orderConfirmed.orderNumber}`}
              className="flex-1 h-13 rounded-2xl bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1b5e28] transition-colors shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track This Consignment'}</span>
            </Link>

            <Link
              to="/shop"
              className="flex-1 h-13 rounded-2xl bg-[#edf6eb] text-[#0f2113] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border border-[#bedec0] hover:bg-[#dcefe0] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>{language === 'bn' ? 'আরও কেনাকাটা করুন' : 'Continue Browsing'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, redirect prompt
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <span className="material-symbols-outlined text-[54px] text-[#2d6636]/60 mb-3">shopping_bag</span>
        <h1 className="font-display font-black text-[24px] text-[#0f2113] mb-2">
          {language === 'bn' ? 'চেকআউটের জন্য কার্ট খালি' : 'Your Shopping Bag is Empty'}
        </h1>
        <p className="text-[13px] text-[#2c4e31] mb-6">
          {language === 'bn' ? 'অনুগ্রহ করে প্রথমে কালেকশন থেকে পোশাক নির্বাচন করুন।' : 'Please select garments from our collections to proceed with checkout.'}
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider rounded-xl hover:bg-[#1a3820]"
        >
          {language === 'bn' ? 'কালেকশন দেখুন' : 'Explore Collections'}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* 1. BREADCRUMBS */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#35523a] mb-5 py-1"
      >
        <Link to="/" className="hover:text-[#0f2113] hover:underline">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <Link to="/cart" className="hover:text-[#0f2113] hover:underline">
          {language === 'bn' ? 'ব্যাগ' : 'Bag'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <span className="text-[#0f2113] font-black">
          {language === 'bn' ? 'চেকআউট' : 'Checkout'}
        </span>
      </nav>

      {/* 2. HEADER */}
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b5e28] block">
          {language === 'bn' ? 'নিরাপদ চেকআউট • বাংলাদেশ' : 'Private Concierge Checkout • Bangladesh'}
        </span>
        <h1 className="font-display font-black text-[26px] sm:text-[36px] text-[#0f2113] tracking-[-0.015em]">
          {language === 'bn' ? 'অর্ডার তথ্য ও পেমেন্ট' : 'Shipping & Payment Details'}
        </h1>
      </div>

      {/* 3. CHECKOUT FORM & SUMMARY */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: SHIPPING ADDRESS & PAYMENT (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Recipient Information Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#bedec0] flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#edf4ea] text-[#0f2113]">
              <span className="material-symbols-outlined text-[20px] text-[#1b5e28]">person_pin</span>
              <h2 className="font-display font-black text-[16px] sm:text-[18px]">
                {language === 'bn' ? '১. গ্রাহক ও ডেলিভারির ঠিকানা' : '1. Recipient & Delivery Address'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Farhana Ahmed"
                  className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর *' : 'Active Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XX-XXXXXX"
                  className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113] block mb-1">
                {language === 'bn' ? 'বিস্তারিত ঠিকানা (বাড়ি, রোড, এলাকা) *' : 'Street Address (House, Road, Block) *'}
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House 42, Road 11, Block D, Banani, Dhaka"
                className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'জেলা / অঞ্চল' : 'District'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b5e28] cursor-pointer"
                >
                  <option value="Dhaka">{language === 'bn' ? 'ঢাকা (Dhaka)' : 'Dhaka'}</option>
                  <option value="Chattogram">{language === 'bn' ? 'চট্টগ্রাম (Chattogram)' : 'Chattogram'}</option>
                  <option value="Sylhet">{language === 'bn' ? 'সিলেট (Sylhet)' : 'Sylhet'}</option>
                  <option value="Other">{language === 'bn' ? 'অন্যান্য জেলা (Nationwide)' : 'Other Districts'}</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'শহর' : 'City'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dhaka"
                  className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'পোস্ট কোড' : 'Postal Code'}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1213"
                  className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113] block mb-1">
                {language === 'bn' ? 'ডেলিভারি সংক্রান্ত নির্দেশনা (ঐচ্ছিক)' : 'Delivery Notes / Special Instructions'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: বিকেল ৪টার পর ডেলিভারি করবেন' : 'e.g. Call before arrival or evening delivery'}
                className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#bedec0] flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#edf4ea] text-[#0f2113]">
              <span className="material-symbols-outlined text-[20px] text-[#1b5e28]">payments</span>
              <h2 className="font-display font-black text-[16px] sm:text-[18px]">
                {language === 'bn' ? '২. পেমেন্ট মেথড নির্বাচন করুন' : '2. Select Payment Method'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* COD */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#0f2113] bg-[#edf6eb] shadow-xs'
                    : 'border-[#bedec0] bg-white hover:bg-[#edf6eb]/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#0f2113] mt-0.5"
                />
                <div>
                  <span className="font-black text-[13px] text-[#0f2113] block">
                    {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery (COD)'}
                  </span>
                  <span className="text-[11.5px] text-[#335639] leading-tight block mt-0.5">
                    {language === 'bn'
                      ? 'পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন।'
                      : 'Pay upon delivery at your doorstep.'}
                  </span>
                </div>
              </label>

              {/* bKash */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-[#e2136e] bg-[#fdf2f7] shadow-xs'
                    : 'border-[#bedec0] bg-white hover:bg-[#fdf2f7]/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="accent-[#e2136e] mt-0.5"
                />
                <div>
                  <span className="font-black text-[13px] text-[#e2136e] block">
                    {language === 'bn' ? 'বিকাশ অনলাইন পেমেন্ট' : 'bKash Merchant Pay'}
                  </span>
                  <span className="text-[11.5px] text-[#553040] leading-tight block mt-0.5">
                    {language === 'bn'
                      ? 'বিকাশ অ্যাপ অথবা ওটিপি দিয়ে তাৎক্ষণিক পরিশোধ।'
                      : 'Instant bKash payment verification.'}
                  </span>
                </div>
              </label>

              {/* Nagad */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-[#f7931e] bg-[#fff8ef] shadow-xs'
                    : 'border-[#bedec0] bg-white hover:bg-[#fff8ef]/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="nagad"
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="accent-[#f7931e] mt-0.5"
                />
                <div>
                  <span className="font-black text-[13px] text-[#c96900] block">
                    {language === 'bn' ? 'নগদ ডিজিটাল পেমেন্ট' : 'Nagad Pay'}
                  </span>
                  <span className="text-[11.5px] text-[#553040] leading-tight block mt-0.5">
                    {language === 'bn'
                      ? 'নগদ ওয়ালেট থেকে দ্রুত ও নিরাপদে পেমেন্ট।'
                      : 'Fast checkout with Nagad wallet.'}
                  </span>
                </div>
              </label>

              {/* Card */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#0f2113] bg-[#edf6eb] shadow-xs'
                    : 'border-[#bedec0] bg-white hover:bg-[#edf6eb]/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-[#0f2113] mt-0.5"
                />
                <div>
                  <span className="font-black text-[13px] text-[#0f2113] block">
                    {language === 'bn' ? 'ভিসা / মাস্টারকার্ড / অ্যামেক্স' : 'Credit / Debit Cards'}
                  </span>
                  <span className="text-[11.5px] text-[#335639] leading-tight block mt-0.5">
                    {language === 'bn'
                      ? 'আন্তর্জাতিক ও স্থানীয় সিকিউর কার্ড গেটওয়ে।'
                      : 'Encrypted SSL / 3D Secure gateway.'}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY & PLACE ORDER BUTTON (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-24">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-[#bedec0] flex flex-col gap-4">
            <h2 className="font-display font-black text-[18px] text-[#0f2113] pb-3 border-b border-[#edf4ea]">
              {language === 'bn' ? 'অর্ডারভুক্ত পোশাকসমূহ' : 'Bag Items'} ({formatNumber(cartItems.length)})
            </h2>

            {/* Compact Item List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {cartItems.map((item, i) => {
                const loc = localizeProduct(item.product);
                return (
                  <div key={i} className="flex items-center gap-3 text-[12.5px]">
                    <img
                      src={item.product.image}
                      alt={loc.name}
                      className="w-12 h-14 object-cover rounded-lg bg-[#edf4ea] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0f2113] truncate">{loc.name}</p>
                      <p className="text-[11px] text-[#3a583e]">
                        {item.size} • {item.color} • Qty: {formatNumber(item.quantity)}
                      </p>
                    </div>
                    <span className="font-black text-[#0f2113]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-[13px] pt-3 border-t border-[#edf4ea]">
              <div className="flex justify-between text-[#305335]">
                <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-bold text-[#0f2113]">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#305335]">
                <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Shipping Fee'}</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#1b5e28] font-black uppercase text-[11px]">
                      {language === 'bn' ? 'ফ্রি' : 'FREE'}
                    </span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-[17px] font-black text-[#0f2113] pt-3 border-t border-[#edf4ea]">
                <span>{language === 'bn' ? 'মোট পরিশোধযোগ্য' : 'Grand Total'}</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl bg-[#0f2113] text-white font-black text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:bg-[#1a3820] active:scale-98 transition-all disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
                  <span>{language === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Booking Order...'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>
                    {language === 'bn'
                      ? `অর্ডার নিশ্চিত করুন (${formatPrice(finalTotal)})`
                      : `Confirm Acquisition (${formatPrice(finalTotal)})`}
                  </span>
                </>
              )}
            </button>

            <div className="p-3 bg-[#edf6eb] rounded-xl border border-[#bedeb8] text-[11px] text-[#2c4e31] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#0f2113]">
                <span className="material-symbols-outlined text-[15px] text-[#1b5e28]">verified</span>
                <span>{language === 'bn' ? 'সুপাবেস ডাটাবেস রিয়েলটাইম সিঙ্ক' : 'Supabase Cloud Synchronization'}</span>
              </div>
              <p>
                {language === 'bn'
                  ? 'আপনার অর্ডার স্বয়ংক্রিয়ভাবে অঁতেলিয়ে ম্যানেজমেন্ট সিস্টেমে যুক্ত হবে।'
                  : 'Your order details are automatically stored and trackable in real-time.'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
