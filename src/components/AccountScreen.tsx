import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AccountScreenProps {
  onShowToast: (message: string) => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onShowToast }) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'appointments' | 'salon'>('orders');

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-24 selection:bg-[#ffdeaa]">
      {/* Client Profile Header */}
      <div className="bg-[#f3ede3] rounded-xl p-5 border border-[#e8e2d8] shadow-sm mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1d1b19] text-white flex items-center justify-center font-display text-[22px] shadow-sm">
            FA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[22px] text-[#1d1b15]">
                {language === 'bn' ? 'ফারহানা আহমেদ' : 'Farhana Ahmed'}
              </h1>
              <span className="bg-[#ffc55f] text-[#755100] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                VIP Dhaka
              </span>
            </div>
            <p className="text-[12px] text-[#4b4640]">
              {language === 'bn' ? 'মেম্বার নং ৮৪৯২ • গুলশান ও বনানী প্যাট্রন' : 'Member N° 8492 • Gulshan & Banani Patron'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#e8e2d8] text-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#4b4640] block">
              {language === 'bn' ? 'ক্লাব টিয়ার' : 'Tier'}
            </span>
            <span className="text-[13px] font-semibold text-[#1d1b15]">Haute Privilege</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#4b4640] block">
              {language === 'bn' ? 'অঁতেলিয়ে' : 'Atelier'}
            </span>
            <span className="text-[13px] font-semibold text-[#1d1b15]">Dhaka Flagship</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#4b4640] block">
              {language === 'bn' ? 'স্টাইলিস্ট' : 'Stylist'}
            </span>
            <span className="text-[13px] font-semibold text-[#1d1b15]">Nusrat J.</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#cec5bd]/60 mb-5 overflow-x-auto no-scrollbar whitespace-nowrap">
        {[
          { id: 'orders', label: language === 'bn' ? 'অর্ডার ও ট্র্যাকিং' : 'Orders & Tracking' },
          { id: 'appointments', label: language === 'bn' ? 'সেলুন ফিটিং' : 'Salon Fittings' },
          { id: 'salon', label: language === 'bn' ? 'সাইজ ও মেজারমেন্ট' : 'Measurements' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 pb-2.5 px-2 text-[12px] font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#7d5700] text-[#1d1b15]'
                : 'border-transparent text-[#4b4640] hover:text-[#1d1b15]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Active Order Card */}
          <div className="bg-[#f3ede3] rounded-xl p-4 border border-[#e8e2d8] shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8e2d8]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5700]">
                  {language === 'bn' ? 'বর্তমান অর্ডার' : 'Active Consignment'}
                </span>
                <p className="text-[14px] font-semibold text-[#1d1b15]">Order #EL-BD9042</p>
              </div>
              <span className="bg-[#e8e2d8] text-[#1d1b15] text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {language === 'bn' ? 'পথে আছে (পাঠাও / স্টিডফাস্ট)' : 'In Transit (Pathao / Steadfast)'}
              </span>
            </div>

            <p className="text-[12px] text-[#4b4640] mt-3">
              {language === 'bn'
                ? 'আনুমানিক পৌঁছানোর সময়: আগামীকাল দুপুর ২টার মধ্যে • বনানী / গুলশান ২, ঢাকা'
                : 'Delivery estimated: Tomorrow by 14:00 • Banani / Gulshan 2, Dhaka'}
            </p>

            {/* Tracking Milestones */}
            <div className="flex items-center justify-between my-4 px-2">
              {[
                { label: language === 'bn' ? 'অঁতেলিয়ে সেলাই' : 'Atelier Tailored', done: true },
                { label: language === 'bn' ? 'মান যাচাই' : 'Quality Inspected', done: true },
                { label: language === 'bn' ? 'কুরিয়ারে আছে' : 'With Courier', done: true },
                { label: language === 'bn' ? 'ডেলিভার্ড' : 'Delivered', done: false },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] mb-1 ${
                      step.done
                        ? 'bg-[#7d5700] text-white'
                        : 'bg-[#ede7dd] text-[#7d766f]'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <span className="text-[9px] text-[#4b4640] max-w-[55px] leading-tight">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                onShowToast(
                  language === 'bn'
                    ? 'স্টিডফাস্ট / পাঠাও লাইভ ট্র্যাকিং #PT-889104: গুলশান-২ হাবে কুরিয়ার রাইডার অ্যাসাইন করা হয়েছে।'
                    : 'Steadfast / Pathao Live Tracking #PT-889104: Courier assigned at Gulshan-2 Hub.'
                )
              }
              className="w-full h-10 rounded-lg bg-[#ffffff] border border-[#cec5bd] text-[#1d1b15] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#ede7dd] transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'লাইভ কুরিয়ার ট্র্যাক করুন (বাংলাদেশ)' : 'Track Courier Live (Bangladesh)'}
            </button>
          </div>

          {/* Past Order */}
          <div className="bg-[#f3ede3] rounded-xl p-4 border border-[#e8e2d8] opacity-90">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#1d1b15]">Order #EL-BD8812</p>
                <p className="text-[11px] text-[#4b4640]">
                  {language === 'bn' ? 'ঐতিহ্যবাহী জামদানি ও সিল্ক এডিশন • ৳১৪,৫০০' : 'Heritage Jamdani & Silk Edition • ৳14,500'}
                </p>
              </div>
              <span className="text-[11px] text-[#7d5700] font-semibold">
                {language === 'bn' ? 'ডেলিভার্ড • COD সম্পন্ন' : 'Delivered • COD Paid'}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="bg-[#f3ede3] rounded-xl p-4 border border-[#e8e2d8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5700]">
              {language === 'bn' ? 'আসন্ন প্রাইভেট ফিটিং সেশন' : 'Upcoming Private Fitting'}
            </span>
            <h3 className="font-display text-[18px] text-[#1d1b15] mt-0.5">
              {language === 'bn' ? 'শরৎকালিন প্রাইভেট ফিটিং স্যুট' : 'Autumn Solace Fitting Suite'}
            </h3>
            <p className="text-[12px] text-[#4b4640] mt-1">
              {language === 'bn' ? 'বৃহস্পতিবার বিকাল ৪:৩০ • বাড়ি ৪২, রোড ১১, বনানী / গুলশান ২, ঢাকা' : 'Thursday at 16:30 • House 42, Road 11, Banani / Gulshan 2, Dhaka'}
            </p>
            <p className="text-[11px] text-[#7d5700] mt-2">
              {language === 'bn' ? 'নির্ধারিত মাস্টার টেইলর: ওস্তাদ কবির হোসেন' : 'Assigned Master Tailor: Ustad Kabir Hossain'}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  onShowToast(
                    language === 'bn'
                      ? 'ঢাকা অঁতেলিয়ে কনসিয়ার্জের সাথে ফিটিং নিশ্চিত করা হয়েছে।'
                      : 'Fitting confirmed with Dhaka Atelier Concierge.'
                  )
                }
                className="flex-1 h-10 bg-[#1d1b19] text-white text-[11px] font-semibold uppercase tracking-wider rounded-lg hover:bg-[#7d5700] active:scale-95 transition-all cursor-pointer"
              >
                {language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
              </button>
              <button
                onClick={() =>
                  onShowToast(
                    language === 'bn'
                      ? 'নুসরাত জে.-এর কাছে সময় পরিবর্তনের অনুরোধ পাঠানো হয়েছে।'
                      : 'Reschedule request sent to Nusrat J.'
                  )
                }
                className="h-10 px-4 bg-[#ffffff] border border-[#cec5bd] text-[#1d1b15] text-[11px] font-semibold uppercase tracking-wider rounded-lg hover:bg-[#ede7dd] active:scale-95 transition-all cursor-pointer"
              >
                {language === 'bn' ? 'সময় পরিবর্তন' : 'Reschedule'}
              </button>
            </div>
          </div>

          <button
            onClick={() =>
              onShowToast(
                language === 'bn'
                  ? 'গুলশান ২ এবং বনানী অঁতেলিয়ের জন্য প্রাইভেট সেলুন রিজার্ভেশন খোলা হয়েছে।'
                  : 'Private salon reservation opened for Gulshan 2 and Banani Ateliers.'
              )
            }
            className="w-full h-11 rounded-lg border border-[#7d5700] text-[#7d5700] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#ffc55f]/10 active:scale-95 transition-all cursor-pointer"
          >
            {language === 'bn' ? '+ নতুন ঢাকা ফিটিং সেশন বুক করুন' : '+ Book Additional Dhaka Fitting Session'}
          </button>
        </div>
      )}

      {activeTab === 'salon' && (
        <div className="bg-[#f3ede3] rounded-xl p-4 border border-[#e8e2d8] space-y-3">
          <h3 className="font-display text-[18px] text-[#1d1b15]">
            {language === 'bn' ? 'টেইলরিং প্রোফাইল ও সিলুয়েট নোটস' : 'Tailoring Profile & Silhouette Notes'}
          </h3>
          <p className="text-[12px] text-[#4b4640]">
            {language === 'bn'
              ? 'কাস্টমাইজড পোশাকের মাপ নিখুঁত রাখার জন্য নিরাপদে সংরক্ষিত।'
              : 'Stored securely for customized drape alterations on made-to-order outerwear and trousers.'}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 text-[12px]">
            <div className="p-2.5 bg-white rounded-lg border border-[#e8e2d8]">
              <span className="text-[10px] text-[#4b4640] uppercase block">
                {language === 'bn' ? 'ট্রেঞ্চ ও কোট সাইজ' : 'Trench & Coat Size'}
              </span>
              <span className="font-semibold text-[#1d1b15]">38 FR (Oversized Sloped Cut)</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#e8e2d8]">
              <span className="text-[10px] text-[#4b4640] uppercase block">
                {language === 'bn' ? 'নিটওয়্যার সাইজ' : 'Knitwear Size'}
              </span>
              <span className="font-semibold text-[#1d1b15]">S (Comfort Draped)</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#e8e2d8]">
              <span className="text-[10px] text-[#4b4640] uppercase block">
                {language === 'bn' ? 'ট্রাউজার ঝুল (ইনসিম)' : 'Trouser Inseam'}
              </span>
              <span className="font-semibold text-[#1d1b15]">84 cm (Floor Grazing)</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#e8e2d8]">
              <span className="text-[10px] text-[#4b4640] uppercase block">
                {language === 'bn' ? 'ফাইবার সেনসিটিভিটি' : 'Allergies / Fibers'}
              </span>
              <span className="font-semibold text-[#1d1b15]">{language === 'bn' ? 'নেই (হাইপোঅ্যালার্জেনিক)' : 'None (Hypoallergenic Alpaca)'}</span>
            </div>
          </div>

          <button
            onClick={() =>
              onShowToast(
                language === 'bn'
                  ? 'মেজারমেন্ট আপডেট রিকোয়েস্ট গ্রহণ করা হয়েছে।'
                  : 'Measurement update request logged.'
              )
            }
            className="w-full h-10 rounded-lg bg-[#1d1b19] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-[#7d5700] mt-2 cursor-pointer"
          >
            {language === 'bn' ? 'টেইলরিং নোটস আপডেট করুন' : 'Update Tailoring Notes'}
          </button>
        </div>
      )}
    </div>
  );
};
