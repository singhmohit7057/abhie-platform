import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase, supabaseOtp } from '../../lib/supabase'
import { msg91SendOtp, msg91VerifyOtp, msg91ResendOtp } from '../../lib/msg91'
import { Button } from '../../components/ui/Button'

export function EditAccount() {
  const { profile } = useAuth()
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', user_id: '' })
  const [original, setOriginal] = useState({ email: '', phone: '' })
  const [successMsg, setSuccessMsg] = useState('')
  const [formError, setFormError] = useState('')

  const [showOtp, setShowOtp] = useState(false)
  const [otpMode, setOtpMode] = useState<'email' | 'phone'>('email')
  const [otpStep, setOtpStep] = useState<1 | 2>(1)
  const [otp1, setOtp1] = useState('')
  const [otp2, setOtp2] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [resend1, setResend1] = useState(0)
  const [resend2, setResend2] = useState(0)
  const timer1 = useRef<any>(null)
  const timer2 = useRef<any>(null)

  const emailChanged = form.email !== original.email
  const phoneChanged = form.phone !== original.phone

  useEffect(() => {
    if (profile) {
      const d = { full_name: profile.full_name, email: profile.email, phone: profile.phone || '', user_id: (profile as any)?.user_id || '' }
      setForm(d); setOriginal({ email: profile.email, phone: profile.phone || '' })
    }
  }, [profile])

  function startTimer(set: React.Dispatch<React.SetStateAction<number>>, ref: React.MutableRefObject<any>) {
    set(30); if (ref.current) clearInterval(ref.current)
    ref.current = setInterval(() => { set((p: number) => { if (p <= 1) { clearInterval(ref.current); return 0 } return p - 1 }) }, 1000)
  }

  function closeOtp() {
    setShowOtp(false); setOtpStep(1); setOtp1(''); setOtp2(''); setOtpError('')
    setResend1(0); setResend2(0)
    if (timer1.current) clearInterval(timer1.current)
    if (timer2.current) clearInterval(timer2.current)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setFormError('')
    if (!emailChanged && !phoneChanged) { await saveProfile(); return }
    const mode: 'email' | 'phone' = emailChanged ? 'email' : 'phone'
    setOtpMode(mode); setShowOtp(true); setOtpStep(1); setOtp1(''); setOtp2(''); setOtpError('')
    setOtpLoading(true)
    let error: any = null
    if (mode === 'email') {
      const r = await supabase.auth.signInWithOtp({ email: original.email, options: { shouldCreateUser: false } })
      error = r.error
    } else {
      const r = await msg91SendOtp(original.phone)
      if (r.type !== 'success') error = { message: r.message }
    }
    setOtpLoading(false)
    if (error) { setOtpError(error.message); return }
    startTimer(setResend1, timer1)
  }

  async function saveProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ full_name: form.full_name, user_id: form.user_id || null }).eq('id', user.id)
    setSuccessMsg('Account updated successfully!'); setTimeout(() => setSuccessMsg(''), 4000)
  }

  async function verifyOtp1() {
    if (!otp1 || otp1.length !== 6) { setOtpError('Enter the 6-digit OTP.'); return }
    setOtpError(''); setOtpLoading(true)
    let step1Error = false
    if (otpMode === 'email') {
      const r = await supabaseOtp.auth.verifyOtp({ email: original.email, token: otp1, type: 'email' })
      if (r.error) step1Error = true
    } else {
      const r = await msg91VerifyOtp(original.phone, otp1)
      if (r.type !== 'success') step1Error = true
    }
    setOtpLoading(false)
    if (step1Error) { setOtpError('Invalid or expired OTP.'); return }

    // Step 2: send OTP to new value
    setOtpStep(2); setOtp2(''); setOtpLoading(true)
    // For email: use updateUser → triggers "Change Email Address" template (not "Confirm Signup")
    let step2SendError: any = null
    if (otpMode === 'email') {
      const r = await supabase.auth.updateUser({ email: form.email })
      step2SendError = r.error
    } else {
      const r = await msg91SendOtp(form.phone)
      if (r.type !== 'success') step2SendError = { message: r.message }
    }
    const step2Res = { error: step2SendError }
    setOtpLoading(false)
    if (step2Res.error) { setOtpError(step2Res.error.message); return }
    startTimer(setResend2, timer2)
  }

  async function verifyOtp2() {
    if (!otp2 || otp2.length !== 6) { setOtpError('Enter the 6-digit OTP.'); return }
    setOtpError(''); setOtpLoading(true)
    const { data: { user: adminUser } } = await supabase.auth.getUser()
    // email_change type for email; sms for phone
    let step2Error = false
    if (otpMode === 'email') {
      const r = await supabaseOtp.auth.verifyOtp({ email: form.email, token: otp2, type: 'email' })
      if (r.error) step2Error = true
    } else {
      const r = await msg91VerifyOtp(form.phone, otp2)
      if (r.type !== 'success') step2Error = true
    }
    if (step2Error) { setOtpError('Invalid or expired OTP.'); setOtpLoading(false); return }

    // email already updated by verifyOtp(email_change) — just sync profiles
    if (adminUser) await supabase.from('profiles').update({
      ...(otpMode === 'email' ? { email: form.email } : {}),
      phone: form.phone || null, full_name: form.full_name, user_id: form.user_id || null
    }).eq('id', adminUser.id)
    setOtpLoading(false)
    setOriginal({ email: form.email, phone: form.phone })
    closeOtp(); setSuccessMsg('Account updated successfully!'); setTimeout(() => setSuccessMsg(''), 4000)
  }

  const inputCls = 'w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none'
  const otpInp = { width: 128, borderRadius: 4, border: '1px solid #d1d5db', padding: '6px 8px', fontSize: 13, letterSpacing: 4 }

  const step1Label = otpMode === 'email'
    ? { title: 'Verify Old Email', desc: 'OTP sent to your current email:', val: original.email }
    : { title: 'Verify Old Phone', desc: 'OTP sent via SMS to your current phone:', val: original.phone }
  const step2Label = otpMode === 'email'
    ? { title: 'Verify New Email', desc: 'OTP sent to your new email:', val: form.email }
    : { title: 'Verify New Phone', desc: 'OTP sent via SMS to your new phone:', val: form.phone }

  return (
    <>
      <div>
        <h1 className="mb-4 text-xl font-bold text-red-700">Edit Account</h1>
        {successMsg && (
          <div className="mb-4 rounded border border-green-200 bg-white py-2 text-center text-sm">
            <span className="font-bold text-green-600">Success! </span>
            <span className="text-green-600">{successMsg}</span>
          </div>
        )}
        <div className="rounded-lg border bg-white p-6 max-w-xl">
          <form onSubmit={handleSave}>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap w-36">Name:</td>
                  <td className="py-2"><input className={inputCls} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Email:</td>
                  <td className="py-2"><input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Phone:</td>
                  <td className="py-2"><input className={inputCls} type="tel" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })} /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">User ID:</td>
                  <td className="py-2"><input className={inputCls} value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} /></td>
                </tr>
              </tbody>
            </table>
            {formError && <p className="mt-3 text-sm font-medium text-red-600">{formError}</p>}
            <div className="mt-4"><Button type="submit">Save Changes</Button></div>
          </form>
        </div>
      </div>

      {showOtp && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeOtp() }}>
          <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 460, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ background: '#bf282d', padding: '12px 20px' }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 }}>
                {otpMode === 'email' ? 'Verify Email Change' : 'Verify Phone Change'}
              </p>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Step 1 */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, background: '#f9fafb', padding: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#bf282d', marginBottom: 4 }}>Step 1 of 2 — {step1Label.title}</p>
                <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>{step1Label.desc} <strong>{step1Label.val}</strong></p>
                {otpStep === 1 && (otpLoading && resend1 === 0
                  ? <p style={{ fontSize: 12, color: '#6b7280' }}>Sending OTP…</p>
                  : <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <input style={otpInp} type="text" maxLength={6} value={otp1} onChange={(e) => setOtp1(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="6-digit OTP" autoFocus />
                      <Button type="button" disabled={otpLoading} onClick={verifyOtp1}>{otpLoading ? 'Verifying…' : 'Verify OTP'}</Button>
                      {resend1 > 0
                        ? <span style={{ fontSize: 12, color: '#9ca3af' }}>Resend in {resend1}s</span>
                        : <button type="button" onClick={async () => { setOtpLoading(true); otpMode === 'email' ? await supabase.auth.signInWithOtp({ email: original.email, options: { shouldCreateUser: false } }) : await msg91ResendOtp(original.phone); setOtpLoading(false); startTimer(setResend1, timer1) }} style={{ fontSize: 12, color: '#bf282d', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Resend OTP</button>}
                    </div>
                )}
                {otpStep === 2 && <p style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>✓ Verified!</p>}
              </div>

              {/* Step 2 */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, background: otpStep === 2 ? '#f9fafb' : '#f3f4f6', padding: 16, opacity: otpStep === 2 ? 1 : 0.45, pointerEvents: otpStep === 2 ? 'auto' : 'none' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#bf282d', marginBottom: 4 }}>Step 2 of 2 — {step2Label.title}</p>
                <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>{step2Label.desc} <strong>{step2Label.val}</strong></p>
                {otpStep === 2 && otpLoading && resend2 === 0
                  ? <p style={{ fontSize: 12, color: '#6b7280' }}>Sending OTP…</p>
                  : <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <input style={otpInp} type="text" maxLength={6} value={otp2} onChange={(e) => setOtp2(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="6-digit OTP" />
                      <Button type="button" disabled={otpLoading || otpStep !== 2} onClick={verifyOtp2}>{otpLoading ? 'Verifying…' : 'Verify & Save'}</Button>
                      {otpStep === 2 && (resend2 > 0
                        ? <span style={{ fontSize: 12, color: '#9ca3af' }}>Resend in {resend2}s</span>
                        : <button type="button" onClick={async () => { setOtpLoading(true); otpMode === 'email' ? await supabase.auth.signInWithOtp({ email: form.email }) : await msg91ResendOtp(form.phone); setOtpLoading(false); startTimer(setResend2, timer2) }} style={{ fontSize: 12, color: '#bf282d', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Resend OTP</button>
                      )}
                    </div>
                }
              </div>

              {otpError && <p style={{ fontSize: 12, color: '#dc2626', fontWeight: 500 }}>{otpError}</p>}
              <div><Button type="button" variant="secondary" onClick={closeOtp}>Cancel</Button></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
