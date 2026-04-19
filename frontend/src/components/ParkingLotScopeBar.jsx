import { useMemo, useState } from 'react'
import { MapPinned, Search } from 'lucide-react'
import { useSelectedParkingLot } from '../context/SelectedParkingLotContext'

export default function ParkingLotScopeBar() {
  const { lots, loading, error, selectedLotId, setSelectedLotId } = useSelectedParkingLot()
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return lots
    return lots.filter(
      (l) =>
        (l.name && l.name.toLowerCase().includes(t)) ||
        (l.address && l.address.toLowerCase().includes(t)) ||
        (l.code && l.code.toLowerCase().includes(t)),
    )
  }, [lots, q])

  const selectOptions = useMemo(() => {
    if (filtered.length > 0) return filtered
    const cur = lots.find((l) => l.id === selectedLotId)
    return cur ? [cur] : []
  }, [filtered, lots, selectedLotId])

  if (loading && lots.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-500">
        Loading parking sites…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        {error}
      </div>
    )
  }

  if (lots.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-400">
        No parking sites yet. An administrator can add locations under{' '}
        <span className="text-cyan-300">Sites</span> before maps and bookings apply to a place.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-400/90">
            <MapPinned className="h-3.5 w-3.5" />
            Parking site
          </p>
          <p className="text-sm text-slate-400">
            Maps, space inventory, and availability use the site you select — choose the place you are at or managing.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-80">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, address, code…"
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600"
              aria-label="Filter parking sites"
            />
          </div>
          <select
            value={selectedLotId ?? ''}
            onChange={(e) => setSelectedLotId(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
            aria-label="Active parking site"
          >
            {selectOptions.length === 0 ? (
              <option value="">—</option>
            ) : (
              selectOptions.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                  {l.address ? ` — ${l.address}` : ''} ({l.code})
                </option>
              ))
            )}
          </select>
          {q.trim() && filtered.length === 0 ? (
            <p className="text-xs text-amber-400/90">No sites match that search — try another phrase or clear the box.</p>
          ) : null}
        </div>
      </div>
      {selectedLotId != null && lots.some((l) => l.id === selectedLotId) ? (
        <p className="mt-2 truncate text-xs text-slate-500">
          Active: <span className="text-slate-300">{lots.find((l) => l.id === selectedLotId)?.name}</span>
          {lots.find((l) => l.id === selectedLotId)?.address ? (
            <span> · {lots.find((l) => l.id === selectedLotId).address}</span>
          ) : null}
        </p>
      ) : null}
    </div>
  )
}
