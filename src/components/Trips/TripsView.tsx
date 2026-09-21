import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight } from 'lucide-react';

export const TripsView: React.FC = () => {
  const { trips, openDecisionDetail } = useApp();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 select-none">
      <div className="border-b border-slate-200/80 pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            Trips
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active and scheduled trips across network corridors.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-medium text-[11px]">
              <th className="py-3 px-4">Trip</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Vehicle / Driver</th>
              <th className="py-3 px-4">Route</th>
              <th className="py-3 px-4">ETA</th>
              <th className="py-3 px-4">Delay</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {trips.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">#{t.tripNumber}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{t.customerName}</td>
                <td className="py-3.5 px-4 text-slate-600">Unit {t.vehicleUnitNumber} ({t.driverName})</td>
                <td className="py-3.5 px-4 text-slate-500">{t.originCedis} → {t.destinationCedis}</td>
                <td className="py-3.5 px-4 font-medium text-slate-900">{t.estimatedArrival}</td>
                <td className="py-3.5 px-4 font-medium">
                  {t.delayMinutes > 0 ? (
                    <span className="text-rose-600">+{t.delayMinutes} min</span>
                  ) : (
                    <span className="text-emerald-600">On time</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
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
  );
};
