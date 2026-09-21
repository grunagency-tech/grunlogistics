import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Play, Check } from 'lucide-react';

export const SimulatorView: React.FC = () => {
  const [selectedPill, setSelectedPill] = useState<string>('Vehicle unavailable');
  const [hasSimulated, setHasSimulated] = useState<boolean>(true);

  const pills = [
    'Vehicle unavailable',
    'Route blocked',
    'Driver unavailable',
    '30 min delay',
    'Fuel cost +10%'
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
      {/* Title */}
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Simulator
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Evaluate what-if scenarios and operational interventions.
        </p>
      </div>

      {/* "What would you like to change?" Section (Exact Prompt Directive) */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          What would you like to change?
        </h2>

        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => {
            const isSelected = pill === selectedPill;

            return (
              <button
                key={pill}
                onClick={() => {
                  setSelectedPill(pill);
                  setHasSimulated(true);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-300'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>

      {/* CURRENT VS SIMULATED SIDE-BY-SIDE (Exact Prompt Directive) */}
      {hasSimulated && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CURRENT */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                CURRENT
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-rose-600">87% risk</div>
                <div className="text-xs text-slate-500">$4,850 expected cost</div>
              </div>
            </div>

            {/* SIMULATED */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                SIMULATED
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-emerald-600">19% risk</div>
                <div className="text-xs text-slate-500">$620 expected cost</div>
              </div>
            </div>
          </div>

          {/* SAVINGS HIGHLIGHT */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-400 uppercase font-medium block">
                Potential Savings
              </span>
              <span className="text-xl font-bold text-emerald-400">$4,230 MXN</span>
            </div>

            <button
              onClick={() => alert('Simulated recommendation applied to operational queue.')}
              className="bg-white hover:bg-slate-100 text-slate-900 font-medium text-xs px-4 py-2 rounded-xl transition-all"
            >
              Apply recommendation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
