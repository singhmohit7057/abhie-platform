import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { useMerchantId } from '../../hooks/useMerchantId'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Store } from '../../types'

export function ManageStores() {
  const merchantId = useMerchantId()
  const { data, loading, remove } = useCRUD<Store>({ table: 'stores', filters: merchantId ? { merchant_id: merchantId } : undefined })

  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_s: Store, index: number) => index + 1 },
    { key: 'name', label: 'Store Name' },
    { key: 'address', label: 'Address', render: (s: Store) => s.address || '—' },
    { key: 'city', label: 'City', render: (s: Store) => s.city || '—' },
    { key: 'phone', label: 'Phone', render: (s: Store) => s.phone || '—' },
    { key: 'is_active', label: 'Status', render: (s: Store) => <Badge variant={s.is_active ? 'success' : 'danger'}>{s.is_active ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions', label: 'Actions',
      render: (s: Store) => (
        <div className="flex gap-2">
          <Link to={`/merchant/stores/add?edit=${s.id}`} className="text-gray-900 hover:text-gray-700"><Pencil size={16} /></Link>
          <button onClick={() => remove(s.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">View Stores</h1>
        <Link to="/merchant/stores/add"><Button><Plus size={16} /> Add Store</Button></Link>
      </div>
      <DataTable columns={columns} data={data} loading={loading} searchable={false} />
      <div className="mt-4 flex justify-end hidden">
        <Link to="/merchant/stores/add">
          <Button><Plus size={16} /> Add Store</Button>
        </Link>
      </div>
    </div>
  )
}
