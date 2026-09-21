import React, { useState } from 'react';
import { Database, FileSpreadsheet, Check } from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Data Sources
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect operational datasets (CSV, Excel, JSON).
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 p-8 rounded-2xl text-center space-y-4 shadow-sm">
        <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
        <div>
          <span className="font-semibold text-slate-900 text-sm block">Drop files to import operational data</span>
          <span className="text-xs text-slate-400">Trips, vehicles, drivers, or telemetry feeds</span>
        </div>
        <button
          onClick={() => setUploaded(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all"
        >
          Select demo file (trips_metropolitana.csv)
        </button>

        {uploaded && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium flex items-center justify-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>42 records mapped automatically to UN Logistics operational state.</span>
          </div>
        )}
      </div>
    </div>
  );
};
