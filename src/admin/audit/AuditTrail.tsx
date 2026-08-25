import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { formatDate } from '../../lib/utils'
import type { AuditEntry } from '../../types'

export function AuditTrail() {
  const { data, loading } = useCRUD<AuditEntry>({ table: 'audit_trail' })

  const columns = [
    { key: 'action', label: 'Action' },
    { key: 'entity_type', label: 'Entity' },
    { key: 'entity_id', label: 'Entity ID', render: (a: AuditEntry) => a.entity_id?.slice(0, 8) || '-' },
    { key: 'ip_address', label: 'IP', render: (a: AuditEntry) => a.ip_address || '-' },
    { key: 'created_at', label: 'Date', render: (a: AuditEntry) => formatDate(a.created_at) },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Audit Trail</h1>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  )
}
