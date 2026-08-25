import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import type { Client, Merchant, Card, Redemption } from '../../types'

export function ViewClients() {
  const { data, loading } = useCRUD<Client>({ table: 'clients' })
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })
  const { data: cards } = useCRUD<Card>({ table: 'cards' })
  const { data: redemptions } = useCRUD<Redemption>({ table: 'redemptions' })

  const getMerchantName = (merchantId: string | null) => {
    if (!merchantId) return '—'
    const m = merchants.find(m => m.id === merchantId)
    return m?.store_name || '—'
  }

  const getCardNumber = (clientId: string) => {
    const card = cards.find(c => c.client_id === clientId)
    return card?.card_number || '—'
  }

  const getAvailablePoints = (clientId: string) => {
    const card = cards.find(c => c.client_id === clientId)
    if (!card) return 0
    const redeemed = redemptions.filter(r => r.card_id === card.id).reduce((sum, r) => sum + r.points_redeemed, 0)
    return card.points - redeemed
  }

  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_c: Client, index: number) => index + 1 },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'card', label: 'Card Number', render: (c: Client) => getCardNumber(c.id) },
    { key: 'points', label: 'Available Points', render: (c: Client) => getAvailablePoints(c.id) },
    { key: 'city', label: 'City', render: (c: Client) => c.city || '—' },
    { key: 'status', label: 'Status', render: (c: any) => <span className={(c.is_active ?? true) ? 'text-green-700' : 'text-gray-500'}>{(c.is_active ?? true) ? 'Active' : 'Inactive'}</span> },
    { key: 'membership', label: 'Membership', render: (c: any) => c.membership_status === 'yes' ? 'Yes' : 'No' },
    { key: 'merchant_id', label: 'Created By (Merchant)', render: (c: Client) => getMerchantName(c.merchant_id) },
  ]

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-red-700">View Clients</h1>
      <p className="mb-4 text-sm text-gray-500">Clients created by merchants. Merchants manage their own clients.</p>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  )
}
