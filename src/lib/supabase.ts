import { createClient } from '@supabase/supabase-js';

// Clean and normalize Supabase project URL
const sanitizeUrl = (rawUrl?: string): string => {
  if (!rawUrl) return 'https://xypyegletikcmwfjcgdq.supabase.co';
  let cleaned = rawUrl.trim();
  // Strip REST endpoint if provided by user
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
};

const env = (import.meta as any).env || {};
const rawUrl = env.VITE_SUPABASE_URL || 'https://xypyegletikcmwfjcgdq.supabase.co';
const rawKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6FCk7dwoUXIT1SacAKKuWw__JLCMExF';

export const SUPABASE_URL = sanitizeUrl(rawUrl);
export const SUPABASE_ANON_KEY = rawKey.trim();

// Create initialized Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.includes('supabase.co'));
};

/**
 * Ping Supabase to test connectivity
 */
export const checkSupabaseConnection = async (): Promise<{ connected: boolean; message: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      return { connected: false, message: 'Supabase credentials missing or invalid.' };
    }
    // Attempt a light query to verify network reachability
    const { error } = await supabase.from('orders').select('id').limit(1);
    
    // If table doesn't exist yet (PostgreSQL error 42P01 / PGRST204 / PGRST200),
    // the network connection and credentials themselves are still completely valid!
    if (error) {
      if (
        error.code === '42P01' ||
        error.code === 'PGRST204' ||
        error.code === 'PGRST200' ||
        error.message.includes('relation') ||
        error.message.includes('not found') ||
        error.message.includes('does not exist')
      ) {
        return {
          connected: true,
          message: 'Connected to Supabase project (Tables can be created via SQL schema).',
        };
      }
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Connected to Supabase database successfully.' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Network connection failed.' };
  }
};
