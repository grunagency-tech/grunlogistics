import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Play, Smartphone, ShieldCheck, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    run2MinDemo,
    searchQuery,
    setSearchQuery,
    company,
    recoveryCases,
    exceptions,
    routingProviderType
  } = useApp();

  const totalExceptions = exceptions.filter((e) => e.status === 'PENDING').length;
  const potentialRecoverySum = recoveryCases.reduce((acc, c) => acc + c.amountMXN, 0);

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-between px-6 sticky top-0 z-30 select-none">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-6">
        <div
          onClick={() => setCurrentView('OVERVIEW')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-emerald-800 transition-colors">
            GL
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-slate-900 font-sans">
                GRUNLOGISTICS
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                SaaS B2B
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-normal">
              Trip Profitability & Operations Intelligence
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar viajes, unidades, clientes, cobros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 bg-slate-100/80 hover:bg-slate-100 text-xs border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none text-slate-800 pl-8 pr-3 py-1.5 rounded-lg placeholder-slate-400 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Routing Mode Status Badge */}
        <div
          onClick={() => setCurrentView('SETTINGS')}
          className="hidden lg:flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-medium px-2.5 py-1 rounded-md cursor-pointer transition-colors"
          title="Haz clic para configurar proveedor de rutas"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>
            {routingProviderType === 'GOOGLE_ROUTES' ? 'GOOGLE ROUTES' : 'ROUTING DEMO MODE'}
          </span>
        </div>

        {/* Status Summary */}
        <div className="hidden xl:flex items-center space-x-2 text-xs text-slate-500">
          <span>
            <strong className="text-slate-900 font-medium">{company.activeTripsCount}</strong> viajes
            activos
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-amber-600 font-medium">{totalExceptions} excepciones</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-medium">
            ${potentialRecoverySum.toLocaleString()} MXN recuperables
          </span>
        </div>

        {/* Driver Mobile View Toggle */}
        <button
          onClick={() => setCurrentView('DRIVER_MOBILE')}
          className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
            currentView === 'DRIVER_MOBILE'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>App Operador</span>
        </button>

        {/* Demo Pitch Button */}
        <button
          onClick={run2MinDemo}
          className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-all shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Demo 2 min</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            LM
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-medium text-slate-800 leading-tight">
              Logística Metropolitana
            </span>
            <span className="text-[10px] text-slate-400">Admin Flota</span>
          </div>
        </div>
      </div>
    </header>
  );
};
