import clsx from 'clsx'

export default function StatsCard({ label, value, icon: Icon, color = 'yellow', trend }) {
  const colors = {
    yellow: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  }
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center', colors[color])}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-500">{trend}</span>
        )}
      </div>
      <p className="mt-4 text-2xl font-black">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  )
}
