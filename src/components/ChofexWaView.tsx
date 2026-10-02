import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Mic,
  FileText,
  Send,
  Bot,
  CheckCheck,
  Sparkles,
  Phone,
  Paperclip,
  Image,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  User,
  Zap
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'DRIVER' | 'CHOFEX_AI' | 'SYSTEM';
  text: string;
  timestamp: string;
  isVoiceNote?: boolean;
  voiceNoteDuration?: string;
  transcription?: string;
  hasAttachment?: boolean;
  attachmentType?: 'POD_OCR' | 'FUEL_TICKET_OCR';
  attachmentUrl?: string;
  extractedData?: Record<string, string>;
}

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'MSG-001',
    sender: 'CHOFEX_AI',
    text: '👋 ¡Hola Roberto! Tu viaje #5831 asignado (Monterrey → CEDIS Vallejo) tiene Carta Porte SAT #4A8F92C1 lista. ¿Dudas con la ruta o peajes?',
    timestamp: '06:05 AM'
  },
  {
    id: 'MSG-002',
    sender: 'DRIVER',
    text: '🎙️ Nota de voz (0:14 s)',
    timestamp: '11:22 AM',
    isVoiceNote: true,
    voiceNoteDuration: '0:14',
    transcription: 'Chofex, ya cargué diésel en la gasolinera de Matehuala. Te paso la foto del ticket para que lo metas al sistema.'
  },
  {
    id: 'MSG-003',
    sender: 'CHOFEX_AI',
    text: '✅ **Ticket procesado con Visión OCR:**\n• Gasolinera: Matehuala Km 182\n• Litros: 346 L\n• Monto: $8,140.00 MXN\n\nRegistrado en la bitácora financiera del Viaje #5831.',
    timestamp: '11:23 AM',
    hasAttachment: true,
    attachmentType: 'FUEL_TICKET_OCR',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    extractedData: {
      Gasolinera: 'Matehuala Km 182',
      Litros: '346 L',
      Total: '$8,140 MXN'
    }
  },
  {
    id: 'MSG-004',
    sender: 'DRIVER',
    text: '🎙️ Nota de voz (0:09 s)',
    timestamp: '02:35 PM',
    isVoiceNote: true,
    voiceNoteDuration: '0:09',
    transcription: 'Ya llegué al CEDIS Vallejo, pero hay un filón de tráilers en la rampa 4.'
  },
  {
    id: 'MSG-005',
    sender: 'CHOFEX_AI',
    text: '🕒 **Estatus Registrado (Espera en Rampa):**\nHe iniciado el contador de tiempo de espera. Si superas los 30 minutos libres, generaré automáticamente el cobro de estadías ($1,500 MXN) para el cliente TechLogistics.',
    timestamp: '02:36 PM'
  }
];

