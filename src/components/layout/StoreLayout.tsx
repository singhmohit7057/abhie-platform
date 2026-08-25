import { useState } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Search, ShoppingCart, User, Heart, Menu, X, Wallet } from 'lucide-react'
import { useCart } from '../../store/useCart'

export function StoreLayout() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, profile, signOut } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <div className="bg-brand-800 text-white text-xs py-1.5 px-4 text-center">
        Free delivery on orders above ₹499 | Use code <strong>FLAT20</strong> for 20% off
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/abhilogo.webp" alt="Abhi-E" className="h-10 object-contain" />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <Link to="/account?tab=wallet" className="hidden sm:flex items-center gap-1.5 rounded bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700">
                <Wallet size={16} />
                <span className="text-xs font-bold">800 pts</span>
              </Link>
            )}
            <Link to="/wishlist" className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-brand-700">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="relative flex items-center gap-1 text-gray-600 hover:text-brand-700">
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-600 hover:text-brand-700">
                  <User size={20} />
                  <span className="hidden sm:inline text-sm">{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-lg border bg-white py-2 shadow-lg group-hover:block">
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                  <Link to="/account?tab=card" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Card</Link>
                  <Link to="/account?tab=orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                  <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login?redirect=/" className="text-sm font-medium text-gray-700 hover:text-brand-700">
                  Login
                </Link>
                <Link to="/signup" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">
                  Sign Up
                </Link>
              </>
            )}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-gray-600">
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileMenu && (
          <div className="border-t p-4 md:hidden">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </form>
          </div>
        )}

        {/* Category Nav */}
        <nav className="border-t bg-gray-50">
          <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2 text-sm">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'font-medium text-brand-700' : 'text-gray-600 hover:text-brand-700'}>Home</NavLink>
            <NavLink to="/catalog" className={({ isActive }) => isActive ? 'font-medium text-brand-700' : 'text-gray-600 hover:text-brand-700'}>All Products</NavLink>
            <NavLink to="/catalog?category=smartphones" className="text-gray-600 hover:text-brand-700 whitespace-nowrap">Smartphones</NavLink>
            <NavLink to="/catalog?category=laptops" className="text-gray-600 hover:text-brand-700 whitespace-nowrap">Laptops</NavLink>
            <NavLink to="/catalog?category=appliances" className="text-gray-600 hover:text-brand-700 whitespace-nowrap">Appliances</NavLink>
            <NavLink to="/catalog?category=apparels" className="text-gray-600 hover:text-brand-700 whitespace-nowrap">Apparels</NavLink>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white text-gray-600">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-3">
                <img src="/abhilogo.webp" alt="Abhi-E" className="h-10 object-contain" />
              </div>
              <p className="text-sm">Leading Discount Engine. Your one-stop shop for the best deals on electronics, fashion, and more.</p>
            </div>
            <div>
              <h4 className="mb-3 font-medium text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-brand-700">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-brand-700">Contact</Link></li>
                <li><Link to="/terms" className="hover:text-brand-700">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-brand-700">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-brand-700">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-medium text-gray-900">Customer</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/account/orders" className="hover:text-brand-700">Track Order</Link></li>
                <li><Link to="/returns" className="hover:text-brand-700">Returns & Refunds</Link></li>
                <li><Link to="/shipping" className="hover:text-brand-700">Shipping Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-medium text-gray-900">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Jamshedpur, Jharkhand 831001</li>
                <li>+91-9117115050</li>
                <li>care@abhie.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-4 text-center text-sm">
            <p>&copy; 2024 Abhi-E. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
