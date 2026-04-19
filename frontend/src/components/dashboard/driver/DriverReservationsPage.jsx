import { useEffect, useState } from 'react'
import api from '../../../api'
import { Timer, RefreshCw } from 'lucide-react'

export default function DriverReservationsPage() {
  const [mine, setMine] = useState([])
  const [error, setError] = useState('')

  const loadMine = async () => {
    setError('')
    try {
      const { data } = await api.get('/api/Reservations/mine')
      setMine(data)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load reservations.')
    }
  }

  useEffect(() => {
    void loadMine()
  }, [])

  const cancelRes = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return
    try {
      await api.delete(`/api/Reservations/${id}`)
      await loadMine()
    } catch (err) {
      setError(err.response?.data?.error || 'Cancel failed.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My reservations</h1>
          <p className="text-sm text-slate-400">View or cancel upcoming bookings.</p>
        </div>
        <button
          type="button"
          onClick={() => void loadMine()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}
      <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
        <div className="mb-4 flex items-center gap-2 text-white">
          <Timer className="h-5 w-5 text-slate-300" />
          <h2 className="font-semibold">Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="p-2">Space</th>
                <th className="p-2">Window</th>
                <th className="p-2">Status</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {mine.map((r) => (
                <tr key={r.id} className="border-t border-white/5">
                  <td className="p-2 text-white">{r.parkingSpace?.spaceNumber ?? r.parkingSpaceId}</td>
                  <td className="p-2 text-slate-400">
                    {new Date(r.startUtc).toLocaleString()} → {new Date(r.endUtc).toLocaleString()}
                  </td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2 text-right">
                    {r.status !== 'Cancelled' && r.status !== 'Completed' ? (
                      <button type="button" onClick={() => void cancelRes(r.id)} className="text-xs text-red-400 hover:underline">
                        Cancel
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {mine.length === 0 ? <p className="py-6 text-center text-slate-500">No reservations yet.</p> : null}
        </div>
      </div>
    </div>
  )
}
