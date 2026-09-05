import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Check, X as XIcon } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../lib/utils'
import type { Item, Merchant } from '../../types'

export function ViewItems() {
  const { data, loading, update, remove } = useCRUD<Item>({ table: 'items' })
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })

  const handleApprove = async (item: Item) => {
    await update(item.id, { approval_status: 'approved', is_active: true } as any)
  }

  const handleReject = async (item: Item) => {
    await update(item.id, { approval_status: 'rejected', is_active: false } as any)
  }

  const approvalVariant = (s: string) => {
    if (s === 'approved') return 'success' as const
    if (s === 'pending') return 'warning' as const
    return 'danger' as const
  }

  const getMerchantName = (merchantId: string | null) => {
    if (!merchantId) return 'Admin'
    const m = merchants.find(m => m.id === merchantId)
    return m?.store_name || '—'
  }

  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_i: Item, index: number) => index + 1 },
    { key: 'name', label: 'Name' },
    { key: 'merchant_id', label: 'Merchant', render: (i: Item) => getMerchantName(i.merchant_id) },
    { key: 'price', label: 'Price', render: (i: Item) => formatCurrency(i.price) },
    { key: 'mrp', label: 'MRP', render: (i: Item) => formatCurrency(i.mrp) },
    { key: 'discount_percentage', label: 'Discount', render: (i: Item) => `${i.discount_percentage}%` },
    { key: 'stock_quantity', label: 'Stock' },
    { key: 'approval_status', label: 'Approval', render: (i: Item) => <Badge variant={approvalVariant(i.approval_status)}>{i.approval_status}</Badge> },
    { key: 'is_active', label: 'Status', render: (i: Item) => <Badge variant={i.is_active ? 'success' : 'danger'}>{i.is_active ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions', label: 'Actions',
      render: (i: Item) => (
        <div className="flex gap-2">
          {i.approval_status === 'pending' && (
            <>
              <button onClick={() => handleApprove(i)} className="text-green-600 hover:text-green-800" title="Approve"><Check size={16} /></button>
              <button onClick={() => handleReject(i)} className="text-red-600 hover:text-red-800" title="Reject"><XIcon size={16} /></button>
            </>
          )}
          <Link to={`/admin/items/add?edit=${i.id}`} className="text-gray-900 hover:text-gray-700"><Pencil size={16} /></Link>
          <button onClick={() => remove(i.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">View Items</h1>
        <Link to="/admin/items/add"><Button><Plus size={16} /> Add Item</Button></Link>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  )
}
