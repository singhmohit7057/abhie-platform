import { useState } from 'react'
import { Search } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  searchable?: boolean
  pageSize?: number
  onRowClick?: (item: T) => void
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  searchable = true,
  pageSize = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = data.filter((item) =>
    search
      ? Object.values(item as Record<string, unknown>).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      : true
  )

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const getValue = (item: T, key: string) => {
    return (item as Record<string, unknown>)[key]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      {searchable && (
        <div className="mb-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Search..."
            className="w-full max-w-sm rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border border-gray-300" style={{ borderCollapse: 'collapse' }}>
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="border border-gray-300 px-4 py-3 font-bold text-gray-900">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="border border-gray-300 px-4 py-8 text-center text-gray-900">
                  No data found
                </td>
              </tr>
            ) : (
              paged.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`bg-white hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="border border-gray-300 px-4 py-3 text-gray-900">
                      {col.render ? col.render(item, page * pageSize + idx) : String(getValue(item, String(col.key)) ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-sm text-gray-900">
        <span>
          {filtered.length > 0 ? `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, filtered.length)} of ${filtered.length} total records` : '0 records'}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-30"
          >
            &lt;&lt; Prev
          </button>
          {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`rounded border px-2 py-1 text-xs ${page === i ? 'border-red-500 bg-red-50 font-bold' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-30"
          >
            Next &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  )
}
