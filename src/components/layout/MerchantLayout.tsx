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
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white px-6 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/abhilogo.webp" alt="Abhi-E" className="h-7 object-contain" />
          <span className="text-sm text-gray-600">Welcome <strong>{profile?.full_name || 'Merchant'}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Logged in as <strong>Merchant</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-900 hover:text-gray-700"
          >
            <LogOut size={16} />
            LogOut
          </button>
        </div>
      </header>

      {/* Title Banner */}
      <Link to="/merchant" className="block bg-[#bf282d] py-4 text-center hover:bg-[#a32028] transition">
        <h1 className="text-xl font-semibold text-white">
          Merchant Dashboard
        </h1>
      </Link>

      {/* Page Content */}
      <main className="flex-1 px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500">
        Copyright &copy; 2024 <span className="text-red-700">Abhi-e</span>. All Rights Reserved
      </footer>
    </div>
  )
}
