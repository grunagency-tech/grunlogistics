import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle } from '../types';
import {
  Truck,
  MapPin,
  Fuel,
  Wrench,
  TrendingUp,
  Map,
  List,
  AlertTriangle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const FleetView: React.FC = () => {
  const { vehicles, openTripDetail } = useApp();
  const [activeTab, setActiveTab] = useState<'LIST' | 'MAP'>('LIST');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('VEH-184');

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Vista de Flota (Fleet View & Vehicle Economics)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Estado operativo, ubicación real y rendimiento económico por unidad de transporte
          </p>
        </div>

        {/* Tab Toggle: List vs Map */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('LIST')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'LIST'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Lista / Economía</span>
          </button>
          <button
            onClick={() => setActiveTab('MAP')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'MAP'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Mapa Operativo</span>
          </button>
        </div>
      </div>

      {activeTab === 'LIST' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicles List (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              Unidades en Flota ({vehicles.length})
            </h2>

            <div className="space-y-3">
              {vehicles.map((v) => {
                const isSelected = v.id === selectedVehicleId;
                const fuelDiffPct = Math.round(
                  ((v.actualFuelEfficiencyKmL - v.expectedFuelEfficiencyKmL) /
                    v.expectedFuelEfficiencyKmL) *
                    100
                );
                const hasFuelIssue = fuelDiffPct < -10;

                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-500/30'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center font-mono">
                          {v.unitNumber}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {v.brand} {v.model} ({v.year})
                          </div>
                          <div className="text-xs text-slate-500">
                            Placa: {v.plate} · Remolque: {v.trailerNumber || 'N/A'} · Chófer:{' '}
                            <strong className="text-slate-700">{v.driverName || 'Sin asignar'}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            v.status === 'ON_TRIP'
                              ? 'bg-blue-100 text-blue-800'
                              : v.status === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {v.status}
                        </span>
                        {v.activeTripId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTripDetail(v.activeTripId!);
                            }}
                            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded"
                          >
                            Ver Viaje
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          Revenue Generado
                        </span>
                        <span className="font-bold font-mono text-slate-900">
                          ${v.revenueGeneratedMXN.toLocaleString()} MXN
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          Costo Operación
                        </span>
                        <span className="font-bold font-mono text-slate-900">
                          ${v.operatingCostMXN.toLocaleString()} MXN
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          Margen Neto
                        </span>
                        <span className="font-bold font-mono text-emerald-700">
                          ${v.netMarginMXN.toLocaleString()} MXN
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          Rendimiento Diésel
                        </span>
                        <span
                          className={`font-bold font-mono ${
                            hasFuelIssue ? 'text-rose-600' : 'text-slate-900'
                          }`}
                        >
                          {v.actualFuelEfficiencyKmL} km/L ({fuelDiffPct}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Vehicle Economics Detail (1 col) */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs h-fit sticky top-20">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                VEHICLE ECONOMICS
              </span>
              <h2 className="text-base font-bold text-slate-900 font-sans mt-0.5">
                Unidad {selectedVehicle.unitNumber} - {selectedVehicle.brand}
              </h2>
              <p className="text-xs text-slate-500">{selectedVehicle.currentLocationName}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Proveedor GPS:</span>
                  <span className="font-semibold text-slate-900">{selectedVehicle.gpsProvider}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Odómetro Actual:</span>
                  <span className="font-mono text-slate-900">
                    {selectedVehicle.currentOdometerKm.toLocaleString()} km
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Utilización de Unidad:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedVehicle.utilizationPercent}%
                  </span>
                </div>
              </div>

              {/* Economic metrics breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded bg-slate-50">
                  <span className="text-slate-600">Costo por Kilómetro (Cost/km):</span>
                  <strong className="font-mono text-slate-900">
                    ${selectedVehicle.costPerKmMXN} MXN/km
                  </strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50">
                  <span className="text-slate-600">Revenue por Kilómetro:</span>
                  <strong className="font-mono text-slate-900">
                    ${selectedVehicle.revenuePerKmMXN} MXN/km
                  </strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50">
                  <span className="text-slate-600">Kilómetros Recorridos:</span>
                  <strong className="font-mono text-slate-900">
                    {selectedVehicle.totalKmDriven.toLocaleString()} km
                  </strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-amber-50 text-amber-900">
                  <span>Kilómetros Vacíos (Empty km):</span>
                  <strong className="font-mono">{selectedVehicle.emptyKmDriven} km</strong>
                </div>
              </div>

              {/* Fuel comparison block */}
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Consumo de Diésel vs Línea Base</span>
                  <Fuel className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-[11px] text-slate-600">
                  Línea base esperada:{' '}
                  <strong className="font-mono">
                    {selectedVehicle.expectedFuelEfficiencyKmL} km/L
                  </strong>
                </div>
                <div className="text-[11px] text-slate-600">
                  Rendimiento real registrado:{' '}
                  <strong className="font-mono">
                    {selectedVehicle.actualFuelEfficiencyKmL} km/L
                  </strong>
                </div>
                {selectedVehicle.actualFuelEfficiencyKmL <
                  selectedVehicle.expectedFuelEfficiencyKmL && (
                  <div className="mt-2 text-[11px] font-medium text-amber-800 bg-amber-100 p-2 rounded border border-amber-200">
                    “Fuel consumption is above expected baseline. Costo estimado excedente en último
                    viaje: $840 MXN.”
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Map View (Requirement 27: Map is secondary tool) */
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-sans">
                Mapa Operativo de la Flota
              </h2>
              <p className="text-xs text-slate-500">
                Visualización de unidades en ruta, paradas y estatus (Herramienta secundaria)
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">31 viajes activos</span>
          </div>

          {/* Simple interactive clean map canvas simulation */}
          <div className="w-full h-96 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center p-6 text-white select-none">
            {/* Background grid representation */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Route path line representation */}
            <svg className="absolute inset-0 w-full h-full stroke-emerald-500 stroke-2 opacity-60">
              <line x1="20%" y1="70%" x2="70%" y2="30%" strokeDasharray="6 4" />
              <line x1="30%" y1="40%" x2="80%" y2="80%" strokeDasharray="6 4" />
            </svg>

            {/* Map Markers */}
            {vehicles.map((v, i) => {
              const offsets = [
                { top: '30%', left: '70%' },
                { top: '50%', left: '35%' },
                { top: '70%', left: '20%' },
                { top: '40%', left: '55%' }
              ];
              const pos = offsets[i % offsets.length];
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center font-bold text-xs text-white group-hover:scale-110 transition-transform">
                    {v.unitNumber}
                  </div>
                  {/* Tooltip Card on click/hover */}
                  <div className="hidden group-hover:block absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 p-2.5 rounded-lg shadow-xl text-xs w-48 border border-slate-200 z-30 pointer-events-none">
                    <div className="font-bold">Unidad #{v.unitNumber}</div>
                    <div className="text-[11px] text-slate-500">{v.currentLocationName}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                      {v.activeTripId ? 'En Viaje Activo' : 'Disponible'}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs text-slate-900 p-3 rounded-lg text-xs border border-slate-200 shadow-md">
              <div className="font-bold">Leyenda Mapa</div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Unidades Activas (En Tránsito)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
