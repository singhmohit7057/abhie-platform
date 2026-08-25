import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Order } from '../../types'

export function UserOrders() {
  const { data, loading } = useCRUD<Order>({ table: 'orders' })

  const statusVariant = (s: string) => {
    if (s === 'delivered') return 'success' as const
    if (s === 'shipped') return 'info' as const
    if (s === 'confirmed' || s === 'pending') return 'warning' as const
    return 'danger' as const
  }

  const columns = [
    { key: 'id', label: 'Order ID', render: (o: Order) => `#${o.id.slice(0, 8)}` },
    { key: 'total_amount', label: 'Total', render: (o: Order) => formatCurrency(o.total_amount) },
    { key: 'discount_applied', label: 'Discount', render: (o: Order) => formatCurrency(o.discount_applied) },
    { key: 'final_amount', label: 'Final', render: (o: Order) => formatCurrency(o.final_amount) },
    { key: 'status', label: 'Status', render: (o: Order) => <Badge variant={statusVariant(o.status)}>{o.status}</Badge> },
    { key: 'created_at', label: 'Date', render: (o: Order) => formatDate(o.created_at) },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Orders</h1>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  )
}
