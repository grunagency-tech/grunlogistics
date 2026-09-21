import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, DollarSign, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, setCurrentView } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Rentabilidad por Cliente (Customer Profitability)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identifica clientes que generan alto revenue pero bajo margen real debido a estadías o demoras
          </p>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customers.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">{c.name}</h3>
                <div className="text-xs text-slate-500">
                  RFC: {c.taxId} · Contacto: {c.contactName}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-bold ${
                  c.status === 'PROFITABLE'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : c.status === 'LOW_MARGIN'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {c.marginPercent}% Margen ({c.status})
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Revenue Total
                </span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  ${c.totalRevenueMXN.toLocaleString()} MXN
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Costo Total
                </span>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  ${c.totalCostMXN.toLocaleString()} MXN
                </div>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-[10px] text-emerald-800 font-semibold block uppercase">
                  Margen Neto
                </span>
                <div className="text-sm font-bold font-mono text-emerald-900 mt-0.5">
                  ${c.netMarginMXN.toLocaleString()} MXN
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between">
                <span>Horas de Espera Acumuladas en Descarga:</span>
                <strong className="font-mono text-slate-900">{c.totalWaitingHours} hrs</strong>
              </div>
              <div className="flex justify-between">
                <span>Tiempo Libre Permitido por Contrato:</span>
                <strong className="font-mono text-slate-900">{c.allowedWaitingMinutes} min</strong>
              </div>
              <div className="flex justify-between">
                <span>Tarifa Cobrable de Estadía:</span>
                <strong className="font-mono text-slate-900">
                  ${c.detentionRatePerHourMXN} MXN/hora
                </strong>
              </div>
            </div>

            {c.potentialRecoveryMXN > 0 && (
              <div className="p-3 bg-emerald-100/60 rounded-lg border border-emerald-300 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block">
                    Recuperación Potencial Identificada
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    Estadías no facturadas detectadas en viajes
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-emerald-900">
                    ${c.potentialRecoveryMXN.toLocaleString()} MXN
                  </div>
                  <button
                    onClick={() => setCurrentView('MONEY_RECOVERY')}
                    className="text-[10px] font-bold text-emerald-800 underline mt-0.5"
                  >
                    Ver Casos de Recovery
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
