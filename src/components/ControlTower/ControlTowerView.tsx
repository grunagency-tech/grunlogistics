import React from 'react';
import { useApp } from '../../context/AppContext';
import { DecisionsRequiringAttention } from './DecisionsRequiringAttention';
import { InteractiveMap } from './InteractiveMap';
import { ChevronRight } from 'lucide-react';

export const ControlTowerView: React.FC = () => {
  const { trips, riskFilter, setRiskFilter, openDecisionDetail, searchQuery } = useApp();

  const filteredTrips = trips.filter((t) => {
    const matchesFilter = riskFilter === 'ALL' || t.riskLevel === riskFilter;
    const matchesSearch =
      !searchQuery ||
      t.tripNumber.includes(searchQuery) ||
      t.vehicleUnitNumber.includes(searchQuery) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* Greeting & Executive Headline */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Good morning, Carlos.
          </h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            5 decisions need your attention.
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Operations are stable across 31 active trips.
          </p>
        </div>

        {/* Clean Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-200/60 p-1 rounded-lg text-xs">
          <button
            onClick={() => setRiskFilter('ALL')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              riskFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All trips ({trips.length})
          </button>
          <button
            onClick={() => setRiskFilter('RED')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              riskFilter === 'RED'
                ? 'bg-white text-rose-600 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Critical ({trips.filter((t) => t.riskLevel === 'RED').length})
          </button>
          <button
            onClick={() => setRiskFilter('YELLOW')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              riskFilter === 'YELLOW'
                ? 'bg-white text-amber-600 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-amber-600'
            }`}
          >
            Attention ({trips.filter((t) => t.riskLevel === 'YELLOW').length})
          </button>
        </div>
      </div>

      {/* TODAY'S DECISIONS (Inbox / Linear list style) */}
      <DecisionsRequiringAttention />

      {/* MAP SECTION (~35-40% height, clean light map) */}
      <InteractiveMap />

      {/* ACTIVE TRIPS TABLE (Clean scannable list) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span className="font-semibold uppercase tracking-wider text-slate-500">
            Active Trips ({filteredTrips.length})
          </span>
          <span>Click trip for operational details</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold text-[11px]">
                <th className="py-2.5 px-4">Trip</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Vehicle / Driver</th>
                <th className="py-2.5 px-4">Route</th>
                <th className="py-2.5 px-4">ETA</th>
                <th className="py-2.5 px-4">Risk</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTrips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">#{t.tripNumber}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{t.customerName}</td>
                  <td className="py-3 px-4 text-slate-600">Unit {t.vehicleUnitNumber} ({t.driverName})</td>
                  <td className="py-3 px-4 text-slate-500">{t.originCedis} → {t.destinationCedis}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{t.estimatedArrival}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        t.riskLevel === 'RED'
                          ? 'bg-rose-50 text-rose-700'
                          : t.riskLevel === 'YELLOW'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {t.riskScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {t.hasPendingDecision && t.decisionId ? (
                      <button
                        onClick={() => openDecisionDetail(t.decisionId!)}
                        className="text-slate-900 hover:text-blue-600 font-medium inline-flex items-center space-x-0.5"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
