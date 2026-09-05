import { Outlet, useNavigate, Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogOut, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const sidebarItems = [
  { label: 'Manage Account', links: [{ label: 'Change Password', path: '/admin/accounts/password' }, { label: 'Edit Account', path: '/admin/accounts/edit' }] },
  { label: 'Manage Category', links: [{ label: 'Add Category', path: '/admin/categories/add' }, { label: 'View Categories', path: '/admin/categories' }] },
  { label: 'Manage Merchant', links: [{ label: 'Add Merchant', path: '/admin/merchants/add' }, { label: 'View Merchant', path: '/admin/merchants' }] },
  { label: 'Manage Cards', links: [{ label: 'Add Cards', path: '/admin/cards/add' }, { label: 'View Cards', path: '/admin/cards' }] },
  { label: 'Manage Clients', links: [{ label: 'View Clients', path: '/admin/clients' }] },
  { label: 'Manage Vouchers', links: [{ label: 'Add Vouchers', path: '/admin/vouchers/add' }, { label: 'View Vouchers', path: '/admin/vouchers' }] },
  { label: 'Manage Coupons', links: [{ label: 'Add Coupons', path: '/admin/coupons/add' }, { label: 'View Coupons', path: '/admin/coupons' }] },
  { label: 'Manage Items', links: [{ label: 'Add Items', path: '/admin/items/add' }, { label: 'View Items', path: '/admin/items' }] },
  { label: 'Manage Payments', links: [{ label: 'Add Payments', path: '/admin/payments/add' }, { label: 'View Payments', path: '/admin/payments' }] },
  { label: 'Manage Bookings/Tickets', links: [{ label: 'View Bookings', path: '/admin/bookings' }] },
  { label: 'Order History', links: [{ label: 'Users Orders', path: '/admin/orders' }] },
  { label: 'Manage Reports', links: [{ label: 'Reseller Reports', path: '/admin/reports?type=reseller' }, { label: 'Payment Reports', path: '/admin/reports?type=payment' }, { label: 'Membership Card Reports', path: '/admin/reports?type=membership' }] },
  { label: 'Audit Trail', links: [{ label: 'View Audit Trail', path: '/admin/audit' }] },
  { label: 'Manage Complaints', links: [{ label: 'View Complaints', path: '/admin/feedback' }] },
  { label: 'Manage Feedbacks', links: [{ label: 'View Feedbacks', path: '/admin/feedback/feedbacks' }] },
]

function SidebarSection({ item }: { item: typeof sidebarItems[0] }) {
  const location = useLocation()
  const isActiveSection = item.links.some(link => location.pathname.startsWith(link.path.split('?')[0]))
  const [open, setOpen] = useState(isActiveSection)
  return (
    <div>
      <button onClick={() => setOpen(!open)} className={`flex w-full items-center gap-1.5 py-1 text-xs hover:text-[#bf282d] ${isActiveSection ? 'text-[#bf282d] font-bold' : 'text-gray-800'}`}>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <FolderOpen size={14} className="text-yellow-600" />
        <span>{item.label}</span>
      </button>
      {open && (
        <div className="ml-7 space-y-0.5">
          {item.links.map(link => (
            <NavLink key={link.path + link.label} to={link.path} className={({ isActive }) => `block py-0.5 text-xs ${isActive ? 'text-[#bf282d] font-bold' : 'text-gray-900 hover:text-[#bf282d]'}`}>
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isDashboard = location.pathname === '/admin'

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white px-6 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/abhilogo.webp" alt="Abhi-E" className="h-7 object-contain" />
          <span className="text-sm text-gray-600">Welcome <strong>Abhi-E</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Logged in as <strong>{profile?.full_name || 'administrator'}</strong>
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
      <Link to="/admin" className="block bg-[#bf282d] py-2.5 text-center hover:bg-[#a32028] transition">
        <h1 className="text-base font-semibold text-white">
          Abhi-E (Administrator Panel)
        </h1>
      </Link>

      {/* Content with Sidebar */}
      <div className={`flex flex-1 ${isDashboard ? '' : 'px-6 py-6'}`}>
        {isDashboard ? (
          <main className="flex-1 px-8 py-6">
            <Outlet />
          </main>
        ) : (
          <div className="flex flex-1 gap-5">
            {/* Sidebar */}
            <aside className="hidden w-60 shrink-0 rounded-lg border border-gray-300 bg-white p-4 lg:block">
              <div className="space-y-1">
                {sidebarItems.map(item => (
                  <SidebarSection key={item.label} item={item} />
                ))}
              </div>
            </aside>

            {/* Page Content */}
            <main className="flex-1 rounded-lg border border-gray-300 bg-white p-6">
              <Outlet />
            </main>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500">
        Copyright &copy; 2024 <span className="text-red-700">Abhi-e</span>. All Rights Reserved
      </footer>
    </div>
  )
}
