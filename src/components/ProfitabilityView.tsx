import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Sliders,
  DollarSign,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  MapPin,
  Clock,
  Fuel
} from 'lucide-react';

export const ProfitabilityView: React.FC = () => {
  const { trips, customers, routes, vehicles, company, openTripDetail } = useApp();

  // Simulation Sliders State (Requirement 39)
  const [fuelPriceChangePct, setFuelPriceChangePct] = useState<number>(10);
  const [emptyKmChangePct, setEmptyKmChangePct] = useState<number>(15);
  const [waitingTimeAddMins, setWaitingTimeAddMins] = useState<number>(30);
  const [revenueChangePct, setRevenueChangePct] = useState<number>(-5);
  const [tollChangePct, setTollChangePct] = useState<number>(10);

  // Baseline Monthly Totals
  const baseRevenue = company.totalRevenueThisMonthMXN;
  const baseCost = company.totalActualCostThisMonthMXN;
  const baseMargin = company.totalActualMarginThisMonthMXN;

  // Simulation calculations
  const simRevenue = Math.round(baseRevenue * (1 + revenueChangePct / 100));

  // Cost adjustments
  const baseFuelCost = Math.round(baseCost * 0.42); // ~42% fuel
  const baseTollCost = Math.round(baseCost * 0.18); // ~18% tolls
  const baseOtherCost = baseCost - baseFuelCost - baseTollCost;

  const simFuelCost = Math.round(
    baseFuelCost * (1 + fuelPriceChangePct / 100) * (1 + emptyKmChangePct / 200)
  );
  const simTollCost = Math.round(baseTollCost * (1 + tollChangePct / 100));
  const simOtherCost = Math.round(baseOtherCost + (waitingTimeAddMins * 148 * 8)); // 148 trips * waiting cost
  const simTotalCost = simFuelCost + simTollCost + simOtherCost;

  const simMargin = simRevenue - simTotalCost;
  const simMarginPct = Math.round((simMargin / simRevenue) * 1000) / 10;
  const simMarginDelta = simMargin - baseMargin;

  // Empty KM total cost estimation
  const totalEmptyKmCost = trips.reduce((acc, t) => acc + t.emptyKmCostMXN, 0);
  const totalDetentionPotential = trips.reduce((acc, t) => acc + t.potentialDetentionMXN, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Profitability Analytics & Economic Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Análisis financiero profundo por viaje, cliente, ruta y simulación de escenarios de costo
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs text-emerald-900 font-semibold">
          <span>Margen Flota Actual:</span>
          <span className="font-mono font-bold text-sm">43.0%</span>
        </div>
      </div>

      {/* ANSWERING CORE QUESTIONS (Requirement 41) */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            EXPLICACIÓN DE PÉRDIDAS & FUGAS DE MARGEN
          </span>
          <h2 className="text-base font-bold text-slate-900 font-sans">
            ¿Dónde estamos perdiendo dinero? (Where are we losing money?)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Fuga 1: Kilómetros Vacíos */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold uppercase text-[10px]">Kilómetros Vacíos</span>
              <Truck className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              ${totalEmptyKmCost.toLocaleString()} MXN
            </div>
            <p className="text-[11px] text-slate-600">
              Costo directo generado por retornos sin carga asignada en viajes de la flota.
            </p>
          </div>

          {/* Fuga 2: Tiempos de Espera / Estadías */}
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-amber-800">
              <span className="font-semibold uppercase text-[10px]">Espera No Cobrada</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-900">
              ${totalDetentionPotential.toLocaleString()} MXN
            </div>
            <p className="text-[11px] text-amber-800">
              Estadías en rampas que excedieron el tiempo libre sin cobrar a cliente.
            </p>
          </div>

          {/* Fuga 3: Variación de Diésel */}
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between text-rose-800">
              <span className="font-semibold uppercase text-[10px]">Variación de Diésel</span>
              <Fuel className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-bold font-mono text-rose-900">$840 MXN/viaje</div>
            <p className="text-[11px] text-rose-800">
              Desviación del rendimiento real contra la línea base de consumo esperado.
            </p>
          </div>

          {/* Fuga 4: Rutas de Bajo Margen */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold uppercase text-[10px]">Rutas con Bajo Margen</span>
              <MapPin className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">Puebla → Veracruz</div>
            <p className="text-[11px] text-slate-600">
              Margen promedio de solo 17.2% debido a 42% de retorno vacío.
            </p>
          </div>
        </div>
      </div>

      {/* ECONOMIC SIMULATOR MODULE (Requirement 39) */}
      <div className="bg-white rounded-xl border border-emerald-200/80 p-6 space-y-5 shadow-xs bg-gradient-to-br from-white to-emerald-50/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                SIMULADOR FINANCIERO
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                SIMULATED / PREDICTED
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-sans mt-0.5">
              Simulador de Sensibilidad de Margen (Economic Sensitivity)
            </h2>
          </div>
          <div className="text-xs text-slate-500">
            Modifica las variables para simular impacto en la utilidad mensual
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
          {/* Slider 1: Fuel Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Precio Diésel:</span>
              <span className="font-mono text-emerald-800 font-bold">
                {fuelPriceChangePct > 0 ? '+' : ''}
                {fuelPriceChangePct}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              value={fuelPriceChangePct}
              onChange={(e) => setFuelPriceChangePct(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Slider 2: Empty Km */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Km Vacíos:</span>
              <span className="font-mono text-emerald-800 font-bold">
                {emptyKmChangePct > 0 ? '+' : ''}
                {emptyKmChangePct}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              value={emptyKmChangePct}
              onChange={(e) => setEmptyKmChangePct(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Slider 3: Waiting Time */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Tiempo Espera:</span>
              <span className="font-mono text-emerald-800 font-bold">
                +{waitingTimeAddMins} min
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="15"
              value={waitingTimeAddMins}
              onChange={(e) => setWaitingTimeAddMins(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Slider 4: Revenue / Rates */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Tarifa Flete:</span>
              <span className="font-mono text-emerald-800 font-bold">
                {revenueChangePct > 0 ? '+' : ''}
                {revenueChangePct}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              value={revenueChangePct}
              onChange={(e) => setRevenueChangePct(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Slider 5: Toll Costs */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Costo Casetas:</span>
              <span className="font-mono text-emerald-800 font-bold">
                {tollChangePct > 0 ? '+' : ''}
                {tollChangePct}%
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="30"
              value={tollChangePct}
              onChange={(e) => setTollChangePct(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Simulation Results Display */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              REVENUE SIMULADO
            </span>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">
              ${simRevenue.toLocaleString()} MXN
            </div>
            <div className="text-[10px] text-slate-500">Base: ${baseRevenue.toLocaleString()}</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              COSTO TOTAL SIMULADO
            </span>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">
              ${simTotalCost.toLocaleString()} MXN
            </div>
            <div className="text-[10px] text-slate-500">Base: ${baseCost.toLocaleString()}</div>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              simMarginDelta < 0
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <span className="text-[10px] uppercase font-semibold block">MARGEN SIMULADO</span>
            <div className="text-xl font-bold font-mono mt-1">
              ${simMargin.toLocaleString()} MXN ({simMarginPct}%)
            </div>
            <div className="text-[10px] font-semibold mt-0.5">
              Impacto: {simMarginDelta < 0 ? '' : '+'}
              ${simMarginDelta.toLocaleString()} MXN
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              PUNTO DE EQUILIBRIO
            </span>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">
              ${simTotalCost.toLocaleString()} MXN
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              Buffer: ${simMargin.toLocaleString()} MXN
            </div>
          </div>
        </div>
      </div>

      {/* BREAK-EVEN ANALYSIS MODULE PER TRIP (Requirement 40) */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 font-sans">
            Punto de Equilibrio (Break-even Revenue Analysis por Viaje)
          </h2>
          <span className="text-xs text-slate-500">
            Fórmula: Break-even = Costos Variables + Costos Fijos Asignados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Viaje</th>
                <th className="py-2.5 px-3">Ruta</th>
                <th className="py-2.5 px-3 font-mono">Revenue Actual</th>
                <th className="py-2.5 px-3 font-mono">Break-even Revenue</th>
                <th className="py-2.5 px-3 font-mono">Margin Buffer (Seguridad)</th>
                <th className="py-2.5 px-3">Diagnóstico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {trips.map((t) => {
                const econ = t.economics;
                const bufferPct = Math.round((econ.marginBufferMXN / econ.revenueMXN) * 100);
                const isHealthy = bufferPct > 35;
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-900">#{t.tripNumber}</td>
                    <td className="py-3 px-3 text-slate-700">
                      {t.originName} → {t.destinationName}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      ${econ.revenueMXN.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      ${econ.breakEvenRevenueMXN.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-700">
                      ${econ.marginBufferMXN.toLocaleString()} ({bufferPct}%)
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isHealthy
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isHealthy ? 'Rentable Solido' : 'Margen Ajustado'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
