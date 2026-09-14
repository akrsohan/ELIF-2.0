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
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'klarna'>('apple_pay');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('confirmed');
      onClearCart();
      onShowToast('Payment authorized successfully. Your consignment is being tailored.');
    }, 1500);
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
              Atelier Private Checkout
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
            {/* Delivery address */}
            <div className="bg-[#f3ede3] p-3.5 rounded-xl border border-[#e8e2d8]">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#7d5700] mb-1">
                <span>Shipping Address</span>
                <button className="underline lowercase font-normal">edit</button>
              </div>
              <p className="text-[14px] font-semibold text-[#1d1b15]">Eleanor Vance</p>
              <p className="text-[12px] text-[#4b4640]">
                14 Rue de Rivoli, 75001 Paris, France
              </p>
              <p className="text-[11px] text-[#7d766f] mt-1">
                Complimentary DHL White Glove Courier (Delivery in 2 Days)
              </p>
            </div>

            {/* Payment Method Selector */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4b4640] block mb-2">
                Select Payment Mode
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'apple_pay', label: 'Apple Pay' },
                  { id: 'card', label: 'Card' },
                  { id: 'klarna', label: 'Klarna' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`h-11 rounded-lg text-[12px] font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'bg-[#1d1b19] text-white border-[#1d1b19] shadow-sm'
                        : 'bg-[#f3ede3] text-[#1d1b15] border-[#cec5bd] hover:border-[#7d5700]'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Summary preview */}
            <div className="bg-[#f9f3e9] p-3 rounded-xl border border-[#e8e2d8] text-[12px]">
              <div className="flex justify-between font-semibold text-[#1d1b15] pb-2 border-b border-[#e8e2d8]">
                <span>Consignment Items ({cartItems.length})</span>
                <span>€{totalAmount}</span>
              </div>
              <div className="pt-2 space-y-1 text-[#4b4640]">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.product.name} ({item.size})
                    </span>
                    <span className="font-semibold text-[#1d1b15]">
                      €{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full h-13 bg-[#ffc55f] text-[#755100] hover:bg-[#ffdeaa] font-semibold text-[13px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md cursor-pointer mt-2"
            >
              <span>Authorize Payment • €{totalAmount}</span>
              <span className="material-symbols-outlined text-[18px]">check</span>
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-20 px-6 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-3 border-[#7d5700] border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="font-display text-[20px] text-[#1d1b15] mb-1">
              Authorizing with Atelier Banque
            </h3>
            <p className="text-[13px] text-[#4b4640]">
              Securing consignment allocation and preparing archival packaging...
            </p>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#ffc55f]/20 border border-[#ffc55f] flex items-center justify-center text-[#7d5700] mb-4">
              <span className="material-symbols-outlined text-[32px]">done_all</span>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700] mb-1">
              Order Confirmed
            </span>
            <h3 className="font-display text-[24px] text-[#1d1b15] mb-2">
              Merci, Eleanor.
            </h3>
            <p className="text-[13px] text-[#4b4640] max-w-[280px] mb-4 leading-relaxed">
              Your order <strong className="text-[#1d1b15]">#EL-9104</strong> has been
              received at our Paris atelier. Hand-inspection and packaging will begin today.
            </p>

            <div className="w-full bg-[#f3ede3] rounded-xl p-3.5 border border-[#e8e2d8] text-left text-[12px] space-y-1.5 mb-5">
              <div className="flex justify-between">
                <span className="text-[#4b4640]">Estimated Arrival:</span>
                <span className="font-semibold text-[#1d1b15]">Thursday, 18 Sep by 14:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4b4640]">Courier:</span>
                <span className="font-semibold text-[#1d1b15]">DHL White Glove Express</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4b4640]">Packaging:</span>
                <span className="font-semibold text-[#7d5700]">Embossed Box & Grosgrain</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full h-12 rounded-lg bg-[#1d1b19] text-white text-[12px] font-semibold uppercase tracking-wider hover:bg-[#7d5700] transition-colors"
            >
              Return to Flagship
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
