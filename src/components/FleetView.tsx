import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle } from '../types';
import { getSamsaraTelemetry } from '../services/samsaraApi';
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
  DollarSign,
  UserCheck,
  Award,
  ShieldCheck,
  Activity,
  Cpu
} from 'lucide-react';

export const FleetView: React.FC = () => {
  const { vehicles, drivers, openTripDetail } = useApp();
  const [activeTab, setActiveTab] = useState<'LIST' | 'MAP' | 'SCORECARD'>('LIST');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('VEH-184');

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const assignedDriver = drivers.find((d) => d.id === selectedVehicle.driverId || d.name === selectedVehicle.driverName);
  const samsaraTelemetry = getSamsaraTelemetry(selectedVehicle.unitNumber);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Vista de Flota (Fleet View & Vehicle Economics)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Estado operativo, ubicación real, economía por unidad y Scorecard Financiero de Operadores
          </p>
        </div>

        {/* Tab Toggle: List vs Map vs Scorecard */}
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
            onClick={() => setActiveTab('SCORECARD')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === 'SCORECARD'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Scorecard Chóferes</span>
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

              {/* Samsara IoT Telemetry & Engine Diagnostics Live Feed */}
              <div className="p-3 bg-slate-900 text-white rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    SAMSARA TELEMETRY LIVE
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {samsaraTelemetry.lastUpdated}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div className="bg-slate-800 p-2 rounded border border-slate-700">
                    <span className="text-slate-400 block">Nivel Tanque Diésel</span>
                    <strong className="text-white font-mono text-xs">
                      {samsaraTelemetry.fuelTankLevelPercent}%
                    </strong>
                  </div>
                  <div className="bg-slate-800 p-2 rounded border border-slate-700">
                    <span className="text-slate-400 block">Batería & Presión</span>
                    <strong className="text-white font-mono text-xs">
                      {samsaraTelemetry.batteryVoltageVolts}V · {samsaraTelemetry.engineOilPressurePsi} PSI
                    </strong>
                  </div>
                </div>

                <div className="p-2 bg-slate-800 rounded border border-slate-700 text-[10px] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Diagnóstico Motor OBD-II:</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        samsaraTelemetry.engineDiagnosticsStatus === 'HEALTHY'
                          ? 'bg-emerald-900/80 text-emerald-300'
                          : 'bg-amber-900/80 text-amber-300'
                      }`}
                    >
                      {samsaraTelemetry.engineDiagnosticsStatus}
                    </span>
                  </div>
                  {samsaraTelemetry.dtcCodes.length > 0 ? (
                    <div className="text-rose-400 font-mono text-[9px]">
                      Códigos DTC: {samsaraTelemetry.dtcCodes.join(', ')}
                    </div>
                  ) : (
                    <div className="text-emerald-400 text-[9px]">Sin códigos de falla DTC detectados</div>
                  )}
                </div>

                <div className="p-2 bg-slate-800 rounded border border-slate-700 text-[10px]">
                  <div className="flex justify-between text-slate-300 font-bold mb-0.5">
                    <span>NOM-087-SCT (Horas Conducción):</span>
                    <span className="text-emerald-400 font-mono">{samsaraTelemetry.nom087DrivingHoursToday}h hoy</span>
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Conducción restante: <strong className="text-white font-mono">{samsaraTelemetry.nom087RemainingDrivingHours}h</strong> · Parada descanso: <strong className="text-white font-mono">{samsaraTelemetry.nom087RestBreakRequiredInMinutes}m</strong>
                  </div>
                </div>
              </div>

              {/* Driver Financial Scorecard Quick View */}
              {assignedDriver && (
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Scorecard Chófer: {assignedDriver.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 text-white font-mono">
                      {assignedDriver.scorecardScore}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    <div className="bg-white p-2 rounded border border-emerald-100">
                      <span className="text-slate-500 block">Eficiencia Diésel</span>
                      <strong className="text-emerald-800 font-mono">
                        {assignedDriver.fuelEfficiencyVsBaselinePercent >= 0 ? '+' : ''}
                        {assignedDriver.fuelEfficiencyVsBaselinePercent}% vs base
                      </strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-emerald-100">
                      <span className="text-slate-500 block">Bono Estimado</span>
                      <strong className="text-emerald-800 font-mono">
                        ${assignedDriver.estimatedProductivityBonusMXN.toLocaleString()} MXN
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'SCORECARD' ? (
        /* Driver Financial Scorecard View (Feature 5) */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>PRODUCTIVITY & PROFITABILITY SCORECARD</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Scorecard Financiero por Operador / Chófer
                </h2>
                <p className="text-xs text-slate-500">
                  Calificación basada en impacto económico real: consumo de diésel vs línea base, carga oportuna de tickets y entregas a tiempo.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Operadores Evaluados</span>
                  <span className="font-extrabold text-slate-900 font-mono text-base">{drivers.length}</span>
                </div>
                <div className="bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 text-center">
                  <span className="text-[10px] text-emerald-700 font-mono block uppercase">Score Promedio Flota</span>
                  <span className="font-extrabold text-emerald-800 font-mono text-base">
                    {Math.round(drivers.reduce((acc, d) => acc + d.scorecardScore, 0) / (drivers.length || 1))}/100
                  </span>
                </div>
                <div className="bg-slate-900 px-3 py-2 rounded-lg text-white text-center">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Bonos por Pagar</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-base">
                    ${drivers.reduce((acc, d) => acc + d.estimatedProductivityBonusMXN, 0).toLocaleString()} MXN
                  </span>
                </div>
              </div>
            </div>

            {/* Drivers Scorecard Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Operador / Licencia</th>
                    <th className="p-3">Unidad Asignada</th>
                    <th className="p-3 text-center">Financial Scorecard</th>
                    <th className="p-3">Rendimiento Diésel vs Base</th>
                    <th className="p-3 text-center">% Tickets a Tiempo</th>
                    <th className="p-3 text-center">% Entregas a Tiempo</th>
                    <th className="p-3 text-right">Bono Productividad Est.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {drivers.map((drv) => {
                    const isHigh = drv.scorecardScore >= 95;
                    const isMed = drv.scorecardScore >= 90;

                    return (
                      <tr key={drv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{drv.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{drv.licenseNumber} · {drv.phone}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            Unidad {drv.assignedVehicleUnit || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full font-bold font-mono text-xs inline-flex items-center gap-1 ${
                              isHigh
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : isMed
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {drv.scorecardScore}/100
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold font-mono text-slate-900">{drv.fuelEfficiencyKmL} km/L</div>
                          <div
                            className={`text-[10px] font-bold ${
                              drv.fuelEfficiencyVsBaselinePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {drv.fuelEfficiencyVsBaselinePercent >= 0 ? '+' : ''}
                            {drv.fuelEfficiencyVsBaselinePercent}% vs promedio
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-bold font-mono text-slate-900">
                            {drv.evidenceUploadRatePercent}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-bold font-mono text-slate-900">
                            {drv.onTimeDeliveryRatePercent}%
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-bold font-mono text-emerald-700 text-sm">
                            ${drv.estimatedProductivityBonusMXN.toLocaleString()} MXN
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
