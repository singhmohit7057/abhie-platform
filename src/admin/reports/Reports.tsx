import { useState, useEffect } from 'react'
import { BarChart3, Users, CreditCard } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'

type ReportTab = 'reseller' | 'payment' | 'membership'

export function Reports() {
  const [tab, setTab] = useState<ReportTab>('reseller')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReport() {
      setLoading(true)
      let result

      if (tab === 'reseller') {
        result = await supabase.from('merchants').select('id, store_name, commission_rate, is_active, created_at')
      } else if (tab === 'payment') {
        result = await supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(50)
      } else {
        result = await supabase.from('cards').select('*').order('created_at', { ascending: false }).limit(50)
      }

      setData(result.data || [])
      setLoading(false)
    }
    fetchReport()
  }, [tab])

  const tabs = [
    { key: 'reseller' as const, label: 'Reseller Reports', icon: Users },
    { key: 'payment' as const, label: 'Payment Reports', icon: BarChart3 },
    { key: 'membership' as const, label: 'Membership Card', icon: CreditCard },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Reports</h1>

      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.key ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                {tab === 'reseller' && <><th className="px-4 py-3">Store Name</th><th className="px-4 py-3">Commission %</th><th className="px-4 py-3">Status</th></>}
                {tab === 'payment' && <><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></>}
                {tab === 'membership' && <><th className="px-4 py-3">Card Number</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Balance</th><th className="px-4 py-3">Points</th></>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((row) => (
                <tr key={row.id} className="bg-white">
                  {tab === 'reseller' && <><td className="px-4 py-3">{row.store_name}</td><td className="px-4 py-3">{row.commission_rate}%</td><td className="px-4 py-3">{row.is_active ? 'Active' : 'Inactive'}</td></>}
                  {tab === 'payment' && <><td className="px-4 py-3">{formatCurrency(row.amount)}</td><td className="px-4 py-3">{row.payment_mode?.toUpperCase()}</td><td className="px-4 py-3">{row.status}</td><td className="px-4 py-3">{new Date(row.created_at).toLocaleDateString()}</td></>}
                  {tab === 'membership' && <><td className="px-4 py-3">{row.card_number}</td><td className="px-4 py-3">{row.card_type}</td><td className="px-4 py-3">₹{row.balance}</td><td className="px-4 py-3">{row.points}</td></>}
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-900">No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
