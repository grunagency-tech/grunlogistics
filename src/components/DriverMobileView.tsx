import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Camera,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';

export const DriverMobileView: React.FC = () => {
  const { activeSelectedTrip: trip, addOperationalEvent, updateTripStatus, setCurrentView } = useApp();

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueType, setIssueType] = useState<string>('Waiting');
  const [issueNote, setIssueNote] = useState<string>('');
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleActionClick = (actionLabel: string, category: any) => {
    addOperationalEvent(trip.id, {
      category,
      locationName: trip.currentLocationName,
      description: `Operador accionó botón: ${actionLabel} en ${trip.currentLocationName}`,
      createdBy: 'DRIVER'
    });

    if (category === 'DELIVERY') {
      updateTripStatus(trip.id, 'COMPLETED');
    } else if (category === 'ARRIVAL') {
      updateTripStatus(trip.id, 'UNLOADING');
    }

    setActionSuccessMsg(`Acción "${actionLabel}" registrada correctamente.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleReportIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOperationalEvent(trip.id, {
      category: 'REPORT_ISSUE',
      reportedIssueType: issueType,
      locationName: trip.currentLocationName,
      description: `[REPORTE OPERADOR - ${issueType.toUpperCase()}]: ${issueNote || 'Sin notas adicionadas.'}`,
      evidenceUrl: photoAttached
        ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
        : undefined,
      createdBy: 'DRIVER'
    });
    setShowIssueModal(false);
    setIssueNote('');
    setPhotoAttached(false);
    setActionSuccessMsg(`Reporte de incidencia (${issueType}) enviado a cabina de control.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 font-sans">
      {/* Mobile frame wrapper */}
      <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm tracking-wide text-white">App Operador</span>
          </div>
          <button
            onClick={() => setCurrentView('OVERVIEW')}
            className="text-xs text-slate-400 hover:text-white"
          >
            Salir a Web Admin
          </button>
        </div>

        {/* Current Trip Summary Box */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              VIAJE ACTUAL #{trip.tripNumber}
            </span>
            <span className="text-xs font-bold text-white">{trip.status}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Destino:</span>
            <h2 className="text-base font-bold text-white leading-snug">{trip.destinationName}</h2>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">Siguiente Acción:</span>
              <strong className="text-emerald-400">Arribo & Descarga</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">ETA Programado:</span>
              <strong className="text-white">{trip.deliveryAppointment}</strong>
            </div>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {actionSuccessMsg && (
          <div className="p-3 bg-emerald-900/90 text-emerald-100 rounded-xl border border-emerald-700 text-xs font-medium animate-fade-in text-center">
            {actionSuccessMsg}
          </div>
        )}

        {/* BIG TOUCH BUTTONS (Requirement 16) */}
        <div className="space-y-3 pt-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Acciones Principales del Viaje:
          </div>

          <button
            onClick={() => handleActionClick('LLEGUE A DESTINO (ARRIVED)', 'ARRIVAL')}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <MapPin className="w-5 h-5" />
            <span>ARRIVED (LLEGUÉ A DESTINO)</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleActionClick('INICIAR CARGA', 'LOADING')}
              className="py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-bold text-xs rounded-xl border border-slate-700 active:scale-95"
            >
              START LOADING
            </button>
            <button
              onClick={() => handleActionClick('INICIAR DESCARGA', 'UNLOADING')}
              className="py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-bold text-xs rounded-xl border border-slate-700 active:scale-95"
            >
              START UNLOADING
            </button>
          </div>

          <button
            onClick={() => handleActionClick('ENTREGADO (DELIVERED)', 'DELIVERY')}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>DELIVERED (ENTREGADO)</span>
          </button>

          {/* REPORT ISSUE BUTTON (Requirement 17) */}
          <button
            onClick={() => setShowIssueModal(true)}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>REPORT ISSUE (REPORTAR PROBLEMA)</span>
          </button>

          <button
            onClick={() => handleActionClick('FINALIZAR VIAJE (END TRIP)', 'DELIVERY')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl border border-slate-700"
          >
            END TRIP (FINALIZAR)
          </button>
        </div>
      </div>

      {/* REPORT ISSUE MODAL (Requirement 17) */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Reportar Incidencia / Problema</h3>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportIssueSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Selecciona el tipo de problema:
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl font-medium focus:outline-none"
                >
                  <option value="Traffic">Tráfico pesado (Traffic)</option>
                  <option value="Accident">Accidente vial (Accident)</option>
                  <option value="Waiting">Demora en rampa / Espera (Waiting)</option>
                  <option value="Customer unavailable">Cliente no disponible</option>
                  <option value="Mechanical problem">Falla mecánica unidad</option>
                  <option value="Documentation">Problema con documentos/sellos</option>
                  <option value="Security issue">Incidencia de seguridad</option>
                  <option value="Other">Otro problema</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Agregar Nota / Explicación:
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe brevemente la situación..."
                  value={issueNote}
                  onChange={(e) => setIssueNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setPhotoAttached(!photoAttached)}
                  className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center space-x-2 font-semibold text-xs transition-colors ${
                    photoAttached
                      ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>
                    {photoAttached
                      ? '✓ Fotografía Adjunta de Evidencia'
                      : 'Tomar Foto / Adjuntar Evidencia'}
                  </span>
                </button>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                >
                  Enviar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
