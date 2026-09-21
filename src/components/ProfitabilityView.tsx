import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, ArrowRight, DollarSign, Clock, Fuel, MapPin, ChevronRight, TrendingUp } from 'lucide-react';

export const ProfitabilityView: React.FC = () => {
  const { trips, customers, routes, vehicles, company, openTripDetail } = useApp();
  const [perspective, setPerspective] = useState<'TRIPS' | 'CUSTOMERS' | 'ROUTES' | 'FLEET'>('CUSTOMERS');
  const [expandedId, setExpandedId] = useState<string | null>('CUST-001');

  // Simulation Sliders State (Requirement 39)
  const [fuelPriceChangePct, setFuelPriceChangePct] = useState<number>(10);
  const [emptyKmChangePct, setEmptyKmChangePct] = useState<number>(15);
  const [waitingTimeAddMins, setWaitingTimeAddMins] = useState<number>(30);

  const baseRevenue = company.totalRevenueThisMonthMXN;
  const baseCost = company.totalActualCostThisMonthMXN;
  const baseMargin = company.totalActualMarginThisMonthMXN;

  const simFuelCost = Math.round((baseCost * 0.42) * (1 + fuelPriceChangePct / 100));
  const simTollCost = Math.round(baseCost * 0.18);
  const simOtherCost = Math.round((baseCost * 0.4) + (waitingTimeAddMins * 148 * 8));
  const simTotalCost = simFuelCost + simTollCost + simOtherCost;
  const simMargin = baseRevenue - simTotalCost;
  const simMarginPct = Math.round((simMargin / baseRevenue) * 1000) / 10;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans text-slate-900">
      {/* Editorial Header (Requirement 8) */}
      <div className="space-y-4 pb-6 border-b border-slate-200/60">
        <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-widest block">
          PROFITABILITY EXPLORER
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Where is your fleet making money?
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Análisis continuo de margen neto acumulado y sensibilidad financiera por perspectiva
        </p>
      </div>

      {/* TOTAL MARGIN HEADER BLOCK (Requirement 8) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            TOTAL MARGIN (ESTE MES)
          </span>
          <div className="text-4xl font-extrabold font-mono text-emerald-950 mt-1">
            $1.07M <span className="text-xl text-emerald-700 font-bold font-sans ml-2">25.0%</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Revenue Total: ${baseRevenue.toLocaleString()} MXN · Costo Total: ${baseCost.toLocaleString()} MXN
          </div>
        </div>

        {/* Perspective Switcher Buttons (Requirement 8) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {(['TRIPS', 'CUSTOMERS', 'ROUTES', 'FLEET'] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPerspective(p);
                setExpandedId(null);
              }}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                perspective === p
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* PERSPECTIVE EXPLORATION LIST (Requirement 8) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
            DESGLOSE POR IMPACTO ECONÓMICO ({perspective})
          </h2>
          <span className="text-xs text-slate-400">Ordenado por Revenue y Margen %</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100 shadow-xs">
          {perspective === 'CUSTOMERS' &&
            customers.map((c) => {
              const isExpanded = expandedId === c.id;
              return (
                <div key={c.id} className="transition-colors">
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-base">{c.name}</div>
                      <div className="text-xs text-slate-500 font-medium">
                        {c.totalTrips} viajes registrados · {c.totalWaitingHours} hrs espera acumuladas
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-sans block uppercase">Revenue</span>
                        <span className="font-bold text-slate-900 text-sm">
                          ${(c.totalRevenueMXN / 1000).toFixed(0)}K
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-sans block uppercase">Margin</span>
                        <span
                          className={`font-extrabold text-sm ${
                            c.marginPercent > 35 ? 'text-emerald-800' : 'text-amber-800'
                          }`}
                        >
                          {c.marginPercent}%
                        </span>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-90 text-slate-800' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expandable row content */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-50/80 border-t border-slate-100 text-xs space-y-3 font-sans">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                            Margen Neto Real
                          </span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            ${c.netMarginMXN.toLocaleString()} MXN
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                            Espera Promedio por Viaje
                          </span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {Math.round((c.totalWaitingHours * 60) / c.totalTrips)} min/viaje
                          </span>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                          <span className="text-[10px] text-emerald-800 font-semibold block uppercase">
                            Potential Recovery
                          </span>
                          <span className="font-mono font-bold text-emerald-900 text-sm">
                            ${c.potentialRecoveryMXN.toLocaleString()} MXN
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {perspective === 'ROUTES' &&
            routes.map((r) => (
              <div key={r.id} className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 text-base">{r.name}</div>
                  <div className="text-xs text-slate-500">
                    Distancia: {r.distanceKm} km · Retorno vacío prom: {r.avgEmptyKmPercent}%
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-sans block uppercase">Avg Revenue</span>
                    <span className="font-bold text-slate-900">${r.avgRevenueMXN.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-sans block uppercase">Avg Margin</span>
                    <span className="font-bold text-emerald-800">${r.avgMarginMXN.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

          {perspective === 'TRIPS' &&
            trips.map((t) => (
              <div
                key={t.id}
                onClick={() => openTripDetail(t.id)}
                className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Viaje #{t.tripNumber} · {t.customerName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t.originName} → {t.destinationName}
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-xs font-mono">
                  <span className="font-bold text-emerald-800">${t.economics.actualMarginMXN.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}

          {perspective === 'FLEET' &&
            vehicles.map((v) => (
              <div key={v.id} className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Unidad {v.unitNumber} - {v.brand} {v.model}
                  </div>
                  <div className="text-xs text-slate-500">
                    Cost/km: ${v.costPerKmMXN} · Revenue/km: ${v.revenuePerKmMXN}
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-xs font-mono">
                  <span className="font-bold text-emerald-800">${v.netMarginMXN.toLocaleString()}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ECONOMIC SENSITIVITY SIMULATOR (Subtle, realistic) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            SIMULADOR DE SENSIBILIDAD
          </span>
          <h2 className="text-base font-bold text-slate-900 font-sans mt-0.5">
            Simulador de Impacto Financiero Directo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Precio Diésel:</span>
              <span className="font-mono text-emerald-800 font-bold">+{fuelPriceChangePct}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              value={fuelPriceChangePct}
              onChange={(e) => setFuelPriceChangePct(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Km Vacíos:</span>
              <span className="font-mono text-emerald-800 font-bold">+{emptyKmChangePct}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              value={emptyKmChangePct}
              onChange={(e) => setEmptyKmChangePct(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Espera en Rampa:</span>
              <span className="font-mono text-emerald-800 font-bold">+{waitingTimeAddMins} min</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="15"
              value={waitingTimeAddMins}
              onChange={(e) => setWaitingTimeAddMins(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Margen Proyectado Simulado:</span>
          <span className="text-lg font-bold font-mono text-emerald-950">
            ${simMargin.toLocaleString()} MXN ({simMarginPct}%)
          </span>
        </div>
      </div>
    </div>
  );
};
