import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatCurrency } from '../lib/utils'
import { ShoppingCart, Heart, Minus, Plus, ArrowLeft } from 'lucide-react'
import { useCart } from './useCart'
import type { Item } from '../types'
import toast from 'react-hot-toast'

export function ProductDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetch() {
      if (!id) return
      const { data } = await supabase.from('items').select('*').eq('id', id).single()
      setItem(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <Link to="/catalog" className="mt-4 inline-block text-brand-700 hover:underline">
          Browse products
        </Link>
      </div>
    )
  }

  const handleAdd = () => {
    addItem(item, qty)
    toast.success(`${item.name} added to cart`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/catalog" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-700">
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div>
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full rounded-xl object-cover" />
          ) : (
            <div className="flex h-96 items-center justify-center rounded-xl bg-gray-100 text-gray-400 text-lg">
              No Image Available
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">{item.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatCurrency(item.price)}</span>
            {item.mrp > item.price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(item.mrp)}</span>
                <span className="rounded bg-brand-100 px-2 py-0.5 text-sm font-bold text-brand-700">
                  {item.discount_percentage}% OFF
                </span>
              </>
            )}
          </div>

          {item.mrp > item.price && (
            <p className="mt-1 text-sm text-brand-600">You save {formatCurrency(item.mrp - item.price)}</p>
          )}

          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {item.description || 'No description available for this product.'}
            </p>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`inline-block h-2 w-2 rounded-full ${item.stock_quantity > 0 ? 'bg-brand-500' : 'bg-red-500'}`} />
              {item.stock_quantity > 0 ? `In Stock (${item.stock_quantity} available)` : 'Out of Stock'}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-50">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAdd}
              disabled={item.stock_quantity <= 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-700 px-6 py-3 font-medium text-white hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-3 text-gray-600 hover:bg-gray-50">
              <Heart size={18} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="mt-8 rounded-lg bg-gray-50 p-4 space-y-2 text-sm text-gray-600">
            <p>Free delivery on orders above ₹499</p>
            <p>7-day easy returns</p>
            <p>Cash on Delivery available</p>
          </div>
        </div>
      </div>
    </div>
  )
}
