import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    // Verify caller is authenticated admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user } } = await callerClient.auth.getUser()
    if (!user) return json({ error: 'Unauthorized' }, 401)

    const adminClient = createClient(supabaseUrl, serviceKey)
    const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') return json({ error: 'Forbidden - Admin only' }, 403)

    const { action, userId, email, password, fullName, listEmail } = await req.json()

    // ── Create user ──
    if (action === 'create') {
      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { full_name: fullName, role: 'merchant' } }),
      })
      const data = await res.json()
      return json(data, res.status)
    }

    // ── Update user (email / password) ──
    if (action === 'update') {
      const body: Record<string, unknown> = {}
      if (email) { body.email = email; body.email_confirm = true }
      if (password) body.password = password
      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      return json(data, res.status)
    }

    // ── Delete user ──
    if (action === 'delete') {
      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      })
      return json({ ok: res.ok }, res.status)
    }

    // ── Find user by email (for orphan cleanup) ──
    if (action === 'find-by-email') {
      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=1&per_page=200`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      })
      const data = await res.json()
      const found = data.users?.find((u: { email: string; id: string }) => u.email === listEmail)
      return json({ user: found || null })
    }

    // ── Get user by ID ──
    if (action === 'get') {
      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      })
      const data = await res.json()
      return json(data, res.status)
    }

    return json({ error: 'Invalid action' }, 400)
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
