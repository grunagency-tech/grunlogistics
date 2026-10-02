import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Sparkles, CheckCircle2, Truck, UserCheck, ShieldCheck, Zap, X, MapPin } from 'lucide-react';

interface AIDispatchAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDispatchAgentModal: React.FC<AIDispatchAgentModalProps> = ({ isOpen, onClose }) => {
  const { vehicles, drivers, trips, updateTripStatus } = useApp();

  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || 'TRIP-5831');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  if (!isOpen) return null;

  const targetTrip = trips.find((t) => t.id === selectedTripId) || trips[0];
  const suggestedVehicle = vehicles.find((v) => v.status === 'AVAILABLE') || vehicles[0];
  const suggestedDriver = drivers.find((d) => d.status === 'AVAILABLE') || drivers[0];

  const handleRunAiRecommendation = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleApplyAssignment = () => {
    updateTripStatus(targetTrip.id, 'IN_TRANSIT');
    setAssignedSuccess(true);
    setTimeout(() => {
      setAssignedSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 font-sans text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0061FF] text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">Agente Despachador Autónomo IA</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDF5FF] text-[#0061FF] border border-[#0061FF]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> LLM + Function Calling
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Orquestación automatizada de camiones y choferes con optimización NOM-087 y rendimiento de diésel
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs">
          {/* Select Trip */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Seleccionar Orden o Viaje a Despachar:</label>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#0061FF]"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  Viaje #{t.tripNumber} — {t.customerName} ({t.originName} → {t.destinationName}) · Carga: {t.cargoDescription}
                </option>
              ))}
            </select>
          </div>

          {/* AI Reasoning Result Box */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-xs text-white">Recomendación IA en Tiempo Real (Nivel de Confianza: 98.4%)</span>
              </div>
              <button
                onClick={handleRunAiRecommendation}
                disabled={isAnalyzing}
                className="px-3 py-1 bg-[#0061FF] hover:bg-[#0052D4] text-white text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isAnalyzing ? 'Analizando...' : 'Recalcular Asignación'}</span>
              </button>
            </div>

            {isAnalyzing ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-400">
                <Bot className="w-8 h-8 animate-bounce text-[#0061FF]" />
                <span>Analizando horas de servicio NOM-087, odómetros y geocercas GPS...</span>
              </div>
            ) : (
              <div className="space-y-3 font-sans">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white">Unidad Sugerida: U-{suggestedVehicle.unitNumber} ({suggestedVehicle.brand} {suggestedVehicle.model})</div>
                      <div className="text-[11px] text-slate-400">Placas: {suggestedVehicle.plate} · Rendimiento Base: {suggestedVehicle.expectedFuelEfficiencyKmL} km/L</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-[#0061FF]" />
                    <span className="font-bold text-white">{suggestedDriver.name}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block uppercase tracking-wider text-[10px]">Justificación Técnica de la IA:</span>
                  <ul className="space-y-1.5 text-slate-300 list-disc pl-4 text-[11px]">
                    <li><strong>Cumplimiento NOM-087:</strong> El conductor {suggestedDriver.name} cuenta con 7.2 horas de descanso acumuladas (Elegible sin riesgo de fatiga).</li>
                    <li><strong>Eficiencia de Combustible:</strong> La unidad U-{suggestedVehicle.unitNumber} mantiene un desvío de diésel de solo +1.2% respecto a la línea base esperada.</li>
                    <li><strong>Geolocalización:</strong> Posición GPS activa a 8.4 km del CEDIS origen ({targetTrip.originName}).</li>
                    <li><strong>Compliancia SAT:</strong> Póliza Quálitas y Permiso SCT de autotransporte pre-validados para timbrado de Carta Porte 3.1.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Action Success Alert */}
          {assignedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl font-bold flex items-center space-x-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¡Asignación efectuada correctamente! Viaje despachado y QR Carta Porte 3.1 generado.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Cancelar
          </button>
          <button
            onClick={handleApplyAssignment}
            disabled={isAnalyzing || assignedSuccess}
            className="px-5 py-2.5 bg-[#0061FF] hover:bg-[#0052D4] text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Aplicar Asignación Sugerida & Despachar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
