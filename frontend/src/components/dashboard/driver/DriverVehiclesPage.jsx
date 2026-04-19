import { useEffect, useState } from 'react'
import api from '../../../api'
import { CarFront, Trash2 } from 'lucide-react'

export default function DriverVehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [newPlate, setNewPlate] = useState({ plate: '', label: '' })
  const [error, setError] = useState('')

  const loadVehicles = async () => {
    try {
      const { data } = await api.get('/api/Vehicles')
      setVehicles(data)
    } catch {
      setVehicles([])
    }
  }

  useEffect(() => {
    void loadVehicles()
  }, [])

  const addVehicle = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/Vehicles', { plateNumber: newPlate.plate, label: newPlate.label || null })
      setNewPlate({ plate: '', label: '' })
      await loadVehicles()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add vehicle.')
    }
  }

  const removeVehicle = async (id) => {
    if (!window.confirm('Remove this vehicle?')) return
    try {
      await api.delete(`/api/Vehicles/${id}`)
      await loadVehicles()
    } catch (err) {
      setError(err.response?.data?.error || 'Remove failed.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My vehicles</h1>
        <p className="text-sm text-slate-400">Save plate numbers you park with.</p>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}
      <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
        <div className="mb-4 flex items-center gap-2 text-white">
          <CarFront className="h-5 w-5 text-cyan-400" />
          <h2 className="font-semibold">Registered plates</h2>
        </div>
        <form onSubmit={addVehicle} className="mb-4 flex flex-wrap gap-2">
          <input
            required
            placeholder="Plate"
            value={newPlate.plate}
            onChange={(e) => setNewPlate({ ...newPlate, plate: e.target.value })}
            className="min-w-[8rem] flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          />
          <input
            placeholder="Label (optional)"
            value={newPlate.label}
            onChange={(e) => setNewPlate({ ...newPlate, label: e.target.value })}
            className="min-w-[8rem] flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          />
          <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500">
            Add
          </button>
        </form>
        <ul className="flex flex-wrap gap-2">
          {vehicles.map((v) => (
            <li
              key={v.id}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-sm text-white"
            >
              <span className="font-mono">{v.plateNumber}</span>
              {v.label ? <span className="text-xs text-slate-400">{v.label}</span> : null}
              <button type="button" onClick={() => void removeVehicle(v.id)} className="text-slate-500 hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        {vehicles.length === 0 ? <p className="text-sm text-slate-500">No saved plates yet.</p> : null}
      </div>
    </div>
  )
}
