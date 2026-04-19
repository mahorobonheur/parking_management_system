import { useEffect, useState } from 'react'
import api from '../../../api'

export default function DriverOverviewPage() {
  const [activity, setActivity] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get('/api/reports/my-activity')
        if (!cancelled) setActivity(data)
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.error || 'Could not load your summary.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My overview</h1>
        <p className="text-sm text-slate-400">Reservations, on-site status, and last parked bay.</p>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}
      {activity && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-4">
            <p className="text-xs text-slate-500">Your reservations</p>
            <p className="text-2xl font-semibold text-cyan-400">{activity.reservationsTotal}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-4">
            <p className="text-xs text-slate-500">Active bookings</p>
            <p className="text-2xl font-semibold text-white">{activity.activeReservations}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-4">
            <p className="text-xs text-slate-500">On site now</p>
            <p className="text-2xl font-semibold text-amber-400">{activity.hasActiveSession ? 'Yes' : 'No'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-4">
            <p className="text-xs text-slate-500">Find my car (last visit)</p>
            <p className="text-lg font-semibold text-emerald-300">{activity.lastParkedSpaceNumber ?? '—'}</p>
            {activity.lastCheckOutUtc ? (
              <p className="text-[10px] text-slate-500">Exited {new Date(activity.lastCheckOutUtc).toLocaleString()}</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
