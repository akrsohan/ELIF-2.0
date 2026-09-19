import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  ShoppingBag,
  Truck,
  Lock,
  ArrowRight,
  User,
  ShieldCheck,
  Banknote,
  Upload,
  X,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import {
  createOrderInSupabase,
  uploadPaymentProof,
  fetchPaymentConfiguration,
  getStoredTailoringProfile,
  PaymentNumbersConfig,
} from '../services/supabaseService';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, localizeProduct, formatPrice, formatNumber } = useLanguage();
  const { cartItems, clearCart, showToast } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderNumber: string;
    source: 'supabase' | 'local';
    customerName: string;
    totalAmount: number;
    deliveryFee: number;
    paymentMethod: string;
  } | null>(null);

  // Manual delivery prepayment method: 'bkash' | 'nagad' | 'rocket'
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [district, setDistrict] = useState<'Dhaka' | 'Chattogram' | 'Sylhet' | 'Other'>('Dhaka');

  // Customer shipping details
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Manual Payment Proof details
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Dynamic payment receiving config from Supabase
  const [paymentConfig, setPaymentConfig] = useState<PaymentNumbersConfig>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPaymentConfiguration().then(setPaymentConfig);
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

  // Dynamic delivery charge based on district
  const deliveryFee = district === 'Dhaka' ? 80 : 150;
  const finalTotal = subtotal + deliveryFee;

  // Cleanup object preview URL
  useEffect(() => {
    return () => {
      if (screenshotPreview && screenshotPreview.startsWith('blob:')) {
        URL.revokeObjectURL(screenshotPreview);
      }
    };
  }, [screenshotPreview]);

  const handleFileSelect = (file: File) => {
    setUploadError(null);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setUploadError(
        language === 'bn'
          ? 'শুধুমাত্র JPG, PNG অথবা WEBP ইমেজ ফরম্যাট আপলোড করুন।'
          : 'Please upload JPG, JPEG, PNG, or WEBP image format only.'
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(
        language === 'bn'
          ? 'ফাইলের সাইজ ১০ মেগাবাইট (10MB) এর কম হতে হবে।'
          : 'File size must be under 10MB.'
      );
      return;
    }

    setScreenshotFile(file);
    const preview = URL.createObjectURL(file);
    setScreenshotPreview(preview);
  };

  const handleRemoveFile = () => {
    if (screenshotPreview && screenshotPreview.startsWith('blob:')) {
      URL.revokeObjectURL(screenshotPreview);
    }
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
    showToast(language === 'bn' ? 'নম্বর কপি করা হয়েছে!' : 'Payment number copied!');
  };

  const getReceiverNumber = (method: 'bkash' | 'nagad' | 'rocket') => {
    if (method === 'bkash') {
      return paymentConfig.bkashNumber || '01700-000000';
    }
    if (method === 'nagad') {
      return paymentConfig.nagadNumber || '01700-000000';
    }
    if (method === 'rocket') {
      return paymentConfig.rocketNumber || '01700-000000-8';
    }
    return '01700-000000';
  };

  const isFormValid =
    customerName.trim().length > 0 &&
    phone.trim().length > 0 &&
    address.trim().length > 0 &&
    screenshotFile !== null &&
    !isSubmitting;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      showToast(
        language === 'bn'
          ? 'অনুগ্রহ করে আপনার নাম, মোবাইল ও ডেলিভারি ঠিকানা দিন।'
          : 'Please enter your name, active phone, and delivery address.'
      );
      return;
    }

    if (cartItems.length === 0) {
      showToast(language === 'bn' ? 'আপনার শপিং ব্যাগ খালি।' : 'Your shopping bag is empty.');
      navigate('/shop');
      return;
    }

    if (!screenshotFile) {
      showToast(
        language === 'bn'
          ? 'অনুগ্রহ করে ডেলিভারি চার্জ পেমেন্টের স্ক্রিনশট আপলোড করুন।'
          : 'Please upload your delivery charge payment proof screenshot.'
      );
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    const generatedOrderNumber = `EL-BD${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // Step 1: Upload payment screenshot to private Supabase bucket 'payment-proofs'
      const uploadRes = await uploadPaymentProof(screenshotFile, generatedOrderNumber);

      if (!uploadRes.success) {
        setUploadError(uploadRes.error || 'Payment screenshot upload failed. Please try again.');
        showToast(
          language === 'bn'
            ? 'পেমেন্ট স্ক্রিনশট আপলোড ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।'
            : 'Payment screenshot upload failed. Please try again.'
        );
        setIsSubmitting(false);
        return;
      }

      // Step 2: Create order with status 'pending' and delivery_payment_status 'under_review'
      const formattedAddress = [address.trim(), city, postalCode].filter(Boolean).join(', ');
      const res = await createOrderInSupabase({
        orderNumber: generatedOrderNumber,
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryAddress: formattedAddress,
        district,
        paymentMethod,
        paymentStatus: 'payment_submitted',
        deliveryPaymentStatus: 'under_review',
        paymentProofUrl: uploadRes.storagePath || uploadRes.publicUrl,
        deliveryChargePaid: deliveryFee,
        cartItems,
        subtotal,
        deliveryFee,
        totalAmount: finalTotal,
        notes: notes.trim(),
      });

      // Step 3: Success state - ONLY clear cart on verified success
      setOrderConfirmed({
        orderNumber: res.orderNumber,
        source: res.source,
        customerName: customerName.trim(),
        totalAmount: finalTotal,
        deliveryFee,
        paymentMethod,
      });

      clearCart();

      showToast(
        language === 'bn'
          ? 'পেমেন্ট প্রুফ সফলভাবে জমা হয়েছে। আপনার অর্ডারটি ভেরিফিকেশনে রয়েছে।'
          : 'Payment proof submitted successfully. Your order is now under verification.'
      );
    } catch (err: any) {
      console.error('Checkout submission error:', err);
      showToast(
        language === 'bn'
          ? 'অর্ডার প্রসেস করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।'
          : 'Failed to complete order submission. Please check details and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was just placed, render confirmation screen with exact required messaging
  if (orderConfirmed) {
    return (
      <div className="w-full max-w-2xl mx-auto py-10 px-4 selection:bg-[#d6edd2] selection:text-[#18281b] animate-fadeIn">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#bedec0] text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#edf6eb] text-[#1b5e28] flex items-center justify-center mb-5 border-2 border-[#bedec0]">
            <Clock className="w-10 h-10 text-[#1b5e28] animate-pulse" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#1b5e28] bg-[#edf6eb] px-4 py-1.5 rounded-full border border-[#bedec0]">
            {language === 'bn' ? 'অর্ডার গ্রহণ সম্পন্ন' : 'ORDER RECEIVED'}
          </span>

          <h1 className="font-display font-black text-[24px] sm:text-[32px] text-[#0f2113] tracking-tight mt-3">
            {language === 'bn' ? 'ধন্যবাদ, আপনার অর্ডার গ্রহণ করা হয়েছে' : 'Thank you for your order.'}
          </h1>

          {/* EXACT CUSTOMER-FACING MESSAGE */}
          <div className="bg-[#edf6eb] p-4.5 sm:p-5 rounded-2xl border-2 border-[#1b5e28]/40 my-6 text-left w-full shadow-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#1b5e28] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13.5px] sm:text-[14.5px] font-bold text-[#0f2113] leading-relaxed">
                  {language === 'bn'
                    ? 'Payment proof submitted successfully. Your order is now under verification. You will receive an SMS regarding your order confirmation within 1–12 hours.'
                    : 'Payment proof submitted successfully. Your order is now under verification. You will receive an SMS regarding your order confirmation within 1–12 hours.'}
                </p>
                <p className="text-[11.5px] text-[#335639] mt-2">
                  {language === 'bn'
                    ? 'আমাদের কনসিয়ার্জ টিম আপনার প্রেরিত ট্রানজেকশন ও পেমেন্ট স্ক্রিনশট যাচাই করে অর্ডার কনফার্মেশন এসএমএস পাঠাবে।'
                    : 'Our concierge desk is validating your transaction proof. Cash on delivery balance will be collected upon garment inspection.'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Manifest Card */}
          <div className="w-full bg-[#faf7eb] p-5 rounded-2xl border border-[#bedec0] mb-6 text-left space-y-2.5 text-[13px]">
            <div className="flex justify-between items-center pb-2 border-b border-[#bedec0]">
              <span className="text-[#35573a] font-bold">
                {language === 'bn' ? 'অর্ডার নম্বর:' : 'Order Number:'}
              </span>
              <span className="font-black text-[15px] text-[#0f2113]">#{orderConfirmed.orderNumber}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#35573a] font-bold">
                {language === 'bn' ? 'ডেলিভারি পেমেন্ট স্ট্যাটাস:' : 'Delivery Payment:'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] text-[#92400e] text-[11px] font-black uppercase tracking-wider border border-[#fde68a]">
                <Clock className="w-3 h-3" />
                Under Verification
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#35573a] font-bold">
                {language === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'}
              </span>
              <span className="font-black uppercase text-[#0f2113]">
                {orderConfirmed.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#35573a] font-bold">
                {language === 'bn' ? 'প্রদত্ত ডেলিভারি চার্জ:' : 'Amount Submitted:'}
              </span>
              <span className="font-black text-[#1b5e28]">
                {formatPrice(orderConfirmed.deliveryFee)} (Prepaid)
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#bedec0]">
              <span className="text-[#35573a] font-bold">
                {language === 'bn' ? 'বাকি প্রদেয় মূল্য (ক্যাশ অন ডেলিভারি):' : 'Remaining Balance (COD):'}
              </span>
              <span className="font-black text-[15px] text-[#0f2113]">
                {formatPrice(orderConfirmed.totalAmount - orderConfirmed.deliveryFee)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link
              to={`/account/orders/${orderConfirmed.orderNumber}`}
              className="flex-1 h-13 rounded-2xl bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1b5e28] transition-colors shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>{language === 'bn' ? 'অর্ডার দেখুন' : 'View Order'}</span>
            </Link>

            <Link
              to="/shop"
              className="flex-1 h-13 rounded-2xl bg-[#edf6eb] text-[#0f2113] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border border-[#bedec0] hover:bg-[#dcefe0] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'bn' ? 'আরও কেনাকাটা করুন' : 'Continue Shopping'}</span>
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
          {language === 'bn'
            ? 'অনুগ্রহ করে প্রথমে কালেকশন থেকে পোশাক নির্বাচন করুন।'
            : 'Please select garments from our collections to proceed with checkout.'}
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

  const receiverNumber = getReceiverNumber(paymentMethod);

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
          {language === 'bn' ? 'ডেলিভারি চার্জ প্রি-পেমেন্ট ও অর্ডার' : 'Delivery Prepayment & Order Placement'}
        </h1>
      </div>

      {/* 3. CHECKOUT FORM & SUMMARY */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: RECIPIENT & DELIVERY CHARGE PREPAYMENT (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Recipient Information Card */}
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
                  <option value="Dhaka">{language === 'bn' ? 'ঢাকা (Dhaka - ৳80)' : 'Dhaka (৳80)'}</option>
                  <option value="Chattogram">{language === 'bn' ? 'চট্টগ্রাম (Chattogram - ৳150)' : 'Chattogram (৳150)'}</option>
                  <option value="Sylhet">{language === 'bn' ? 'সিলেট (Sylhet - ৳150)' : 'Sylhet (৳150)'}</option>
                  <option value="Other">{language === 'bn' ? 'অন্যান্য জেলা (Nationwide - ৳150)' : 'Other Districts (৳150)'}</option>
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

          {/* 2. MANUAL DELIVERY CHARGE PREPAYMENT SECTION */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#bedec0] flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#edf4ea] text-[#0f2113]">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-[#1b5e28]" />
                <h2 className="font-display font-black text-[16px] sm:text-[18px]">
                  {language === 'bn' ? '২. ডেলিভারি চার্জ পরিশোধ ও পেমেন্ট প্রুফ' : '2. Pay Delivery Charge (Prepayment)'}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#edf6eb] px-3 py-1 rounded-full border border-[#bedec0]">
                <span className="text-[11px] font-bold text-[#335639]">
                  {language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Charge:'}
                </span>
                <span className="font-black text-[13px] text-[#1b5e28]">{formatPrice(deliveryFee)}</span>
              </div>
            </div>

            {/* Explanatory callout */}
            <div className="p-3.5 rounded-2xl bg-[#faf7eb] border border-[#ded6be] text-[12.5px] text-[#2c4e31] leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#1b5e28] shrink-0 mt-0.5" />
              <span>
                {language === 'bn'
                  ? 'অর্ডার নিশ্চিত করতে অনুগ্রহ করে প্রথমে শুধুমাত্র ডেলিভারি চার্জ ম্যানুয়ালি পাঠিয়ে ট্রানজেকশন আইডি এবং স্ক্রিনশট আপলোড করুন। বাকি মূল্যের পোশাক হাতে পেয়ে ক্যাশ অন ডেলিভারিতে পরিশোধ করবেন।'
                  : 'Please pay the delivery charge first to submit your order. The remaining garment value will be collected via Cash on Delivery upon inspection.'}
              </span>
            </div>

            {/* Payment Method Selector: bKash, Nagad, Rocket */}
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113] block mb-2">
                {language === 'bn' ? 'পেমেন্ট মাধ্যম নির্বাচন করুন *' : 'Select Payment Method *'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* bKash */}
                <label
                  className={`p-3.5 rounded-2xl border-2 flex flex-col gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-[#e2136e] bg-[#fce4ec]/40 shadow-xs'
                      : 'border-[#bedec0] bg-white hover:border-[#badbb3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="accent-[#e2136e] cursor-pointer"
                      />
                      <span className="font-black text-[13px] text-[#0f2113]">bKash</span>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#e2136e] text-white">
                      Send Money
                    </span>
                  </div>
                  <p className="text-[11px] text-[#555] pl-6">
                    {language === 'bn' ? 'বিকাশ সেন্ড মানি' : 'Personal Send Money'}
                  </p>
                </label>

                {/* Nagad */}
                <label
                  className={`p-3.5 rounded-2xl border-2 flex flex-col gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-[#f58220] bg-[#fff3e0]/40 shadow-xs'
                      : 'border-[#bedec0] bg-white hover:border-[#badbb3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="nagad"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="accent-[#f58220] cursor-pointer"
                      />
                      <span className="font-black text-[13px] text-[#0f2113]">Nagad</span>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#f58220] text-white">
                      Send Money
                    </span>
                  </div>
                  <p className="text-[11px] text-[#555] pl-6">
                    {language === 'bn' ? 'নগদ সেন্ড মানি' : 'Personal Send Money'}
                  </p>
                </label>

                {/* Rocket */}
                <label
                  className={`p-3.5 rounded-2xl border-2 flex flex-col gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'rocket'
                      ? 'border-[#8c3494] bg-[#f3e5f5]/40 shadow-xs'
                      : 'border-[#bedec0] bg-white hover:border-[#badbb3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="rocket"
                        checked={paymentMethod === 'rocket'}
                        onChange={() => setPaymentMethod('rocket')}
                        className="accent-[#8c3494] cursor-pointer"
                      />
                      <span className="font-black text-[13px] text-[#0f2113]">Rocket</span>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#8c3494] text-white">
                      Send Money
                    </span>
                  </div>
                  <p className="text-[11px] text-[#555] pl-6">
                    {language === 'bn' ? 'রকেট সেন্ড মানি' : 'Personal Send Money'}
                  </p>
                </label>
              </div>
            </div>

            {/* Step-by-Step Payment Instructions Box */}
            <div className="bg-[#edf6eb] rounded-2xl p-4 sm:p-5 border border-[#bedec0] flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-[#bedec0] pb-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1b5e28]">
                  {language === 'bn' ? 'পেমেন্ট নির্দেশিকা' : 'PAY DELIVERY CHARGE INSTRUCTIONS'}
                </span>
                <span className="text-[11px] font-bold text-[#335639]">
                  {paymentMethod.toUpperCase()} (Send Money)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
                <div className="bg-white p-3 rounded-xl border border-[#bedeb8] flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#35573a]">
                    {language === 'bn' ? 'প্রাপক নম্বর (Receiver Number)' : 'Recipient Wallet Number'}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-black text-[14px] text-[#0f2113] tracking-wide">
                      {receiverNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(receiverNumber)}
                      className="p-1.5 rounded-lg bg-[#edf6eb] text-[#1b5e28] hover:bg-[#dcefe0] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                      title="Copy Number"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copiedNumber ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#bedeb8] flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#35573a]">
                    {language === 'bn' ? 'প্রদেয় ডেলিভারি ফি (Amount to Send)' : 'Amount to Send'}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-black text-[16px] text-[#1b5e28]">
                      {formatPrice(deliveryFee)}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#edf6eb] text-[#1b5e28]">
                      Exact Fee
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11.5px] text-[#2c4e31] space-y-1 pt-1 border-t border-[#bedec0]">
                <p>1. Open your <strong>{paymentMethod.toUpperCase()} App</strong>.</p>
                <p>2. Select <strong>Send Money</strong> and enter recipient number <strong>{receiverNumber}</strong>.</p>
                <p>3. Send exactly <strong>{formatPrice(deliveryFee)}</strong> as the delivery charge.</p>
                <p>4. Take a <strong>Screenshot</strong> of the successful transfer receipt.</p>
              </div>
            </div>

            {/* Input: Payment Proof Screenshot Upload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0f2113]">
                  {language === 'bn' ? 'পেমেন্ট স্ক্রিনশট / প্রমাণ আপলোড *' : 'Payment Screenshot / Proof *'}
                </label>
                <span className="text-[10px] text-[#35573a] font-bold">
                  JPG, PNG, WEBP (Max 10MB)
                </span>
              </div>

              {/* Upload Dropzone / File Picker */}
              {!screenshotPreview ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileSelect(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-[#1b5e28] bg-[#edf6eb]'
                      : 'border-[#bedec0] bg-[#faf7eb] hover:bg-[#edf6eb]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-full bg-[#edf6eb] flex items-center justify-center text-[#1b5e28] border border-[#bedec0]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-[#0f2113]">
                      {language === 'bn' ? 'স্ক্রিনশট আপলোড করতে ক্লিক বা ড্রপ করুন' : 'Click to browse or drag & drop screenshot'}
                    </p>
                    <p className="text-[11px] text-[#35573a] mt-0.5">
                      {language === 'bn' ? 'বিকাশ, নগদ বা রকেট পেমেন্টের রসিদ' : 'Receipt of bKash, Nagad, or Rocket transfer'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#edf6eb] rounded-2xl border border-[#bedec0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={screenshotPreview}
                      alt="Payment proof preview"
                      className="w-14 h-14 object-cover rounded-xl border border-[#bedeb8] bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-[#0f2113] truncate">
                        {screenshotFile?.name || 'payment_proof.jpg'}
                      </p>
                      <p className="text-[10.5px] text-[#35573a]">
                        {screenshotFile ? `${(screenshotFile.size / 1024).toFixed(1)} KB` : 'Attached'} • Ready for upload
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 bg-white text-[#0f2113] border border-[#bedec0] text-[11px] font-bold rounded-lg hover:bg-[#f1f6ee] cursor-pointer"
                    >
                      {language === 'bn' ? 'পরিবর্তন' : 'Replace'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="w-8 h-8 rounded-lg bg-white text-[#c62828] border border-[#bedec0] flex items-center justify-center hover:bg-[#ffebee] cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="text-[11.5px] text-[#c62828] font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {uploadError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER MANIFEST & SUBMISSION (5 cols on lg) */}
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

            {/* Cost breakdown with explicit Prepayment vs COD callouts */}
            <div className="space-y-2 text-[13px] pt-3 border-t border-[#edf4ea]">
              <div className="flex justify-between text-[#305335]">
                <span>{language === 'bn' ? 'পোশাকের সাবটোটাল' : 'Garments Subtotal'}</span>
                <span className="font-bold text-[#0f2113]">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#305335] items-center">
                <span className="flex items-center gap-1">
                  <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                  <span className="text-[10px] font-black uppercase bg-[#d6edd2] text-[#113817] px-1.5 py-0.2 rounded">
                    Prepay
                  </span>
                </span>
                <span className="font-black text-[#1b5e28]">{formatPrice(deliveryFee)}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#faf7eb] border border-[#ded6be] text-[12px] space-y-1 my-1">
                <div className="flex justify-between text-[#1b5e28] font-bold">
                  <span>{language === 'bn' ? 'এখন প্রদেয় (ডেলিভারি চার্জ):' : 'Prepayment Required Now:'}</span>
                  <span className="font-black">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-[#35573a]">
                  <span>{language === 'bn' ? 'ডেলিভারির সময় প্রদেয় (COD):' : 'Payable on Delivery (COD):'}</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="flex justify-between text-[17px] font-black text-[#0f2113] pt-3 border-t border-[#edf4ea]">
                <span>{language === 'bn' ? 'সর্বমোট অর্ডার মূল্য' : 'Total Order Value'}</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Payment & Confirm Order Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full h-13 rounded-2xl bg-[#0f2113] text-white font-black text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-[#1b5e28] active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span>{language === 'bn' ? 'প্রুফ আপলোড ও অর্ডার প্রসেসিং...' : 'Submitting Proof & Order...'}</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{language === 'bn' ? 'পেমেন্ট প্রুফ জমা ও অর্ডার কনফার্ম' : 'Submit Payment & Confirm Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {!isFormValid && (
              <p className="text-[11px] text-center text-[#555]">
                {screenshotFile === null
                  ? language === 'bn'
                    ? '* পেমেন্ট স্ক্রিনশট প্রদান আবশ্যক'
                    : '* Screenshot proof is required to confirm'
                  : language === 'bn'
                  ? '* অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন'
                  : '* Please complete all required recipient fields'}
              </p>
            )}

            <div className="p-3 rounded-xl bg-[#edf6eb] border border-[#bedec0] flex items-center gap-2 text-[11.5px] text-[#1b5e28]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {language === 'bn'
                  ? 'আপনার পেমেন্ট প্রুফ সুরক্ষিতভাবে সুপাবেস ক্লাউডে যাচাইয়ের জন্য জমা হবে।'
                  : 'Proof securely stored in private cloud storage for manual concierge verification.'}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
