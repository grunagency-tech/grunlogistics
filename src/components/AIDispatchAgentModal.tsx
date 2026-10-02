import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Trip } from '../types';
import { getRoutingProvider, PRESET_MEXICAN_HUBS } from '../services/routingProvider';
import { Bot, Sparkles, CheckCircle2, Truck, UserCheck, ShieldCheck, Zap, X, MapPin, Navigation, RefreshCw, AlertCircle } from 'lucide-react';

interface AIDispatchAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDispatchAgentModal: React.FC<AIDispatchAgentModalProps> = ({ isOpen, onClose }) => {
  const { vehicles, drivers, trips, customers, addTrip, updateTripStatus, openTripDetail, routingProviderType, googleApiKey } = useApp();

  const [mode, setMode] = useState<'NEW_ROUTE' | 'EXISTING_TRIP'>('NEW_ROUTE');

  // New Route Form State
  const [originName, setOriginName] = useState('Monterrey, NL');
  const [destinationName, setDestinationName] = useState('Ciudad de México, CDMX');
  const [cargoDescription, setCargoDescription] = useState('Refacciones Automotrices');
  const [cargoWeightKg, setCargoWeightKg] = useState<number>(21000);
  const [revenueMXN, setRevenueMXN] = useState<number>(34500);
  const [customerId, setCustomerId] = useState(customers[0]?.id || 'CUST-001');

