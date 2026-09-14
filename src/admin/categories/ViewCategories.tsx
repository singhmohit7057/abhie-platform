import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { supabase } from '../../lib/supabase'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import type { Category } from '../../types'

export function ViewCategories() {
  const { data, loading, fetchData } = useCRUD<Category>({ table: 'categories' })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')

  const handleDelete = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id)
    await fetchData()
    setDeleteConfirm(null)
    setSuccessMsg('Category has been deleted successfully!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const filtered = data.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter === 'active' && !c.is_active) return false
    if (statusFilter === 'inactive' && c.is_active) return false
    return true
  })

  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_c: Category, index: number) => index + 1 },
    { key: 'name', label: 'Title' },
    { key: 'is_active', label: 'Status', render: (cat: Category) => <strong className={cat.is_active ? 'text-gray-900' : 'text-gray-900'}>{cat.is_active ? 'Active' : 'Inactive'}</strong> },
    {
      key: 'edit', label: 'Edit',
      render: (cat: Category) => <Link to={`/admin/categories/add?edit=${cat.id}`} className="text-gray-900 hover:text-gray-700"><Pencil size={18} /></Link>,
    },
    {
      key: 'delete', label: 'Delete',
      render: (cat: Category) => <button onClick={() => setDeleteConfirm(cat.id)} className="text-red-600 hover:text-red-800 cursor-pointer"><Trash2 size={18} /></button>,
    },
  ]

  return (
    <div>
      {successMsg && (
        <div className="mb-4 bg-white py-2 text-center border border-green-200 rounded">
          <span className="font-bold text-green-600">Success! </span>
          <span className="text-green-600">{successMsg}</span>
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">Manage Categories</h1>
        <Link to="/admin/categories/add"><Button><Plus size={16} /> Add New</Button></Link>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3 justify-center">
        <div>
          <label className="mb-1 block text-xs text-gray-900">Search:</label>
          <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Title"
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-900">Status:</label>
          <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        >
          <option value="">— All —</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} searchable={false} />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-lg bg-white p-6 shadow-xl text-center">
            <p className="mb-2 text-lg font-bold text-gray-900">Delete Category</p>
            <p className="mb-6 text-sm text-gray-900">Are you sure want to delete this category?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="rounded bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-800">Yes, Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="rounded border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
