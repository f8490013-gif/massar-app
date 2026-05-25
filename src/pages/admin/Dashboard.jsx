import Layout from '../../components/Layout'
import { adminStats, adminTripsChart, adminRecentTrips } from '../../data/mockData'
import StatsCard from '../../components/common/StatsCard'
import { Users, School, Car, DollarSign, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import clsx from 'clsx'

const statusStyle = {
  'مكتمل': 'badge-success',
  'جارٍ':  'badge-warning',
  'ملغي':  'badge-error',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl">
        <p className="font-bold">{label}</p>
        <p>{payload[0]?.value} رحلة</p>
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  return (
    <Layout title="لوحة الإدارة">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="إجمالي السائقين"  value={adminStats.passengers.toLocaleString()} icon={Users}       color="yellow" trend="+12%" />
          <StatsCard label="إجمالي المدارس"   value={adminStats.schools}                     icon={School}      color="blue"   trend="+3" />
          <StatsCard label="إجمالي الرحلات"   value={adminStats.trips.toLocaleString()}      icon={Car}         color="green"  trend="+8%" />
          <StatsCard label="الإيرادات (ر.س)"  value={adminStats.revenue.toLocaleString()}    icon={DollarSign}  color="purple" trend="+15%" />
        </div>

        {/* Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold">الرحلات خلال آخر 7 أيام</h2>
              <p className="text-xs text-gray-400 mt-0.5">إجمالي {adminTripsChart.reduce((a, d) => a + d.trips, 0)} رحلة</p>
            </div>
            <div className="flex items-center gap-2 text-green-500 font-semibold text-sm bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-xl">
              <TrendingUp size={14} /> +18% هذا الأسبوع
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={adminTripsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" className="hidden dark:block" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="trips" stroke="#f5c518" strokeWidth={3} dot={{ fill: '#f5c518', r: 5, strokeWidth: 0 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent trips table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">الرحلات الأخيرة</h2>
            <button className="text-sm text-primary-600 dark:text-primary-400 font-semibold">عرض الكل</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-gray-400 border-b border-gray-100 dark:border-dark-border">
                  <th className="pb-3 font-semibold">المدرسة / الوجهة</th>
                  <th className="pb-3 font-semibold">السائق</th>
                  <th className="pb-3 font-semibold">الوقت</th>
                  <th className="pb-3 font-semibold">المبلغ</th>
                  <th className="pb-3 font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {adminRecentTrips.map(trip => (
                  <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors">
                    <td className="py-3 font-medium">{trip.school}</td>
                    <td className="py-3 text-gray-500">{trip.driver}</td>
                    <td className="py-3 text-gray-500">{trip.time}</td>
                    <td className="py-3 font-bold">{trip.amount > 0 ? `${trip.amount} ر.س` : '—'}</td>
                    <td className="py-3">
                      <span className={clsx('badge', statusStyle[trip.status] || 'badge-info')}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'إضافة مدرسة',   icon: '🏫', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
            { label: 'إضافة سائق',    icon: '🚗', color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' },
            { label: 'إنشاء تقرير',   icon: '📊', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
            { label: 'إرسال إشعار',   icon: '🔔', color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
          ].map(({ label, icon, color }) => (
            <button key={label} className={`card flex flex-col items-center gap-3 py-5 hover:shadow-md transition-shadow ${color}`}>
              <span className="text-3xl">{icon}</span>
              <span className="text-xs font-bold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  )
}
