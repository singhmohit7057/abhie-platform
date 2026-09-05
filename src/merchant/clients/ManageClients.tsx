import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { useMerchantId } from '../../hooks/useMerchantId'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import type { Client, Card } from '../../types'

export function ManageClients() {
  const merchantId = useMerchantId()
  const { data, loading, remove } = useCRUD<Client>({ table: 'clients', filters: merchantId ? { merchant_id: merchantId } : undefined })
  const { data: cards } = useCRUD<Card>({ table: 'cards' })

  const getCardNumber = (client: any) => {
    if (client.card_id) {
      const card = cards.find(c => c.id === client.card_id)
      return card?.card_number || '—'
    }
    const card = cards.find(c => c.client_id === client.id)
    return card?.card_number || '—'
  }

  const getPoints = (client: any) => {
    if (client.card_id) {
      const card = cards.find(c => c.id === client.card_id)
      return card?.points || 0
    }
    const card = cards.find(c => c.client_id === client.id)
    return card?.points || 0
  }

  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_c: Client, index: number) => index + 1 },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email', render: (c: Client) => c.email || '—' },
    { key: 'card', label: 'Card No', render: (c: Client) => getCardNumber(c) },
    { key: 'points', label: 'Points', render: (c: Client) => getPoints(c) },
    { key: 'city', label: 'City', render: (c: Client) => c.city || '—' },
    { key: 'status', label: 'Status', render: (c: any) => <span className={(c.is_active ?? true) ? 'text-gray-900' : 'text-gray-900'}>{(c.is_active ?? true) ? 'Active' : 'Inactive'}</span> },
    { key: 'membership', label: 'Membership', render: (c: any) => c.membership_status === 'yes' ? 'Yes' : 'No' },
    {
      key: 'actions', label: 'Actions',
      render: (c: Client) => (
        <div className="flex gap-2">
          <Link to={`/merchant/clients/add?edit=${c.id}`} className="text-gray-900 hover:text-gray-700"><Pencil size={16} /></Link>
          <button onClick={() => remove(c.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">View Clients</h1>
        <Link to="/merchant/clients/add"><Button><Plus size={16} /> Add Client</Button></Link>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
      <div className="mt-4 flex justify-end hidden">
        <Link to="/merchant/clients/add">
          <Button><Plus size={16} /> Add Client</Button>
        </Link>
      </div>
    </div>
  )
}
