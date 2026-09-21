import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExceptionItem } from '../types';
import {
  AlertTriangle,
  Clock,
  Fuel,
  DollarSign,
  FileText,
  MapPin,
  CheckCircle2,
  Filter,
  ShieldAlert
} from 'lucide-react';

export const ExceptionsView: React.FC = () => {
  const { exceptions, openTripDetail, setCurrentView } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredExceptions = exceptions.filter(
    (e) => filterType === 'ALL' || e.type === filterType
  );

  const totalImpact = exceptions.reduce((acc, e) => acc + e.financialImpactMXN, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Excepciones Operativas & Financieras (Exceptions Dashboard)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Detección de desviaciones reales que impactan el margen o la rentabilidad de la flota
          </p>
        </div>

        <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 text-rose-900 flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-800 block">
              EXPOSICIÓN TOTAL EN RIESGO
            </span>
            <span className="text-lg font-bold font-mono font-sans">
              ${totalImpact.toLocaleString()} MXN
            </span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">Filtrar por Tipo de Excepción:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="ALL">Todas las excepciones ({exceptions.length})</option>
            <option value="DELIVERY_RISK">Delivery Delay / Risk</option>
            <option value="EXCESSIVE_WAITING">Excessive Waiting</option>
            <option value="UNEXPECTED_FUEL">Unexpected Fuel</option>
            <option value="UNPROFITABLE_TRIP">Unprofitable Trip</option>
            <option value="UNBILLED_DETENTION">Unbilled Detention</option>
            <option value="ROUTE_DEVIATION">Route Deviation</option>
            <option value="MISSING_POD">Missing POD</option>
          </select>
        </div>

        <span className="text-slate-500 font-mono">
          Mostrando {filteredExceptions.length} items
        </span>
      </div>

      {/* Exceptions Grid */}
      <div className="space-y-3">
        {filteredExceptions.map((exc) => {
          return (
            <div
              key={exc.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-3 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{exc.title}</h3>
                    <div className="text-xs text-slate-500">
                      {exc.customerName ? `Cliente: ${exc.customerName} · ` : ''}
                      {exc.vehicleUnit ? `Unidad ${exc.vehicleUnit} · ` : ''}
                      Registrado: {exc.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                    ${exc.financialImpactMXN.toLocaleString()} MXN exposición
                  </span>
                  {exc.tripId && (
                    <button
                      onClick={() => openTripDetail(exc.tripId!)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors shadow-xs"
                    >
                      Revisar Viaje
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600">{exc.description}</p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900">Acción Recomendada: </strong>
                  <span>{exc.actionRecommended}</span>
                </div>
                {exc.type === 'EXCESSIVE_WAITING' && (
                  <button
                    onClick={() => setCurrentView('MONEY_RECOVERY')}
                    className="px-2.5 py-1 bg-emerald-700 text-white font-bold rounded text-[11px] shrink-0 ml-2"
                  >
                    Crear Recovery Case
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
