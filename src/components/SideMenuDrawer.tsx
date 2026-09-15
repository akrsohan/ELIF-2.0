import React from 'react';
import { LOGO_URL } from '../data/catalog';
import { TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType, categoryFilter?: string) => void;
  onShowToast: (message: string) => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onShowToast,
}) => {
  const { language, setLanguage, t } = useLanguage();

  if (!isOpen) return null;

  const collections = [
    {
      label: language === 'bn' ? 'কালেকশন ০৮: অটাম সোলাস' : 'Collection N° 08: Autumn Solace',
      tab: 'home',
    },
    {
      label: language === 'bn' ? 'ওভারওয়্যার ও ট্রেনচ কোট' : 'Outerwear & Trench',
      tab: 'categories',
      filter: 'Outerwear',
    },
    {
      label: language === 'bn' ? 'কাশ্মীরি নিটওয়্যার ও সোয়েটার' : 'Fine Cashmere Knitwear',
      tab: 'categories',
      filter: 'Knitwear',
    },
    {
      label: language === 'bn' ? 'লেদার ব্যাগ ও সামগ্রী' : 'Leather Goods & Bags',
      tab: 'categories',
      filter: 'Leather',
    },
    {
      label: language === 'bn' ? 'টেইলর্ড ট্রাউজার্স ও প্যান্ট' : 'Tailored Trousers',
      tab: 'categories',
      filter: 'Trousers',
    },
    {
      label: language === 'bn' ? 'রাজশাহী মালবেরি সিল্ক ও শার্ট' : 'Mulberry Silk & Shirting',
      tab: 'categories',
      filter: 'Silk',
    },
    {
      label: language === 'bn' ? 'হ্যান্ডমেড লেদার জুতা' : 'Modern Artisanal Footwear',
      tab: 'categories',
      filter: 'Footwear',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs bg-[#fff9ee] h-full shadow-2xl flex flex-col justify-between p-5 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] border-r border-[#e8e2d8] animate-slideInLeft overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#e8e2d8]">
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} alt="ELIF Logo" className="h-7 w-auto object-contain" />
              <span className="font-display text-[18px] tracking-tight text-[#1d1b15]">
                ELIF
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#f3ede3] flex items-center justify-center text-[#1d1b15] hover:bg-[#ede7dd] cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Language Switcher in Drawer */}
          <div className="py-3 border-b border-[#e8e2d8]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700] px-1 mb-2 block">
              {t.languageSelectLabel}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`py-1.5 px-3 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  language === 'bn'
                    ? 'bg-[#1d1b15] text-[#ffc55f] border-[#1d1b15] shadow-xs'
                    : 'bg-[#f3ede3] text-[#4b4640] border-[#e8e2d8] hover:text-[#1d1b15]'
                }`}
              >
                <span>🇧🇩 বাংলা</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-1.5 px-3 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#1d1b15] text-[#ffc55f] border-[#1d1b15] shadow-xs'
                    : 'bg-[#f3ede3] text-[#4b4640] border-[#e8e2d8] hover:text-[#1d1b15]'
                }`}
              >
                <span>🇬🇧 English</span>
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1 py-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700] px-2 mb-1">
              {language === 'bn' ? 'নির্বাচিত কালেকশন' : 'Curated Collections'}
            </span>
            {collections.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigateTab(item.tab as TabType, item.filter);
                  onClose();
                }}
                className="text-left py-2.5 px-3 rounded-lg text-[14px] font-medium text-[#1d1b15] hover:bg-[#f3ede3] hover:text-[#7d5700] transition-colors flex items-center justify-between cursor-pointer active:scale-[0.99]"
              >
                <span>{item.label}</span>
                <span className="material-symbols-outlined text-[16px] text-[#cec5bd]">
                  chevron_right
                </span>
              </button>
            ))}
          </nav>

          <div className="border-t border-[#e8e2d8] pt-4 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d5700] px-2 mb-1">
              {language === 'bn' ? 'ফ্ল্যাগশিপ সেবা' : 'The Flagship & Services'}
            </span>
            <button
              onClick={() => {
                onShowToast('Dhaka Atelier: House 42, Road 11, Block D, Banani / Gulshan 2, Dhaka.');
                onClose();
              }}
              className="text-left py-2 px-3 text-[13px] text-[#4b4640] hover:text-[#1d1b15] cursor-pointer flex items-center justify-between"
            >
              <span>{language === 'bn' ? 'ঢাকা ফ্ল্যাগশিপ স্যালন (গুলশান ২)' : 'Dhaka Flagship Salon (Gulshan 2)'}</span>
              <span className="text-[10px] text-[#7d5700] font-semibold bg-[#ffdeaa]/50 px-1.5 py-0.5 rounded">
                {language === 'bn' ? 'ভিজিট' : 'Visiting'}
              </span>
            </button>
            <button
              onClick={() => {
                onShowToast(language === 'bn' ? 'হোয়াটসঅ্যাপ স্টাইলিস্ট: +880 1995-513269 (সকাল ১০টা - রাত ১০টা)' : 'Dhaka WhatsApp Stylist: +880 1995-513269 (Open 10 AM - 10 PM)');
                window.open('https://wa.me/8801995513269', '_blank');
                onClose();
              }}
              className="text-left py-2 px-3 text-[13px] text-[#4b4640] hover:text-[#1d1b15] cursor-pointer flex items-center justify-between"
            >
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ পার্সোনাল স্টাইলিস্ট' : 'WhatsApp Personal Stylist'}</span>
              <span className="text-[10px] text-[#2e7d32] font-semibold">Online</span>
            </button>
            <button
              onClick={() => {
                onNavigateTab('account');
                onClose();
              }}
              className="text-left py-2 px-3 text-[13px] text-[#4b4640] hover:text-[#1d1b15] cursor-pointer"
            >
              {language === 'bn' ? 'ভিআইপি কনসিয়ার্জ ও অর্ডার ট্র্যাকিং' : 'VIP Concierge & Client Profile'}
            </button>
          </div>
        </div>

        {/* Footer controls */}
        <div className="border-t border-[#e8e2d8] pt-4 text-[12px] text-[#4b4640]">
          <div className="flex items-center justify-between mb-2">
            <span>{language === 'bn' ? 'মুদ্রা' : 'Currency'}</span>
            <span className="font-semibold text-[#1d1b15]">BDT (৳) Taka</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span>{language === 'bn' ? 'অঞ্চল' : 'Region'}</span>
            <span className="font-semibold text-[#1d1b15]">{language === 'bn' ? 'বাংলাদেশ (৬৪ জেলা)' : 'Bangladesh (All 64 Districts)'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#2e7d32] font-medium">
            <span>{language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Modes'}</span>
            <span>bKash • COD • Cards</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#7d766f] mt-3">
            © 2025 ELIF ATELIER • DHAKA & PARIS
          </p>
        </div>
      </div>
    </div>
  );
};
