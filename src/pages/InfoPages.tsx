import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const InfoPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const { language } = useLanguage();

  const getPageData = () => {
    if (path.includes('/atelier')) {
      return {
        eyebrow: language === 'bn' ? 'অঁতেলিয়ে ডসিয়ার নং ০৮' : 'The Atelier Dossier N° 08',
        title: language === 'bn' ? 'সিল্ক, আলপাকা ও লিনেনের শিল্পরূপ' : 'The Architecture of Silk & Linen',
        subtitle: language === 'bn' ? 'প্যারিসীয় ও ঢাকাই মনোরেখা • শরৎ ২০২৫' : 'Parisian Sartorial Architecture • Autumn Solace ’25',
        content: (
          <div className="space-y-6 text-[14px] text-[#1c3821] leading-relaxed">
            <p>
              {language === 'bn'
                ? 'আমাদের অঁতেলিয়েতে পোশাক কেবল সাময়িক ফ্যাশন নয়, বরং পরিধানযোগ্য শিল্পকর্ম। কালেকশন নং ০৮-এ আমাদের দক্ষ কারিগররা বেলজিয়ান ফ্ল্যাক্স লিনেনের আধুনিকতা এবং মালবেরি সিল্ক ও রাজশাহীর প্রিমিয়াম সুতার প্রাকৃতিক মাধুর্যকে এক সুতোয় গেঁথেছেন।'
                : 'In our atelier, garments are conceived not as transient trends, but as inhabited sculptures. For Collection N° 08, our master cutters have fused the dry, architectural crispness of unbleached Belgian flax linen with the tactile fluid weight of Bengal mulberry silk habotai.'}
            </p>
            <blockquote className="border-l-4 border-[#1b5e28] pl-4 italic font-display text-[17px] text-[#0f2113] my-4 bg-[#edf6eb] p-4 rounded-r-2xl">
              {language === 'bn'
                ? '“আসল আভিজাত্য নীরবে কথা বলে—কাঁধের নিখুঁত ড্র্যাপে, হাতের বুননে এবং আলপাকা ও রেশমের ওজনে।”'
                : '“True luxury is quiet. It speaks through the drape over the shoulder, the hand of the weave, and the weightless warmth of rare alpaca.”'}
            </blockquote>
            <h3 className="font-display font-black text-[20px] text-[#0f2113]">
              {language === 'bn' ? 'আমাদের সেরা টেক্সটাইল ঐতিহ্য' : 'Master Textile Heritage'}
            </h3>
            <ul className="space-y-3 list-disc pl-5">
              <li>
                <strong>{language === 'bn' ? 'বিয়েলা উল মিলস (ইতালি):' : 'Biella Wool Mills (Italy):'}</strong>{' '}
                {language === 'bn'
                  ? 'সিন্থেটিক কেমিক্যাল ছাড়াই ল্যানোলিন শাইন ধরে রাখা ভার্জিন উল।'
                  : 'Extra-fine virgin wool combed without synthetic chemical finishes to preserve the natural lanolin sheen.'}
              </li>
              <li>
                <strong>{language === 'bn' ? 'স্কটিশ ও মঙ্গোলিয়ান কাশ্মীর:' : 'Mongolian & Scottish Cashmere:'}</strong>{' '}
                {language === 'bn'
                  ? '৪-প্লাই গ্রেড-এ কাশ্মীরি সুতা যা বছরের পর বছর নতুনের মতো টেকসই থাকে।'
                  : '4-ply grade-A cashmere spun with tight dimensional stability to prevent pilling across decades.'}
              </li>
              <li>
                <strong>{language === 'bn' ? 'রাজশাহী মালবেরি সিল্ক (বাংলাদেশ):' : 'Rajshahi Mulberry Silk (Bangladesh):'}</strong>{' '}
                {language === 'bn'
                  ? 'শতবর্ষী ঐতিহ্যবাহী তাঁতে বোনা অপরূপ উজ্জ্বল প্রাকৃতিক রেশম।'
                  : 'Handwoven heritage silk with radiant natural sheen and weightless fluidity.'}
              </li>
            </ul>
          </div>
        ),
      };
    }

    if (path.includes('/salon')) {
      return {
        eyebrow: language === 'bn' ? 'প্রাইভেট কনসিয়ার্জ সেবা' : 'Private Concierge Suite',
        title: language === 'bn' ? 'স্যালন ও ব্যক্তিগত ফিটিং অ্যাপয়েন্টমেন্ট' : 'Private Salon & Bespoke Fittings',
        subtitle: language === 'bn' ? 'গুলশান ২ ও বনানী ফ্ল্যাগশিপ লাউঞ্জ, ঢাকা' : 'Gulshan 2 & Banani Atelier Lounges, Dhaka',
        content: (
          <div className="space-y-6 text-[14px] text-[#1c3821] leading-relaxed">
            <p>
              {language === 'bn'
                ? 'আমাদের গুলশান ও বনানী প্রাইভেট স্যালনে আপনি পাবেন একক ব্যক্তিগত ট্রায়াল, দক্ষ মাস্টার ট্রেইলারের মাপজোখ ও ব্যক্তিগত কাপড়ের পরামর্শ।'
                : 'Experience private fitting sessions with our master tailors. Our dedicated stylists provide bespoke proportion consultations and personalized garment adjustments.'}
            </p>
            <div className="p-6 rounded-2xl bg-[#edf6eb] border border-[#bedec0] space-y-3">
              <h4 className="font-display font-black text-[16px] text-[#0f2113]">
                {language === 'bn' ? 'স্যালন ফিটিংয়ের সুবিধাসমূহ:' : 'Salon Session Privileges:'}
              </h4>
              <ul className="space-y-2 list-disc pl-5 text-[13.5px]">
                <li>{language === 'bn' ? 'একক রিজার্ভেশন ও ভিআইপি লাউঞ্জ সুবিধা' : 'Exclusive VIP salon reservation'}</li>
                <li>{language === 'bn' ? 'প্যারিসিয়ান কাটের সঠিক সাইজিং ও ট্রায়াল' : 'Precision sleeve and hem tailoring adjustments'}</li>
                <li>{language === 'bn' ? 'প্রিমিয়াম অঁতেলিয়ে কফি ও রিফ্রেশমেন্ট' : 'Complimentary signature espresso & herbal infusions'}</li>
              </ul>
            </div>
            <div className="pt-2">
              <Link
                to="/account/appointments"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider rounded-xl hover:bg-[#1b5e28] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>{language === 'bn' ? 'অনলাইনে অ্যাপয়েন্টমেন্ট বুক করুন' : 'Book a Private Session'}</span>
              </Link>
            </div>
          </div>
        ),
      };
    }

    if (path.includes('/shipping')) {
      return {
        eyebrow: language === 'bn' ? 'শিপিং ও ডেলিভারি নির্দেশিকা' : 'Logistics & Dispatch Protocol',
        title: language === 'bn' ? 'সারাদেশে ডেলিভারি ও প্যাকেজিং' : 'Nationwide Shipping & Delivery Policy',
        subtitle: language === 'bn' ? 'ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা • ৬৪ জেলায় হোম ডেলিভারি' : '24-48 Hours in Dhaka • Fast Nationwide Delivery',
        content: (
          <div className="space-y-5 text-[14px] text-[#1c3821] leading-relaxed">
            <p>
              {language === 'bn'
                ? 'ELIF স্টুডিওর প্রতিটি অর্ডার বিশেষ ক্লাইমেট-কন্ট্রোলড প্যাকেট ও কটন গার্মেন্ট ব্যাগে সুরক্ষিতভাবে গ্রাহকের ঠিকানায় পাঠানো হয়।'
                : 'Every ELIF purchase arrives in signature acid-free archival tissue within a breathable canvas garment carrier.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl bg-[#edf6eb] border border-[#bedec0]">
                <h4 className="font-black text-[#0f2113] text-[14px] mb-1">
                  {language === 'bn' ? 'ঢাকা মেট্রোপলিটন এলাকা' : 'Dhaka Metropolitan'}
                </h4>
                <p className="text-[13px] text-[#2c4e31]">
                  {language === 'bn' ? 'ডেলিভারি সময়: ২৪ থেকে ৪৮ ঘণ্টা। ডেলিভারি চার্জ: ৳৮০ (ক্যাশ অন ডেলিভারি প্রযোজ্য)।' : 'Dispatch time: 24 to 48 hours. Flat delivery: ৳80 with Cash on Delivery.'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#edf6eb] border border-[#bedec0]">
                <h4 className="font-black text-[#0f2113] text-[14px] mb-1">
                  {language === 'bn' ? 'ঢাকার বাইরে (সমগ্র বাংলাদেশ)' : 'Rest of Bangladesh (64 Districts)'}
                </h4>
                <p className="text-[13px] text-[#2c4e31]">
                  {language === 'bn' ? 'ডেলিভারি সময়: ২ থেকে ৩ কার্যদিবস। ডেলিভারি চার্জ: ৳১৫০ (ক্যাশ অন ডেলিভারি ও বিকাশ)।' : 'Dispatch time: 2 to 3 business days via Steadfast / SA Paribahan. Delivery: ৳150.'}
                </p>
              </div>
            </div>
          </div>
        ),
      };
    }

    if (path.includes('/returns')) {
      return {
        eyebrow: language === 'bn' ? 'রিটার্ন ও এক্সচেঞ্জ গ্যারান্টি' : 'Complimentary Exchange Policy',
        title: language === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ ও রিটার্ন পলিসি' : '7-Day Effortless Size Exchange Guarantee',
        subtitle: language === 'bn' ? 'আপনার শতভাগ সন্তুষ্টি আমাদের একমাত্র অঙ্গীকার' : 'Complimentary courier pickup for size swaps across Bangladesh',
        content: (
          <div className="space-y-4 text-[14px] text-[#1c3821] leading-relaxed">
            <p>
              {language === 'bn'
                ? 'পোশাকের মাপ বা সিলুয়েট নিয়ে কোনো দ্বিধা থাকলে ডেলিভারি পাওয়ার ৭ দিনের মধ্যে সম্পূর্ণ বিনামূল্যে সাইজ এক্সচেঞ্জ সুবিধা পাবেন।'
                : 'If a silhouette or sleeve requires adjustment, you may request an exchange within 7 days of delivery with zero courier surcharge.'}
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>{language === 'bn' ? 'পোশাক অবিকৃত, ধোয়া ছাড়া এবং মূল অঁতেলিয়ে ট্যাগযুক্ত থাকতে হবে।' : 'Garment must remain unworn, unwashed with original atelier tag intact.'}</li>
              <li>{language === 'bn' ? 'ডেলিভারিম্যানের সামনে পার্সেল চেক করে নেওয়ার পূর্ণ অধিকার আপনার রয়েছে।' : 'Clients maintain full privilege to inspect goods upon doorstep delivery.'}</li>
            </ul>
          </div>
        ),
      };
    }

    if (path.includes('/privacy')) {
      return {
        eyebrow: language === 'bn' ? 'ডাটা ও প্রাইভেসি সুরক্ষা' : 'Data Protection Policy',
        title: language === 'bn' ? 'গ্রাহক তথ্য সুরক্ষা ও প্রাইভেসি পলিসি' : 'Client Privacy & Data Security Policy',
        subtitle: language === 'bn' ? 'ব্যক্তিগত তথ্যের সর্বোচ্চ গোপনীয়তা রক্ষা' : 'Encrypted Client Records & Confidential Handling',
        content: (
          <div className="space-y-4 text-[14px] text-[#1c3821] leading-relaxed">
            <p>
              {language === 'bn'
                ? 'আমরা গ্রাহকের নাম, ফোন নম্বর এবং ডেলিভারি ঠিকানা শুধুমাত্র কুরিয়ার ও অর্ডার প্রসেসিংয়ের জন্য সংগ্রহ করি। কোনো অবস্থাতেই তথ্য তৃতীয় পক্ষের কাছে বিক্রয় বা হস্তান্তর করা হয় না।'
                : 'We collect customer contact records solely to facilitate express doorstep courier delivery and fitting appointments.'}
            </p>
          </div>
        ),
      };
    }

    if (path.includes('/terms')) {
      return {
        eyebrow: language === 'bn' ? 'বাণিজ্যিক নীতিমালা' : 'Terms & Conditions',
        title: language === 'bn' ? 'ব্যবহারের শর্তাবলী ও বাণিজ্যিক নিয়ম' : 'Terms of Service & Commercial Conditions',
        subtitle: language === 'bn' ? 'ELIF ঢাকা অঁতেলিয়ে স্ট্যান্ডার্ড' : 'ELIF Dhaka Flagship Commercial Standards',
        content: (
          <div className="space-y-4 text-[14px] text-[#1c3821] leading-relaxed">
            <p>
              {language === 'bn'
                ? 'আমাদের অনলাইন শপে প্রদর্শিত সকল পণ্যের মূল্য ভ্যাটসহ প্রদর্শিত। অর্ডার নিশ্চিতকরণের পর কাস্টমার কেয়ার থেকে ফোন বা এসএমএস এর মাধ্যমে নিশ্চিত করা হয়।'
                : 'All listed prices include official VAT. Orders are verified and dispatched immediately upon customer phone confirmation.'}
            </p>
          </div>
        ),
      };
    }

    if (path.includes('/contact')) {
      return {
        eyebrow: language === 'bn' ? 'গ্রাহক সেবা ও যোগাযোগ' : 'Client Concierge',
        title: language === 'bn' ? 'যোগাযোগ ও হটলাইন সহায়তা' : 'Contact & Flagship Atelier Lounges',
        subtitle: language === 'bn' ? 'সকাল ১০টা থেকে রাত ১০টা পর্যন্ত সক্রিয়' : 'Active 10:00 AM – 10:00 PM BST',
        content: (
          <div className="space-y-5 text-[14px] text-[#1c3821] leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#edf6eb] border border-[#bedec0]">
                <h4 className="font-black text-[#0f2113] text-[15px] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1b5e28]">store</span>
                  {language === 'bn' ? 'ঢাকা ফ্ল্যাগশিপ অঁতেলিয়ে' : 'Dhaka Flagship Lounge'}
                </h4>
                <p className="text-[13px] text-[#2c4e31]">
                  House 42, Road 11, Block D, Banani / Gulshan 2, Dhaka 1213, Bangladesh.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#edf6eb] border border-[#bedec0]">
                <h4 className="font-black text-[#0f2113] text-[15px] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1b5e28]">support_agent</span>
                  {language === 'bn' ? 'হটলাইন ও হোয়াটসঅ্যাপ' : 'Hotline & WhatsApp'}
                </h4>
                <p className="text-[13px] text-[#2c4e31]">
                  +880 1995-513269<br />
                  elifrekha@gmail.com
                </p>
              </div>
            </div>
          </div>
        ),
      };
    }

    // Default Fallback
    return {
      eyebrow: language === 'bn' ? 'অঁতেলিয়ে তথ্য' : 'Atelier Information',
      title: language === 'bn' ? 'ELIF ঢাকা অঁতেলিয়ে' : 'ELIF Haute Modernity',
      subtitle: language === 'bn' ? 'আধুনিক পোশাক ও কারুকাজ' : 'Contemporary Haute Tailoring & Textiles',
      content: (
        <div className="space-y-4 text-[14px] text-[#1c3821] leading-relaxed">
          <p>
            {language === 'bn'
              ? 'ELIF হলো একটি আধুনিক ফ্যাশন ব্র্যান্ড যা ঐতিহ্য ও আধুনিক ডিজাইনের মেলবন্ধনে তৈরি।'
              : 'ELIF is a contemporary fashion house celebrating architectural tailoring, unpretentious luxury, and rare natural textiles.'}
          </p>
        </div>
      ),
    };
  };

  const page = getPageData();

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* 1. BREADCRUMBS */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#35523a] mb-5 py-1"
      >
        <Link to="/" className="hover:text-[#0f2113] hover:underline">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <span className="text-[#96b499]">•</span>
        <span className="text-[#0f2113] font-black truncate">{page.title}</span>
      </nav>

      {/* 2. EDITORIAL ARTICLE CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#bedec0]">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1b5e28] block mb-1">
          {page.eyebrow}
        </span>
        <h1 className="font-display font-black text-[26px] sm:text-[36px] text-[#0f2113] tracking-tight leading-tight mb-2">
          {page.title}
        </h1>
        <p className="text-[13.5px] text-[#2c4e31] font-bold pb-6 border-b border-[#edf4ea] mb-6">
          {page.subtitle}
        </p>

        {page.content}

        <div className="mt-10 pt-6 border-t border-[#edf4ea] flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/shop"
            className="px-5 py-2.5 bg-[#0f2113] text-white text-[12px] font-black uppercase tracking-wider rounded-xl hover:bg-[#1b5e28] transition-colors"
          >
            {language === 'bn' ? 'কালেকশন দেখুন' : 'Explore Collections'}
          </Link>
          <Link
            to="/"
            className="text-[12px] font-bold text-[#1b5e28] hover:underline"
          >
            {language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Return to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export const AtelierPage: React.FC = () => <InfoPage />;
export const SalonPage: React.FC = () => <InfoPage />;
export const PrivacyPolicyPage: React.FC = () => <InfoPage />;
export const TermsPage: React.FC = () => <InfoPage />;
export const ReturnsPage: React.FC = () => <InfoPage />;
export const ShippingPage: React.FC = () => <InfoPage />;
export const ContactPage: React.FC = () => <InfoPage />;
