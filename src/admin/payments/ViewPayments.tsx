import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Payment } from '../../types'

export function ViewPayments() {
  const { data, loading } = useCRUD<Payment>({ table: 'payments' })

  const statusVariant = (s: string) => {
    if (s === 'completed') return 'success'
    if (s === 'pending') return 'warning'
    return 'danger'
  }

  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_p: Payment, index: number) => index + 1 },
    { key: 'transaction_id', label: 'Transaction ID', render: (p: Payment) => p.transaction_id || '-' },
    { key: 'amount', label: 'Amount', render: (p: Payment) => formatCurrency(p.amount) },
    { key: 'payment_mode', label: 'Mode', render: (p: Payment) => p.payment_mode.toUpperCase() },
    { key: 'status', label: 'Status', render: (p: Payment) => <Badge variant={statusVariant(p.status)}>{p.status}</Badge> },
    { key: 'created_at', label: 'Date', render: (p: Payment) => formatDate(p.created_at) },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">View Payments</h1>
        <Link to="/admin/payments/add"><Button><Plus size={16} /> Add Payment</Button></Link>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  )
}
