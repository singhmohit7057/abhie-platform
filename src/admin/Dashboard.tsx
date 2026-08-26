import { Link } from 'react-router-dom'

const modules = [
  {
    title: 'Manage Accounts',
    links: [
      { label: 'Change Password', path: '/admin/accounts/password' },
      { label: 'Edit Account', path: '/admin/accounts/edit' },
    ],
  },
  {
    title: 'Manage Category',
    links: [
      { label: 'Add Category', path: '/admin/categories/add' },
      { label: 'View Categories', path: '/admin/categories' },
    ],
  },
  {
    title: 'Manage Merchant',
    links: [
      { label: 'Add Merchant', path: '/admin/merchants/add' },
      { label: 'View Merchant', path: '/admin/merchants' },
    ],
  },
  {
    title: 'Manage Cards',
    links: [
      { label: 'Add Cards', path: '/admin/cards/add' },
      { label: 'View Cards', path: '/admin/cards' },
    ],
  },
  {
    title: 'Manage Clients',
    links: [
      { label: 'View Clients', path: '/admin/clients' },
    ],
  },
  {
    title: 'Manage Vouchers',
    links: [
      { label: 'Add Vouchers', path: '/admin/vouchers/add' },
      { label: 'View Vouchers', path: '/admin/vouchers' },
    ],
  },
  {
    title: 'Manage Coupons',
    links: [
      { label: 'Add Coupons', path: '/admin/coupons/add' },
      { label: 'View Coupons', path: '/admin/coupons' },
    ],
  },
  {
    title: 'Manage Items',
    links: [
      { label: 'Add Items', path: '/admin/items?action=add' },
      { label: 'View Items', path: '/admin/items' },
    ],
  },
  {
    title: 'Manage Payments',
    links: [
      { label: 'Add Payments', path: '/admin/payments?action=add' },
      { label: 'View Payments', path: '/admin/payments' },
    ],
  },
  {
    title: 'Manage Bookings',
    links: [
      { label: 'Add Booking', path: '/admin/bookings?action=add' },
      { label: 'Add Tickets', path: '/admin/bookings?action=add-ticket' },
      { label: 'View Tickets', path: '/admin/bookings?view=tickets' },
      { label: 'View Bookings', path: '/admin/bookings' },
    ],
  },
  {
    title: 'Order History',
    links: [
      { label: 'Users Orders', path: '/admin/orders' },
    ],
  },
  {
    title: 'Manage Reports',
    links: [
      { label: 'Reseller Reports', path: '/admin/reports?type=reseller' },
      { label: 'Payment Reports', path: '/admin/reports?type=payment' },
      { label: 'Membership Card Reports', path: '/admin/reports?type=membership' },
    ],
  },
  {
    title: 'Audit Trail',
    links: [
      { label: 'View Audit Trail', path: '/admin/audit' },
    ],
  },
  {
    title: 'Manage Complaints/Feedback',
    links: [
      { label: 'View Complaints', path: '/admin/feedback?tab=complaints' },
      { label: 'View Feedbacks', path: '/admin/feedback?tab=feedbacks' },
    ],
  },
]

export function Dashboard() {
  return (
    <div>
      <div className="mx-auto max-w-6xl grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <div key={mod.title} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 rounded-t-xl bg-red-800 px-4 py-3">
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
