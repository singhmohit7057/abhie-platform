import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import type { Card, Merchant, Client } from '../../types'

export function ViewCards() {
  const { data, loading, fetchData } = useCRUD<Card>({ table: 'cards', orderBy: 'card_number', ascending: false })
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })
  const { data: clients } = useCRUD<Client>({ table: 'clients' })
  const [search, setSearch] = useState('')
  const [merchantSearch, setMerchantSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleDelete = async (id: string) => {
    setDeleteError('')
    // Find Abhie Cards merchant
    const abhieMerchant = merchants.find(m => m.store_name.toLowerCase().includes('abhie') && m.store_name.toLowerCase().includes('card'))
    if (!abhieMerchant) {
      setDeleteError('Abhie Cards merchant not found.')
      return
    }
    const { supabase } = await import('../../lib/supabase')
    const { error } = await supabase.from('cards').update({
      merchant_id: abhieMerchant.id,
      client_id: null,
    }).eq('id', id)
    if (error) {
      setDeleteError(error.message)
    } else {
      setDeleteConfirm(null)
      setSuccessMsg('Card has been moved to Abhie Cards successfully!')
      setTimeout(() => setSuccessMsg(''), 4000)
      await fetchData()
    }
  }

  const getMerchantName = (merchantId: string | null) => {
    if (!merchantId) return 'Website'
    const m = merchants.find(m => m.id === merchantId)
    return m?.store_name || 'Website'
  }

  const getClientName = (clientId: string | null) => {
    if (!clientId) return 'N/A'
    const client = clients.find(c => c.id === clientId)
    return client?.name || 'N/A'
  }

  const getClientPhone = (clientId: string | null) => {
    if (!clientId) return 'N/A'
    const client = clients.find(c => c.id === clientId)
    return client?.phone || 'N/A'
  }

  const filtered = data.filter(c => {
    if (search) {
      const name = getClientName(c.client_id).toLowerCase()
      const phone = getClientPhone(c.client_id).toLowerCase()
      const q = search.toLowerCase()
      if (!name.includes(q) && !phone.includes(q) && !c.card_number.toLowerCase().includes(q)) return false
    }
    if (merchantSearch) {
      const mName = getMerchantName(c.merchant_id).toLowerCase()
      if (!mName.includes(merchantSearch.toLowerCase())) return false
    }
    if (statusFilter === 'active' && !c.client_id) return false
    if (statusFilter === 'inactive' && c.client_id) return false
    return true
  })

  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_c: Card, index: number) => index + 1 },
    { key: 'card_number', label: 'Card No' },
    { key: 'name', label: 'Name', render: (c: Card) => getClientName(c.client_id) },
    { key: 'phone', label: 'Phone No', render: (c: Card) => getClientPhone(c.client_id) },
    { key: 'points', label: 'Reward Points' },
    {
      key: 'is_active', label: 'Status',
      render: (c: Card) => <span className={c.client_id ? 'text-gray-900 font-bold' : 'text-gray-900'}>{c.client_id ? 'Active' : 'Inactive'}</span>,
    },
    { key: 'merchant', label: 'Merchant Name', render: (c: Card) => getMerchantName(c.merchant_id) },
    {
      key: 'delete', label: 'Delete',
      render: (c: Card) => (
        <button type="button" onClick={() => { setDeleteConfirm(c.id); setDeleteError('') }} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">View Cards</h1>
        {successMsg && (
          <div className="mt-3 rounded border border-green-200 bg-white py-2 text-center text-sm">
            <span className="font-bold text-green-600">Success! </span>
            <span className="text-green-600">{successMsg}</span>
          </div>
        )}
        <Link to="/admin/cards/add"><Button><Plus size={16} /> Add Cards</Button></Link>
      </div>

      <div className="mb-4 bg-white p-4">
        <div className="flex flex-wrap items-end justify-center gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-900">Search:</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name / Card / Phone"
              className="w-64 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-900">Merchant Name:</label>
            <input
              type="text"
              value={merchantSearch}
              onChange={(e) => setMerchantSearch(e.target.value)}
              placeholder="Search by Merchant Name"
              className="w-52 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-900">Status:</label>
            <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">-- All --</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>


      <DataTable columns={columns} data={filtered} loading={loading} searchable={false} />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null) }}>
          <div className="w-80 rounded-lg bg-white p-6 shadow-xl text-center">
            <p className="mb-2 text-lg font-bold text-gray-900">Remove Card</p>
            <p className="mb-2 text-sm text-gray-600">This card will be moved back to Abhie Cards. Please confirm.</p>
            {deleteError && <p className="mb-3 text-sm font-medium text-red-600">{deleteError}</p>}
            <div className="flex justify-center gap-3 mt-4">
              <button type="button" onClick={() => handleDelete(deleteConfirm)} className="rounded bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-800">Ok</button>
              <button type="button" onClick={() => { setDeleteConfirm(null); setDeleteError('') }} className="rounded border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
