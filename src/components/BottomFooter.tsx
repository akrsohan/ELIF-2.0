import React, { useState } from 'react';
import { TabType } from '../types';

interface BottomFooterProps {
  onNavigateTab: (tab: TabType, categoryFilter?: string) => void;
  onShowToast: (message: string) => void;
}

export const BottomFooter: React.FC<BottomFooterProps> = ({
  onNavigateTab,
  onShowToast,
}) => {
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const policyContent: Record<string, { title: string; subtitle: string; details: string[] }> = {
    privacy: {
      title: 'Privacy Policy (প্রাইভেসি পলিসি)',
      subtitle: 'Data Protection & Security Guidelines',
      details: [
        'আমরা গ্রাহকের নাম, ফোন নম্বর এবং ডেলিভারি ঠিকানা শুধুমাত্র কুরিয়ার ও অর্ডার প্রসেসিংয়ের জন্য সংগ্রহ করি।',
        'বিকাশ ও অনলাইন পেমেন্টের যাবতীয় তথ্য সর্বোচ্চ ব্যাংকিং গ্রেড এনক্রিপশনে সুরক্ষিত থাকে।',
        'আমরা কখনোই কোনো তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বা ফোন নম্বর বিক্রয় বা শেয়ার করি না।',
        'আপনি যেকোনো সময় আপনার অর্ডার হিস্ট্রি বা অ্যাকাউন্ট তথ্য মুছে ফেলার আবেদন করতে পারেন।'
      ]
    },
    terms: {
      title: 'Terms of Service (ব্যবহারের শর্তাবলী)',
      subtitle: 'ELIF Studio Bangladesh Commercial Terms',
      details: [
        'অর্ডার নিশ্চিতকরণের পর ঢাকায় ২৪-৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ২-৩ কার্যদিবসে ডেলিভারি সম্পন্ন হয়।',
        'ক্যাশ অন ডেলিভারির ক্ষেত্রে ডেলিভারিম্যানের সামনে পার্সেল চেক করে গ্রহণ করার সম্পূর্ণ অধিকার রয়েছে।',
        'উৎপাদন বা ফেব্রিকের কোনো ত্রুটি থাকলে ডেলিভারি পাওয়ার সাথে সাথে গ্রাহক সেবা নম্বরে অবগত করার অনুরোধ করা হচ্ছে।',
        'প্রাইস ও ভ্যাট সম্পর্কিত সকল তথ্য ইনভয়েসে স্পষ্টভাবে উল্লেখ থাকবে।'
      ]
    },
    cookies: {
      title: 'Cookie Policy (কুকিজ পলিসি)',
      subtitle: 'Session Management & Preferences',
      details: [
        'আমরা শুধুমাত্র ইউজার সেশন (যেমন: কার্ট আইটেম, উইশলিস্ট এবং ভাষা পছন্দ) মনে রাখার জন্য প্রয়োজনীয় ফাংশনাল কুকিজ ব্যবহার করি।',
        'কোনো প্রকার থার্ড-পার্টি ট্র্যাকিং কুকি গ্রাহকের অনুমতি ব্যতীত ইনস্টল করা হয় না।',
        'আপনি ব্রাউজারের যেকোনো সময় ক্যাশ ও কুকিজ ক্লিয়ার করতে পারবেন।'
      ]
    },
    returns: {
      title: 'Return & Refund Policy (রিটার্ন ও এক্সচেঞ্জ)',
      subtitle: '7-Day Easy Exchange Guarantee',
      details: [
        'পোশাকের সাইজ বা ফিটিং না মিললে ৭ দিনের মধ্যে বিনামূল্যে এক্সচেঞ্জ সুবিধা উপভোগ করুন।',
        'পণ্য অবশ্যই অবিকৃত, ধোয়া ছাড়া এবং মূল ট্যাগযুক্ত অবস্থায় থাকতে হবে।',
        'ক্যাশ অন ডেলিভারিতে কোনো ভুল বা ক্ষতিগ্রস্ত প্রোডাক্ট পেলে সাথে সাথেই রিটার্ন করতে পারবেন, কোনো বাড়তি চার্জ নেওয়া হবে না।'
      ]
    }
  };

  return (
    <footer id="app-bottom-navbar" className="w-full bg-[#1d1b19] text-[#e8e2d8] border-t border-[#33302a] mt-auto">
      {/* 1. TOP HIGHLIGHT STRIP */}
      <div className="border-b border-[#33302a] bg-[#171513] px-4 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-2 text-white">
            <span className="font-display tracking-widest text-[16px] text-[#ffc55f]">ELIF</span>
            <span className="text-[#878380]">•</span>
            <span className="text-[#cec5bd]">Dhaka Flagship Atelier</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-[#cec5bd]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
              ক্যাশ অন ডেলিভারি (COD)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffc55f]" />
              বিকাশ ও নগদ পেমেন্ট
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
              ২৪-৪৮ ঘণ্টায় ডেলিভারি
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[12px]">
        {/* Col 1: Brand & Contact */}
        <div className="flex flex-col gap-3">
          <p className="font-display text-[18px] text-white tracking-wide">ELIF STUDIO</p>
          <p className="text-[#a8a199] leading-relaxed text-[12px]">
            হ্যান্ডলুম রাজশাহী সিল্ক, প্রিমিয়াম উল ও কটন থেকে তৈরি আভিজাত্যপূর্ণ পোশাক।
          </p>
          <div className="text-[11px] text-[#cec5bd] flex flex-col gap-1 mt-1">
            <p className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#ffc55f]">location_on</span>
              <span>Road 11, Banani / Gulshan 2, Dhaka</span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#ffc55f]">call</span>
              <span>+880 1700-889922 (10 AM - 9 PM)</span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#ffc55f]">mail</span>
              <span>concierge@elif-dhaka.com</span>
            </p>
          </div>
        </div>

        {/* Col 2: Quick Shop Navigation */}
        <div className="flex flex-col gap-2.5">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px] text-[#ffc55f]">
            Shop Clothing (পোশাক)
          </p>
          <ul className="flex flex-col gap-2 text-[#cec5bd]">
            <li>
              <button
                onClick={() => onNavigateTab('home')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                All Clothing (সকল পোশাক)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('categories', 'Outerwear & Trench')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Coats & Outerwear
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('categories', 'Fine Knitwear')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Cashmere & Knitwear
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('categories', 'Bengal Silk & Shirting')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Rajshahi Silk & Shirts
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('categories', 'Tailored Trousers')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Tailored Trousers
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Policies */}
        <div className="flex flex-col gap-2.5">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px] text-[#ffc55f]">
            Policies & Rights (পলিসি ও শর্তাবলী)
          </p>
          <ul className="flex flex-col gap-2 text-[#cec5bd]">
            <li>
              <button
                onClick={() => setActivePolicyModal('privacy')}
                className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>Privacy Policy (প্রাইভেসি পলিসি)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePolicyModal('terms')}
                className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>Terms of Service (ব্যবহারের শর্ত)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePolicyModal('cookies')}
                className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>Cookie Policy & Settings (কুকিজ পলিসি)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePolicyModal('returns')}
                className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>Return & Exchange Policy (৭ দিনের রিটার্ন)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('account')}
                className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>Track Delivery (ডেলিভারি ট্র্যাকিং)</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Social Media & Payment Badges */}
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px] text-[#ffc55f]">
            Connect & Follow (সোশ্যাল মিডিয়া)
          </p>
          <p className="text-[11px] text-[#a8a199]">
            নতুন কালেকশন ও স্টাইলিং আপডেটের জন্য আমাদের সোশ্যাল মিডিয়া ফলো করুন:
          </p>

          {/* Social Icons with Official Brand Colors on Hover */}
          <div className="flex items-center gap-2.5 pt-1">
            {/* Facebook (Official Blue #1877F2) */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="w-9 h-9 rounded-lg bg-[#2b2724] hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-110 hover:shadow-[0_4px_14px_rgba(24,119,242,0.45)]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
              </svg>
            </a>

            {/* Instagram (Official Brand Gradient) */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="w-9 h-9 rounded-lg bg-[#2b2724] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-white flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-110 hover:shadow-[0_4px_14px_rgba(220,39,67,0.45)]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* YouTube (Official Red #FF0000) */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="YouTube"
              className="w-9 h-9 rounded-lg bg-[#2b2724] hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-110 hover:shadow-[0_4px_14px_rgba(255,0,0,0.45)]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* WhatsApp / Chat Concierge (Official Green #25D366) */}
            <a
              href="https://wa.me/8801700889922"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Concierge"
              title="WhatsApp / Live Chat"
              className="w-9 h-9 rounded-lg bg-[#2b2724] hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-110 hover:shadow-[0_4px_14px_rgba(37,211,102,0.45)]"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </a>
          </div>

          {/* Payment Badges */}
          <div className="pt-2">
            <span className="text-[10px] text-[#878380] uppercase tracking-wider block mb-1.5">
              নিরাপদ পেমেন্ট মেথড
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
              <span className="bg-[#e2136e] text-white px-2 py-0.5 rounded">bKash</span>
              <span className="bg-[#f7941d] text-white px-2 py-0.5 rounded">Nagad</span>
              <span className="bg-[#2b2724] text-[#ffc55f] border border-[#3e3833] px-2 py-0.5 rounded">COD</span>
              <span className="bg-[#1a1f71] text-white px-2 py-0.5 rounded">VISA</span>
              <span className="bg-[#eb001b] text-white px-2 py-0.5 rounded">Mastercard</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT & LEGAL NOTICE BAR */}
      <div className="border-t border-[#2b2724] bg-[#121110] px-4 py-4 text-[11px] text-[#878380]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} <strong className="text-white">ELIF Dhaka Studio Ltd.</strong> সর্বস্বত্ব সংরক্ষিত (All rights reserved).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
            <button
              onClick={() => setActivePolicyModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePolicyModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePolicyModal('cookies')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cookies Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePolicyModal('returns')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Returns
            </button>
          </div>
        </div>
      </div>

      {/* 4. POLICY DETAIL MODAL */}
      {activePolicyModal && policyContent[activePolicyModal] && (
        <div
          onClick={() => setActivePolicyModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#fff9ee] text-[#1d1b15] rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#e8e2d8] flex flex-col gap-3 relative"
          >
            <div className="flex items-start justify-between border-b border-[#e8e2d8] pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7d5700]">
                  {policyContent[activePolicyModal].subtitle}
                </p>
                <h3 className="font-display text-[20px] font-semibold text-[#1d1b15] mt-0.5">
                  {policyContent[activePolicyModal].title}
                </h3>
              </div>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="w-8 h-8 rounded-full bg-[#f3ede3] flex items-center justify-center text-[#1d1b15] hover:bg-[#ede7dd] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-[12px] text-[#4b4640] py-2">
              {policyContent[activePolicyModal].details.map((point, index) => (
                <div key={index} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#7d5700] font-bold">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#e8e2d8] flex justify-end">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-5 py-2 bg-[#1d1b19] text-white text-[11px] font-semibold uppercase tracking-wider rounded-lg cursor-pointer hover:bg-[#7d5700] transition-colors"
              >
                Close (বন্ধ করুন)
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
