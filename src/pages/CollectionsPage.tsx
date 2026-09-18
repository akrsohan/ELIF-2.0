import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

export const CollectionsPage: React.FC = () => {
  const { language } = useLanguage();
  const { collections, isLoading } = useStore();

  return (
    <div className="w-full pb-16 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* 1. BREADCRUMBS */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#35523a] mb-5 py-1"
      >
        <Link to="/" className="hover:text-[#0f2113] hover:underline">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <span className="text-[#0f2113] font-black">
          {language === 'bn' ? 'কালেকশনসমূহ' : 'Curated Collections'}
        </span>
      </nav>

      {/* 2. HEADER */}
      <div className="mb-8">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1b5e28]">
          {language === 'bn' ? 'মৌসুমি অঁতেলিয়ে সম্পাদনা' : 'Seasonal Atelier Edit'}
        </span>
        <h1 className="font-display text-[28px] sm:text-[38px] font-black text-[#0b1b0e] tracking-tight">
          {language === 'bn' ? 'নির্বাচিত কালেকশন গ্যালারি' : 'Curated Collections Archive'}
        </h1>
        <p className="text-[13.5px] text-[#2b4c30] mt-1.5 max-w-xl leading-relaxed font-medium">
          {language === 'bn'
            ? 'প্যারিসের আধুনিক টেইলরিং ও বাংলাদেশের ঐতিহ্যবাহী সিল্ক ও লিনেন কারুশিল্পের মেলবন্ধন।'
            : 'Dialogues between Parisian sartorial architecture and legendary Bengal raw silk and Belgian flax.'}
        </p>
      </div>

      {/* 3. COLLECTIONS GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {[1, 2].map((n) => (
            <div key={n} className="rounded-3xl overflow-hidden bg-white border border-[#bedec0] animate-pulse h-96 flex flex-col">
              <div className="aspect-[16/10] bg-[#edf4ea]" />
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="h-6 bg-[#edf4ea] rounded-xl w-2/3" />
                <div className="h-4 bg-[#edf4ea] rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/collection/${col.slug}`}
              className="group rounded-3xl overflow-hidden bg-white border border-[#bedec0] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-[#edf4ea] overflow-hidden">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
                  <span className="text-[10.5px] font-black uppercase tracking-[0.2em] text-[#d6edd2] mb-1">
                    {col.collectionNumber}
                  </span>
                  <h2 className="font-display text-[22px] sm:text-[26px] font-black tracking-tight leading-tight">
                    {col.title}
                  </h2>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
                <p className="text-[13px] text-[#2c4e32] leading-relaxed">
                  {col.description}
                </p>

                <div className="pt-3 border-t border-[#edf4ea] flex items-center justify-between">
                  <span className="text-[11.5px] font-bold text-[#1b5e28] uppercase tracking-wider">
                    {col.subtitle}
                  </span>
                  <span className="h-8 px-4 rounded-xl bg-[#0f2113] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 group-hover:bg-[#1b5e28] transition-colors">
                    <span>{language === 'bn' ? 'কালেকশন দেখুন' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#bedec0] p-8 shadow-xs">
          <Layers className="w-12 h-12 text-[#1b5e28] mx-auto mb-3 opacity-60" />
          <h3 className="font-display font-black text-[20px] text-[#0f2113]">
            {language === 'bn' ? 'বর্তমানে কোনো কালেকশন প্রকাশিত নেই' : 'No Collections Live Currently'}
          </h3>
          <p className="text-[13px] text-[#2b4c30] mt-1 max-w-md mx-auto">
            {language === 'bn'
              ? 'আমাদের অঁতেলিয়ের নতুন মৌসুমি কালেকশন শীঘ্রই সুপাবেস ডাটাবেসে যুক্ত করা হবে।'
              : 'Our seasonal curations will appear here once published.'}
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider rounded-xl hover:bg-[#1b5e28] transition-colors shadow-sm"
          >
            <span>{language === 'bn' ? 'সকল পোশাক দেখুন' : 'Browse All Pieces'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
