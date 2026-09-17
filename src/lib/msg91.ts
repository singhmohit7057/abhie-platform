const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/msg91-otp`
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
}

export async function msg91SendOtp(phone: string): Promise<{ type: string; message: string }> {
  const res = await fetch(EDGE_URL, { method: 'POST', headers, body: JSON.stringify({ action: 'send', phone }) })
  return res.json()
}

export async function msg91VerifyOtp(phone: string, otp: string): Promise<{ type: string; message: string }> {
  const res = await fetch(EDGE_URL, { method: 'POST', headers, body: JSON.stringify({ action: 'verify', phone, otp }) })
  return res.json()
}

export async function msg91ResendOtp(phone: string): Promise<{ type: string; message: string }> {
  const res = await fetch(EDGE_URL, { method: 'POST', headers, body: JSON.stringify({ action: 'resend', phone }) })
  return res.json()
}
