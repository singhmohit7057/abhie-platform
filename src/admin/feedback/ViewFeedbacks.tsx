import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { formatDate } from '../../lib/utils'
import type { Feedback } from '../../types'

export function ViewFeedbacks() {
  const { data, loading } = useCRUD<Feedback>({ table: 'feedbacks' })

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const columns = [
    { key: 'rating', label: 'Rating', render: (f: Feedback) => <span className="text-yellow-500">{renderStars(f.rating)}</span> },
    { key: 'comment', label: 'Comment', render: (f: Feedback) => f.comment || '-' },
    { key: 'created_at', label: 'Date', render: (f: Feedback) => formatDate(f.created_at) },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Feedbacks</h1>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  )
}
