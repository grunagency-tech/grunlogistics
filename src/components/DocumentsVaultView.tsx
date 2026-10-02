import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Folder,
  FileText,
  Download,
  Share2,
  Upload,
  Search,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Grid,
  List as ListIcon
} from 'lucide-react';

interface VaultFile {
  id: string;
  name: string;
  category: 'CARTA_PORTE' | 'MONEY_RECOVERY' | 'DIESEL_TICKET' | 'INSURANCE';
  size: string;
  updatedAt: string;
  downloadUrl: string;
  tripNumber?: string;
  status: 'SYNCHRONIZED' | 'PENDING';
}

export const DocumentsVaultView: React.FC = () => {
  const { setCurrentView, openTripDetail } = useApp();
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('ALL');
  const [shareModalFile, setShareModalFile] = useState<VaultFile | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const vaultFiles: VaultFile[] = [
    {
      id: 'DOC-001',
      name: 'Carta_Porte_SAT_3.1_5831.pdf',
      category: 'CARTA_PORTE',
      size: '245 KB',
      updatedAt: 'Hace 10 min',
      downloadUrl: '/Carta_Porte_SAT_3.1_5831.pdf',
      tripNumber: '5831',
      status: 'SYNCHRONIZED'
    },
    {
      id: 'DOC-002',
      name: 'Carta_Reclamacion_Estadia_5831.pdf',
      category: 'MONEY_RECOVERY',
      size: '180 KB',
      updatedAt: 'Hace 25 min',
      downloadUrl: '/Carta_Reclamacion_Estadia_5831.pdf',
      tripNumber: '5831',
      status: 'SYNCHRONIZED'
    },
    {
      id: 'DOC-003',
      name: 'TRIPS_demo_import.csv',
      category: 'CARTA_PORTE',
      size: '42 KB',
      updatedAt: 'Hoy 14:20',
      downloadUrl: '/TRIPS_demo_import.csv',
      status: 'SYNCHRONIZED'
    },
    {
      id: 'DOC-004',
      name: 'Poliza_Seguro_Carga_Qualitas_2026.pdf',
      category: 'INSURANCE',
      size: '1.2 MB',
      updatedAt: 'Ayer 09:15',
      downloadUrl: '/Carta_Porte_SAT_3.1_5831.pdf',
      status: 'SYNCHRONIZED'
    },
    {
      id: 'DOC-005',
      name: 'Ticket_Diesel_Gasolinera_Tepotzotlan_184.pdf',
      category: 'DIESEL_TICKET',
      size: '512 KB',
      updatedAt: 'Ayer 18:40',
      downloadUrl: '/Carta_Porte_SAT_3.1_5831.pdf',
      tripNumber: '5831',
      status: 'SYNCHRONIZED'
    }
  ];

  const filteredFiles = vaultFiles.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchFilter.toLowerCase()) || (f.tripNumber && f.tripNumber.includes(searchFilter));
    const matchesFolder = selectedFolder === 'ALL' || f.category === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleCopyShareLink = (file: VaultFile) => {
    const fakeLink = `https://grunlogistics.grunagency.workers.dev/transfer/${file.id}`;
    navigator.clipboard.writeText(fakeLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-slate-900 font-sans p-6 md:p-10 space-y-8 select-none">
      
      {/* DROPBOX-INSPIRED HERO BANNER */}
      <div className="bg-[#1E1915] text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#0061FF]/20 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-[#0061FF] text-white px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider uppercase">
              <span>DROPBOX STYLE VAULT & TRANSFER</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-[#F7F5F2]">
              Tus documentos logísticos, sincronizados y seguros en un solo lugar.
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed">
              Guarda, organiza y comparte las Cartas Porte SAT 3.1, reportes de cobranza de estadías y tickets de combustible con 1 click.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => setCurrentView('TRIPS')}
              className="px-6 py-3.5 bg-[#0061FF] hover:bg-[#0052D6] text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Archivo o Manifiesto</span>
            </button>
          </div>
        </div>

        {/* Dropbox Storage Usage Indicator */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-[#0061FF]" />
            <span>Almacenamiento Usado: <strong>14.2 GB de 2 TB</strong> (Encriptación AES-256)</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Sincronización Automática Activa</span>
          </div>
        </div>
      </div>

      {/* FOLDERS GRID (Dropbox Style Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
            CARPETAS PRINCIPALES
          </h2>
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('LIST')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'LIST' ? 'bg-[#0061FF] text-white font-bold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'GRID' ? 'bg-[#0061FF] text-white font-bold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setSelectedFolder('CARTA_PORTE')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              selectedFolder === 'CARTA_PORTE'
                ? 'bg-white border-[#0061FF] ring-2 ring-[#0061FF]/20 shadow-md'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0061FF] flex items-center justify-center">
              <Folder className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Cartas Porte SAT 3.1</div>
              <div className="text-xs text-slate-500 mt-0.5">148 archivos · 12.4 MB</div>
            </div>
          </div>

          <div
            onClick={() => setSelectedFolder('MONEY_RECOVERY')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              selectedFolder === 'MONEY_RECOVERY'
                ? 'bg-white border-[#0061FF] ring-2 ring-[#0061FF]/20 shadow-md'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Folder className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Cobranza & Estadías (PDF)</div>
              <div className="text-xs text-slate-500 mt-0.5">34 archivos · 8.2 MB</div>
            </div>
          </div>

          <div
            onClick={() => setSelectedFolder('DIESEL_TICKET')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              selectedFolder === 'DIESEL_TICKET'
                ? 'bg-white border-[#0061FF] ring-2 ring-[#0061FF]/20 shadow-md'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Folder className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Tickets & Evidencias POD</div>
              <div className="text-xs text-slate-500 mt-0.5">210 archivos · 45.1 MB</div>
            </div>
          </div>

          <div
            onClick={() => setSelectedFolder('INSURANCE')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              selectedFolder === 'INSURANCE'
                ? 'bg-white border-[#0061FF] ring-2 ring-[#0061FF]/20 shadow-md'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Folder className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Pólizas & Permisos SCT</div>
              <div className="text-xs text-slate-500 mt-0.5">12 archivos · 3.5 MB</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILES TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar documento o # viaje..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#0061FF] focus:bg-white text-xs pl-9 pr-4 py-2.5 rounded-xl outline-none"
              />
            </div>
            {selectedFolder !== 'ALL' && (
              <button
                onClick={() => setSelectedFolder('ALL')}
                className="text-xs font-bold text-[#0061FF] hover:underline shrink-0"
              >
                Ver todos
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            {filteredFiles.length} documentos disponibles
          </div>
        </div>

        {/* Files Table / Grid */}
        {viewMode === 'LIST' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Nombre del Archivo</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Tamaño</th>
                  <th className="p-3">Última Modificación</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-3 font-bold text-slate-900 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0061FF] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div>{file.name}</div>
                        {file.tripNumber && (
                          <span className="text-[10px] text-slate-400 font-mono">Asociado a Viaje #{file.tripNumber}</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-bold text-[10px] uppercase font-mono">
                        {file.category}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-slate-500">{file.size}</td>

                    <td className="p-3 text-slate-500">{file.updatedAt}</td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setShareModalFile(file)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5 text-[#0061FF]" />
                          <span>Compartir</span>
                        </button>
                        <a
                          href={file.downloadUrl}
                          download
                          className="px-3 py-1.5 bg-[#0061FF] hover:bg-[#0052D6] text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0061FF] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{file.size}</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{file.updatedAt}</div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => setShareModalFile(file)}
                    className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg text-center"
                  >
                    Compartir
                  </button>
                  <a
                    href={file.downloadUrl}
                    download
                    className="flex-1 py-1.5 bg-[#0061FF] text-white text-xs font-bold rounded-lg text-center shadow-xs"
                  >
                    Descargar
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DROPBOX TRANSFER SHARE MODAL */}
      {shareModalFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 font-sans text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-[#0061FF]">
                <Share2 className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Compartir con Dropbox Transfer</h3>
              </div>
              <button onClick={() => setShareModalFile(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#F7F5F2] rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900">{shareModalFile.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">Tamaño: {shareModalFile.size} · Protegido con cifrado</div>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Enlace seguro de descarga para cliente:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={`https://grunlogistics.grunagency.workers.dev/transfer/${shareModalFile.id}`}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700"
                />
                <button
                  onClick={() => handleCopyShareLink(shareModalFile)}
                  className="px-4 py-2.5 bg-[#0061FF] hover:bg-[#0052D6] text-white font-bold rounded-xl shrink-0 flex items-center space-x-1"
                >
                  {linkCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{linkCopied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center">
              El enlace expira en 7 días · Notificación de descarga enviada automáticamente
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
