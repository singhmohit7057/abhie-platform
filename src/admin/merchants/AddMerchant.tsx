import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { useCRUD } from '../../hooks/useCRUD'
import { Button } from '../../components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Merchant, Category, Profile } from '../../types'

export function AddMerchant() {
  const { data: merchantsData, create, update } = useCRUD<Merchant>({ table: 'merchants' })
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

  useEffect(() => {
    if (editId && merchantsData.length > 0) {
      const m = merchantsData.find(m => m.id === editId)
      if (m) {
        const profile = profiles.find(p => p.id === m.user_id)
        const displayUserId = profile?.email?.split('@')[0] || m.user_id || ''
        setForm(prev => ({
          ...prev,
          store_name: m.store_name, user_id: displayUserId,
          email: profile?.email || '', phone: profile?.phone || '',
          address: m.address || '', city: m.city || '', state: m.state || '', pincode: m.pincode || '',
          gst_number: m.gst_number || '', business_type: m.business_type || '', commission_rate: String(m.commission_rate), is_active: String(m.is_active),
        }))
      }
    }
  }, [editId, merchantsData, profiles])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editId && form.email && form.password) {
      const freshClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false, autoRefreshToken: false } }
      )
      const { data: authData, error: authError } = await freshClient.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.store_name, role: 'merchant' },
        },
      })
      if (authError) {
        toast.error(`Failed to create account: ${authError.message}`)
        return
      }
      if (authData.user) {
        await freshClient.rpc('confirm_user', { user_id: authData.user.id })
        await freshClient.from('profiles').update({ role: 'merchant', full_name: form.store_name, phone: form.phone }).eq('id', authData.user.id)
        form.user_id = authData.user.id
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
      await update(editId, payload)
    } else {
      payload.user_id = form.user_id || null
      await create(payload as any)
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
                <td className="py-2"><input className={`w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none ${editId ? 'bg-gray-50' : ''}`} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required={!editId} disabled={!!editId} /></td>
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
                <td className="py-2"><input className={`w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none ${editId ? 'bg-gray-50' : ''}`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!!editId} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">User ID:</td>
                <td className="py-2"><input className={`w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none ${editId ? 'bg-gray-50' : ''}`} value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} disabled={!!editId} /></td>
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
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap align-top">Category:</td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" checked={form.business_type === 'All'} onChange={() => setForm({ ...form, business_type: form.business_type === 'All' ? '' : 'All' })} className="rounded border-gray-300" />
                      All
                    </label>
                    {categories.map(c => (
                      <label key={c.id} className="flex items-center gap-1.5 text-sm">
                        <input
                          type="checkbox"
                          checked={form.business_type === 'All' || form.business_type.split(',').includes(c.name)}
                          disabled={form.business_type === 'All'}
                          onChange={(e) => {
                            const current = form.business_type ? form.business_type.split(',').filter(x => x && x !== 'All') : []
                            if (e.target.checked) {
                              setForm({ ...form, business_type: [...current, c.name].join(',') })
                            } else {
                              setForm({ ...form, business_type: current.filter(x => x !== c.name).join(',') })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        {c.name}
                      </label>
                    ))}
                  </div>
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

          <div className="mt-5 flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/merchants')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
