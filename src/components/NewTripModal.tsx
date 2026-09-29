import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trip } from '../types';
import { X, Truck, ShieldCheck, DollarSign, MapPin, Package, Calendar } from 'lucide-react';

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTripModal: React.FC<NewTripModalProps> = ({ isOpen, onClose }) => {
  const { customers, vehicles, drivers, addTrip, openTripDetail } = useApp();

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [originName, setOriginName] = useState('Monterrey, NL');
  const [destinationName, setDestinationName] = useState('Guadalajara, JAL');
  const [cargoDescription, setCargoDescription] = useState('Refacciones Automotrices');
  const [cargoWeightKg, setCargoWeightKg] = useState<number>(21000);
  const [distanceKm, setDistanceKm] = useState<number>(780);
  const [revenueMXN, setRevenueMXN] = useState<number>(32000);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [driverId, setDriverId] = useState(drivers[0]?.id || '');

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === customerId) || customers[0];
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) || vehicles[0];
  const selectedDriver = drivers.find((d) => d.id === driverId) || drivers[0];

  // Automatic baseline cost calculations
  const expectedFuelLiters = Math.round(distanceKm / (selectedVehicle.expectedFuelEfficiencyKmL || 2.7));
  const estimatedFuelMXN = Math.round(expectedFuelLiters * 24.50); // $24.50 MXN per liter
  const estimatedTollsMXN = Math.round(distanceKm * 3.40); // Avg toll cost/km
  const estimatedDriverPayMXN = selectedDriver.payModel === 'FIXED_TRIP' ? selectedDriver.payRateAmount : Math.round(distanceKm * 2.2);
  const estimatedOtherMXN = 800; // Permits & logistics allocation

  const totalEstimatedCostMXN = estimatedFuelMXN + estimatedTollsMXN + estimatedDriverPayMXN + estimatedOtherMXN;
  const expectedMarginMXN = revenueMXN - totalEstimatedCostMXN;
  const expectedMarginPercent = revenueMXN > 0 ? parseFloat(((expectedMarginMXN / revenueMXN) * 100).toFixed(1)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomIdNumber = Math.floor(5800 + Math.random() * 2000);
    const newTripId = `TRIP-${randomIdNumber}`;

    const newTrip: Trip = {
      id: newTripId,
      tripNumber: `${randomIdNumber}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      originName,
      destinationName,
      cargoDescription,
      cargoWeightKg,
      vehicleId: selectedVehicle.id,
      vehicleUnitNumber: selectedVehicle.unitNumber,
      trailerNumber: selectedVehicle.trailerNumber || 'TR-5300',
      driverId: selectedDriver.id,
      driverName: selectedDriver.name,
      scheduledDeparture: new Date().toISOString().slice(0, 16).replace('T', ' '),
      scheduledArrival: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
      deliveryAppointment: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
      
      // SAT Carta Porte 3.1
      cartaPorteFolio: `${Math.random().toString(36).substring(2, 10).toUpperCase()}-SAT-31`,
      cartaPorteMercanciaSatCode: 'SAT-24101600 (General)',
      cartaPorteSeguroPoliza: 'POL-99281-MEX (Qualitas)',
      cartaPorteStatus: 'CUMPLE',

      plannedDistanceKm: distanceKm,
      actualDistanceKm: distanceKm,
      loadedKm: Math.round(distanceKm * 0.85),
      emptyKm: Math.round(distanceKm * 0.15),
      emptyKmPercent: 15.0,
      emptyKmCostMXN: Math.round(distanceKm * 0.15 * 11),

      economics: {
        revenueMXN,
        estimatedFuelMXN,
        estimatedTollsMXN,
        estimatedDriverPayMXN,
        estimatedOtherMXN,
        totalEstimatedCostMXN,
        expectedMarginMXN,
        expectedMarginPercent,
        expectedDistanceKm: distanceKm,
        expectedFuelLiters,
        expectedTollsMXN: estimatedTollsMXN,

        actualFuelMXN: estimatedFuelMXN,
        actualTollsMXN: estimatedTollsMXN,
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

      status: 'DISPATCHED',
      routeDeviationKm: 0,
      routeDeviationCostMXN: 0,
      routeDeviationStatus: 'NO_DEVIATION',

      waitingMinutes: 0,
      allowedWaitingMinutes: selectedCustomer.allowedWaitingMinutes || 30,
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
          description: `Viaje despachado con Carta Porte SAT 3.1 asignada. Unidad ${selectedVehicle.unitNumber}.`,
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
      eta: 'En tiempo',
      delayMinutes: 0,
      financialExposureMXN: 0
    };

    addTrip(newTrip);
    onClose();
    openTripDetail(newTripId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-6 my-8 font-sans text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider block">
              DESPACHO OPERATIVO
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Registrar y Despachar Nuevo Viaje
            </h2>
            <p className="text-xs text-slate-500">
              Asigna cliente, ruta, unidad y valida Carta Porte SAT 3.1 antes de la salida
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Section 1: Customer & Cargo */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              1. Cliente y Carga Contratada
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Cliente Solicitante *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (RFC: {c.taxId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Descripción de Carga *</label>
                <input
                  type="text"
                  value={cargoDescription}
                  onChange={(e) => setCargoDescription(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="ej. Componentes Electrónicos"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Peso Carga (kg) *</label>
                <input
                  type="number"
                  value={cargoWeightKg}
                  onChange={(e) => setCargoWeightKg(Number(e.target.value))}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Distancia Est. (km) *</label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tarifa Flete (MXN) *</label>
                <input
                  type="number"
                  value={revenueMXN}
                  onChange={(e) => setRevenueMXN(Number(e.target.value))}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold text-emerald-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Origin & Destination */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              2. Origen y Destino de Ruta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Origen (Remitente) *</label>
                <input
                  type="text"
                  value={originName}
                  onChange={(e) => setOriginName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Destino (CEDIS / Cliente) *</label>
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Asset Assignment */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              3. Asignación de Unidad y Operador
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Unidad de Transporte *</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      Unidad {v.unitNumber} - {v.brand} {v.model} ({v.plate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Operador / Chófer *</label>
                <select
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.licenseNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pre-Dispatch Economic & SAT Compliance Preview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Validación SAT Carta Porte 3.1
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                PRE-VALIDADO CUMPLE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Diésel Est.</span>
                <span className="font-mono font-bold text-slate-800">${estimatedFuelMXN.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block">({expectedFuelLiters} L)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Casetas Est.</span>
                <span className="font-mono font-bold text-slate-800">${estimatedTollsMXN.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Costo Total Est.</span>
                <span className="font-mono font-bold text-slate-800">${totalEstimatedCostMXN.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Margen Esperado</span>
                <span className={`font-mono font-bold ${expectedMarginMXN >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  ${expectedMarginMXN.toLocaleString()} ({expectedMarginPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-2"
            >
              <Truck className="w-4 h-4" />
              <span>Despachar Viaje & Generar Carta Porte</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
