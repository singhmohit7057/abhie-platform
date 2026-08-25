import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../lib/utils'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from './useCart'
import toast from 'react-hot-toast'

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, totalMrp, savings } = useCart()
  const [couponCode, setCouponCode] = useState('')

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Add items to your cart and they will appear here.</p>
        <Link to="/catalog" className="mt-6 inline-block rounded-lg bg-brand-700 px-6 py-3 text-sm font-medium text-white hover:bg-brand-800">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({items.length} items)</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ item, quantity }) => (
            <div key={item.id} className="flex gap-4 rounded-xl border p-4">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-24 w-24 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs shrink-0">
                  No Image
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link to={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-brand-700 line-clamp-1">
                    {item.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-bold text-gray-900">{formatCurrency(item.price)}</span>
                    {item.mrp > item.price && (
                      <span className="text-sm text-gray-400 line-through">{formatCurrency(item.mrp)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded border">
                    <button onClick={() => updateQuantity(item.id, quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-50">
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
                    <button onClick={() => updateQuantity(item.id, quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-50">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => { removeItem(item.id); toast.success('Removed') }} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => { clearCart(); toast.success('Cart cleared') }} className="text-sm text-red-600 hover:underline">
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal (MRP)</span>
              <span className="text-gray-900">{formatCurrency(totalMrp)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-brand-600">
                <span>Discount</span>
                <span>- {formatCurrency(savings)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className="text-brand-600">{total >= 499 ? 'FREE' : formatCurrency(49)}</span>
            </div>
          </div>

          {/* Coupon */}
          <div className="mt-4 border-t pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
              <button className="rounded-lg bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100">
                Apply
              </button>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(total + (total < 499 ? 49 : 0))}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-4 block w-full rounded-lg bg-brand-700 py-3 text-center text-sm font-medium text-white hover:bg-brand-800"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