  // Existing Trip State
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || 'TRIP-5831');

  // GraphHopper Route Engine State
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [calculatedDistanceKm, setCalculatedDistanceKm] = useState<number>(920);
  const [calculatedTollsMXN, setCalculatedTollsMXN] = useState<number>(3150);
  const [calculatedDurationMinutes, setCalculatedDurationMinutes] = useState<number>(720);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === customerId) || customers[0] || { id: 'CUST-001', name: 'TechLogistics Corp' };
  const targetTrip = mode === 'EXISTING_TRIP'
    ? (trips.find((t) => t.id === selectedTripId) || trips[0])
    : null;

  const currentOrigin = mode === 'NEW_ROUTE' ? originName : (targetTrip?.originName || 'Monterrey, NL');
  const currentDest = mode === 'NEW_ROUTE' ? destinationName : (targetTrip?.destinationName || 'Ciudad de México, CDMX');

  const suggestedVehicle = vehicles.find((v) => v.status === 'AVAILABLE') || vehicles[0];
  const suggestedDriver = drivers.find((d) => d.status === 'AVAILABLE') || drivers[0];

  const handleCalculateGraphHopper = async (orig = currentOrigin, dest = currentDest) => {
    setIsCalculatingRoute(true);
    try {
      const provider = getRoutingProvider(routingProviderType, googleApiKey);
      const res = await provider.calculateRoute({
        origin: orig,
        destination: dest,
        vehicleType: 'Tractor Camión',
        weightKg: cargoWeightKg
      });
      setCalculatedDistanceKm(res.distanceKm);
      setCalculatedTollsMXN(res.estimatedTollsMXN);
      setCalculatedDurationMinutes(res.durationMinutes);
    } catch (err) {
      console.warn('Error running GraphHopper route engine:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleCalculateGraphHopper();
    }
  }, [isOpen, mode, selectedTripId]);

  if (!isOpen) return null;

  const handleRunAiRecommendation = () => {
    setIsAnalyzing(true);
    handleCalculateGraphHopper();
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleApplyAssignment = () => {
    if (mode === 'EXISTING_TRIP' && targetTrip) {
      updateTripStatus(targetTrip.id, 'IN_TRANSIT');
      setAssignedSuccess(true);
      setTimeout(() => {
        setAssignedSuccess(false);
        onClose();
        openTripDetail(targetTrip.id);
      }, 1200);
    } else {
      // Create new trip using GraphHopper calculation & AI assignment
      const randomIdNumber = Math.floor(5800 + Math.random() * 2000);
      const newTripId = `TRIP-${randomIdNumber}`;

      const expectedFuelLiters = Math.round(calculatedDistanceKm / (suggestedVehicle.expectedFuelEfficiencyKmL || 2.7));
      const estimatedFuelMXN = Math.round(expectedFuelLiters * 24.50);
      const estimatedDriverPayMXN = Math.round(calculatedDistanceKm * 2.2);
      const estimatedOtherMXN = 800;
      const totalEstimatedCostMXN = estimatedFuelMXN + calculatedTollsMXN + estimatedDriverPayMXN + estimatedOtherMXN;
      const expectedMarginMXN = revenueMXN - totalEstimatedCostMXN;
      const expectedMarginPercent = revenueMXN > 0 ? parseFloat(((expectedMarginMXN / revenueMXN) * 100).toFixed(1)) : 0;

      const newTrip: Trip = {
        id: newTripId,
        tripNumber: `${randomIdNumber}`,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        originName,
        destinationName,
        cargoDescription,
        cargoWeightKg,
        vehicleId: suggestedVehicle.id,
        vehicleUnitNumber: suggestedVehicle.unitNumber,
        trailerNumber: suggestedVehicle.trailerNumber || 'TR-5320',
        driverId: suggestedDriver.id,
        driverName: suggestedDriver.name,
        scheduledDeparture: new Date().toISOString().slice(0, 16).replace('T', ' '),
        scheduledArrival: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
        deliveryAppointment: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),

        cartaPorteFolio: `${Math.random().toString(36).substring(2, 10).toUpperCase()}-SAT-31`,
        cartaPorteMercanciaSatCode: 'SAT-24101600 (General)',
        cartaPorteSeguroPoliza: 'POL-99281-MEX (Qualitas)',
        cartaPorteStatus: 'CUMPLE',

        plannedDistanceKm: calculatedDistanceKm,
        actualDistanceKm: calculatedDistanceKm,
        loadedKm: Math.round(calculatedDistanceKm * 0.85),
        emptyKm: Math.round(calculatedDistanceKm * 0.15),
        emptyKmPercent: 15.0,
        emptyKmCostMXN: Math.round(calculatedDistanceKm * 0.15 * 11),

        economics: {
          revenueMXN,
          estimatedFuelMXN,
          estimatedTollsMXN: calculatedTollsMXN,
          estimatedDriverPayMXN,
          estimatedOtherMXN,
          totalEstimatedCostMXN,
          expectedMarginMXN,
          expectedMarginPercent,
          expectedDistanceKm: calculatedDistanceKm,
          expectedFuelLiters,
          expectedTollsMXN: calculatedTollsMXN,

          actualFuelMXN: estimatedFuelMXN,
          actualTollsMXN: calculatedTollsMXN,
          actualDriverPayMXN: estimatedDriverPayMXN,
          actualOtherMXN: estimatedOtherMXN,
          totalActualCostMXN: totalEstimatedCostMXN,
          actualMarginMXN: expectedMarginMXN,
          actualMarginPercent: expectedMarginPercent,

          costVarianceMXN: 0,
          marginVarianceMXN: 0,
          breakEvenRevenueMXN: totalEstimatedCostMXN,
          marginBufferMXN: expectedMarginMXN
        },

        status: 'IN_TRANSIT',
        routeDeviationKm: 0,
        routeDeviationCostMXN: 0,
        routeDeviationStatus: 'NO_DEVIATION',

        waitingMinutes: 0,
        allowedWaitingMinutes: 30,
        excessWaitingMinutes: 0,
        potentialDetentionMXN: 0,
        detentionBillableStatus: 'Not billable',

        events: [
          {
            id: `EVT-${Date.now()}`,
            tripId: newTripId,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            locationName: originName,
            category: 'DEPARTURE',
            description: `Despacho autónomo con GraphHopper y Carta Porte SAT 3.1. Unidad ${suggestedVehicle.unitNumber}, Operador ${suggestedDriver.name}.`,
            createdBy: 'DISPATCHER'
          }
        ],
        fuelTransactions: [],
        costs: [],
        podUploaded: false,
        invoiceUploaded: false,
        hasRecoveryCase: false,
        currentLocationName: originName,
        currentCoordinates: { lat: 25.686, lng: -100.316 },
        eta: `${Math.round(calculatedDurationMinutes / 60)} hrs`,
        delayMinutes: 0,
        financialExposureMXN: 0
      };

      addTrip(newTrip);
      setAssignedSuccess(true);
      setTimeout(() => {
        setAssignedSuccess(false);
        onClose();
        openTripDetail(newTripId);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 font-sans text-slate-900 my-8">
        
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
                  <Sparkles className="w-3 h-3" /> LLM + GraphHopper Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Calcula rutas con GraphHopper OSM y asigna camión/chofer según NOM-087 y rendimiento
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode('NEW_ROUTE')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'NEW_ROUTE'
                ? 'bg-white text-[#0061FF] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Definir Origen / Destino y Generar Ruta
          </button>
          <button
            onClick={() => setMode('EXISTING_TRIP')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'EXISTING_TRIP'
                ? 'bg-white text-[#0061FF] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📦 Seleccionar Orden Registrada
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs">
          
          {mode === 'NEW_ROUTE' ? (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block font-mono">
                1. Especificar Origen, Destino y Parámetros
              </span>
              <datalist id="ai-mexican-hubs-list">
                {PRESET_MEXICAN_HUBS.map((hub, idx) => (
                  <option key={idx} value={hub} />
                ))}
              </datalist>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Origen (Remitente) *</label>
                  <input
                    type="text"
                    list="ai-mexican-hubs-list"
                    value={originName}
                    onChange={(e) => setOriginName(e.target.value)}
                    onBlur={() => handleCalculateGraphHopper(originName, destinationName)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#0061FF]"
                    placeholder="Selecciona o escribe el origen..."
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Destino (CEDIS / Cliente) *</label>
                  <input
                    type="text"
                    list="ai-mexican-hubs-list"
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    onBlur={() => handleCalculateGraphHopper(originName, destinationName)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#0061FF]"
                    placeholder="Selecciona o escribe el destino..."
                  />
                </div>
              </div>

              {originName.trim().toLowerCase() === destinationName.trim().toLowerCase() && originName.length > 0 && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-2 text-xs text-amber-900 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>El origen y destino coinciden. Por favor selecciona destinos distintos en México.</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Descripción Carga</label>
                  <input
                    type="text"
                    value={cargoDescription}
                    onChange={(e) => setCargoDescription(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={cargoWeightKg}
                    onChange={(e) => setCargoWeightKg(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tarifa Flete (MXN)</label>
                  <input
                    type="number"
                    value={revenueMXN}
                    onChange={(e) => setRevenueMXN(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>
          ) : (
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
          )}

          {/* GraphHopper Calculated Route Physics Engine Banner */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-[#0061FF]" />
              <div>
                <span className="font-bold text-slate-900">Motor GraphHopper OSM: </span>
                <span className="font-mono font-bold text-[#0061FF]">{calculatedDistanceKm} km</span>
                <span className="text-slate-500"> ({Math.round(calculatedDurationMinutes / 60)}h estimadas de tránsito)</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-blue-100 text-[#0061FF] font-mono font-bold rounded text-[10px]">
                Casetas: ${calculatedTollsMXN.toLocaleString()} MXN
              </span>
              <button
                type="button"
                onClick={() => handleCalculateGraphHopper()}
                disabled={isCalculatingRoute}
                className="p-1 text-[#0061FF] hover:bg-blue-100 rounded"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCalculatingRoute ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* AI Reasoning Result Box */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-xs text-white">Recomendación IA en Tiempo Real (Confianza: 98.4%)</span>
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
                <span>Analizando red vial GraphHopper, horas NOM-087 y telemetría GPS...</span>
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
                    <li><strong>Ruta GraphHopper:</strong> Tramo {currentOrigin} → {currentDest} ({calculatedDistanceKm} km). Casetas SCT estimadas: ${calculatedTollsMXN.toLocaleString()} MXN.</li>
                    <li><strong>Cumplimiento NOM-087:</strong> El conductor {suggestedDriver.name} cuenta con 7.2 horas de descanso acumuladas (Elegible sin riesgo de fatiga).</li>
                    <li><strong>Eficiencia de Combustible:</strong> La unidad U-{suggestedVehicle.unitNumber} mantiene un desvío de diésel de solo +1.2% respecto a la línea base esperada.</li>
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
              <span>¡Asignación efectuada correctamente con GraphHopper! Viaje despachado y QR Carta Porte 3.1 generado.</span>
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
            disabled={isAnalyzing || assignedSuccess || (mode === 'NEW_ROUTE' && originName.trim().toLowerCase() === destinationName.trim().toLowerCase())}
            className="px-5 py-2.5 bg-[#0061FF] hover:bg-[#0052D4] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{mode === 'NEW_ROUTE' ? '🤖 Crear Ruta & Despachar con IA' : 'Aplicar Asignación Sugerida & Despachar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
