import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import type { Merchant, Card, Store, Profile } from '../../types'

export function ViewMerchants() {
  const { data, loading } = useCRUD<Merchant>({ table: 'merchants' })
  const { data: cards } = useCRUD<Card>({ table: 'cards' })
  const { data: stores } = useCRUD<Store>({ table: 'stores' })
  const { data: profiles } = useCRUD<Profile>({ table: 'profiles' })
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const getCardInfo = (merchantId: string) => {
    const merchantCards = cards.filter(c => c.merchant_id === merchantId)
    const total = merchantCards.length
    const start = merchantCards.length > 0 ? merchantCards[0].card_number : ''
    const end = merchantCards.length > 1 ? merchantCards[merchantCards.length - 1].card_number : ''
    return { total, start, end }
  }

  const filtered = data.filter(m => {
    if (search && !m.store_name.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter && m.business_type !== categoryFilter) return false
    if (statusFilter === 'true' && !m.is_active) return false
    if (statusFilter === 'false' && m.is_active) return false
    return true
  })


  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_m: Merchant, index: number) => index + 1 },
    { key: 'store_name', label: 'Name' },
    { key: 'business_type', label: 'Category', render: (m: Merchant) => m.business_type || '—' },
    {
      key: 'cards', label: 'Total Cards',
      render: (m: Merchant) => {
        const info = getCardInfo(m.id)
        return (
          <div className="text-xs leading-5">
            <div><strong>Total: {info.total}</strong></div>
            <div>Start: {info.start || '—'}</div>
            <div>End: {info.end || '—'}</div>
          </div>
        )
      },
    },
    { key: 'phone', label: 'Phone', render: (m: Merchant) => {
      const profile = profiles.find(p => p.id === m.user_id)
      if (profile?.phone) return profile.phone
      const store = stores.find(s => s.merchant_id === m.id)
      return store?.phone || '—'
    }},
    {
      key: 'edit', label: 'Edit',
      render: (m: Merchant) => <Link to={`/admin/merchants/add?edit=${m.id}`} className="text-blue-600 hover:text-blue-800"><Pencil size={18} /></Link>,
    },
    {
      key: 'view_panel', label: 'View Panel',
      render: (m: Merchant) => <Link to={`/merchant?as=${m.id}`} className="text-xs rounded bg-red-700 px-2 py-1 text-white hover:bg-red-800">View</Link>,
    },
    {
      key: 'is_active', label: 'Merchant Status',
      render: (m: Merchant) => <strong className={m.is_active ? 'text-green-700' : 'text-gray-500'}>{m.is_active ? 'Active' : 'Inactive'}</strong>,
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">Manage Merchants</h1>
        <Link to="/admin/merchants/add">
          <Button>+ Add New</Button>
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-end justify-center gap-4">
        <div>
          <label className="mb-1 block text-xs text-gray-600">Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search By Name or Phone"
            className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-600">Category:</label>
          <input
            type="text"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="All Categories"
            className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-600">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none"
          >
            <option value="">— All —</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <Button variant="secondary" onClick={() => {}}>Search</Button>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} searchable={false} />

    </div>
  )
}
