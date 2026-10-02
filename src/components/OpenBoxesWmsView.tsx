import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Boxes,
  Warehouse,
  Barcode,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  FileSpreadsheet,
  QrCode,
  ShieldCheck,
  Truck
} from 'lucide-react';

export interface InventoryItem {
  id: string;
  sku: string;
  description: string;
  category: string;
  warehouse: string;
  binLocation: string;
  lotNumber: string;
  expirationDate: string;
  quantityOnHand: number;
  allocatedQuantity: number;
  availableQuantity: number;
  unitOfMeasure: string;
  rotationPolicy: 'FEFO' | 'FIFO';
  status: 'OPTIMAL' | 'NEAR_EXPIRY' | 'LOW_STOCK';
}

export const initialInventory: InventoryItem[] = [
  {
    id: 'INV-1001',
    sku: 'ELE-2410-01',
    description: 'Microprocesadores Automotive ECU Grade A',
    category: 'Electrónica / JIT Auto',
    warehouse: 'CEDIS Tepotzotlán (Edomex)',
    binLocation: 'PASILLO-A-RACK-04-NIVEL-3',
    lotNumber: 'LOT-2026-089A',
    expirationDate: '2028-12-31',
    quantityOnHand: 450,
    allocatedQuantity: 200,
    availableQuantity: 250,
    unitOfMeasure: 'Cajas (100 u)',
    rotationPolicy: 'FIFO',
    status: 'OPTIMAL'
  },
  {
    id: 'INV-1002',
    sku: 'FRU-9912-04',
    description: 'Aguacate Hass de Exportación (Pallet Refrigerado)',
    category: 'Perecederos / Cadena de Frío',
    warehouse: 'CEDIS Uruapan / Michoacán',
    binLocation: 'CÁMARA-FROZEN-02-POS-12',
    lotNumber: 'LOT-FRUT-2026-92',
    expirationDate: '2026-10-15',
    quantityOnHand: 120,
    allocatedQuantity: 80,
    availableQuantity: 40,
    unitOfMeasure: 'Pallets (1.2 t)',
    rotationPolicy: 'FEFO',
    status: 'NEAR_EXPIRY'
  },
  {
    id: 'INV-1003',
    sku: 'AUT-5512-88',
    description: 'Arneses Eléctricos para Chasis Kenworth T680',
    category: 'Autopartes',
    warehouse: 'CEDIS Monterrey Apodaca',
    binLocation: 'PASILLO-C-RACK-12-NIVEL-1',
    lotNumber: 'LOT-KW-88412',
    expirationDate: '2030-01-01',
    quantityOnHand: 85,
    allocatedQuantity: 60,
    availableQuantity: 25,
    unitOfMeasure: 'Tarimas',
    rotationPolicy: 'FIFO',
    status: 'LOW_STOCK'
  },
  {
    id: 'INV-1004',
    sku: 'PHAR-3310-90',
    description: 'Vacunas y Sueros Temperatura Controlada 2-8°C',
    category: 'Farma / Sanitario',
    warehouse: 'CEDIS Guadalajara Hub',
    binLocation: 'CÁMARA-FARMA-01-POS-04',
    lotNumber: 'LOT-BIO-44910',
    expirationDate: '2026-11-30',
    quantityOnHand: 310,
    allocatedQuantity: 150,
    availableQuantity: 160,
    unitOfMeasure: 'Cajas Máster',
    rotationPolicy: 'FEFO',
    status: 'OPTIMAL'
  },
  {
    id: 'INV-1005',
    sku: 'BEV-7711-20',
    description: 'Cerveza Artesanal Exportación (Lote Premium)',
    category: 'Bebidas',
    warehouse: 'CEDIS Mérida / Yucatán',
    binLocation: 'PASILLO-D-RACK-02-NIVEL-2',
    lotNumber: 'LOT-CERV-2026-04',
    expirationDate: '2027-04-18',
    quantityOnHand: 890,
    allocatedQuantity: 400,
    availableQuantity: 490,
    unitOfMeasure: 'Cajas (24 botellas)',
    rotationPolicy: 'FIFO',
    status: 'OPTIMAL'
  }
];

