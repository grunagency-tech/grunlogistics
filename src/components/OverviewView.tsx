import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  ChevronRight,
  ShieldAlert,
  Fuel,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    company,
    trips,
    exceptions,
    recoveryCases,
    openTripDetail,
    setCurrentView,
    addRecoveryCase
  } = useApp();

  const activeTripsCount = company.activeTripsCount;
  const pendingExceptions = exceptions.filter((e) => e.status === 'PENDING');
  const tripsAtRisk = trips.filter((t) => t.delayMinutes > 30 || t.financialExposureMXN > 3000);
  const potentialRecoverySum = recoveryCases.reduce((acc, c) => acc + c.amountMXN, 0);

  const trip5831 = trips.find((t) => t.tripNumber === '5831') || trips[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Buenos días. Operación de hoy.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {company.name} · {company.fleetSize} unidades en flota · {company.activeDriversCount} operadores activos
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('TRIPS')}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
          >
            <span>+ Crear Nuevo Viaje</span>
          </button>
          <button
            onClick={() => setCurrentView('MONEY_RECOVERY')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ver Money Recovery</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Trips */}
        <div
          onClick={() => setCurrentView('TRIPS')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              VIAJES ACTIVOS
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
              {activeTripsCount}
            </span>
            <span className="text-xs text-slate-500 font-normal">en tránsito</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1">
            <span className="text-emerald-700 font-medium font-mono">148</span>
            <span>viajes este mes</span>
          </div>
        </div>

        {/* Exceptions */}
        <div
          onClick={() => setCurrentView('EXCEPTIONS')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              EXCEPCIONES
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-amber-700 font-sans tracking-tight">
              {pendingExceptions.length}
            </span>
            <span className="text-xs text-amber-600 font-medium">requieren atención</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Enfocado en desvíos y costos extras
          </div>
        </div>

        {/* Trips at Risk */}
        <div
          onClick={() => setCurrentView('TRIPS')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              VIAJES EN RIESGO
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-rose-700 font-sans tracking-tight">
              {tripsAtRisk.length}
            </span>
            <span className="text-xs text-rose-600 font-medium">$9,050 exposición</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Riesgo contractual o de cita
          </div>
        </div>

        {/* Potential Recovery */}
        <div
          onClick={() => setCurrentView('MONEY_RECOVERY')}
          className="bg-white p-5 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/30 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              POTENTIAL RECOVERY
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-800 font-mono tracking-tight">
              ${potentialRecoverySum.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-700 font-medium">MXN</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 flex items-center space-x-1">
            <span>Estadías y desvíos cobrables</span>
          </div>
        </div>
      </div>

      {/* CORE QUESTION SECTION: "What is costing me money?" */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              INFORMACIÓN CLAVE DE RENTABILIDAD
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-sans mt-0.5">
              ¿Qué me está costando dinero hoy?
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('EXCEPTIONS')}
            className="text-xs font-medium text-emerald-800 hover:text-emerald-900 flex items-center space-x-1"
          >
            <span>Ver todas las 7 excepciones</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TOP ISSUES CARDS (Exact match to Requirement 30 & Demo flow) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Issue 1: Trip #5831 */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-lg p-4 space-y-3 relative hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-xs">
                Trip #5831
              </span>
              <span className="text-xs font-semibold text-rose-700 font-mono">$4,850 exposición</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Retraso en Cita de Entrega</h3>
              <p className="text-xs text-slate-600 mt-1">
                Monterrey → CDMX. Unidad lleva 47 min de retraso. Cita era 18:00 hrs. Exposición a penalización.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-rose-200/60">
              <span className="text-[11px] text-slate-500">TechLogistics Corp</span>
              <button
                onClick={() => openTripDetail('TRIP-5831')}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors shadow-xs"
              >
                Revisar
              </button>
            </div>
          </div>

          {/* Issue 2: CEDIS Norte Excess Waiting */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-4 space-y-3 relative hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-xs">
                CEDIS Norte
              </span>
              <span className="text-xs font-semibold text-amber-700 font-mono">$1,500 rec. potencial</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Estadía Excesiva en Rampa</h3>
              <p className="text-xs text-slate-600 mt-1">
                Tractor 184 acumula 2h 14m en descarga. Excede 30 min libres. Potencial cobro de estadía.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-amber-200/60">
              <span className="text-[11px] text-slate-500">Espera 104 min exceso</span>
              <button
                onClick={() => openTripDetail('TRIP-5831')}
                className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded transition-colors shadow-xs"
              >
                Revisar
              </button>
            </div>
          </div>

          {/* Issue 3: Vehicle 184 Fuel Consumption */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 relative hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-xs">
                Vehicle 184
              </span>
              <span className="text-xs font-semibold text-slate-700 font-mono">$840 exedente est.</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Consumo Sobre Línea Base</h3>
              <p className="text-xs text-slate-600 mt-1">
                Rendimiento real de 2.35 km/L vs 2.80 km/L esperado (-16%). Alerta de mantenimiento de inyectores.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <span className="text-[11px] text-slate-500">Tractor Freightliner 2022</span>
              <button
                onClick={() => setCurrentView('FLEET')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded transition-colors shadow-xs"
              >
                Revisar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section: Active Trips Summary + Customer Margins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Trips Quick Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              Viajes Destacados & Desvíos Económicos
            </h2>
            <button
              onClick={() => setCurrentView('TRIPS')}
              className="text-xs text-emerald-800 hover:underline font-medium"
            >
              Ver todos ({trips.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Viaje</th>
                  <th className="py-2.5 px-3">Cliente / Ruta</th>
                  <th className="py-2.5 px-3">Esperado</th>
                  <th className="py-2.5 px-3">Real</th>
                  <th className="py-2.5 px-3">Variación</th>
                  <th className="py-2.5 px-3">Recuperación</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {trips.map((t) => {
                  const varVal = t.economics.marginVarianceMXN;
                  const isNegative = varVal < 0;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        #{t.tripNumber}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {t.vehicleUnitNumber} · {t.driverName}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 truncate max-w-[140px]">
                          {t.customerName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {t.originName} → {t.destinationName}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        ${t.economics.expectedMarginMXN.toLocaleString()}
                        <div className="text-[10px] text-slate-400 font-sans">
                          {t.economics.expectedMarginPercent}%
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                        ${t.economics.actualMarginMXN.toLocaleString()}
                        <div className="text-[10px] text-slate-500 font-sans">
                          {t.economics.actualMarginPercent}%
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span
                          className={`font-semibold ${
                            isNegative ? 'text-rose-600' : 'text-emerald-700'
                          }`}
                        >
                          {isNegative ? '' : '+'}
                          ${varVal.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {t.potentialDetentionMXN > 0 ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                            +${t.potentialDetentionMXN.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => openTripDetail(t.id)}
                          className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded transition-colors"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Profitability Highlights (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              Rentabilidad por Cliente
            </h2>
            <button
              onClick={() => setCurrentView('CUSTOMERS')}
              className="text-xs text-emerald-800 hover:underline font-medium"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-3">
            {useApp().customers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => setCurrentView('CUSTOMERS')}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 truncate">
                    {cust.name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      cust.status === 'PROFITABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : cust.status === 'LOW_MARGIN'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cust.marginPercent}% margen
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>
                    <span>Revenue: </span>
                    <strong className="text-slate-800 font-mono">
                      ${(cust.totalRevenueMXN / 1000).toFixed(0)}k
                    </strong>
                  </div>
                  <div>
                    <span>Espera acum: </span>
                    <strong className="text-slate-800 font-mono">{cust.totalWaitingHours} hrs</strong>
                  </div>
                </div>
                {cust.potentialRecoveryMXN > 0 && (
                  <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
                    <span>Recuperación identificada:</span>
                    <span className="font-mono font-bold">
                      ${cust.potentialRecoveryMXN.toLocaleString()} MXN
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
