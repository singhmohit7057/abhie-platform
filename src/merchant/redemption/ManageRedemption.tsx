import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { useMerchantId } from '../../hooks/useMerchantId'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { formatDate } from '../../lib/utils'
import type { Redemption, Card, Client } from '../../types'

export function ManageRedemption() {
  const merchantId = useMerchantId()
  const { data, loading, create } = useCRUD<Redemption>({ table: 'redemptions', filters: merchantId ? { merchant_id: merchantId } : undefined, skip: !merchantId })
  const { data: cards } = useCRUD<Card>({ table: 'cards' })
  const { data: clients } = useCRUD<Client>({ table: 'clients' })
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ points_redeemed: '0', amount_redeemed: '0' })

  const getCardNumber = (cardId: string | null) => {
    if (!cardId) return '—'
    const card = cards.find(c => c.id === cardId)
    return card?.card_number || '—'
  }

  const getClientName = (clientId: string | null) => {
    if (!clientId) return '—'
    const client = clients.find(c => c.id === clientId)
    return client?.name || '—'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await create({
      points_redeemed: parseInt(form.points_redeemed),
      amount_redeemed: parseFloat(form.amount_redeemed),
    } as any)
    setModalOpen(false)
    setForm({ points_redeemed: '0', amount_redeemed: '0' })
  }

  const columns = [
    { key: 'card_id', label: 'Card Number', render: (r: Redemption) => getCardNumber(r.card_id) },
    { key: 'client_id', label: 'Customer', render: (r: Redemption) => getClientName(r.client_id) },
    { key: 'points_redeemed', label: 'Points Redeemed' },
    { key: 'amount_redeemed', label: 'Amount', render: (r: Redemption) => `₹${r.amount_redeemed}` },
    { key: 'created_at', label: 'Date', render: (r: Redemption) => formatDate(r.created_at) },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Redemptions</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Redeem</Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Redemption">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Points to Redeem" type="number" value={form.points_redeemed} onChange={(e) => setForm({ ...form, points_redeemed: e.target.value })} required />
          <Input label="Amount (₹)" type="number" value={form.amount_redeemed} onChange={(e) => setForm({ ...form, amount_redeemed: e.target.value })} required />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Redeem</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
