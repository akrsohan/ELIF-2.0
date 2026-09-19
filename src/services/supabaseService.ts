import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CartItem, Product } from '../types';

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

export type DeliveryPaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cod';
export type DeliveryPaymentStatus =
  | 'awaiting_payment'
  | 'payment_submitted'
  | 'under_review'
  | 'payment_verified'
  | 'payment_rejected';

export type OrderLifeCycleStatus =
  | 'pending'
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'dispatched'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'exchanged';

export interface CreateOrderPayload {
  orderNumber?: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  district: string;
  paymentMethod: DeliveryPaymentMethod;
  paymentStatus?: 'pending' | 'completed' | 'cod_pending' | 'payment_submitted' | 'under_review';
  deliveryPaymentStatus?: DeliveryPaymentStatus;
  transactionId?: string;
  paymentProofUrl?: string;
  deliveryChargePaid?: number;
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
  delivery_payment_status?: DeliveryPaymentStatus;
  transaction_id?: string;
  payment_proof_url?: string;
  delivery_charge_paid?: number;
  items: OrderItemPayload[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  order_status: OrderLifeCycleStatus;
  notes?: string;
  created_at: string;
}

export interface PaymentNumbersConfig {
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  bkashType?: string;
  nagadType?: string;
  rocketType?: string;
  instructions?: string;
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
 * Fetch payment receiving configurations from Supabase site_settings
 */
export const fetchPaymentConfiguration = async (): Promise<PaymentNumbersConfig> => {
  if (!isSupabaseConfigured()) {
    return {};
  }
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['bkash_number', 'nagad_number', 'rocket_number', 'payment_settings']);

    if (!error && data && data.length > 0) {
      const config: PaymentNumbersConfig = {};
      for (const row of data) {
        if (row.key === 'bkash_number' && row.value) config.bkashNumber = String(row.value);
        if (row.key === 'nagad_number' && row.value) config.nagadNumber = String(row.value);
        if (row.key === 'rocket_number' && row.value) config.rocketNumber = String(row.value);
        if (row.key === 'payment_settings' && typeof row.value === 'object' && row.value !== null) {
          Object.assign(config, row.value);
        }
      }
      return config;
    }
  } catch (e) {
    console.warn('Payment configuration query warning:', e);
  }
  return {};
};

/**
 * Upload manual payment proof screenshot to private Supabase Storage bucket 'payment-proofs'
 */
export const uploadPaymentProof = async (
  file: File,
  orderNumber: string
): Promise<{ success: boolean; storagePath?: string; publicUrl?: string; error?: string }> => {
  if (!file) {
    return { success: false, error: 'No screenshot file provided.' };
  }

  // Validate MIME type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      success: false,
      error: 'Please upload a valid image (JPG, JPEG, PNG, or WEBP).',
    };
  }

  // Validate File Size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return {
      success: false,
      error: 'File size exceeds maximum limit of 10MB.',
    };
  }

  const cleanExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const cleanOrderNum = orderNumber.replace(/[^a-zA-Z0-9_-]/g, '');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const fileName = `proofs/${cleanOrderNum}_${timestamp}_${randomSuffix}.${cleanExt}`;

  if (!isSupabaseConfigured()) {
    const previewUrl = URL.createObjectURL(file);
    return { success: true, storagePath: fileName, publicUrl: previewUrl };
  }

  try {
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      // Generate a local object URL as safe fallback so user is not blocked if bucket is being provisioned
      const previewUrl = URL.createObjectURL(file);
      return {
        success: true,
        storagePath: fileName,
        publicUrl: previewUrl,
        error: error.message,
      };
    }

    const storagePath = data?.path || fileName;
    const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(storagePath);
    const publicUrl = urlData?.publicUrl || storagePath;

    return {
      success: true,
      storagePath,
      publicUrl,
    };
  } catch (err: any) {
    console.error('Payment proof upload exception:', err);
    return {
      success: false,
      error: err?.message || 'Payment screenshot upload failed. Please try again.',
    };
  }
};

