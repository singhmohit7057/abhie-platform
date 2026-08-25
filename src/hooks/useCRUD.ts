import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface UseCRUDOptions {
  table: string
  orderBy?: string
  ascending?: boolean
  filters?: Record<string, unknown>
}

export function useCRUD<T extends { id: string }>({
  table,
  orderBy = 'created_at',
  ascending = false,
  filters,
}: UseCRUDOptions) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)

    let query = supabase.from(table).select('*').order(orderBy, { ascending })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data: result, error } = await query
    if (error) {
      toast.error(`Failed to fetch ${table}`)
    } else {
      setData(result as T[])
    }
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, orderBy, ascending, JSON.stringify(filters)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const create = async (item: Omit<T, 'id' | 'created_at'>) => {
    const { error } = await supabase.from(table).insert(item as any)
    if (error) {
      toast.error(`Failed to create: ${error.message}`)
      return false
    }
    toast.success('Created successfully')
    await fetchData()
    return true
  }

  const update = async (id: string, updates: Partial<T>) => {
    const { error } = await supabase.from(table).update(updates as any).eq('id', id)
    if (error) {
      toast.error(`Failed to update: ${error.message}`)
      return false
    }
    toast.success('Updated successfully')
    await fetchData()
    return true
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      toast.error(`Failed to delete: ${error.message}`)
      return false
    }
    toast.success('Deleted successfully')
    await fetchData()
    return true
  }

  return { data, loading, fetchData, create, update, remove }
}
