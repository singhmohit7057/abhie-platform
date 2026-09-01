import { Link } from 'react-router-dom'

const modules = [
  {
    title: 'Manage Accounts',
    links: [
      { label: 'Change Password', path: '/merchant/accounts/password' },
      { label: 'Edit Account', path: '/merchant/accounts/edit' },
    ],
  },
  {
    title: 'Manage Cards',
    links: [
      { label: 'View Cards', path: '/merchant/cards' },
    ],
  },
  {
    title: 'Manage Stores',
    links: [
      { label: 'Add Store', path: '/merchant/stores/add' },
      { label: 'View Store', path: '/merchant/stores' },
    ],
  },
  {
    title: 'Manage Clients',
    links: [
      { label: 'Add Clients', path: '/merchant/clients/add' },
      { label: 'View Clients', path: '/merchant/clients' },
    ],
  },
  {
    title: 'Manage Items',
    links: [
      { label: 'View Items', path: '/merchant/items' },
    ],
  },
  {
    title: 'Manage Billing',
    links: [
      { label: 'Add Billing', path: '/merchant/billing/add' },
      { label: 'View Billing', path: '/merchant/billing' },
    ],
  },
  {
    title: 'Reports',
    links: [
      { label: 'Sales Reports', path: '/merchant/reports?type=sales' },
      { label: 'Payment Mode wise report', path: '/merchant/reports?type=payment' },
      { label: 'Settlement', path: '/merchant/reports?type=settlement' },
      { label: 'Cashback Report', path: '/merchant/reports?type=cashback' },
    ],
  },
  {
    title: 'Manage Redemption',
    links: [
      { label: 'Redeem', path: '/merchant/redemption' },
      { label: 'View History', path: '/merchant/redemption' },
    ],
  },
  {
    title: 'Manage Feedback/Complaints',
    links: [
      { label: 'Add Complaints/Query', path: '/merchant/feedback' },
      { label: 'Add Feedbacks', path: '/merchant/feedback' },
      { label: 'View Complaints/Query', path: '/merchant/feedback' },
      { label: 'View Feedbacks', path: '/merchant/feedback' },
    ],
  },
]

export function MerchantDashboard() {
  return (
    <div>
      <div className="mx-auto max-w-6xl grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <div key={mod.title} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 rounded-t-xl bg-[#bf282d] px-4 py-3">
              <img src="/enterprise_icon.png" alt="" className="h-10 w-10" />
              <h3 className="text-base font-semibold text-white">{mod.title}</h3>
            </div>
            <div className="px-4 py-2">
              {mod.links.map((link) => (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  className="block border-b border-dashed border-gray-200 py-1.5 text-sm text-gray-900 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