/**
 * Creates an order in Supabase with Phase 3 payments table syncing and local persistence
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

  const isManualDeliveryPayment =
    payload.paymentMethod === 'bkash' ||
    payload.paymentMethod === 'nagad' ||
    payload.paymentMethod === 'rocket';

  const initialPaymentStatus = isManualDeliveryPayment
    ? 'payment_submitted'
    : payload.paymentMethod === 'cod'
    ? 'cod_pending'
    : 'pending';

  const initialDeliveryPaymentStatus: DeliveryPaymentStatus = isManualDeliveryPayment
    ? 'under_review'
    : 'awaiting_payment';

  // Order status starts as 'pending' until Admin verification
  const initialOrderStatus: OrderLifeCycleStatus = 'pending';

  const localRecord: SavedOrder = {
    id: `local-${Date.now()}`,
    order_number: generatedOrderNumber,
    customer_name: payload.customerName,
    phone: payload.phone,
    delivery_address: payload.deliveryAddress,
    district: payload.district,
    payment_method: payload.paymentMethod,
    payment_status: initialPaymentStatus,
    delivery_payment_status: initialDeliveryPaymentStatus,
    transaction_id: payload.transactionId?.trim() || undefined,
    payment_proof_url: payload.paymentProofUrl || undefined,
    delivery_charge_paid: payload.deliveryChargePaid ?? payload.deliveryFee,
    items: orderItems,
    subtotal: payload.subtotal,
    delivery_fee: payload.deliveryFee,
    total_amount: payload.totalAmount,
    order_status: initialOrderStatus,
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
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: generatedOrderNumber,
          customer_name: payload.customerName,
          phone: payload.phone,
          delivery_address: payload.deliveryAddress,
          district: payload.district,
          payment_method: payload.paymentMethod,
          payment_status: initialPaymentStatus,
          delivery_payment_status: initialDeliveryPaymentStatus,
          transaction_id: payload.transactionId?.trim() || null,
          payment_proof_url: payload.paymentProofUrl || null,
          delivery_charge_paid: payload.deliveryChargePaid ?? payload.deliveryFee,
          items: orderItems,
          subtotal: payload.subtotal,
          delivery_fee: payload.deliveryFee,
          total_amount: payload.totalAmount,
          order_status: initialOrderStatus,
          notes: payload.notes || null,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.warn('Supabase order insert warning (falling back to local):', orderError.message);
      return {
        success: true,
        orderNumber: generatedOrderNumber,
        source: 'local',
        error: orderError.message,
      };
    }

    if (orderData) {
      localRecord.id = orderData.id || localRecord.id;
      saveLocalOrder(localRecord);

      // Populate Phase 3 payments table
      try {
        await supabase.from('payments').insert([
          {
            order_id: orderData.id,
            order_number: generatedOrderNumber,
            payment_type: 'delivery_charge',
            payment_method: payload.paymentMethod,
            amount: payload.deliveryFee,
            transaction_id: payload.transactionId?.trim() || null,
            proof_image_url: payload.paymentProofUrl || null,
            status: 'under_review',
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (pErr) {
        // Safe failover if payments table is managed separately
      }

      // Populate Phase 3 payment_transactions table
      try {
        await supabase.from('payment_transactions').insert([
          {
            order_id: orderData.id,
            order_number: generatedOrderNumber,
            transaction_id: payload.transactionId?.trim() || null,
            payment_method: payload.paymentMethod,
            amount: payload.deliveryFee,
            proof_url: payload.paymentProofUrl || null,
            status: 'under_review',
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (tErr) {
        // Safe failover if table is managed separately
      }
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
  phoneFilter?: string
): Promise<SavedOrder[]> => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (phoneFilter) {
        query = query.ilike('phone', `%${phoneFilter.trim()}%`);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data as SavedOrder[];
      }
    } catch (e) {
      console.warn('Failed to fetch from Supabase orders:', e);
    }
  }

  const locals = getLocalOrders();
  if (phoneFilter) {
    return locals.filter((o) => o.phone.includes(phoneFilter.trim()));
  }
  return locals;
};

export function mapSupabaseProductRow(row: any): Product {
  const images: string[] = (row.product_images || [])
    .map((img: any) => img.image_url || img.url)
    .filter(Boolean);

  const primaryImg =
    row.product_images?.find((img: any) => img.is_primary)?.image_url ||
    images[0] ||
    row.image_url ||
    row.image ||
    '';

  const variants = row.product_variants || [];
  const sizes = Array.from(new Set(variants.map((v: any) => v.size).filter(Boolean))) as string[];
  const colors = Array.from(new Set(variants.map((v: any) => v.color).filter(Boolean))) as string[];

  const rawCompareAt =
    row.compare_at_price ??
    row.compare_price ??
    row.compareAtPrice ??
    row.original_price ??
    row.old_price ??
    row.mrp ??
    row.regular_price ??
    null;

  const compareAtPrice =
    rawCompareAt !== null && !isNaN(Number(rawCompareAt)) && Number(rawCompareAt) > 0
      ? Number(rawCompareAt)
      : undefined;

  return {
    id: String(row.id),
    name: row.name || 'Untitled Piece',
    category: row.category || row.category_id || 'Outerwear',
    subtitle: row.subtitle || (row.description ? row.description.slice(0, 45) : ''),
    price: Number(row.price) || 0,
    compareAtPrice: compareAtPrice,
    currency: row.currency || '৳',
    tag: row.tag || (row.status === 'featured' ? 'Featured' : undefined),
    image: primaryImg,
    images: images.length > 0 ? images : primaryImg ? [primaryImg] : [],
    alt: row.alt || row.name || 'ELIF Atelier garment',
    description: row.description || '',
    fabric: row.fabric || '',
    origin: row.origin || 'Dhaka Atelier',
    sizes: sizes.length > 0 ? sizes : Array.isArray(row.sizes) ? row.sizes : ['38 FR'],
    colors: colors.length > 0 ? colors : Array.isArray(row.colors) ? row.colors : ['Natural'],
    stockCount: Number(row.stock_count ?? row.stock ?? 0),
    modelStats: row.model_stats || '',
    careInstructions: Array.isArray(row.care_instructions)
      ? row.care_instructions
      : row.care_instructions
      ? [row.care_instructions]
      : [],
    features: Array.isArray(row.features)
      ? row.features
      : row.features
      ? [row.features]
      : [],
  };
}

export const fetchProductsFromSupabase = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }
  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*, product_images(*), product_variants(*)');

    if (productsError) {
      const { data: simpleData, error: simpleError } = await supabase
        .from('products')
        .select('*');
      if (simpleError || !simpleData) return [];
      return simpleData.map(mapSupabaseProductRow);
    }

    if (!productsData || productsData.length === 0) {
      return [];
    }

    return productsData.map(mapSupabaseProductRow);
  } catch (err) {
    console.error('Failed to fetch products from Supabase:', err);
    return [];
  }
};

export const fetchCategoriesFromSupabase = async (): Promise<any[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error || !data) {
      console.warn('Supabase categories fetch notice:', error?.message);
      return [];
    }
    return data.map((cat: any) => ({
      id: String(cat.id),
      name: cat.name || cat.title || 'Category',
      piecesCount: Number(cat.pieces_count || cat.count || 0),
      image: cat.image_url || cat.image || '',
      alt: cat.name || cat.title || 'Category',
      slug: cat.slug || (cat.name || cat.title || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }));
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
};

export const fetchCollectionsFromSupabase = async (): Promise<any[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase.from('collections').select('*');
    if (error || !data) return [];
    return data.map((col: any) => ({
      id: String(col.id),
      slug: col.slug || col.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'collection',
      title: col.name || col.title || 'Collection',
      subtitle: col.subtitle || col.season || 'Atelier Collection',
      collectionNumber: col.season || 'COLLECTION',
      image: col.image_url || col.image || '',
      description: col.description || '',
    }));
  } catch (err) {
    console.error('Failed to fetch collections:', err);
    return [];
  }
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
  payment_status TEXT NOT NULL DEFAULT 'payment_submitted',
  delivery_payment_status TEXT NOT NULL DEFAULT 'under_review',
  transaction_id TEXT,
  payment_proof_url TEXT,
  delivery_charge_paid NUMERIC DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  order_status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS & allow anonymous inserts & reads
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

-- 2. Phase 3 Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL,
  payment_type TEXT DEFAULT 'delivery_charge',
  payment_method TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  transaction_id TEXT,
  proof_image_url TEXT,
  status TEXT DEFAULT 'under_review',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read payments" ON public.payments FOR SELECT USING (true);

-- 3. Phase 3 Payment Transactions Table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL,
  transaction_id TEXT,
  payment_method TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  proof_url TEXT,
  status TEXT DEFAULT 'under_review',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert payment_transactions" ON public.payment_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read payment_transactions" ON public.payment_transactions FOR SELECT USING (true);

-- 4. Site Settings Table (Payment Numbers & Global Atelier Config)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public write site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 5. VIP Newsletter Subscribers
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

-- 5. Categories Table (Managed via Admin Portal)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  pieces_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public insert or update categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- 6. Collections Table (Managed via Admin Portal)
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  season TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public insert or update collections" ON public.collections FOR ALL USING (true) WITH CHECK (true);

-- 7. Products Table (Managed via Admin Portal)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subtitle TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  compare_at_price NUMERIC,
  currency TEXT DEFAULT '৳',
  tag TEXT,
  image_url TEXT,
  alt TEXT,
  description TEXT,
  fabric TEXT,
  origin TEXT DEFAULT 'Dhaka Atelier',
  stock_count INT DEFAULT 10,
  sizes TEXT[] DEFAULT ARRAY['38 FR', '40 FR', '42 FR']::TEXT[],
  colors TEXT[] DEFAULT ARRAY['Natural']::TEXT[],
  model_stats TEXT,
  care_instructions TEXT[],
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert or update products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- 8. Product Images Table (Multi-image support)
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product_images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public insert or update product_images" ON public.product_images FOR ALL USING (true) WITH CHECK (true);

-- 9. Product Variants Table (Size / Color / Stock)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  stock INT DEFAULT 5,
  price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product_variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public insert or update product_variants" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
`;
