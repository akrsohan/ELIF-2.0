import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AtelierStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreCollection: () => void;
}

export const AtelierStoryModal: React.FC<AtelierStoryModalProps> = ({
  isOpen,
  onClose,
  onExploreCollection,
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#fff9ee] rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8e2d8] flex flex-col no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#fff9ee]/95 backdrop-blur-md px-5 py-3.5 flex items-center justify-between border-b border-[#e8e2d8]">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700]">
            {language === 'bn' ? 'অঁতেলিয়ে ডসিয়ার নং ০৮' : 'The Atelier Dossier N° 08'}
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f3ede3] flex items-center justify-center text-[#1d1b15] hover:bg-[#ede7dd] cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Hero image */}
        <div className="w-full aspect-[16/10] bg-[#ede7dd] overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv7LsuZDvnjFdicVGsMw-FhDihCGLATc1-dkUmqP1y3BUl43XBe1dJxvVT7iHoghhkEiWvq9lQJ4bvddB7w9QkB8nlcA0as9qOLxtjmsA66aEFOOfNkqGhb7v0O1cVPAJZbWX7Gvcl3zA67sEIlS6zl_BFHUeX5jKmcUnyF5Y3HZdfo80-LWwDo9ExVjXhg0YCvXuxz5g099Sl3qAKR_DmOPKetHdxquopGMC4ZQvO4_uDQaxV__y7"
            alt="Atelier Silk & Linen Editorial"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="p-6 flex flex-col gap-4 text-[#1d1b15]">
          <div>
            <h2 className="font-display text-[24px] sm:text-[26px] leading-snug">
              {language === 'bn' ? 'সিল্ক ও লিনেনের শিল্পরূপ' : 'The Architecture of Silk & Linen'}
            </h2>
            <p className="text-[12px] uppercase tracking-wider text-[#7d5700] font-semibold mt-1">
              {language === 'bn' ? 'প্যারিসীয় ও ঢাকাই মনোরেখা • শরৎ ২০২৫' : 'Parisian Monograph • Autumn Solace ’25'}
            </p>
          </div>

          <p className="text-[14px] text-[#4b4640] leading-relaxed">
            {language === 'bn'
              ? 'আমাদের অঁতেলিয়েতে পোশাক কেবল সাময়িক ফ্যাশন নয়, বরং পরিধানযোগ্য ভাস্কর্য। কালেকশন নং ০৮-এ আমাদের দক্ষ কারিগররা বেলজিয়ান ফ্ল্যাক্স লিনেনের আধুনিকতা এবং মালবেরি সিল্ক ও রাজশাহীর প্রিমিয়াম সুতার প্রাকৃতিক মাধুর্যকে এক সুতোয় গেঁথেছেন।'
              : 'In our Parisian atelier along the historic Rue Saint-Honoré, garments are conceived not as transient trends, but as inhabited sculptures. For Collection N° 08, our master cutters have fused the dry, architectural crispness of unbleached Belgian flax linen with the tactile fluid weight of mulberry silk habotai.'}
          </p>

          <blockquote className="border-l-2 border-[#7d5700] pl-4 italic font-display text-[15px] sm:text-[16px] text-[#1d1b15] my-2">
            {language === 'bn'
              ? '“আসল আভিজাত্য নীরবে কথা বলে—কাঁধের নিখুঁত ড্র্যাপে, হাতের বুননে এবং আলপাকা ও রেশমের ওজনে।”'
              : '“True luxury is quiet. It speaks through the drape over the shoulder, the hand of the weave, and the weightless warmth of rare alpaca.”'}
          </blockquote>

          <h3 className="font-display text-[18px]">
            {language === 'bn' ? 'আমাদের সেরা টেক্সটাইল ঐতিহ্য' : 'Master Textile Heritage'}
          </h3>
          <ul className="text-[13px] text-[#4b4640] space-y-2 list-disc pl-5">
            <li>
              <strong>{language === 'bn' ? 'বিয়েলা উল মিলস:' : 'Biella Wool Mills:'}</strong>{' '}
              {language === 'bn'
                ? 'সিন্থেটিক কেমিক্যাল ছাড়াই ল্যানোলিন শাইন ধরে রাখা ভার্জিন উল।'
                : 'Extra-fine virgin wool combed without synthetic chemical finishes to preserve the natural lanolin sheen.'}
            </li>
            <li>
              <strong>{language === 'bn' ? 'স্কটিশ কাশ্মীর:' : 'Hawick Knitters:'}</strong>{' '}
              {language === 'bn'
                ? '৪-প্লাই গ্রেড-এ কাশ্মীরি সুতা যা বছরের পর বছর নতুনের মতো টেকসই থাকে।'
                : '4-ply grade-A Scottish cashmere spun with tight dimensional stability to prevent pilling across decades.'}
            </li>
            <li>
              <strong>{language === 'bn' ? 'টাসকান ট্যানারি:' : 'Tuscan Tannery:'}</strong>{' '}
              {language === 'bn'
                ? 'চেস্টনাট ও প্রাকৃতিক নির্যাস দিয়ে ট্যান করা ফ্রেঞ্চ কাফস্কিন চামড়া।'
                : 'Full-grain French calfskin vegetable-tanned with mimosa bark and chestnut extract.'}
            </li>
          </ul>

          <div className="pt-4 border-t border-[#e8e2d8] flex gap-3">
            <button
              onClick={() => {
                onExploreCollection();
                onClose();
              }}
              className="flex-1 h-12 rounded-lg bg-[#1d1b19] text-white text-[12px] font-semibold uppercase tracking-wider hover:bg-[#7d5700] active:scale-[0.98] transition-all cursor-pointer"
            >
              {language === 'bn' ? 'কালেকশন দেখুন' : 'Shop Autumn Solace'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
