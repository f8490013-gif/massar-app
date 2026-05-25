import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'

import Landing          from './pages/Landing'
import Login            from './pages/auth/Login'
import Register         from './pages/auth/Register'

import PassengerDash    from './pages/passenger/Dashboard'
import RequestRide      from './pages/passenger/RequestRide'
import TrackRide        from './pages/passenger/TrackRide'
import SchoolTransport  from './pages/passenger/SchoolTransport'
import Payment          from './pages/passenger/Payment'

import DriverDash       from './pages/driver/Dashboard'
import Earnings         from './pages/driver/Earnings'
import DriverProfile    from './pages/driver/Profile'

import AdminDash        from './pages/admin/Dashboard'

function Require({ children, role }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />
  return children
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Passenger */}
        <Route path="/passenger"         element={<Require role="passenger"><PassengerDash /></Require>} />
        <Route path="/passenger/request" element={<Require role="passenger"><RequestRide /></Require>} />
        <Route path="/passenger/track"   element={<Require role="passenger"><TrackRide /></Require>} />
        <Route path="/passenger/school"  element={<Require role="passenger"><SchoolTransport /></Require>} />
        <Route path="/passenger/payment" element={<Require role="passenger"><Payment /></Require>} />

        {/* Driver */}
        <Route path="/driver"          element={<Require role="driver"><DriverDash /></Require>} />
        <Route path="/driver/rides"    element={<Require role="driver"><DriverDash /></Require>} />
        <Route path="/driver/earnings" element={<Require role="driver"><Earnings /></Require>} />
        <Route path="/driver/profile"  element={<Require role="driver"><DriverProfile /></Require>} />

        {/* Admin */}
        <Route path="/admin"   element={<Require role="admin"><AdminDash /></Require>} />
        <Route path="/admin/*" element={<Require role="admin"><AdminDash /></Require>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
