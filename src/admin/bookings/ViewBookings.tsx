import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { formatDate, formatCurrency } from '../../lib/utils'
import type { Booking } from '../../types'

export function ViewBookings() {
  const { data, loading, create, update, remove } = useCRUD<Booking>({ table: 'bookings' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Booking | null>(null)
  const [form, setForm] = useState({
    service_name: '', booking_date: '', time_slot: '', status: 'pending' as const, amount: '0',
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ service_name: '', booking_date: '', time_slot: '', status: 'pending', amount: '0' })
    setModalOpen(true)
  }

  const openEdit = (b: Booking) => {
    setEditing(b)
    setForm({
      service_name: b.service_name, booking_date: b.booking_date?.split('T')[0] || '',
      time_slot: b.time_slot || '', status: b.status as 'pending', amount: String(b.amount),
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, amount: parseFloat(form.amount) }
    if (editing) {
      await update(editing.id, payload)
    } else {
      await create(payload as any)
    }
    setModalOpen(false)
  }

  const statusVariant = (s: string) => {
    if (s === 'confirmed') return 'success' as const
    if (s === 'pending') return 'warning' as const
    return 'danger' as const
  }

  const columns = [
    { key: 'service_name', label: 'Service' },
    { key: 'booking_date', label: 'Date', render: (b: Booking) => formatDate(b.booking_date) },
    { key: 'time_slot', label: 'Time Slot' },
    { key: 'amount', label: 'Amount', render: (b: Booking) => formatCurrency(b.amount) },
    { key: 'status', label: 'Status', render: (b: Booking) => <Badge variant={statusVariant(b.status)}>{b.status}</Badge> },
    {
      key: 'actions', label: 'Actions',
      render: (b: Booking) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(b)} className="text-blue-600 hover:text-blue-800"><Pencil size={16} /></button>
          <button onClick={() => remove(b.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <Button onClick={openAdd}><Plus size={16} /> Add Booking</Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Booking' : 'Add Booking'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Service Name" value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.booking_date} onChange={(e) => setForm({ ...form, booking_date: e.target.value })} required />
            <Input label="Time Slot" value={form.time_slot} onChange={(e) => setForm({ ...form, time_slot: e.target.value })} placeholder="10:00 AM - 11:00 AM" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount (₹)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} options={[{ value: 'pending', label: 'Pending' }, { value: 'confirmed', label: 'Confirmed' }, { value: 'cancelled', label: 'Cancelled' }]} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
