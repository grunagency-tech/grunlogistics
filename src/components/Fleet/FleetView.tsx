import React from 'react';
import { useApp } from '../../context/AppContext';

export const FleetView: React.FC = () => {
  const { vehicles } = useApp();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 select-none">
      <div className="border-b border-slate-200/80 pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            Fleet
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            42 active operational units.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-medium text-[11px]">
              <th className="py-3 px-4">Unit</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Driver</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Fuel Efficiency</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {vehicles.slice(0, 15).map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">Unit {v.unitNumber}</td>
                <td className="py-3.5 px-4 text-slate-500">{v.type}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{v.driverName || 'Unassigned'}</td>
                <td className="py-3.5 px-4 text-slate-500 truncate max-w-[200px]">{v.locationName}</td>
                <td className="py-3.5 px-4 font-medium text-slate-900">{v.fuelEfficiencyKmL} km/L ({v.fuelLevelPercent}%)</td>
                <td className="py-3.5 px-4 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                      v.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
