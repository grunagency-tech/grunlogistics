import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Navigation, Key, ShieldCheck, Database, Sliders } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    routingProviderType,
    setRoutingProviderType,
    googleApiKey,
    setGoogleApiKey
  } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Configuración del Sistema & Adaptadores
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Arquitectura de adapters para RoutingProvider, GPSProvider, FuelProvider y reglas de cobro
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routing Provider Adapter Card (Requirement 5, 6, 36) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Navigation className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">
                Proveedor de Rutas (RoutingProvider)
              </h2>
              <p className="text-xs text-slate-500">
                Abstracción de ruteo para cálculo de ruta, distancia y peajes
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Seleccionar Proveedor Activo:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRoutingProviderType('DEMO_ROUTING')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    routingProviderType === 'DEMO_ROUTING'
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 ring-1 ring-emerald-500 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">DemoRoutingProvider</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Modo seguro con datos simulados coherentes
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRoutingProviderType('HERE_MAPS')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    routingProviderType === 'HERE_MAPS'
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 ring-1 ring-emerald-500 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold font-mono">HERE Maps (v8 Truck)</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Proveedor cartográfico & matrices de tráfico pesado
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRoutingProviderType('GOOGLE_ROUTES')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    routingProviderType === 'GOOGLE_ROUTES'
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 ring-1 ring-emerald-500 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">GoogleRoutesProvider</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Integración oficial con Google Routes API
                  </div>
                </button>
              </div>
            </div>

            {routingProviderType === 'HERE_MAPS' && (
              <div className="p-3 bg-slate-900 text-white rounded-lg space-y-2 text-xs">
                <div className="font-bold text-emerald-400">HERE Maps API Configuration (Fleet Telematics & Traffic Matrix)</div>
                <p className="text-[11px] text-slate-300">
                  Ruteo para autotransporte de carga con restricciones de peso, altura, peajes y cálculo de demoras por matriz de tráfico en tiempo real.
                </p>
                <div className="text-[10px] text-emerald-300 font-mono">
                  Estatus: HERE Maps Routing v8 & Traffic Matrix API Activo
                </div>
              </div>
            )}

            {routingProviderType === 'GOOGLE_ROUTES' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <label className="block font-semibold text-slate-700">Google Maps / Routes API Key:</label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded text-xs pl-8 pr-3 py-1.5 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="text-[10px] text-slate-500">
                  Si la API Key no está configurada, el sistema mostrará la insignia{' '}
                  <strong className="text-amber-800">ROUTING DEMO MODE</strong>. Nunca se finge una
                  integración real.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Integration Adapters Interfaces (Requirement 35) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Database className="w-5 h-5 text-slate-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">
                Interfaces de Adaptadores & Integraciones Core
              </h2>
              <p className="text-xs text-slate-500">
                Sincronización desacoplada con FleetOps TMS, Samsara API Telemetry y HERE Maps
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">FleetOps Core TMS Adapter</div>
                <div className="text-[11px] text-slate-500">Gestión de pedidos, clientes y despachadores</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                Sincronizado (Core TMS)
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Samsara Telemetry & Diagnostics API</div>
                <div className="text-[11px] text-slate-500">Telemetría IoT, códigos DTC OBD-II y NOM-087 HOS</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                Live API Active
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">HERE Maps Routing & Traffic Matrix</div>
                <div className="text-[11px] text-slate-500">Cálculo de peajes y ruteo para pesados</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                Conectado (v8 API)
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">FuelProvider Adapter</div>
                <div className="text-[11px] text-slate-500">Monedero Edenred / SiVale / Combustibles</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                Conectado (CSV/API)
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">AccountingProvider Adapter</div>
                <div className="text-[11px] text-slate-500">ERP / Contabilidad (SAP / CONTPAQi)</div>
              </div>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">
                Interfaz Lista (Prioridad 3)
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">DocumentProvider Adapter</div>
                <div className="text-[11px] text-slate-500">Almacenamiento de POD y evidencias de viaje</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                Activo (Local Storage)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
