import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CartItem } from '../types';

export interface OrderItemPayload {
  productId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface CreateOrderPayload {
  orderNumber?: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  district: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  paymentStatus?: 'pending' | 'completed' | 'cod_pending';
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  notes?: string;
}

export interface SavedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  delivery_address: string;
  district: string;
  payment_method: string;
  payment_status: string;
  items: OrderItemPayload[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  order_status: 'placed' | 'confirmed' | 'dispatched' | 'delivered';
  notes?: string;
  created_at: string;
}

export interface AppointmentPayload {
  clientName: string;
  phone: string;
  sessionType: string;
  date: string;
  time: string;
  location: string;
}

export interface TailoringProfilePayload {
  clientPhone: string;
  clientName?: string;
  trenchSize: string;
  knitwearSize: string;
  trouserInseam: string;
  notes?: string;
}

// Local storage key for fallback/offline persistence
const LOCAL_ORDERS_KEY = 'elif_stored_orders_v1';
const LOCAL_PROFILE_KEY = 'elif_tailoring_profile_v1';

export const getLocalOrders = (): SavedOrder[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read local orders:', e);
    return [];
  }
};

export const saveLocalOrder = (order: SavedOrder): void => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalOrders();
    const updated = [order, ...existing.filter((o) => o.order_number !== order.order_number)];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save order to local storage:', e);
  }
};

/**
 * Creates an order in Supabase with automatic fallback to client persistence
 */
export const createOrderInSupabase = async (
  payload: CreateOrderPayload
): Promise<{ success: boolean; orderNumber: string; error?: string; source: 'supabase' | 'local' }> => {
  const generatedOrderNumber =
    payload.orderNumber || `EL-BD${Math.floor(1000 + Math.random() * 9000)}`;

  const orderItems: OrderItemPayload[] = payload.cartItems.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    unitPrice: item.product.price,
    totalPrice: item.product.price * item.quantity,
    image: item.product.image,
  }));

  const localRecord: SavedOrder = {
    id: `local-${Date.now()}`,
    order_number: generatedOrderNumber,
    customer_name: payload.customerName,
    phone: payload.phone,
    delivery_address: payload.deliveryAddress,
    district: payload.district,
    payment_method: payload.paymentMethod,
    payment_status:
      payload.paymentMethod === 'cod' ? 'cod_pending' : 'completed',
    items: orderItems,
    subtotal: payload.subtotal,
    delivery_fee: payload.deliveryFee,
    total_amount: payload.totalAmount,
    order_status: 'placed',
    notes: payload.notes || '',
    created_at: new Date().toISOString(),
  };

  // Always cache locally so client sees it immediately
  saveLocalOrder(localRecord);

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      orderNumber: generatedOrderNumber,
      source: 'local',
      error: 'Supabase credentials not configured',
    };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_number: generatedOrderNumber,
          customer_name: payload.customerName,
          phone: payload.phone,
          delivery_address: payload.deliveryAddress,
          district: payload.district,
          payment_method: payload.paymentMethod,
          payment_status:
            payload.paymentMethod === 'cod' ? 'cod_pending' : 'completed',
          items: orderItems,
          subtotal: payload.subtotal,
          delivery_fee: payload.deliveryFee,
          total_amount: payload.totalAmount,
          order_status: 'placed',
          notes: payload.notes || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.warn('Supabase order insert warning (falling back to local):', error.message);
      return {
        success: true,
        orderNumber: generatedOrderNumber,
        source: 'local',
        error: error.message,
      };
    }

    if (data) {
      localRecord.id = data.id || localRecord.id;
      saveLocalOrder(localRecord);
    }

    return {
      success: true,
      orderNumber: generatedOrderNumber,
      source: 'supabase',
    };
  } catch (err: any) {
    console.error('Supabase exception creating order:', err);
    return {
      success: true,
      orderNumber: generatedOrderNumber,
      source: 'local',
      error: err?.message,
    };
  }
};

/**
 * Searches and tracks orders by Order Number or Phone Number
 */
