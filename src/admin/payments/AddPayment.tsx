import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCRUD } from '../../hooks/useCRUD'
import { Button } from '../../components/ui/Button'
import type { Payment, Merchant, Client } from '../../types'

export function AddPayment() {
  const { create } = useCRUD<Payment>({ table: 'payments' })
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })
  const { data: clients } = useCRUD<Client>({ table: 'clients' })
  const navigate = useNavigate()

  const [form, setForm] = useState({
    merchant_id: '', client_id: '', amount: '', payment_mode: 'cash', status: 'completed', transaction_id: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      amount: parseFloat(form.amount),
      payment_mode: form.payment_mode as any,
      status: form.status as any,
      merchant_id: form.merchant_id || null,
      client_id: form.client_id || null,
      transaction_id: form.transaction_id || null,
      order_id: null,
    }
    await create(payload as any)
    navigate('/admin/payments')
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">Add Payment</h1>

      <div className="rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <table className="w-full max-w-xl text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Merchant:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.merchant_id} onChange={(e) => setForm({ ...form, merchant_id: e.target.value })}>
                    <option value="">--- Select ---</option>
                    {merchants.map(m => <option key={m.id} value={m.id}>{m.store_name}</option>)}
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Client:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
                    <option value="">--- Select ---</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Amount (₹):</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Payment Mode:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.payment_mode} onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="netbanking">Net Banking</option>
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Transaction ID:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.transaction_id} onChange={(e) => setForm({ ...form, transaction_id: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Status:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/payments')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
