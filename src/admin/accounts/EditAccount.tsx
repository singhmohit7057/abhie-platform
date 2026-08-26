import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export function EditAccount() {
  const { profile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    user_id: (profile as any)?.user_id || '',
  })

  useEffect(() => {
    if (profile) {
      setForm({ full_name: profile.full_name, email: profile.email, phone: profile.phone || '', user_id: (profile as any)?.user_id || '' })
    }
  }, [profile])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Not authenticated')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, user_id: form.user_id || null })
      .eq('id', user.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account updated successfully')
      setEditing(false)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">Edit Account</h1>

      <div className="rounded-lg border bg-white p-6">
        {!editing ? (
          <div>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="py-2 pr-6 font-medium text-gray-700">Name:</td>
                  <td className="py-2 text-gray-900">{form.full_name}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-6 font-medium text-gray-700">Email:</td>
                  <td className="py-2 text-gray-900">{form.email}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-6 font-medium text-gray-700">Phone:</td>
                  <td className="py-2 text-gray-900">{form.phone || '—'}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-6 font-medium text-gray-700">User ID:</td>
                  <td className="py-2 text-gray-900">{form.user_id || '—'}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4">
              <Button onClick={() => setEditing(true)}>Edit</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="py-2 pr-6 font-medium text-gray-700">Name:</td>
                  <td className="py-2"><input className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></td>
                </tr>
                <tr>
                  <td className="py-2 pr-6 font-medium text-gray-700">Email:</td>
                  <td className="py-2"><input className="rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={form.email} disabled /></td>
                </tr>
                <tr>
                  <td className="py-2 pr-6 font-medium text-gray-700">Phone:</td>
                  <td className="py-2"><input className="rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={form.phone} disabled /></td>
                </tr>
                <tr>
                  <td className="py-2 pr-6 font-medium text-gray-700">User ID:</td>
                  <td className="py-2"><input className="rounded border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm" value={form.user_id} disabled /></td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
              <Button variant="secondary" type="button" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
