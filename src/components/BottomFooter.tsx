import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageSquare, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { subscribeNewsletter } from '../services/supabaseService';

export const BottomFooter: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useStore();
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast(language === 'bn' ? 'সঠিক ইমেইল এড্রেস লিখুন।' : 'Please enter a valid email address.');
      return;
    }
    setIsSubscribing(true);
    try {
      const res = await subscribeNewsletter(newsletterEmail);
      setIsSubscribing(false);
      setNewsletterEmail('');
      showToast(
        language === 'bn'
          ? 'ধন্যবাদ! আমাদের ভিআইপি অঁতেলিয়ে গেজেটে আপনার ইমেইল যুক্ত হয়েছে।'
          : res.message
      );
    } catch (err) {
      setIsSubscribing(false);
      showToast(language === 'bn' ? 'সাবস্ক্রিপশন সম্পন্ন হয়েছে।' : 'Subscribed to VIP Gazette.');
    }
  };

  return (
    <footer id="app-bottom-navbar" className="w-full bg-[#18281b] text-[#c8dac4] border-t border-[#253626] mt-auto selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* 1. TOP HIGHLIGHT STRIP */}
      <div className="border-b border-[#253626] bg-[#121c13] px-4 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-2 text-white">
            <span className="font-display tracking-widest text-[16px] text-[#d6edd2]">ELIF</span>
            <span className="text-[#849685]">•</span>
            <span className="text-[#c8dac4]">
              {language === 'bn' ? 'ঢাকা ফ্ল্যাগশিপ অঁতেলিয়ে' : 'Dhaka Flagship Atelier'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-[#c8dac4]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50]" />
              {t.trustCod}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d6edd2]" />
              {language === 'bn' ? 'বিকাশ ও কার্ড পেমেন্ট' : 'bKash & Cards Accepted'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50]" />
              {language === 'bn' ? '২৪-৪৮ ঘণ্টায় ডেলিভারি' : '24-48h Delivery'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[12px]">
        {/* Col 1: Brand & Contact */}
        <div className="flex flex-col gap-3">
          <p className="font-display text-[18px] text-white tracking-wide">ELIF STUDIO</p>
          <p className="text-[#9cb29e] leading-relaxed text-[12px]">
            {language === 'bn'
              ? 'হ্যান্ডলুম রাজশাহী সিল্ক, প্রিমিয়াম উল ও কটন থেকে তৈরি আভিজাত্যপূর্ণ পোশাক।'
              : 'Artisanal outerwear, pure Rajshahi silk, and refined essentials tailored in Dhaka and Paris.'}
          </p>
          <div className="text-[11px] text-[#c8dac4] flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#d6edd2]" />
              <button
                type="button"
                onClick={() => setIsPhoneModalOpen(true)}
                className="hover:text-[#d6edd2] text-left transition-colors cursor-pointer flex items-center gap-1.5 group"
                title={language === 'bn' ? 'WhatsApp বা সরাসরি কলের অপশন' : 'Click for WhatsApp or Phone Call'}
              >
                <span className="underline decoration-[#d6edd2]/40 underline-offset-2 group-hover:decoration-[#d6edd2]">
                  +880 1995-513269 ({language === 'bn' ? 'সকাল ১০টা - রাত ১০টা' : '10 AM - 10 PM'})
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#d6edd2]/20 text-[#d6edd2]">
                  {language === 'bn' ? 'অপশন' : 'Options'}
                </span>
              </button>
            </div>
            <p className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#d6edd2]" />
              <span className="select-all cursor-default text-[#c8dac4]">elifrekha@gmail.com</span>
            </p>
          </div>
        </div>

        {/* Col 2: Quick Shop Navigation (Multi-Page URLs) */}
        <div className="flex flex-col gap-2.5">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px] text-[#d6edd2]">
            {language === 'bn' ? 'পোশাক কালেকশন' : 'Shop Clothing'}
          </p>
          <ul className="flex flex-col gap-2 text-[#c8dac4]">
            <li>
              <Link to="/shop" className="hover:text-white transition-colors cursor-pointer text-left block">
                {language === 'bn' ? 'সকল পোশাক' : 'All Clothing'}
              </Link>
            </li>
            <li>
              <Link to="/category/outerwear-trench" className="hover:text-white transition-colors cursor-pointer text-left block">
                {language === 'bn' ? 'কোট ও ওভারওয়্যার' : 'Coats & Outerwear'}
              </Link>
            </li>
            <li>
              <Link to="/category/fine-knitwear" className="hover:text-white transition-colors cursor-pointer text-left block">
                {language === 'bn' ? 'কাশ্মীরি নিটওয়্যার' : 'Cashmere & Knitwear'}
              </Link>
            </li>
            <li>
              <Link to="/category/bengal-silk-shirting" className="hover:text-white transition-colors cursor-pointer text-left block">
                {language === 'bn' ? 'রাজশাহী সিল্ক ও শার্ট' : 'Rajshahi Silk & Shirts'}
              </Link>
            </li>
            <li>
              <Link to="/category/tailored-trousers" className="hover:text-white transition-colors cursor-pointer text-left block">
                {language === 'bn' ? 'টেইলর্ড ট্রাউজার্স' : 'Tailored Trousers'}
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-white transition-colors cursor-pointer text-left block">
                {language === 'bn' ? 'লুকবুক ও কালেকশনস' : 'Lookbook & Collections'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Policies (Multi-Page URLs) */}
        <div className="flex flex-col gap-2.5">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px] text-[#d6edd2]">
            {language === 'bn' ? 'পলিসি ও শর্তাবলী' : 'Policies & Rights'}
          </p>
          <ul className="flex flex-col gap-2 text-[#c8dac4]">
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5">
                <span>{language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}</span>
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5">
                <span>{language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}</span>
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5">
                <span>{language === 'bn' ? '৭ দিনের রিটার্ন ও এক্সচেঞ্জ' : 'Return & Exchange Policy'}</span>
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5">
                <span>{language === 'bn' ? 'শিপিং ও ডেলিভারি' : 'Shipping & Delivery'}</span>
              </Link>
            </li>
            <li>
              <Link to="/account/orders" className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5">
                <span>{language === 'bn' ? 'ডেলিভারি ট্র্যাকিং' : 'Track Delivery'}</span>
              </Link>
            </li>
            <li>
              <Link to="/salon" className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5">
                <span>{language === 'bn' ? 'স্যালন ফিটিং বুকিং' : 'Salon Fitting Booking'}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter & Social Media */}
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px] text-[#d6edd2]">
            {language === 'bn' ? 'ভিআইপি অঁতেলিয়ে গেজেট' : 'VIP Atelier Gazette'}
          </p>
          <p className="text-[11px] text-[#9cb29e]">
            {language === 'bn'
              ? 'নতুন কালেকশন ও প্রাইভেট সিল্ক রিলিজের আপডেট সরাসরি আপনার ইমেইলে পেতে যুক্ত হোন:'
              : 'Subscribe for private runway previews, silk drops, and tailoring archives:'}
          </p>

          {/* Connected Supabase Newsletter Form */}
          <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 mt-0.5">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={language === 'bn' ? 'আপনার ইমেইল লিখুন...' : 'name@example.com'}
              required
              className="bg-[#203122] border border-[#2b3e2d] rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-[#849685] focus:outline-none focus:border-[#d6edd2] flex-1"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="px-3 py-1.5 rounded-lg bg-[#2d6636] text-[#ffffff] hover:bg-[#397d44] font-bold text-[10px] uppercase tracking-wider transition-colors shrink-0 disabled:opacity-50 cursor-pointer border border-[#3f804b]"
            >
              {isSubscribing
                ? '...'
                : language === 'bn' ? 'যুক্ত হোন' : 'Join'}
            </button>
          </form>

          {/* Social links */}
          <div className="flex items-center gap-3 mt-1 text-[#c8dac4]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#203122] border border-[#2b3e2d] flex items-center justify-center hover:bg-[#2d6636] hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <span className="text-[13px] font-bold">IG</span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#203122] border border-[#2b3e2d] flex items-center justify-center hover:bg-[#2d6636] hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <span className="text-[13px] font-bold">FB</span>
            </a>
            <a
              href="https://wa.me/8801995513269"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#203122] border border-[#2b3e2d] flex items-center justify-center hover:bg-[#2d6636] hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT & LOGISTICS ROW */}
      <div className="border-t border-[#253626] bg-[#0e160f] px-4 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#738a75]">
          <p>© 2025 ELIF ATELIER BANGLADESH. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <span>Dhaka Atelier • Banani & Gulshan 2</span>
            <span>•</span>
            <span className="text-[#a4cca7]">Powered by Haute Modernity Engine</span>
          </div>
        </div>
      </div>

      {/* Phone modal */}
      {isPhoneModalOpen && (
        <div
          onClick={() => setIsPhoneModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#faf7eb] rounded-2xl p-5 shadow-2xl border border-[#ded6be] text-[#18281b]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#ded6be]">
              <h3 className="font-display font-bold text-[16px]">
                {language === 'bn' ? 'গ্রাহক সেবা ও যোগাযোগ' : 'Client Relations Hotline'}
              </h3>
              <button
                type="button"
                onClick={() => setIsPhoneModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f6ee] flex items-center justify-center text-[#18281b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              <a
                href="tel:+8801995513269"
                className="flex items-center justify-between p-3 rounded-xl bg-[#f1f6ee] border border-[#d6e5d2] hover:bg-[#e7f0e3] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#2d6636]" />
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-[#18281b]">+880 1995-513269</p>
                    <p className="text-[11px] text-[#3a4d3d]">{language === 'bn' ? 'সরাসরি কল করুন' : 'Direct Phone Call'}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#2d6636]">CALL NOW</span>
              </a>

              <a
                href="https://wa.me/8801995513269"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#25d366]/15 border border-[#25d366]/40 hover:bg-[#25d366]/25 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#128c7e]" />
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-[#18281b]">WhatsApp Concierge</p>
                    <p className="text-[11px] text-[#3a4d3d]">{language === 'bn' ? 'তাৎক্ষণিক মেসেজ ও ছবি পাঠান' : 'Instant Chat Support'}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#128c7e]">CHAT</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
