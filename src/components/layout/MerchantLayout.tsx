import { Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogOut } from 'lucide-react'

export function MerchantLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/merchant/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/abhilogo.webp" alt="Abhi-E" className="h-10 object-contain" />
          <span className="text-sm text-gray-600">Welcome <strong>{profile?.full_name || 'Merchant'}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Logged in as <strong>Merchant</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-red-700 hover:text-red-900"
          >
            <LogOut size={16} />
            LogOut
          </button>
        </div>
      </header>

      {/* Title Banner */}
      <Link to="/merchant" className="block bg-red-800 py-4 text-center hover:bg-red-900 transition">
        <h1 className="text-xl font-semibold text-white">
          Merchant Dashboard
        </h1>
      </Link>

      {/* Page Content */}
      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
