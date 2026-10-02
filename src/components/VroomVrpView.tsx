import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cpu,
  Route as RouteIcon,
  Zap,
  CheckCircle2,
  Clock,
  TrendingDown,
  Layers,
  MapPin,
  Play,
  Truck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const VroomVrpView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [isSolving, setIsSolving] = useState(false);
  const [solved, setSolved] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<'HEAVY_TRUCK' | 'VAN_DISTRIBUTION'>('HEAVY_TRUCK');

  const runVroomSolver = () => {
    setIsSolving(true);
    setSolved(false);
    setTimeout(() => {
      setIsSolving(false);
      setSolved(true);
    }, 900);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 tracking-wide uppercase">
              grunagency-tech / vroom
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              C++20 VRP Engine High-Speed Solver
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">VROOM Optimizador VRP Multi-Depósito</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Optimizador de rutas C++20 con soporte para restricciones de capacidad (CVRP), ventanas de tiempo (VRPTW), descansos NOM-087-SCT, prioridades de entregas y heurísticas LNS.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runVroomSolver}
            disabled={isSolving}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            {isSolving ? (
              <>
                <Zap className="w-4 h-4 animate-spin" /> Resolviendo en C++20...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Ejecutar Solver VROOM
              </>
            )}
          </button>
        </div>
      </div>

      {/* Solver Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tiempo de Cómputo Solver</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">42 ms</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Motor C++20 Nativo
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ahorro en Kilometraje</div>
            <div className="text-2xl font-black text-slate-900 mt-1">-16.8% KM</div>
            <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> -412 km guardados hoy
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0061FF] flex items-center justify-center">
            <RouteIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cumplimiento Ventanas (VRPTW)</div>
            <div className="text-2xl font-black text-slate-900 mt-1">99.4%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              0 violaciones de tiempo
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilización de Capacidad</div>
            <div className="text-2xl font-black text-slate-900 mt-1">94.2%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Optimización de carga útil
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Optimization Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Parameters & Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" /> Parámetros del Solver VROOM
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Perfil de Vehículo VROOM</label>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="HEAVY_TRUCK">Tractor Camión 53ft (Restricción de Peso NOM-012)</option>
                <option value="VAN_DISTRIBUTION">Rabón / Distribución Última Milla</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Algoritmo Heurístico:</span>
                <span className="font-mono font-bold text-slate-900">LNS (Large Neighborhood Search)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Matrices de Distancia:</span>
                <span className="font-mono font-bold text-slate-900">GraphHopper OSM Engine</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>NOM-087-SCT (Descansos):</span>
                <span className="font-mono font-bold text-emerald-600">30 min c/5h de manejo</span>
              </div>
            </div>

            <button
              onClick={runVroomSolver}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              Re-calcular Rutas Óptimas
            </button>
          </div>
        </div>

        {/* Right Column: Active Optimized Tour Output */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RouteIcon className="w-5 h-5 text-emerald-600" /> Solución VRP Generada (Resultados C++20)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                4 Depósitos, 32 Puntos de Entrega, 8 Vehículos Asignados
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Óptimo Global
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                vehicle: 'Tractor 184 (Freightliner Cascadia)',
                driver: 'Roberto Gómez',
                depot: 'CEDIS Monterrey Apodaca',
                stops: ['CEDIS Matehuala', 'CEDIS Querétaro', 'CEDIS Vallejo CDMX'],
                distanceKm: '920 km',
                utilization: '94% (22,500 kg / 24,000 kg)',
                estimatedSavings: '$3,840 MXN'
              },
              {
                vehicle: 'Tractor 201 (Kenworth T680)',
                driver: 'Alejandro Morales',
                depot: 'CEDIS Tepotzotlán Edomex',
                stops: ['Parque Industrial El Marqués', 'CEDIS Guadalajara'],
                distanceKm: '540 km',
                utilization: '88% (21,000 kg / 24,000 kg)',
                estimatedSavings: '$2,410 MXN'
              }
            ].map((tour, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#0061FF]" />
                    <span className="font-bold text-slate-900 text-xs">{tour.vehicle}</span>
                    <span className="text-slate-400 text-xs">({tour.driver})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700">{tour.distanceKm}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      Ahorro: {tour.estimatedSavings}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {tour.depot}
                  </span>
                  {tour.stops.map((stop, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span className="font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {stop}
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  Carga Útil: <strong className="text-slate-800">{tour.utilization}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
