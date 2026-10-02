import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const DataView: React.FC = () => {
  const { addTrip } = useApp();
  const [selectedEntity, setSelectedEntity] = useState<string>('TRIPS');
  const [importedRowsCount, setImportedRowsCount] = useState<number | null>(null);
  const [mappedColumns, setMappedColumns] = useState<Record<string, string>>({
    trip_id: 'tripNumber',
    customer: 'customerName',
    origin: 'originName',
    destination: 'destinationName',
    revenue: 'revenueMXN',
    fuel_cost: 'actualFuelMXN',
    tolls_cost: 'actualTollsMXN'
  });

  const handleSimulateImport = () => {
    // Import realistic demo trips directly into system state
    const demoImportTrips = [
      {
        id: `TRIP-5850`,
        tripNumber: '5850',
        customerId: 'CUST-001',
        customerName: 'TechLogistics Corp',
        originName: 'CEDIS Tepotzotlán Edomex',
        destinationName: 'Parque Industrial Querétaro QRO',
        cargoDescription: 'Componentes Electrónicos 18t',
        cargoWeightKg: 18000,
        vehicleId: 'VEH-184',
        vehicleUnitNumber: '184',
        trailerNumber: 'TR-5301',
        driverId: 'DRV-014',
        driverName: 'Roberto Gómez',
        scheduledDeparture: new Date().toISOString().slice(0, 16).replace('T', ' '),
        scheduledArrival: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
        deliveryAppointment: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
        cartaPorteFolio: 'CP31-5850-SAT',
        cartaPorteMercanciaSatCode: 'SAT-24101600',
        cartaPorteSeguroPoliza: 'Qualitas #POL-99281',
        cartaPorteStatus: 'CUMPLE' as const,
        plannedDistanceKm: 185,
        actualDistanceKm: 185,
        loadedKm: 165,
        emptyKm: 20,
        emptyKmPercent: 10.8,
        emptyKmCostMXN: 220,
        economics: {
          revenueMXN: 16500,
          estimatedFuelMXN: 4200,
          estimatedTollsMXN: 840,
          estimatedDriverPayMXN: 1800,
          estimatedOtherMXN: 500,
          totalEstimatedCostMXN: 7340,
          expectedMarginMXN: 9160,
          expectedMarginPercent: 55.5,
          expectedDistanceKm: 185,
          expectedFuelLiters: 171,
          expectedTollsMXN: 840,
          actualFuelMXN: 4200,
          actualTollsMXN: 840,
          actualDriverPayMXN: 1800,
          actualOtherMXN: 500,
          totalActualCostMXN: 7340,
          actualMarginMXN: 9160,
          actualMarginPercent: 55.5,
          costVarianceMXN: 0,
          marginVarianceMXN: 0,
          breakEvenRevenueMXN: 7340,
          marginBufferMXN: 9160
        },
        status: 'DISPATCHED' as const,
        routeDeviationKm: 0,
        routeDeviationCostMXN: 0,
        routeDeviationStatus: 'NO_DEVIATION' as const,
        waitingMinutes: 0,
        allowedWaitingMinutes: 30,
        excessWaitingMinutes: 0,
        potentialDetentionMXN: 0,
        detentionBillableStatus: 'Not billable' as const,
        events: [],
        fuelTransactions: [],
        costs: [],
        podUploaded: false,
        invoiceUploaded: false,
        hasRecoveryCase: false,
        currentLocationName: 'CEDIS Tepotzotlán',
        currentCoordinates: { lat: 19.7042, lng: -99.2223 },
        eta: 'En tiempo',
        delayMinutes: 0,
        financialExposureMXN: 0
      }
    ];

    demoImportTrips.forEach((t) => addTrip(t));
    setImportedRowsCount(5);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Importación & Mapeo de Datos (Data Import Engine)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Carga de archivos CSV, Excel y JSON con mapeo dinámico de columnas para pruebas rápidas
          </p>
        </div>
        <a
          href="/TRIPS_demo_import.csv"
          download
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5 shrink-0"
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>📥 Descargar CSV Ejemplo</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Import Configuration (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              1. Seleccionar Entidad a Importar
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
            {['TRIPS', 'VEHICLES', 'DRIVERS', 'FUEL', 'EXPENSES', 'CUSTOMERS', 'TOLLS'].map((ent) => (
              <button
                key={ent}
                onClick={() => {
                  setSelectedEntity(ent);
                  setImportedRowsCount(null);
                }}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedEntity === ent
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {ent}
              </button>
            ))}
          </div>

          {/* Drag & Drop Upload Simulation */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-8 text-center bg-slate-50/50 space-y-3 cursor-pointer transition-colors">
            <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Arrastra tu archivo CSV, Excel (.xlsx) o JSON aquí
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Soporta formato UTF-8 con delimitadores por coma o punto y coma
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/TRIPS_demo_import.csv"
                download
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
              >
                Descargar Archivo TRIPS.csv
              </a>
              <button
                onClick={handleSimulateImport}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                Cargar Archivo de Prueba Demo ({selectedEntity}.csv)
              </button>
            </div>
          </div>

          {importedRowsCount !== null && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl space-y-2 text-xs">
              <div className="font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>¡Se han procesado {importedRowsCount} registros exitosamente!</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Los datos de {selectedEntity} han sido importados e integrados directamente a la plataforma GRUNLOGISTICS.
              </p>
            </div>
          )}
        </div>

        {/* Column Mapping Preview (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs h-fit">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              2. Mapeo de Columnas (Column Mapping)
            </h2>
            <p className="text-xs text-slate-500">Mapea campos de tu CSV a la base de datos</p>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(mappedColumns).map(([csvCol, systemCol]) => (
              <div key={csvCol} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="font-mono text-slate-700">{csvCol}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-emerald-800 font-mono">{systemCol}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
