import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '../lib/utils'
import { useCart } from './useCart'
import type { Item } from '../types'
import toast from 'react-hot-toast'

export function Wishlist() {
  const { addItem } = useCart()

  const wishlistItems: Item[] = []

  const handleAdd = (item: Item) => {
    addItem(item)
    toast.success('Added to cart')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="py-16 text-center">
          <Heart size={48} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-gray-500">Save items you like and buy them later.</p>
          <Link to="/catalog" className="mt-6 inline-block rounded-lg bg-brand-700 px-6 py-3 text-sm font-medium text-white hover:bg-brand-800">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-48 w-full rounded-lg object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-400">No Image</div>
              )}
              <h3 className="mt-3 text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-bold text-gray-900">{formatCurrency(item.price)}</span>
                {item.mrp > item.price && (
                  <span className="text-xs text-gray-400 line-through">{formatCurrency(item.mrp)}</span>
                )}
              </div>
              <button
                onClick={() => handleAdd(item)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 py-2 text-sm font-medium text-white hover:bg-brand-800"
              >
                <ShoppingCart size={14} /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
