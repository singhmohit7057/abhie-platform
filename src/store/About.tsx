import { Users, ShieldCheck, Truck, HeartHandshake } from 'lucide-react'

export function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-brand-700 to-green-900 text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">About Abhi-E</h1>
          <p className="mt-4 text-lg text-brand-100">
            India's trusted discount & loyalty engine — connecting merchants, customers, and communities.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Abhi-E was born in Jamshedpur with a simple mission — make loyalty programs accessible to every local business.
          We noticed that big brands had sophisticated discount engines, membership cards, and cashback systems,
          while local shops relied on paper punch cards or nothing at all.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          We built Abhi-E to bridge that gap. Our platform empowers merchants (resellers) to offer loyalty cards,
          vouchers, and cashback to their customers — all powered by a simple digital system.
          Whether you're a mobile shop in Sakchi or a clothing store in Bistupur, Abhi-E gives you enterprise-grade
          loyalty tools at zero upfront cost.
        </p>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">Why Choose Us</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, title: 'Community First', desc: 'Built for local businesses and their customers' },
              { icon: ShieldCheck, title: 'Trusted Platform', desc: 'Secure transactions with complete transparency' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Quick fulfillment with real-time order tracking' },
              { icon: HeartHandshake, title: 'Partner Growth', desc: 'Merchants grow with our loyalty & cashback tools' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 text-center sm:grid-cols-4">
          {[
            { value: '500+', label: 'Merchants' },
            { value: '10,000+', label: 'Customers' },
            { value: '25+', label: 'Cities' },
            { value: '₹2Cr+', label: 'Transactions' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-brand-700">{value}</p>
              <p className="mt-1 text-sm text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Our Team</h2>
          <p className="mt-4 text-gray-600">
            A passionate team from Jamshedpur building technology that empowers local businesses across India.
          </p>
        </div>
      </section>
    </div>
  )
}
