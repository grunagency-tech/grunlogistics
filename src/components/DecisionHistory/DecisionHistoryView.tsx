import React from 'react';
import { useApp } from '../../context/AppContext';

export const DecisionHistoryView: React.FC = () => {
  const { history } = useApp();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 select-none">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          History
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audit log of approved recommendations and financial savings.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-medium text-[11px]">
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Trip</th>
              <th className="py-3 px-4">Recommendation</th>
              <th className="py-3 px-4">Approval</th>
              <th className="py-3 px-4">Estimated Savings</th>
              <th className="py-3 px-4 text-right">Realized Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 text-slate-400">{h.timestamp}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">#{h.tripNumber}</td>
                <td className="py-3.5 px-4 font-medium text-slate-900">{h.jevDecision}</td>
                <td className="py-3.5 px-4 font-medium text-emerald-600">Approved</td>
                <td className="py-3.5 px-4 font-medium text-slate-700">${h.estimatedSavingsMXN.toLocaleString('es-MX')} MXN</td>
                <td className="py-3.5 px-4 text-right font-bold text-emerald-600">${h.realizedSavingsMXN.toLocaleString('es-MX')} MXN</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
