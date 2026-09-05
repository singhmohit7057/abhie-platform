import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCRUD } from '../../hooks/useCRUD'
import { Button } from '../../components/ui/Button'
import type { Card, Merchant } from '../../types'

export function AddCards() {
  const { data: allCards, create } = useCRUD<Card>({ table: 'cards' })
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })
  const navigate = useNavigate()

  const today = new Date()
  const dateStr = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`
  const offlinePrefix = `ABHIE10${dateStr}`

  const offlineCards = useMemo(() => allCards.filter((c) => c.card_number.startsWith('ABHIE1')), [allCards])

  const lastCardNumber = useMemo(() => {
    if (offlineCards.length === 0) return 'None'
    const sorted = [...offlineCards].sort((a, b) => a.card_number > b.card_number ? -1 : 1)
    return sorted[0].card_number
  }, [offlineCards])

  const nextFrom = useMemo(() => {
    if (offlineCards.length === 0) return '1'
    const sorted = [...offlineCards].sort((a, b) => a.card_number > b.card_number ? -1 : 1)
    const lastCard = sorted[0].card_number as string
    const lastDigits = parseInt(lastCard.slice(-5))
    return String(lastDigits + 1)
  }, [offlineCards])

  const [form, setForm] = useState({
    type: '', from: '1', to: '', merchant_id: '',
  })

  useEffect(() => {
    setForm(f => ({ ...f, from: nextFrom }))
  }, [nextFrom])

  const cardCount = (() => {
    const fromNum = parseInt(form.from)
    const toNum = parseInt(form.to)
    if (isNaN(fromNum) || isNaN(toNum) || toNum < fromNum) return 0
    return toNum - fromNum + 1
  })()

  const previewCard = form.from ? `${offlinePrefix}${String(parseInt(form.from)).padStart(5, '0')}` : ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fromNum = parseInt(form.from)
    const toNum = parseInt(form.to)
    if (isNaN(fromNum) || isNaN(toNum) || toNum < fromNum) return

    for (let i = fromNum; i <= toNum; i++) {
      const cardNumber = `${offlinePrefix}${String(i).padStart(5, '0')}`
      await create({
        card_number: cardNumber,
        merchant_id: form.merchant_id || null,
        card_type: form.type || 'Membership Card',
        balance: 0,
        points: 0,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_active: true,
        client_id: null,
      } as any)
    }
    navigate('/admin/cards')
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">Add/Edit Cards</h1>

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Last assigned card number: <strong>{lastCardNumber}</strong>
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <strong>Card Format:</strong> ABHIE + [1=Offline, 2=Online] + 0 + [ddmmyyyy] + [5-digit sequence]
        <br />
        <span className="text-xs text-gray-900">Example: {offlinePrefix}00001</span>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <table className="w-full max-w-xl text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium text-gray-700 whitespace-nowrap">Card Prefix (auto):</td>
                <td className="py-3">
                  <input className="w-full rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={offlinePrefix} disabled />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium text-gray-700 whitespace-nowrap">Type:</td>
                <td className="py-3">
                  <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="">--- Select ---</option>
                    <option value="Membership Card">Membership Card</option>
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium text-gray-700 whitespace-nowrap">From:</td>
                <td className="py-3">
                  <input className="rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" type="number" value={form.from} readOnly />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium text-gray-700 whitespace-nowrap">To:</td>
                <td className="py-3">
                  <input className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" placeholder="End" type="number" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required />
                  {cardCount > 0 && <p className="mt-1 text-xs font-medium text-green-700">Total cards to create: {cardCount}</p>}
                </td>
              </tr>
              {previewCard && form.to && (
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-700 whitespace-nowrap">Preview:</td>
                  <td className="py-3 text-xs text-gray-600">
                    First: <strong>{offlinePrefix}{String(parseInt(form.from)).padStart(5, '0')}</strong>
                    <br />
                    Last: <strong>{offlinePrefix}{String(parseInt(form.to)).padStart(5, '0')}</strong>
                  </td>
                </tr>
              )}
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium text-gray-700 whitespace-nowrap">Select Reseller:</td>
                <td className="py-3">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.merchant_id} onChange={(e) => setForm({ ...form, merchant_id: e.target.value })}>
                    <option value="">--- Select ---</option>
                    {merchants.map(m => <option key={m.id} value={m.id}>{m.store_name} ({m.business_type})</option>)}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 flex gap-2">
            <Button type="submit">Submit</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/cards')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
