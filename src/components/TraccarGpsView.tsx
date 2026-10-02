import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio,
  Fuel,
  Thermometer,
  Lock,
  Unlock,
  AlertTriangle,
  ShieldCheck,
  Zap,
  MapPin,
  RefreshCw,
  Clock,
  Activity,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export const TraccarGpsView: React.FC = () => {
  const { vehicles, setCurrentView } = useApp();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('VEH-184');
  const [engineKilled, setEngineKilled] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const toggleEngineKill = () => {
    if (engineKilled) {
      setEngineKilled(false);
      setActionSuccess(`Comando de reactivación de encendido enviado con éxito a ${selectedVehicle.unitNumber}`);
    } else {
      if (confirm(`¿CONFIRMAR PARO DE MOTOR DE EMERGENCIA PARA LA UNIDAD ${selectedVehicle.unitNumber}? Se desactivará la bomba de combustible por relé Traccar.`)) {
        setEngineKilled(true);
        setActionSuccess(`PARO DE MOTOR ACTIVADO VÍA RELÉ IoT EN UNIDAD ${selectedVehicle.unitNumber}`);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500 text-slate-950 tracking-wide uppercase">
              grunagency-tech / traccar
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Universal GPS & IoT Telemetry Stack
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Traccar Telemática IoT & Sensores Diésel / Frío</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Plataforma universal de telemetría GPS. Monitoreo de varillas ultrasónicas de diésel, sensores de temperatura para cadena de frío, apertura de puertas de tráiler y relé de paro de motor remoto.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActionSuccess('Telemetría Traccar sincronizada con la red GPS')}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" /> Actualizar Sensores IoT
          </button>
        </div>
      </div>

      {/* Action Banner Notification */}
      {actionSuccess && (
        <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center justify-between text-cyan-900 text-sm font-medium animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-xs font-bold text-cyan-700 underline"
          >
            Aceptar
          </button>
        </div>
      )}

      {/* Top Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVehicleId(v.id)}
            className={`p-4 rounded-2xl border text-left transition ${
              selectedVehicleId === v.id
                ? 'bg-white border-[#0061FF] ring-2 ring-blue-100 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm">Unidad {v.unitNumber}</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-md">
                {v.gpsProvider}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{v.brand} {v.model} ({v.plate})</div>
            <div className="mt-2 text-xs font-semibold flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {v.currentLocationName.slice(0, 22)}...
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${v.status === 'ON_TRIP' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                {v.status}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Detailed Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Telemetry Gauges */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-600" /> Sensores Telemetría IoT - Unidad {selectedVehicle.unitNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sonda Ultrasónica de Diésel + Termostato CAN-bus + Sensor de Puerta Traccar
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> Conectado Traccar IoT
              </span>
            </div>

            {/* Grid of Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Diesel Level Gauge */}
              <div className="p-5 bg-gradient-to-b from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-blue-600" /> Nivel de Diésel
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-700">78.4%</span>
                </div>
                <div className="text-2xl font-black text-slate-900">346.5 Litros</div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#0061FF] h-full" style={{ width: '78.4%' }}></div>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between font-medium">
                  <span>Varilla Ultrasónica: ±0.5 L</span>
                  <span className="text-emerald-600 font-bold">Sin anomalías</span>
                </div>
              </div>

              {/* Temperature Sensor */}
              <div className="p-5 bg-gradient-to-b from-slate-50 to-cyan-50/30 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-cyan-600" /> Termostato Tráiler
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-700">-18.2 °C</span>
                </div>
                <div className="text-2xl font-black text-slate-900">Cadena de Frío</div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full" style={{ width: '92%' }}></div>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between font-medium">
                  <span>Rango Setpoint: -20°C a -16°C</span>
                  <span className="text-emerald-600 font-bold">En Rango</span>
                </div>
              </div>

              {/* Trailer Door Sensor */}
              <div className="p-5 bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-600" /> Puerta Tráiler
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">CERRADA</span>
                </div>
                <div className="text-2xl font-black text-slate-900">Chapa magnética</div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Última apertura: CEDIS Monterrey (06:14 AM). Bloqueo automático activo por geocerca.
                </div>
              </div>
            </div>

            {/* Geofence Map Matrix */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-sm">Geocercas de Seguridad & Casetas (Traccar Engine)</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">GPS Lat: 19.498, Lng: -99.162</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Geocerca Actual</div>
                  <div className="font-bold text-white mt-1">CEDIS Vallejo / Norte</div>
                  <div className="text-emerald-400 text-[10px] mt-1 font-semibold">✓ Arribo Autorizado</div>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Zona de Riesgo Corredor 57</div>
                  <div className="font-bold text-white mt-1">Tramo Querétaro-San Luis</div>
                  <div className="text-slate-400 text-[10px] mt-1">Tránsito seguro (Velocidad: 82 km/h)</div>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Paradas No Autorizadas</div>
                  <div className="font-bold text-white mt-1">0 Detenciones</div>
                  <div className="text-emerald-400 text-[10px] mt-1 font-semibold">✓ Monitoreo en Vivo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Engine Kill & Panic Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-600" /> Protocolos de Seguridad & Paro de Motor
            </h3>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-950 text-xs">Comando de Corte de Combustible</h4>
                  <p className="text-rose-800 text-[11px] mt-1">
                    Envía señal digital al relé de la bomba de combustible de la unidad {selectedVehicle.unitNumber} a través de la API Traccar.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={toggleEngineKill}
                  className={`w-full py-3.5 rounded-xl font-black text-xs transition shadow-sm flex items-center justify-center gap-2 ${
                    engineKilled
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {engineKilled ? (
                    <>
                      <Unlock className="w-4 h-4" /> RE-ACTIVAR MOTOR DE UNIDAD {selectedVehicle.unitNumber}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> ACTIVAR PARO DE MOTOR DE EMERGENCIA
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Historial de Comandos IoT</div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700 font-medium">Lectura Telemetría Sensores</span>
                  <span className="text-slate-400 font-mono text-[10px]">Hace 1 min</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700 font-medium">Validación Geocerca Caseta Querétaro</span>
                  <span className="text-slate-400 font-mono text-[10px]">Hace 42 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
