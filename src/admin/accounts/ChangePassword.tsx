import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'

export function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState({ old: false, new: false, confirm: false })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.oldPassword) {
      return setError('Enter your current password to continue')
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      setError('Unable to verify user')
      setLoading(false)
      return
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: form.oldPassword })
    if (signInError) {
      setError('Current password is incorrect')
      setLoading(false)
      return
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: form.password })
    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Password updated successfully')
      setForm({ oldPassword: '', password: '', confirmPassword: '' })
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">Change Password</h1>
      <div className="max-w-md rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <input type={show.old ? 'text' : 'password'} value={form.oldPassword} onChange={(e) => setForm({ ...form, oldPassword: e.target.value })} required className="w-full rounded border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none" />
              <button type="button" onClick={() => setShow({ ...show, old: !show.old })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <input type={show.new ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full rounded border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none" />
              <button type="button" onClick={() => setShow({ ...show, new: !show.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input type={show.confirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required className="w-full rounded border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none" />
              <button type="button" onClick={() => setShow({ ...show, confirm: !show.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
