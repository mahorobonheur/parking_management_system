import { useEffect, useState } from 'react'
import api from '../../../api'
import { TrendingUp } from 'lucide-react'

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState(null)
  const [revenue, setRevenue] = useState([])
  const [zones, setZones] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setError('')
      try {
        const [ov, rev, z] = await Promise.all([
          api.get('/api/reports/overview'),
          api.get('/api/reports/revenue-series?days=14'),
          api.get('/api/reports/occupancy-by-zone'),
        ])
        if (!cancelled) {
          setOverview(ov.data)
          setRevenue(rev.data)
          setZones(z.data)
        }
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.error || 'Failed to load overview.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const maxRev = Math.max(...revenue.map((r) => r.revenue), 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-slate-400">KPIs, revenue trend, and occupancy by zone.</p>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      ) : (
        <>
          {overview && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Total spaces', overview.totalSpaces],
                ['Available', overview.availableSpaces],
                ['Occupied', overview.occupiedSpaces],
                ['Est. revenue today', `$${Number(overview.estimatedRevenueToday).toFixed(2)}`],
              ].map(([label, val]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{val}</p>
                </div>
              ))}
            </div>
          )}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <div className="mb-4 flex items-center gap-2 text-slate-300">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <h2 className="font-semibold text-white">Revenue (14 days)</h2>
              </div>
              <div className="flex h-40 items-end gap-1">
                {revenue.map((p) => (
                  <div key={p.day} className="group flex flex-1 flex-col items-center">
                    <div
                      className="w-full max-w-[14px] rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400 transition group-hover:from-cyan-500 group-hover:to-cyan-300"
                      style={{ height: `${(p.revenue / maxRev) * 100}%`, minHeight: p.revenue > 0 ? 8 : 0 }}
                      title={`${p.day}: $${p.revenue}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h2 className="mb-4 font-semibold text-white">Occupancy by zone</h2>
              <ul className="space-y-3">
                {zones.map((z) => (
                  <li key={z.zone} className="flex justify-between text-sm">
                    <span className="text-slate-300">{z.zone}</span>
                    <span className="text-cyan-400">
                      {z.occupiedSpaces} / {z.totalSpaces} occupied
                    </span>
                  </li>
                ))}
                {zones.length === 0 ? <li className="text-slate-500">No data</li> : null}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
