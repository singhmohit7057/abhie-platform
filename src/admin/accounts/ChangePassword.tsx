import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'

export function ChangePassword() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: form.password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated successfully')
      setForm({ password: '', confirmPassword: '' })
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Change Password</h1>
      <div className="max-w-md rounded-xl border bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="New Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
