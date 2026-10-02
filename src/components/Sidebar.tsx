import React, { useState } from 'react';
import { useApp, ViewType } from '../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  Truck,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Users,
  Navigation,
  Database,
  Settings,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  X,
  Folder,
  Warehouse,
  Cpu,
  Radio,
  MessageSquare
} from 'lucide-react';

interface NavGroup {
  title: string;
  items: {
    id: ViewType;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[];
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    recoveryCases,
    exceptions,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const pendingExceptionsCount = exceptions.filter((e) => e.status === 'PENDING').length;
  const activeRecoveryCount = recoveryCases.filter(
    (c) => c.status === 'Needs review' || c.status === 'Detected'
  ).length;

  const navGroups: NavGroup[] = [
    {
      title: 'OPERACIÓN',
      items: [
        { id: 'OVERVIEW', label: 'Inicio (Torre de Control)', icon: LayoutDashboard },
        { id: 'TRIPS', label: 'Viajes & Despacho (FleetOps)', icon: MapPin },
        { id: 'FLEET', label: 'Flota & Chóferes', icon: Truck }
      ]
    },
    {
      title: 'GRÜNTECH STACK',
      items: [
        { id: 'OPENBOXES_WMS', label: 'WMS OpenBoxes & Lotes', icon: Warehouse },
        { id: 'VROOM_VRP', label: 'VROOM VRP (Opt. C++20)', icon: Cpu },
        { id: 'TRACCAR_GPS', label: 'Traccar GPS & Telemetría', icon: Radio },
        { id: 'CHOFEX_WA', label: 'Chofex Copilot WhatsApp', icon: MessageSquare }
      ]
    },
    {
      title: 'FINANZAS Y COBRANZA',
      items: [
        { id: 'PROFITABILITY', label: 'Rentabilidad Financiera', icon: TrendingUp },
        { id: 'MONEY_RECOVERY', label: 'Cobranza & Estadías (PDF)', icon: DollarSign, badge: activeRecoveryCount }
      ]
    },
    {
      title: 'ANÁLISIS DE RUTA',
      items: [
        { id: 'CUSTOMERS', label: 'Clientes', icon: Users },
        { id: 'ROUTES', label: 'Rutas & Casetas (GraphHopper)', icon: Navigation },
        { id: 'EXCEPTIONS', label: 'Alertas de Riesgo', icon: AlertTriangle, badge: pendingExceptionsCount }
      ]
    },
    {
      title: 'SISTEMA',
      items: [
        { id: 'DOCUMENTS', label: '🗂️ Bóveda & Carta Porte', icon: Folder },
        { id: 'DATA', label: 'Arquitectura Stack GrünTech', icon: Database },
        { id: 'SETTINGS', label: 'Configuración', icon: Settings },
        { id: 'DRIVER_MOBILE', label: '📱 Modo App Chófer', icon: Smartphone }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-[#F9FAFB] border-r border-slate-200/70 flex flex-col justify-between select-none shrink-0 min-h-[calc(100vh-3.5rem)] py-5 px-3 transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-56'
        } ${
          isMobileMenuOpen ? 'translate-x-0 shadow-xl w-64' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between px-2 pb-2 border-b border-slate-200/60">
            <span className="font-bold text-xs text-slate-500 uppercase tracking-wider">Menú</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Collapse Toggle */}
          <div className="hidden md:flex justify-end px-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-md transition-colors"
              title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Groups */}
          <div className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    {group.title}
                  </div>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center ${
                        isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                      } py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#EDF5FF] text-[#0061FF] font-bold border border-[#0061FF]/30 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#0061FF]' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>
                      {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold font-mono ${
                            isActive
                              ? 'bg-[#0061FF] text-white'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs border-t border-slate-200/60 pt-3">
            <div className="font-semibold text-slate-800 truncate">Logística Metropolitana</div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">42 unidades · 31 activos</div>
          </div>
        )}
      </aside>
    </>
  );
};
