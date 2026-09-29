import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trip } from '../types';
import { getRoutingProvider } from '../services/routingProvider';
import { NewTripModal } from './NewTripModal';
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Truck,
  User,
  ArrowRight,
  DollarSign,
  Clock,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';

export const TripsView: React.FC = () => {
  const {
    trips,
    customers,
    vehicles,
    drivers,
    openTripDetail,
    addTrip,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    routingProviderType,
    googleApiKey
  } = useApp();

  const [showNewTripModal, setShowNewTripModal] = useState(false);

  // New Trip Form State
  const [customerId, setCustomerId] = useState(customers[0]?.id || 'CUST-001');
  const [origin, setOrigin] = useState('Monterrey, NL');
  const [destination, setDestination] = useState('Ciudad de México, CDMX');
  const [cargo, setCargo] = useState('Bebidas Envasadas 22 Tn');
  const [weightKg, setWeightKg] = useState<number>(22000);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || 'VEH-184');
  const [trailerNumber, setTrailerNumber] = useState('TR-5320');
  const [driverId, setDriverId] = useState(drivers[0]?.id || 'DRV-014');
  const [scheduledDeparture, setScheduledDeparture] = useState('2026-09-21 07:00');
  const [deliveryAppointment, setDeliveryAppointment] = useState('2026-09-21 17:30');
  const [revenue, setRevenue] = useState<number>(29500);

  // Calculated route preview
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState<number>(920);
  const [calculatedTolls, setCalculatedTolls] = useState<number>(3200);

  const handleCalculateRoute = async () => {
    setCalculatingRoute(true);
    try {
      const provider = getRoutingProvider(routingProviderType, googleApiKey);
      const res = await provider.calculateRoute({
        origin,
        destination,
        vehicleType: 'Tractor Camión',
        weightKg
      });
      setCalculatedDistance(res.distanceKm);
      setCalculatedTolls(res.estimatedTollsMXN);
    } catch (e) {
      console.warn(e);
    } finally {
      setCalculatingRoute(false);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    const selCust = customers.find((c) => c.id === customerId) || customers[0];
    const selVeh = vehicles.find((v) => v.id === vehicleId) || vehicles[0];
    const selDrv = drivers.find((d) => d.id === driverId) || drivers[0];

    // Estimated costs computation
    const estFuel = Math.round(calculatedDistance * 8.5); // ~ $8.5 per km fuel
    const estTolls = calculatedTolls;
    const estDriver = selDrv.payModel === 'FIXED_TRIP' ? 2100 : Math.round(calculatedDistance * 2.2);
    const estOther = 800;
    const totalEstCost = estFuel + estTolls + estDriver + estOther;
    const expectedMargin = revenue - totalEstCost;
    const expectedMarginPct = Math.round((expectedMargin / revenue) * 1000) / 10;

    const newTripNumber = Math.floor(5851 + Math.random() * 100).toString();

    const createdTrip: Trip = {
      id: `TRIP-${newTripNumber}`,
      tripNumber: newTripNumber,
      customerId: selCust.id,
      customerName: selCust.name,
      originName: origin,
      destinationName: destination,
      cargoDescription: cargo,
      cargoWeightKg: weightKg,
      vehicleId: selVeh.id,
      vehicleUnitNumber: selVeh.unitNumber,
      trailerNumber,
      driverId: selDrv.id,
      driverName: selDrv.name,
      scheduledDeparture,
      scheduledArrival: deliveryAppointment,
      deliveryAppointment,
      plannedDistanceKm: calculatedDistance,
      actualDistanceKm: calculatedDistance,
      loadedKm: Math.round(calculatedDistance * 0.82),
      emptyKm: Math.round(calculatedDistance * 0.18),
      emptyKmPercent: 18.0,
      emptyKmCostMXN: Math.round(calculatedDistance * 0.18 * 11),
      economics: {
        revenueMXN: revenue,
        estimatedFuelMXN: estFuel,
        estimatedTollsMXN: estTolls,
        estimatedDriverPayMXN: estDriver,
        estimatedOtherMXN: estOther,
        totalEstimatedCostMXN: totalEstCost,
        expectedMarginMXN: expectedMargin,
        expectedMarginPercent: expectedMarginPct,
        expectedDistanceKm: calculatedDistance,
        expectedFuelLiters: Math.round(calculatedDistance / 2.8),
        expectedTollsMXN: estTolls,
        actualFuelMXN: estFuel,
        actualTollsMXN: estTolls,
        actualDriverPayMXN: estDriver,
        actualOtherMXN: estOther,
        totalActualCostMXN: totalEstCost,
        actualMarginMXN: expectedMargin,
        actualMarginPercent: expectedMarginPct,
        costVarianceMXN: 0,
        marginVarianceMXN: 0,
        breakEvenRevenueMXN: totalEstCost,
        marginBufferMXN: expectedMargin
      },
      status: 'PLANNED',
      routeDeviationKm: 0,
      routeDeviationCostMXN: 0,
      routeDeviationStatus: 'NO_DEVIATION',
      waitingMinutes: 0,
      allowedWaitingMinutes: selCust.allowedWaitingMinutes || 30,
      excessWaitingMinutes: 0,
      potentialDetentionMXN: 0,
      detentionBillableStatus: 'Unknown',
      events: [],
      fuelTransactions: [],
      costs: [],
      podUploaded: false,
      invoiceUploaded: false,
      hasRecoveryCase: false,
      currentLocationName: origin,
      currentCoordinates: selVeh.coordinates,
      eta: deliveryAppointment,
      delayMinutes: 0,
      financialExposureMXN: 0
    };

    addTrip(createdTrip);
    setShowNewTripModal(false);
    openTripDetail(createdTrip.id);
  };

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.tripNumber.includes(searchQuery) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicleUnitNumber.includes(searchQuery) ||
      t.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportTripsToCSV = () => {
    const headers = [
      'Trip Number',
      'Customer',
      'Origin',
      'Destination',
      'Vehicle Unit',
      'Driver',
      'Status',
      'Carta Porte SAT Status',
      'Planned Km',
      'Revenue MXN',
      'Estimated Cost MXN',
      'Expected Margin MXN',
      'Actual Margin MXN'
    ];

    const rows = filteredTrips.map((t) => [
      t.tripNumber,
      `"${t.customerName}"`,
      `"${t.originName}"`,
      `"${t.destinationName}"`,
      `Unidad ${t.vehicleUnitNumber}`,
      `"${t.driverName}"`,
      t.status,
      t.cartaPorteStatus,
      t.plannedDistanceKm,
      t.economics.revenueMXN,
      t.economics.totalEstimatedCostMXN,
      t.economics.expectedMarginMXN,
      t.economics.actualMarginMXN
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GRUNLOGISTICS_Reporte_Viajes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <NewTripModal isOpen={showNewTripModal} onClose={() => setShowNewTripModal(false)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Gestión de Viajes (Trips)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoreo económico, despacho operativo y compliancia Carta Porte SAT 3.1
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={exportTripsToCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => setShowNewTripModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Crear / Despachar Viaje</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por # viaje, cliente, unidad o chofer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-800 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Estatus:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="ALL">Todos los estatus</option>
            <option value="IN_TRANSIT">En Tránsito</option>
            <option value="PLANNED">Planeados</option>
            <option value="COMPLETED">Completados</option>
          </select>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4"># Viaje</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Origen → Destino</th>
                <th className="py-3 px-4">Unidad / Chófer</th>
                <th className="py-3 px-4 font-mono">Revenue</th>
                <th className="py-3 px-4 font-mono">Expected Margin</th>
                <th className="py-3 px-4 font-mono">Actual Margin</th>
                <th className="py-3 px-4">Espera / Recovery</th>
                <th className="py-3 px-4">Estatus</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredTrips.map((t) => {
                const econ = t.economics;
                const isMarginLower = econ.actualMarginMXN < econ.expectedMarginMXN;
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      #{t.tripNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {t.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{t.originName}</div>
                      <div className="text-[10px] text-slate-400">→ {t.destinationName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold">Unidad {t.vehicleUnitNumber}</div>
                      <div className="text-[10px] text-slate-400">{t.driverName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      ${econ.revenueMXN.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      ${econ.expectedMarginMXN.toLocaleString()}
                      <div className="text-[10px] text-slate-400">{econ.expectedMarginPercent}%</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`font-bold ${
                          isMarginLower ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        ${econ.actualMarginMXN.toLocaleString()}
                      </span>
                      <div className="text-[10px] text-slate-500 font-sans">
                        {econ.actualMarginPercent}%
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {t.potentialDetentionMXN > 0 ? (
                        <div>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                            +${t.potentialDetentionMXN.toLocaleString()} rec.
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {t.waitingMinutes} min espera
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.status === 'IN_TRANSIT'
                            ? 'bg-blue-100 text-blue-800'
                            : t.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openTripDetail(t.id)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors shadow-xs"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW TRIP MODAL (Requirement 5) */}
      {showNewTripModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Crear Nuevo Viaje (New Trip)</h3>
                <p className="text-xs text-slate-500">
                  Cálculo automático de ruta, peajes y margen esperado
                </p>
              </div>
              <button
                onClick={() => setShowNewTripModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cliente</label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Revenue / Precio de Flete (MXN)
                  </label>
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origen</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destino</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Descripción Carga</label>
                  <input
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peso Carga (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehículo / Unidad</label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        Unidad {v.unitNumber} - {v.brand} ({v.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Remolque (Trailer #)</label>
                  <input
                    type="text"
                    value={trailerNumber}
                    onChange={(e) => setTrailerNumber(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operador / Chófer</label>
                  <select
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.payModel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cita de Entrega Programada
                  </label>
                  <input
                    type="text"
                    value={deliveryAppointment}
                    onChange={(e) => setDeliveryAppointment(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* ROUTING CALCULATION PREVIEW BOX */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 flex items-center space-x-2">
                    <span>Estimación de Ruta & Peajes</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded font-semibold">
                      {routingProviderType === 'GOOGLE_ROUTES' ? 'Google Routes' : 'ROUTING DEMO MODE'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCalculateRoute}
                    disabled={calculatingRoute}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-medium rounded transition-colors"
                  >
                    {calculatingRoute ? 'Calculando...' : 'Recalcular Ruta'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Distancia</span>
                    <span className="font-bold font-mono text-slate-900">{calculatedDistance} km</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Casetas Est.</span>
                    <span className="font-bold font-mono text-slate-900">
                      ${calculatedTolls.toLocaleString()} MXN
                    </span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-semibold block">Margen Est.</span>
                    <span className="font-bold font-mono text-emerald-900">
                      ${(revenue - (calculatedDistance * 8.5 + calculatedTolls + 2900)).toLocaleString()} MXN
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTripModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded shadow-xs"
                >
                  Guardar & Iniciar Viaje
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
