import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import ParkingLotScopeBar from './ParkingLotScopeBar'

function roleLabel(roles) {
  if (roles?.includes('Admin')) return 'Administrator'
  if (roles?.includes('Attendant') || roles?.includes('ParkingManager')) return 'Attendant'
  if (roles?.includes('Driver') || roles?.includes('User')) return 'Driver'
  return 'Guest'
}

function navForRoles(roles) {
  if (roles.includes('Admin')) {
    return {
      base: '/dashboard/admin',
      items: [
        { path: 'overview', label: 'Overview', hint: 'KPIs & revenue' },
        { path: 'locations', label: 'Sites', hint: 'Places you operate' },
        { path: 'map', label: 'Live map', hint: 'Occupancy' },
        { path: 'spaces', label: 'Spaces', hint: 'Inventory' },
        { path: 'users', label: 'Users', hint: 'Accounts' },
      ],
    }
  }
  if (roles.includes('Attendant') || roles.includes('ParkingManager')) {
    return {
      base: '/dashboard/attendant',
      items: [
        { path: 'overview', label: 'Overview', hint: 'KPIs' },
        { path: 'map', label: 'Live map', hint: 'Deck' },
        { path: 'operations', label: 'Entry & exit', hint: 'Tickets' },
        { path: 'reservations', label: 'Reservations', hint: 'Schedule' },
      ],
    }
  }
  return {
    base: '/dashboard/driver',
    items: [
      { path: 'overview', label: 'Overview', hint: 'My status' },
      { path: 'map', label: 'Live map', hint: 'Availability' },
      { path: 'vehicles', label: 'Vehicles', hint: 'Plates' },
      { path: 'book', label: 'Book', hint: 'Reserve' },
      { path: 'reservations', label: 'Reservations', hint: 'My bookings' },
    ],
  }
}

export default function DashboardShell() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const roles = profile?.roles ?? []
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const { base, items } = useMemo(() => navForRoles(roles), [roles])

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    [
      'block rounded-xl px-3 py-2.5 text-sm transition',
      isActive ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white',
    ].join(' ')

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-800/50 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-lg shadow-cyan-500/20">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Signed in as</p>
            <p className="font-semibold text-white">{profile?.fullName || profile?.email}</p>
            <p className="text-xs text-cyan-400/90">{roleLabel(roles)}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 lg:hidden"
            onClick={() => setMobileNavOpen((o) => !o)}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            Menu
          </button>
          <Link to="/" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
            Home
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <ParkingLotScopeBar />

      <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          className={[
            'shrink-0 rounded-2xl border border-white/10 bg-slate-900/50 p-3 lg:w-56',
            mobileNavOpen ? 'block' : 'hidden lg:block',
          ].join(' ')}
        >
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Navigate</p>
          <nav className="space-y-1" onClick={() => setMobileNavOpen(false)}>
            {items.map((item) => (
              <NavLink key={item.path} to={`${base}/${item.path}`} end={item.path === 'overview'} className={linkClass}>
                <span className="font-medium">{item.label}</span>
                <span className="mt-0.5 block text-[10px] font-normal text-slate-500">{item.hint}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900/30 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
