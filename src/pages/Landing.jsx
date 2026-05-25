import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Shield, Clock, CreditCard, Headphones, ChevronLeft, Sun, Moon } from 'lucide-react'

const features = [
  { icon: Shield,      label: 'أمان كامل',              desc: 'سائقون موثوقون ومعتمدون لضمان سلامتك' },
  { icon: Clock,       label: 'تتبع على مدار الساعة',  desc: 'تابع رحلتك لحظة بلحظة في الوقت الفعلي' },
  { icon: CreditCard,  label: 'دفع إلكتروني',           desc: 'ادفع بسهولة عبر مدى أو Apple Pay أو نقداً' },
  { icon: Headphones,  label: 'دعم فني',                desc: 'فريق الدعم متاح على مدار الساعة لمساعدتك' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggleTheme, user } = useApp()

  // If already logged in, redirect to their portal
  function go() {
    if (user) {
      navigate(`/${user.role}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/90 dark:bg-dark-card/90 backdrop-blur border-b border-gray-100 dark:border-dark-border px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center font-black text-black text-lg">م</div>
          <span className="font-black text-xl">مسار</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={go}
            className="btn-primary py-2 px-5 text-sm"
          >
            {user ? 'لوحة التحكم' : 'تسجيل الدخول'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-white to-primary-50 dark:from-dark-bg dark:to-dark-card">
        <div className="max-w-3xl mx-auto animate-slide-up">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-primary-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/30">
                <span className="font-black text-5xl text-black">م</span>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                <span className="text-primary-500 font-black text-xs">✓</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-3">
            <span className="text-primary-500">مسار</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-8">
            تنقلك بكل أمان
          </p>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
            تطبيق النقل الذكي الذي يربط الركاب بأفضل السائقين المحترفين. نقل مدرسي آمن، رحلات يومية، وتتبع فوري.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login?role=passenger')} className="btn-primary text-lg py-4 px-8">
              ابدأ كراكب
            </button>
            <button onClick={() => navigate('/login?role=driver')} className="btn-outline text-lg py-4 px-8">
              انضم كسائق
            </button>
          </div>

          {/* Quick demo */}
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 text-sm text-gray-400 hover:text-primary-500 underline underline-offset-4 transition-colors"
          >
            عرض لوحة الإدارة
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white dark:bg-dark-bg">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">لماذا مسار؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold mb-2">{label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-primary-500 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-black">
          {[
            { v: '1,256+', l: 'راكب نشط' },
            { v: '48',     l: 'مدرسة شريكة' },
            { v: '5,842',  l: 'رحلة منجزة' },
            { v: '4.9★',   l: 'تقييم المستخدمين' },
          ].map(({ v, l }) => (
            <div key={l}>
              <p className="text-3xl font-black">{v}</p>
              <p className="text-sm font-semibold mt-1 opacity-80">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">كيف يعمل مسار؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'سجّل حسابك', desc: 'اختر دورك كراكب أو سائق وأكمل بياناتك في دقيقتين' },
              { n: '2', title: 'احجز رحلتك', desc: 'حدد نقطة الانطلاق والوجهة واختر نوع المركبة المناسبة' },
              { n: '3', title: 'تمتع بالرحلة', desc: 'سائقك في الطريق — تابعه على الخريطة وادفع بنقرة واحدة' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center text-black font-black text-2xl mb-4 shadow-lg shadow-primary-500/30">
                  {n}
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-dark-bg dark:bg-dark-card text-white text-center">
        <h2 className="text-3xl font-black mb-4">جاهز للانطلاق؟</h2>
        <p className="text-gray-400 mb-8">انضم إلى آلاف المستخدمين الذين يثقون في مسار يومياً</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/login?role=passenger')} className="btn-primary text-base py-3 px-8">
            ابدأ الآن — مجاناً
          </button>
          <button onClick={() => navigate('/login?role=driver')} className="btn-outline text-base py-3 px-8 border-gray-600 text-gray-300 hover:bg-primary-500 hover:text-black hover:border-primary-500">
            كن سائقاً معنا
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-500 text-center py-6 text-sm">
        <p>© 2024 مسار — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  )
}
