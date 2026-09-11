import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { useMerchantId } from '../../hooks/useMerchantId'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Payment } from '../../types'

export function ManageBilling() {
  const merchantId = useMerchantId()
  const { data, loading, create } = useCRUD<Payment>({ table: 'payments', filters: merchantId ? { merchant_id: merchantId } : undefined, skip: !merchantId })
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ amount: '0', payment_mode: 'upi' as const, status: 'completed' as const, transaction_id: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await create({ ...form, amount: parseFloat(form.amount) } as any)
    setModalOpen(false)
    setForm({ amount: '0', payment_mode: 'upi', status: 'completed', transaction_id: '' })
  }

  const statusVariant = (s: string) => {
    if (s === 'completed') return 'success' as const
    if (s === 'pending') return 'warning' as const
    return 'danger' as const
  }

  const columns = [
    { key: 'transaction_id', label: 'Transaction ID', render: (p: Payment) => p.transaction_id || '-' },
    { key: 'amount', label: 'Amount', render: (p: Payment) => formatCurrency(p.amount) },
    { key: 'payment_mode', label: 'Mode', render: (p: Payment) => p.payment_mode.toUpperCase() },
    { key: 'status', label: 'Status', render: (p: Payment) => <Badge variant={statusVariant(p.status)}>{p.status}</Badge> },
    { key: 'created_at', label: 'Date', render: (p: Payment) => formatDate(p.created_at) },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Add Billing</Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Billing">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Amount (₹)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <Select label="Payment Mode" value={form.payment_mode} onChange={(e) => setForm({ ...form, payment_mode: e.target.value as any })} options={[{ value: 'cash', label: 'Cash' }, { value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }, { value: 'netbanking', label: 'Net Banking' }]} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} options={[{ value: 'pending', label: 'Pending' }, { value: 'completed', label: 'Completed' }, { value: 'failed', label: 'Failed' }]} />
          <Input label="Transaction ID" value={form.transaction_id} onChange={(e) => setForm({ ...form, transaction_id: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
