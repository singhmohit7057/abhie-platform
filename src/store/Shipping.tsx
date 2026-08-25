import { Truck, Clock, MapPin, AlertCircle } from 'lucide-react'

export function Shipping() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Shipping Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: 22 August 2026</p>

      {/* Highlights */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹499' },
          { icon: Clock, title: '3-7 Days', desc: 'Standard delivery time' },
          { icon: MapPin, title: 'Pan India', desc: 'We deliver across India' },
          { icon: AlertCircle, title: '₹49 Flat', desc: 'For orders below ₹499' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border p-4 text-center">
            <Icon size={24} className="mx-auto text-brand-600" />
            <h3 className="mt-2 font-bold text-gray-900 text-sm">{title}</h3>
            <p className="mt-1 text-xs text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900">1. Shipping Charges</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-semibold">Order Value</th>
                  <th className="py-2 pr-4 text-left font-semibold">Shipping Fee</th>
                  <th className="py-2 text-left font-semibold">Delivery Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="py-2 pr-4">Below ₹499</td><td className="py-2 pr-4">₹49</td><td className="py-2">5-7 business days</td></tr>
                <tr><td className="py-2 pr-4">₹499 and above</td><td className="py-2 pr-4 text-brand-600 font-medium">FREE</td><td className="py-2">3-5 business days</td></tr>
                <tr><td className="py-2 pr-4">Express Delivery</td><td className="py-2 pr-4">₹99</td><td className="py-2">1-2 business days</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">2. Delivery Areas</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>We deliver to all serviceable pin codes across India.</li>
            <li>Enter your pin code at checkout to verify delivery availability.</li>
            <li>Certain remote areas may have extended delivery timelines (7-10 business days).</li>
            <li>Currently, we do not offer international shipping.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">3. Order Processing</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Orders placed before 2:00 PM are processed the same day (Mon-Sat).</li>
            <li>Orders placed after 2:00 PM or on Sundays/holidays are processed the next business day.</li>
            <li>You will receive an order confirmation email/SMS with tracking details once shipped.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">4. Order Tracking</h2>
          <p className="mt-2">Once your order is dispatched, you will receive a tracking ID via SMS/email. You can track your order:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>From your Account → My Orders section.</li>
            <li>Using the tracking link sent via SMS/email.</li>
            <li>By contacting our support team with your order ID.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">5. Failed Delivery</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>If delivery is attempted and you are unavailable, the courier will make up to 2 additional attempts.</li>
            <li>After 3 failed attempts, the order will be returned to our warehouse.</li>
            <li>For COD orders, a re-delivery charge of ₹49 may apply.</li>
            <li>For prepaid orders, a full refund will be initiated upon return.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">6. Contact</h2>
          <p className="mt-2">For shipping-related queries, contact us at <strong>care@abhie.com</strong> or call <strong>+91-9117115050</strong> (Mon-Sat, 10 AM - 7 PM).</p>
        </section>
      </div>
    </div>
  )
}
