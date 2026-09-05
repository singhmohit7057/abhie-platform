import { useState } from 'react'
import { useCRUD } from '../../hooks/useCRUD'
import { useMerchantId } from '../../hooks/useMerchantId'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import type { Card, Client } from '../../types'

type StatusFilter = '' | 'available' | 'issued'

export function MerchantViewCards() {
  const merchantId = useMerchantId()
  const { data, loading, update } = useCRUD<Card>({ table: 'cards', orderBy: 'card_number', ascending: true, filters: merchantId ? { merchant_id: merchantId } : undefined })
  const { data: clients } = useCRUD<Client>({ table: 'clients' })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [clientId, setClientId] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')
  const [membershipFilter, setMembershipFilter] = useState('')
  const [clientStatusFilter, setClientStatusFilter] = useState('')

  const getClientName = (cId: string | null) => {
    if (!cId) return '—'
    const client = clients.find(c => c.id === cId)
    return client?.name || '—'
  }

  const openIssue = (card: Card) => {
    setSelectedCard(card)
    setClientId('')
    setModalOpen(true)
  }

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCard && clientId) {
      await update(selectedCard.id, { client_id: clientId } as any)
    }
    setModalOpen(false)
  }

  const columns = [
    { key: 'card_number', label: 'Card Number' },
    { key: 'card_type', label: 'Type' },
    { key: 'client_id', label: 'Issued To', render: (c: Card) => getClientName(c.client_id) },
    { key: 'points', label: 'Points' },
    { key: 'balance', label: 'Balance', render: (c: Card) => `₹${c.balance}` },
    {
      key: 'status', label: 'Status',
      render: (c: Card) => (
        <Badge variant={c.client_id ? 'success' : 'warning'}>
          {c.client_id ? 'Issued' : 'Available'}
        </Badge>
      ),
    },
    {
      key: 'actions', label: 'Actions',
      render: (c: Card) => !c.client_id ? (
        <Button variant="secondary" onClick={() => openIssue(c)}>Issue to Client</Button>
      ) : null,
    },
  ]

  const filtered = data.filter(c => {
    if (search) {
      const name = getClientName(c.client_id).toLowerCase()
      const q = search.toLowerCase()
      if (!name.includes(q) && !c.card_number.toLowerCase().includes(q)) return false
    }
    if (statusFilter === 'available' && c.client_id) return false
    if (statusFilter === 'issued' && !c.client_id) return false
    if (membershipFilter === 'yes') {
      const client: any = clients.find(cl => cl.id === c.client_id)
      if (!client || client.membership_status !== 'yes') return false
    }
    if (membershipFilter === 'no') {
      const client: any = clients.find(cl => cl.id === c.client_id)
      if (client && client.membership_status === 'yes') return false
    }
    if (clientStatusFilter) {
      const client: any = clients.find(cl => cl.id === c.client_id)
      if (clientStatusFilter === 'active' && (!client || client.is_active === false)) return false
      if (clientStatusFilter === 'inactive' && (!client || client.is_active !== false)) return false
    }
    return true
  })

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">My Cards</h1>

      <div className="mb-4 rounded-lg border bg-white p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs text-gray-600">Search:</label>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by card number or name" className="w-64 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">Status:</label>
            <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
              <option value="">-- All --</option>
              <option value="available">Available</option>
              <option value="issued">Issued</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">Membership Status:</label>
            <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={membershipFilter} onChange={(e) => setMembershipFilter(e.target.value)}>
              <option value="">-- All --</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">Client Status:</label>
            <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={clientStatusFilter} onChange={(e) => setClientStatusFilter(e.target.value)}>
              <option value="">-- All --</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <Button variant="secondary" onClick={() => {}}>Search</Button>
        </div>
      </div>

      <p className="mb-2 text-sm text-gray-900">Cards assigned to you by admin. Issue them to your clients.</p>
      <DataTable columns={columns} data={filtered} loading={loading} searchable={false} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Issue Card to Client">
        <form onSubmit={handleIssue} className="space-y-4">
          <p className="text-sm text-gray-600">
            Card: <strong>{selectedCard?.card_number}</strong> ({selectedCard?.card_type})
          </p>
          <Select
            label="Select Client"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            options={clients.map(c => ({ value: c.id, label: `${c.name} (${c.phone})` }))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Issue Card</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
