import React, { useState, useEffect, useRef } from 'react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  createOrderInSupabase,
  uploadPaymentProof,
  fetchPaymentConfiguration,
  PaymentNumbersConfig,
} from '../services/supabaseService';
import {
  Check,
  ShoppingBag,
  Truck,
  Lock,
  ArrowRight,
  ShieldCheck,
  Banknote,
  Upload,
  X,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  totalAmount: number;
  onClose: () => void;
  onClearCart: () => void;
  onShowToast: (message: string) => void;
  onNavigateToAccount?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartItems,
  totalAmount,
  onClose,
  onClearCart,
  onShowToast,
  onNavigateToAccount,
}) => {
  const { language, t, localizeProduct, formatPrice, formatNumber } = useLanguage();

  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'processing' | 'confirmed'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [district, setDistrict] = useState<'Dhaka' | 'Chattogram' | 'Sylhet' | 'Other'>('Dhaka');

  // Client & delivery form fields
  const [customerName, setCustomerName] = useState(language === 'bn' ? 'ফারহানা আহমেদ' : 'Farhana Ahmed');
  const [phone, setPhone] = useState('01711-000000');
  const [address, setAddress] = useState(
    language === 'bn'
      ? 'বাড়ি ৪২, রোড ১১, ব্লক ডি, বনানী / গুলশান ২, ঢাকা - ১২১৩'
      : 'House 42, Road 11, Block D, Banani / Gulshan 2, Dhaka - 1213'
  );
  const [notes, setNotes] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>('EL-BD9104');
  const [dbSource, setDbSource] = useState<'supabase' | 'local'>('supabase');

  // Prepayment details
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PaymentNumbersConfig>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPaymentConfiguration().then(setPaymentConfig);
  }, []);

  useEffect(() => {
    return () => {
      if (screenshotPreview && screenshotPreview.startsWith('blob:')) {
        URL.revokeObjectURL(screenshotPreview);
      }
    };
  }, [screenshotPreview]);

  const deliveryFee = district === 'Dhaka' ? 80 : 150;
  const finalTotal = totalAmount + deliveryFee;

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
    onShowToast(language === 'bn' ? 'নম্বর কপি করা হয়েছে!' : 'Payment number copied!');
  };

  const getReceiverNumber = (method: 'bkash' | 'nagad' | 'rocket') => {
    if (method === 'bkash') return paymentConfig.bkashNumber || '01700-000000';
    if (method === 'nagad') return paymentConfig.nagadNumber || '01700-000000';
    if (method === 'rocket') return paymentConfig.rocketNumber || '01700-000000-8';
    return '01700-000000';
  };

  const receiverNumber = getReceiverNumber(paymentMethod);

  const isFormValid =
    customerName.trim().length > 0 &&
    phone.trim().length > 0 &&
    address.trim().length > 0 &&
    screenshotFile !== null;

  const handlePay = async () => {
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      onShowToast(
        language === 'bn'
          ? 'অনুগ্রহ করে গ্রাহকের নাম, মোবাইল ও ঠিকানা প্রদান করুন।'
          : 'Please enter name, mobile phone, and delivery address.'
      );
      return;
    }

    if (!screenshotFile) {
      onShowToast(
        language === 'bn'
          ? 'অনুগ্রহ করে ডেলিভারি চার্জ পেমেন্টের স্ক্রিনশট আপলোড করুন।'
          : 'Please upload delivery charge payment proof.'
      );
      return;
    }

    setStep('processing');
    const generatedOrderNumber = `EL-BD${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // Step 1: Upload proof screenshot
      const uploadRes = await uploadPaymentProof(screenshotFile, generatedOrderNumber);

      if (!uploadRes.success) {
        setUploadError(uploadRes.error || 'Payment proof upload failed.');
        setStep('details');
        onShowToast(
          language === 'bn'
            ? 'পেমেন্ট স্ক্রিনশট আপলোড ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।'
            : 'Payment proof upload failed. Please try again.'
        );
        return;
      }

      // Step 2: Create order with delivery_payment_status 'under_review'
      const res = await createOrderInSupabase({
        orderNumber: generatedOrderNumber,
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryAddress: address.trim(),
        district,
        paymentMethod,
        paymentStatus: 'payment_submitted',
        deliveryPaymentStatus: 'under_review',
        paymentProofUrl: uploadRes.storagePath || uploadRes.publicUrl,
        deliveryChargePaid: deliveryFee,
        cartItems,
        subtotal: totalAmount,
        deliveryFee,
        totalAmount: finalTotal,
        notes: notes.trim(),
      });

      setConfirmedOrderNumber(res.orderNumber);
      setDbSource(res.source);
      setStep('confirmed');
      onClearCart();

      onShowToast(
        language === 'bn'
          ? 'পেমেন্ট প্রুফ সফলভাবে জমা হয়েছে। আপনার অর্ডারটি ভেরিফিকেশনে রয়েছে।'
          : 'Payment proof submitted successfully. Your order is now under verification.'
      );
    } catch (err: any) {
      console.error('Order checkout error:', err);
      setStep('details');
      onShowToast(
        language === 'bn'
          ? 'অর্ডার প্রক্রিয়ায় সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Failed to complete order submission. Please try again.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={step !== 'processing' ? onClose : undefined}
    >
      <div
        className="w-full max-w-lg bg-[#faf7eb] rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#ded6be] flex flex-col no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#faf7eb]/95 backdrop-blur-md px-5 py-3.5 flex items-center justify-between border-b border-[#ded6be]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#1b5e28]" />
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0f2113]">
              {language === 'bn' ? 'নিরাপদ চেকআউট • বাংলাদেশ' : 'Secure Private Checkout'}
            </span>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#edf6eb] border border-[#bedec0] flex items-center justify-center text-[#0f2113] hover:bg-[#dcefe0] cursor-pointer active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {step === 'details' && (
          <div className="p-5 flex flex-col gap-4 selection:bg-[#d6edd2] selection:text-[#18281b]">
            {/* Delivery address */}
            <div className="bg-[#edf6eb] p-4 rounded-2xl border border-[#bedec0]">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#1b5e28] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  {language === 'bn' ? '১. গ্রাহক ও ডেলিভারির তথ্য' : '1. Recipient & Delivery'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-[10px] text-[#1b5e28] hover:underline font-bold cursor-pointer"
                >
                  {isEditingAddress
                    ? language === 'bn' ? 'সম্পন্ন' : 'Done'
                    : language === 'bn' ? 'পরিবর্তন করুন' : 'Edit Details'}
                </button>
              </div>

              {!isEditingAddress ? (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[13.5px] font-black text-[#0f2113]">{customerName}</p>
                    <span className="text-[11px] font-bold text-[#335639]">{phone}</span>
                  </div>
                  <p className="text-[12px] text-[#335639] mt-0.5">{address}</p>
                  <p className="text-[11px] text-[#1b5e28] mt-1 font-bold flex items-center gap-1">
                    <span>⚡</span>
                    {language === 'bn'
                      ? 'স্টিডফাস্ট / পাঠাও এক্সপ্রেস (২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি)'
                      : 'Steadfast / Pathao Express (24-48h Delivery in Bangladesh)'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 mt-2 pt-2 border-t border-[#bedec0] text-[12px]">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#335639] block mb-0.5">
                      {language === 'bn' ? 'গ্রাহকের পূর্ণ নাম *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-[#bedeb8] rounded-xl px-3 py-1.5 text-[12.5px] text-[#0f2113] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                      placeholder="e.g. Farhana Ahmed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#335639] block mb-0.5">
                      {language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Phone *'}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#bedeb8] rounded-xl px-3 py-1.5 text-[12.5px] text-[#0f2113] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                      placeholder="017XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#335639] block mb-0.5">
                      {language === 'bn' ? 'ডেলিভারি ঠিকানা *' : 'Delivery Address *'}
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-[#bedeb8] rounded-xl px-3 py-1.5 text-[12.5px] text-[#0f2113] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                      placeholder="House, Road, Area, City..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#335639] block mb-0.5">
                      {language === 'bn' ? 'ডেলিভারি নোট (ঐচ্ছিক)' : 'Delivery Note (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-[#bedeb8] rounded-xl px-3 py-1.5 text-[12.5px] text-[#0f2113] focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
                      placeholder={language === 'bn' ? 'যেমন: কল করে ডেলিভারি দিন...' : 'e.g. Call before arrival...'}
                    />
                  </div>
                </div>
              )}

              {/* District quick selector */}
              <div className="mt-2.5 pt-2 border-t border-[#bedec0] flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-[#335639] font-bold">{language === 'bn' ? 'অঞ্চল:' : 'Region:'}</span>
                {(['Dhaka', 'Chattogram', 'Sylhet', 'Other'] as const).map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => setDistrict(dist)}
                    className={`px-2.5 py-0.5 rounded-lg text-[10.5px] font-black uppercase transition-colors cursor-pointer ${
                      district === dist
                        ? 'bg-[#0f2113] text-white'
                        : 'bg-white text-[#335639] border border-[#bedec0] hover:bg-[#dcefe0]'
                    }`}
                  >
                    {dist === 'Dhaka'
                      ? language === 'bn' ? 'ঢাকা (৳80)' : 'Dhaka (৳80)'
                      : dist === 'Chattogram'
                      ? language === 'bn' ? 'চট্টগ্রাম (৳150)' : 'Chattogram (৳150)'
                      : dist === 'Sylhet'
                      ? language === 'bn' ? 'সিলেট (৳150)' : 'Sylhet (৳150)'
                      : language === 'bn' ? 'অন্যান্য জেলা (৳150)' : 'Other (৳150)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Delivery Prepayment Section */}
            <div className="bg-white p-4 rounded-2xl border border-[#bedec0] space-y-3">
              <div className="flex items-center justify-between border-b border-[#edf4ea] pb-2">
                <div className="flex items-center gap-1.5 text-[#0f2113]">
                  <Banknote className="w-4 h-4 text-[#1b5e28]" />
                  <span className="text-[12px] font-black uppercase tracking-wider">
                    {language === 'bn' ? '২. ডেলিভারি চার্জ প্রি-পেমেন্ট' : '2. Pay Delivery Charge'}
                  </span>
                </div>
                <span className="font-mono font-black text-[13px] text-[#1b5e28]">
                  {formatPrice(deliveryFee)}
                </span>
              </div>

              {/* Method Selector: bKash, Nagad, Rocket */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'bg-[#fce4ec] border-[#e2136e] shadow-xs'
                      : 'bg-[#edf6eb] border-[#bedec0] hover:border-[#badbb3]'
                  }`}
                >
                  <p className="text-[11.5px] font-black text-[#0f2113]">bKash</p>
                  <p className="text-[9.5px] text-[#e2136e] font-bold">Send Money</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'nagad'
                      ? 'bg-[#fff3e0] border-[#f58220] shadow-xs'
                      : 'bg-[#edf6eb] border-[#bedec0] hover:border-[#badbb3]'
                  }`}
                >
                  <p className="text-[11.5px] font-black text-[#0f2113]">Nagad</p>
                  <p className="text-[9.5px] text-[#f58220] font-bold">Send Money</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('rocket')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'rocket'
                      ? 'bg-[#f3e5f5] border-[#8c3494] shadow-xs'
                      : 'bg-[#edf6eb] border-[#bedec0] hover:border-[#badbb3]'
                  }`}
                >
                  <p className="text-[11.5px] font-black text-[#0f2113]">Rocket</p>
                  <p className="text-[9.5px] text-[#8c3494] font-bold">Send Money</p>
                </button>
              </div>

              {/* Instruction snippet */}
              <div className="p-3 bg-[#edf6eb] rounded-xl border border-[#bedeb8] text-[11.5px] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#35573a] font-bold">
                    {paymentMethod.toUpperCase()} Recipient:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-[#0f2113]">{receiverNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(receiverNumber)}
                      className="p-1 rounded bg-white text-[#1b5e28] text-[10px] font-bold border border-[#bedec0] cursor-pointer"
                    >
                      {copiedNumber ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[#1b5e28] font-bold">
                  <span>Exact Delivery Charge:</span>
                  <span className="font-black font-mono">{formatPrice(deliveryFee)}</span>
                </div>
              </div>

              {/* File upload */}
              <div>
                <label className="text-[10px] font-black uppercase text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'পেমেন্ট স্ক্রিনশট / প্রমাণ *' : 'Payment Screenshot / Proof *'}
                </label>

                {!screenshotPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#bedec0] rounded-xl p-3 text-center cursor-pointer bg-[#faf7eb] hover:bg-[#edf6eb] flex items-center justify-center gap-2"
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
                    <Upload className="w-4 h-4 text-[#1b5e28]" />
                    <span className="text-[11px] font-bold text-[#0f2113]">
                      {language === 'bn' ? 'স্ক্রিনশট আপলোড করুন' : 'Attach Screenshot'}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 bg-[#edf6eb] rounded-xl border border-[#bedec0] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={screenshotPreview}
                        alt="Proof"
                        className="w-8 h-8 object-cover rounded-lg border bg-white shrink-0"
                      />
                      <span className="text-[11px] font-bold text-[#0f2113] truncate">
                        {screenshotFile?.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 text-[#c62828] hover:bg-white rounded cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {uploadError && <p className="text-[10px] text-[#c62828] font-bold mt-1">{uploadError}</p>}
              </div>
            </div>

            {/* Order breakdown */}
            <div className="bg-[#edf6eb] p-3.5 rounded-2xl border border-[#bedec0] text-[12px] space-y-1">
              <div className="flex justify-between text-[#335639]">
                <span>Garments Total ({cartItems.length}):</span>
                <span className="font-bold text-[#0f2113]">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-[#1b5e28] font-bold">
                <span>Delivery Charge (Prepaid Now):</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-[#335639]">
                <span>Payable on Delivery (COD):</span>
                <span className="font-bold text-[#0f2113]">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-[14px] font-black text-[#0f2113] pt-2 border-t border-[#bedec0]">
                <span>Total Order Value:</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={!isFormValid}
              className="w-full h-12 bg-[#0f2113] text-white hover:bg-[#1b5e28] font-black text-[12px] uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              <span>{language === 'bn' ? 'পেমেন্ট প্রুফ জমা ও অর্ডার কনফার্ম' : 'Submit Proof & Confirm Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-20 px-6 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-3 border-[#1b5e28] border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="font-display text-[20px] font-black text-[#0f2113] mb-1">
              {language === 'bn' ? 'প্রুফ আপলোড ও অর্ডার প্রক্রিয়াকরণ...' : 'Uploading Proof & Registering Order'}
            </h3>
            <p className="text-[12.5px] text-[#335639]">
              {language === 'bn'
                ? 'সুপাবেস ক্লাউডে অর্ডার ও পেমেন্ট রসিদ সুরক্ষিতভাবে জমা হচ্ছে...'
                : 'Storing proof in Supabase private storage & booking consignment...'}
            </p>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 text-center flex flex-col items-center selection:bg-[#d6edd2] selection:text-[#18281b]">
            <div className="w-16 h-16 rounded-full bg-[#edf6eb] border-2 border-[#bedec0] flex items-center justify-center text-[#1b5e28] mb-4 shadow-xs">
              <Clock className="w-8 h-8 text-[#1b5e28] animate-pulse" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b5e28] bg-[#edf6eb] px-3 py-1 rounded-full border border-[#bedec0] mb-2">
              {language === 'bn' ? 'অর্ডার গ্রহণ সম্পন্ন' : 'ORDER RECEIVED'}
            </span>

            <h3 className="font-display font-black text-[22px] text-[#0f2113] mb-1">
              {language === 'bn' ? `ধন্যবাদ, ${customerName}!` : `Thank you, ${customerName}!`}
            </h3>

            {/* EXACT CUSTOMER-FACING MESSAGE */}
            <div className="bg-[#edf6eb] p-4 rounded-2xl border-2 border-[#1b5e28]/40 my-3 text-left w-full shadow-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#1b5e28] shrink-0 mt-0.5" />
                <p className="text-[13px] font-bold text-[#0f2113] leading-relaxed">
                  Payment proof submitted successfully. Your order is now under verification. You will receive an SMS regarding your order confirmation within 1–12 hours.
                </p>
              </div>
            </div>

            <div className="w-full bg-[#f1f6ee] rounded-2xl p-3.5 border border-[#bedec0] text-left text-[12px] space-y-1.5 mb-4 shadow-xs">
              <div className="flex justify-between">
                <span className="text-[#335639] font-bold">Order Number:</span>
                <span className="font-mono font-black text-[#0f2113]">#{confirmedOrderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#335639] font-bold">Delivery Payment:</span>
                <span className="font-black text-[#92400e] bg-[#fef3c7] px-2 py-0.5 rounded text-[10.5px]">
                  Under Verification
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#335639] font-bold">Prepaid Delivery Fee:</span>
                <span className="font-bold text-[#1b5e28]">{formatPrice(deliveryFee)} ({paymentMethod.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#335639] font-bold">Remaining Balance (COD):</span>
                <span className="font-black text-[#0f2113]">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              {onNavigateToAccount && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToAccount();
                  }}
                  className="w-full h-11 rounded-xl bg-[#0f2113] text-white hover:bg-[#1b5e28] text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Truck className="w-4 h-4" />
                  <span>{language === 'bn' ? 'অর্ডার দেখুন' : 'View Order in Account'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full h-10 rounded-xl bg-[#edf6eb] text-[#0f2113] border border-[#bedec0] text-[11px] font-bold uppercase tracking-wider hover:bg-[#dcefe0] transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'শপিং চালিয়ে যান' : 'Continue Shopping'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
