import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CostItem } from '../types';
import {
  Smartphone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Receipt,
  ArrowLeft,
  X,
  FileCheck,
  Fuel,
  DollarSign
} from 'lucide-react';

export const DriverMobileView: React.FC = () => {
  const {
    activeSelectedTrip: trip,
    addOperationalEvent,
    updateTripStatus,
    uploadExpenseTicket,
    uploadPodDocument,
    setCurrentView
  } = useApp();

  // Modals state
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Issue modal fields
  const [issueType, setIssueType] = useState<string>('Waiting');
  const [issueNote, setIssueNote] = useState<string>('');
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);

  // Ticket / Expense / POD modal fields
  const [ticketType, setTicketType] = useState<'Fuel' | 'Tolls' | 'POD' | 'Meals' | 'Lodging' | 'Other'>('Fuel');
  const [ticketAmount, setTicketAmount] = useState<number>(850);
  const [ticketNotes, setTicketNotes] = useState<string>('Ticket de Carga de Diésel Gasolinera Pemex');
  const [ticketPhotoAttached, setTicketPhotoAttached] = useState<boolean>(true);

  // Feedback message
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
      description: `[REPORTE OPERADOR - ${issueType.toUpperCase()}]: ${issueNote || 'Sin notas adicionales.'}`,
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

  const handleUploadTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const photoUrl = ticketPhotoAttached
      ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
      : undefined;

    if (ticketType === 'POD') {
      uploadPodDocument(
        trip.id,
        photoUrl || 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80'
      );
      setActionSuccessMsg('¡Documento POD cargado exitosamente! Actualizado en el Dashboard.');
    } else {
      const costCategory: CostItem['category'] =
        ticketType === 'Fuel'
          ? 'Fuel'
          : ticketType === 'Tolls'
          ? 'Tolls'
          : ticketType === 'Meals'
          ? 'Meals'
          : ticketType === 'Lodging'
          ? 'Lodging'
          : 'Other expenses';

      uploadExpenseTicket(trip.id, costCategory, ticketAmount, ticketNotes, photoUrl);
      setActionSuccessMsg(
        `¡Ticket de ${ticketType} ($${ticketAmount} MXN) cargado e impactado en Trip Economics!`
      );
    }

    setShowTicketModal(false);
    setTicketNotes('');
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 font-sans relative">
      {/* ALWAYS VISIBLE TOP EXIT NAVIGATION BAR */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between bg-emerald-950/90 border border-emerald-700/80 px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-md">
        <button
          onClick={() => setCurrentView('OVERVIEW')}
          className="flex items-center space-x-2 text-white font-bold text-xs hover:text-emerald-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Volver al Dashboard Web</span>
        </button>
        <span className="text-[10px] text-emerald-300 font-mono bg-emerald-900/60 px-2 py-0.5 rounded">
          Modo Chofer
        </span>
      </div>

      {/* Mobile Frame Wrapper */}
      <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5 mb-16">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm tracking-wide text-white">App Operador</span>
          </div>
          <button
            onClick={() => setCurrentView('OVERVIEW')}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            ← Salir a Admin
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
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Cliente & Destino:
            </span>
            <h2 className="text-base font-bold text-white leading-snug">{trip.destinationName}</h2>
            <div className="text-xs text-slate-400 mt-0.5">{trip.customerName}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">Siguiente Acción:</span>
              <strong className="text-emerald-400">Arribo & Descarga</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Cita Entrega:</span>
              <strong className="text-white">{trip.deliveryAppointment}</strong>
            </div>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {actionSuccessMsg && (
          <div className="p-3 bg-emerald-900/90 text-emerald-100 rounded-xl border border-emerald-700 text-xs font-semibold animate-fade-in text-center shadow-lg">
            {actionSuccessMsg}
          </div>
        )}

        {/* BIG TOUCH BUTTONS (Requirement 16 & Upload Ticket requirement) */}
        <div className="space-y-3 pt-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Acciones de Ruta & Captura de Gastos:
          </div>

          {/* UPLOAD TICKET / EXPENSE / POD BUTTON (NEW REQUIREMENT) */}
          <button
            onClick={() => setShowTicketModal(true)}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 border border-emerald-500/50"
          >
            <Receipt className="w-5 h-5 text-emerald-200" />
            <span>SUBIR TICKET / GASTO / POD (FOTO)</span>
          </button>

          <button
            onClick={() => handleActionClick('LLEGUE A DESTINO (ARRIVED)', 'ARRIVAL')}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
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

          {/* REPORT ISSUE BUTTON */}
          <button
            onClick={() => setShowIssueModal(true)}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>REPORT ISSUE (REPORTAR PROBLEMA)</span>
          </button>
        </div>
      </div>

      {/* FLOATING QUICK EXIT BUTTON AT BOTTOM */}
      <div className="fixed bottom-3 z-40">
        <button
          onClick={() => setCurrentView('OVERVIEW')}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-full border border-slate-600 shadow-2xl flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Regresar a la Web Principal Admin</span>
        </button>
      </div>

      {/* UPLOAD TICKET / EXPENSE / POD MODAL */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Captura de Ticket / Foto Gasto</h3>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tipo de Documento / Gasto:
                </label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl font-medium focus:outline-none"
                >
                  <option value="Fuel">Ticket de Diésel / Gasolinera</option>
                  <option value="Tolls">Comprobante de Caseta / Peaje</option>
                  <option value="POD">Proof of Delivery (POD / Sello Firmado)</option>
                  <option value="Meals">Viáticos de Alimentos</option>
                  <option value="Lodging">Hospedaje</option>
                  <option value="Other">Otro Gasto Imprevisto</option>
                </select>
              </div>

              {ticketType !== 'POD' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Monto del Ticket (MXN):
                  </label>
                  <input
                    type="number"
                    value={ticketAmount}
                    onChange={(e) => setTicketAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-emerald-400 p-2.5 rounded-xl font-mono font-bold text-sm focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nota / Nombre de Gasolinera o Caseta:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Pemex Matehuala Km 182 / Caseta Tepotzotlán"
                  value={ticketNotes}
                  onChange={(e) => setTicketNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              {ticketType === 'POD' ? (
                <div className="space-y-3">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Firma Digital Táctil del Receptor (e-POD):
                  </label>
                  <div className="w-full h-32 bg-slate-950 border-2 border-dashed border-[#0061FF]/60 rounded-xl relative flex items-center justify-center p-2 text-slate-400 select-none cursor-crosshair">
                    {/* Simulated digital touch signature line */}
                    <svg className="absolute inset-0 w-full h-full stroke-[#0061FF] stroke-2 fill-none pointer-events-none">
                      <path d="M 30 70 Q 70 20 120 60 T 200 50 T 280 80" />
                    </svg>
                    <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[#0061FF] bg-[#EDF5FF]/10 px-2 py-0.5 rounded border border-[#0061FF]/30">
                      ✓ Firma Táctil Registrada
                    </div>
                  </div>

                  {/* AI Multimodal Vision OCR audit result */}
                  <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-1 text-[11px]">
                    <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auditoría IA Multimodal (e-POD Vision OCR):</span>
                    </div>
                    <p className="text-slate-300">
                      ✓ Sello de almacén legible detectado · Folio remisión: <strong>#REM-94820</strong> · Salvedades / Daños: <strong>0 RECHAZOS</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setTicketPhotoAttached(!ticketPhotoAttached)}
                    className={`w-full py-3 px-3 rounded-xl border flex items-center justify-center space-x-2 font-bold text-xs transition-colors ${
                      ticketPhotoAttached
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>
                      {ticketPhotoAttached
                        ? '✓ Fotografía del Ticket / POD Capturada'
                        : 'Capturar Foto con la Cámara del Celular'}
                    </span>
                  </button>
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                >
                  Subir & Enviar a Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
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