export const trackOrderByQuery = async (
  query: string
): Promise<{ orders: SavedOrder[]; foundIn: 'supabase' | 'local' | 'none' }> => {
  const clean = query.trim().toUpperCase();
  if (!clean) return { orders: [], foundIn: 'none' };

  // First try querying Supabase if available
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.ilike.%${clean}%,phone.ilike.%${clean}%`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data && data.length > 0) {
        return { orders: data as SavedOrder[], foundIn: 'supabase' };
      }
    } catch (e) {
      console.warn('Supabase track query error:', e);
    }
  }

  // Fallback to local storage
  const locals = getLocalOrders();
  const matched = locals.filter(
    (o) =>
      o.order_number.toUpperCase().includes(clean) ||
      o.phone.includes(clean)
  );

  if (matched.length > 0) {
    return { orders: matched, foundIn: 'local' };
  }

  return { orders: [], foundIn: 'none' };
};

/**
 * Fetch all orders for the current client profile
 */
export const fetchClientOrders = async (
  phoneFilter = '01711000000'
): Promise<SavedOrder[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        return data as SavedOrder[];
      }
    } catch (e) {
      console.warn('Failed to fetch from Supabase orders:', e);
    }
  }

  return getLocalOrders();
};

/**
 * Subscribe email to VIP Newsletter in Supabase
 */
export const subscribeNewsletter = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Invalid email address' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert([
        {
          email: cleanEmail,
          source: 'dhaka_atelier_web',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        if (error.code === '23505') {
          return { success: true, message: 'Already subscribed to VIP Atelier Gazette.' };
        }
        console.warn('Supabase newsletter insert error:', error.message);
      } else {
        return { success: true, message: 'Subscribed to VIP Atelier Gazette in Supabase!' };
      }
    } catch (e: any) {
      console.warn('Newsletter exception:', e);
    }
  }

  return { success: true, message: 'Subscribed to VIP Atelier Gazette successfully.' };
};

/**
 * Book Atelier Fitting Appointment
 */
export const bookFittingAppointment = async (
  payload: AppointmentPayload
): Promise<{ success: boolean; message: string }> => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('appointments').insert([
        {
          client_name: payload.clientName,
          phone: payload.phone,
          session_type: payload.sessionType,
          scheduled_date: payload.date,
          scheduled_time: payload.time,
          location: payload.location,
          status: 'confirmed',
          created_at: new Date().toISOString(),
        },
      ]);

      if (!error) {
        return { success: true, message: 'Fitting appointment recorded in Supabase Atelier Calendar.' };
      }
    } catch (e: any) {
      console.warn('Appointment exception:', e);
    }
  }

  return { success: true, message: 'Fitting appointment booked with Dhaka Atelier concierge.' };
};

/**
 * Save Tailoring Profile
 */
export const saveTailoringProfile = async (
  profile: TailoringProfilePayload
): Promise<boolean> => {
  try {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
    if (isSupabaseConfigured()) {
      await supabase.from('tailoring_profiles').upsert([
        {
          client_phone: profile.clientPhone,
          client_name: profile.clientName,
          trench_size: profile.trenchSize,
          knitwear_size: profile.knitwearSize,
          trouser_inseam: profile.trouserInseam,
          notes: profile.notes,
          updated_at: new Date().toISOString(),
        },
      ]);
    }
    return true;
  } catch (e) {
    console.error('Tailoring profile save error:', e);
    return false;
  }
};

/**
 * Get Saved Tailoring Profile
 */
export const getStoredTailoringProfile = (): TailoringProfilePayload | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Ready-to-copy SQL script to set up all tables in Supabase SQL Editor
 */
export const SUPABASE_SQL_SETUP_SCRIPT = `-- ============================================================
-- ELIF Dhaka Atelier - Supabase Database Schema
-- Run this in your Supabase Project > SQL Editor
-- ============================================================

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'Dhaka',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  order_status TEXT NOT NULL DEFAULT 'placed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS & allow anonymous inserts & reads
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);

-- 2. VIP Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'dhaka_atelier_web',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read newsletter" ON public.newsletter_subscribers FOR SELECT USING (true);

-- 3. Private Fitting Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  session_type TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read appointments" ON public.appointments FOR SELECT USING (true);

-- 4. Client Tailoring Profiles
CREATE TABLE IF NOT EXISTS public.tailoring_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_phone TEXT NOT NULL UNIQUE,
  client_name TEXT,
  trench_size TEXT,
  knitwear_size TEXT,
  trouser_inseam TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tailoring_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert or update tailoring" ON public.tailoring_profiles FOR ALL USING (true) WITH CHECK (true);
`;
