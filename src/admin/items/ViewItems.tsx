import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X as XIcon } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../lib/utils'
import type { Item, Merchant } from '../../types'

export function ViewItems() {
  const { data, loading, create, update, remove } = useCRUD<Item>({ table: 'items' })
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', price: '0', mrp: '0', discount_percentage: '0', stock_quantity: '0',
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', description: '', price: '0', mrp: '0', discount_percentage: '0', stock_quantity: '0' })
    setModalOpen(true)
  }

  const openEdit = (item: Item) => {
    setEditing(item)
    setForm({
      name: item.name, description: item.description || '',
      price: String(item.price), mrp: String(item.mrp),
      discount_percentage: String(item.discount_percentage), stock_quantity: String(item.stock_quantity),
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form, price: parseFloat(form.price), mrp: parseFloat(form.mrp),
      discount_percentage: parseFloat(form.discount_percentage), stock_quantity: parseInt(form.stock_quantity),
      is_active: true, approval_status: 'approved' as const,
    }
    if (editing) {
      await update(editing.id, payload)
    } else {
      await create(payload as any)
    }
    setModalOpen(false)
  }

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
          <button onClick={() => openEdit(i)} className="text-blue-600 hover:text-blue-800"><Pencil size={16} /></button>
          <button onClick={() => remove(i.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Items</h1>
        <Button onClick={openAdd}><Plus size={16} /> Add Item</Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Item' : 'Add Item'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="MRP (₹)" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
            <Input label="Discount %" type="number" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} />
          </div>
          <Input label="Stock Quantity" type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
