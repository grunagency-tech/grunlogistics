import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight } from 'lucide-react';

export const AnomaliesView: React.FC = () => {
  const { openDecisionDetail } = useApp();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
      {/* Headline (Exact Prompt Directive) */}
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          3 things look unusual.
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Statistical deviations requiring review.
        </p>
      </div>

      {/* Clean Anomalies List */}
      <div className="space-y-3">
        {/* Item 1 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-900 text-sm">Vehicle 184</div>
            <p className="text-xs text-slate-500">
              Fuel consumption is 17% above normal baseline.
            </p>
          </div>

          <button
            onClick={() => openDecisionDetail('D-5831')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all"
          >
            Review
          </button>
        </div>

        {/* Item 2 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-900 text-sm">CEDIS Norte</div>
            <p className="text-xs text-slate-500">
              Loading time is 41% above normal (72 min current vs 38 min avg).
            </p>
          </div>

          <button
            onClick={() => openDecisionDetail('D-5877')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all"
          >
            Review
          </button>
        </div>

        {/* Item 3 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-900 text-sm">Route MX-04</div>
            <p className="text-xs text-slate-500">
              Travel time is 34% above normal due to Matehuala congestion.
            </p>
          </div>

          <button
            onClick={() => openDecisionDetail('D-5844')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
};
