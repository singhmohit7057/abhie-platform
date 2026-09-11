import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCRUD } from '../../hooks/useCRUD'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { generateSlug } from '../../lib/utils'
import type { Category } from '../../types'

export function AddCategory() {
  const { data: categories } = useCRUD<Category>({ table: 'categories' })
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', description: '', is_active: 'true',
  })

  useEffect(() => {
    if (editId && categories.length > 0) {
      const cat = categories.find(c => c.id === editId)
      if (cat) {
        setForm({ name: cat.name, description: cat.description || '', is_active: String(cat.is_active) })
      }
    }
  }, [editId, categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const payload = {
      name: form.name,
      slug: generateSlug(form.name),
      description: form.description || null,
      is_active: form.is_active === 'true',
    }
    if (editId) {
      const { error: updateError } = await supabase.from('categories').update(payload).eq('id', editId)
      if (updateError) {
        if (updateError.message.includes('unique') || updateError.message.includes('duplicate')) {
          setError('Category with this title already exists!')
        } else {
          setError(updateError.message)
        }
        return
      }
      navigate('/admin/categories')
    } else {
      const { error: createError } = await supabase.from('categories').insert(payload as any)
      if (createError) {
        if (createError.message.includes('unique') || createError.message.includes('duplicate')) {
          setError('Category with this title already exists!')
        } else {
          setError(createError.message)
        }
        return
      }
      navigate('/admin/categories')
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">{editId ? 'Edit Category' : 'Add Category'}</h1>

      <div className="rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <table className="w-full max-w-xl text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Title:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap align-top">Description:</td>
                <td className="py-2"><textarea className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">Status:</td>
                <td className="py-2">
                  <select className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.value })}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          {error && <p className="mt-3 text-center text-sm font-bold text-red-600">{error}</p>}
          <div className="mt-5 flex gap-2">
            <Button type="submit">{editId ? 'Update' : 'Save'}</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/categories')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
