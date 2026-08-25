import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatCurrency } from '../lib/utils'
import type { Item } from '../types'

export function StoreHome() {
  const [featured, setFeatured] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8)
      setFeatured(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold sm:text-5xl">Shop the Best Deals</h1>
            <p className="mt-4 text-lg text-brand-100">
              Discover amazing discounts on electronics, fashion, home & more.
              Flat 20% off on your first order!
            </p>
            <Link
              to="/catalog"
              className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-brand-700 hover:bg-brand-50"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { name: 'Smartphones', emoji: '📱' },
            { name: 'Laptops', emoji: '💻' },
            { name: 'TVs', emoji: '📺' },
            { name: 'Appliances', emoji: '🏠' },
            { name: 'Apparels', emoji: '👕' },
            { name: 'Sports', emoji: '⚽' },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/catalog?category=${cat.name.toLowerCase()}`}
              className="flex flex-col items-center gap-2 rounded-xl border p-4 hover:border-brand-300 hover:shadow-sm transition"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Featured Products</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : featured.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No products available yet. Check back soon!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="group rounded-xl border p-4 hover:shadow-md transition"
              >
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="mb-3 h-48 w-full rounded-lg object-cover" />
                ) : (
                  <div className="mb-3 flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-brand-700 line-clamp-2">{item.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</span>
                  {item.mrp > item.price && (
                    <>
                      <span className="text-sm text-gray-400 line-through">{formatCurrency(item.mrp)}</span>
                      <span className="text-xs font-medium text-brand-600">{item.discount_percentage}% off</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Promo Section */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-orange-50 p-6 border border-orange-100">
              <h3 className="font-bold text-orange-800">Flash Sale</h3>
              <p className="mt-1 text-sm text-orange-600">Up to 50% off on electronics</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-6 border border-blue-100">
              <h3 className="font-bold text-blue-800">New Arrivals</h3>
              <p className="mt-1 text-sm text-blue-600">Explore latest collection</p>
            </div>
            <div className="rounded-xl bg-purple-50 p-6 border border-purple-100">
              <h3 className="font-bold text-purple-800">Redeem Points</h3>
              <p className="mt-1 text-sm text-purple-600">Use your membership card points</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
