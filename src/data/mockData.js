// ── Trips ──────────────────────────────────────────────────────────────────
export const recentTrips = [
  { id: 't1', from: 'مدرسة الأمل الأهلية', to: 'حي الياسمين',  status: 'مكتمل',  time: '07:30 ص', date: '12 مايو 2024', price: 25,  driver: 'محمد علي',  rating: 5 },
  { id: 't2', from: 'مدرسة النخيل',        to: 'حي النرجس',    status: 'مكتمل',  time: '07:15 ص', date: '11 مايو 2024', price: 30,  driver: 'خالد سعد',  rating: 4 },
  { id: 't3', from: 'المركز التجاري',      to: 'مطار الرياض',  status: 'مكتمل',  time: '02:40 م', date: '10 مايو 2024', price: 65,  driver: 'عمر أحمد',  rating: 5 },
  { id: 't4', from: 'الحي الدبلوماسي',    to: 'الدائري الشمالي', status: 'ملغي', time: '09:00 ص', date: '09 مايو 2024', price: 0,   driver: '—',          rating: 0 },
  { id: 't5', from: 'مدرسة الأمل الأهلية', to: 'حي الياسمين',  status: 'مكتمل',  time: '07:30 ص', date: '08 مايو 2024', price: 25,  driver: 'محمد علي',  rating: 5 },
]

export const driverRequests = [
  { id: 'r1', passenger: 'محمد علي',  from: 'مدرسة الأمل الأهلية', to: 'حي الياسمين',  distance: '4.2 كم', time: '07:30 ص', price: 25,  children: 2, type: 'school' },
  { id: 'r2', passenger: 'سارة أحمد', from: 'مدرسة النخيل الدولية', to: 'حي اليرموك',   distance: '6.8 كم', time: '07:15 ص', price: 30,  children: 1, type: 'school' },
  { id: 'r3', passenger: 'خالد محمود', from: 'مركز المملكة',         to: 'مطار الملك خالد', distance: '28 كم',  time: '10:00 ص', price: 95,  children: 0, type: 'car' },
]

export const driverCurrentRides = [
  { id: 'c1', passenger: 'عبدالرحمن أحمد', from: 'مدرسة الأمل الأهلية', to: 'حي الياسمين', status: 'في الطريق', eta: '8 دقائق', price: 28.00, phone: '+966501234567' },
]

// ── Admin stats ────────────────────────────────────────────────────────────
export const adminStats = {
  passengers: 1256,
  schools:    48,
  trips:      5842,
  revenue:    78450,
}

export const adminTripsChart = [
  { day: '6 مايو',  trips: 32 },
  { day: '7 مايو',  trips: 28 },
  { day: '8 مايو',  trips: 38 },
  { day: '9 مايو',  trips: 45 },
  { day: '10 مايو', trips: 42 },
  { day: '11 مايو', trips: 55 },
  { day: '12 مايو', trips: 60 },
]

export const adminRecentTrips = [
  { id: 'a1', school: 'مدرسة الأمل الأهلية',    time: '07:30 ص', status: 'مكتمل',  driver: 'محمد علي',  amount: 25 },
  { id: 'a2', school: 'مدرسة النخيل الدولية',   time: '09:00 ص', status: 'مكتمل',  driver: 'خالد سعد',  amount: 30 },
  { id: 'a3', school: 'حي الياسمين',            time: '10:30 ص', status: 'جارٍ',   driver: 'عمر أحمد',  amount: 45 },
  { id: 'a4', school: 'مدرسة التقوى',           time: '12:00 م', status: 'ملغي',   driver: '—',          amount: 0  },
  { id: 'a5', school: 'حي الياسمين (مدرسة ب)', time: '01:30 م', status: 'مكتمل',  driver: 'فهد العمري', amount: 20 },
]

// ── Vehicle types ──────────────────────────────────────────────────────────
export const vehicleTypes = [
  { id: 'economy',   label: 'اقتصادي',  desc: 'سيارة مريحة', price: 'من 15 ر.س', eta: '4 دقائق',  icon: '🚗' },
  { id: 'comfort',   label: 'مميز',     desc: 'سيارة فاخرة',  price: 'من 25 ر.س', eta: '6 دقائق',  icon: '🚙' },
  { id: 'school',    label: 'مدرسي',    desc: 'حافلة مدرسية', price: 'من 20 ر.س', eta: '10 دقائق', icon: '🚌' },
  { id: 'large',     label: 'كبير',     desc: 'ميني باص',     price: 'من 40 ر.س', eta: '15 دقائق', icon: '🚐' },
]

// ── Payment methods ────────────────────────────────────────────────────────
export const paymentMethods = [
  { id: 'applepay', label: 'Apple Pay',   icon: '🍎' },
  { id: 'mada',     label: 'بطاقة مدى',  icon: '💳' },
  { id: 'cash',     label: 'نقداً',       icon: '💵' },
]

// ── Earnings chart ──────────────────────────────────────────────────────────
export const earningsChart = [
  { time: '06AM', amount: 0   },
  { time: '09AM', amount: 120 },
  { time: '12PM', amount: 85  },
  { time: '03PM', amount: 160 },
  { time: '06PM', amount: 91  },
  { time: '09PM', amount: 0   },
  { time: '12AM', amount: 0   },
]
