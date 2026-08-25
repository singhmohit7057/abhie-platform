import { RotateCcw, Clock, CheckCircle, XCircle } from 'lucide-react'

export function Returns() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Returns & Refund Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: 22 August 2026</p>

      {/* Highlights */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: RotateCcw, title: '7-Day Returns', desc: 'Easy return within 7 days of delivery' },
          { icon: Clock, title: 'Refund in 5-7 Days', desc: 'After pickup, refund within 5-7 business days' },
          { icon: CheckCircle, title: 'Free Pickup', desc: 'We arrange doorstep pickup at no cost' },
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
          <h2 className="text-lg font-bold text-gray-900">1. Return Eligibility</h2>
          <p className="mt-2">You may return a product within <strong>7 days</strong> from the date of delivery if:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>The product is defective, damaged, or not as described.</li>
            <li>You received a wrong item.</li>
            <li>The product is unused, in original packaging with all tags/accessories intact.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">2. Non-Returnable Items</h2>
          <div className="mt-3 rounded-lg bg-red-50 border border-red-100 p-4">
            <div className="flex items-start gap-2">
              <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              <ul className="list-disc pl-4 space-y-1">
                <li>Innerwear, lingerie, and swimwear.</li>
                <li>Personal care products (opened/used).</li>
                <li>Customized or personalized items.</li>
                <li>Perishable goods (food, flowers).</li>
                <li>Digital products (gift cards, vouchers once redeemed).</li>
                <li>Items marked "Non-Returnable" on the product page.</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">3. How to Initiate a Return</h2>
          <ol className="mt-2 list-decimal pl-6 space-y-2">
            <li>Go to <strong>My Account → My Orders</strong> and select the order.</li>
            <li>Click <strong>"Return Item"</strong> and select a reason.</li>
            <li>Upload photos if the product is damaged/defective.</li>
            <li>Once approved, a pickup will be scheduled within 24-48 hours.</li>
            <li>Pack the item securely in original packaging.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">4. Refund Process</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-semibold">Payment Method</th>
                  <th className="py-2 pr-4 text-left font-semibold">Refund Mode</th>
                  <th className="py-2 text-left font-semibold">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="py-2 pr-4">UPI / Net Banking</td><td className="py-2 pr-4">Original payment method</td><td className="py-2">5-7 business days</td></tr>
                <tr><td className="py-2 pr-4">Credit / Debit Card</td><td className="py-2 pr-4">Original card</td><td className="py-2">7-10 business days</td></tr>
                <tr><td className="py-2 pr-4">Cash on Delivery</td><td className="py-2 pr-4">Bank transfer (NEFT)</td><td className="py-2">7-10 business days</td></tr>
                <tr><td className="py-2 pr-4">Loyalty Points</td><td className="py-2 pr-4">Points credited back</td><td className="py-2">Instant</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">5. Exchange Policy</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Exchanges are available for size/color changes within 7 days.</li>
            <li>Subject to stock availability of the replacement item.</li>
            <li>If the replacement costs more, you pay the difference; if less, the balance is refunded.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">6. Cancellation</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Orders can be cancelled before dispatch at no cost.</li>
            <li>Once shipped, the order must be received and then returned.</li>
            <li>Cancellation requests can be made from My Account → My Orders.</li>
            <li>Refund for cancelled prepaid orders is processed within 3-5 business days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">7. Damaged / Wrong Items</h2>
          <p className="mt-2">If you receive a damaged or wrong item:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Report within 48 hours of delivery with photos.</li>
            <li>We will arrange a free pickup and send a replacement or full refund.</li>
            <li>No return shipping charges apply for damaged/wrong items.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">8. Contact</h2>
          <p className="mt-2">For return and refund queries, contact us at <strong>care@abhie.com</strong> or call <strong>+91-9117115050</strong> (Mon-Sat, 10 AM - 7 PM).</p>
        </section>
      </div>
    </div>
  )
}
