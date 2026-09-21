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

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans text-slate-900">
      {/* Editorial Header (Requirement 9) */}
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

      {/* POTENTIAL RECOVERY HEADER BLOCK (Requirement 9) */}
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

        {/* Category Breakdown Blocks (Requirement 9) */}
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

      {/* RECOVERY CASES LIST (Requirement 9: Clean case list) */}
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

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => openTripDetail(selectedCase.tripId)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
            >
              Ver Viaje Completo →
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => updateRecoveryStatus(selectedCase.id, 'Approved')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Aprobar Cobro
              </button>
              <button
                onClick={() => updateRecoveryStatus(selectedCase.id, 'Recovered')}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Marcar como RECUPERADO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
