import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCRUD } from '../../hooks/useCRUD'
import { Button } from '../../components/ui/Button'
import type { Coupon, Category, Merchant } from '../../types'

export function AddCoupon() {
  const { data: coupons, create, update } = useCRUD<Coupon>({ table: 'coupons' })
  const { data: categories } = useCRUD<Category>({ table: 'categories' })
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [form, setForm] = useState({
    category: 'All', merchant_id: '', issue_based_on: 'reseller',
    code: '', generate_type: 'discount', discount_value: '',
    description: '', repeat: 'one_time', valid_until: '', is_active: 'true', members_only: 'no',
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (editId && coupons.length > 0) {
      const c = coupons.find(c => c.id === editId)
      if (c) {
        setForm({
          category: 'All', merchant_id: (c as any).merchant_id || '', issue_based_on: 'reseller',
          code: c.code, generate_type: c.discount_type === 'fixed' ? 'fixed' : 'discount',
          discount_value: String(c.discount_value), description: c.description || '',
          repeat: c.max_uses === 1 ? 'one_time' : 'repeat',
          valid_until: c.valid_until?.split('T')[0] || '', is_active: String(c.is_active), members_only: 'no',
        })
      }
    }
  }, [editId, coupons])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    const payload = {
      code: form.code,
      title: form.code,
      description: form.description || null,
      discount_type: form.generate_type === 'fixed' ? 'fixed' as const : 'percentage' as const,
      discount_value: parseFloat(form.discount_value || '0'),
      applicable_category_id: null,
      min_order_amount: 0,
      max_uses: form.repeat === 'one_time' ? 1 : 9999,
      used_count: 0,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: form.valid_until,
      is_active: form.is_active === 'true',
    }
    if (editId) {
      await update(editId, payload as any)
    } else {
      await create(payload as any)
    }
    navigate('/admin/coupons')
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">Add/Edit Coupon</h1>

      <div className="rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <table className="w-full max-w-xl text-sm" style={{tableLayout: 'fixed'}}><colgroup><col style={{width: '180px'}} /><col /></colgroup>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Select Category:</td>
                <td className="py-2">
                  <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="All">All</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Applied On:</td>
                <td className="py-2">
                  <div className="flex items-center gap-3">
                    <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.merchant_id} onChange={(e) => setForm({ ...form, merchant_id: e.target.value })}>
                      <option value="">All (All Merchants)</option>
                      {merchants.map(m => <option key={m.id} value={m.id}>{m.store_name}</option>)}
                      <option value="website">Website (Shop Abhie)</option>
                    </select>
                    <span className={`text-xs text-gray-900 ${(!form.merchant_id || form.merchant_id === 'website') ? '' : 'invisible'}`}>Coupons are applied on Shop Abhie online store only</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Issue Coupon Based On:</td>
                <td className="py-2">
                  <label className="inline-flex items-center gap-1.5 mr-4 text-sm">
                    <input type="radio" name="issue_based" value="reseller" checked={form.issue_based_on === 'reseller'} onChange={() => setForm({ ...form, issue_based_on: 'reseller' })} />
                    Reseller
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-sm">
                    <input type="radio" name="issue_based" value="card_number" checked={form.issue_based_on === 'card_number'} onChange={() => setForm({ ...form, issue_based_on: 'card_number' })} />
                    Card Number
                  </label>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Coupon Code:</td>
                <td className="py-2">
                  <input className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Generate Type:</td>
                <td className="py-2">
                  <label className="inline-flex items-center gap-1.5 mr-4 text-sm">
                    <input type="radio" name="gen_type" value="fixed" checked={form.generate_type === 'fixed'} onChange={() => setForm({ ...form, generate_type: 'fixed' })} />
                    Fixed
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-sm">
                    <input type="radio" name="gen_type" value="discount" checked={form.generate_type === 'discount'} onChange={() => setForm({ ...form, generate_type: 'discount' })} />
                    Discount
                  </label>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Add Fixed / Discount(%):</td>
                <td className="py-2">
                  <input className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} required />
                  {form.discount_value && (
                    <p className="mt-1 text-xs text-green-700">
                      {form.generate_type === 'discount' ? `${form.discount_value}% discount on total bill` : `₹${form.discount_value} fixed discount on total bill`}
                    </p>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap align-top">Terms & Conditions:</td>
                <td className="py-2">
                  <textarea className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Repeat:</td>
                <td className="py-2">
                  <label className="inline-flex items-center gap-1.5 mr-4 text-sm">
                    <input type="radio" name="repeat" value="one_time" checked={form.repeat === 'one_time'} onChange={() => setForm({ ...form, repeat: 'one_time' })} />
                    One Time
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-sm">
                    <input type="radio" name="repeat" value="repeat" checked={form.repeat === 'repeat'} onChange={() => setForm({ ...form, repeat: 'repeat' })} />
                    Repeat
                  </label>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Expiry Date:</td>
                <td className="py-2">
                  <input className="w-40 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" placeholder="dd-mm-yyyy" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} required />
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
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Members Only:</td>
                <td className="py-2">
                  <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.members_only} onChange={(e) => setForm({ ...form, members_only: e.target.value })}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          {formError && <p className="mt-3 text-center text-sm font-bold text-red-600">{formError}</p>}
          <div className="mt-5 flex gap-2">
            <Button type="submit">Submit</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/coupons')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
