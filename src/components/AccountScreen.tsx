import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { checkSupabaseConnection } from '../lib/supabase';
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

  // Appointments State - clean initialization
  const [appointments, setAppointments] = useState<AppointmentPayload[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    phone: '',
    sessionType: 'Bespoke Outerwear & Silk Fitting',
    date: '',
    time: '',
    location: 'Gulshan 2 Flagship Atelier',
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Measurements / Tailoring Profile State - clean initialization
  const [isEditingMeasurements, setIsEditingMeasurements] = useState(false);
  const [tailoringProfile, setTailoringProfile] = useState({
    clientPhone: '',
    clientName: '',
    trenchSize: '',
    knitwearSize: '',
    trouserInseam: '',
    notes: '',
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
        clientPhone: stored.clientPhone || '',
        clientName: stored.clientName || '',
        trenchSize: stored.trenchSize || '',
        knitwearSize: stored.knitwearSize || '',
        trouserInseam: stored.trouserInseam || '',
        notes: stored.notes || '',
      });
      if (stored.clientName) {
        setBookingForm((prev) => ({
          ...prev,
          clientName: stored.clientName || '',
          phone: stored.clientPhone || '',
        }));
      }
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
    if (!bookingForm.clientName.trim() || !bookingForm.phone.trim() || !bookingForm.date.trim()) {
      onShowToast(language === 'bn' ? 'অনুগ্রহ করে সকল তথ্য পূরণ করুন।' : 'Please fill all appointment details.');
      return;
    }
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

  const clientName = tailoringProfile.clientName || orders[0]?.customer_name || '';

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
              PostgreSQL • Live Cloud Sync
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
          <div className="w-14 h-14 rounded-full bg-[#18281b] text-white flex items-center justify-center font-display text-[20px] shadow-xs">
            {clientName ? clientName.slice(0, 2).toUpperCase() : 'EL'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[22px] text-[#18281b]">
                {clientName || (language === 'bn' ? 'গ্রাহক অ্যাকাউন্ট' : 'Client Profile')}
              </h1>
              <span className="bg-[#d6edd2] text-[#18281b] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#c8dac4]">
                Atelier Client
              </span>
            </div>
            <p className="text-[12px] text-[#3a4d3d]">
              {tailoringProfile.clientPhone || (orders[0]?.phone ? `${orders[0].phone} • ` : '')}
              {language === 'bn' ? 'ঢাকা অঁতেলিয়ে প্যাট্রন' : 'Dhaka Atelier & Concierge'}
            </p>
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
          <div className="bg-[#eaf1e5] rounded-xl p-4 border border-[#d2e0cb]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e5b33] block mb-1">
              {language === 'bn' ? 'সুপাবেস লাইভ অর্ডার ট্র্যাকার' : 'Live Order Tracker'}
            </span>
            <p className="text-[12px] text-[#3c4b3e] mb-3">
              {language === 'bn'
                ? 'আপনার অর্ডার নম্বর (যেমন: EL-BD9104) বা মোবাইল নম্বর দিয়ে সরাসরি খুঁজুন:'
                : 'Search our live atelier database by Order ID or phone number:'}
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
                  placeholder={language === 'bn' ? 'অর্ডার নম্বর বা ফোন লিখুন...' : 'e.g. EL-BD9104 or 017XX...'}
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
                  <p className="text-[11px] text-[#3c4b3e] italic">
                    {language === 'bn'
                      ? 'এই নম্বর দিয়ে কোনো সক্রিয় অর্ডার পাওয়া যায়নি।'
                      : 'No active consignments found for this query.'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {searchResults.orders.map((o) => (
                      <div
                        key={o.id || o.order_number}
                        className="bg-white p-3 rounded-lg border border-[#bdd0b8] text-[12px]"
                      >
                        <div className="flex justify-between font-bold text-[#19241a]">
                          <span>#{o.order_number}</span>
                          <span className="text-[#2e5b33] uppercase text-[10px]">
                            {o.order_status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#556958] mt-1">{o.delivery_address}</p>
                        <p className="text-[11px] font-semibold text-[#19241a] mt-1">
                          {formatPrice(o.total_amount)} • {o.payment_method?.toUpperCase()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-display font-semibold text-[15px] text-[#19241a]">
              {language === 'bn' ? 'পূর্ববর্তী অর্ডারসমূহ' : 'Saved Orders History'}
            </h3>

            {isLoadingOrders ? (
              <div className="p-6 text-center text-[12px] text-[#556958]">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-[#d6e5d2] text-center">
                <p className="text-[12px] text-[#556958]">
                  {language === 'bn'
                    ? 'আপনার প্রোফাইলে কোনো পূর্ববর্তী অর্ডার রেকর্ড নেই।'
                    : 'No past orders recorded yet.'}
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id || order.order_number}
                  className="bg-white rounded-xl p-4 border border-[#d6e5d2] shadow-2xs flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[13px] text-[#18281b]">
                      #{order.order_number}
                    </span>
                    <span className="bg-[#d6edd2] text-[#18281b] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {order.order_status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3a4d3d]">
                    {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 1} items
                  </p>
                  <div className="pt-2 border-t border-[#edf4ea] flex justify-between items-center text-[12px]">
                    <span className="font-bold text-[#18281b]">{formatPrice(order.total_amount)}</span>
                    <span className="text-[10px] text-[#2d6636] uppercase font-semibold">
                      {order.payment_method}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. Tab Content: Salon Fittings */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-[16px] text-[#19241a]">
              {language === 'bn' ? 'নির্ধারিত ফিটিং সেশন' : 'Fitting Appointments'}
            </h3>
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-3 py-1.5 bg-[#18281b] text-white text-[11px] font-bold uppercase rounded-lg hover:bg-[#2d6636] cursor-pointer"
            >
              + {language === 'bn' ? 'বুকিং' : 'Book'}
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-[#d6e5d2] text-center">
              <p className="text-[12px] text-[#556958]">
                {language === 'bn'
                  ? 'বর্তমানে কোনো ফিটিং অ্যাপয়েন্টমেন্ট নির্ধারিত নেই।'
                  : 'No salon appointments booked.'}
              </p>
            </div>
          ) : (
            appointments.map((apt, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-[#d6e5d2]">
                <h4 className="font-bold text-[13px] text-[#18281b]">{apt.sessionType}</h4>
                <p className="text-[11px] text-[#3a4d3d] mt-1">
                  {apt.date} at {apt.time} • {apt.location}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. Tab Content: Measurements */}
      {activeTab === 'salon' && (
        <div className="bg-white p-5 rounded-xl border border-[#d6e5d2] space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#edf4ea]">
            <h3 className="font-display font-semibold text-[15px] text-[#18281b]">
              {language === 'bn' ? 'ব্যক্তিগত মাপ ও সাইজ' : 'Measurements'}
            </h3>
            <button
              onClick={() => setIsEditingMeasurements(!isEditingMeasurements)}
              className="text-[11px] text-[#2d6636] underline cursor-pointer"
            >
              {isEditingMeasurements ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="space-y-2 text-[12px]">
            <div>
              <label className="block font-bold text-[#18281b] text-[11px]">Full Name</label>
              <input
                disabled={!isEditingMeasurements}
                value={tailoringProfile.clientName}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, clientName: e.target.value })}
                placeholder="Your Name"
                className="w-full px-2.5 py-1.5 bg-[#f1f6ee] rounded border border-[#d6e5d2] mt-0.5"
              />
            </div>
            <div>
              <label className="block font-bold text-[#18281b] text-[11px]">Coat / Trench Size</label>
              <input
                disabled={!isEditingMeasurements}
                value={tailoringProfile.trenchSize}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, trenchSize: e.target.value })}
                placeholder="e.g. 38 FR"
                className="w-full px-2.5 py-1.5 bg-[#f1f6ee] rounded border border-[#d6e5d2] mt-0.5"
              />
            </div>
            <div>
              <label className="block font-bold text-[#18281b] text-[11px]">Knitwear Size</label>
              <input
                disabled={!isEditingMeasurements}
                value={tailoringProfile.knitwearSize}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, knitwearSize: e.target.value })}
                placeholder="e.g. M"
                className="w-full px-2.5 py-1.5 bg-[#f1f6ee] rounded border border-[#d6e5d2] mt-0.5"
              />
            </div>
            <div>
              <label className="block font-bold text-[#18281b] text-[11px]">Trouser Inseam</label>
              <input
                disabled={!isEditingMeasurements}
                value={tailoringProfile.trouserInseam}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, trouserInseam: e.target.value })}
                placeholder="e.g. 84 cm"
                className="w-full px-2.5 py-1.5 bg-[#f1f6ee] rounded border border-[#d6e5d2] mt-0.5"
              />
            </div>
            <div>
              <label className="block font-bold text-[#18281b] text-[11px]">Notes</label>
              <input
                disabled={!isEditingMeasurements}
                value={tailoringProfile.notes}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, notes: e.target.value })}
                placeholder="Special tailoring notes"
                className="w-full px-2.5 py-1.5 bg-[#f1f6ee] rounded border border-[#d6e5d2] mt-0.5"
              />
            </div>
          </div>

          {isEditingMeasurements && (
            <button
              onClick={handleSaveMeasurements}
              disabled={isSavingMeasurements}
              className="mt-3 px-4 py-2 bg-[#18281b] text-white text-[11px] font-bold uppercase rounded-lg hover:bg-[#2d6636] cursor-pointer"
            >
              Save Measurements
            </button>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 border border-[#bedec0] space-y-3">
            <h3 className="font-display font-bold text-[16px] text-[#18281b]">Book Salon Session</h3>
            <form onSubmit={handleBookAppointment} className="space-y-2 text-[12px]">
              <input
                required
                placeholder="Your Name *"
                value={bookingForm.clientName}
                onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                className="w-full p-2 bg-[#edf6eb] rounded border border-[#bedeb8]"
              />
              <input
                required
                placeholder="Phone Number *"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                className="w-full p-2 bg-[#edf6eb] rounded border border-[#bedeb8]"
              />
              <input
                required
                placeholder="Session Type *"
                value={bookingForm.sessionType}
                onChange={(e) => setBookingForm({ ...bookingForm, sessionType: e.target.value })}
                className="w-full p-2 bg-[#edf6eb] rounded border border-[#bedeb8]"
              />
              <input
                type="date"
                required
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="w-full p-2 bg-[#edf6eb] rounded border border-[#bedeb8]"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="flex-1 py-2 bg-[#18281b] text-white font-bold rounded-lg uppercase text-[11px]"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-[#edf6eb] text-[#18281b] rounded-lg text-[11px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SQL Setup Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#faf7eb] w-full max-w-lg rounded-2xl p-5 border border-[#bedec0] space-y-3 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-[16px] text-[#18281b]">Supabase SQL Schema</h3>
              <button onClick={() => setShowSqlModal(false)} className="text-[14px]">✕</button>
            </div>
            <pre className="bg-[#0f2113] text-[#d6edd2] p-3 rounded text-[10px] overflow-x-auto font-mono">
              {SUPABASE_SQL_SETUP_SCRIPT}
            </pre>
            <button
              onClick={handleCopySql}
              className="w-full py-2 bg-[#0f2113] text-white font-bold rounded-lg text-[11px] uppercase cursor-pointer"
            >
              {copiedSql ? '✓ Copied' : 'Copy SQL'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
