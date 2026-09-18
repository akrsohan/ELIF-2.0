import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  Ruler,
  Search,
  Check,
  X,
  User,
  ShieldCheck,
  PlusCircle,
  Loader2,
  Copy,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
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

export const AccountPage: React.FC = () => {
  const { id: orderIdParam, section: sectionParam } = useParams<{ id?: string; section?: string }>();
  const navigate = useNavigate();
  const { language, t, formatPrice, formatNumber } = useLanguage();
  const { showToast } = useStore();

  // Active section: 'orders' | 'appointments' | 'tailoring'
  const activeSection = sectionParam || (orderIdParam ? 'orders' : 'orders');

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
  const [trackingQuery, setTrackingQuery] = useState(orderIdParam || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    orders: SavedOrder[];
    foundIn: 'supabase' | 'local' | 'none';
  } | null>(null);

  // Appointments State - starts empty (no mock data)
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

  // Tailoring Profile State - starts clean or loaded from real stored profile
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

  // Load initial data
  useEffect(() => {
    checkSupabaseConnection().then((res) => {
      setDbStatus(res);
    });

    setIsLoadingOrders(true);
    fetchClientOrders()
      .then((data) => {
        setOrders(data);
      })
      .finally(() => {
        setIsLoadingOrders(false);
      });

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

  // Auto-search if URL has orderIdParam
  useEffect(() => {
    if (orderIdParam) {
      setTrackingQuery(orderIdParam);
      setIsSearching(true);
      trackOrderByQuery(orderIdParam)
        .then((res) => {
          setSearchResults(res);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }
  }, [orderIdParam]);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await trackOrderByQuery(trackingQuery);
      setSearchResults(res);
      if (res.orders.length === 0) {
        showToast(
          language === 'bn'
            ? 'এই অর্ডার নম্বর বা ফোন দিয়ে কোনো রেকর্ড পাওয়া যায়নি।'
            : 'No consignment found with this order ID or phone.'
        );
      } else {
        showToast(
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

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.clientName.trim() || !bookingForm.phone.trim() || !bookingForm.date.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে সকল তথ্য পূরণ করুন।' : 'Please fill all appointment fields.');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const res = await bookFittingAppointment(bookingForm);
      const newAppt: AppointmentPayload = {
        clientName: bookingForm.clientName,
        phone: bookingForm.phone,
        sessionType: bookingForm.sessionType,
        date: bookingForm.date,
        time: bookingForm.time || '15:00',
        location: bookingForm.location,
      };
      setAppointments((prev) => [newAppt, ...prev]);
      setShowBookingModal(false);
      showToast(
        language === 'bn'
          ? 'ফিটিং অ্যাপয়েন্টমেন্ট সফলভাবে বুক করা হয়েছে!'
          : res.message || 'Private salon fitting appointment booked!'
      );
    } catch (err) {
      console.error(err);
      showToast(language === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুকিং সম্পন্ন হয়েছে।' : 'Appointment recorded.');
      setShowBookingModal(false);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleSaveMeasurements = async () => {
    setIsSavingMeasurements(true);
    try {
      await saveTailoringProfile(tailoringProfile);
      setIsEditingMeasurements(false);
      showToast(
        language === 'bn'
          ? 'আপনার টেইলরিং ও মাপের প্রোফাইল সংরক্ষিত হয়েছে।'
          : 'Bespoke tailoring measurements saved.'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingMeasurements(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    showToast(language === 'bn' ? 'SQL স্ক্রিপ্ট কপি হয়েছে!' : 'SQL setup script copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const clientDisplayName = tailoringProfile.clientName || (orders[0]?.customer_name) || '';
  const clientDisplayPhone = tailoringProfile.clientPhone || (orders[0]?.phone) || '';

  return (
    <div className="w-full pb-20 selection:bg-[#d6edd2] selection:text-[#18281b]">
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
          {language === 'bn' ? 'গ্রাহক অ্যাকাউন্ট ও ট্র্যাকিং' : 'Client Suite & Tracking'}
        </span>
      </nav>

      {/* 2. PROFILE HERO HEADER */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#edf6eb] via-[#e5f2e3] to-[#dcf0dc] border border-[#bedec0] mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0f2113] text-white flex items-center justify-center font-display text-[22px] font-black shadow-sm">
            {clientDisplayName ? clientDisplayName.slice(0, 2).toUpperCase() : <User className="w-7 h-7 text-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-[22px] sm:text-[26px] text-[#0f2113]">
                {clientDisplayName || (language === 'bn' ? 'গ্রাহক পোর্টাল' : 'Client Suite')}
              </h1>
              <span className="bg-[#0f2113] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                {language === 'bn' ? 'অঁতেলিয়ে অ্যাকাউন্ট' : 'Atelier Member'}
              </span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#2b4c30] font-bold">
              {clientDisplayPhone ? `${clientDisplayPhone} • ` : ''}
              {language === 'bn' ? 'গুলশান ও বনানী প্রাইভেট স্যালন' : 'Dhaka Atelier & Concierge'}
            </p>
          </div>
        </div>

        {/* Supabase connection badge */}
        <div className="flex items-center gap-2 bg-white/90 px-3.5 py-2 rounded-2xl border border-[#bedec0] shadow-2xs self-start md:self-auto">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              dbStatus.connected ? 'bg-[#2e7d32] animate-pulse' : 'bg-[#e65100]'
            }`}
          />
          <div className="text-[11px]">
            <span className="font-black text-[#0f2113] block">
              {dbStatus.connected ? 'Supabase Database Connected' : 'Supabase (Local Cache Active)'}
            </span>
            <button
              onClick={() => setShowSqlModal(true)}
              className="text-[10px] text-[#1b5e28] underline font-bold cursor-pointer"
            >
              {language === 'bn' ? 'SQL সেটআপ স্ক্রিপ্ট দেখুন' : 'View SQL Setup Script'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-[#bedec0]">
        <button
          type="button"
          onClick={() => navigate('/account/orders')}
          className={`px-4 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'orders'
              ? 'bg-[#0f2113] text-white shadow-xs'
              : 'bg-[#edf6eb] text-[#1b3821] hover:bg-[#dcf0dc]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{language === 'bn' ? 'অর্ডার ও ট্র্যাকিং' : 'Orders & Consignments'}</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/account/appointments')}
          className={`px-4 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'appointments'
              ? 'bg-[#0f2113] text-white shadow-xs'
              : 'bg-[#edf6eb] text-[#1b3821] hover:bg-[#dcf0dc]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{language === 'bn' ? 'স্যালন ফিটিং' : 'Private Salon Fittings'}</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/account/tailoring')}
          className={`px-4 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'tailoring'
              ? 'bg-[#0f2113] text-white shadow-xs'
              : 'bg-[#edf6eb] text-[#1b3821] hover:bg-[#dcf0dc]'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>{language === 'bn' ? 'টেইলরিং প্রোফাইল' : 'Bespoke Measurements'}</span>
        </button>
      </div>

      {/* 4. ORDERS & TRACKING SECTION */}
      {activeSection === 'orders' && (
        <div className="flex flex-col gap-6">
          {/* Tracking Search Input */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#bedec0]">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b5e28] block mb-1">
              {language === 'bn' ? 'লাইভ পার্সেল ট্র্যাকিং' : 'Live Parcel Timeline'}
            </span>
            <h2 className="font-display font-black text-[18px] sm:text-[22px] text-[#0f2113] mb-3">
              {language === 'bn' ? 'আপনার অর্ডারের অবস্থান জানুন' : 'Track Consignment Status'}
            </h2>

            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                placeholder={language === 'bn' ? 'অর্ডার নম্বর (যেমন: EL-BD7421) বা মোবাইল নম্বর' : 'Enter Order ID (e.g. EL-BD7421) or phone number'}
                className="flex-1 px-4 py-3 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-2xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-[#1b5e28]"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider rounded-2xl hover:bg-[#1b5e28] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-75"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>{language === 'bn' ? 'ট্র্যাক করুন' : 'Track Order'}</span>
              </button>
            </form>
          </div>

          {/* Search Result Display */}
          {searchResults && searchResults.orders.length > 0 && (
            <div className="bg-[#edf6eb] rounded-3xl p-5 sm:p-6 border-2 border-[#1b5e28] shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#bedec0] pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1b5e28]">
                    {language === 'bn' ? 'অনুসন্ধানের ফলাফল' : 'Tracking Result'}
                  </span>
                  <h3 className="font-display font-black text-[18px] text-[#0f2113]">
                    {language === 'bn' ? 'অর্ডার ট্র্যাকিং রেকর্ড' : 'Consignment Live Record'}
                  </h3>
                </div>
                <span className="bg-[#1b5e28] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {searchResults.foundIn === 'supabase' ? 'Supabase Live' : 'Atelier Registry'}
                </span>
              </div>

              {searchResults.orders.map((ord) => (
                <div key={ord.id || ord.order_number} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#bedec0] flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-black text-[16px] text-[#0f2113]">#{ord.order_number}</span>
                      <span className="text-[12px] text-[#335639] ml-2">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-[#d6edd2] text-[#113817] border border-[#bedec0]">
                      {ord.order_status || 'In Transit'}
                    </span>
                  </div>

                  <p className="text-[12.5px] text-[#2c4e31]">
                    <strong>{language === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {ord.delivery_address}
                  </p>

                  <div className="flex justify-between text-[13px] font-bold text-[#0f2113] pt-2 border-t border-[#edf4ea]">
                    <span>{language === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'} {ord.payment_method?.toUpperCase()}</span>
                    <span>{formatPrice(ord.total_amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Saved Orders List */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#bedec0] flex flex-col gap-4">
            <h2 className="font-display font-black text-[18px] text-[#0f2113] pb-3 border-b border-[#edf4ea]">
              {language === 'bn' ? 'সাম্প্রতিক অর্ডারের তালিকা' : 'Recent Acquisitions'} ({formatNumber(orders.length)})
            </h2>

            {isLoadingOrders ? (
              <div className="py-8 text-center text-[#35573a]">
                <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2 text-[#1b5e28]" />
                <p className="text-[12px]">{language === 'bn' ? 'অর্ডার ডাটা লোড হচ্ছে...' : 'Loading order history...'}</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id || ord.order_number}
                    className="p-4 rounded-2xl bg-[#edf6eb] border border-[#bedeb8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[14px] text-[#0f2113]">#{ord.order_number}</span>
                        <span className="text-[10.5px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-[#bedeb8] text-[#1b5e28]">
                          {ord.order_status || 'Dispatched'}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#2c4e31] mt-0.5">
                        {ord.items ? `${ord.items.length} pieces` : 'Garments'} • {formatPrice(ord.total_amount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/account/orders/${ord.order_number}`}
                        className="px-3.5 py-1.5 bg-[#0f2113] text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:bg-[#1b5e28] transition-colors"
                      >
                        {language === 'bn' ? 'ট্র্যাক' : 'Track'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-[#3a583e] bg-[#edf6eb] rounded-2xl border border-[#bedeb8]">
                <p className="text-[13px] font-medium">
                  {language === 'bn' ? 'বর্তমানে কোনো পূর্বের অর্ডার সংরক্ষিত নেই।' : 'No orders recorded in this session yet.'}
                </p>
                <Link
                  to="/shop"
                  className="mt-3 inline-block px-4 py-2 bg-[#0f2113] text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:bg-[#1b5e28]"
                >
                  {language === 'bn' ? 'কালেকশন দেখুন' : 'Explore Catalog'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. APPOINTMENTS SECTION */}
      {activeSection === 'appointments' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#bedec0] flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#edf4ea]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b5e28] block">
                {language === 'bn' ? 'বনানী ও গুলশান অঁতেলিয়ে' : 'Banani & Gulshan Atelier'}
              </span>
              <h2 className="font-display font-black text-[20px] text-[#0f2113]">
                {language === 'bn' ? 'প্রাইভেট স্যালন ফিটিং শিডিউল' : 'Private Salon Fitting Schedule'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowBookingModal(true)}
              className="h-10 px-4 rounded-xl bg-[#0f2113] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1b5e28] transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন অ্যাপয়েন্টমেন্ট' : 'Book Fitting'}</span>
            </button>
          </div>

          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#edf6eb] border border-[#bedeb8] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-black text-[#0f2113]">{apt.sessionType}</span>
                    <span className="text-[10px] font-black uppercase bg-[#d6edd2] text-[#15381a] px-2 py-0.5 rounded-md border border-[#bedec0]">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-[12px] text-[#2c4e31]">
                    <strong>{language === 'bn' ? 'তারিখ ও সময়:' : 'Date & Time:'}</strong> {apt.date} at {apt.time}
                  </p>
                  <p className="text-[12px] text-[#2c4e31]">
                    <strong>{language === 'bn' ? 'লোকেশন:' : 'Location:'}</strong> {apt.location}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-[#edf6eb] rounded-2xl border border-[#bedeb8]">
              <Calendar className="w-8 h-8 text-[#1b5e28] mx-auto mb-2 opacity-70" />
              <p className="text-[13px] text-[#2c4e31] font-medium">
                {language === 'bn' ? 'বর্তমানে কোনো নির্ধারিত অ্যাপয়েন্টমেন্ট নেই।' : 'No private salon fitting appointments scheduled yet.'}
              </p>
              <button
                type="button"
                onClick={() => setShowBookingModal(true)}
                className="mt-3 px-4 py-2 bg-[#0f2113] text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:bg-[#1b5e28]"
              >
                {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুক করুন' : 'Schedule Appointment'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. BESPOKE TAILORING SECTION */}
      {activeSection === 'tailoring' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#bedec0] flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf4ea]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b5e28] block">
                {language === 'bn' ? 'ব্যক্তিগত কাট ও প্যাটার্ন' : 'Bespoke Silhouette Silhouette'}
              </span>
              <h2 className="font-display font-black text-[20px] text-[#0f2113]">
                {language === 'bn' ? 'টেইলরিং ও পরিমাপ প্রোফাইল' : 'Tailoring & Measurements Profile'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingMeasurements(!isEditingMeasurements)}
              className="text-[11.5px] font-bold text-[#1b5e28] underline hover:text-[#0f2113] cursor-pointer"
            >
              {isEditingMeasurements
                ? language === 'bn' ? 'বাতিল' : 'Cancel'
                : language === 'bn' ? 'সম্পাদনা করুন' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
              </label>
              <input
                type="text"
                disabled={!isEditingMeasurements}
                value={tailoringProfile.clientName}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, clientName: e.target.value })}
                placeholder={language === 'bn' ? 'আপনার নাম' : 'Your Name'}
                className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] font-bold disabled:opacity-80"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
              </label>
              <input
                type="text"
                disabled={!isEditingMeasurements}
                value={tailoringProfile.clientPhone}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, clientPhone: e.target.value })}
                placeholder="017XX-XXXXXX"
                className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] font-bold disabled:opacity-80"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                {language === 'bn' ? 'ট্রেনচ ও ওভারকোট সাইজ' : 'Trench & Coat Cut'}
              </label>
              <input
                type="text"
                disabled={!isEditingMeasurements}
                value={tailoringProfile.trenchSize}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, trenchSize: e.target.value })}
                placeholder="e.g. 38 FR (Sloped Shoulder Cut)"
                className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] font-bold disabled:opacity-80"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                {language === 'bn' ? 'নিটওয়্যার সাইজ' : 'Knitwear Proportion'}
              </label>
              <input
                type="text"
                disabled={!isEditingMeasurements}
                value={tailoringProfile.knitwearSize}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, knitwearSize: e.target.value })}
                placeholder="e.g. S (Relaxed Drape)"
                className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] font-bold disabled:opacity-80"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                {language === 'bn' ? 'ট্রাউজার ইনসিম ও লেংথ' : 'Trouser Inseam'}
              </label>
              <input
                type="text"
                disabled={!isEditingMeasurements}
                value={tailoringProfile.trouserInseam}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, trouserInseam: e.target.value })}
                placeholder="e.g. 84 cm (Floor Grazing)"
                className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] font-bold disabled:opacity-80"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                {language === 'bn' ? 'ফেব্রিক পছন্দ ও বিশেষ নির্দেশনা' : 'Fabric Preferences & Notes'}
              </label>
              <input
                type="text"
                disabled={!isEditingMeasurements}
                value={tailoringProfile.notes}
                onChange={(e) => setTailoringProfile({ ...tailoringProfile, notes: e.target.value })}
                placeholder="e.g. Silk and linen only"
                className="w-full px-3.5 py-2.5 bg-[#edf6eb] text-[#0f2113] border border-[#bedeb8] rounded-xl text-[13px] font-bold disabled:opacity-80"
              />
            </div>
          </div>

          {isEditingMeasurements && (
            <button
              type="button"
              disabled={isSavingMeasurements}
              onClick={handleSaveMeasurements}
              className="mt-2 py-3 px-6 bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider rounded-xl hover:bg-[#1b5e28] transition-colors cursor-pointer self-start shadow-xs"
            >
              {language === 'bn' ? 'পরিমাপ সংরক্ষণ করুন' : 'Save Measurements'}
            </button>
          )}
        </div>
      )}

      {/* 7. BOOK APPOINTMENT MODAL */}
      {showBookingModal && (
        <div
          onClick={() => setShowBookingModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#faf7eb] rounded-3xl p-6 shadow-2xl border border-[#bedec0] flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-b border-[#bedec0] pb-3">
              <h3 className="font-display font-black text-[18px] text-[#0f2113]">
                {language === 'bn' ? 'প্রাইভেট ফিটিং বুকিং' : 'Book Fitting Session'}
              </h3>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="w-8 h-8 rounded-full bg-[#edf6eb] flex items-center justify-center text-[#0f2113] hover:bg-[#dcefe0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-3">
              <div>
                <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.clientName}
                  onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 bg-[#edf6eb] border border-[#bedeb8] rounded-xl text-[12px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  placeholder="017XX-XXXXXX"
                  className="w-full px-3 py-2 bg-[#edf6eb] border border-[#bedeb8] rounded-xl text-[12px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'সেশনের ধরন' : 'Session Type'}
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.sessionType}
                  onChange={(e) => setBookingForm({ ...bookingForm, sessionType: e.target.value })}
                  className="w-full px-3 py-2 bg-[#edf6eb] border border-[#bedeb8] rounded-xl text-[12px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                    {language === 'bn' ? 'তারিখ *' : 'Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#edf6eb] border border-[#bedeb8] rounded-xl text-[12px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                    {language === 'bn' ? 'সময়' : 'Time'}
                  </label>
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-[#edf6eb] border border-[#bedeb8] rounded-xl text-[12px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-[#0f2113] block mb-1">
                  {language === 'bn' ? 'লোকেশন' : 'Location'}
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.location}
                  onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-[#edf6eb] border border-[#bedeb8] rounded-xl text-[12px]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingBooking}
                className="w-full py-3 bg-[#0f2113] text-white font-black text-[12px] uppercase tracking-wider rounded-xl hover:bg-[#1b5e28] transition-colors cursor-pointer mt-2"
              >
                {language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. SQL SETUP MODAL */}
      {showSqlModal && (
        <div
          onClick={() => setShowSqlModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#faf7eb] rounded-3xl p-6 shadow-2xl border border-[#bedec0] flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between border-b border-[#bedec0] pb-3">
              <div>
                <h3 className="font-display font-black text-[18px] text-[#0f2113]">
                  Supabase SQL Database Setup Script
                </h3>
                <p className="text-[11px] text-[#335639]">
                  Run this in your Supabase SQL Editor to configure tables with RLS
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="w-8 h-8 rounded-full bg-[#edf6eb] flex items-center justify-center text-[#0f2113]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="bg-[#0f2113] text-[#d6edd2] p-4 rounded-2xl text-[11px] overflow-x-auto font-mono max-h-60">
              {SUPABASE_SQL_SETUP_SCRIPT}
            </pre>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopySql}
                className="flex-1 py-2.5 bg-[#0f2113] text-white font-black text-[11px] uppercase tracking-wider rounded-xl hover:bg-[#1b5e28] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied SQL' : 'Copy SQL Script'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-5 py-2.5 bg-[#edf6eb] text-[#0f2113] font-bold text-[11px] rounded-xl hover:bg-[#dcefe0] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
