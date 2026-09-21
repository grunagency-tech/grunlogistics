import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecoveryCase, RecoveryStatus } from '../types';
import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  User,
  ExternalLink,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';

export const MoneyRecoveryView: React.FC = () => {
  const { recoveryCases, updateRecoveryStatus, openTripDetail } = useApp();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const selectedCase = recoveryCases.find((c) => c.id === selectedCaseId) || recoveryCases[0];

  const totalPotential = recoveryCases.reduce((acc, c) => acc + c.amountMXN, 0);
  const totalRecovered = recoveryCases
    .filter((c) => c.status === 'Recovered')
    .reduce((acc, c) => acc + c.amountMXN, 0);
  const pendingCount = recoveryCases.filter(
    (c) => c.status === 'Needs review' || c.status === 'Detected'
  ).length;

  const filteredCases = recoveryCases.filter(
    (c) => statusFilter === 'ALL' || c.status === statusFilter
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Money Recovery (Recuperación de Dinero & Estadías)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Detección, evidencia y reclamación de dinero potencialmente recuperable por cobros no facturados
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
          <div>
            <span className="text-[10px] text-emerald-800 font-bold uppercase block">
              TOTAL IDENTIFICADO
            </span>
            <span className="text-lg font-bold font-mono text-emerald-900">
              ${totalPotential.toLocaleString()} MXN
            </span>
          </div>
          <div className="h-6 border-r border-emerald-200" />
          <div>
            <span className="text-[10px] text-emerald-800 font-bold uppercase block">
              RECUPERADO REAL
            </span>
            <span className="text-lg font-bold font-mono text-emerald-700">
              ${totalRecovered.toLocaleString()} MXN
            </span>
          </div>
        </div>
      </div>

      {/* Workflow Explanation Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm font-sans">Flujo de Trabajo de Recovery (Recovery Workflow)</span>
          </div>
          <span className="text-xs text-slate-400">
            Principales causas: Detention, Extra Mileage, Waiting, Extra Stop
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-medium">
          <div className="p-2 rounded bg-slate-800 border border-slate-700">1. Detected</div>
          <div className="p-2 rounded bg-slate-800 border border-slate-700">2. Needs review</div>
          <div className="p-2 rounded bg-slate-800 border border-slate-700">3. Approved</div>
          <div className="p-2 rounded bg-slate-800 border border-slate-700">4. Submitted</div>
          <div className="p-2 rounded bg-emerald-800 text-emerald-100 border border-emerald-600 font-bold">
            5. Recovered
          </div>
          <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-400">
            6. Rejected
          </div>
          <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-400">
            7. Closed
          </div>
        </div>
      </div>

      {/* Main Grid: Cases Table + Selected Case Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              Casos de Reclamación ({filteredCases.length})
            </h2>

            {/* Filter by status */}
            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
              >
                <option value="ALL">Todos los estatus</option>
                <option value="Detected">Detected</option>
                <option value="Needs review">Needs review</option>
                <option value="Approved">Approved</option>
                <option value="Submitted">Submitted</option>
                <option value="Recovered">Recovered</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredCases.map((c) => {
              const isSelected = c.id === (selectedCaseId || recoveryCases[0]?.id);
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/30'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs font-mono">{c.caseCode}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="font-semibold text-xs text-slate-800">Viaje #{c.tripNumber}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'Recovered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'Needs review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{c.customerName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Motivo: {c.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold font-mono text-emerald-800">
                        ${c.amountMXN.toLocaleString()} MXN
                      </div>
                      <div className="text-[10px] text-slate-400">{c.createdAt}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Case Detail & Actions (1 col) */}
        {selectedCase && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs h-fit sticky top-20">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                RECOVERY CASE DETAIL
              </span>
              <h2 className="text-base font-bold text-slate-900 font-sans mt-0.5">
                {selectedCase.caseCode} - Viaje #{selectedCase.tripNumber}
              </h2>
              <p className="text-xs text-slate-500">{selectedCase.customerName}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  MONTO RECLAMABLE
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-900 mt-0.5">
                  ${selectedCase.amountMXN.toLocaleString()} MXN
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Motivo: {selectedCase.reason}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900">Evidencia Registrada:</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {selectedCase.evidenceDescription}
                </p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  Responsable: {selectedCase.owner} · Creado: {selectedCase.createdAt}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700 block">Cambiar Estatus del Caso:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateRecoveryStatus(selectedCase.id, 'Approved')}
                    className="py-1.5 px-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded text-center transition-colors"
                  >
                    Aprobar Cobro
                  </button>
                  <button
                    onClick={() => updateRecoveryStatus(selectedCase.id, 'Submitted')}
                    className="py-1.5 px-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded text-center transition-colors"
                  >
                    Enviar a Cliente
                  </button>
                  <button
                    onClick={() => updateRecoveryStatus(selectedCase.id, 'Recovered')}
                    className="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-center transition-colors col-span-2 shadow-xs"
                  >
                    Marcar como RECUPERADO ($)
                  </button>
                  <button
                    onClick={() => updateRecoveryStatus(selectedCase.id, 'Rejected')}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-center transition-colors col-span-2"
                  >
                    No Cobrable / Rechazado
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openTripDetail(selectedCase.tripId)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-center transition-colors"
                >
                  Ver Viaje Asociado #{selectedCase.tripNumber}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
