import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const RiskView: React.FC = () => {
  const { trips } = useApp();

  const highRiskTrips = trips.filter((t) => t.riskScore >= 50);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      <div className="border-b border-[#1E293B] pb-4">
        <h1 className="text-xl font-bold font-mono text-white tracking-wide uppercase flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>RISK ENGINE — OPERATIONAL RISK SCORE RANKING</span>
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Matriz de severidad operativa calculada dinámicamente por variaciones de tráfico, demoras en andén y tolerancia de ventana.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {highRiskTrips.map((t) => (
          <div key={t.id} className="bg-[#0F1523] border border-[#1E293B] p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center border-b border-[#1E293B] pb-2">
              <span className="font-bold text-white text-sm">VIAJE #{t.tripNumber} ({t.customerName})</span>
              <span className="text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                SCORE RIESGO: {t.riskScore}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
              <div>Unidad: <strong className="text-white">Unidad {t.vehicleUnitNumber}</strong></div>
              <div>Chofer: <strong className="text-white">{t.driverName}</strong></div>
              <div>Demora: <strong className="text-amber-400">+{t.delayMinutes} min</strong></div>
              <div>Compromiso: <strong className="text-white">{t.committedDeliveryTime}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
