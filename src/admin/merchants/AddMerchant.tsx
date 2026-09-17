import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase, supabaseOtp } from '../../lib/supabase'
import { useCRUD } from '../../hooks/useCRUD'
import { Button } from '../../components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'
import type { Merchant, Category, Profile } from '../../types'

export function AddMerchant() {
  const { data: merchantsData, update } = useCRUD<Merchant>({ table: 'merchants' })
  const { data: categories } = useCRUD<Category>({ table: 'categories' })
  const { data: profiles } = useCRUD<Profile>({ table: 'profiles' })
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const getEditData = () => {
    if (editId) {
      const m = merchantsData.find(m => m.id === editId)
      if (m) return {
        store_name: m.store_name, email: '', password: '', phone: '', user_id: m.user_id || '',
        address: m.address || '', city: m.city || '', state: m.state || '', pincode: m.pincode || '',
        gst_number: m.gst_number || '', business_type: m.business_type || '', commission_rate: String(m.commission_rate), is_active: String(m.is_active),
      }
    }
    return {
      store_name: '', email: '', password: '', phone: '', user_id: '',
      address: '', city: '', state: '', pincode: '',
      gst_number: '', business_type: '', commission_rate: '0', is_active: 'true',
    }
  }

  const [form, setForm] = useState(getEditData())
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const [userIdEdited, setUserIdEdited] = useState(false)
  const [merchantAuthId, setMerchantAuthId] = useState('')
  const [originalEmail, setOriginalEmail] = useState('')
  const [originalPhone, setOriginalPhone] = useState('')

  // OTP popup
  const [showOtp, setShowOtp] = useState(false)
  const [otpStep, setOtpStep] = useState<1 | 2>(1)
  const [otp1, setOtp1] = useState('')
  const [otp2, setOtp2] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [resend1, setResend1] = useState(0)
  const [resend2, setResend2] = useState(0)
  const timer1 = useRef<any>(null)
  const timer2 = useRef<any>(null)
  const pendingPayload = useRef<any>(null)
  const [otpEmail, setOtpEmail] = useState('')  // actual auth email used for OTP

  const emailChanged = editId ? form.email !== originalEmail : false
  void originalPhone // kept for future SMS integration

  function startTimer(set: React.Dispatch<React.SetStateAction<number>>, ref: React.MutableRefObject<any>) {
    set(30)
    if (ref.current) clearInterval(ref.current)
    ref.current = setInterval(() => {
      set((p: number) => { if (p <= 1) { clearInterval(ref.current); return 0 } return p - 1 })
    }, 1000)
  }


  function closeOtp() {
    setShowOtp(false); setOtpStep(1); setOtp1(''); setOtp2(''); setOtpError('')
    setResend1(0); setResend2(0)
    if (timer1.current) clearInterval(timer1.current)
    if (timer2.current) clearInterval(timer2.current)
  }

  useEffect(() => {
    if (editId && merchantsData.length > 0) {
      const m = merchantsData.find(m => m.id === editId)
      if (m) {
        const profile = profiles.find(p => p.id === m.user_id)
        setMerchantAuthId(m.user_id || '')
        setUserIdEdited(true) // in edit mode, user_id is pre-filled — don't auto-override
        const email = profile?.email || ''
        const phone = profile?.phone || ''
        setOriginalEmail(email)
        setOriginalPhone(phone)
        setForm(prev => ({
          ...prev,
          store_name: m.store_name, user_id: (profile as any)?.user_id || '',
          email, phone,
          address: m.address || '', city: m.city || '', state: m.state || '', pincode: m.pincode || '',
          gst_number: m.gst_number || '', business_type: m.business_type || '', commission_rate: String(m.commission_rate), is_active: String(m.is_active),
        }))
      }
    }
  }, [editId, merchantsData, profiles])

  async function performEditSave(payload: any) {
    const result = await update(editId!, payload)
    if (!result.ok) { setFormError(result.error || 'Failed to update'); return }
    if (merchantAuthId) {
      await supabase.from('profiles').update({
        phone: form.phone || null, user_id: form.user_id || null,
        full_name: form.store_name, email: form.email || null,
      }).eq('id', merchantAuthId)
      const sk = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
      const url = import.meta.env.VITE_SUPABASE_URL
      if (form.email) {
        await fetch(`${url}/auth/v1/admin/users/${merchantAuthId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'apikey': sk, 'Authorization': `Bearer ${sk}` },
          body: JSON.stringify({ email: form.email, email_confirm: true }),
        })
      }
      if (form.password) {
        await fetch(`${url}/auth/v1/admin/users/${merchantAuthId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'apikey': sk, 'Authorization': `Bearer ${sk}` },
          body: JSON.stringify({ password: form.password }),
        })
      }
    }
    // Cleanup: delete orphaned auth user with old email (if email was changed)
    if (merchantAuthId && originalEmail && form.email && originalEmail !== form.email) {
      const sk = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
      const url = import.meta.env.VITE_SUPABASE_URL
      const { data: oldUser } = await supabase.from('profiles').select('id').eq('email', originalEmail).maybeSingle()
      if (oldUser?.id && oldUser.id !== merchantAuthId) {
        await fetch(`${url}/auth/v1/admin/users/${oldUser.id}`, {
          method: 'DELETE',
          headers: { 'apikey': sk, 'Authorization': `Bearer ${sk}` },
        })
        await supabase.from('profiles').delete().eq('id', oldUser.id)
      }
    }
    closeOtp()
    navigate('/admin/merchants', { state: { success: 'Merchant information has been updated successfully!' } })
  }

  // otpMode: 'email' = 2-step email OTP, 'other' = 1-step admin email OTP (for phone/field changes)
  const [otpMode, setOtpMode] = useState<'email' | 'other'>('email')

  async function verifyOtp1() {
    if (!otp1 || otp1.length !== 6) { setOtpError('Enter the 6-digit OTP.'); return }
    setOtpError(''); setOtpLoading(true)
    // Verify using the same email that was used to send (otpEmail = actual auth email)
    const r1 = await supabaseOtp.auth.verifyOtp({ email: otpEmail, token: otp1, type: 'email' })
    setOtpLoading(false)
    if (r1.error) { setOtpError('Invalid or expired OTP.'); return }
    if (otpMode === 'other') {
      await performEditSave(pendingPayload.current); return
    }
    // Step 2: send OTP to new value
    setOtpStep(2); setOtp2(''); setOtpLoading(true)
    if (otpMode === 'email') {
      // Step 1: Update merchant email via admin API (immediate, no confirm)
      const sk = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
      const supaUrl = import.meta.env.VITE_SUPABASE_URL
      const res = await fetch(`${supaUrl}/auth/v1/admin/users/${merchantAuthId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', apikey: sk, Authorization: `Bearer ${sk}` },
        body: JSON.stringify({ email: form.email, email_confirm: true }),
      })
      if (!res.ok) {
        const j = await res.json()
        const msg: string = j.message || ''
        setOtpError(msg.includes('duplicate') || msg.includes('unique') ? 'This email is already registered to another account.' : msg || 'Failed to update email')
        setOtpLoading(false)
        return
      }
      // Step 2: Now send OTP to new email to verify ownership
      const { error: otpErr } = await supabaseOtp.auth.signInWithOtp({ email: form.email })
      setOtpLoading(false)
      if (otpErr) { setOtpError(otpErr.message); return }
    } else {
      // Phone change step 2 → OTP to new email (since SMS not configured)
      const { error } = await supabaseOtp.auth.signInWithOtp({ email: form.email })
      setOtpLoading(false)
      if (error) { setOtpError(error.message); return }
    }
    startTimer(setResend2, timer2)
  }

  async function verifyOtp2() {
    if (!otp2 || otp2.length !== 6) { setOtpError('Enter the 6-digit OTP.'); return }
    setOtpError(''); setOtpLoading(true)
    const r2 = await supabaseOtp.auth.verifyOtp({ email: form.email, token: otp2, type: 'email' })
    setOtpLoading(false)
    if (r2.error) { setOtpError('Invalid or expired OTP.'); return }
    await performEditSave(pendingPayload.current)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!editId && form.email && form.password) {
      const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          email_confirm: true,
          user_metadata: { full_name: form.store_name, role: 'merchant' },
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        const msg: string = json.message || json.msg || ''
        if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists') || res.status === 422) {
          const { data: existing } = await supabase.from('profiles').select('id').eq('email', form.email).maybeSingle()
          if (existing?.id) {
            form.user_id = existing.id
          } else {
            setFormError('This email is already registered.')
            return
          }
        } else {
          setFormError(msg || 'Failed to create account')
          return
        }
      } else {
        const userId = json.id
        // Wait for DB trigger to create profile row
        for (let i = 0; i < 10; i++) {
          await new Promise((r) => setTimeout(r, 300))
          const { data } = await supabase.from('profiles').select('id').eq('id', userId).maybeSingle()
          if (data?.id) break
        }
        await supabase.from('profiles').update({ role: 'merchant', full_name: form.store_name, phone: form.phone || null }).eq('id', userId)
        form.user_id = userId
      }
    }

    const payload: any = {
      store_name: form.store_name,
      business_type: form.business_type || null,
      gst_number: form.gst_number || null,
      address: form.address || null,
      city: form.city || null,
      state: form.state || null,
      pincode: form.pincode || null,
      commission_rate: parseFloat(form.commission_rate),
      is_active: form.is_active === 'true',
    }
    if (editId) {
      {
        // Always require OTP for any edit save
        pendingPayload.current = payload
        // 'email' = 2-step email OTP; 'other' = 1-step admin email OTP
        const mode: 'email' | 'other' = emailChanged ? 'email' : 'other'
        setOtpMode(mode)
        setShowOtp(true); setOtpStep(1); setOtp1(''); setOtp2(''); setOtpError('')
        setOtpLoading(true)
        // Fetch merchant's ACTUAL auth email (profiles table may be stale)
        let sendTo = originalEmail
        if (merchantAuthId) {
          const sk = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
          const supaUrl = import.meta.env.VITE_SUPABASE_URL
          const authRes = await fetch(`${supaUrl}/auth/v1/admin/users/${merchantAuthId}`, {
            headers: { apikey: sk, Authorization: `Bearer ${sk}` }
          })
          const authUser = await authRes.json()
          if (authUser?.email) sendTo = authUser.email
        }
        setOtpEmail(sendTo)
        const { error: otpErr } = await supabaseOtp.auth.signInWithOtp({ email: sendTo })
        setOtpLoading(false)
        if (otpErr) { setOtpError(otpErr.message); return }
        startTimer(setResend1, timer1)
        return
      }
    } else {
      payload.user_id = form.user_id || null
      const { error: merchantError } = await supabase.from('merchants').insert(payload)
      if (merchantError) {
        if (merchantError.message.includes('foreign key')) {
          setFormError('Please fill Email and Password to create a merchant account first.')
        } else {
          setFormError(merchantError.message)
        }
        return
      }
    }
    navigate('/admin/merchants')
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-red-700">Add/Edit Merchant</h1>

      <div className="rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <table className="w-full max-w-xl text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Merchant Name:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} required /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Date of Registration:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={new Date().toLocaleDateString('en-GB').replace(/\//g, '-')} disabled /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Email:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="email" value={form.email} onChange={(e) => {
                  const email = e.target.value
                  const prefix = email.split('@')[0]
                  setForm(f => ({ ...f, email, ...(!userIdEdited && !editId ? { user_id: prefix } : {}) }))
                }} required={!editId} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Password:</td>
                <td className="py-2">
                  <div className="relative">
                    <input className="w-full rounded border border-gray-300 px-2 py-1.5 pr-9 text-sm focus:border-red-500 focus:outline-none" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editId} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Phone (Mobile):</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="tel" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })} required /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">User ID:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.user_id} onChange={(e) => { setUserIdEdited(true); setForm({ ...form, user_id: e.target.value }) }} required /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Address:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">City:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">State:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                    <option value="">--- Select ---</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu & Kashmir">Jammu & Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Country:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value="India" disabled /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">PIN:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Category:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none" value={form.business_type} onChange={(e) => setForm({ ...form, business_type: e.target.value })}>
                    <option value="">--- Select ---</option>
                    <option value="All">All Categories</option>
                    {categories.filter(c => c.is_active).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Status:</td>
                <td className="py-2">
                  <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.value })}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          {formError && <p className="mt-3 text-center text-sm font-bold text-red-600">{formError}</p>}
          <div className="mt-5 flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/merchants')}>Cancel</Button>
          </div>
        </form>
      </div>

      {/* OTP Popup */}
      {showOtp && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeOtp() }}
        >
          <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 460, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ background: '#bf282d', padding: '12px 20px' }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 }}>
                {otpMode === 'other' ? 'Confirm Changes via Email OTP' : 'Verify to Save Changes'}
              </p>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Step 1 */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, background: '#f9fafb', padding: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#bf282d', marginBottom: 4 }}>
                  {otpMode === 'other' ? 'Step 1 of 1' : 'Step 1 of 2'} — Verify via Email OTP
                </p>
                <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
                  <>OTP sent to merchant's email: <strong>{otpEmail || originalEmail}</strong></>
                </p>
                {otpStep === 1 && (otpLoading && resend1 === 0
                  ? <p style={{ fontSize: 12, color: '#6b7280' }}>Sending OTP…</p>
                  : <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <input style={{ width: 120, borderRadius: 4, border: '1px solid #d1d5db', padding: '6px 8px', fontSize: 13, letterSpacing: 4 }} type="text" maxLength={6} value={otp1} onChange={(e) => setOtp1(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="6-digit OTP" autoFocus />
                      <Button type="button" disabled={otpLoading} onClick={verifyOtp1}>{otpLoading ? 'Verifying…' : 'Verify OTP'}</Button>
                      {resend1 > 0
                        ? <span style={{ fontSize: 12, color: '#9ca3af' }}>Resend in {resend1}s</span>
                        : <button type="button" onClick={async () => { setOtpLoading(true); await supabaseOtp.auth.signInWithOtp({ email: otpEmail || originalEmail }); setOtpLoading(false); startTimer(setResend1, timer1) }} style={{ fontSize: 12, color: '#bf282d', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Resend OTP</button>
                      }
                    </div>
                )}
                {otpStep === 2 && <p style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>✓ Verified!</p>}
              </div>

              {/* Step 2 — hidden for 'other' mode */}
              {otpMode !== 'other' && <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, background: otpStep === 2 ? '#f9fafb' : '#f3f4f6', padding: 16, opacity: otpStep === 2 ? 1 : 0.45, pointerEvents: otpStep === 2 ? 'auto' : 'none' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#bf282d', marginBottom: 4 }}>Step 2 of 2 — {otpMode === 'email' ? 'Verify New Email' : 'Verify New Phone'}</p>
                  <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
                    {otpMode === 'email'
                      ? <>OTP to new email: <strong>{form.email}</strong></>
                      : <>OTP sent to the new phone being set: <strong>{form.phone}</strong></>}
                  </p>
                  {otpStep === 2 && otpLoading && resend2 === 0
                    ? <p style={{ fontSize: 12, color: '#6b7280' }}>Sending OTP…</p>
                    : <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <input style={{ width: 120, borderRadius: 4, border: '1px solid #d1d5db', padding: '6px 8px', fontSize: 13, letterSpacing: 4 }} type="text" maxLength={6} value={otp2} onChange={(e) => setOtp2(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="6-digit OTP" />
                        <Button type="button" disabled={otpLoading || otpStep !== 2} onClick={verifyOtp2}>{otpLoading ? 'Verifying…' : 'Verify & Save'}</Button>
                        {otpStep === 2 && (resend2 > 0
                          ? <span style={{ fontSize: 12, color: '#9ca3af' }}>Resend in {resend2}s</span>
                          : <button type="button" onClick={async () => { setOtpLoading(true); await supabaseOtp.auth.signInWithOtp({ email: form.email }); setOtpLoading(false); startTimer(setResend2, timer2) }} style={{ fontSize: 12, color: '#bf282d', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Resend OTP</button>
                        )}
                      </div>
                  }
              </div>}

              {otpError && <p style={{ fontSize: 12, color: '#dc2626', fontWeight: 500 }}>{otpError}</p>}
              <div><Button type="button" variant="secondary" onClick={closeOtp}>Cancel</Button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
