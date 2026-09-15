import React, { useState } from 'react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  totalAmount: number;
  onClose: () => void;
  onClearCart: () => void;
  onShowToast: (message: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartItems,
  totalAmount,
  onClose,
  onClearCart,
  onShowToast,
}) => {
  const { language, t, localizeProduct, formatPrice, formatNumber } = useLanguage();

  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'processing' | 'confirmed'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cod' | 'nagad' | 'card'>('bkash');
  const [district, setDistrict] = useState<'Dhaka' | 'Chattogram' | 'Sylhet' | 'Other'>('Dhaka');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('confirmed');
      onClearCart();
      const msg =
        language === 'bn'
          ? paymentMethod === 'cod'
            ? 'ক্যাশ অন ডেলিভারিতে অর্ডার নিশ্চিত হয়েছে! আমাদের ঢাকা অঁতেলিয়ে থেকে পার্সেলটি প্রস্তুত করা হচ্ছে।'
            : (paymentMethod === 'bkash' ? 'বিকাশ' : paymentMethod === 'nagad' ? 'নগদ' : 'কার্ড') +
              '-এর মাধ্যমে পেমেন্ট সফল হয়েছে। আপনার পার্সেলটি প্রস্তুত করা হচ্ছে।'
          : paymentMethod === 'cod'
            ? 'Order confirmed with Cash on Delivery! Our Dhaka atelier is preparing your package.'
            : 'Payment authorized successfully via ' +
              (paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Card') +
              '. Your consignment is being tailored.';
      onShowToast(msg);
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={step !== 'processing' ? onClose : undefined}
    >
      <div
        className="w-full max-w-md bg-[#fff9ee] rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8e2d8] flex flex-col no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#fff9ee]/95 backdrop-blur-md px-5 py-3.5 flex items-center justify-between border-b border-[#e8e2d8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#7d5700]">lock</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1d1b15]">
              {language === 'bn' ? 'নিরাপদ চেকআউট' : 'Secure Private Checkout'}
            </span>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#f3ede3] flex items-center justify-center text-[#1d1b15] hover:bg-[#ede7dd] cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {step === 'details' && (
          <div className="p-5 flex flex-col gap-4">
            {/* Delivery address (Bangladesh) */}
            <div className="bg-[#f3ede3] p-3.5 rounded-xl border border-[#e8e2d8]">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#7d5700] mb-1">
                <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}</span>
                <span className="text-[10px] text-[#4b4640] font-normal">🇧🇩 {language === 'bn' ? 'যাচাইকৃত' : 'Verified'}</span>
              </div>
              <p className="text-[14px] font-semibold text-[#1d1b15]">{language === 'bn' ? 'ফারহানা আহমেদ' : 'Farhana Ahmed'}</p>
              <p className="text-[12px] text-[#4b4640]">
                {language === 'bn' ? 'বাড়ি ৪২, রোড ১১, ব্লক ডি, বনানী / গুলশান ২, ঢাকা - ১২১৩' : 'House 42, Road 11, Block D, Banani / Gulshan 2, Dhaka - 1213'}
              </p>
              <p className="text-[11px] text-[#7d5700] mt-1 font-medium">
                {language === 'bn' ? 'পাঠাও এক্সপ্রেস / স্টিডফাস্ট (ঢাকায় ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি)' : 'Pathao Express / Steadfast (24-48h Delivery in Dhaka)'}
              </p>

              {/* District quick selector */}
              <div className="mt-2.5 pt-2 border-t border-[#cec5bd]/60 flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-[#7d766f]">{language === 'bn' ? 'অঞ্চল:' : 'Region:'}</span>
                {(['Dhaka', 'Chattogram', 'Sylhet', 'Other'] as const).map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => setDistrict(dist)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                      district === dist
                        ? 'bg-[#7d5700] text-white'
                        : 'bg-[#ede7dd] text-[#4b4640] hover:bg-[#e4ddcf]'
                    }`}
                  >
                    {language === 'bn'
                      ? dist === 'Dhaka'
                        ? 'ঢাকার ভেতরে'
                        : dist === 'Chattogram'
                        ? 'চট্টগ্রাম'
                        : dist === 'Sylhet'
                        ? 'সিলেট'
                        : 'অন্যান্য জেলা'
                      : dist === 'Dhaka'
                      ? 'Inside Dhaka'
                      : dist}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector (bKash, COD, Nagad, Card) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4b4640]">
                  {language === 'bn' ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}
                </span>
                <span className="text-[10px] text-[#7d5700] font-medium">
                  {paymentMethod === 'cod'
                    ? language === 'bn' ? 'ডেলিভারিতে পরিশোধ' : 'Pay on Delivery'
                    : language === 'bn' ? 'তাৎক্ষণিক গেটওয়ে' : 'Instant Gateway'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'bg-[#fff0f5] border-[#d12053] shadow-sm'
                      : 'bg-[#f3ede3] border-[#cec5bd] hover:border-[#d12053]/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#d12053] text-white flex items-center justify-center font-bold text-[12px] shrink-0">
                    ৳
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#1d1b15] leading-tight">{language === 'bn' ? 'বিকাশ' : 'bKash'}</p>
                    <p className="text-[10px] text-[#7d766f] truncate">{language === 'bn' ? 'মোবাইল ওয়ালেট' : 'Mobile Wallet'}</p>
                  </div>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-[#f5fbf2] border-[#2e7d32] shadow-sm'
                      : 'bg-[#f3ede3] border-[#cec5bd] hover:border-[#2e7d32]/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2e7d32] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#1d1b15] leading-tight">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</p>
                    <p className="text-[10px] text-[#2e7d32] font-semibold truncate">{language === 'bn' ? 'পণ্য দেখে পেমেন্ট' : 'Pay after check'}</p>
                  </div>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'nagad'
                      ? 'bg-[#fff5ee] border-[#ec1c24] shadow-sm'
                      : 'bg-[#f3ede3] border-[#cec5bd] hover:border-[#ec1c24]/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#ec1c24] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    নগদ
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#1d1b15] leading-tight">{language === 'bn' ? 'নগদ' : 'Nagad'}</p>
                    <p className="text-[10px] text-[#7d766f] truncate">{language === 'bn' ? 'ডিজিটাল ওয়ালেট' : 'Digital Wallet'}</p>
                  </div>
                </button>

                {/* Card / Bank */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#1d1b19] text-white border-[#1d1b19] shadow-sm'
                      : 'bg-[#f3ede3] text-[#1d1b15] border-[#cec5bd] hover:border-[#7d5700]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${paymentMethod === 'card' ? 'bg-white/20 text-white' : 'bg-[#1d1b19] text-white'} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[12px] font-bold leading-tight ${paymentMethod === 'card' ? 'text-white' : 'text-[#1d1b15]'}`}>{language === 'bn' ? 'কার্ড / ব্যাংকিং' : 'Cards / Banking'}</p>
                    <p className={`text-[10px] truncate ${paymentMethod === 'card' ? 'text-white/70' : 'text-[#7d766f]'}`}>Visa • MC • Amex</p>
                  </div>
                </button>
              </div>

              {/* Payment specific details */}
              {paymentMethod === 'bkash' && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#fff0f5] border border-[#d12053]/30 text-[11px] text-[#4b4640] space-y-1">
                  <p className="font-semibold text-[#d12053] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    {language === 'bn' ? 'ইনস্ট্যান্ট বিকাশ পেমেন্ট গেটওয়ে' : 'Instant bKash Online Gateway'}
                  </p>
                  <p>
                    {language === 'bn'
                      ? `বিকাশ পিন দিয়ে ${formatPrice(totalAmount)} টাকা নিরাপদভাবে কনফার্ম করুন।`
                      : `You will be redirected to the secure bKash prompt to approve ${formatPrice(totalAmount)} with your bKash PIN.`}
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#f5fbf2] border border-[#2e7d32]/30 text-[11px] text-[#2e7d32] space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {language === 'bn' ? 'কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই' : 'Zero Advance Payment Required'}
                  </p>
                  <p className="text-[#4b4640]">
                    {language === 'bn'
                      ? `কুরিয়ার পৌঁছালে প্যাকেজ দেখে নগদ ${formatPrice(totalAmount)} টাকা পরিশোধ করুন।`
                      : `Inspect the sealed ELIF atelier package upon courier arrival. Pay exactly ${formatPrice(totalAmount)} in cash.`}
                  </p>
                </div>
              )}

              {paymentMethod === 'nagad' && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#fff5ee] border border-[#ec1c24]/30 text-[11px] text-[#4b4640] space-y-1">
                  <p className="font-semibold text-[#ec1c24]">{language === 'bn' ? 'নগদ ডিরেক্ট ডিজিটাল পেমেন্ট' : 'Nagad Direct Digital Payment'}</p>
                  <p>{language === 'bn' ? 'আপনার নগদ অ্যাকাউন্ট থেকে নিরাপদে পেমেন্ট সম্পন্ন করুন।' : 'Authorize payment securely from your Nagad registered account.'}</p>
                </div>
              )}
            </div>

            {/* Items Summary preview */}
            <div className="bg-[#f9f3e9] p-3 rounded-xl border border-[#e8e2d8] text-[12px]">
              <div className="flex justify-between font-semibold text-[#1d1b15] pb-2 border-b border-[#e8e2d8]">
                <span>{language === 'bn' ? `অর্ডারের আইটেম (${formatNumber(cartItems.length)}টি)` : `Consignment Items (${cartItems.length})`}</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="pt-2 space-y-1 text-[#4b4640]">
                {cartItems.map((item, idx) => {
                  const locProd = localizeProduct(item.product);
                  return (
                    <div key={idx} className="flex justify-between">
                      <span className="truncate pr-2">
                        {formatNumber(item.quantity)}x {locProd.name} ({item.size})
                      </span>
                      <span className="font-semibold text-[#1d1b15]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full h-13 bg-[#ffc55f] text-[#755100] hover:bg-[#ffdeaa] font-semibold text-[13px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md cursor-pointer mt-1"
            >
              <span>
                {paymentMethod === 'cod'
                  ? language === 'bn' ? `ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম করুন • ${formatPrice(totalAmount)}` : `Confirm Cash on Delivery Order • ${formatPrice(totalAmount)}`
                  : language === 'bn'
                  ? `${paymentMethod === 'bkash' ? 'বিকাশ' : paymentMethod === 'nagad' ? 'নগদ' : 'কার্ড'}-এ পে করুন • ${formatPrice(totalAmount)}`
                  : `Pay with ${paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Card'} • ${formatPrice(totalAmount)}`}
              </span>
              <span className="material-symbols-outlined text-[18px]">
                {paymentMethod === 'cod' ? 'done' : 'lock'}
              </span>
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-20 px-6 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-3 border-[#7d5700] border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="font-display text-[20px] text-[#1d1b15] mb-1">
              {language === 'bn' ? 'অর্ডার প্রক্রিয়াধীন...' : 'Confirming Dhaka Atelier Dispatch'}
            </h3>
            <p className="text-[13px] text-[#4b4640]">
              {language === 'bn'
                ? 'অর্ডার নম্বর তৈরি করা হচ্ছে এবং স্টিডফাস্ট/পাঠাও কুরিয়ার ট্র্যাকিং সিস্টেমে যুক্ত হচ্ছে...'
                : 'Generating order consignment and registering courier tracking with Steadfast / Pathao...'}
            </p>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#ffc55f]/20 border border-[#ffc55f] flex items-center justify-center text-[#7d5700] mb-4">
              <span className="material-symbols-outlined text-[32px]">done_all</span>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700] mb-1">
              {language === 'bn' ? 'অর্ডার নিশ্চিত হয়েছে' : 'Order Confirmed'}
            </span>
            <h3 className="font-display text-[24px] text-[#1d1b15] mb-2">
              {language === 'bn' ? 'ধন্যবাদ, ফারহানা!' : 'Dhannobad, Farhana!'}
            </h3>
            <p className="text-[13px] text-[#4b4640] max-w-[300px] mb-4 leading-relaxed">
              {language === 'bn'
                ? 'আপনার অর্ডার (#EL-BD9104) আমাদের গুলশান ২ অঁতেলিয়ে শাখায় গৃহীত হয়েছে। খুব শীঘ্রই ডেলিভারির জন্য প্রস্তুত হবে।'
                : 'Your order #EL-BD9104 has been received at our Gulshan 2 atelier. Hand-inspection and packaging will begin immediately.'}
            </p>

            <div className="w-full bg-[#f3ede3] rounded-xl p-3.5 border border-[#e8e2d8] text-left text-[12px] space-y-1.5 mb-5">
              <div className="flex justify-between">
                <span className="text-[#4b4640]">{language === 'bn' ? 'আনুমানিক পৌঁছানোর সময়:' : 'Estimated Arrival:'}</span>
                <span className="font-semibold text-[#1d1b15]">{language === 'bn' ? 'আগামীকাল (২৪-৪৮ ঘণ্টার মধ্যে)' : 'Tomorrow (within 24-48 Hours)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4b4640]">{language === 'bn' ? 'ডেলিভারি এলাকা:' : 'Delivery Location:'}</span>
                <span className="font-semibold text-[#1d1b15]">{language === 'bn' ? 'বনানী, ঢাকা - ১২১৩' : 'Banani, Dhaka - 1213'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4b4640]">{language === 'bn' ? 'কুরিয়ার:' : 'Courier:'}</span>
                <span className="font-semibold text-[#1d1b15]">Pathao Express / Steadfast</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4b4640]">{language === 'bn' ? 'পেমেন্ট স্ট্যাটাস:' : 'Payment Status:'}</span>
                <span className="font-semibold text-[#7d5700]">
                  {paymentMethod === 'cod'
                    ? (language === 'bn' ? `ক্যাশ অন ডেলিভারি (${formatPrice(totalAmount)})` : `Cash on Delivery (${formatPrice(totalAmount)})`)
                    : (language === 'bn'
                        ? `অনলাইনে পরিশোধিত (${paymentMethod === 'bkash' ? 'বিকাশ' : paymentMethod === 'nagad' ? 'নগদ' : 'কার্ড'})`
                        : `Paid Online (${paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Card'})`)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full h-12 rounded-lg bg-[#1d1b19] text-white text-[12px] font-semibold uppercase tracking-wider hover:bg-[#7d5700] transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'শপিং চালিয়ে যান' : 'Continue Shopping'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
