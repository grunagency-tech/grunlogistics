import React from 'react';
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
  Smartphone
} from 'lucide-react';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, recoveryCases, exceptions } = useApp();

  const pendingExceptionsCount = exceptions.filter((e) => e.status === 'PENDING').length;
  const activeRecoveryCount = recoveryCases.filter(
    (c) => c.status === 'Needs review' || c.status === 'Detected'
  ).length;

  const mainNavItems: NavItem[] = [
    { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
    { id: 'TRIPS', label: 'Trips', icon: MapPin },
    { id: 'FLEET', label: 'Fleet', icon: Truck },
    { id: 'PROFITABILITY', label: 'Profitability', icon: TrendingUp },
    { id: 'MONEY_RECOVERY', label: 'Money Recovery', icon: DollarSign, badge: activeRecoveryCount },
    { id: 'EXCEPTIONS', label: 'Exceptions', icon: AlertTriangle, badge: pendingExceptionsCount },
    { id: 'CUSTOMERS', label: 'Customers', icon: Users },
    { id: 'ROUTES', label: 'Routes', icon: Navigation }
  ];

  const secondaryNavItems: NavItem[] = [
    { id: 'DATA', label: 'Data', icon: Database },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
    { id: 'DRIVER_MOBILE', label: 'App Operador', icon: Smartphone }
  ];

  const renderNavGroup = (items: NavItem[]) => (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/60 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-56 bg-[#F8F9FA] border-r border-slate-200 flex flex-col justify-between select-none shrink-0 min-h-[calc(100vh-3.5rem)] py-4 px-3">
      <div className="space-y-6">
        <div>
          <div className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Operación & Finanzas
          </div>
          {renderNavGroup(mainNavItems)}
        </div>

        <div className="pt-3 border-t border-slate-200">
          <div className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Configuración
          </div>
          {renderNavGroup(secondaryNavItems)}
        </div>
      </div>

      {/* Company Info Box */}
      <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs text-xs">
        <div className="font-semibold text-slate-900 truncate">Logística Metropolitana</div>
        <div className="text-[11px] text-slate-500 mt-0.5">42 unidades · 31 activos</div>
        <div className="mt-2 text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center justify-between">
          <span>Margen Promedio</span>
          <span className="font-bold">43.0%</span>
        </div>
      </div>
    </aside>
  );
};
