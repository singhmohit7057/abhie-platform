import { useState, useEffect } from 'react'
import { BarChart3, Receipt, Banknote, Gift } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatCurrency, formatDate } from '../../lib/utils'

type ReportTab = 'sales' | 'payment_mode' | 'settlement' | 'cashback'

export function MerchantReports() {
  const [tab, setTab] = useState<ReportTab>('sales')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReport() {
      setLoading(true)
      let result

      if (tab === 'sales') {
        result = await supabase.from('payments').select('*').eq('status', 'completed').order('created_at', { ascending: false }).limit(50)
      } else if (tab === 'payment_mode') {
        result = await supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(50)
      } else if (tab === 'settlement') {
        result = await supabase.from('settlements').select('*').order('created_at', { ascending: false }).limit(50)
      } else {
        result = await supabase.from('redemptions').select('*').order('created_at', { ascending: false }).limit(50)
      }

      setData(result.data || [])
      setLoading(false)
    }
    fetchReport()
  }, [tab])

  const tabs = [
    { key: 'sales' as const, label: 'Sales', icon: BarChart3 },
    { key: 'payment_mode' as const, label: 'Payment Mode', icon: Receipt },
    { key: 'settlement' as const, label: 'Settlement', icon: Banknote },
    { key: 'cashback' as const, label: 'Cashback', icon: Gift },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Reports</h1>

      <div className="mb-6 flex flex-wrap gap-2">
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
                {tab === 'sales' && <><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></>}
                {tab === 'payment_mode' && <><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">Transaction ID</th><th className="px-4 py-3">Date</th></>}
                {tab === 'settlement' && <><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Period</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></>}
                {tab === 'cashback' && <><th className="px-4 py-3">Points</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Date</th></>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((row) => (
                <tr key={row.id} className="bg-white">
                  {tab === 'sales' && <><td className="px-4 py-3">{formatCurrency(row.amount)}</td><td className="px-4 py-3">{row.payment_mode?.toUpperCase()}</td><td className="px-4 py-3">{row.status}</td><td className="px-4 py-3">{formatDate(row.created_at)}</td></>}
                  {tab === 'payment_mode' && <><td className="px-4 py-3">{formatCurrency(row.amount)}</td><td className="px-4 py-3">{row.payment_mode?.toUpperCase()}</td><td className="px-4 py-3">{row.transaction_id || '-'}</td><td className="px-4 py-3">{formatDate(row.created_at)}</td></>}
                  {tab === 'settlement' && <><td className="px-4 py-3">{formatCurrency(row.amount)}</td><td className="px-4 py-3">{formatDate(row.period_from)} - {formatDate(row.period_to)}</td><td className="px-4 py-3">{row.status}</td><td className="px-4 py-3">{formatDate(row.created_at)}</td></>}
                  {tab === 'cashback' && <><td className="px-4 py-3">{row.points_redeemed}</td><td className="px-4 py-3">₹{row.amount_redeemed}</td><td className="px-4 py-3">{formatDate(row.created_at)}</td></>}
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
