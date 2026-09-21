import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TripInspector } from './TripInspector';
import {
  ArrowRight,
  AlertTriangle,
  Clock,
  DollarSign,
  Truck,
  ChevronRight,
  ShieldAlert,
  Fuel,
  MapPin
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    company,
    trips,
    exceptions,
    recoveryCases,
    openTripDetail,
    setCurrentView
  } = useApp();

  const [inspectingTripId, setInspectingTripId] = useState<string | null>(null);

  const activeTripsCount = company.activeTripsCount;
  const pendingExceptions = exceptions.filter((e) => e.status === 'PENDING');
  const potentialRecoverySum = recoveryCases.reduce((acc, c) => acc + c.amountMXN, 0);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto font-sans text-slate-900">
      {/* Editorial Header Composition (Requirement 2 & 5) */}
      <div className="space-y-3 pb-6 border-b border-slate-200/60">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
          Buenos días.
        </h1>
        <p className="text-base font-medium text-slate-600">
          Aquí está lo importante de tu operación hoy.
        </p>

        {/* Minimal Clean Text Summary (Requirement 5: NO 4 KPI Cards) */}
        <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm text-slate-600 font-medium">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>
              <strong className="text-slate-900 font-bold font-mono text-base">{activeTripsCount}</strong>{' '}
              viajes activos
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <div>
            <strong className="text-emerald-800 font-bold font-mono text-base">$1.07M</strong>{' '}
            margen generado este mes
          </div>
          <span className="text-slate-300">•</span>
          <div className="text-amber-800 font-semibold">
            <strong className="font-mono text-base">{pendingExceptions.length}</strong> excepciones requieren atención
          </div>
        </div>
      </div>

      {/* SECTION: "LO QUE REQUIERE TU ATENCIÓN" (ATTENTION SECTION - Requirement 2 & 5) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
            LO QUE REQUIERE TU ATENCIÓN
          </h2>
          <button
            onClick={() => setCurrentView('EXCEPTIONS')}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center space-x-1"
          >
            <span>Ver todas las excepciones ({exceptions.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Attention Blocks (Not generic cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Situation 1: Trip #5831 Late Delivery */}
          <div
            onClick={() => setInspectingTripId('TRIP-5831')}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer space-y-4 group hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded font-mono">
                TRIP #5831
              </span>
              <span className="text-xs font-bold text-slate-500">47 min retraso</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Entrega en riesgo por retraso
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Monterrey → CEDIS Vallejo
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Exposición estimada
                </span>
                <span className="text-lg font-bold font-mono text-rose-700">$4,850 MXN</span>
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800 flex items-center space-x-1">
                <span>Inspeccionar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Situation 2: CEDIS Norte Excess Waiting */}
          <div
            onClick={() => setInspectingTripId('TRIP-5831')}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer space-y-4 group hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-mono">
                CEDIS NORTE
              </span>
              <span className="text-xs font-bold text-amber-700">104 min exceso</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Estadía excesiva en rampa
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Tractor 184 · TechLogistics Corp
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Recuperación potencial
                </span>
                <span className="text-lg font-bold font-mono text-emerald-800">$1,500 MXN</span>
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800 flex items-center space-x-1">
                <span>Revisar caso</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Situation 3: Vehicle 184 Fuel Consumption */}
          <div
            onClick={() => setCurrentView('FLEET')}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer space-y-4 group hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded font-mono">
                VEHICLE 184
              </span>
              <span className="text-xs font-bold text-rose-600">-16% rendimiento</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Diésel bajo línea base esperada
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Rendimiento 2.35 km/L vs 2.80 baseline
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Costo exedente est.
                </span>
                <span className="text-lg font-bold font-mono text-slate-900">$840 MXN</span>
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800 flex items-center space-x-1">
                <span>Ver unidad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* OPERATIONAL ACTIVITY LIST (Progressive list without noisy excel grids) */}
      <div className="space-y-4 pt-4 border-t border-slate-200/60">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
            ACTIVIDAD OPERATIVA DE HOY
          </h2>
          <button
            onClick={() => setCurrentView('TRIPS')}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium"
          >
            Ver todos los viajes ({trips.length})
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
          {trips.map((t) => {
            const econ = t.economics;
            const isNegative = econ.marginVarianceMXN < 0;

            return (
              <div
                key={t.id}
                onClick={() => setInspectingTripId(t.id)}
                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center font-mono group-hover:bg-emerald-50 group-hover:text-emerald-900 transition-colors">
                    #{t.tripNumber}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.customerName}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {t.originName} → {t.destinationName} · Unidad {t.vehicleUnitNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block uppercase">Expected</span>
                    <span className="font-semibold text-slate-700">${econ.expectedMarginMXN.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block uppercase">Actual Margin</span>
                    <span className="font-bold text-slate-900">${econ.actualMarginMXN.toLocaleString()} ({econ.actualMarginPercent}%)</span>
                  </div>

                  {t.potentialDetentionMXN > 0 && (
                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] text-emerald-800 font-sans block uppercase font-bold">Recovery</span>
                      <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        +${t.potentialDetentionMXN.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-over Trip Inspector (Context preservation - Requirement 6) */}
      <TripInspector tripId={inspectingTripId} onClose={() => setInspectingTripId(null)} />
    </div>
  );
};
