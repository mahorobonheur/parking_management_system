import { useState } from 'react'
import api from '../../../api'
import { Plus, Edit2, Building2 } from 'lucide-react'
import { useSelectedParkingLot } from '../../../context/SelectedParkingLotContext'

const emptyForm = { name: '', address: '', code: '' }

export default function AdminLocationsPage() {
  const { lots, loading, error: ctxError, reloadLots, setSelectedLotId, selectedLotId } = useSelectedParkingLot()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (lot) => {
    setEditingId(lot.id)
    setForm({ name: lot.name, address: lot.address ?? '', code: lot.code ?? '' })
    setError('')
    setModalOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await api.put(`/api/ParkingLots/${editingId}`, {
          name: form.name.trim(),
          address: form.address.trim() || null,
          code: form.code.trim() || null,
        })
      } else {
        const { data } = await api.post('/api/ParkingLots', {
          name: form.name.trim(),
          address: form.address.trim() || null,
          code: form.code.trim() || null,
        })
        if (data?.id) setSelectedLotId(data.id)
      }
      await reloadLots()
      setModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Parking sites</h1>
          <p className="text-sm text-slate-400">
            Each site is a real-world location. Managers lay out spaces and map coordinates per site; drivers pick the site where they
            are parking before viewing the map or booking.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          <Plus className="h-4 w-4" /> Add site
        </button>
      </div>
      {ctxError ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{ctxError}</div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}
      {loading && lots.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-800/40">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="p-3">Name</th>
                <th className="p-3">Code</th>
                <th className="p-3">Address</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lots.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    <Building2 className="mx-auto mb-2 h-10 w-10 opacity-40" /> No sites yet — add one to represent a parking location.
                  </td>
                </tr>
              ) : (
                lots.map((l) => (
                  <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-3 font-medium text-white">
                      {l.name}
                      {l.id === selectedLotId ? (
                        <span className="ml-2 rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                          Active in toolbar
                        </span>
                      ) : null}
                    </td>
                    <td className="p-3 font-mono text-xs text-slate-400">{l.code}</td>
                    <td className="p-3 text-slate-400">{l.address || '—'}</td>
                    <td className="p-3 text-right">
                      <button type="button" onClick={() => openEdit(l)} className="rounded-lg p-2 hover:bg-white/10">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-y-contain bg-black/70 p-4 py-6 backdrop-blur-sm sm:py-10"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <form
            onSubmit={(e) => void save(e)}
            className="relative mx-auto mt-2 w-full max-w-md space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-6 pb-8 shadow-2xl sm:mt-8 sm:mb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-white">{editingId ? 'Edit site' : 'New parking site'}</h2>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Display name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="e.g. Riverside Mall – Deck B"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Street / area (helps drivers search)</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="City, neighborhood, or full address"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Site code (optional — unique, A–Z 0–9 _ -)</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm text-white"
                placeholder={editingId ? 'Leave blank to keep current code' : 'Auto-generated if empty'}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-lg bg-slate-800 py-2 text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
