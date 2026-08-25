import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency, formatDate } from '../lib/utils'
import { User, Package, CreditCard, LogOut, Crown, Truck, Gift, Zap, ShoppingBag, Diamond, RotateCcw, CheckCircle, Users, Copy, Share2, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'

type Tab = 'profile' | 'orders' | 'card' | 'wallet' | 'plus' | 'referral'

export function Account() {
  const { user, profile, signOut } = useAuth()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const validTabs: Tab[] = ['profile', 'orders', 'card', 'wallet', 'plus', 'referral']
  const [activeTab, setActiveTab] = useState<Tab>(tabParam && validTabs.includes(tabParam) ? tabParam : 'profile')

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const tabs = [
    { key: 'profile' as Tab, label: 'My Profile', icon: User },
    { key: 'orders' as Tab, label: 'My Orders', icon: Package },
    { key: 'card' as Tab, label: 'My Card', icon: CreditCard },
    { key: 'wallet' as Tab, label: 'Wallet', icon: Wallet },
    { key: 'plus' as Tab, label: 'Abhie Plus', icon: Crown },
    { key: 'referral' as Tab, label: 'Referrals', icon: Users },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">My Account</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="space-y-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm ${activeTab === key ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
          <button onClick={() => signOut()} className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
            <LogOut size={16} /> Logout
          </button>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && <ProfileSection user={user} profile={profile} />}
          {activeTab === 'orders' && <OrdersSection />}
          {activeTab === 'card' && <CardSection />}
          {activeTab === 'wallet' && <WalletSection />}
          {activeTab === 'plus' && <PlusSection />}
          {activeTab === 'referral' && <ReferralSection />}
        </div>
      </div>
    </div>
  )
}

function ProfileSection({ user, profile }: { user: any; profile: any }) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
          <p className="mt-1 text-sm text-gray-900">{profile?.full_name || 'Not set'}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
          <p className="mt-1 text-sm text-gray-900">{user?.email || 'Not set'}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
          <p className="mt-1 text-sm text-gray-900">{profile?.phone || user?.phone || 'Not set'}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Member Since</label>
          <p className="mt-1 text-sm text-gray-900">{user?.created_at ? formatDate(user.created_at) : '-'}</p>
        </div>
      </div>
    </div>
  )
}

