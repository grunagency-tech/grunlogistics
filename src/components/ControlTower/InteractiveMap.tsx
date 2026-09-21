import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { ChevronRight, X } from 'lucide-react';

export const InteractiveMap: React.FC = () => {
  const { trips, cedis, openDecisionDetail } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [selectedVehicle, setSelectedVehicle] = React.useState<{
    unit: string;
    tripId: string;
    destination: string;
    eta: string;
    risk: string;
    delay: string;
    customer: string;
  } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if re-mounting
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map centered on Central Mexico (CDMX / QRO / SLP corridor)
    const map = L.map(mapContainerRef.current, {
      center: [21.5, -99.8],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Custom Zoom Control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // CartoDB Positron Light Tiles (Ultra-clean Apple/Stripe map aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // 1. Draw CEDIS Nodes (Clean dark markers with labels)
    cedis.forEach((c) => {
      const icon = L.divIcon({
        className: 'custom-cedis-marker',
        html: `
          <div style="display: flex; items-center; gap: 4px; background: rgba(255,255,255,0.92); border: 1px solid #CBD5E1; padding: 2px 6px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-family: Inter, sans-serif; font-size: 10px; font-weight: 600; color: #1E293B; whitespace: nowrap;">
            <span style="width: 6px; height: 6px; background-color: #0284C7; border-radius: 50%; display: inline-block;"></span>
            <span>${c.name.split('/')[0].trim()}</span>
          </div>
        `,
        iconSize: [110, 20],
        iconAnchor: [55, 10]
      });

      L.marker([c.coordinates.lat, c.coordinates.lng], { icon }).addTo(map);
    });

    // 2. Draw Real Route Polylines
    // Trip 5831 Route (CDMX Sur -> Km 42 Autopista 57D -> CEDIS Vallejo)
    const route5831 = L.polyline(
      [
        [19.285, -99.143], // CDMX Sur
        [19.420, -99.180], // Periférico
        [19.825, -99.281], // Km 42 MEX-QRO
        [19.498, -99.162]  // CEDIS Vallejo
      ],
      { color: '#F43F5E', weight: 4, opacity: 0.8, dashArray: '6, 6' }
    ).addTo(map);

    // Trip 5844 Route (SLP -> Matehuala -> MTY)
    const route5844 = L.polyline(
      [
        [22.156, -100.985], // SLP
        [23.642, -100.644], // Matehuala
        [25.781, -100.189]  // MTY
      ],
      { color: '#F59E0B', weight: 3, opacity: 0.8, dashArray: '4, 4' }
    ).addTo(map);

    // 3. Draw Vehicle Markers
    // Vehicle 184 (Trip 5831 - Critical Red)
    const icon184 = L.divIcon({
      className: 'vehicle-marker-184',
      html: `
        <div style="position: relative; cursor: pointer;">
          <div style="position: absolute; width: 32px; height: 32px; background: rgba(244, 63, 94, 0.25); border-radius: 50%; top: -8px; left: -8px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 24px; height: 24px; background: #FFFFFF; border: 3px solid #F43F5E; border-radius: 50%; display: flex; items-center; justify-content: center; font-family: Inter, sans-serif; font-size: 10px; font-weight: 700; color: #1E293B; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
            184
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker184 = L.marker([19.825, -99.281], { icon: icon184 }).addTo(map);
    marker184.on('click', () => {
      setSelectedVehicle({
        unit: '184',
        tripId: 'D-5831',
        destination: 'CEDIS Vallejo / Norte',
        eta: '18:42 (Committed: 18:00)',
        risk: 'High (87%)',
        delay: '+14 min',
        customer: 'TechLogistics Corp'
      });
    });

    // Vehicle 104 (Trip 5844 - Attention Yellow)
    const icon104 = L.divIcon({
      className: 'vehicle-marker-104',
      html: `
        <div style="width: 22px; height: 22px; background: #FFFFFF; border: 2.5px solid #F59E0B; border-radius: 50%; display: flex; items-center; justify-content: center; font-family: Inter, sans-serif; font-size: 9px; font-weight: 700; color: #1E293B; box-shadow: 0 2px 4px rgba(0,0,0,0.15); cursor: pointer;">
          104
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    const marker104 = L.marker([23.642, -100.644], { icon: icon104 }).addTo(map);
    marker104.on('click', () => {
      setSelectedVehicle({
        unit: '104',
        tripId: 'D-5844',
        destination: 'CEDIS MTY Apodaca',
        eta: '19:48 (Committed: 19:00)',
        risk: 'Medium (74%)',
        delay: '+38 min',
        customer: 'AutoMotriz del Norte'
      });
    });

    // Vehicle 201 (Standby candidate - Emerald green)
    const icon201 = L.divIcon({
      className: 'vehicle-marker-201',
      html: `
        <div style="width: 18px; height: 18px; background: #10B981; border: 2px solid #FFFFFF; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: pointer;" title="Unidad 201 en Standby"></div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    L.marker([19.542, -99.210], { icon: icon201 }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [cedis]);

  return (
    <div className="relative bg-[#F3F4F6] border border-slate-200/80 rounded-2xl h-[420px] flex flex-col justify-between overflow-hidden shadow-sm select-none">
      {/* Header Overlay */}
      <div className="flex items-center justify-between z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-t-2xl border-b border-slate-200/60 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-800">Operational Map — Mexico Logistics Corridors</span>
        </div>
        <div className="flex items-center space-x-4 text-slate-500 font-sans text-xs">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Critical</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Attention</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Standby / Normal</span>
          </span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Card on Vehicle Click */}
      {selectedVehicle && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-lg w-72 text-xs space-y-2.5 animate-fadeIn z-20">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-slate-900 text-sm">Vehicle {selectedVehicle.unit}</div>
              <div className="text-slate-500 text-xs font-medium">{selectedVehicle.customer}</div>
            </div>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Destination:</span>
              <span className="font-medium text-slate-800">{selectedVehicle.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ETA:</span>
              <span className="font-medium text-slate-900">{selectedVehicle.eta}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Operational Risk:</span>
              <span className="font-semibold text-rose-600">{selectedVehicle.risk}</span>
            </div>
          </div>

          <button
            onClick={() => openDecisionDetail(selectedVehicle.tripId)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 rounded-lg transition-all flex items-center justify-center space-x-1 mt-1"
          >
            <span>Review decision</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      )}
    </div>
  );
};
