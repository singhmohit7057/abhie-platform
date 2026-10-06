import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
// Admin session — stored under default key 'sb-...-auth-token'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Merchant session — stored under separate key, independent of admin session
export const supabaseMerchant = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storageKey: 'abhie-merchant-auth-token' },
})

// Isolated anon client — used for OTP send/verify without affecting main admin session
export const supabaseOtp = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})
