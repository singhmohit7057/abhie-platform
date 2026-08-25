import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCRUD } from '../../hooks/useCRUD'
import { DataTable } from '../../components/shared/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../lib/utils'
import type { Complaint } from '../../types'

type FeedbackTab = 'complaints' | 'feedbacks'

export function MerchantFeedback() {
  const [tab, setTab] = useState<FeedbackTab>('complaints')
  const { data: complaints, loading: loadingC, create: createComplaint } = useCRUD<Complaint>({ table: 'complaints' })
  const { data: feedbacks, loading: loadingF } = useCRUD<any>({ table: 'feedbacks' })
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createComplaint({ ...form, status: 'open' } as any)
    setModalOpen(false)
    setForm({ subject: '', description: '', priority: 'medium' })
  }

  const statusVariant = (s: string) => {
    if (s === 'resolved') return 'success' as const
    if (s === 'in_progress') return 'warning' as const
    return 'danger' as const
  }

  const complaintColumns = [
    { key: 'subject', label: 'Subject' },
    { key: 'priority', label: 'Priority', render: (c: Complaint) => <Badge variant={c.priority === 'high' ? 'danger' : c.priority === 'medium' ? 'warning' : 'default'}>{c.priority}</Badge> },
    { key: 'status', label: 'Status', render: (c: Complaint) => <Badge variant={statusVariant(c.status)}>{c.status}</Badge> },
    { key: 'created_at', label: 'Date', render: (c: Complaint) => formatDate(c.created_at) },
  ]

  const feedbackColumns = [
    { key: 'rating', label: 'Rating', render: (f: any) => <span className="text-yellow-500">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span> },
    { key: 'comment', label: 'Comment', render: (f: any) => f.comment || '-' },
    { key: 'created_at', label: 'Date', render: (f: any) => formatDate(f.created_at) },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Feedback & Complaints</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Add Complaint</Button>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setTab('complaints')} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'complaints' ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
          Complaints
        </button>
        <button onClick={() => setTab('feedbacks')} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'feedbacks' ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
          Feedbacks
        </button>
      </div>

      {tab === 'complaints' ? (
        <DataTable columns={complaintColumns} data={complaints} loading={loadingC} />
      ) : (
        <DataTable columns={feedbackColumns} data={feedbacks} loading={loadingF} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
