import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  DollarSign,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Plus,
  TrendingDown,
  ShieldCheck,
  Calendar,
  Truck,
  User,
  ExternalLink
} from 'lucide-react';

export const TripDetailView: React.FC = () => {
  const {
    activeSelectedTrip: trip,
    setCurrentView,
    addRecoveryCase,
    recoveryCases
  } = useApp();

  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);
  const [recoveryAmount, setRecoveryAmount] = useState<number>(trip.potentialDetentionMXN || 1500);
  const [recoveryReason, setRecoveryReason] = useState<string>('Detention');
  const [recoveryNotes, setRecoveryNotes] = useState<string>(
    `Estadía en rampa de CEDIS Norte. Llevó 2h 14m en descarga (104 min excedentes sobre los 30 min libres).`
  );

  const existingCase = recoveryCases.find((c) => c.tripId === trip.id);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    addRecoveryCase({
      tripId: trip.id,
      tripNumber: trip.tripNumber,
      customerId: trip.customerId,
      customerName: trip.customerName,
      reason: recoveryReason as any,
      amountMXN: recoveryAmount,
      evidenceDescription: recoveryNotes
    });
    setShowRecoveryModal(false);
  };

  const econ = trip.economics;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Back Navigation & Status */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('TRIPS')}
          className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Lista de Viajes</span>
        </button>

        <div className="flex items-center space-x-3">
          <span
            className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              trip.status === 'IN_TRANSIT'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : trip.status === 'COMPLETED'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Estatus: {trip.status}
          </span>
          <button
            onClick={() => setShowRecoveryModal(true)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Crear Caso de Recovery</span>
          </button>
        </div>
      </div>

      {/* Main Trip Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
                Viaje #{trip.tripNumber}
              </h1>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-semibold border border-slate-200">
                {trip.customerName}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-1 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{trip.originName}</span>
              <span className="text-slate-400">→</span>
              <span>{trip.destinationName}</span>
            </p>
          </div>

          <div className="flex items-center space-x-6 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                REVENUE COBRADO
              </span>
              <span className="text-xl font-bold text-slate-900 font-mono">
                ${econ.revenueMXN.toLocaleString()} MXN
              </span>
            </div>
            <div className="h-8 border-r border-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                MARGEN REAL ACTUAL
              </span>
              <span className="text-xl font-bold text-emerald-700 font-mono">
                ${econ.actualMarginMXN.toLocaleString()} MXN
              </span>
              <span className="text-xs text-emerald-800 font-semibold ml-1.5 font-sans">
                ({econ.actualMarginPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle & Driver Info Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400">Unidad: </span>
              <strong className="text-slate-900 font-semibold">{trip.vehicleUnitNumber}</strong> (
              {trip.trailerNumber || 'Sin remolque'})
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400">Operador: </span>
              <strong className="text-slate-900 font-semibold">{trip.driverName}</strong>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400">Cita Entrega: </span>
              <strong className="text-slate-900 font-semibold">{trip.deliveryAppointment}</strong>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400">ETA / Retraso: </span>
              <strong className={trip.delayMinutes > 0 ? 'text-rose-600' : 'text-slate-900'}>
                {trip.eta} ({trip.delayMinutes} min)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* TRIP ECONOMICS: EXPECTED VS ACTUAL (Core Requirement #33) */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              TRIP ECONOMICS
            </span>
            <h2 className="text-base font-bold text-slate-900 font-sans">
              Comparativa Presupuestado (Expected) vs Real (Actual)
            </h2>
          </div>
          {econ.marginVarianceMXN !== 0 && (
            <div
              className={`px-3 py-1 rounded-md text-xs font-bold font-mono border ${
                econ.marginVarianceMXN < 0
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              Variación de Margen: {econ.marginVarianceMXN < 0 ? '' : '+'}
              ${econ.marginVarianceMXN.toLocaleString()} MXN
            </div>
          )}
        </div>

        {/* Expected vs Actual Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Concepto de Costo / Margen</th>
                <th className="py-2.5 px-4 font-mono text-slate-700">EXPECTED (Planeado)</th>
                <th className="py-2.5 px-4 font-mono text-slate-900 font-bold">ACTUAL (Real)</th>
                <th className="py-2.5 px-4 font-mono">VARIACIÓN</th>
                <th className="py-2.5 px-4">Notas & Origen de Datos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {/* Revenue */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900">Revenue (Flete Cobrado)</td>
                <td className="py-3 px-4 font-mono">${econ.revenueMXN.toLocaleString()}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  ${econ.revenueMXN.toLocaleString()}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">$0</td>
                <td className="py-3 px-4 text-slate-500">Tarifa pactada por contrato</td>
              </tr>

              {/* Fuel */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-slate-800">1. Combustible (Diésel)</td>
                <td className="py-3 px-4 font-mono">${econ.estimatedFuelMXN.toLocaleString()}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  ${econ.actualFuelMXN.toLocaleString()}
                </td>
                <td className="py-3 px-4 font-mono text-rose-600 font-semibold">
                  +${(econ.actualFuelMXN - econ.estimatedFuelMXN).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-slate-500">
                  Ticket #9921 (Rendimiento real 2.35 km/L vs 2.80 baseline)
                </td>
              </tr>

              {/* Tolls */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-slate-800">2. Casetas & Peajes</td>
                <td className="py-3 px-4 font-mono">${econ.estimatedTollsMXN.toLocaleString()}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  ${econ.actualTollsMXN.toLocaleString()}
                </td>
                <td className="py-3 px-4 font-mono text-rose-600 font-semibold">
                  +${(econ.actualTollsMXN - econ.estimatedTollsMXN).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-slate-500">
                  IAVE Tag TagAut (+ $40 por caseta adicional por desvío)
                </td>
              </tr>

              {/* Driver Pay */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-slate-800">3. Pago a Operador</td>
                <td className="py-3 px-4 font-mono">${econ.estimatedDriverPayMXN.toLocaleString()}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  ${econ.actualDriverPayMXN.toLocaleString()}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">$0</td>
                <td className="py-3 px-4 text-slate-500">Modelo pago fijo por viaje ($2,100 MXN)</td>
              </tr>

              {/* Other Expenses */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-slate-800">4. Otros Gastos / Viáticos</td>
                <td className="py-3 px-4 font-mono">${econ.estimatedOtherMXN.toLocaleString()}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  ${econ.actualOtherMXN.toLocaleString()}
                </td>
                <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                  -${(econ.estimatedOtherMXN - econ.actualOtherMXN).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-slate-500">Alimentos y estacionamiento en ruta</td>
              </tr>

              {/* TOTAL COST ROW */}
              <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-300">
                <td className="py-3 px-4 text-slate-900">TOTAL COST (Costo Total)</td>
                <td className="py-3 px-4 font-mono">${econ.totalEstimatedCostMXN.toLocaleString()}</td>
                <td className="py-3 px-4 font-mono text-slate-900">
                  ${econ.totalActualCostMXN.toLocaleString()}
                </td>
                <td className="py-3 px-4 font-mono text-rose-600">
                  +${econ.costVarianceMXN.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-slate-600 text-[11px] font-normal">
                  El costo real superó el estimado por ${econ.costVarianceMXN} MXN.
                </td>
              </tr>

              {/* MARGIN ROW */}
              <tr className="bg-emerald-50/70 font-bold border-t border-emerald-200">
                <td className="py-3.5 px-4 text-emerald-900 text-sm">ACTUAL MARGIN (Margen Neto)</td>
                <td className="py-3.5 px-4 font-mono text-emerald-800">
                  ${econ.expectedMarginMXN.toLocaleString()} ({econ.expectedMarginPercent}%)
                </td>
                <td className="py-3.5 px-4 font-mono text-emerald-900 text-base">
                  ${econ.actualMarginMXN.toLocaleString()} ({econ.actualMarginPercent}%)
                </td>
                <td className="py-3.5 px-4 font-mono text-rose-600">
                  ${econ.marginVarianceMXN.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-emerald-800 text-[11px] font-medium">
                  Punto de equilibrio: ${econ.breakEvenRevenueMXN.toLocaleString()} MXN (Buffer de $
                  {econ.marginBufferMXN.toLocaleString()})
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid: Timeline + Recovery/Distance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Operational Events & Timeline */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              Eventos Operativos & Línea de Tiempo
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Espera en rampa: {trip.waitingMinutes} min
            </span>
          </div>

          <div className="space-y-4">
            {trip.events.map((evt, idx) => (
              <div key={evt.id} className="flex space-x-3 text-xs">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </div>
                  {idx < trip.events.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-200 my-1" />
                  )}
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 uppercase">{evt.category}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                  </div>
                  <div className="text-slate-600">{evt.description}</div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Ubicación: {evt.locationName} · Creado por: {evt.createdBy}
                  </div>
                  {evt.evidenceUrl && (
                    <div className="mt-2">
                      <button
                        onClick={() => setShowPodModal(true)}
                        className="text-[11px] text-emerald-800 hover:underline flex items-center space-x-1 font-semibold"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Ver Fotografía de Evidencia / Foto Rampa</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Distance & Recovery & Documents */}
        <div className="space-y-6">
          {/* Money Recovery Card */}
          <div className="bg-white rounded-xl border border-emerald-200/80 p-5 space-y-4 shadow-xs bg-gradient-to-br from-white to-emerald-50/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                MONEY RECOVERY
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                {trip.detentionBillableStatus}
              </span>
            </div>

            <div>
              <div className="text-2xl font-bold text-emerald-900 font-mono">
                ${trip.potentialDetentionMXN.toLocaleString()} MXN
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Motivo: La estadía en descarga ({trip.waitingMinutes} min) excedió el tiempo libre
                configurado de {trip.allowedWaitingMinutes} min por un total de{' '}
                <strong>{trip.excessWaitingMinutes} minutos cobrables</strong>.
              </p>
            </div>

            {existingCase ? (
              <div className="p-3 bg-emerald-100/70 rounded-lg border border-emerald-300/80 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center justify-between">
                  <span>Caso de Recuperación Activo: {existingCase.caseCode}</span>
                  <span className="uppercase text-[10px] bg-emerald-800 text-white px-1.5 py-0.5 rounded">
                    {existingCase.status}
                  </span>
                </div>
                <div className="text-slate-700">{existingCase.evidenceDescription}</div>
              </div>
            ) : (
              <button
                onClick={() => setShowRecoveryModal(true)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Crear Caso de Recovery (${trip.potentialDetentionMXN} MXN)
              </button>
            )}
          </div>

          {/* Distance & Empty Kilometers */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              DISTANCIA & KILÓMETROS VACÍOS
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Cargados</span>
                <div className="text-base font-bold text-slate-900 font-mono">{trip.loadedKm} km</div>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                <span className="text-[10px] text-amber-700 uppercase font-semibold">Vacíos</span>
                <div className="text-base font-bold text-amber-800 font-mono">{trip.emptyKm} km</div>
                <div className="text-[10px] text-amber-600 font-semibold">{trip.emptyKmPercent}%</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                <div className="text-base font-bold text-slate-900 font-mono">
                  {trip.actualDistanceKm} km
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
              Costo estimado de km vacíos en este viaje:{' '}
              <strong className="text-slate-900 font-mono">
                ${trip.emptyKmCostMXN.toLocaleString()} MXN
              </strong>
            </div>

            {trip.routeDeviationKm > 0 && (
              <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span>Desvío de Ruta Detectado</span>
                  <span>+{trip.routeDeviationKm} km</span>
                </div>
                <div className="text-[11px] text-amber-800">
                  Incremento de peaje/combustible estimado: +${trip.routeDeviationCostMXN} MXN.
                  Estatus: {trip.routeDeviationStatus}.
                </div>
              </div>
            )}
          </div>

          {/* Documents & POD */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              DOCUMENTOS DE EVIDENCIA
            </h3>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-slate-900">Proof of Delivery (POD)</span>
              </div>
              {trip.podUploaded ? (
                <button
                  onClick={() => setShowPodModal(true)}
                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded transition-colors"
                >
                  Ver POD Firmado
                </button>
              ) : (
                <span className="text-rose-600 font-bold text-[11px]">Pendiente de Cargar</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Case Creation Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Crear Caso de Recovery (Dinero Recuperable)
              </h3>
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Motivo de Reclamación / Cobro
                </label>
                <select
                  value={recoveryReason}
                  onChange={(e) => setRecoveryReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Detention">Detention (Estadía Excesiva)</option>
                  <option value="Additional mileage">Additional Mileage (Kilometraje Extra)</option>
                  <option value="Extra stop">Extra Stop (Parada Adicional)</option>
                  <option value="Waiting">Waiting Time (Tiempo de Espera)</option>
                  <option value="Customer-caused delay">Customer-Caused Delay</option>
                  <option value="Approved additional expenses">Gastos Adicionales Aprobados</option>
                  <option value="Unbilled service">Servicio No Facturado</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monto a Reclamar (MXN)</label>
                <input
                  type="number"
                  value={recoveryAmount}
                  onChange={(e) => setRecoveryAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descripción & Evidencia de Soporte
                </label>
                <textarea
                  rows={3}
                  value={recoveryNotes}
                  onChange={(e) => setRecoveryNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded shadow-xs"
                >
                  Guardar Caso de Recovery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POD / Evidence Photo Modal */}
      {showPodModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Evidencia Fotográfica / POD Firmado
              </h3>
              <button
                onClick={() => setShowPodModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <img
                src={
                  trip.podUrl ||
                  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
                }
                alt="POD Document"
                className="w-full h-80 object-cover rounded-lg border border-slate-200"
              />
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>Registrado por GPS Operador · Sello Intacto</span>
                <span className="font-mono">Timestamp: {trip.scheduledArrival}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPodModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-medium rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
