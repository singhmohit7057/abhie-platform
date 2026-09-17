import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface UseCRUDOptions {
  table: string
  orderBy?: string
  ascending?: boolean
  filters?: Record<string, unknown>
  skip?: boolean
}

export function useCRUD<T extends { id: string }>({
  table,
  orderBy = 'created_at',
  ascending = false,
  filters,
  skip = false,
}: UseCRUDOptions) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(!skip)

  const fetchData = useCallback(async () => {
    if (skip) { setData([]); setLoading(false); return }
    setLoading(true)

    let query = supabase.from(table).select('*').order(orderBy, { ascending })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data: result, error } = await query
    if (!error) {
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
    if (error) return { ok: false, error: error.message }
    await fetchData()
    return { ok: true, error: null }
  }

  const update = async (id: string, updates: Partial<T>) => {
    const { error } = await supabase.from(table).update(updates as any).eq('id', id)
    if (error) return { ok: false, error: error.message }
    await fetchData()
    return { ok: true, error: null }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
    await fetchData()
    return { ok: true, error: null }
  }

  return { data, loading, fetchData, create, update, remove }
}
