import { Link } from 'react-router-dom'
import { BarChart3, Car, Shield, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="text-slate-100">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 px-6 py-16 sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" /> Smart parking operations
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Park in flow. <span className="text-cyan-400">Operate in control.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            Run many parking locations from one system: each site has its own layout and inventory. Drivers pick where they are, then see
            availability and book for that place — while admins and staff operate the right deck at the right address.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: Shield,
            title: 'Role-based access',
            text: 'Admins define parking sites and lay out each location. Staff work the live map for the site they choose. Drivers search and book for the place they arrived at.',
          },
          {
            icon: Car,
            title: 'Sessions & billing',
            text: 'Check-in and check-out with automatic totals from hourly rates and stay duration.',
          },
          {
            icon: BarChart3,
            title: 'Reporting',
            text: 'Occupancy by zone, revenue trends, and operational KPIs for leadership and operations.',
          },
        ].map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 backdrop-blur transition hover:border-cyan-500/30"
          >
            <Icon className="mb-3 h-8 w-8 text-cyan-400" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-slate-400">{text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
