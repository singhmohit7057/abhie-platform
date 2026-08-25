import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields')
      return
    }
    setSending(true)
    await new Promise((r) => setTimeout(r, 1200))
    toast.success('Message sent! We will get back to you soon.')
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-brand-700 to-green-900 text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Contact Us</h1>
          <p className="mt-4 text-lg text-brand-100">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Get in Touch</h2>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Office Address</h3>
                <p className="mt-1 text-sm text-gray-600">Jamshedpur, Jharkhand 831001, India</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Phone size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="mt-1 text-sm text-gray-600">+91-9117115050</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Mail size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="mt-1 text-sm text-gray-600">care@abhie.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Business Hours</h3>
                <p className="mt-1 text-sm text-gray-600">Mon - Sat: 10:00 AM - 7:00 PM</p>
                <p className="text-sm text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="">Select a topic</option>
                    <option value="order">Order Issue</option>
                    <option value="refund">Refund / Return</option>
                    <option value="merchant">Become a Merchant</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="mt-4 rounded-lg bg-brand-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
