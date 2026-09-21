import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowRight, Clock, MapPin, DollarSign, AlertTriangle, Truck, User, FileText } from 'lucide-react';

interface TripInspectorProps {
  tripId: string | null;
  onClose: () => void;
}

export const TripInspector: React.FC<TripInspectorProps> = ({ tripId, onClose }) => {
  const { trips, openTripDetail, addRecoveryCase, recoveryCases } = useApp();

  if (!tripId) return null;
  const trip = trips.find((t) => t.id === tripId) || trips[0];
  const econ = trip.economics;
  const existingCase = recoveryCases.find((c) => c.tripId === trip.id);

  const marginDiff = econ.actualMarginMXN - econ.expectedMarginMXN;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 transition-opacity animate-fade-in"
      />

      {/* Slide-over Inspector Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-slate-200/80 shadow-2xl z-50 flex flex-col font-sans text-slate-900 animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                TRIP INSPECTOR
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  trip.status === 'IN_TRANSIT'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : trip.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {trip.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5 font-sans tracking-tight">
              Viaje #{trip.tripNumber}
            </h2>
            <div className="text-xs text-slate-500 font-medium">
              {trip.customerName}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Route Overview */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-800 text-sm">
              <span>{trip.originName}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span>{trip.destinationName}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
              <span>Unidad {trip.vehicleUnitNumber} ({trip.driverName})</span>
              <span className={trip.delayMinutes > 0 ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                {trip.delayMinutes > 0 ? `+${trip.delayMinutes} min retraso` : 'En tiempo'}
              </span>
            </div>
          </div>

          {/* Economics Highlights */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              RESULTADO FINANCIERO
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Revenue
                </span>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  ${econ.revenueMXN.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                <span className="text-[10px] text-emerald-800 font-semibold block uppercase">
                  Actual Margin
                </span>
                <div className="text-base font-bold font-mono text-emerald-900 mt-0.5">
                  ${econ.actualMarginMXN.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  {econ.actualMarginPercent}%
                </div>
              </div>
            </div>

            {/* Expected vs Actual Cost */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Expected Cost:</span>
                <span className="font-mono font-semibold text-slate-800">
                  ${econ.totalEstimatedCostMXN.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Actual Cost:</span>
                <span className="font-mono font-bold text-slate-900">
                  ${econ.totalActualCostMXN.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Expected Margin:</span>
                <span className="font-mono font-semibold text-slate-800">
                  ${econ.expectedMarginMXN.toLocaleString()} ({econ.expectedMarginPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* WHAT CHANGED */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ¿QUÉ CAMBIÓ RESPECTO AL PLAN? (WHAT CHANGED)
            </div>
            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1 text-amber-900 text-[11px]">
              <div className="font-bold flex items-center justify-between">
                <span>Diferencia de Margen</span>
                <span className={marginDiff < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                  {marginDiff < 0 ? '' : '+'}
                  ${marginDiff.toLocaleString()} MXN
                </span>
              </div>
              <div className="text-slate-600 pt-1">
                • +{trip.waitingMinutes} min de espera en descarga ({trip.excessWaitingMinutes} min exceso)
              </div>
              <div className="text-slate-600">
                • +${econ.costVarianceMXN} costo operativo en combustible / casetas
              </div>
            </div>
          </div>

          {/* MONEY RECOVERY IN INSPECTOR */}
          {trip.potentialDetentionMXN > 0 && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-emerald-900 font-bold">
                <span>Dinero Recuperable Detectado</span>
                <span className="font-mono">${trip.potentialDetentionMXN.toLocaleString()} MXN</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Estadía en descarga excede tiempo libre del cliente por {trip.excessWaitingMinutes} min.
              </p>
              {!existingCase && (
                <button
                  onClick={() => {
                    addRecoveryCase({
                      tripId: trip.id,
                      tripNumber: trip.tripNumber,
                      customerId: trip.customerId,
                      customerName: trip.customerName,
                      reason: 'Detention',
                      amountMXN: trip.potentialDetentionMXN,
                      evidenceDescription: `Estadía excesiva en rampa (${trip.waitingMinutes} min)`
                    });
                  }}
                  className="w-full mt-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                >
                  Crear Caso de Recovery
                </button>
              )}
            </div>
          )}

          {/* TIMELINE SNIPPET */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              LÍNEA DE TIEMPO RECIENTE
            </div>
            <div className="space-y-2">
              {trip.events.slice(0, 3).map((evt) => (
                <div key={evt.id} className="flex items-start space-x-2 text-[11px] text-slate-600">
                  <span className="font-mono text-slate-400 text-[10px] w-24 shrink-0">{evt.timestamp}</span>
                  <span className="font-medium text-slate-800 truncate">{evt.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Full View Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Inspección rápida</span>
          <button
            onClick={() => {
              onClose();
              openTripDetail(trip.id);
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Ver Viaje Completo →
          </button>
        </div>
      </div>
    </>
  );
};
