import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import type { Category } from '../../types'

export function ViewCategories() {
  const { data, loading, remove } = useCRUD<Category>({ table: 'categories' })
  const [search, setSearch] = useState('')

  const filtered = search
    ? data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : data

  const columns = [
    { key: 'sl', label: 'Sl. No.', render: (_c: Category, index: number) => index + 1 },
    { key: 'name', label: 'Title' },
    { key: 'is_active', label: 'Status', render: (cat: Category) => <strong className={cat.is_active ? 'text-green-700' : 'text-gray-500'}>{cat.is_active ? 'Active' : 'Inactive'}</strong> },
    {
      key: 'edit', label: 'Edit',
      render: (cat: Category) => <Link to={`/admin/categories/add?edit=${cat.id}`} className="text-blue-600 hover:text-blue-800"><Pencil size={18} /></Link>,
    },
    {
      key: 'delete', label: 'Delete',
      render: (cat: Category) => <button onClick={() => remove(cat.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>,
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-700">Manage Categories</h1>
        <Link to="/admin/categories/add"><Button><Plus size={16} /> Add New</Button></Link>
      </div>

      <div className="mb-4 flex items-center justify-end gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Title"
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
        />
        <Button variant="secondary" onClick={() => {}}>Search</Button>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} searchable={false} />
    </div>
  )
}
