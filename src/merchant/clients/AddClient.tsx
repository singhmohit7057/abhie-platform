import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCRUD } from '../../hooks/useCRUD'
import { useMerchantId } from '../../hooks/useMerchantId'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import type { Client, Card } from '../../types'

export function AddClient() {
  const { data: clients, create, update } = useCRUD<Client>({ table: 'clients' })
  const { data: cards } = useCRUD<Card>({ table: 'cards' })
  const merchantId = useMerchantId()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const availableCards = cards.filter(c => c.merchant_id === merchantId && !c.client_id)

  const [form, setForm] = useState({
    name: '', dob: '', anniversary: '', phone: '', alt_phone: '', email: '',
    address: '', city: '', state: '', pincode: '', card_id: '',
    agency: '', sales_manager: '', remarks: '', is_active: 'true', membership: 'no',
  })

  useEffect(() => {
    if (editId && clients.length > 0) {
      const c: any = clients.find(c => c.id === editId)
      if (c) {
        setForm(prev => ({
          ...prev,
          name: c.name || '', phone: c.phone || '', email: c.email || '',
          address: c.address || '', city: c.city || '', state: c.state || '',
          pincode: c.pincode || '', card_id: c.card_id || '',
          dob: c.dob || '', anniversary: c.anniversary || '',
          alt_phone: c.alt_phone || '', agency: c.agency || '',
          sales_manager: c.sales_manager || '', remarks: c.remarks || '',
          is_active: String(c.is_active ?? true), membership: c.membership_status || 'no',
        }))
      }
    }
  }, [editId, clients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      address: form.address || null,
      city: form.city || null,
      state: form.state || null,
      pincode: form.pincode || null,
      card_id: form.card_id || null,
      dob: form.dob || null,
      anniversary: form.anniversary || null,
      alt_phone: form.alt_phone || null,
      agency: form.agency || null,
      sales_manager: form.sales_manager || null,
      remarks: form.remarks || null,
      is_active: form.is_active === 'true',
      membership_status: form.membership || null,
      merchant_id: merchantId,
    }
    if (editId) {
      await update(editId, payload as any)
      if (form.card_id) {
        await supabase.from('cards').update({ client_id: editId }).eq('id', form.card_id)
      }
    } else {
      await create(payload as any)
      if (form.card_id) {
        const { data: newClient } = await supabase.from('clients').select('id').eq('phone', form.phone).order('created_at', { ascending: false }).limit(1)
        if (newClient?.[0]) {
          await supabase.from('cards').update({ client_id: newClient[0].id }).eq('id', form.card_id)
        }
      }
    }
    navigate('/merchant/clients')
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">Add/Edit List</h1>

      <div className="rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit} autoComplete="off">
          <table className="w-full max-w-xl text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Name:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">DOB:</td>
                <td className="py-2">
                  <input className={`w-36 rounded border px-2 py-1.5 text-sm focus:outline-none ${form.dob.length === 10 && (() => { const [d,m] = form.dob.split('-').map(Number); return d > 31 || d < 1 || m > 12 || m < 1; })() ? 'border-red-500' : 'border-gray-300 focus:border-red-500'}`} placeholder="dd-mm-yyyy" maxLength={10} value={form.dob} onChange={(e) => { let v = e.target.value.replace(/[^0-9]/g, ''); if (v.length > 2) v = v.slice(0,2) + '-' + v.slice(2); if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5); setForm({ ...form, dob: v.slice(0,10) }); }} autoComplete="off" />
                  {form.dob.length === 10 && (() => { const [d,m] = form.dob.split('-').map(Number); return d > 31 || d < 1 || m > 12 || m < 1; })() && <p className="mt-1 text-xs text-red-600">Invalid date</p>}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Date of Anniversary:</td>
                <td className="py-2">
                  <input className={`w-36 rounded border px-2 py-1.5 text-sm focus:outline-none ${form.anniversary.length === 10 && (() => { const [d,m] = form.anniversary.split('-').map(Number); return d > 31 || d < 1 || m > 12 || m < 1; })() ? 'border-red-500' : 'border-gray-300 focus:border-red-500'}`} placeholder="dd-mm-yyyy" maxLength={10} value={form.anniversary} onChange={(e) => { let v = e.target.value.replace(/[^0-9]/g, ''); if (v.length > 2) v = v.slice(0,2) + '-' + v.slice(2); if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5); setForm({ ...form, anniversary: v.slice(0,10) }); }} autoComplete="off" />
                  {form.anniversary.length === 10 && (() => { const [d,m] = form.anniversary.split('-').map(Number); return d > 31 || d < 1 || m > 12 || m < 1; })() && <p className="mt-1 text-xs text-red-600">Invalid date</p>}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Phone No.:</td>
                <td className="py-2"><input type="tel" maxLength={10} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required autoComplete="off" /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Alternative Phone No.:</td>
                <td className="py-2"><input type="tel" maxLength={10} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.alt_phone} onChange={(e) => setForm({ ...form, alt_phone: e.target.value })} autoComplete="off" /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Email:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></td>
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
                <td className="py-2">
                  <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none">
                    <option>INDIA</option>
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Pin Code:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Card No:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.card_id} onChange={(e) => setForm({ ...form, card_id: e.target.value })}>
                    <option value="">--- Select Card ---</option>
                    {availableCards.map(c => <option key={c.id} value={c.id}>{c.card_number}</option>)}
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Issue Date:</td>
                <td className="py-2"><input className="w-40 rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={new Date().toLocaleDateString('en-GB').replace(/\//g, '-')} disabled /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Valid Upto:</td>
                <td className="py-2"><input className="w-40 rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '-')} disabled /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Agency/Marketing Executive:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Sales Manager:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.sales_manager} onChange={(e) => setForm({ ...form, sales_manager: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap align-top">Remarks:</td>
                <td className="py-2"><textarea className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" rows={3} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></td>
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
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Membership Status:</td>
                <td className="py-2">
                  <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.membership} onChange={(e) => setForm({ ...form, membership: e.target.value })}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/merchant/clients')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
