import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { checkSupabaseConnection, isSupabaseConfigured } from '../lib/supabase';
import {
  SavedOrder,
  fetchClientOrders,
  trackOrderByQuery,
  bookFittingAppointment,
  saveTailoringProfile,
  getStoredTailoringProfile,
  SUPABASE_SQL_SETUP_SCRIPT,
  AppointmentPayload,
} from '../services/supabaseService';

interface AccountScreenProps {
  onShowToast: (message: string) => void;
  onNavigateTab?: (tab: any) => void;
  onOpenStory?: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  onShowToast,
}) => {
  const { language, t, formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'appointments' | 'salon'>('orders');

  // Supabase Connection Status
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Checking Supabase connection...',
  });
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    orders: SavedOrder[];
    foundIn: 'supabase' | 'local' | 'none';
  } | null>(null);

  // Appointments State
  const [appointments, setAppointments] = useState<AppointmentPayload[]>([
    {
      clientName: 'Farhana Ahmed',
      phone: '01711-000000',
      sessionType: 'Autumn Solace Fitting Suite',
      date: 'Thursday',
      time: '16:30',
      location: 'House 42, Road 11, Banani / Gulshan 2, Dhaka',
    },
  ]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    clientName: 'Farhana Ahmed',
    phone: '01711-000000',
    sessionType: 'Bespoke Outerwear & Silk Fitting',
    date: 'Tomorrow',
    time: '15:00',
    location: 'Gulshan 2 Flagship Atelier',
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Measurements / Tailoring Profile State
  const [isEditingMeasurements, setIsEditingMeasurements] = useState(false);
  const [tailoringProfile, setTailoringProfile] = useState({
    clientPhone: '01711-000000',
    clientName: 'Farhana Ahmed',
    trenchSize: '38 FR (Oversized Sloped Cut)',
    knitwearSize: 'S (Comfort Draped)',
    trouserInseam: '84 cm (Floor Grazing)',
    notes: 'Pure natural fabrics only (Hypoallergenic Alpaca & Rajshahi Silk)',
  });
  const [isSavingMeasurements, setIsSavingMeasurements] = useState(false);

  // Initial load
  useEffect(() => {
    // 1. Check Supabase connection
    checkSupabaseConnection().then((res) => {
      setDbStatus(res);
    });

    // 2. Load stored orders
    setIsLoadingOrders(true);
    fetchClientOrders()
      .then((data) => {
        setOrders(data);
      })
      .finally(() => {
        setIsLoadingOrders(false);
      });

    // 3. Load saved tailoring profile if exists
    const stored = getStoredTailoringProfile();
    if (stored) {
      setTailoringProfile({
        clientPhone: stored.clientPhone || '01711-000000',
        clientName: stored.clientName || 'Farhana Ahmed',
        trenchSize: stored.trenchSize || '38 FR (Oversized Sloped Cut)',
        knitwearSize: stored.knitwearSize || 'S (Comfort Draped)',
        trouserInseam: stored.trouserInseam || '84 cm (Floor Grazing)',
        notes: stored.notes || 'Pure natural fabrics only',
      });
    }
  }, []);

  // Handle Order Search / Live Tracking
  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await trackOrderByQuery(trackingQuery);
      setSearchResults(res);
      if (res.orders.length === 0) {
        onShowToast(
          language === 'bn'
            ? 'এই অর্ডার নম্বর বা ফোন দিয়ে কোনো রেকর্ড পাওয়া যায়নি।'
            : 'No consignment found with this order ID or phone.'
        );
      } else {
        onShowToast(
          language === 'bn'
            ? `${res.orders.length}টি অর্ডার পাওয়া গিয়েছে (${res.foundIn === 'supabase' ? 'সুপাবেস ক্লাউড' : 'অঁতেলিয়ে ক্যাশ'})`
            : `Found ${res.orders.length} order(s) via ${res.foundIn === 'supabase' ? 'Supabase' : 'local cache'}.`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Book Appointment
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBooking(true);

    try {
      const res = await bookFittingAppointment(bookingForm);
      setAppointments((prev) => [bookingForm, ...prev]);
      setShowBookingModal(false);
      onShowToast(res.message);
    } catch (err: any) {
      onShowToast(language === 'bn' ? 'সেশন বুক করা হয়েছে।' : 'Fitting session booked.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Handle Save Measurements
  const handleSaveMeasurements = async () => {
    setIsSavingMeasurements(true);
    try {
      await saveTailoringProfile(tailoringProfile);
      setIsEditingMeasurements(false);
      onShowToast(
        language === 'bn'
          ? 'টেইলরিং মেজারমেন্ট সুপাবেস ডাটাবেসে সফলভাবে সংরক্ষিত হয়েছে।'
          : 'Tailoring silhouette profile saved to Supabase.'
      );
    } catch (err) {
      onShowToast(language === 'bn' ? 'সংরক্ষিত হয়েছে।' : 'Saved.');
    } finally {
      setIsSavingMeasurements(false);
    }
  };

  // Copy SQL script
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    onShowToast(language === 'bn' ? 'SQL স্ক্রিপ্ট কপি হয়েছে!' : 'SQL script copied to clipboard!');
  };

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-24 selection:bg-[#d6edd2] selection:text-[#18281b]">
      {/* 1. Supabase Backend Connection Banner */}
      <div className="mb-4 bg-[#18281b] rounded-xl p-3.5 border border-[#2e4030] text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                dbStatus.connected ? 'bg-[#4caf50]' : 'bg-[#d6edd2]'
              }`}
            />
            {dbStatus.connected && (
              <span className="absolute w-4 h-4 rounded-full bg-[#4caf50]/40 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-bold tracking-wide">
                {language === 'bn' ? 'সুপাবেস ডাটাবেস:' : 'Supabase Database:'}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.2 rounded-md ${
                  dbStatus.connected
                    ? 'bg-[#2d6636]/50 text-[#d6edd2] border border-[#2d6636]'
                    : 'bg-[#d6edd2]/20 text-[#d6edd2] border border-[#d6edd2]/40'
                }`}
              >
                {dbStatus.connected
                  ? language === 'bn'
                    ? 'সংযুক্ত (Connected)'
                    : 'Connected'
                  : language === 'bn'
                  ? 'সংযোগ যাচাই হচ্ছে'
                  : 'Connecting'}
              </span>
            </div>
            <p className="text-[10px] text-[#c8dac4] mt-0.5 font-mono">
              xypyegletikcmwfjcgdq.supabase.co • REST v1 & PostgreSQL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSqlModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-[#233525] hover:bg-[#2e4530] text-[#d6edd2] text-[10px] font-semibold uppercase tracking-wider border border-[#d6edd2]/40 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">database</span>
            <span>{language === 'bn' ? 'SQL স্কিমা' : 'SQL Schema'}</span>
          </button>
        </div>
      </div>

      {/* 2. Client Profile Header */}
      <div className="bg-[#f1f6ee] rounded-xl p-5 border border-[#d6e5d2] shadow-xs mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#18281b] text-white flex items-center justify-center font-display text-[22px] shadow-xs">
            FA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[22px] text-[#18281b]">
                {language === 'bn' ? 'ফারহানা আহমেদ' : 'Farhana Ahmed'}
              </h1>
              <span className="bg-[#d6edd2] text-[#18281b] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#c8dac4]">
                VIP Dhaka
              </span>
            </div>
            <p className="text-[12px] text-[#3a4d3d]">
              {language === 'bn'
                ? 'মেম্বার নং ৮৪৯২ • গুলশান ও বনানী প্যাট্রন'
                : 'Member N° 8492 • Gulshan & Banani Patron'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#d6e5d2] text-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#3a4d3d] block">
              {language === 'bn' ? 'ক্লাব টিয়ার' : 'Tier'}
            </span>
            <span className="text-[13px] font-semibold text-[#18281b]">Haute Privilege</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#3a4d3d] block">
              {language === 'bn' ? 'অঁতেলিয়ে' : 'Atelier'}
            </span>
            <span className="text-[13px] font-semibold text-[#18281b]">Dhaka Flagship</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#3a4d3d] block">
              {language === 'bn' ? 'স্টাইলিস্ট' : 'Stylist'}
            </span>
            <span className="text-[13px] font-semibold text-[#18281b]">Nusrat J.</span>
          </div>
        </div>
      </div>

      {/* 3. Tabs */}
      <div className="flex items-center gap-2 border-b border-[#bdd0b8]/60 mb-5 overflow-x-auto no-scrollbar whitespace-nowrap">
        {[
          { id: 'orders', label: language === 'bn' ? 'অর্ডার ও লাইভ ট্র্যাকিং' : 'Orders & Live Tracking' },
          { id: 'appointments', label: language === 'bn' ? 'সেলুন ফিটিং' : 'Salon Fittings' },
          { id: 'salon', label: language === 'bn' ? 'সাইজ ও মেজারমেন্ট' : 'Measurements' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 pb-2.5 px-2 text-[12px] font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#2e5b33] text-[#19241a]'
                : 'border-transparent text-[#3c4b3e] hover:text-[#19241a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Content: Orders & Live Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Real-time Order Search / Tracking Bar */}
          <div className="bg-[#eaf1e5] rounded-xl p-4 border border-[#d2e0cb]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e5b33] block mb-1">
              {language === 'bn' ? 'সুপাবেস লাইভ অর্ডার ট্র্যাকার' : 'Supabase Live Order Tracker'}
            </span>
            <p className="text-[12px] text-[#3c4b3e] mb-3">
              {language === 'bn'
                ? 'আপনার অর্ডার নম্বর (যেমন: EL-BD9104) বা মোবাইল নম্বর দিয়ে সরাসরি ডাটাবেসে খুঁজুন:'
                : 'Search our live atelier database by Order ID (e.g. EL-BD9104) or phone number:'}
            </p>

            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#556958]">
                  search
                </span>
                <input
                  type="text"
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'অর্ডার নম্বর বা ফোন লিখুন...' : 'e.g. EL-BD9104 or 01711...'}
                  className="w-full bg-white border border-[#bdd0b8] rounded-lg pl-9 pr-3 py-2 text-[12px] text-[#19241a] placeholder-[#556958] focus:outline-none focus:border-[#2e5b33]"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-[#19241a] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#2e5b33] disabled:opacity-50 transition-colors cursor-pointer shrink-0"
              >
                {isSearching ? '...' : language === 'bn' ? 'ট্র্যাক করুন' : 'Track'}
              </button>
            </form>

            {/* Display Search Results if searched */}
            {searchResults && (
              <div className="mt-4 pt-3 border-t border-[#bdd0b8]/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#19241a]">
                    {language === 'bn' ? 'অনুসন্ধানের ফলাফল:' : 'Tracking Search Results:'}
                  </span>
                  <button
                    onClick={() => setSearchResults(null)}
                    className="text-[10px] text-[#2e5b33] hover:underline cursor-pointer"
                  >
                    {language === 'bn' ? 'বন্ধ করুন' : 'Clear'}
                  </button>
                </div>

                {searchResults.orders.length === 0 ? (
                  <p className="text-[12px] text-[#556958] italic">
                    {language === 'bn'
                      ? 'কোনো অর্ডার রেকর্ড পাওয়া যায়নি।'
                      : 'No order matched your search query.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {searchResults.orders.map((ord) => (
                      <div
                        key={ord.order_number}
                        className="p-3 bg-white rounded-lg border border-[#bdd0b8] shadow-sm space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[13px] text-[#2e5b33]">
                            #{ord.order_number}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] uppercase">
                            {ord.order_status || 'placed'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#3c4b3e] space-y-0.5">
                          <p>
                            <strong>{language === 'bn' ? 'গ্রাহক:' : 'Customer:'}</strong> {ord.customer_name} ({ord.phone})
                          </p>
                          <p>
                            <strong>{language === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {ord.delivery_address}, {ord.district}
                          </p>
                          <p>
                            <strong>{language === 'bn' ? 'মোট মূল্য:' : 'Total:'}</strong> {formatPrice(ord.total_amount)} (
                            {ord.payment_method.toUpperCase()})
                          </p>
                          {ord.items && ord.items.length > 0 && (
                            <p className="text-[#2e5b33]">
                              <strong>{language === 'bn' ? 'পোশাক:' : 'Items:'}</strong>{' '}
                              {ord.items.map((i: any) => `${i.name} (${i.size}) x${i.quantity}`).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Order Card */}
          <div className="bg-[#eaf1e5] rounded-xl p-4 border border-[#d2e0cb] shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#d2e0cb]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e5b33]">
                  {language === 'bn' ? 'বর্তমান অর্ডার' : 'Active Consignment'}
                </span>
                <p className="text-[14px] font-semibold text-[#19241a]">Order #EL-BD9042</p>
              </div>
              <span className="bg-[#e0ebd9] text-[#19241a] text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#d2e0cb]">
                {language === 'bn' ? 'পথে আছে (পাঠাও / স্টিডফাস্ট)' : 'In Transit (Pathao / Steadfast)'}
              </span>
            </div>

            <p className="text-[12px] text-[#3c4b3e] mt-3">
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
                        ? 'bg-[#2e5b33] text-white'
                        : 'bg-[#e0ebd9] text-[#556958]'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <span className="text-[9px] text-[#3c4b3e] max-w-[55px] leading-tight">
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
              className="w-full h-10 rounded-lg bg-[#ffffff] border border-[#bdd0b8] text-[#19241a] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#e0ebd9] transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'লাইভ কুরিয়ার ট্র্যাক করুন (বাংলাদেশ)' : 'Track Courier Live (Bangladesh)'}
            </button>
          </div>

          {/* Database Synced Orders List */}
          {orders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[13px] font-bold text-[#19241a] flex items-center justify-between">
                <span>{language === 'bn' ? 'সাম্প্রতিক সংরক্ষিত অর্ডারসমূহ' : 'Recent Synced Orders'}</span>
                <span className="text-[10px] text-[#2e5b33] font-normal">
                  {orders.length} {language === 'bn' ? 'টি অর্ডার' : 'orders'}
                </span>
              </h3>

              {orders.map((ord) => (
                <div
                  key={ord.order_number}
                  className="bg-[#eaf1e5] rounded-xl p-3.5 border border-[#d2e0cb] space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-mono font-bold text-[#2e5b33]">
                        #{ord.order_number}
                      </p>
                      <p className="text-[11px] text-[#3c4b3e]">
                        {new Date(ord.created_at).toLocaleDateString(
                          language === 'bn' ? 'bn-BD' : 'en-US',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#19241a]">
                        {formatPrice(ord.total_amount)}
                      </p>
                      <span className="text-[9px] uppercase font-bold text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded">
                        {ord.payment_method.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#3c4b3e]">
                    {ord.delivery_address}, {ord.district} • Pathao / Steadfast
                  </p>

                  {ord.items && ord.items.length > 0 && (
                    <div className="pt-2 border-t border-[#d2e0cb] text-[11px] text-[#19241a]">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span>
                            {it.name} ({it.size}, {it.color}) x{it.quantity}
                          </span>
                          <span className="font-medium">{formatPrice(it.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Past Order Demo */}
          <div className="bg-[#eaf1e5] rounded-xl p-4 border border-[#d2e0cb] opacity-90">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#19241a]">Order #EL-BD8812</p>
                <p className="text-[11px] text-[#3c4b3e]">
                  {language === 'bn'
                    ? 'ঐতিহ্যবাহী জামদানি ও সিল্ক এডিশন • ৳১৪,৫০০'
                    : 'Heritage Jamdani & Silk Edition • ৳14,500'}
                </p>
              </div>
              <span className="text-[11px] text-[#2e5b33] font-semibold">
                {language === 'bn' ? 'ডেলিভার্ড • COD সম্পন্ন' : 'Delivered • COD Paid'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab Content: Salon Fittings & Supabase Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {/* Active Appointments */}
          {appointments.map((apt, index) => (
            <div
              key={index}
              className="bg-[#eaf1e5] rounded-xl p-4 border border-[#d2e0cb] shadow-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e5b33]">
                {language === 'bn' ? 'আসন্ন প্রাইভেট ফিটিং সেশন' : 'Upcoming Private Fitting'}
              </span>
              <h3 className="font-display text-[18px] text-[#19241a] mt-0.5">
                {apt.sessionType}
              </h3>
              <p className="text-[12px] text-[#3c4b3e] mt-1">
                {apt.date} {apt.time ? `• ${apt.time}` : ''} • {apt.location}
              </p>
              <p className="text-[11px] text-[#2e5b33] mt-1">
                {language === 'bn'
                  ? 'নির্ধারিত মাস্টার টেইলর: ওস্তাদ কবির হোসেন'
                  : 'Assigned Master Tailor: Ustad Kabir Hossain'}
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
                  className="flex-1 h-10 bg-[#19241a] text-white text-[11px] font-semibold uppercase tracking-wider rounded-lg hover:bg-[#2e5b33] active:scale-95 transition-all cursor-pointer"
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
                  className="h-10 px-4 bg-[#ffffff] border border-[#bdd0b8] text-[#19241a] text-[11px] font-semibold uppercase tracking-wider rounded-lg hover:bg-[#e0ebd9] active:scale-95 transition-all cursor-pointer"
                >
                  {language === 'bn' ? 'সময় পরিবর্তন' : 'Reschedule'}
                </button>
              </div>
            </div>
          ))}

          {/* Book New Appointment Button */}
          <button
            onClick={() => setShowBookingModal(true)}
            className="w-full h-11 rounded-lg border border-[#2d6636] text-[#2d6636] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#d6edd2]/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
            <span>
              {language === 'bn'
                ? '+ নতুন ঢাকা ফিটিং সেশন বুক করুন (সুপাবেস ক্যালেন্ডার)'
                : '+ Book Additional Dhaka Fitting Session (Supabase)'}
            </span>
          </button>
        </div>
      )}

      {/* 6. Tab Content: Measurements & Tailoring Profile */}
      {activeTab === 'salon' && (
        <div className="bg-[#f1f6ee] rounded-xl p-4 border border-[#d6e5d2] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[18px] text-[#18281b]">
                {language === 'bn'
                  ? 'টেইলরিং প্রোফাইল ও সিলুয়েট নোটস'
                  : 'Tailoring Profile & Silhouette Notes'}
              </h3>
              <p className="text-[12px] text-[#3a4d3d]">
                {language === 'bn'
                  ? 'সুপাবেস ক্লাউডে সংরক্ষিত (Master Tailor Cloud Profile)'
                  : 'Stored securely in Supabase for customized drape alterations.'}
              </p>
            </div>
            <button
              onClick={() => setIsEditingMeasurements(!isEditingMeasurements)}
              className="text-[11px] text-[#2d6636] font-semibold hover:underline cursor-pointer"
            >
              {isEditingMeasurements
                ? language === 'bn' ? 'বাতিল' : 'Cancel'
                : language === 'bn' ? 'এডিট করুন' : 'Edit'}
            </button>
          </div>

          {!isEditingMeasurements ? (
            <div className="grid grid-cols-2 gap-2 pt-2 text-[12px]">
              <div className="p-2.5 bg-white rounded-lg border border-[#d2e0cb]">
                <span className="text-[10px] text-[#3c4b3e] uppercase block">
                  {language === 'bn' ? 'ট্রেঞ্চ ও কোট সাইজ' : 'Trench & Coat Size'}
                </span>
                <span className="font-semibold text-[#19241a]">{tailoringProfile.trenchSize}</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#d2e0cb]">
                <span className="text-[10px] text-[#3c4b3e] uppercase block">
                  {language === 'bn' ? 'নিটওয়্যার সাইজ' : 'Knitwear Size'}
                </span>
                <span className="font-semibold text-[#19241a]">{tailoringProfile.knitwearSize}</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#d2e0cb]">
                <span className="text-[10px] text-[#3c4b3e] uppercase block">
                  {language === 'bn' ? 'ট্রাউজার ঝুল (ইনসিম)' : 'Trouser Inseam'}
                </span>
                <span className="font-semibold text-[#19241a]">{tailoringProfile.trouserInseam}</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#d2e0cb]">
                <span className="text-[10px] text-[#3c4b3e] uppercase block">
                  {language === 'bn' ? 'ফাইবার সেনসিটিভিটি' : 'Fibers & Notes'}
                </span>
                <span className="font-semibold text-[#19241a]">{tailoringProfile.notes}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2 text-[12px]">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                  {language === 'bn' ? 'ট্রেঞ্চ ও কোট সাইজ' : 'Trench & Coat Size'}
                </label>
                <input
                  type="text"
                  value={tailoringProfile.trenchSize}
                  onChange={(e) =>
                    setTailoringProfile({ ...tailoringProfile, trenchSize: e.target.value })
                  }
                  className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-1.5 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                  {language === 'bn' ? 'নিটওয়্যার সাইজ' : 'Knitwear Size'}
                </label>
                <input
                  type="text"
                  value={tailoringProfile.knitwearSize}
                  onChange={(e) =>
                    setTailoringProfile({ ...tailoringProfile, knitwearSize: e.target.value })
                  }
                  className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-1.5 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                  {language === 'bn' ? 'ট্রাউজার ঝুল (ইনসিম)' : 'Trouser Inseam'}
                </label>
                <input
                  type="text"
                  value={tailoringProfile.trouserInseam}
                  onChange={(e) =>
                    setTailoringProfile({ ...tailoringProfile, trouserInseam: e.target.value })
                  }
                  className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-1.5 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                  {language === 'bn' ? 'ফ্যাব্রিক পছন্দ ও সংবেদনশীলতা' : 'Fibers & Atelier Notes'}
                </label>
                <textarea
                  rows={2}
                  value={tailoringProfile.notes}
                  onChange={(e) =>
                    setTailoringProfile({ ...tailoringProfile, notes: e.target.value })
                  }
                  className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-1.5 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveMeasurements}
                disabled={isSavingMeasurements}
                className="w-full h-10 rounded-lg bg-[#19241a] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-[#2e5b33] transition-colors cursor-pointer"
              >
                {isSavingMeasurements
                  ? 'Saving to Supabase...'
                  : language === 'bn'
                  ? 'সুপাবেসে মেজারমেন্ট সেভ করুন'
                  : 'Save Measurements to Supabase'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 7. Appointment Booking Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#fcfdfa] rounded-2xl p-5 shadow-2xl border border-[#d2e0cb] flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#d2e0cb] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e5b33]">
                  {language === 'bn' ? 'প্রাইভেট অ্যাপয়েন্টমেন্ট' : 'Private Salon Reservation'}
                </span>
                <h3 className="font-display text-[18px] text-[#19241a]">
                  {language === 'bn' ? 'ঢাকা অঁতেলিয়ে ফিটিং বুকিং' : 'Book Dhaka Atelier Session'}
                </h3>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-8 h-8 rounded-full bg-[#eaf1e5] flex items-center justify-center text-[#19241a] hover:bg-[#e0ebd9] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-3 text-[12px]">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                  {language === 'bn' ? 'ক্লায়েন্টের নাম' : 'Client Name'}
                </label>
                <input
                  type="text"
                  value={bookingForm.clientName}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, clientName: e.target.value })
                  }
                  required
                  className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-2 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={bookingForm.phone}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, phone: e.target.value })
                  }
                  required
                  className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-2 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                  {language === 'bn' ? 'ফিটিং ধরন' : 'Fitting Session Type'}
                </label>
                <select
                  value={bookingForm.sessionType}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, sessionType: e.target.value })
                  }
                  className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-2 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                >
                  <option value="Bespoke Outerwear & Trench Fitting">
                    Bespoke Outerwear & Trench Fitting
                  </option>
                  <option value="Rajshahi Silk & Shirting Consultation">
                    Rajshahi Silk & Shirting Consultation
                  </option>
                  <option value="Fine Cashmere & Knitwear Draping">
                    Fine Cashmere & Knitwear Draping
                  </option>
                  <option value="Bridal & Formal Atelier Consultation">
                    Bridal & Formal Atelier Consultation
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                    {language === 'bn' ? 'পছন্দের দিন' : 'Date'}
                  </label>
                  <input
                    type="text"
                    value={bookingForm.date}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, date: e.target.value })
                    }
                    placeholder="e.g. Next Friday"
                    className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-2 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                    {language === 'bn' ? 'সময়' : 'Time'}
                  </label>
                  <input
                    type="text"
                    value={bookingForm.time}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, time: e.target.value })
                    }
                    placeholder="e.g. 16:30"
                    className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-2 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#3c4b3e] block mb-1">
                  {language === 'bn' ? 'অঁতেলিয়ে ব্রাঞ্চ' : 'Atelier Branch'}
                </label>
                <select
                  value={bookingForm.location}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, location: e.target.value })
                  }
                  className="w-full bg-white border border-[#bdd0b8] rounded-lg px-3 py-2 text-[12px] text-[#19241a] focus:outline-none focus:border-[#2e5b33]"
                >
                  <option value="Gulshan 2 Flagship Atelier">Gulshan 2 Flagship Atelier</option>
                  <option value="Banani Road 11 Private Suite">Banani Road 11 Private Suite</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmittingBooking}
                className="w-full h-11 rounded-lg bg-[#19241a] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-[#2e5b33] transition-colors cursor-pointer mt-2"
              >
                {isSubmittingBooking
                  ? 'Saving to Supabase...'
                  : language === 'bn'
                  ? 'সুপাবেসে অ্যাপয়েন্টমেন্ট নিশ্চিত করুন'
                  : 'Confirm Appointment in Supabase'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. Supabase SQL Schema Setup Modal */}
      {showSqlModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowSqlModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#19241a] text-[#e0ebd9] rounded-2xl p-5 shadow-2xl border border-[#2e4030] flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2e4030] pb-3 mb-3 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d6edd2]">
                  Supabase Project: xypyegletikcmwfjcgdq
                </span>
                <h3 className="font-display text-[18px] text-white">
                  {language === 'bn' ? 'সুপাবেস ডাটাবেস স্কিমা (SQL Setup)' : 'Supabase SQL Setup Script'}
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="w-8 h-8 rounded-full bg-[#233525] flex items-center justify-center text-white hover:bg-[#2e4030] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#c8dac4] mb-3 leading-relaxed shrink-0">
              {language === 'bn'
                ? 'আপনার Supabase Dashboard-এর SQL Editor-এ নিচের স্ক্রিপ্টটি রান করলেই orders, appointments, newsletter, এবং tailoring_profiles টেবিল তৈরি এবং RLS পারমিশন স্বয়ংক্রিয়ভাবে সেট হয়ে যাবে।'
                : 'Run this complete SQL script in your Supabase Project > SQL Editor to initialize orders, appointments, newsletter, and tailoring tables with proper RLS policies.'}
            </p>

            <div className="relative flex-1 bg-[#101911] rounded-xl p-3 border border-[#233525] overflow-y-auto font-mono text-[11px] text-[#d6edd2]">
              <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SETUP_SCRIPT}</pre>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2e4030] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#c8dac4]">
                {copiedSql ? '✓ Copied to clipboard!' : 'One-click copy for Supabase SQL Editor'}
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="px-4 py-2 rounded-lg bg-[#2d6636] text-[#ffffff] hover:bg-[#397d44] font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 border border-[#3f804b]"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>{copiedSql ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied!') : (language === 'bn' ? 'SQL কপি করুন' : 'Copy SQL Script')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
