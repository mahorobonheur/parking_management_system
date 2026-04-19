import ParkingMap from '../../ParkingMap'
import { useSelectedParkingLot } from '../../../context/SelectedParkingLotContext'

export default function AttendantLiveMapPage() {
  const { selectedLotId, selectedLot } = useSelectedParkingLot()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Live map</h1>
        <p className="text-sm text-slate-400">
          Bays at <span className="text-slate-200">{selectedLot?.name ?? 'the selected site'}</span> — change site in the bar above if you
          operate more than one location.
        </p>
      </div>
      <ParkingMap title="Deck overview" parkingLotId={selectedLotId ?? undefined} pollMs={10000} />
    </div>
  )
}
