import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface LoginProps {
  variant?: 'store' | 'admin' | 'merchant'
}

export function Login({ variant = 'store' }: LoginProps) {
  const [tab, setTab] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { signInWithEmail, signInWithOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultRedirect = variant === 'admin' ? '/admin' : variant === 'merchant' ? '/merchant' : '/'
  const redirectTo = searchParams.get('redirect') || defaultRedirect

  const titles = {
    store: 'Sign In to Shop Abhie',
    admin: 'Administrator Panel',
    merchant: 'Merchant Panel',
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signInWithEmail(email, password)
    if (error) {
      toast.error(error.message)
    } else {
      navigate(redirectTo)
    }
    setLoading(false)
  }

  const handleSendOtp = async () => {
    if (!phone) return toast.error('Enter phone number')
    setLoading(true)
    const { error } = await signInWithOtp(`+91${phone}`)
    if (error) {
      toast.error(error.message)
    } else {
      setOtpSent(true)
      toast.success('OTP sent!')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await verifyOtp(`+91${phone}`, otp)
    if (error) {
      toast.error(error.message)
    } else {
      navigate(redirectTo)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <img src="/abhilogo.webp" alt="Abhi-E" className="mx-auto h-14 object-contain" />
          <p className="mt-2 text-sm text-gray-500">{titles[variant]}</p>
        </div>

        <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setTab('email')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              tab === 'email'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setTab('phone')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              tab === 'phone'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {tab === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                placeholder="admin@abhie.in"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-700 py-2.5 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1 flex">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className="w-full rounded-r-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>
            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
            )}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full rounded-lg bg-red-700 py-2.5 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-red-700 py-2.5 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
            )}
          </form>
        )}

        {variant === 'store' && (
          <div className="mt-4 flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-red-600 hover:underline">
              Forgot password?
            </Link>
            <Link to="/signup" className="text-sm font-medium text-green-700 hover:underline">
              Create account
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
