import { useAuth } from '../../hooks/useAuth'
import { supabaseMerchant } from '../../lib/supabase'

export function MerchantViewAccount() {
  const { profile } = useAuth(supabaseMerchant)

  const rows = [
    { label: 'Name', value: profile?.full_name },
    { label: 'Email', value: profile?.email },
    { label: 'Phone', value: profile?.phone || '—' },
    { label: 'User ID', value: (profile as any)?.user_id || '—' },
  ]

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-red-700">My Account</h1>
      <div className="rounded-lg border bg-white p-6 max-w-xl">
        <table className="w-full text-sm">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label} className="border-b border-gray-100 last:border-0">
                <td className="py-3 pr-6 font-medium text-gray-700 whitespace-nowrap w-28">{label}:</td>
                <td className="py-3 text-gray-900">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
