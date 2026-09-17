import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { action, phone, otp } = await req.json()
    const authkey = Deno.env.get('MSG91_AUTHKEY') ?? ''
    const templateId = Deno.env.get('MSG91_TEMPLATE_ID') ?? ''
    const mobile = '91' + phone.replace(/\D/g, '').slice(-10)

    let result: any

    if (action === 'send') {
      const res = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: { authkey, 'content-type': 'application/json' },
        body: JSON.stringify({ template_id: templateId, mobile, otp_length: 6, otp_expiry: 10 }),
      })
      result = await res.json()
    } else if (action === 'verify') {
      const res = await fetch(`https://control.msg91.com/api/v5/otp/verify?authkey=${authkey}&mobile=${mobile}&otp=${otp}`)
      result = await res.json()
    } else if (action === 'resend') {
      const res = await fetch(`https://control.msg91.com/api/v5/otp/retry?authkey=${authkey}&mobile=${mobile}&retrytype=text`, { method: 'POST' })
      result = await res.json()
    } else {
      return new Response(JSON.stringify({ type: 'error', message: 'Invalid action' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify(result), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ type: 'error', message: String(e) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
