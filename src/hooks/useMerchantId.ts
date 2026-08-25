import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from './useAuth'
import { useCRUD } from './useCRUD'
import type { Merchant } from '../types'

export function useMerchantId() {
  const { user, profile } = useAuth()
  const { data: merchants } = useCRUD<Merchant>({ table: 'merchants' })
  const [searchParams] = useSearchParams()
  const asParam = searchParams.get('as')

  const merchantId = useMemo(() => {
    if (!user) return null
    if (asParam && profile?.role === 'admin') return asParam
    const merchant = merchants.find(m => m.user_id === user.id)
    return merchant?.id || null
  }, [user, profile, merchants, asParam])

  return merchantId
}
