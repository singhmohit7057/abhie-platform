import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../lib/utils'
import { useCart } from './useCart'
import toast from 'react-hot-toast'

export function Checkout() {
  const { items, total, totalMrp, savings, clearCart } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMode: 'cod',
  })

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const delivery = total < 499 ? 49 : 0
  const finalTotal = total + delivery

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error('Please fill all required fields')
      return
    }
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 1500))
    clearCart()
    toast.success('Order placed successfully!')
    navigate('/account/orders')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handlePlace} className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* Delivery Address */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border p-6">
            <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Address *</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">City *</label>
                <input name="city" value={form.city} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">State</label>
                <input name="state" value={form.state} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Pincode *</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="rounded-xl border p-6">
            <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
            <div className="mt-4 space-y-3">
              {[
                { value: 'cod', label: 'Cash on Delivery' },
                { value: 'upi', label: 'UPI / Google Pay / PhonePe' },
                { value: 'card', label: 'Credit / Debit Card' },
                { value: 'netbanking', label: 'Net Banking' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:border-brand-300">
                  <input
                    type="radio"
                    name="paymentMode"
                    value={opt.value}
                    checked={form.paymentMode === opt.value}
                    onChange={handleChange}
                    className="h-4 w-4 text-brand-600"
                  />
                  <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            {items.map(({ item, quantity }) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600 line-clamp-1 flex-1">{item.name} x{quantity}</span>
                <span className="ml-2 text-gray-900">{formatCurrency(item.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(totalMrp)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-brand-600">
                <span>Discount</span>
                <span>- {formatCurrency(savings)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className={delivery === 0 ? 'text-brand-600' : ''}>{delivery === 0 ? 'FREE' : formatCurrency(delivery)}</span>
            </div>
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={placing}
            className="mt-4 w-full rounded-lg bg-brand-700 py-3 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
          >
            {placing ? 'Placing Order...' : `Place Order — ${formatCurrency(finalTotal)}`}
          </button>
        </div>
      </form>
    </div>
  )
}
