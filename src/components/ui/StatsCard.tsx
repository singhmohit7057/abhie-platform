import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  color?: string
}

export function StatsCard({ title, value, icon: Icon, trend, color = 'red' }: StatsCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="mt-1 text-xs text-green-600">{trend}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${color}-100`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </div>
  )
}
