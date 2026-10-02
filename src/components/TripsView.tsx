import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trip } from '../types';
import { getRoutingProvider } from '../services/routingProvider';
import { NewTripModal } from './NewTripModal';
import { AIDispatchAgentModal } from './AIDispatchAgentModal';
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
  Download,
  Kanban,
  List,
  CheckCircle2,
  ShieldCheck,
  Building2,
  PlayCircle,
  Bot,
  Sparkles
} from 'lucide-react';

export const TripsView: React.FC = () => {
  const {
    trips,
    customers,
    vehicles,
    drivers,
    openTripDetail,
    addTrip,
    updateTripStatus,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    routingProviderType,
    googleApiKey
  } = useApp();

  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');

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
      <AIDispatchAgentModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Gestión de Viajes (Trips & Despacho)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoreo económico, despacho operativo y compliancia Carta Porte SAT 3.1
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-2 bg-[#0061FF] hover:bg-[#0052D4] text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>🤖 Agente IA Despachador</span>
          </button>
          <button
            onClick={exportTripsToCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => setShowNewTripModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Crear Viaje</span>
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

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Estatus:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none font-semibold text-slate-700"
            >
              <option value="ALL">Todos los estatus</option>
              <option value="IN_TRANSIT">En Tránsito</option>
              <option value="PLANNED">Planeados</option>
              <option value="COMPLETED">Completados</option>
            </select>
          </div>

          {/* FletOps View Switcher: Table vs Kanban */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1.5 ${
                viewMode === 'TABLE'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista / Tabla</span>
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1.5 ${
                viewMode === 'KANBAN'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban FletOps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render View: TABLE vs KANBAN */}
      {viewMode === 'KANBAN' ? (
        /* FletOps Dispatch Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
          {[
            {
              id: 'PLANNED',
              title: '📋 Programados / Por Salir',
              color: 'border-slate-300 bg-slate-50',
              badgeColor: 'bg-slate-200 text-slate-800',
              tripsList: filteredTrips.filter((t) => t.status === 'PLANNED')
            },
            {
              id: 'IN_TRANSIT',
              title: '🚚 En Ruta (Corredor 57)',
              color: 'border-blue-300 bg-blue-50/20',
              badgeColor: 'bg-blue-100 text-blue-900',
              tripsList: filteredTrips.filter((t) => t.status === 'IN_TRANSIT')
            },
            {
              id: 'UNLOADING',
              title: '🏢 En Rampa / CEDIS',
              color: 'border-amber-300 bg-amber-50/20',
              badgeColor: 'bg-amber-100 text-amber-900',
              tripsList: filteredTrips.filter((t) => t.status === 'UNLOADING' || t.waitingMinutes > 0)
            },
            {
              id: 'COMPLETED',
              title: '🏁 Entregados & Liquidados',
              color: 'border-emerald-300 bg-emerald-50/20',
              badgeColor: 'bg-emerald-100 text-emerald-900',
              tripsList: filteredTrips.filter((t) => t.status === 'COMPLETED' && t.waitingMinutes === 0)
            }
          ].map((col) => (
            <div key={col.id} className={`rounded-xl border ${col.color} p-4 space-y-3 shadow-xs`}>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <h3 className="text-xs font-bold text-slate-900 tracking-tight font-sans">
                  {col.title}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeColor}`}>
                  {col.tripsList.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {col.tripsList.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center text-slate-400 text-xs border-2 border-dashed border-slate-200/80 rounded-xl p-4">
                    <Truck className="w-5 h-5 mb-1 text-slate-300" />
                    <span>Sin viajes en esta etapa</span>
                  </div>
                ) : (
                  col.tripsList.map((t) => {
                    const econ = t.economics;
                    const isMarginLower = econ.actualMarginMXN < econ.expectedMarginMXN;

                    return (
                      <div
                        key={t.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2.5 select-none"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-900 text-xs">#{t.tripNumber}</span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            Carta Porte SAT 3.1
                          </span>
                        </div>

                        <div>
                          <div className="font-bold text-slate-900 text-xs">{t.customerName}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{t.originName} → {t.destinationName}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-lg text-[11px] flex justify-between items-center text-slate-700 font-mono">
                          <div>
                            <span className="text-[9px] text-slate-400 block uppercase">Unidad / Chófer</span>
                            <span className="font-bold">U-{t.vehicleUnitNumber}</span> · {t.driverName.split(' ')[0]}
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 block uppercase">Margen Real</span>
                            <span className={`font-bold ${isMarginLower ? 'text-rose-600' : 'text-emerald-700'}`}>
                              ${econ.actualMarginMXN.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Quick FletOps Status Transition Actions */}
                        <div className="pt-1 flex items-center justify-between gap-1 border-t border-slate-100 text-[10px]">
                          {t.status === 'PLANNED' && (
                            <button
                              onClick={() => updateTripStatus(t.id, 'IN_TRANSIT')}
                              className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded flex items-center justify-center space-x-1 transition-colors"
                            >
                              <PlayCircle className="w-3 h-3" />
                              <span>Iniciar Ruta</span>
                            </button>
                          )}
                          {t.status === 'IN_TRANSIT' && (
                            <button
                              onClick={() => updateTripStatus(t.id, 'UNLOADING')}
                              className="w-full py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded flex items-center justify-center space-x-1 transition-colors"
                            >
                              <Building2 className="w-3 h-3" />
                              <span>Entrar a Rampa</span>
                            </button>
                          )}
                          {t.status === 'UNLOADING' && (
                            <button
                              onClick={() => updateTripStatus(t.id, 'COMPLETED')}
                              className="w-full py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded flex items-center justify-center space-x-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Liquidar / Completar</span>
                            </button>
                          )}
                          {t.status === 'COMPLETED' && (
                            <span className="text-slate-400 text-[10px] font-semibold flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Completado</span>
                            </span>
                          )}
                          <button
                            onClick={() => openTripDetail(t.id)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded shrink-0"
                          >
                            Ver Detalle
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Trips Table */
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
                        <div className="flex items-center justify-end space-x-1.5">
                          <a
                            href="/Carta_Porte_SAT_3.1_5831.pdf"
                            download
                            title="Descargar Representación Impresa Carta Porte 3.1 (PDF)"
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-bold rounded flex items-center space-x-1 transition-colors"
                          >
                            <FileText className="w-3 h-3 text-emerald-700" />
                            <span>PDF</span>
                          </a>
                          <button
                            onClick={() => openTripDetail(t.id)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded transition-colors shadow-xs"
                          >
                            Abrir Viaje
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}



    </div>
  );
};
