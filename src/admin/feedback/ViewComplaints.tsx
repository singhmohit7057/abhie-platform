import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../lib/utils'
import type { Complaint } from '../../types'

export function ViewComplaints() {
  const { data, loading, update } = useCRUD<Complaint>({ table: 'complaints' })

  const statusVariant = (s: string) => {
    if (s === 'resolved') return 'success' as const
    if (s === 'in_progress') return 'warning' as const
    return 'danger' as const
  }

  const columns = [
    { key: 'subject', label: 'Subject' },
    { key: 'description', label: 'Description', render: (c: Complaint) => c.description?.slice(0, 50) + (c.description?.length > 50 ? '...' : '') },
    { key: 'priority', label: 'Priority', render: (c: Complaint) => <Badge variant={c.priority === 'high' ? 'danger' : c.priority === 'medium' ? 'warning' : 'default'}>{c.priority}</Badge> },
    { key: 'status', label: 'Status', render: (c: Complaint) => <Badge variant={statusVariant(c.status)}>{c.status}</Badge> },
    { key: 'created_at', label: 'Date', render: (c: Complaint) => formatDate(c.created_at) },
    {
      key: 'actions', label: 'Actions',
      render: (c: Complaint) => c.status !== 'resolved' ? (
        <Button size="sm" onClick={() => update(c.id, { status: 'resolved', resolved_at: new Date().toISOString() } as any)}>
          Resolve
        </Button>
      ) : null,
    },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Complaints</h1>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  )
}
