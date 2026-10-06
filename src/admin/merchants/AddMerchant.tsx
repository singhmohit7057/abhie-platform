import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { adminCreateUser, adminUpdateUser, adminDeleteUser, adminFindUserByEmail } from '../../lib/merchantAdmin'
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function validateField(name: string, value: string) {
    if (name === 'store_name' && !value) return 'Name is mandatory.'
    if (name === 'email') {
      if (!value) return 'Email is mandatory.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.'
    }
    if (name === 'phone') {
      if (!value) return 'Phone number is mandatory.'
      if (!/^\d{10}$/.test(value)) return 'Enter a valid phone number.'
    }
    if (name === 'password' && !editId) {
      if (!value) return 'Password is mandatory.'
      if (value.length < 6) return 'Minimum password length should be 6.'
    }
    if (name === 'password' && editId) {
      if (value && value.length < 6) return 'Minimum password length should be 6.'
    }
    if (name === 'user_id' && !value) return 'User Id is mandatory.'
    if (name === 'business_type' && !value) return 'Category is mandatory.'
    return ''
  }

  async function handleFieldBlur(name: string, value: string) {
    const err = validateField(name, value)
    if (err) { setFieldErrors(prev => ({ ...prev, [name]: err })); return }

    // Check for duplicates in DB (skip if same as current in edit mode)
    if (name === 'email' && value) {
      const { data } = await supabase.from('profiles').select('id, role').eq('email', value).maybeSingle()
      if (data?.id && data.id !== merchantAuthId && data.role === 'merchant') {
        setFieldErrors(prev => ({ ...prev, email: 'Email is already registered.' })); return
      }
    }
    if (name === 'phone' && value && value.length === 10) {
      const { data } = await supabase.from('profiles').select('id').eq('phone', value).maybeSingle()
      if (data?.id && data.id !== merchantAuthId) {
        setFieldErrors(prev => ({ ...prev, phone: 'Phone Number is already registered.' })); return
      }
    }
    if (name === 'store_name' && value) {
      const { data } = await supabase.from('merchants').select('id').ilike('store_name', value).maybeSingle()
      if (data?.id && data.id !== editId) {
        setFieldErrors(prev => ({ ...prev, store_name: 'Duplicate Merchant.' })); return
      }
    }
    if (name === 'user_id' && value) {
      const { data } = await supabase.from('profiles').select('id').eq('user_id', value).maybeSingle()
      if (data?.id && data.id !== merchantAuthId) {
        setFieldErrors(prev => ({ ...prev, user_id: 'User Id is not available.' })); return
      }
    }
    setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }
  const [merchantAuthId, setMerchantAuthId] = useState('')
  const formInitialized = useRef(false)
  const [originalEmail, setOriginalEmail] = useState('')

  useEffect(() => {
    if (editId && merchantsData.length > 0) {
      const m = merchantsData.find(m => m.id === editId)
      if (m) {
        const profile = profiles.find(p => p.id === m.user_id)
        // Only mark initialized when profile data is loaded; re-run until then
        if (formInitialized.current && profile) return
        if (profile) formInitialized.current = true
        setMerchantAuthId(m.user_id || '')
        
        const email = profile?.email || ''
        const phone = profile?.phone || ''
        setOriginalEmail(email)
        // setOriginalPhone removed
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
      if (form.email) await adminUpdateUser(merchantAuthId, { email: form.email })
      if (form.password) await adminUpdateUser(merchantAuthId, { password: form.password })
    }
    // Cleanup: delete orphaned auth user with old email (if email was changed)
    if (merchantAuthId && originalEmail && form.email && originalEmail !== form.email) {
      const { data: oldUser } = await supabase.from('profiles').select('id').eq('email', originalEmail).maybeSingle()
      if (oldUser?.id && oldUser.id !== merchantAuthId) {
        await adminDeleteUser(oldUser.id)
        await supabase.from('profiles').delete().eq('id', oldUser.id)
      }
    }
    navigate('/admin/merchants', { state: { success: 'Merchant information has been updated successfully!' } })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    // Validate all required fields before submit
    const errors: Record<string, string> = {}
    const checks = [
      ['store_name', form.store_name],
      ['email', form.email],
      ['phone', form.phone],
      ['password', form.password],
      ['user_id', form.user_id],
      ['business_type', form.business_type],
    ] as [string, string][]
    checks.forEach(([name, val]) => {
      const err = validateField(name, val)
      if (err) errors[name] = err
    })
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }
    // Check duplicates on submit
    if (!editId) {
      const [nameCheck, emailCheck, phoneCheck, userIdCheck] = await Promise.all([
        supabase.from('merchants').select('id').ilike('store_name', form.store_name).maybeSingle(),
        supabase.from('profiles').select('id, role').eq('email', form.email).maybeSingle(),
        supabase.from('profiles').select('id').eq('phone', form.phone).maybeSingle(),
        form.user_id ? supabase.from('profiles').select('id').eq('user_id', form.user_id).maybeSingle() : Promise.resolve({ data: null }),
      ])
      const dupErrors: Record<string, string> = {}
      if (nameCheck.data?.id) dupErrors.store_name = 'Duplicate Merchant.'
      if (emailCheck.data?.id && emailCheck.data.role === 'merchant') dupErrors.email = 'Email is already registered.'
      if (phoneCheck.data?.id) dupErrors.phone = 'Phone Number is already registered.'
      if (userIdCheck.data?.id) dupErrors.user_id = 'User Id is not available.'
      if (Object.keys(dupErrors).length > 0) { setFieldErrors(dupErrors); return }
    }
    setFieldErrors({})

    if (!editId && form.email && form.password) {
      const json = await adminCreateUser(form.email, form.password, form.store_name)
      if (!json.id) {
        const msg: string = json.message || json.msg || ''
        if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
          // Check merchant profile first
          const { data: existingProfile } = await supabase.from('profiles').select('id, role').eq('email', form.email).maybeSingle()
          if (existingProfile?.id && existingProfile.role === 'merchant') {
            setFormError('Email is already registered to another merchant.'); return
          }
          const orphan = await adminFindUserByEmail(form.email)
          if (orphan?.id) {
            await adminDeleteUser(orphan.id)
            await supabase.from('profiles').delete().eq('id', orphan.id)
          }
          // Retry
          const retryJson = await adminCreateUser(form.email, form.password, form.store_name)
          if (!retryJson.id) { setFormError(retryJson.message || 'Failed to create account.'); return }
          form.user_id = retryJson.id
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
        await supabase.from('profiles').update({ role: 'merchant', full_name: form.store_name, phone: form.phone || null, email: form.email || null, user_id: form.user_id || null }).eq('id', userId)
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
      await performEditSave(payload)
      return
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
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <table className="w-full max-w-xl text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Merchant Name: <span className="text-red-500">*</span></td>
                <td className="py-2">
                  <input className={`w-full rounded border px-2 py-1.5 text-sm focus:outline-none ${fieldErrors.store_name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-red-500'}`} value={form.store_name} onChange={(e) => { setForm({ ...form, store_name: e.target.value }); if (fieldErrors.store_name) setFieldErrors(prev => ({ ...prev, store_name: '' })) }} onBlur={(e) => handleFieldBlur('store_name', e.target.value)} required />
                  {fieldErrors.store_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.store_name}</p>}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Date of Registration:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={new Date().toLocaleDateString('en-GB').replace(/\//g, '-')} disabled /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Email: <span className="text-red-500">*</span></td>
                <td className="py-2">
                  <input className={`w-full rounded border px-2 py-1.5 text-sm focus:outline-none ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-red-500'}`} type="text" value={form.email} onChange={(e) => {
                    const email = e.target.value
                    setForm(f => ({ ...f, email }))
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: validateField('email', email) }))
                  }} onBlur={(e) => handleFieldBlur('email', e.target.value)} required={!editId} />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Password: <span className="text-red-500">*</span></td>
                <td className="py-2">
                  <div className="relative">
                    <input className={`w-full rounded border px-2 py-1.5 pr-9 text-sm focus:outline-none ${fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-red-500'}`} type={showPassword ? 'text' : 'password'} value={form.password} placeholder={editId ? 'Leave blank to keep current' : ''} autoComplete="new-password" onChange={(e) => { setForm({ ...form, password: e.target.value }); if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: validateField('password', e.target.value) })) }} onBlur={(e) => { const err = validateField('password', e.target.value); setFieldErrors(prev => ({ ...prev, password: err })) }} required={!editId} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Phone (Mobile): <span className="text-red-500">*</span></td>
                <td className="py-2">
                  <input className={`w-full rounded border px-2 py-1.5 text-sm focus:outline-none ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-red-500'}`} type="tel" maxLength={10} value={form.phone} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); setForm({ ...form, phone: v }); if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: validateField('phone', v) })) }} onBlur={(e) => handleFieldBlur('phone', e.target.value)} required />
                  {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">User ID: <span className="text-red-500">*</span></td>
                <td className="py-2">
                  <input className={`w-full rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ${editId ? 'bg-gray-50 cursor-not-allowed' : fieldErrors.user_id ? 'border-red-500' : 'focus:border-red-500'}`} value={form.user_id} onChange={(e) => { if (editId) return; setForm({ ...form, user_id: e.target.value }); if (fieldErrors.user_id) setFieldErrors(prev => ({ ...prev, user_id: '' })) }} onBlur={(e) => { if (!editId) handleFieldBlur('user_id', e.target.value) }} readOnly={!!editId} required />
                  {fieldErrors.user_id && <p className="mt-1 text-xs text-red-600">{fieldErrors.user_id}</p>}
                </td>
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
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Category: <span className="text-red-500">*</span></td>
                <td className="py-2">
                  <select className={`w-full rounded border px-2 py-1.5 text-sm focus:outline-none ${fieldErrors.business_type ? 'border-red-500' : 'border-gray-300 focus:border-gray-900'}`} value={form.business_type} onChange={(e) => { setForm({ ...form, business_type: e.target.value }); if (fieldErrors.business_type) setFieldErrors(prev => ({ ...prev, business_type: validateField('business_type', e.target.value) })) }} onBlur={(e) => handleFieldBlur('business_type', e.target.value)} required>
                    <option value="">--- Select ---</option>
                    <option value="All">All Categories</option>
                    {categories.filter(c => c.is_active).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {fieldErrors.business_type && <p className="mt-1 text-xs text-red-600">{fieldErrors.business_type}</p>}
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

    </div>
  )
}
