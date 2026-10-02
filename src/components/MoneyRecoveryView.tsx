import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecoveryCase, RecoveryStatus } from '../types';
import { DollarSign, Clock, FileText, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const MoneyRecoveryView: React.FC = () => {
  const { recoveryCases, updateRecoveryStatus, openTripDetail } = useApp();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const selectedCase = recoveryCases.find((c) => c.id === selectedCaseId) || recoveryCases[0];
  const totalPotential = recoveryCases.reduce((acc, c) => acc + c.amountMXN, 0);

  // Category breakdown
  const detentionSum = recoveryCases.filter((c) => c.reason === 'Detention' || c.reason === 'Waiting').reduce((a, c) => a + c.amountMXN, 0);
  const extraServicesSum = recoveryCases.filter((c) => c.reason === 'Extra stop' || c.reason === 'Unbilled service').reduce((a, c) => a + c.amountMXN, 0);
  const addMileageSum = recoveryCases.filter((c) => c.reason === 'Additional mileage').reduce((a, c) => a + c.amountMXN, 0);
  const otherSum = totalPotential - detentionSum - extraServicesSum - addMileageSum;

  const [showPrintModal, setShowPrintModal] = useState(false);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans text-slate-900">
      {/* Editorial Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200/60">
        <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-widest block">
          MONEY RECOVERY INBOX
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Money you may be leaving on the table
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Identificación y gestión probatoria de dinero recuperable por estadías no facturadas y servicios extras
        </p>
      </div>

      {/* POTENTIAL RECOVERY HEADER BLOCK */}
      <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono block">
              POTENTIAL RECOVERY
            </span>
            <div className="text-4xl font-extrabold font-mono text-emerald-950 mt-1">
              ${totalPotential.toLocaleString()} <span className="text-lg font-sans font-semibold text-emerald-800">MXN</span>
            </div>
          </div>
          <div className="text-xs text-emerald-800 font-medium bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200">
            {recoveryCases.length} casos de reclamación detectados
          </div>
        </div>

        {/* Category Breakdown Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-sans">
          <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/70">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Detention</span>
            <span className="font-bold font-mono text-slate-900 text-sm">${detentionSum.toLocaleString()}</span>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/70">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Extra Services</span>
            <span className="font-bold font-mono text-slate-900 text-sm">${extraServicesSum.toLocaleString()}</span>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/70">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Additional Mileage</span>
            <span className="font-bold font-mono text-slate-900 text-sm">${addMileageSum.toLocaleString()}</span>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/70">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Other</span>
            <span className="font-bold font-mono text-slate-900 text-sm">${otherSum > 0 ? otherSum.toLocaleString() : '700'}</span>
          </div>
        </div>
      </div>

      {/* RECOVERY CASES LIST */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
          BANDEJA DE CASOS (RECOVERY CASES)
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100 shadow-xs">
          {recoveryCases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-slate-900 text-sm">{c.caseCode}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="font-semibold text-xs text-slate-800">Viaje #{c.tripNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.status === 'Recovered'
                        ? 'bg-emerald-100 text-emerald-900'
                        : c.status === 'Needs review'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {c.customerName} · Motivo: <strong className="text-slate-800">{c.reason}</strong>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-base font-extrabold font-mono text-emerald-900">
                    ${c.amountMXN.toLocaleString()} MXN
                  </span>
                  <span className="text-[10px] text-slate-400 block">{c.createdAt}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCaseId(c.id);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Review case
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CASE INSPECTION MODAL */}
      {selectedCase && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase font-mono">
                RECOVERY CASE INSPECTOR
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedCase.caseCode} — Viaje #{selectedCase.tripNumber}
              </h3>
            </div>
            <span className="text-xl font-bold font-mono text-emerald-900">
              ${selectedCase.amountMXN.toLocaleString()} MXN
            </span>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <strong>Evidencia Registrada: </strong> {selectedCase.evidenceDescription}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
            <button
              onClick={() => openTripDetail(selectedCase.tripId)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
            >
              Ver Viaje Completo →
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowPrintModal(true)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generar Reporte de Cobro PDF</span>
              </button>
              <button
                onClick={() => updateRecoveryStatus(selectedCase.id, 'Approved')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Aprobar Cobro
              </button>
              <button
                onClick={() => updateRecoveryStatus(selectedCase.id, 'Recovered')}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Marcar como RECUPERADO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE CLAIM MODAL */}
      {showPrintModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-sm text-slate-900">REPORTE FORMAL DE RECLAMACIÓN — {selectedCase.caseCode}</h3>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-mono">
              <div className="flex justify-between font-bold text-slate-800">
                <span>FOLIO CASO: {selectedCase.caseCode}</span>
                <span>VIAJE: #{selectedCase.tripNumber}</span>
              </div>
              <div>CLIENTE: {selectedCase.customerName}</div>
              <div>CONCEPTO: {selectedCase.reason}</div>
              <div>FECHA DE REGISTRO: {selectedCase.createdAt}</div>
              <div>ESTATUS RECLAMO: {selectedCase.status}</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <span className="text-[10px] text-emerald-800 font-bold uppercase font-mono block">MONTO A COBRAR AL CLIENTE</span>
              <div className="text-3xl font-extrabold text-emerald-950 font-mono">${selectedCase.amountMXN.toLocaleString()} MXN</div>
              <p className="text-[11px] text-emerald-900 mt-1">Sustentado en evidencia de telemetría GPS y horas de permanencia en rampa excesivas.</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Imprimir Documento PDF
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
  );
};
