import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatCurrency } from '../lib/utils'
import { ShoppingCart } from 'lucide-react'
import { useCart } from './useCart'
import type { Item, Category } from '../types'
import toast from 'react-hot-toast'

export function Catalog() {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()

  const search = searchParams.get('search') || ''
  const categoryFilter = searchParams.get('category') || ''

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const [itemsRes, catsRes] = await Promise.all([
        supabase.from('items').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('categories').select('*').eq('is_active', true),
      ])
      setItems(itemsRes.data || [])
      setCategories(catsRes.data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = items.filter((item) => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || item.name.toLowerCase().includes(categoryFilter.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (e: React.MouseEvent, item: Item) => {
    e.preventDefault()
    addItem(item)
    toast.success(`${item.name} added to cart`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-56 shrink-0">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 uppercase">Categories</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setSearchParams({})}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm ${!categoryFilter ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setSearchParams({ category: cat.slug })}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm ${categoryFilter === cat.slug ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {search ? `Results for "${search}"` : categoryFilter ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1) : 'All Products'}
            </h1>
            <span className="text-sm text-gray-500">{filtered.length} products</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No products found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group rounded-xl border p-4 hover:shadow-md transition relative"
                >
                  {item.discount_percentage > 0 && (
                    <span className="absolute top-3 left-3 rounded bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
                      {item.discount_percentage}% OFF
                    </span>
                  )}
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="mb-3 h-48 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="mb-3 flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-brand-700 line-clamp-2">{item.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-gray-400 line-through">{formatCurrency(item.mrp)}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      className="rounded-lg bg-brand-50 p-2 text-brand-700 hover:bg-brand-100"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
