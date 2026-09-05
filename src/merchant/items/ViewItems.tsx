import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { useMerchantId } from '../../hooks/useMerchantId'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../lib/utils'
import type { Item, Category } from '../../types'

export function MerchantViewItems() {
  const merchantId = useMerchantId()
  const { data, loading, create, update, remove } = useCRUD<Item>({ table: 'items', filters: merchantId ? { merchant_id: merchantId } : undefined })
  const { data: categories } = useCRUD<Category>({ table: 'categories' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', category_id: '', price: '', mrp: '', discount_percentage: '', stock_quantity: '',
  })


  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', description: '', category_id: '', price: '', mrp: '', discount_percentage: '', stock_quantity: '' })
    setModalOpen(true)
  }

  const openEdit = (item: Item) => {
    setEditing(item)
    setForm({
      name: item.name,
      description: item.description || '',
      category_id: item.category_id || '',
      price: String(item.price),
      mrp: String(item.mrp),
      discount_percentage: String(item.discount_percentage),
      stock_quantity: String(item.stock_quantity),
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      description: form.description || null,
      category_id: form.category_id || null,
      price: parseFloat(form.price),
      mrp: parseFloat(form.mrp),
      discount_percentage: parseFloat(form.discount_percentage || '0'),
      stock_quantity: parseInt(form.stock_quantity || '0'),
      is_active: false,
      approval_status: 'pending' as const,
      merchant_id: 'merchant-001',
      image_url: null,
    }
    if (editing) {
      await update(editing.id, payload)
    } else {
      await create(payload as any)
    }
    setModalOpen(false)
  }

  const approvalVariant = (s: string) => {
    if (s === 'approved') return 'success' as const
    if (s === 'pending') return 'warning' as const
    return 'danger' as const
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price', render: (i: Item) => formatCurrency(i.price) },
    { key: 'mrp', label: 'MRP', render: (i: Item) => formatCurrency(i.mrp) },
    { key: 'stock_quantity', label: 'Stock' },
    { key: 'approval_status', label: 'Approval', render: (i: Item) => <Badge variant={approvalVariant(i.approval_status)}>{i.approval_status}</Badge> },
    { key: 'is_active', label: 'Status', render: (i: Item) => <Badge variant={i.is_active ? 'success' : 'danger'}>{i.is_active ? 'Live' : 'Draft'}</Badge> },
    {
      key: 'actions', label: 'Actions',
      render: (i: Item) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(i)} className="text-gray-900 hover:text-gray-700"><Pencil size={16} /></button>
          {i.approval_status === 'pending' && (
            <button onClick={() => remove(i.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
          )}
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

      <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
        Items you add will be sent for admin approval. Once approved, they go live on the store.
      </div>

      <DataTable columns={columns} data={data} loading={loading} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Item' : 'Add New Item'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Select
            label="Category"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="MRP (₹)" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Discount %" type="number" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} />
            <Input label="Stock Quantity" type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Submit for Approval'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