function OrdersSection() {
  const orders = [
    { id: 'ORD-001', date: '2024-01-15', items: 3, total: 2499, status: 'Delivered' },
    { id: 'ORD-002', date: '2024-01-20', items: 1, total: 899, status: 'Shipped' },
    { id: 'ORD-003', date: '2024-01-25', items: 2, total: 1599, status: 'Processing' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-500">{formatDate(order.date)} &middot; {order.items} items</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
              <span className={`text-xs font-medium ${order.status === 'Delivered' ? 'text-brand-600' : order.status === 'Shipped' ? 'text-blue-600' : 'text-orange-600'}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function CardSection() {
  const cardNumber = 'ABHI 2024 0091 1711'

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">My Loyalty Card</h2>

      {/* Card Visual */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-800 to-gray-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-8 translate-y-8 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <img src="/abhilogo.webp" alt="Abhi-E" className="h-8 object-contain" />
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">LOYALTY</span>
          </div>

          <p className="mt-8 text-2xl font-bold tracking-[0.25em]">{cardNumber}</p>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wide opacity-70">Card Holder</p>
              <p className="text-sm font-semibold">Abhishek Singh</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide opacity-70">Member Since</p>
              <p className="text-sm font-semibold">Jan 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Card Number</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 tracking-wide">{cardNumber}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Card Status</p>
            <span className="mt-1 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">Active</span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Card Type</p>
            <p className="mt-1 text-sm text-gray-900">Loyalty Member</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Issued On</p>
            <p className="mt-1 text-sm text-gray-900">01 Jan 2024</p>
          </div>
        </div>
      </div>

      {/* Usage Note */}
      <div className="rounded-xl bg-brand-50 p-4">
        <p className="text-sm font-medium text-brand-800">How to use your card</p>
        <p className="mt-1 text-xs text-brand-700">Show your card number at any Abhie partner store to earn and redeem rewards. You can also use it during online checkout.</p>
      </div>
    </div>
  )
}

function WalletSection() {
  const transactions = [
    { id: 'TXN-001', date: '2024-01-15', description: 'Order #ORD-001 (3 items)', spent: 2499, pointsEarned: 100, pointsRedeemed: 0 },
    { id: 'TXN-002', date: '2024-01-20', description: 'Order #ORD-002 (1 item)', spent: 899, pointsEarned: 36, pointsRedeemed: 0 },
    { id: 'TXN-003', date: '2024-01-25', description: 'Order #ORD-003 (2 items)', spent: 1599, pointsEarned: 64, pointsRedeemed: 0 },
    { id: 'TXN-004', date: '2024-02-03', description: 'Order #ORD-004 (1 item)', spent: 4999, pointsEarned: 200, pointsRedeemed: 150 },
    { id: 'TXN-005', date: '2024-02-14', description: 'Order #ORD-005 (2 items)', spent: 3200, pointsEarned: 128, pointsRedeemed: 100 },
    { id: 'TXN-006', date: '2024-03-01', description: 'Order #ORD-006 (4 items)', spent: 6750, pointsEarned: 270, pointsRedeemed: 0 },
    { id: 'TXN-007', date: '2024-03-10', description: 'Order #ORD-007 (1 item)', spent: 1299, pointsEarned: 52, pointsRedeemed: 0 },
  ]

  const totalSpent = transactions.reduce((sum, t) => sum + t.spent, 0)
  const totalPoints = transactions.reduce((sum, t) => sum + t.pointsEarned, 0)
  const totalRedeemed = transactions.reduce((sum, t) => sum + t.pointsRedeemed, 0)
  const availablePoints = totalPoints - totalRedeemed

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border p-4">
          <p className="text-xs font-medium uppercase text-gray-500">Total Spent</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs font-medium uppercase text-gray-500">Points Earned</p>
          <p className="mt-1 text-2xl font-bold text-brand-700">{totalPoints}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs font-medium uppercase text-gray-500">Points Redeemed</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">{totalRedeemed}</p>
        </div>
        <div className="rounded-xl bg-brand-50 border border-brand-200 p-4">
          <p className="text-xs font-medium uppercase text-brand-700">Available Points</p>
          <p className="mt-1 text-2xl font-bold text-brand-800">{availablePoints}</p>
        </div>
      </div>

      {/* Points Info */}
      <div className="rounded-xl bg-gradient-to-r from-brand-700 to-brand-800 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Earn Rate</p>
            <p className="text-lg font-bold">1 point per ₹25 spent</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Point Value</p>
            <p className="text-lg font-bold">1 point = ₹1</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border p-6">
        <h3 className="text-base font-bold text-gray-900">Transaction History</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium uppercase text-gray-500">
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Description</th>
                <th className="pb-2 pr-4 text-right">Spent</th>
                <th className="pb-2 pr-4 text-right">Earned</th>
                <th className="pb-2 text-right">Redeemed</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{formatDate(t.date)}</td>
                  <td className="py-3 pr-4 text-gray-900">{t.description}</td>
                  <td className="py-3 pr-4 text-right font-medium text-gray-900">{formatCurrency(t.spent)}</td>
                  <td className="py-3 pr-4 text-right">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">+{t.pointsEarned}</span>
                  </td>
                  <td className="py-3 text-right">
                    {t.pointsRedeemed > 0 ? (
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">-{t.pointsRedeemed}</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t font-bold">
                <td className="pt-3 pr-4" colSpan={2}>Total</td>
                <td className="pt-3 pr-4 text-right text-gray-900">{formatCurrency(totalSpent)}</td>
                <td className="pt-3 pr-4 text-right">
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">+{totalPoints}</span>
                </td>
                <td className="pt-3 text-right">
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">-{totalRedeemed}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Redeem Info */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-900">How to redeem points</p>
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          <li>• Use points during checkout to get instant discount</li>
          <li>• Minimum 100 points required to redeem</li>
          <li>• Points expire 12 months after earning</li>
          <li>• Cannot be combined with certain promotional offers</li>
        </ul>
      </div>
    </div>
  )
}

function PlusSection() {
  const [isPlusMember] = useState(true)

  const plusBenefits = [
    { icon: Truck, title: 'Lifetime Free Shipping', desc: 'Unlimited free deliveries on all orders' },
    { icon: Gift, title: 'Exclusive Vouchers', desc: 'Monthly vouchers & special discount coupons' },
    { icon: Zap, title: 'Lightning Fast Delivery', desc: 'Priority processing & express shipping' },
    { icon: ShoppingBag, title: 'Early Access to Sales', desc: 'Shop new launches before anyone else' },
    { icon: Diamond, title: 'Premium Support', desc: 'Dedicated priority customer assistance' },
    { icon: RotateCcw, title: 'Extended Returns', desc: '60-day return window instead of 30 days' },
  ]

  if (isPlusMember) {
    return (
      <div className="space-y-6">
        {/* Membership Status Card */}
        <div className="overflow-hidden rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center justify-between border-b border-red-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Crown size={20} className="text-red-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Abhie Plus Member</h2>
                <p className="text-sm text-gray-500">Premium Membership</p>
              </div>
            </div>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">Active</span>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Member ID</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">PLUS-2024-001</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Purchased On</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">15 Mar 2024</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Valid Till</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">14 Mar 2025</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Amount Paid</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">₹1,000/Year</p>
            </div>
          </div>
        </div>

        {/* Savings Summary */}
        <div className="rounded-xl bg-gradient-to-r from-red-700 to-red-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Savings This Year</p>
              <p className="text-3xl font-bold">₹4,280</p>
              <p className="mt-1 text-sm opacity-80">You've saved 4x your membership fee!</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Orders with Plus Benefits</p>
              <p className="text-3xl font-bold">12</p>
            </div>
          </div>
        </div>

        {/* Benefits Breakdown */}
        <div className="rounded-xl border p-6">
          <h3 className="text-base font-bold text-gray-900">Your Plus Benefits</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {plusBenefits.map((b) => (
              <div key={b.title} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <b.icon size={16} className="text-red-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="rounded-xl border p-6">
          <h3 className="text-base font-bold text-gray-900">Benefit Usage</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">₹2,400</p>
              <p className="text-xs text-gray-600">Shipping Saved</p>
            </div>
            <div className="rounded-lg bg-brand-50 p-4 text-center">
              <p className="text-2xl font-bold text-brand-700">₹1,280</p>
              <p className="text-xs text-gray-600">Voucher Discounts</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">₹600</p>
              <p className="text-xs text-gray-600">Early Access Deals</p>
            </div>
          </div>
        </div>

        {/* Renewal Info */}
        <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Auto-renewal on 14 Mar 2025</p>
            <p className="text-xs text-gray-500">Your membership will renew at ₹1,000/year</p>
          </div>
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Manage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Not a member - Promo */}
      <div className="overflow-hidden rounded-xl border-2 border-dashed border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <Crown size={28} className="text-red-700" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">You're not an Abhie Plus member yet</h2>
        <p className="mt-2 text-sm text-gray-600">
          Unlock ₹10,000+ in annual savings with premium benefits
        </p>
      </div>

      {/* Benefits */}
      <div className="rounded-xl border p-6">
        <h3 className="text-base font-bold text-gray-900">What you'll get with Abhie Plus</h3>
        <div className="mt-4 space-y-3">
          {plusBenefits.map((b) => (
            <div key={b.title} className="flex items-center gap-3 rounded-lg border p-3">
              <CheckCircle size={18} className="shrink-0 text-brand-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{b.title}</p>
                <p className="text-xs text-gray-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-xl bg-gradient-to-r from-red-700 to-red-800 p-6 text-center text-white">
        <p className="text-sm opacity-80">Join Abhie Plus for just</p>
        <p className="mt-1 text-4xl font-bold">₹1,000<span className="text-lg font-normal opacity-80">/year</span></p>
        <p className="mt-2 text-sm opacity-80">That's less than ₹3/day for unlimited benefits!</p>
        <button
          onClick={() => toast.success('Redirecting to payment...')}
          className="mt-4 rounded-full bg-white px-8 py-3 text-sm font-bold text-red-700 shadow-lg transition hover:shadow-xl"
        >
          Get Abhie Plus Now
        </button>
      </div>

      {/* Learn More */}
      <div className="text-center">
        <Link to="/plus" className="text-sm font-medium text-red-700 hover:underline">
          Learn more about Abhie Plus →
        </Link>
      </div>
    </div>
  )
}

function ReferralSection() {
  const referralCode = 'ABHIE-ABHI2024'
  const referralLink = `https://abhie.in/signup?ref=${referralCode}`

  const referrals = [
    { name: 'Rahul Kumar', date: '2024-02-10', status: 'Joined', reward: 100 },
    { name: 'Sneha Patel', date: '2024-02-18', status: 'Joined', reward: 100 },
    { name: 'Amit Verma', date: '2024-03-05', status: 'Pending', reward: 0 },
    { name: 'Priya Singh', date: '2024-03-12', status: 'Joined', reward: 100 },
    { name: 'Deepak Jha', date: '2024-03-20', status: 'Pending', reward: 0 },
  ]

  const totalEarned = referrals.reduce((sum, r) => sum + r.reward, 0)
  const successfulReferrals = referrals.filter(r => r.status === 'Joined').length

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode)
    toast.success('Referral code copied!')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied!')
  }

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({ title: 'Join Abhie', text: `Use my referral code ${referralCode} and get ₹100 off!`, url: referralLink })
    } else {
      copyLink()
    }
  }

  return (
    <div className="space-y-6">
      {/* Referral Hero */}
      <div className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Gift size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Refer & Earn</h2>
            <p className="text-sm opacity-90">Invite friends and earn ₹100 for each successful referral</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-brand-700">{referrals.length}</p>
          <p className="text-xs text-gray-600">Total Referrals</p>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{successfulReferrals}</p>
          <p className="text-xs text-gray-600">Successful Joins</p>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">₹{totalEarned}</p>
          <p className="text-xs text-gray-600">Total Earned</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="rounded-xl border p-6">
        <h3 className="text-base font-bold text-gray-900">Your Referral Code</h3>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center rounded-lg border-2 border-dashed border-brand-300 bg-brand-50 px-4 py-3">
            <span className="flex-1 text-lg font-bold tracking-wider text-brand-800">{referralCode}</span>
            <button onClick={copyCode} className="rounded-md bg-brand-700 p-2 text-white hover:bg-brand-800" title="Copy code">
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Referral Link</p>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
            />
            <button onClick={copyLink} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Copy size={16} />
            </button>
            <button onClick={shareReferral} className="rounded-lg bg-brand-700 px-3 py-2 text-white hover:bg-brand-800">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="rounded-xl border p-6">
        <h3 className="text-base font-bold text-gray-900">How It Works</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">1</div>
            <p className="mt-2 text-sm font-medium text-gray-900">Share Your Code</p>
            <p className="text-xs text-gray-500">Share your referral code with friends & family</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">2</div>
            <p className="mt-2 text-sm font-medium text-gray-900">Friend Signs Up</p>
            <p className="text-xs text-gray-500">They enter your code during registration</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">3</div>
            <p className="mt-2 text-sm font-medium text-gray-900">Both Earn ₹100</p>
            <p className="text-xs text-gray-500">You get ₹100 and they get ₹100 off first order</p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="rounded-xl border p-6">
        <h3 className="text-base font-bold text-gray-900">Referral History</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium uppercase text-gray-500">
                <th className="pb-2 pr-4">Friend</th>
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {referrals.map((r, i) => (
                <tr key={i}>
                  <td className="py-3 pr-4 font-medium text-gray-900">{r.name}</td>
                  <td className="py-3 pr-4 text-gray-600">{formatDate(r.date)}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.status === 'Joined' ? 'bg-brand-100 text-brand-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {r.reward > 0 ? `₹${r.reward}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms */}
      <div className="rounded-xl bg-gray-50 p-4">
        <p className="text-xs font-medium text-gray-500">Referral Terms:</p>
        <ul className="mt-1 space-y-0.5 text-xs text-gray-500">
          <li>• Reward is credited once the referred friend makes their first purchase</li>
          <li>• Maximum 50 referrals per account</li>
          <li>• Referral rewards cannot be combined with other offers</li>
          <li>• Abhi-E reserves the right to modify or terminate the referral program</li>
        </ul>
      </div>
    </div>
  )
}
