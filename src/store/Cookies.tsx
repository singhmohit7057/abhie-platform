export function Cookies() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: 22 August 2026</p>

      <div className="mt-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900">1. What Are Cookies</h2>
          <p className="mt-2">Cookies are small text files stored on your device when you visit our platform. They help us provide a better experience by remembering your preferences, keeping you logged in, and understanding how you use our services.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">2. Types of Cookies We Use</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-semibold">Type</th>
                  <th className="py-2 pr-4 text-left font-semibold">Purpose</th>
                  <th className="py-2 text-left font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="py-2 pr-4 font-medium">Essential</td><td className="py-2 pr-4">Authentication, security, cart functionality</td><td className="py-2">Session</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Functional</td><td className="py-2 pr-4">Language preferences, recently viewed items</td><td className="py-2">1 year</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Analytics</td><td className="py-2 pr-4">Page views, user behavior, performance metrics</td><td className="py-2">2 years</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Marketing</td><td className="py-2 pr-4">Personalized offers, retargeting ads</td><td className="py-2">90 days</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">3. Essential Cookies</h2>
          <p className="mt-2">These cookies are strictly necessary for the platform to function. They enable core features like:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Maintaining your login session.</li>
            <li>Storing items in your shopping cart.</li>
            <li>Processing secure payments.</li>
            <li>Remembering your loyalty card authentication.</li>
          </ul>
          <p className="mt-2">These cannot be disabled as they are required for basic platform operation.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">4. Local Storage</h2>
          <p className="mt-2">In addition to cookies, we use browser local storage for:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Shopping cart persistence (so your cart survives page refreshes).</li>
            <li>Theme and display preferences.</li>
            <li>Cached data for faster page loads.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">5. Third-Party Cookies</h2>
          <p className="mt-2">We may use third-party services that set their own cookies:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li><strong>Google Analytics</strong> — Website traffic and usage analytics.</li>
            <li><strong>Payment Gateways</strong> — Secure transaction processing.</li>
            <li><strong>Social Media</strong> — Share buttons and embedded content.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">6. Managing Cookies</h2>
          <p className="mt-2">You can manage cookies through your browser settings:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li><strong>Chrome</strong> — Settings → Privacy and Security → Cookies</li>
            <li><strong>Firefox</strong> — Settings → Privacy & Security → Cookies</li>
            <li><strong>Safari</strong> — Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge</strong> — Settings → Cookies and Site Permissions</li>
          </ul>
          <p className="mt-2">Note: Disabling essential cookies may prevent certain features from functioning correctly.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">7. Contact</h2>
          <p className="mt-2">For questions about our cookie practices, contact us at <strong>care@abhie.com</strong>.</p>
        </section>
      </div>
    </div>
  )
}
