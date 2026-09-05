import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCRUD } from '../../hooks/useCRUD'
import { Button } from '../../components/ui/Button'
import type { Item, Category } from '../../types'

export function AddItem() {
  const { data: items, create, update } = useCRUD<Item>({ table: 'items' })
  const { data: categories } = useCRUD<Category>({ table: 'categories' })
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [form, setForm] = useState({
    name: '', description: '', category_id: '', price: '', mrp: '', discount_percentage: '', stock_quantity: '',
  })

  useEffect(() => {
    if (editId && items.length > 0) {
      const item = items.find(i => i.id === editId)
      if (item) {
        setForm({
          name: item.name, description: item.description || '',
          category_id: item.category_id || '', price: String(item.price),
          mrp: String(item.mrp), discount_percentage: String(item.discount_percentage),
          stock_quantity: String(item.stock_quantity),
        })
      }
    }
  }, [editId, items])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      description: form.description || null,
      category_id: form.category_id || null,
      price: parseFloat(form.price),
      mrp: parseFloat(form.mrp),
      discount_percentage: parseFloat(form.discount_percentage || '0'),
      stock_quantity: parseInt(form.stock_quantity || '0'),
      is_active: true,
      approval_status: 'approved' as const,
      merchant_id: null,
      image_url: null,
    }
    if (editId) {
      await update(editId, payload as any)
    } else {
      await create(payload as any)
    }
    navigate('/admin/items')
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">{editId ? 'Edit Item' : 'Add Item'}</h1>

      <div className="rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <table className="w-full max-w-xl text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Product Name:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap align-top">Description:</td>
                <td className="py-2"><textarea className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Category:</td>
                <td className="py-2">
                  <select className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">--- Select ---</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Price (₹):</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">MRP (₹):</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Discount (%):</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="number" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Stock Quantity:</td>
                <td className="py-2"><input className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none" type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} /></td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/items')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
