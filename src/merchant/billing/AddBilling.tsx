import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCRUD } from '../../hooks/useCRUD'
import { useMerchantId } from '../../hooks/useMerchantId'
import { Button } from '../../components/ui/Button'
import type { Payment, Store, Item } from '../../types'

export function AddBilling() {
  const { create } = useCRUD<Payment>({ table: 'payments' })
  const merchantId = useMerchantId()
  const { data: stores } = useCRUD<Store>({ table: 'stores', filters: merchantId ? { merchant_id: merchantId } : undefined })
  const { data: items } = useCRUD<Item>({ table: 'items' })
  const navigate = useNavigate()

  const [form, setForm] = useState({
    search_by: 'card', store_id: '', bill_amount: '', disc_type: 'fixed', disc_value: '',
    voucher_code: '', coupon_code: '', tax_percent: '0', redeem_points: '', remarks: '',
  })

  const selectedStore = stores.find(s => s.id === form.store_id)
  const billAmount = parseFloat(form.bill_amount || '0')
  const discValue = parseFloat(form.disc_value || '0')
  const discount = form.disc_type === 'percentage' ? (billAmount * discValue / 100) : discValue
  const totalAmount = billAmount - discount
  const taxAmount = totalAmount * parseFloat(form.tax_percent) / 100
  const payableAmount = totalAmount + taxAmount
  const cashbackPoints = Math.floor(billAmount / 25)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      amount: payableAmount,
      payment_mode: 'cash' as const,
      status: 'completed' as const,
      merchant_id: merchantId,
      order_id: null,
      client_id: null,
      transaction_id: null,
    }
    await create(payload as any)
    navigate('/merchant/billing')
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">Add Billing</h1>

      <div className="rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <table className="w-full max-w-xl text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Search By:</td>
                <td className="py-2">
                  <label className="inline-flex items-center gap-1.5 mr-4 text-sm">
                    <input type="radio" name="search_by" value="card" checked={form.search_by === 'card'} onChange={() => setForm({ ...form, search_by: 'card' })} />
                    Card No.
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-sm">
                    <input type="radio" name="search_by" value="phone" checked={form.search_by === 'phone'} onChange={() => setForm({ ...form, search_by: 'phone' })} />
                    Phone No.
                  </label>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Store:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.store_id} onChange={(e) => setForm({ ...form, store_id: e.target.value })}>
                    <option value="">--- Select ---</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Address:</td>
                <td className="py-2">
                  <input className="w-full rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={selectedStore?.address || '--- Select Store First ---'} disabled />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Bill Date:</td>
                <td className="py-2">
                  <input className="w-40 rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={new Date().toLocaleDateString('en-GB').replace(/\//g, '-')} disabled />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Select Products:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none">
                    <option value="">--- Select Product ---</option>
                    {items.map(i => <option key={i.id} value={i.id}>{i.name} - ₹{i.price}</option>)}
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Bill Amount:</td>
                <td className="py-2">
                  <input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="number" value={form.bill_amount} onChange={(e) => setForm({ ...form, bill_amount: e.target.value })} />
                  <p className="mt-0.5 text-xs text-gray-900">(Auto-calculated from products or enter manually)</p>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Additional Disc.:</td>
                <td className="py-2">
                  <div className="mb-1">
                    <label className="inline-flex items-center gap-1.5 mr-4 text-sm">
                      <input type="radio" name="disc_type" value="fixed" checked={form.disc_type === 'fixed'} onChange={() => setForm({ ...form, disc_type: 'fixed' })} />
                      Fixed
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-sm">
                      <input type="radio" name="disc_type" value="percentage" checked={form.disc_type === 'percentage'} onChange={() => setForm({ ...form, disc_type: 'percentage' })} />
                      Percentage
                    </label>
                  </div>
                  <input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="number" value={form.disc_value} onChange={(e) => setForm({ ...form, disc_value: e.target.value })} />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Voucher Code:</td>
                <td className="py-2 flex items-center gap-2">
                  <input className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.voucher_code} onChange={(e) => setForm({ ...form, voucher_code: e.target.value })} />
                  <button type="button" className="rounded bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-800">apply</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Coupon Code:</td>
                <td className="py-2 flex items-center gap-2">
                  <input className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.coupon_code} onChange={(e) => setForm({ ...form, coupon_code: e.target.value })} />
                  <button type="button" className="rounded bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-800">apply</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-bold text-gray-900 whitespace-nowrap">Total Amount:</td>
                <td className="py-2 font-bold">{totalAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Select Tax (%):</td>
                <td className="py-2">
                  <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.tax_percent} onChange={(e) => setForm({ ...form, tax_percent: e.target.value })}>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">TAX:</td>
                <td className="py-2">{taxAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-bold text-gray-900 whitespace-nowrap">Payable Amount:</td>
                <td className="py-2 font-bold">{payableAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Redeem Points:</td>
                <td className="py-2 flex items-center gap-2">
                  <input className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.redeem_points} onChange={(e) => setForm({ ...form, redeem_points: e.target.value })} />
                  <button type="button" className="rounded bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-800">apply</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Cashback Points:</td>
                <td className="py-2 font-bold text-red-700">{cashbackPoints.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap align-top">Remarks:</td>
                <td className="py-2">
                  <textarea className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" rows={3} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/merchant/billing')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