export const ChofexWaView: React.FC = () => {
  const { trips, setCurrentView, uploadPodDocument, uploadExpenseTicket } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputText, setInputText] = useState('');
  const [simulatingSpeech, setSimulatingSpeech] = useState(false);
  const [simulatingOCR, setSimulatingOCR] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'DRIVER',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        sender: 'CHOFEX_AI',
        text: `🤖 Comprendido, Roberto. Tu reporte ha sido procesado por el motor Chofex e integrado al tablero del despachador en tiempo real.`,
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 700);
  };

  const handleSimulateVoiceNote = () => {
    setSimulatingSpeech(true);
    setTimeout(() => {
      setSimulatingSpeech(false);
      const voiceMsg: ChatMessage = {
        id: `MSG-${Date.now()}`,
        sender: 'DRIVER',
        text: '🎙️ Nota de voz (0:18 s)',
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        isVoiceNote: true,
        voiceNoteDuration: '0:18',
        transcription: 'Chofex, ya me firmaron el POD en la rampa de Vallejo. Todo completo sin faltantes.'
      };

      const aiReply: ChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        sender: 'CHOFEX_AI',
        text: '🎙️ **Transcripción Whisper AI:** *"Chofex, ya me firmaron el POD..."*\n\n✅ POD recibido y validado. Estatus del Viaje #5831 actualizado a ENTREGADO.',
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, voiceMsg, aiReply]);
      uploadPodDocument('TRIP-5831', 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80');
    }, 1200);
  };

  const handleSimulateEpodOcr = () => {
    setSimulatingOCR(true);
    setTimeout(() => {
      setSimulatingOCR(false);
      const ocrMsg: ChatMessage = {
        id: `MSG-${Date.now()}`,
        sender: 'DRIVER',
        text: '📷 Foto de Evidencia POD de Entrega',
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        hasAttachment: true,
        attachmentType: 'POD_OCR',
        attachmentUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80',
        extractedData: {
          'Folio Remisión': 'REM-2026-9912',
          'Sello Receptor': 'CEDIS Vallejo Andén 4',
          Faltantes: '0 Cajas (100% Completo)',
          Hora: '18:47 hrs'
        }
      };

      const aiReply: ChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        sender: 'CHOFEX_AI',
        text: '⚡ **Visión Multimodal OCR e-POD Procesada:**\nDocumento escaneado exitosamente con 99.8% de precisión. La factura digital ha sido enviada al portal del cliente TechLogistics.',
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, ocrMsg, aiReply]);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 tracking-wide uppercase">
              Aldood12 / grun-viaje / chofex
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Asistente IA WhatsApp para Choferes
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Chofex WhatsApp Copilot & Audio Whisper</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Asistente conversacional para operadores de tráiler. Transcripción de audios con Whisper, Visión OCR para e-POD y comprobantes de diésel, y reportes automáticos de estatus.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('TRIPS')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 transition"
          >
            <Bot className="w-4 h-4" /> Despacho FleetOps
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: WhatsApp Chat Sandbox */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  Chofex Copilot (Chofer: Roberto Gómez - Unidad 184)
                </h3>
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> WhatsApp Business API Activa
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateVoiceNote}
                disabled={simulatingSpeech}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Mic className="w-3.5 h-3.5" /> Simular Audio Whisper
              </button>
              <button
                onClick={handleSimulateEpodOcr}
                disabled={simulatingOCR}
                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <FileCheck className="w-3.5 h-3.5" /> Simular Visión OCR POD
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#efeae2]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'DRIVER' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs shadow-xs space-y-2 ${
                    msg.sender === 'DRIVER'
                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-line font-medium leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Voice Note Transcription block */}
                  {msg.isVoiceNote && (
                    <div className="p-2.5 bg-black/5 rounded-xl text-[11px] space-y-1">
                      <div className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-emerald-600" /> Transcripción Whisper AI:
                      </div>
                      <p className="italic text-slate-800">"{msg.transcription}"</p>
                    </div>
                  )}

                  {/* Attachment OCR Extracted Data block */}
                  {msg.hasAttachment && msg.extractedData && (
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#0061FF]" /> Visión Multimodal OCR
                      </div>
                      {Object.entries(msg.extractedData).map(([key, val]) => (
                        <div key={key} className="text-[11px] flex justify-between">
                          <span className="text-slate-500">{key}:</span>
                          <span className="font-bold text-slate-900">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-right font-medium flex items-center justify-end gap-1">
                    {msg.timestamp} <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje como chofer a Chofex..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <button
              onClick={handleSendMessage}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Ingestion Engine & Capabilities */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" /> Ingestión de Órdenes Pre-TMS
            </h3>
            <p className="text-xs text-slate-500">
              Chofex procesa PDFs de clientes, correos electrónicos con órdenes de carga y mensajes WhatsApp para crear viajes automáticamente en FleetOps TMS.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Precisión Whisper STT:</span>
                <span className="font-mono font-bold text-emerald-600">99.4% Esp. MX</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Visión OCR e-POD:</span>
                <span className="font-mono font-bold text-emerald-600">Reconocimiento Sello/Firma</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Velocidad Respuesta AI:</span>
                <span className="font-mono font-bold text-slate-900">&lt; 1.2 segundos</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> Sincronización Multicanal
            </h3>
            <p className="text-xs text-slate-500">
              Al confirmar cualquier evento por WhatsApp, la Torre de Control, el módulo de Rentabilidad GrünLogistics y el WMS OpenBoxes quedan 100% alineados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
