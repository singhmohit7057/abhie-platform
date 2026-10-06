import { supabase } from './supabase'

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/merchant-admin`

async function headers() {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token ?? ''}`,
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
}

export async function adminCreateUser(email: string, password: string, fullName: string) {
  const res = await fetch(EDGE_URL, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ action: 'create', email, password, fullName }),
  })
  return res.json()
}

export async function adminUpdateUser(userId: string, opts: { email?: string; password?: string }) {
  const res = await fetch(EDGE_URL, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ action: 'update', userId, ...opts }),
  })
  return res.json()
}

export async function adminDeleteUser(userId: string) {
  const res = await fetch(EDGE_URL, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ action: 'delete', userId }),
  })
  return res.json()
}

export async function adminFindUserByEmail(email: string) {
  const res = await fetch(EDGE_URL, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ action: 'find-by-email', listEmail: email }),
  })
  const data = await res.json()
  return data.user ?? null
}

export async function adminGetUser(userId: string) {
  const res = await fetch(EDGE_URL, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ action: 'get', userId }),
  })
  return res.json()
}
