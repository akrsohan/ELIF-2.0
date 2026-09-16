import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

export const AtelierStoryModal: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isStoryModalOpen, setStoryModalOpen } = useStore();

  if (!isStoryModalOpen) return null;

  const onClose = () => setStoryModalOpen(false);

  const handleExplore = () => {
    onClose();
    navigate('/collections/autumn-solace');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#faf7eb] rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#ded6be] flex flex-col no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#faf7eb]/95 backdrop-blur-md px-5 py-3.5 flex items-center justify-between border-b border-[#ded6be]">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#2d6636]">
            {language === 'bn' ? 'অঁতেলিয়ে ডসিয়ার নং ০৮' : 'The Atelier Dossier N° 08'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f1f6ee] flex items-center justify-center text-[#18281b] hover:bg-[#e7f0e3] cursor-pointer active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero image */}
        <div className="w-full aspect-[16/10] bg-[#e7f0e3] overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv7LsuZDvnjFdicVGsMw-FhDihCGLATc1-dkUmqP1y3BUl43XBe1dJxvVT7iHoghhkEiWvq9lQJ4bvddB7w9QkB8nlcA0as9qOLxtjmsA66aEFOOfNkqGhb7v0O1cVPAJZbWX7Gvcl3zA67sEIlS6zl_BFHUeX5jKmcUnyF5Y3HZdfo80-LWwDo9ExVjXhg0YCvXuxz5g099Sl3qAKR_DmOPKetHdxquopGMC4ZQvO4_uDQaxV__y7"
            alt="Atelier Silk & Linen Editorial"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="p-6 flex flex-col gap-4 text-[#18281b]">
          <div>
            <h2 className="font-display text-[24px] sm:text-[26px] font-bold leading-snug">
              {language === 'bn' ? 'সিল্ক ও লিনেনের শিল্পরূপ' : 'The Architecture of Silk & Linen'}
            </h2>
            <p className="text-[12px] uppercase tracking-wider text-[#2d6636] font-bold mt-1">
              {language === 'bn' ? 'প্যারিসীয় ও ঢাকাই মনোরেখা • শরৎ ২০২৫' : 'Parisian Monograph • Autumn Solace ’25'}
            </p>
          </div>

          <p className="text-[14px] text-[#3a4d3d] leading-relaxed">
            {language === 'bn'
              ? 'আমাদের শরৎকালীন কালেকশন ‘অটাম সোলাস’ বাংলাদেশের সুপ্রাচীন ঐতিহ্য ও সমসাময়িক মিনিমালিজমের এক অপূর্ব সমন্বয়। এতে ব্যবহার করা হয়েছে রাজশাহীর শতভাগ খাঁটি মালবেরি র সিল্ক, অপ্রক্রিয়াজাত বেলজিয়ান লিনেন এবং সূক্ষ্ম মোঙ্গোলিয়ান কাশ্মীরি সুতা।'
              : 'Our Autumn Solace collection marries historic Bengali textile heritage with modern minimalist silhouettes. Tailored from certified Rajshahi raw mulberry silk, natural Belgian flax, and cruelty-free Mongolian cashmere.'}
          </p>

          <div className="bg-[#f1f6ee] p-4 rounded-xl border border-[#d6e5d2] space-y-2">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#2d6636]">
              {language === 'bn' ? 'আমাদের মূল অঙ্গীকার' : 'Artisanal Standards'}
            </h4>
            <ul className="text-[13px] text-[#3a4d3d] space-y-1.5 list-disc pl-4">
              <li>{language === 'bn' ? '১০০% হ্যান্ডলুম বুনা ও প্রাকৃতিক উদ্ভিজ্জ ডাই' : '100% handloom woven & natural botanical dyes'}</li>
              <li>{language === 'bn' ? 'মডেল অনুযায়ী কাস্টমাইজড ফ্রেশ সেলাই' : 'Made-to-order couture cut per patron'}</li>
              <li>{language === 'bn' ? 'ঢাকায় ২৪ ঘণ্টায় প্রাইভেট হোম ট্রায়াল ও ফিটিং' : '24h Private home trial & salon fitting in Dhaka'}</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleExplore}
            className="w-full py-3.5 rounded-xl bg-[#0f2113] text-white font-bold text-[12px] uppercase tracking-wider hover:bg-[#1b5e28] transition-colors cursor-pointer active:scale-98 shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ কালেকশন এক্সপ্লোর করুন' : 'Explore Autumn Solace ’25'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
