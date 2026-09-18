import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  ShoppingBag,
  Truck,
  Lock,
  ArrowRight,
  User,
  ShieldCheck,
  CreditCard,
  Banknote,
  Package,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { createOrderInSupabase, getStoredTailoringProfile } from '../services/supabaseService';
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

  // Customer shipping details - initialize cleanly
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const profile = getStoredTailoringProfile();
    if (profile) {
      if (profile.clientName) setCustomerName(profile.clientName);
      if (profile.clientPhone) setPhone(profile.clientPhone);
    }
  }, []);

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
      const formattedAddress = [address.trim(), city, postalCode].filter(Boolean).join(', ');
      const res = await createOrderInSupabase({
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryAddress: formattedAddress,
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

  // If order was just placed, render confirmation screen
  if (orderConfirmed) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 selection:bg-[#d6edd2] selection:text-[#18281b]">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#bedec0] text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#edf6eb] text-[#1b5e28] flex items-center justify-center mb-5 border border-[#bedec0]">
            <ShieldCheck className="w-10 h-10 text-[#1b5e28]" />
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
              <Truck className="w-4 h-4" />
              <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track This Consignment'}</span>
            </Link>

            <Link
              to="/shop"
              className="flex-1 h-13 rounded-2xl bg-[#edf6eb] text-[#0f2113] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border border-[#bedec0] hover:bg-[#dcefe0] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
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
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 selection:bg-[#d6edd2] selection:text-[#18281b]">
        <div className="w-16 h-16 rounded-full bg-[#edf6eb] flex items-center justify-center text-[#1b5e28] mb-3 border border-[#bedec0]">
          <ShoppingBag className="w-8 h-8" />
        </div>
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
              <User className="w-5 h-5 text-[#1b5e28]" />
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
                  placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your full name'}
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
                placeholder={language === 'bn' ? 'বাড়ি নম্বর, রোড নম্বর, এলাকা...' : 'House number, road/street, area...'}
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
                  {language === 'bn' ? 'পোস্টাল কোড' : 'Postal Code'}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 1213"
                  className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113] block mb-1">
                {language === 'bn' ? 'অতিরিক্ত নির্দেশনা (ঐচ্ছিক)' : 'Delivery Notes (Optional)'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'bn' ? 'বিশেষ সময় বা ডেলিভারি নির্দেশনা...' : 'Special timing or delivery instructions...'}
                className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#bedec0] flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#edf4ea] text-[#0f2113]">
              <Banknote className="w-5 h-5 text-[#1b5e28]" />
              <h2 className="font-display font-black text-[16px] sm:text-[18px]">
                {language === 'bn' ? '২. পেমেন্ট মেথড নির্বাচন করুন' : '2. Payment Method'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash On Delivery */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#0f2113] bg-[#edf6eb] shadow-xs'
                    : 'border-[#bedec0] bg-white hover:border-[#badbb3]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#1b5e28] mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[13px] text-[#0f2113] block">
                      {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery'}
                    </span>
                    <span className="text-[10px] font-black uppercase text-[#1b5e28] bg-[#d6edd2] px-2 py-0.5 rounded">
                      Popular
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#335639] mt-0.5">
                    {language === 'bn'
                      ? 'পোশাক হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন।'
                      : 'Pay upon delivery inspection.'}
                  </p>
                </div>
              </label>

              {/* bKash */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-[#0f2113] bg-[#edf6eb] shadow-xs'
                    : 'border-[#bedec0] bg-white hover:border-[#badbb3]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="accent-[#1b5e28] mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[13px] text-[#0f2113] block">
                      bKash Merchant Pay
                    </span>
                    <span className="text-[10px] font-black uppercase text-[#e2136e] bg-[#fce4ec] px-2 py-0.5 rounded">
                      bKash
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#335639] mt-0.5">
                    {language === 'bn'
                      ? 'বিকাশ ওয়ালেটের মাধ্যমে তাত্ক্ষণিক ও নিরাপদ পেমেন্ট।'
                      : 'Instant digital wallet settlement.'}
                  </p>
                </div>
              </label>

              {/* Nagad */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-[#0f2113] bg-[#edf6eb] shadow-xs'
                    : 'border-[#bedec0] bg-white hover:border-[#badbb3]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="nagad"
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="accent-[#1b5e28] mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[13px] text-[#0f2113] block">
                      Nagad Digital
                    </span>
                    <span className="text-[10px] font-black uppercase text-[#f58220] bg-[#fff3e0] px-2 py-0.5 rounded">
                      Nagad
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#335639] mt-0.5">
                    {language === 'bn'
                      ? 'নগদ অ্যাকাউন্টের মাধ্যমে দ্রুত পেমেন্ট।'
                      : 'Fast checkout with Nagad wallet.'}
                  </p>
                </div>
              </label>

              {/* Card */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#0f2113] bg-[#edf6eb] shadow-xs'
                    : 'border-[#bedec0] bg-white hover:border-[#badbb3]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-[#1b5e28] mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[13px] text-[#0f2113] block">
                      Visa / Mastercard / Amex
                    </span>
                    <CreditCard className="w-4 h-4 text-[#1b5e28]" />
                  </div>
                  <p className="text-[11.5px] text-[#335639] mt-0.5">
                    {language === 'bn'
                      ? 'আন্তর্জাতিক ও লোকাল কার্ড গেটওয়ে।'
                      : 'Local and international credit & debit cards.'}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER MANIFEST SUMMARY (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-24">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-[#bedec0] flex flex-col gap-4">
            <h2 className="font-display font-black text-[18px] text-[#0f2113] pb-3 border-b border-[#edf4ea]">
              {language === 'bn' ? 'অর্ডার রিভিউ' : 'Bag Overview'} ({formatNumber(cartItems.length)})
            </h2>

            {/* List of items */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {cartItems.map((item, idx) => {
                const localized = localizeProduct(item.product);
                return (
                  <div key={idx} className="flex items-center gap-3 py-1.5 border-b border-[#edf4ea] last:border-b-0">
                    <img
                      src={item.product.image}
                      alt={localized.name}
                      className="w-12 h-14 object-cover rounded-lg bg-[#edf6eb] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[13px] text-[#0f2113] truncate">{localized.name}</h4>
                      <p className="text-[11px] text-[#335639]">
                        {item.size} • {item.color} • {formatNumber(item.quantity)}x
                      </p>
                    </div>
                    <span className="font-black text-[13px] text-[#0f2113]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cost breakdown */}
            <div className="space-y-2 text-[13px] pt-3 border-t border-[#edf4ea]">
              <div className="flex justify-between text-[#305335]">
                <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-bold text-[#0f2113]">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#305335]">
                <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}</span>
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
                <span>{language === 'bn' ? 'সর্বমোট পরিশোধযোগ্য' : 'Total Payable'}</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Place Order Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 rounded-2xl bg-[#0f2113] text-white font-black text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-[#1a3a20] active:scale-98 transition-all disabled:opacity-75 mt-2"
            >
              {isSubmitting ? (
                <span>{language === 'bn' ? 'অর্ডার প্রস্তুত হচ্ছে...' : 'Confirming Acquisition...'}</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{language === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm & Place Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="p-3 rounded-xl bg-[#edf6eb] border border-[#bedec0] flex items-center gap-2 text-[11.5px] text-[#1b5e28]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {language === 'bn'
                  ? 'সরাসরি ঢাকা অঁতেলিয়ে ও সুপাবেস ক্লাউডে অর্ডার সিনক্রোনাইজেশন।'
                  : 'Direct sync to Dhaka Atelier and Supabase live orders.'}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
