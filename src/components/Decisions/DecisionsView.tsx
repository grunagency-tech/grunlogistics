import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight } from 'lucide-react';

export const DecisionsView: React.FC = () => {
  const { decisions, openDecisionDetail } = useApp();
  const [tab, setTab] = useState<'ALL' | 'CRITICAL' | 'ATTENTION' | 'RESOLVED'>('ALL');

  const filtered = decisions.filter((d) => {
    if (tab === 'CRITICAL') return d.riskLevel === 'RED' && d.status === 'PENDING';
    if (tab === 'ATTENTION') return d.riskLevel === 'YELLOW' && d.status === 'PENDING';
    if (tab === 'RESOLVED') return d.status === 'APPROVED' || d.status === 'REJECTED';
    return true;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            Decisions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Actions that may require your attention.
          </p>
        </div>

        {/* Clean Filter Pills (Prompt Directive) */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setTab('ALL')}
            className={`px-3 py-1 rounded-md transition-all ${
              tab === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({decisions.length})
          </button>
          <button
            onClick={() => setTab('CRITICAL')}
            className={`px-3 py-1 rounded-md transition-all ${
              tab === 'CRITICAL' ? 'bg-white text-rose-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Critical ({decisions.filter((d) => d.riskLevel === 'RED' && d.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setTab('ATTENTION')}
            className={`px-3 py-1 rounded-md transition-all ${
              tab === 'ATTENTION' ? 'bg-white text-amber-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-amber-600'
            }`}
          >
            Attention ({decisions.filter((d) => d.riskLevel === 'YELLOW' && d.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setTab('RESOLVED')}
            className={`px-3 py-1 rounded-md transition-all ${
              tab === 'RESOLVED' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resolved ({decisions.filter((d) => d.status === 'APPROVED').length})
          </button>
        </div>
      </div>

      {/* Decisions Inbox List (Exact Prompt Directive) */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-medium text-[11px]">
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Decision</th>
              <th className="py-3 px-4">Impact</th>
              <th className="py-3 px-4">Recommendation</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((dec) => {
              const recText =
                dec.jevResult.recommendedAction === 'reassign_vehicle'
                  ? 'Reassign vehicle 201'
                  : dec.jevResult.recommendedAction === 'change_route'
                  ? 'Change route'
                  : dec.jevResult.recommendedAction === 'reschedule_delivery'
                  ? 'Reschedule delivery'
                  : 'Escalate to human';

              return (
                <tr
                  key={dec.id}
                  onClick={() => openDecisionDetail(dec.id)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-medium">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${
                        dec.riskLevel === 'RED'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dec.riskLevel === 'RED' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                      <span>{dec.riskLevel === 'RED' ? 'Critical' : 'Attention'}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    Trip #{dec.tripNumber} · {dec.customerName}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    ${dec.potentialFinancialImpactMXN.toLocaleString('es-MX')}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {recText}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {dec.status === 'APPROVED' ? (
                      <span className="text-emerald-600 font-medium">Approved</span>
                    ) : (
                      <span>Pending</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDecisionDetail(dec.id);
                      }}
                      className="text-slate-900 hover:text-blue-600 font-medium inline-flex items-center space-x-0.5"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
