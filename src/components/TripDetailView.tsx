import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  DollarSign,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Truck,
  User,
  ArrowDown
} from 'lucide-react';

export const TripDetailView: React.FC = () => {
  const {
    activeSelectedTrip: trip,
    setCurrentView,
    addRecoveryCase,
    recoveryCases
  } = useApp();

  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [recoveryAmount, setRecoveryAmount] = useState<number>(trip.potentialDetentionMXN || 1500);

  const econ = trip.economics;
  const existingCase = recoveryCases.find((c) => c.tripId === trip.id);
  const marginDiff = econ.actualMarginMXN - econ.expectedMarginMXN;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans text-slate-900">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('TRIPS')}
          className="flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a lista de viajes</span>
        </button>

        <span
          className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
            trip.status === 'IN_TRANSIT'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {trip.status}
        </span>
      </div>

      {/* Narrative Trip Header (Requirement 7) */}
      <div className="space-y-4 pb-6 border-b border-slate-200/60">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-widest block">
              VIAJE #{trip.tripNumber} · {trip.customerName}
            </span>
            <div className="mt-2 flex items-baseline space-x-3 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              <span>{trip.originName}</span>
              <span className="text-slate-400 font-normal">↓</span>
              <span>{trip.destinationName}</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-sm font-semibold font-mono ${
                trip.delayMinutes > 0 ? 'text-rose-600' : 'text-slate-600'
              }`}
            >
              {trip.delayMinutes > 0 ? `${trip.delayMinutes} min behind schedule` : 'On schedule'}
            </span>
            <div className="text-xs text-slate-400 mt-0.5">
              Cita: {trip.deliveryAppointment} · Unidad {trip.vehicleUnitNumber} ({trip.driverName})
            </div>
          </div>
        </div>
      </div>

      {/* NARRATIVE FINANCIAL RESULT BLOCK (Requirement 7) */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
          FINANCIAL RESULT
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Revenue</span>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
              ${econ.revenueMXN.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Actual Cost</span>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
              ${econ.totalActualCostMXN.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
            <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Actual Margin</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-950 mt-1">
              ${econ.actualMarginMXN.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
            <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Margin %</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-950 mt-1">
              {econ.actualMarginPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* WHY DID MARGIN CHANGE? (Requirement 7) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              WHY DID MARGIN CHANGE? (Causas del cambio de margen)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Esperado: ${econ.expectedMarginMXN.toLocaleString()} → Real: ${econ.actualMarginMXN.toLocaleString()}
            </p>
          </div>
          <span
            className={`text-sm font-bold font-mono px-3 py-1 rounded-lg border ${
              marginDiff < 0
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            Difference: {marginDiff < 0 ? '' : '+'}${marginDiff.toLocaleString()} MXN
          </span>
        </div>

        {/* Visual Cause Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Waiting / Estadía en Rampa
            </span>
            <div className="text-lg font-bold font-mono text-amber-800">+$180 MXN</div>
            <p className="text-[11px] text-slate-500">
              104 min de espera excedente sobre tiempo libre configurado.
            </p>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Fuel / Diésel
            </span>
            <div className="text-lg font-bold font-mono text-rose-700">+$120 MXN</div>
            <p className="text-[11px] text-slate-500">
              Rendimiento 2.35 km/L vs 2.80 baseline en tramo de tráfico.
            </p>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Other / Casetas & Viáticos
            </span>
            <div className="text-lg font-bold font-mono text-slate-800">+$40 MXN</div>
            <p className="text-[11px] text-slate-500">
              Desvío ligero de ruta (+18 km en libramiento de cuota).
            </p>
          </div>
        </div>
      </div>

      {/* RECOVERY & DISTANCE BLOCK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Money Recovery */}
        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
              POTENTIAL MONEY RECOVERY
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              {trip.detentionBillableStatus}
            </span>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-emerald-950 font-mono">
              ${trip.potentialDetentionMXN.toLocaleString()} MXN
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Estadía en rampa ({trip.waitingMinutes} min total) excede los {trip.allowedWaitingMinutes} min libres.
            </p>
          </div>

          {existingCase ? (
            <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-emerald-900 flex justify-between">
                <span>Caso Registrado: {existingCase.caseCode}</span>
                <span className="uppercase text-[10px] bg-emerald-800 text-white px-1.5 py-0.5 rounded">
                  {existingCase.status}
                </span>
              </div>
              <div className="text-slate-600">{existingCase.evidenceDescription}</div>
            </div>
          ) : (
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
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Crear Caso de Recovery (${trip.potentialDetentionMXN} MXN)
            </button>
          )}
        </div>

        {/* Distance & Route Map Complement (Requirement 11: Map complements, does not dominate) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              DISTANCIA & RUTA
            </span>
            <button
              onClick={() => setShowMapModal(true)}
              className="text-xs text-emerald-800 hover:underline font-semibold"
            >
              Ver mapa completo →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Cargados</span>
              <span className="font-bold font-mono text-slate-900">{trip.loadedKm} km</span>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70">
              <span className="text-[10px] text-amber-800 block uppercase font-semibold">Vacíos</span>
              <span className="font-bold font-mono text-amber-900">{trip.emptyKm} km ({trip.emptyKmPercent}%)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total</span>
              <span className="font-bold font-mono text-slate-900">{trip.actualDistanceKm} km</span>
            </div>
          </div>

          {/* Minimal Inline Route Polyline Map */}
          <div
            onClick={() => setShowMapModal(true)}
            className="w-full h-24 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-between px-6 text-white cursor-pointer group"
          >
            <div className="text-xs">
              <div className="font-semibold">{trip.originName}</div>
              <div className="text-[10px] text-slate-400">Salida 06:15</div>
            </div>
            <div className="flex-1 px-4 text-center">
              <div className="w-full h-0.5 bg-emerald-500/60 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute left-1/2 -top-1 border border-slate-900" />
              </div>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Ruta 57D (Actual km 920)</span>
            </div>
            <div className="text-xs text-right">
              <div className="font-semibold">{trip.destinationName}</div>
              <div className="text-[10px] text-slate-400">ETA 18:47</div>
            </div>
          </div>
        </div>
      </div>

      {/* CLEAN NARRATIVE TIMELINE (Requirement 7: No unnecessary tables) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 font-sans">
            LÍNEA DE TIEMPO OPERATIVA (TIMELINE)
          </h2>
          <button
            onClick={() => setShowPodModal(true)}
            className="text-xs text-emerald-800 font-semibold hover:underline flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ver POD / Evidencias en Foto</span>
          </button>
        </div>

        <div className="space-y-4">
          {trip.events.map((evt) => (
            <div key={evt.id} className="flex items-start space-x-4 text-xs font-sans">
              <span className="font-mono text-slate-400 font-semibold text-xs w-28 shrink-0">
                {evt.timestamp}
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
              <div className="flex-1 bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-0.5">
                <div className="font-bold text-slate-900">{evt.category} — {evt.description}</div>
                <div className="text-[10px] text-slate-400">
                  Ubicación: {evt.locationName} · Creado por: {evt.createdBy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Modal when clicked */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Mapa de Ruta en Tiempo Real</h3>
              <button onClick={() => setShowMapModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div className="w-full h-80 bg-slate-900 rounded-xl relative flex items-center justify-center text-white">
              <div className="text-center space-y-2">
                <MapPin className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold">{trip.originName} → {trip.destinationName}</div>
                <div className="text-xs text-slate-400 font-mono">Posición GPS actual: {trip.currentLocationName}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setShowMapModal(false)} className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* POD Modal */}
      {showPodModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Evidencia Fotográfica / POD Firmado</h3>
              <button onClick={() => setShowPodModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <img
              src={trip.podUrl || 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80'}
              alt="POD Document"
              className="w-full h-80 object-cover rounded-xl border border-slate-200"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowPodModal(false)} className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
