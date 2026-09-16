import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full min-h-[55vh] flex flex-col items-center justify-center text-center px-4 py-16 selection:bg-[#d6edd2] selection:text-[#18281b]">
      <div className="w-20 h-20 rounded-3xl bg-[#edf6eb] text-[#1b5e28] flex items-center justify-center mb-6 border border-[#bedec0]">
        <span className="material-symbols-outlined text-[40px]">explore_off</span>
      </div>

      <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#1b5e28] mb-2 block">
        {language === 'bn' ? '৪০৪ • পৃষ্ঠাটি পাওয়া যায়নি' : '404 • Atelier Page Not Found'}
      </span>

      <h1 className="font-display font-black text-[28px] sm:text-[36px] text-[#0f2113] tracking-tight max-w-md mb-3">
        {language === 'bn' ? 'অনুরোধকৃত পেজটি বিদ্যমান নেই' : 'This Sartorial Page Does Not Exist'}
      </h1>

      <p className="text-[13.5px] text-[#2c4e31] max-w-sm mb-8 leading-relaxed font-medium">
        {language === 'bn'
          ? 'আপনি যে লিঙ্কটি খুঁজেছেন তা সরানো হয়েছে বা ইউআরএলটি সঠিক নয়। অনুগ্রহ করে হোমপেজ বা কালেকশনে ফিরে যান।'
          : 'The editorial dossier or garment route you were looking for might have been moved or archived.'}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="h-12 px-6 rounded-2xl bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1b5e28] transition-colors shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>{language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Return Home'}</span>
        </Link>

        <Link
          to="/shop"
          className="h-12 px-6 rounded-2xl bg-[#edf6eb] text-[#0f2113] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border border-[#bedec0] hover:bg-[#dcefe0] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          <span>{language === 'bn' ? 'শপ ও কালেকশন' : 'Explore Collections'}</span>
        </Link>
      </div>
    </div>
  );
};
