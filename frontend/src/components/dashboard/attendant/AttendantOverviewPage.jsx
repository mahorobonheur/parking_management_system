import { useEffect, useState } from 'react'
import api from '../../../api'
import { RefreshCw } from 'lucide-react'

export default function AttendantOverviewPage() {
  const [overview, setOverview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/reports/overview')
      setOverview(data)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load KPIs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations overview</h1>
          <p className="text-sm text-slate-400">Live counts for the deck you are running.</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      ) : (
        overview && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Active sessions', overview.activeSessions],
              ['Available spaces', overview.availableSpaces],
              ['Upcoming reservations', overview.reservationsUpcoming],
              ['Est. revenue today', `$${Number(overview.estimatedRevenueToday).toFixed(2)}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-white/10 bg-slate-800/50 p-4">
                <p className="text-xs text-slate-500">{k}</p>
                <p className="mt-1 text-xl font-semibold text-cyan-400">{v}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
