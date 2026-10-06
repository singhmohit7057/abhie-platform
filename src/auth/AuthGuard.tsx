import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabaseMerchant } from '../lib/supabase'
import type { UserRole } from '../types'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const client = requiredRole === 'merchant' ? supabaseMerchant : undefined
  const { user, profile, loading } = useAuth(client)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    const loginPath = requiredRole === 'admin' ? '/admin/login' : requiredRole === 'merchant' ? '/merchant/login' : '/login'
    return <Navigate to={loginPath} replace />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    const loginPath = requiredRole === 'merchant' ? '/merchant/login' : '/unauthorized'
    return <Navigate to={loginPath} replace />
  }

  return <>{children}</>
}
