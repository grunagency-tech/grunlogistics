import React from 'react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { isJevLive, setIsJevLive, telemetry } = useApp();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          System preferences and recommendation provider options.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recommendation Provider
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-slate-300">
            <input
              type="radio"
              name="provider"
              checked={!isJevLive}
              onChange={() => setIsJevLive(false)}
              className="accent-slate-900"
            />
            <div>
              <span className="font-semibold text-slate-900 block">Simulated Provider (MockDecisionProvider)</span>
              <span className="text-slate-400">Deterministic probabilistic simulation for testing.</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-slate-300">
            <input
              type="radio"
              name="provider"
              checked={isJevLive}
              onChange={() => setIsJevLive(true)}
              className="accent-slate-900"
            />
            <div>
              <span className="font-semibold text-slate-900 block">Live JEV Provider (TypeSafe JEV Live)</span>
              <span className="text-slate-400">Connect to live JEV Decision API / MCP server.</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
