import Layout from '../../components/Layout'
import { useApp } from '../../context/AppContext'
import { earningsChart } from '../../data/mockData'
import { TrendingUp, Star, Car } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const weeklyTrips = [
  { date: 'الأحد',    trips: 8,  earnings: 92 },
  { date: 'الاثنين', trips: 11, earnings: 128 },
  { date: 'الثلاثاء', trips: 7, earnings: 84 },
  { date: 'الأربعاء', trips: 13, earnings: 156 },
  { date: 'الخميس',  trips: 10, earnings: 120 },
  { date: 'الجمعة',  trips: 6,  earnings: 70 },
  { date: 'السبت',   trips: 3,  earnings: 38 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl">
        <p className="font-bold">{label}</p>
        <p>{payload[0]?.value} ر.س</p>
      </div>
    )
  }
  return null
}

export default function Earnings() {
  const { user } = useApp()

  return (
    <Layout title="الأرباح">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Total balance */}
        <div className="card bg-gradient-to-l from-primary-500 to-primary-400 text-black border-0">
          <p className="font-semibold opacity-80 text-sm">إجمالي أرباح اليوم</p>
          <p className="text-5xl font-black mt-1">45.60 <span className="text-2xl">ر.س</span></p>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'رحلات اليوم', value: '4' },
              { label: 'هذا الأسبوع', value: '456 ر.س' },
              { label: 'هذا الشهر',   value: '1,847 ر.س' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-black/15 rounded-xl py-2 px-3 text-center">
                <p className="font-black">{value}</p>
                <p className="text-xs opacity-75 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats chips */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Car,       label: 'رحلات الأسبوع', value: '58',  color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
            { icon: TrendingUp, label: 'أعلى يوم',      value: 'الأربعاء', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
            { icon: Star,       label: 'تقييمك',        value: '4.9★', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="card text-center">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon size={18} className={color} />
              </div>
              <p className="font-black text-sm">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Earnings chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">أرباح اليوم</h2>
            <select className="text-xs bg-gray-100 dark:bg-dark-border rounded-lg px-2 py-1 border-0 outline-none">
              <option>اليوم</option>
              <option>الأسبوع</option>
              <option>الشهر</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={earningsChart}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5c518" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f5c518" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="amount" stroke="#f5c518" strokeWidth={2.5} fill="url(#earningsGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly breakdown */}
        <div className="card">
          <h2 className="font-bold mb-4">تفاصيل الأسبوع</h2>
          <div className="space-y-3">
            {weeklyTrips.map(day => (
              <div key={day.date} className="flex items-center gap-4">
                <span className="text-sm text-gray-500 w-16 shrink-0">{day.date}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${(day.earnings / 160) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold w-16 text-left shrink-0">{day.earnings} ر.س</span>
                <span className="text-xs text-gray-400 w-10 text-left shrink-0">{day.trips} رحلة</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer */}
        <button className="btn-outline w-full text-lg py-4">
          تحويل الأرباح للبنك
        </button>
      </div>
    </Layout>
  )
}
