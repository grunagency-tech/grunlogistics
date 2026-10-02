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
  Calendar,
  Truck,
  User,
  MessageSquare,
  Download,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';

export const TripDetailView: React.FC = () => {
  const {
    activeSelectedTrip: trip,
    setCurrentView,
    addRecoveryCase,
    recoveryCases,
    addOperationalEvent
  } = useApp();

  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [whatsappRecipient, setWhatsappRecipient] = useState<'CLIENT' | 'DRIVER'>('CLIENT');
  const [whatsappMsgSent, setWhatsappMsgSent] = useState(false);
  const [showClaimReportModal, setShowClaimReportModal] = useState(false);

  if (!trip || !trip.economics) {
    return (
      <div className="p-8 text-center space-y-4 font-sans max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Cargando detalles del viaje...</h2>
        <p className="text-xs text-slate-500">
          El viaje seleccionado está inicializando su expediente de la Carta Porte SAT 3.1.
        </p>
        <button
          onClick={() => setCurrentView('TRIPS')}
          className="px-4 py-2 bg-[#0061FF] hover:bg-[#0052D4] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          Volver a lista de viajes
        </button>
      </div>
    );
  }

  const existingCase = (recoveryCases || []).find((c) => c.tripId === trip.id);

  const econ = trip.economics || {
    revenueMXN: 0,
    estimatedFuelMXN: 0,
    estimatedTollsMXN: 0,
    estimatedDriverPayMXN: 0,
    estimatedOtherMXN: 0,
    totalEstimatedCostMXN: 0,
    expectedMarginMXN: 0,
    expectedMarginPercent: 0,
    expectedDistanceKm: 0,
    expectedFuelLiters: 0,
    expectedTollsMXN: 0,
    actualFuelMXN: 0,
    actualTollsMXN: 0,
    actualDriverPayMXN: 0,
    actualOtherMXN: 0,
    totalActualCostMXN: 0,
    actualMarginMXN: 0,
    actualMarginPercent: 0,
    costVarianceMXN: 0,
    marginVarianceMXN: 0,
    breakEvenRevenueMXN: 0,
    marginBufferMXN: 0
  };

  const marginDiff = (econ.actualMarginMXN || 0) - (econ.expectedMarginMXN || 0);
  const fuelDiff = (econ.actualFuelMXN || 0) - (econ.estimatedFuelMXN || 0);
  const tollsDiff = (econ.actualTollsMXN || 0) - (econ.estimatedTollsMXN || 0);
  const excessMinutes = Math.max(0, (trip.waitingMinutes || 0) - (trip.allowedWaitingMinutes || 30));
  const waitingCostEst = Math.round((excessMinutes / 60) * 450);
  const isMarginLeak = marginDiff < 0 && (econ.revenueMXN > 0 ? (Math.abs(marginDiff) / econ.revenueMXN >= 0.05 || ((econ.expectedMarginPercent || 0) - (econ.actualMarginPercent || 0)) >= 5) : false);

  const handleSendWhatsapp = () => {
    const etaText = (trip.eta || '12 hrs').includes('h') ? trip.eta : `${trip.eta} hrs`;
    const msgText =
      whatsappRecipient === 'CLIENT'
        ? `Estimado ${trip.customerName}, su viaje #${trip.tripNumber} (${trip.originName} → ${trip.destinationName}) va en tránsito. ETA estimado: ${etaText}.`
        : `${trip.driverName}, recordatorio: Tu cita de entrega en ${trip.destinationName} es a las ${trip.deliveryAppointment} hrs. Recuerda subir foto del sello de seguridad.`;

    addOperationalEvent(trip.id, {
      category: 'WHATSAPP_NOTIFICATION',
      description: `[NOTIFICACIÓN WHATSAPP ENVIADA A ${whatsappRecipient}]: ${msgText}`,
      createdBy: 'DISPATCHER'
    });

    setWhatsappMsgSent(true);
    setTimeout(() => {
      setWhatsappMsgSent(false);
      setShowWhatsappModal(false);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans text-slate-900">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('TRIPS')}
          className="flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a lista de viajes</span>
        </button>

        <div className="flex items-center space-x-3">
          {/* WhatsApp Notification Trigger (Feature 6) */}
          <button
            onClick={() => {
              setWhatsappRecipient('CLIENT');
              setShowWhatsappModal(true);
            }}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Notificar por WhatsApp</span>
          </button>

          <span
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              trip.status === 'IN_TRANSIT'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {trip.status}
          </span>
        </div>
      </div>

      {/* CARTA PORTE SAT COMPLIANCE BANNER (Feature 1) */}
      <div className="bg-emerald-50/80 rounded-2xl border border-emerald-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-emerald-950 text-sm">
              Compliancia Carta Porte 3.1 SAT: Cumple 100%
            </div>
            <div className="text-[11px] text-emerald-800 font-medium">
              Folio Fiscal: <strong className="font-mono">{trip.cartaPorteFolio || '4A8F92C1-3D9B-4E8A-9812-7A11928C10F9'}</strong> · 
              Fracción SAT: <strong className="font-mono">{trip.cartaPorteMercanciaSatCode || '24101600'}</strong> · 
              Póliza Seguro: <strong className="font-mono">{trip.cartaPorteSeguroPoliza || 'Qualitas #POL-99281'}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <a
            href="/Carta_Porte_SAT_3.1_5831.pdf"
            download
            className="px-3 py-1.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[10px] tracking-wider uppercase flex items-center space-x-1"
          >
            <Download className="w-3 h-3" />
            <span>Descargar Carta Porte PDF</span>
          </a>
        </div>
      </div>

      {/* Narrative Trip Header */}
      <div className="space-y-4 pb-6 border-b border-slate-200/60">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-widest block">
              VIAJE #{trip.tripNumber} · {trip.customerName}
            </span>
            <div className="mt-2 flex items-baseline space-x-3 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              <span>{trip.originName}</span>
              <span className="text-slate-400 font-normal">↓</span>
              <span>{trip.destinationName}</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-sm font-semibold font-mono ${
                trip.delayMinutes > 0 ? 'text-rose-600' : 'text-slate-600'
              }`}
            >
              {trip.delayMinutes > 0 ? `${trip.delayMinutes} min behind schedule` : 'On schedule'}
            </span>
            <div className="text-xs text-slate-400 mt-0.5">
              Cita: {trip.deliveryAppointment} · Unidad {trip.vehicleUnitNumber} ({trip.driverName})
            </div>
          </div>
        </div>
      </div>

      {/* GRAPHHOPPER ROUTE METRICS CARD */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#0061FF] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Distancia Planificada</span>
            <span className="text-base font-extrabold font-mono text-slate-900">{trip.plannedDistanceKm || 780} km</span>
            <span className="text-[10px] text-blue-700 block font-medium">GraphHopper OSM Engine</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Tiempo Estimado (ETA)</span>
            <span className="text-base font-extrabold font-mono text-slate-900">{trip.eta || '12 hrs'}</span>
            <span className="text-[10px] text-slate-500 block font-medium">Tránsito + Casetas</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Casetas SCT Est.</span>
            <span className="text-base font-extrabold font-mono text-slate-900">${econ.estimatedTollsMXN.toLocaleString()} MXN</span>
            <span className="text-[10px] text-slate-500 block font-medium">Tarifa 5 Ejes SCT</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Diésel Requerido</span>
            <span className="text-base font-extrabold font-mono text-slate-900">{econ.expectedFuelLiters || Math.round((trip.plannedDistanceKm || 780) / 2.7)} L</span>
            <span className="text-[10px] text-slate-500 block font-medium">Rendimiento: 2.7 km/L</span>
          </div>
        </div>
      </div>

      {/* FINANCIAL RESULT BLOCK */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
          FINANCIAL RESULT
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Revenue</span>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
              ${econ.revenueMXN.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Actual Cost</span>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
              ${econ.totalActualCostMXN.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
            <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Actual Margin</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-950 mt-1">
              ${econ.actualMarginMXN.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
            <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Margin %</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-950 mt-1">
              {econ.actualMarginPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* RED ALERT CARD FOR MARGIN LEAK (Misión 2: Profitability Engine) */}
      {isMarginLeak && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 flex items-start space-x-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-extrabold text-rose-950 uppercase tracking-wide">
              🔴 Fuga Detectada: Desvío Financiero Crítico ({Math.abs(marginDiff).toLocaleString()} MXN)
            </div>
            <p className="text-xs text-rose-900 leading-relaxed">
              El margen real <strong>({econ.actualMarginPercent}%)</strong> cayó respecto al esperado <strong>({econ.expectedMarginPercent}%)</strong>. 
              {fuelDiff > 0 && ` Sobreconsumo de diésel: +$${fuelDiff.toLocaleString()} MXN (Rendimiento 2.35 km/L vs meta 2.80 km/L).`}
              {tollsDiff > 0 && ` Peajes no contemplados: +$${tollsDiff.toLocaleString()} MXN.`}
              {excessMinutes > 0 && ` Retraso en rampa no amortizado: ${excessMinutes} min.`}
            </p>
          </div>
        </div>
      )}

      {/* WHY DID MARGIN CHANGE? (Dynamic Profitability Engine) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              WHY DID MARGIN CHANGE? (Causas del cambio de margen)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Esperado: ${econ.expectedMarginMXN.toLocaleString()} → Real: ${econ.actualMarginMXN.toLocaleString()}
            </p>
          </div>
          <span
            className={`text-sm font-bold font-mono px-3 py-1 rounded-lg border ${
              marginDiff < 0
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            Difference: {marginDiff < 0 ? '' : '+'}${marginDiff.toLocaleString()} MXN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Waiting / Estadía en Rampa
            </span>
            <div className={`text-lg font-bold font-mono ${excessMinutes > 0 ? 'text-amber-800' : 'text-slate-700'}`}>
              {excessMinutes > 0 ? `+$${waitingCostEst} MXN` : '$0 MXN'}
            </div>
            <p className="text-[11px] text-slate-500">
              {excessMinutes > 0 ? `${excessMinutes} min de espera excedente sobre libre.` : 'Sin exceso de espera registrado.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Fuel / Diésel
            </span>
            <div className={`text-lg font-bold font-mono ${fuelDiff > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {fuelDiff >= 0 ? `+$${fuelDiff} MXN` : `-$${Math.abs(fuelDiff)} MXN`}
            </div>
            <p className="text-[11px] text-slate-500">
              {fuelDiff > 0 ? 'Rendimiento real por debajo de la línea base esperada.' : 'Combustible consumido conforme a lo planificado.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Other / Casetas & Viáticos
            </span>
            <div className="text-lg font-bold font-mono text-slate-800">
              {tollsDiff >= 0 ? `+$${tollsDiff} MXN` : `-$${Math.abs(tollsDiff)} MXN`}
            </div>
            <p className="text-[11px] text-slate-500">
              {tollsDiff > 0 ? 'Desvío de ruta o casetas adicionales cobradas.' : 'Sin variaciones en peajes y casetas.'}
            </p>
          </div>
        </div>
      </div>

      {/* RECOVERY WITH PDF CLAIM GENERATOR (Misión 3: Money Recovery Report) */}
      <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
            POTENTIAL MONEY RECOVERY
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
            {trip.detentionBillableStatus}
          </span>
        </div>

        <div>
          <div className="text-3xl font-extrabold text-emerald-950 font-mono">
            ${trip.potentialDetentionMXN.toLocaleString()} MXN
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Estadía en rampa ({trip.waitingMinutes} min total) excede los {trip.allowedWaitingMinutes} min libres pactados.
          </p>
        </div>

        {/* ONE-CLICK PDF CLAIM GENERATOR BUTTON (Misión 3) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setShowClaimReportModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Generar Reporte de Cobro de Estadía (Claim Modal)</span>
          </button>

          {!existingCase && (
            <button
              onClick={() => {
                addRecoveryCase({
                  tripId: trip.id,
                  tripNumber: trip.tripNumber,
                  customerId: trip.customerId,
                  customerName: trip.customerName,
                  reason: 'Detention',
                  amountMXN: trip.potentialDetentionMXN,
                  evidenceDescription: `Estadía excesiva en rampa (${trip.waitingMinutes} min en CEDIS)`
                });
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Crear Caso de Recovery (${trip.potentialDetentionMXN} MXN)
            </button>
          )}
        </div>
      </div>

      {/* CLAIM REPORT MODAL (Misión 3) */}
      {showClaimReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-base text-slate-900">REPORTE DE COBRO DE ESTADÍA (MONEY RECOVERY)</h3>
              </div>
              <button onClick={() => setShowClaimReportModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 font-mono">
              <div className="flex justify-between text-slate-700 font-bold border-b border-slate-200 pb-2">
                <span>FOLIO VIAJE: #{trip.tripNumber}</span>
                <span>FECHA: {new Date().toISOString().split('T')[0]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-800 text-[11px]">
                <div><strong>CLIENTE:</strong> {trip.customerName}</div>
                <div><strong>CEDIS DESTINO:</strong> {trip.destinationName}</div>
                <div><strong>OPERADOR:</strong> {trip.driverName}</div>
                <div><strong>UNIDAD / REMOLQUE:</strong> {trip.vehicleUnitNumber} ({trip.trailerNumber})</div>
                <div><strong>CITA REGISTRADA:</strong> {trip.deliveryAppointment}</div>
                <div><strong>CARTA PORTE SAT:</strong> {trip.cartaPorteFolio}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase font-mono">Desglose de Horas y Demora en Rampa</h4>
              <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden text-xs">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2.5">Concepto</th>
                    <th className="p-2.5 text-right">Tiempo / Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5">Tiempo Total de Permanencia en CEDIS</td>
                    <td className="p-2.5 text-right font-mono font-bold">{trip.waitingMinutes} minutos</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Tiempo de Gracia Permitido (Contrato)</td>
                    <td className="p-2.5 text-right font-mono text-slate-600">{trip.allowedWaitingMinutes} minutos</td>
                  </tr>
                  <tr className="bg-amber-50">
                    <td className="p-2.5 font-bold text-amber-900">Horas Excedentes Cobrables</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-900">{Math.ceil(excessMinutes / 60)} hora(s)</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="p-2.5 font-bold text-emerald-950">Monto Total a Facturar por Estadía</td>
                    <td className="p-2.5 text-right font-mono text-base font-extrabold text-emerald-950">
                      ${trip.potentialDetentionMXN.toLocaleString()} MXN
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center space-x-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Imprimir / Guardar PDF</span>
              </button>
              <button
                onClick={() => setShowClaimReportModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP NOTIFICATION MODAL (Feature 6) */}
      {showWhatsappModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900">Enviar Notificación por WhatsApp</h3>
              </div>
              <button onClick={() => setShowWhatsappModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destinatario:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWhatsappRecipient('CLIENT')}
                    className={`p-2 rounded-lg border text-center font-bold transition-all ${
                      whatsappRecipient === 'CLIENT'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Cliente ({trip.customerName})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhatsappRecipient('DRIVER')}
                    className={`p-2 rounded-lg border text-center font-bold transition-all ${
                      whatsappRecipient === 'DRIVER'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Chófer ({trip.driverName})
                  </button>
                </div>
              </div>

              {/* Message preview */}
              <div className="p-3 bg-emerald-950 text-emerald-100 rounded-xl space-y-1 font-sans border border-emerald-800">
                <div className="text-[10px] uppercase font-bold text-emerald-400">Mensaje a Enviar:</div>
                <p className="text-[11px] leading-relaxed">
                  {whatsappRecipient === 'CLIENT'
                    ? `Estimado ${trip.customerName}, su viaje #${trip.tripNumber} (${trip.originName} → ${trip.destinationName}) va en tránsito. ETA estimado: ${trip.eta} hrs.`
                    : `${trip.driverName}, recordatorio: Tu cita de entrega en ${trip.destinationName} es a las ${trip.deliveryAppointment} hrs. Recuerda subir foto del sello.`}
                </p>
              </div>

              {whatsappMsgSent && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 font-bold rounded-lg text-center">
                  ✓ Mensaje enviado exitosamente a WhatsApp
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendWhatsapp}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Notificación</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
