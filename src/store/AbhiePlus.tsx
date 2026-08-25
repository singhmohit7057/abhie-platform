import { Gift, Truck, Zap, ShoppingBag, Diamond, RotateCcw, Star } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Lifetime Free Shipping',
    description: 'Enjoy unlimited free deliveries on all your orders, no matter the size. Save on every purchase!',
    color: 'text-red-600',
  },
  {
    icon: Gift,
    title: 'Exclusive Vouchers',
    description: 'Get access to exclusive deals, monthly vouchers, and special discount coupons just for Plus members.',
    color: 'text-red-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Delivery',
    description: 'Priority processing and express shipping. Get your orders delivered faster than ever before.',
    color: 'text-yellow-500',
  },
  {
    icon: ShoppingBag,
    title: 'Early Access to Sales',
    description: 'Be the first to know about new launches and exclusive sales. Shop before anyone else!',
    color: 'text-red-600',
  },
  {
    icon: Diamond,
    title: 'Premium Support',
    description: 'Get dedicated customer support with priority assistance for all your queries and concerns.',
    color: 'text-blue-600',
  },
  {
    icon: RotateCcw,
    title: 'Extended Returns',
    description: 'Enjoy 60-day return window instead of 30 days. More time to decide if you love your purchase.',
    color: 'text-teal-600',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    initials: 'PR',
    color: 'bg-red-600',
    rating: 5,
    review: '"Abhie Plus has been a game-changer! Free shipping on all orders saves me so much money. The exclusive vouchers are amazing, and I get my orders super fast. Totally worth it!"',
  },
  {
    name: 'Rahul Kumar',
    initials: 'RK',
    color: 'bg-brand-600',
    rating: 5,
    review: '"Best investment I\'ve made this year! The priority delivery is fantastic, and I love getting early access to sales. Already saved more than what I paid for the membership."',
  },
  {
    name: 'Anjali Nair',
    initials: 'AN',
    color: 'bg-blue-600',
    rating: 5,
    review: '"I shop frequently, and Abhie Plus has made my experience so much better. The extended return policy gives me peace of mind, and the customer support is excellent!"',
  },
  {
    name: 'Vikram Mehta',
    initials: 'VM',
    color: 'bg-red-500',
    rating: 5,
    review: '"Absolutely love the bonus reward points! Every purchase earns me more points, and I\'ve already redeemed them for great discounts. Abhie Plus is a must-have for regular shoppers."',
  },
]

export function AbhiePlus() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 text-center">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute top-8 left-12 text-4xl">🛒</div>
          <div className="absolute top-12 right-16 text-4xl">💰</div>
          <div className="absolute bottom-16 left-20 text-3xl">🎁</div>
          <div className="absolute top-20 right-1/4 text-3xl">⚡</div>
          <div className="absolute bottom-12 right-12 text-4xl">📦</div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700">
            <Star size={14} className="fill-red-600 text-red-600" /> PREMIUM MEMBERSHIP
          </span>
          <h1 className="mt-4 text-4xl font-bold text-red-700 md:text-5xl">Abhie Plus</h1>
          <p className="mt-3 text-lg text-gray-600">
            Unlock savings of ₹10,000+ annually on your shopping
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-xl border border-gray-200 p-6 transition hover:shadow-lg">
              <benefit.icon size={40} className={benefit.color} />
              <h3 className="mt-4 text-lg font-semibold text-red-700">{benefit.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Savings Banner */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 to-red-800 p-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Annual savings of</p>
            <p className="text-4xl font-bold">₹10,000+</p>
            <p className="text-sm opacity-90">On Shipping & Exclusive Deals</p>
          </div>
          <div className="mt-4 text-6xl md:mt-0">🐷</div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 text-center">
        <p className="text-5xl font-bold text-red-700">10,000+</p>
        <p className="mt-2 text-lg text-gray-600">Happy Customers</p>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold text-red-700">What Our Plus Members Say</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-sm font-bold text-white`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">{t.review}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 text-center">
        <button className="rounded-full bg-red-700 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-red-800 hover:shadow-xl">
          Get Plus Now - ₹1,000/Year
        </button>
      </section>
    </div>
  )
}
