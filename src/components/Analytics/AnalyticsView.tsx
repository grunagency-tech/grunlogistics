import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { setCurrentView, openDecisionDetail } = useApp();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
      {/* Title */}
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Analytics &amp; Insights
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Actionable operational intelligence.
        </p>
      </div>

      {/* Question-Driven Insights (Exact Prompt Directive) */}
      <div className="space-y-4">
        {/* Insight 1 */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Where are we losing time?
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900 text-sm">CEDIS Norte</div>
              <p className="text-xs text-slate-500">
                +34 min average wait · $18,400 estimated monthly impact
              </p>
            </div>

            <button
              onClick={() => setCurrentView('ANOMALIES')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shrink-0 self-start sm:self-auto"
            >
              Investigate
            </button>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Which routes are underperforming?
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900 text-sm">Route MX-04 (Autopista 57D)</div>
              <p className="text-xs text-slate-500">
                +27% average delay across 14 weekly trips
              </p>
            </div>

            <button
              onClick={() => setCurrentView('TRIPS')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shrink-0 self-start sm:self-auto"
            >
              View route
            </button>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Which vehicles are abnormal?
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900 text-sm">Vehicle 184</div>
              <p className="text-xs text-slate-500">
                +17% fuel consumption vs baseline
              </p>
            </div>

            <button
              onClick={() => openDecisionDetail('D-5831')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shrink-0 self-start sm:self-auto"
            >
              Inspect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