export const OpenBoxesWmsView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'WAREHOUSES' | 'WAVE_PICKING' | 'BARCODE'>('INVENTORY');
  const [scanResult, setScanResult] = useState<string | null>(null);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.binLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = selectedWarehouse === 'ALL' || item.warehouse === selectedWarehouse;
    return matchesSearch && matchesWarehouse;
  });

  const simulateBarcodeScan = () => {
    const randomItem = inventory[Math.floor(Math.random() * inventory.length)];
    setScanResult(`Scanned SKU: ${randomItem.sku} | Lote: ${randomItem.lotNumber} | Bin: ${randomItem.binLocation} | Disponible: ${randomItem.availableQuantity} ${randomItem.unitOfMeasure}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0061FF] text-white tracking-wide uppercase">
              grunagency-tech / openboxes
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              WMS Multi-Almacén Activo
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">OpenBoxes WMS & Gestión de Inventarios</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Control jerárquico de almacenes en México, control por lotes (FEFO/FIFO), ubicaciones bin, picking en ola y sincronización directa con FleetOps TMS para despacho de viajes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('TRIPS')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition"
          >
            <Truck className="w-4 h-4" /> Despacho FleetOps
          </button>
          <button
            onClick={simulateBarcodeScan}
            className="px-4 py-2 bg-[#0061FF] hover:bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Barcode className="w-4 h-4" /> Simular Escáner Barcode
          </button>
        </div>
      </div>

      {/* Barcode scan alert notification */}
      {scanResult && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-blue-900 text-sm font-medium animate-fadeIn">
          <div className="flex items-center gap-3">
            <QrCode className="w-5 h-5 text-[#0061FF] shrink-0" />
            <span>{scanResult}</span>
          </div>
          <button
            onClick={() => setScanResult(null)}
            className="text-xs font-bold text-[#0061FF] underline hover:text-blue-800"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total SKUs en Almacén</div>
            <div className="text-2xl font-black text-slate-900 mt-1">1,842 SKUs</div>
            <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% visibilidad real
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0061FF] flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CEDIS & Nodos Activos</div>
            <div className="text-2xl font-black text-[#0061FF] mt-1">5 Hubs MX</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Edomex, MTY, GDL, MÉR, Uruapan
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Warehouse className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lotes Próximos a Vencer</div>
            <div className="text-2xl font-black text-amber-600 mt-1">2 Lotes (FEFO)</div>
            <div className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Prioridad de salida FEFO
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Precisión de Picking</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">99.84%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Verificado por escáner
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'INVENTORY'
              ? 'bg-[#0061FF] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" /> Inventario & Lotes (FEFO/FIFO)
        </button>
        <button
          onClick={() => setActiveTab('WAREHOUSES')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'WAREHOUSES'
              ? 'bg-[#0061FF] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Warehouse className="w-4 h-4" /> Jerarquía de Almacenes & Bins
        </button>
        <button
          onClick={() => setActiveTab('WAVE_PICKING')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'WAVE_PICKING'
              ? 'bg-[#0061FF] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" /> Picking en Ola & Remisiones
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'INVENTORY' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por SKU, descripción, lote o ubicación bin..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0061FF]"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0061FF]"
              >
                <option value="ALL">Todos los CEDIS (México)</option>
                <option value="CEDIS Tepotzotlán (Edomex)">CEDIS Tepotzotlán (Edomex)</option>
                <option value="CEDIS Uruapan / Michoacán">CEDIS Uruapan / Michoacán</option>
                <option value="CEDIS Monterrey Apodaca">CEDIS Monterrey Apodaca</option>
                <option value="CEDIS Guadalajara Hub">CEDIS Guadalajara Hub</option>
                <option value="CEDIS Mérida / Yucatán">CEDIS Mérida / Yucatán</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-4">SKU & Descripción</th>
                  <th className="p-4">Almacén / CEDIS</th>
                  <th className="p-4">Ubicación Bin</th>
                  <th className="p-4">Lote & Vencimiento</th>
                  <th className="p-4 text-right">Disponible / Físico</th>
                  <th className="p-4">Regla Rotación</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{item.sku}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{item.description}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{item.warehouse}</td>
                    <td className="p-4 font-mono text-[11px] text-indigo-700 font-bold bg-indigo-50/50 px-2 py-1 rounded border border-indigo-100 inline-block mt-2">
                      {item.binLocation}
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-slate-900 font-semibold">{item.lotNumber}</div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" /> Exp: {item.expirationDate}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        {item.availableQuantity} {item.unitOfMeasure}
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Asignado: {item.allocatedQuantity} | Total: {item.quantityOnHand}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.rotationPolicy === 'FEFO'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {item.rotationPolicy}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {item.status === 'OPTIMAL' && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Óptimo
                        </span>
                      )}
                      {item.status === 'NEAR_EXPIRY' && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Caducidad Próxima
                        </span>
                      )}
                      {item.status === 'LOW_STOCK' && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold rounded-full inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Stock Bajo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'WAREHOUSES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-[#0061FF]" /> Red de Almacenes en México (OpenBoxes)
            </h3>
            <p className="text-xs text-slate-500">
              Jerarquía multinivel: Región &gt; CEDIS Principal &gt; Pasillo &gt; Rack &gt; Nivel &gt; Bin Posición.
            </p>
            <div className="space-y-3">
              {[
                { name: 'CEDIS Tepotzotlán (Edomex)', capacity: '88% Ocupado', bins: 4200, status: 'Operativo' },
                { name: 'CEDIS Monterrey Apodaca', capacity: '74% Ocupado', bins: 3800, status: 'Operativo' },
                { name: 'CEDIS Guadalajara Hub', capacity: '65% Ocupado', bins: 3100, status: 'Operativo' },
                { name: 'CEDIS Mérida / Yucatán', capacity: '42% Ocupado', bins: 1900, status: 'Operativo' },
                { name: 'CEDIS Uruapan / Michoacán', capacity: '91% Ocupado (Cold Chain)', bins: 1500, status: 'Alta Demanda' }
              ].map((wh, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{wh.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{wh.bins.toLocaleString()} Posiciones Bins | {wh.capacity}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    {wh.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#0061FF]" /> Protocolo de Putaway & Etiquetado GS1
            </h3>
            <p className="text-xs text-slate-500">
              Reglas automatizadas para asignación de ubicaciones según rotación, requerimientos de temperatura y compatibilidad química.
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs text-blue-900">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0061FF]" /> Sincronización Automática con FleetOps TMS
              </div>
              <p>
                Al confirmar una remisión en OpenBoxes, el inventario se reserva automáticamente y se genera la orden de transporte lista para despacho en TMS.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'WAVE_PICKING' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0061FF]" /> Olas de Picking Activas
          </h3>
          <p className="text-xs text-slate-500">
            Agrupación inteligente de pedidos por zona de almacenamiento y ruta de camión para minimizar distancias de caminata de los surtidores.
          </p>

          <div className="space-y-3">
            {[
              { id: 'WAVE-2026-088', warehouse: 'CEDIS Tepotzotlán', itemsCount: 42, tripTarget: 'TRIP-5831 (Vallejo)', progress: 95 },
              { id: 'WAVE-2026-089', warehouse: 'CEDIS Monterrey Apodaca', itemsCount: 18, tripTarget: 'TRIP-5844 (SLP)', progress: 60 }
            ].map((wave) => (
              <div key={wave.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{wave.id}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-md">
                      {wave.warehouse}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Destinado a viaje TMS: <strong className="text-slate-700">{wave.tripTarget}</strong> | {wave.itemsCount} SKUs a surtir
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0061FF] h-full" style={{ width: `${wave.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{wave.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
