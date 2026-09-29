import React from 'react';
import { useApp } from '../context/AppContext';
import { ExceptionItem } from '../types';
import { AlertTriangle, ChevronRight, ArrowRight, ShieldAlert } from 'lucide-react';

export const ExceptionsView: React.FC = () => {
  const { exceptions, openTripDetail, setCurrentView } = useApp();

  // Group exceptions by economic impact (Requirement 10)
  const highImpact = exceptions.filter((e) => e.financialImpactMXN >= 3000);
  const mediumImpact = exceptions.filter((e) => e.financialImpactMXN >= 800 && e.financialImpactMXN < 3000);
  const lowImpact = exceptions.filter((e) => e.financialImpactMXN < 800);

  const renderGroup = (title: string, items: ExceptionItem[], severityColor: string) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${severityColor}`} />
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
            {title} ({items.length})
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100 shadow-xs">
          {items.map((exc) => (
            <div
              key={exc.id}
              className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                exc.type === 'FUEL_THEFT_ALERT'
                  ? 'bg-rose-50/40 hover:bg-rose-50/70 border-l-4 border-l-rose-600'
                  : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{exc.title}</span>
                  {exc.type === 'FUEL_THEFT_ALERT' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-600" />
                      Robo Hormiga / Extracción
                    </span>
                  )}
                  {exc.type === 'CARTA_PORTE_MISSING' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      SAT Carta Porte 3.1
                    </span>
                  )}
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">{exc.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{exc.description}</p>
                <div className="text-[11px] text-slate-500 pt-1">
                  <strong>Acción: </strong>{exc.actionRecommended}
                </div>
              </div>

              <div className="flex items-center space-x-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Impacto Est.</span>
                  <span className="text-base font-extrabold font-mono text-slate-900">
                    ${exc.financialImpactMXN.toLocaleString()} MXN
                  </span>
                </div>

                {exc.tripId ? (
                  <button
                    onClick={() => openTripDetail(exc.tripId!)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Revisar
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentView('FLEET')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Ver Flota
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans text-slate-900">
      {/* Editorial Header (Requirement 10) */}
      <div className="space-y-3 pb-6 border-b border-slate-200/60">
        <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-widest block">
          EXCEPTIONS INBOX
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Excepciones Priorizadas
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Bandeja de desviaciones operacionales clasificadas por impacto económico y urgencia
        </p>
      </div>

      {/* Prioritized Groups (Requirement 10) */}
      <div className="space-y-8">
        {renderGroup('HIGH IMPACT', highImpact, 'bg-rose-600')}
        {renderGroup('MEDIUM IMPACT', mediumImpact, 'bg-amber-500')}
        {renderGroup('LOW IMPACT', lowImpact, 'bg-slate-400')}
      </div>
    </div>
  );
};
