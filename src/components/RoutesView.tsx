import React from 'react';
import { useApp } from '../context/AppContext';
import { Navigation, MapPin, DollarSign, Clock, Truck } from 'lucide-react';

export const RoutesView: React.FC = () => {
  const { routes } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Rentabilidad por Ruta & Carril (Route Profitability)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Análisis de margen promedio, porcentaje de kilómetros vacíos y tiempos de espera por corredor
          </p>
        </div>
      </div>

      {/* Routes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">{r.name}</h3>
                <div className="text-xs text-slate-500">
                  Distancia: {r.distanceKm} km · Duración Prom: {r.avgDurationMinutes} min
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-bold ${
                  r.status === 'PROFITABLE'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {r.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Revenue Promedio
                </span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  ${r.avgRevenueMXN.toLocaleString()} MXN
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Costo Promedio
                </span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  ${r.avgCostMXN.toLocaleString()} MXN
                </div>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-[10px] text-emerald-800 font-semibold block uppercase">
                  Margen Promedio
                </span>
                <div className="text-sm font-bold font-mono text-emerald-900 mt-0.5">
                  ${r.avgMarginMXN.toLocaleString()} MXN
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                <span className="text-[10px] font-bold uppercase block text-amber-800">
                  % Kilómetros Vacíos
                </span>
                <div className="text-base font-bold font-mono mt-0.5">{r.avgEmptyKmPercent}%</div>
                <div className="text-[10px] text-amber-700 mt-0.5">
                  {r.avgEmptyKmPercent > 30 ? 'Alto riesgo de retorno vacío' : 'Porcentaje controlado'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800">
                <span className="text-[10px] font-bold uppercase block text-slate-500">
                  Espera Promedio
                </span>
                <div className="text-base font-bold font-mono mt-0.5">{r.avgWaitingMinutes} min</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {r.totalTripsCount} viajes registrados
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
