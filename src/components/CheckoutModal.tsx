import React, { useState } from 'react';
import { CartItem } from '../types';

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
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'processing' | 'confirmed'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cod' | 'nagad' | 'card'>('bkash');
  const [district, setDistrict] = useState<'Dhaka' | 'Chattogram' | 'Sylhet' | 'Other'>('Dhaka');
  const [bkashNumber, setBkashNumber] = useState('01711-234567');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('confirmed');
      onClearCart();
      const msg =
        paymentMethod === 'cod'
          ? 'Order confirmed with Cash on Delivery! Our Dhaka atelier is tailoring your package.'
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
              Dhaka Atelier Private Checkout
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
                <span>Shipping Address (Bangladesh)</span>
                <span className="text-[10px] text-[#4b4640] font-normal">🇧🇩 Verified</span>
              </div>
              <p className="text-[14px] font-semibold text-[#1d1b15]">Farhana Ahmed</p>
              <p className="text-[12px] text-[#4b4640]">
                House 42, Road 11, Block D, Banani / Gulshan 2, Dhaka - 1213
              </p>
              <p className="text-[11px] text-[#7d5700] mt-1 font-medium">
                Complimentary Pathao Express / Steadfast (24-48h Delivery in Dhaka)
              </p>

              {/* District quick selector */}
              <div className="mt-2.5 pt-2 border-t border-[#cec5bd]/60 flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-[#7d766f]">Region:</span>
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
                    {dist === 'Dhaka' ? 'Inside Dhaka' : dist}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector (bKash, COD, Nagad, Card) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4b4640]">
                  Payment Method
                </span>
                <span className="text-[10px] text-[#7d5700] font-medium">
                  {paymentMethod === 'cod' ? 'Pay on Delivery' : 'Instant Gateway'}
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
                    <p className="text-[12px] font-bold text-[#1d1b15] leading-tight">bKash</p>
                    <p className="text-[10px] text-[#7d766f] truncate">Mobile Wallet</p>
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
                    <p className="text-[12px] font-bold text-[#1d1b15] leading-tight">Cash on Delivery</p>
                    <p className="text-[10px] text-[#2e7d32] font-semibold truncate">Pay after check</p>
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
                    <p className="text-[12px] font-bold text-[#1d1b15] leading-tight">Nagad</p>
                    <p className="text-[10px] text-[#7d766f] truncate">Post Office Wallet</p>
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
                    <p className={`text-[12px] font-bold leading-tight ${paymentMethod === 'card' ? 'text-white' : 'text-[#1d1b15]'}`}>Cards / Banking</p>
                    <p className={`text-[10px] truncate ${paymentMethod === 'card' ? 'text-white/70' : 'text-[#7d766f]'}`}>Visa • MC • Amex</p>
                  </div>
                </button>
              </div>

              {/* Payment specific details */}
              {paymentMethod === 'bkash' && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#fff0f5] border border-[#d12053]/30 text-[11px] text-[#4b4640] space-y-1">
                  <p className="font-semibold text-[#d12053] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    Instant bKash Online Gateway
                  </p>
                  <p>You will be redirected to the secure bKash prompt to approve ৳{totalAmount.toLocaleString()} with your bKash PIN.</p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#f5fbf2] border border-[#2e7d32]/30 text-[11px] text-[#2e7d32] space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Zero Advance Payment Required
                  </p>
                  <p className="text-[#4b4640]">
                    Inspect the sealed ELIF atelier package upon courier arrival. Pay exactly <strong>৳{totalAmount.toLocaleString()}</strong> in cash.
                  </p>
                </div>
              )}

              {paymentMethod === 'nagad' && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#fff5ee] border border-[#ec1c24]/30 text-[11px] text-[#4b4640] space-y-1">
                  <p className="font-semibold text-[#ec1c24]">Nagad Direct Digital Payment</p>
                  <p>Authorize payment securely from your Nagad registered account.</p>
                </div>
              )}
            </div>

            {/* Items Summary preview */}
            <div className="bg-[#f9f3e9] p-3 rounded-xl border border-[#e8e2d8] text-[12px]">
              <div className="flex justify-between font-semibold text-[#1d1b15] pb-2 border-b border-[#e8e2d8]">
                <span>Consignment Items ({cartItems.length})</span>
                <span>৳{totalAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 space-y-1 text-[#4b4640]">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.product.name} ({item.size})
                    </span>
                    <span className="font-semibold text-[#1d1b15]">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full h-13 bg-[#ffc55f] text-[#755100] hover:bg-[#ffdeaa] font-semibold text-[13px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md cursor-pointer mt-1"
            >
              <span>
                {paymentMethod === 'cod' ? 'Confirm Cash on Delivery Order' : `Pay with ${paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Card'} • ৳${totalAmount.toLocaleString()}`}
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
              Confirming Dhaka Atelier Dispatch
            </h3>
            <p className="text-[13px] text-[#4b4640]">
              Generating order consignment and registering courier tracking with Steadfast / Pathao...
            </p>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#ffc55f]/20 border border-[#ffc55f] flex items-center justify-center text-[#7d5700] mb-4">
              <span className="material-symbols-outlined text-[32px]">done_all</span>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700] mb-1">
              Order Confirmed • অর্ডার নিশ্চিত হয়েছে
            </span>
            <h3 className="font-display text-[24px] text-[#1d1b15] mb-2">
              Dhannobad, Farhana!
            </h3>
            <p className="text-[13px] text-[#4b4640] max-w-[300px] mb-4 leading-relaxed">
              Your order <strong className="text-[#1d1b15]">#EL-BD9104</strong> has been received at our Gulshan 2 atelier. Hand-inspection and packaging will begin immediately.
            </p>

            <div className="w-full bg-[#f3ede3] rounded-xl p-3.5 border border-[#e8e2d8] text-left text-[12px] space-y-1.5 mb-5">
              <div className="flex justify-between">
                <span className="text-[#4b4640]">Estimated Arrival:</span>
                <span className="font-semibold text-[#1d1b15]">Tomorrow (within 24-48 Hours)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4b4640]">Delivery Location:</span>
                <span className="font-semibold text-[#1d1b15]">Banani, Dhaka - 1213</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4b4640]">Courier:</span>
                <span className="font-semibold text-[#1d1b15]">Pathao Express / Steadfast</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4b4640]">Payment Status:</span>
                <span className="font-semibold text-[#7d5700]">
                  {paymentMethod === 'cod' ? 'Cash on Delivery (৳' + totalAmount.toLocaleString() + ')' : 'Paid Online (' + (paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Card') + ')'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full h-12 rounded-lg bg-[#1d1b19] text-white text-[12px] font-semibold uppercase tracking-wider hover:bg-[#7d5700] transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
