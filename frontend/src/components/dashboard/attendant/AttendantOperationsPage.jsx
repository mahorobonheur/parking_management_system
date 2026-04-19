import { useEffect, useState } from 'react'
import api from '../../../api'
import { Activity, LogIn, LogOut, Ticket, QrCode } from 'lucide-react'

const qrImg = (payload) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload || '')}`

function apiErrorMessage(err, fallback) {
  const d = err.response?.data
  if (typeof d?.error === 'string') return d.error
  if (typeof d?.title === 'string') return d.title
  return fallback
}

export default function AttendantOperationsPage() {
  const [active, setActive] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkIn, setCheckIn] = useState({
    parkingSpaceId: '',
    licensePlate: '',
    reservationId: '',
    isVisitor: false,
    applicationUserId: '',
  })
  const [lastTicket, setLastTicket] = useState(null)
  const [ticketOut, setTicketOut] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/ParkingSessions/active')
      setActive(data)
    } catch (e) {
      setError(apiErrorMessage(e, 'Failed to load sessions.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const submitCheckIn = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/api/ParkingSessions/check-in', {
        parkingSpaceId: Number(checkIn.parkingSpaceId),
        licensePlate: checkIn.licensePlate,
        reservationId: checkIn.reservationId ? Number(checkIn.reservationId) : null,
        isVisitor: checkIn.isVisitor,
        applicationUserId: checkIn.applicationUserId?.trim() || null,
      })
      setLastTicket(data)
      setCheckIn({ parkingSpaceId: '', licensePlate: '', reservationId: '', isVisitor: false, applicationUserId: '' })
      await load()
    } catch (err) {
      setError(apiErrorMessage(err, 'Check-in failed.'))
    }
  }

  const doCheckOut = async (id) => {
    setError('')
    try {
      await api.post(`/api/ParkingSessions/${id}/check-out`)
      await load()
    } catch (err) {
      setError(apiErrorMessage(err, 'Check-out failed.'))
    }
  }

  const doCheckOutByTicket = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/ParkingSessions/check-out-by-ticket', { ticketCode: ticketOut.trim() })
      setTicketOut('')
      await load()
    } catch (err) {
      setError(apiErrorMessage(err, 'Ticket check-out failed.'))
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Entry & exit</h1>
        <p className="text-sm text-slate-400">Check-in issues a ticket and QR. Check-out by session or ticket code.</p>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
          <div className="mb-4 flex items-center gap-2 text-white">
            <LogIn className="h-5 w-5 text-emerald-400" />
            <h2 className="font-semibold">Check-in</h2>
          </div>
          <form onSubmit={submitCheckIn} className="space-y-3">
            <input
              required
              type="number"
              min={1}
              placeholder="Parking space ID (numeric id from Spaces admin)"
              value={checkIn.parkingSpaceId}
              onChange={(e) => setCheckIn({ ...checkIn, parkingSpaceId: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
            />
            <input
              required
              placeholder="License plate"
              value={checkIn.licensePlate}
              onChange={(e) => setCheckIn({ ...checkIn, licensePlate: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
            />
            <input
              type="number"
              placeholder="Reservation ID (optional)"
              value={checkIn.reservationId}
              onChange={(e) => setCheckIn({ ...checkIn, reservationId: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
            />
            <input
              placeholder="Driver user id (optional, GUID)"
              value={checkIn.applicationUserId}
              onChange={(e) => setCheckIn({ ...checkIn, applicationUserId: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-white"
            />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={checkIn.isVisitor}
                onChange={(e) => setCheckIn({ ...checkIn, isVisitor: e.target.checked })}
                className="rounded border-slate-600"
              />
              Visitor / walk-up
            </label>
            <button type="submit" className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
              Check in & issue ticket
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
            <div className="mb-3 flex items-center gap-2 text-white">
              <Ticket className="h-5 w-5 text-cyan-400" />
              <h2 className="font-semibold">Exit by ticket</h2>
            </div>
            <form onSubmit={doCheckOutByTicket} className="flex flex-col gap-2 sm:flex-row">
              <input
                placeholder="Ticket code"
                value={ticketOut}
                onChange={(e) => setTicketOut(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-white"
              />
              <button type="submit" className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500">
                Check out
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-amber-400" />
              <h2 className="font-semibold">Active sessions</h2>
            </div>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : active.length === 0 ? (
              <p className="text-slate-500">No vehicles on site.</p>
            ) : (
              <ul className="space-y-3">
                {active.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm"
                  >
                    <div>
                      <span className="font-medium text-white">#{s.parkingSpaceId}</span>{' '}
                      <span className="text-slate-400">{s.licensePlate}</span>
                      <div className="font-mono text-[10px] text-cyan-400/90">{s.ticketCode}</div>
                      <span className="text-xs text-slate-500">since {new Date(s.checkInUtc).toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void doCheckOut(s.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-600/90 px-3 py-1 text-xs font-medium text-white hover:bg-amber-500"
                    >
                      <LogOut className="h-3 w-3" /> Check out
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {lastTicket ? (
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-cyan-300">
                <QrCode className="h-5 w-5" />
                <h2 className="font-semibold text-white">Ticket issued</h2>
              </div>
              <p className="font-mono text-lg text-white">{lastTicket.ticketCode}</p>
              <p className="mt-1 text-xs text-slate-500">Show this QR at exit or enter the code manually.</p>
            </div>
            <img
              src={qrImg(lastTicket.qrPayload)}
              alt="Ticket QR"
              className="h-40 w-40 rounded-lg border border-white/10 bg-white p-1"
            />
          </div>
          <button type="button" onClick={() => setLastTicket(null)} className="mt-4 text-sm text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  )
}
