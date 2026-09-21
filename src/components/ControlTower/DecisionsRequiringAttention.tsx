import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight } from 'lucide-react';

export const DecisionsRequiringAttention: React.FC = () => {
  const { decisions, openDecisionDetail, language } = useApp();

  const pendingDecisions = decisions.filter((d) => d.status === 'PENDING');

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
          {language === 'ES' ? "DECISIONES DE HOY" : "Today's Decisions"} ({pendingDecisions.length})
        </h2>
        <span className="text-xs text-slate-400">
          {language === 'ES' ? 'Priorizado por exposición financiera ($ MXN)' : 'Prioritized by financial exposure ($ MXN)'}
        </span>
      </div>

      {/* Clean Linear / Stripe / Apple Inbox Style List */}
      <div className="bg-white border border-slate-200/80 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
        {pendingDecisions.map((dec) => {
          const isCritical = dec.riskLevel === 'RED';
          const recActionText =
            dec.jevResult.recommendedAction === 'tractor_swap_secure_yard'
              ? (language === 'ES' ? 'Cambio de tractor (Caseta Tepotzotlán)' : 'Tractor swap (Tepotzotlán Toll)')
              : dec.jevResult.recommendedAction === 'safe_toll_reroute'
              ? (language === 'ES' ? 'Desvío por cuota segura' : 'Safe toll reroute')
              : dec.jevResult.recommendedAction === 'cedis_priority_reschedule'
              ? (language === 'ES' ? 'Reprogramación Cita CEDIS' : 'CEDIS Priority Reschedule')
              : (language === 'ES' ? 'Mantener plan actual' : 'Keep current plan');

          return (
            <div
              key={dec.id}
              onClick={() => openDecisionDetail(dec.id)}
              className="p-4 hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
            >
              {/* Left Column */}
              <div className="flex items-start space-x-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                    isCritical ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                ></span>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      Trip #{dec.tripNumber}
                    </span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs font-medium text-slate-700">
                      {dec.title.includes('Falla') ? (language === 'ES' ? 'Falla de tractor y riesgo cita' : 'Tractor fault & appointment risk') : (language === 'ES' ? 'Bloqueo carretero' : 'Highway disruption')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    {dec.situation.includes('Vallejo') ? 'CEDIS Norte' : 'CEDIS MTY'} · Tractor {dec.tripNumber === '5831' ? '184' : '104'}
                  </div>
                </div>
              </div>

              {/* Right Column: Financial Exposure, Recommended Action & Action Button */}
              <div className="flex items-center space-x-6 sm:justify-end text-xs pl-5 sm:pl-0">
                <div className="text-right hidden md:block">
                  <span className="text-slate-400 block text-[11px]">{language === 'ES' ? 'Impacto estimado' : 'Expected impact'}</span>
                  <span className="font-medium text-slate-900">
                    ${dec.potentialFinancialImpactMXN.toLocaleString('es-MX')} MXN
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">{language === 'ES' ? 'Recomendado' : 'Recommended'}</span>
                  <span className="font-medium text-slate-900">
                    {recActionText}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDecisionDetail(dec.id);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-all shadow-sm shrink-0 flex items-center space-x-1"
                >
                  <span>{language === 'ES' ? 'Revisar' : 'Review'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}

        {pendingDecisions.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            {language === 'ES' ? 'No hay decisiones pendientes por atender.' : 'No pending decisions requiring attention right now.'}
          </div>
        )}
      </div>
    </div>
  );
};
