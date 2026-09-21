import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Play, Smartphone, Menu, X } from 'lucide-react';

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
    routingProviderType,
    toggleMobileMenu,
    isMobileMenuOpen
  } = useApp();

  const totalExceptions = exceptions.filter((e) => e.status === 'PENDING').length;

  return (
    <header className="h-14 border-b border-slate-200/70 bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 select-none font-sans">
      {/* Brand & Mobile Menu Toggle */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        {/* Hamburger Menu Button (Mobile) */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          onClick={() => setCurrentView('OVERVIEW')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs group-hover:bg-slate-800 transition-colors shrink-0 font-mono">
            GL
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
                GRUNLOGISTICS
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-slate-400 font-medium truncate">
              Trip Profitability & Operations Intelligence
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative hidden lg:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar viajes, unidades, clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 lg:w-64 bg-slate-50 hover:bg-slate-100/80 text-xs border border-slate-200/80 focus:border-slate-400 focus:bg-white focus:outline-none text-slate-800 pl-8 pr-3 py-1.5 rounded-lg placeholder-slate-400 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
        {/* Routing Mode Status Badge */}
        <div
          onClick={() => setCurrentView('SETTINGS')}
          className="hidden sm:flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
          title="Configurar proveedor de rutas"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="hidden md:inline font-mono">
            {routingProviderType === 'GOOGLE_ROUTES' ? 'GOOGLE ROUTES' : 'ROUTING DEMO MODE'}
          </span>
          <span className="md:hidden font-mono">DEMO MODE</span>
        </div>

        {/* Driver Mobile View Toggle */}
        <button
          onClick={() => setCurrentView('DRIVER_MOBILE')}
          className={`flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            currentView === 'DRIVER_MOBILE'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">App Operador</span>
        </button>

        {/* Demo Pitch Button */}
        <button
          onClick={run2MinDemo}
          className="flex items-center space-x-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span className="hidden xs:inline">Demo 2 min</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
            LM
          </div>
        </div>
      </div>
    </header>
  );
};
