import React from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Store, BookOpen, Truck, MessageSquare } from 'lucide-react';
import { LOGO_URL } from '../data/catalog';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

export const SideMenuDrawer: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isMenuOpen, setMenuOpen, showToast } = useStore();

  if (!isMenuOpen) return null;

  const onClose = () => setMenuOpen(false);

  const collections = [
    {
      label: language === 'bn' ? 'সকল পোশাক কালেকশন' : 'All Clothing Catalog',
      to: '/shop',
    },
    {
      label: language === 'bn' ? 'অটাম সোলাস ’২৫ কালেকশন' : 'Collection N° 08: Autumn Solace',
      to: '/collections/autumn-solace',
    },
    {
      label: language === 'bn' ? 'ওভারওয়্যার ও ট্রেনচ কোট' : 'Outerwear & Trench',
      to: '/category/outerwear-trench',
    },
    {
      label: language === 'bn' ? 'কাশ্মীরি নিটওয়্যার ও সোয়েটার' : 'Fine Cashmere Knitwear',
      to: '/category/fine-knitwear',
    },
    {
      label: language === 'bn' ? 'লেদার ব্যাগ ও সামগ্রী' : 'Leather Goods & Bags',
      to: '/category/leather-goods',
    },
    {
      label: language === 'bn' ? 'টেইলর্ড ট্রাউজার্স ও প্যান্ট' : 'Tailored Trousers',
      to: '/category/tailored-trousers',
    },
    {
      label: language === 'bn' ? 'রাজশাহী মালবেরি সিল্ক ও শার্ট' : 'Mulberry Silk & Shirting',
      to: '/category/bengal-silk-shirting',
    },
    {
      label: language === 'bn' ? 'হ্যান্ডমেড লেদার জুতা' : 'Modern Artisanal Footwear',
      to: '/category/artisanal-footwear',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs bg-[#faf7eb] h-full shadow-2xl flex flex-col justify-between p-5 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] border-r border-[#ded6be] animate-slideInLeft overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#d6e5d2]">
            <Link to="/" onClick={onClose} className="flex items-center gap-2">
              <img src={LOGO_URL} alt="ELIF Logo" className="h-7 w-auto object-contain" />
              <span className="font-display text-[18px] font-black tracking-tight text-[#18281b]">
                ELIF
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#f1f6ee] border border-[#d6e5d2] flex items-center justify-center text-[#18281b] hover:bg-[#e7f0e3] cursor-pointer active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Switcher in Drawer */}
          <div className="py-3 border-b border-[#d6e5d2]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d6636] px-1 mb-2 block">
              {t.languageSelectLabel}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`py-1.5 px-3 rounded-xl text-[12px] font-black flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  language === 'bn'
                    ? 'bg-[#0f2113] text-white border-[#0f2113] shadow-xs'
                    : 'bg-[#f1f6ee] text-[#3a4d3d] border-[#d6e5d2] hover:text-[#18281b] hover:bg-[#e7f0e3]'
                }`}
              >
                <span>🇧🇩 বাংলা</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-1.5 px-3 rounded-xl text-[12px] font-black flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#0f2113] text-white border-[#0f2113] shadow-xs'
                    : 'bg-[#f1f6ee] text-[#3a4d3d] border-[#d6e5d2] hover:text-[#18281b] hover:bg-[#e7f0e3]'
                }`}
              >
                <span>🇬🇧 English</span>
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1 py-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d6636] px-2 mb-1">
              {language === 'bn' ? 'নির্বাচিত কালেকশন' : 'Curated Collections'}
            </span>
            {collections.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                onClick={onClose}
                className="text-left py-2.5 px-3 rounded-xl text-[13.5px] font-bold text-[#18281b] hover:bg-[#eaf3e7] hover:text-[#1b5e28] transition-colors flex items-center justify-between cursor-pointer active:scale-[0.99]"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#91ad95]" />
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#d6e5d2] pt-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d6636] px-2 mb-1">
              {language === 'bn' ? 'ফ্ল্যাগশিপ সেবা ও অঁতেলিয়ে' : 'Atelier & Services'}
            </span>
            <Link
              to="/salon"
              onClick={onClose}
              className="text-left py-2 px-3 text-[13px] font-medium text-[#3a4d3d] hover:text-[#0f2113] cursor-pointer flex items-center justify-between rounded-xl hover:bg-[#eaf3e7]"
            >
              <span>{language === 'bn' ? 'ঢাকা ফ্ল্যাগশিপ স্যালন (গুলশান ২)' : 'Dhaka Flagship Salon (Gulshan 2)'}</span>
              <Store className="w-4 h-4 text-[#2d6636]" />
            </Link>
            <Link
              to="/atelier"
              onClick={onClose}
              className="text-left py-2 px-3 text-[13px] font-medium text-[#3a4d3d] hover:text-[#0f2113] cursor-pointer flex items-center justify-between rounded-xl hover:bg-[#eaf3e7]"
            >
              <span>{language === 'bn' ? 'অঁতেলিয়ে ডসিয়ার ও টেক্সটাইল' : 'Atelier Dossier & Silks'}</span>
              <BookOpen className="w-4 h-4 text-[#2d6636]" />
            </Link>
            <Link
              to="/account/orders"
              onClick={onClose}
              className="text-left py-2 px-3 text-[13px] font-medium text-[#3a4d3d] hover:text-[#0f2113] cursor-pointer flex items-center justify-between rounded-xl hover:bg-[#eaf3e7]"
            >
              <span>{language === 'bn' ? 'অর্ডার ও পার্সেল ট্র্যাকিং' : 'Order & Delivery Tracking'}</span>
              <Truck className="w-4 h-4 text-[#2d6636]" />
            </Link>
          </div>
        </div>

        {/* Footer info inside drawer */}
        <div className="pt-4 border-t border-[#d6e5d2] flex flex-col gap-2">
          <p className="text-[11px] text-[#556b57]">
            {language === 'bn' ? 'জরুরি প্রয়োজনে বা অর্ডারের জন্য:' : 'Concierge & inquiries:'}
          </p>
          <a
            href="https://wa.me/8801995513269"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0f2113] text-white rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-[#1b5e28] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে যোগাযোগ' : 'WhatsApp Concierge'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
