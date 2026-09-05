import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../lib/utils'
import type { Voucher, Merchant } from '../../types'

export function ViewVouchers() {
  const { data, loading, remove } = useCRUD<Voucher>({ table: 'vouchers' })
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })
  const [membershipFilter, setMembershipFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const filtered = data.filter(v => {
    if (statusFilter === 'active' && !v.is_active) return false
    if (statusFilter === 'inactive' && v.is_active) return false
    if (search) {
      const q = search.toLowerCase()
      if (!v.code.toLowerCase().includes(q) && !v.title.toLowerCase().includes(q)) return false
    }
    return true
  })

  const columns = [
    { key: 'sl', label: 'S.No', render: (_v: Voucher, index: number) => index + 1 },
    { key: 'code', label: 'Voucher Code', render: (v: Voucher) => <strong>{v.code}</strong> },
    { key: 'type', label: 'Type', render: (v: Voucher) => v.discount_type === 'percentage' ? `${v.discount_value}% Discount` : `₹${v.discount_value} Fixed` },
    { key: 'merchant', label: 'Merchant', render: (v: any) => {
      if (!v.merchant_id) return 'All'
      const m = merchants.find(m => m.id === v.merchant_id)
      return m?.store_name || 'All'
    }},
    { key: 'valid_until', label: 'Expiry Date', render: (v: Voucher) => formatDate(v.valid_until) },
    {
      key: 'is_active', label: 'Status',
      render: (v: Voucher) => <span className={v.is_active ? 'text-gray-900' : 'text-gray-900'}>{v.is_active ? 'Active' : 'Inactive'}</span>,
    },
    { key: 'members_only', label: 'Members Only', render: () => 'No' },
    {
      key: 'actions', label: 'Action',
      render: (v: Voucher) => (
        <div className="flex gap-2">
          <Link to={`/admin/vouchers/add?edit=${v.id}`} className="text-gray-900 hover:text-gray-700"><Pencil size={16} /></Link>
          <button onClick={() => remove(v.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">View Vouchers</h1>
        <Link to="/admin/vouchers/add"><Button><Plus size={16} /> Add Voucher</Button></Link>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-4 rounded-lg border bg-white p-4">
        <div>
          <label className="mb-1 block text-xs text-gray-600">Membership Status:</label>
          <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={membershipFilter} onChange={(e) => setMembershipFilter(e.target.value)}>
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-600">Voucher Status:</label>
          <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reseller name or voucher code..."
            className="w-72 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none"
          />
        </div>
        <Button variant="secondary" onClick={() => {}}>Search</Button>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} searchable={false} />


      <div className="mt-4 flex justify-end hidden">
        <Link to="/admin/vouchers/add">
          <Button><Plus size={16} /> Add Voucher</Button>
        </Link>
      </div>
    </div>
  )
}
