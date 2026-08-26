import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import type { Card, Merchant, Client } from '../../types'

export function ViewCards() {
  const { data, loading, remove } = useCRUD<Card>({ table: 'cards' })
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })
  const { data: clients } = useCRUD<Client>({ table: 'clients' })
  const [search, setSearch] = useState('')
  const [merchantSearch, setMerchantSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const getMerchantName = (merchantId: string | null) => {
    if (!merchantId) return 'Website'
    const m = merchants.find(m => m.id === merchantId)
    return m?.store_name || 'Website'
  }

  const getClientName = (clientId: string | null) => {
    if (!clientId) return 'N/A'
    const client = clients.find(c => c.id === clientId)
    return client?.name || 'N/A'
  }

  const getClientPhone = (clientId: string | null) => {
    if (!clientId) return 'N/A'
    const client = clients.find(c => c.id === clientId)
    return client?.phone || 'N/A'
  }

  const filtered = data.filter(c => {
    if (search) {
      const name = getClientName(c.client_id).toLowerCase()
      const phone = getClientPhone(c.client_id).toLowerCase()
      const q = search.toLowerCase()
      if (!name.includes(q) && !phone.includes(q) && !c.card_number.toLowerCase().includes(q)) return false
    }
    if (merchantSearch) {
      const mName = getMerchantName(c.merchant_id).toLowerCase()
      if (!mName.includes(merchantSearch.toLowerCase())) return false
    }
    if (statusFilter === 'active' && !c.client_id) return false
    if (statusFilter === 'inactive' && c.client_id) return false
    if (fromDate && fromDate.length === 10) {
      const [dd, mm, yyyy] = fromDate.split('-')
      const from = new Date(`${yyyy}-${mm}-${dd}`)
      const created = new Date(c.created_at)
      if (created < from) return false
    }
    if (toDate && toDate.length === 10) {
      const [dd, mm, yyyy] = toDate.split('-')
      const to = new Date(`${yyyy}-${mm}-${dd}`)
      to.setHours(23, 59, 59)
      const created = new Date(c.created_at)
      if (created > to) return false
    }
    return true
  })

  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_c: Card, index: number) => index + 1 },
    { key: 'card_number', label: 'Card No' },
    { key: 'name', label: 'Name', render: (c: Card) => getClientName(c.client_id) },
    { key: 'phone', label: 'Phone No', render: (c: Card) => getClientPhone(c.client_id) },
    { key: 'points', label: 'Reward Points' },
    {
      key: 'is_active', label: 'Status',
      render: (c: Card) => <span className={c.client_id ? 'text-green-700' : 'text-gray-500'}>{c.client_id ? 'Issued' : 'N/A'}</span>,
    },
    { key: 'merchant', label: 'Merchant Name', render: (c: Card) => getMerchantName(c.merchant_id) },
    {
      key: 'delete', label: 'Delete',
      render: (c: Card) => (
        <button onClick={() => remove(c.id)} className="text-blue-600 hover:text-red-800"><Trash2 size={18} /></button>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">View Cards</h1>
        <Link to="/admin/cards/add"><Button><Plus size={16} /> Add Cards</Button></Link>
      </div>

      <div className="mb-4 rounded-lg border bg-white p-4">
        <div className="mb-3 flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs text-gray-600">From Date:</label>
            <input placeholder="dd-mm-yyyy" maxLength={10} value={fromDate} onChange={(e) => { let v = e.target.value.replace(/[^0-9]/g, ''); if (v.length > 2) v = v.slice(0,2) + '-' + v.slice(2); if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5); setFromDate(v.slice(0,10)); }} className={`w-32 rounded border px-2 py-1.5 text-sm focus:outline-none ${fromDate.length === 10 && (() => { const [d,m] = fromDate.split('-').map(Number); return d > 31 || d < 1 || m > 12 || m < 1; })() ? 'border-red-500' : 'border-gray-300 focus:border-red-500'}`} />
            {fromDate.length === 10 && (() => { const [d,m] = fromDate.split('-').map(Number); return d > 31 || d < 1 || m > 12 || m < 1; })() && <p className="mt-0.5 text-xs text-red-600">Invalid date</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">To Date:</label>
            <input placeholder="dd-mm-yyyy" maxLength={10} value={toDate} onChange={(e) => { let v = e.target.value.replace(/[^0-9]/g, ''); if (v.length > 2) v = v.slice(0,2) + '-' + v.slice(2); if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5); setToDate(v.slice(0,10)); }} className={`w-32 rounded border px-2 py-1.5 text-sm focus:outline-none ${toDate.length === 10 && (() => { const [d,m] = toDate.split('-').map(Number); return d > 31 || d < 1 || m > 12 || m < 1; })() ? 'border-red-500' : 'border-gray-300 focus:border-red-500'}`} />
            {toDate.length === 10 && (() => { const [d,m] = toDate.split('-').map(Number); return d > 31 || d < 1 || m > 12 || m < 1; })() && <p className="mt-0.5 text-xs text-red-600">Invalid date</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs text-gray-600">Search:</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search By Name, Phone or Card Number, Me..."
              className="w-72 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">Merchant Name:</label>
            <input
              type="text"
              value={merchantSearch}
              onChange={(e) => setMerchantSearch(e.target.value)}
              placeholder="Search by Merchant Name"
              className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">Status:</label>
            <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">-- All --</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <Button variant="secondary" onClick={() => {}}>Search</Button>
        </div>
      </div>


      <DataTable columns={columns} data={filtered} loading={loading} searchable={false} />

    </div>
  )
}
