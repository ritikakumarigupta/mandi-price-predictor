import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GlassCard } from '../components/common/GlassCard';
import { Navigation, Award, Fuel, Filter, MapPin, LocateFixed, Edit3 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

// Robust Glowing SVG Marker Icon that doesn't depend on external assets
const createCustomMandiIcon = (isBest) => {
  return L.divIcon({
    className: 'custom-mandi-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: ${isBest ? '#F59E0B' : '#10B981'}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: ${isBest ? '#D97706' : '#059669'}; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 900;">
          ${isBest ? '★' : '₹'}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

// Component to invalidate map size when mounted or state changes
function MapInvalidator({ center }) {
  const map = useMap();
  React.useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      if (center) {
        map.setView(center, map.getZoom(), { animate: true });
      }
    }, 250);
  }, [map, center]);
  return null;
}

// Calculate distance using Haversine formula
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// All-India Mandi Geo Registry with coordinates and regional rates
export const ALL_INDIA_MANDI_LOCATIONS = [
  // Jharkhand
  { id: 'ranchi_pandra', name: 'Ranchi Pandra Krishi Bazar', state: 'Jharkhand', stateHi: 'झारखंड', modalPrice: 3324, lat: 23.3728, lng: 85.3216 },
  { id: 'dhanbad_apmc', name: 'Dhanbad APMC Bazar Samiti', state: 'Jharkhand', stateHi: 'झारखंड', modalPrice: 3280, lat: 23.7957, lng: 86.4304 },
  { id: 'jamshedpur_parsudih', name: 'Jamshedpur Parsudih Mandi', state: 'Jharkhand', stateHi: 'झारखंड', modalPrice: 3310, lat: 22.8046, lng: 86.2029 },

  // Bihar
  { id: 'patna_city', name: 'Patna City APMC', state: 'Bihar', stateHi: 'बिहार', modalPrice: 3297, lat: 25.5941, lng: 85.1376 },
  { id: 'khagaul', name: 'Khagaul Sub-Yard', state: 'Bihar', stateHi: 'बिहार', modalPrice: 3240, lat: 25.5786, lng: 85.0442 },
  { id: 'muzaffarpur', name: 'Muzaffarpur Krishi Upaj', state: 'Bihar', stateHi: 'बिहार', modalPrice: 3350, lat: 26.1209, lng: 85.3647 },
  { id: 'gaya', name: 'Gaya APMC Market', state: 'Bihar', stateHi: 'बिहार', modalPrice: 3270, lat: 24.7955, lng: 84.9994 },

  // Uttar Pradesh
  { id: 'varanasi', name: 'Varanasi Main Yard', state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', modalPrice: 3260, lat: 25.3176, lng: 82.9739 },
  { id: 'lucknow', name: 'Lucknow APMC', state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', modalPrice: 3310, lat: 26.8467, lng: 80.9462 },

  // Punjab & Haryana
  { id: 'ludhiana', name: 'Ludhiana Dana Mandi', state: 'Punjab', stateHi: 'पंजाब', modalPrice: 2490, lat: 30.9010, lng: 75.8573 },
  { id: 'karnal', name: 'Karnal New Grain Market', state: 'Haryana', stateHi: 'हरियाणा', modalPrice: 2540, lat: 29.6857, lng: 76.9905 },

  // Maharashtra
  { id: 'lasalgaon', name: 'Lasalgaon Onion Market', state: 'Maharashtra', stateHi: 'महाराष्ट्र', modalPrice: 2030, lat: 20.1477, lng: 74.2259 },
  { id: 'pune', name: 'Pune Gultekdi APMC', state: 'Maharashtra', stateHi: 'महाराष्ट्र', modalPrice: 2180, lat: 18.5204, lng: 73.8567 },

  // Madhya Pradesh
  { id: 'indore', name: 'Indore Krishi Upaj', state: 'Madhya Pradesh', stateHi: 'मध्य प्रदेश', modalPrice: 2480, lat: 22.7196, lng: 75.8577 },

  // Rajasthan
  { id: 'jaipur', name: 'Muhana Mandi Jaipur', state: 'Rajasthan', stateHi: 'राजस्थान', modalPrice: 2520, lat: 26.9124, lng: 75.7873 },
  { id: 'kota', name: 'Kota Bhamashah Mandi', state: 'Rajasthan', stateHi: 'राजस्थान', modalPrice: 2590, lat: 25.2138, lng: 75.8648 },
];

export const NearbyMandiPage = () => {
  const { lang, t } = useLanguage();
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [sortField, setSortField] = useState('netReturn');
  const [costPerKm, setCostPerKm] = useState(2.5); // Default transport cost ₹2.5 / quintal / km
  const [userLocation, setUserLocation] = useState(null); // { lat, lng, name }
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  // Handle GPS Geolocation (Prompt 9: GPS permission with district fallback)
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(lang === 'hi' ? 'जीपीएस समर्थित नहीं है' : 'GPS not supported');
      return;
    }

    setLocating(true);
    setLocationStatus(lang === 'hi' ? 'स्थान खोजा जा रहा है...' : 'Acquiring GPS fix...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: lang === 'hi' ? 'मेरा वर्तमान स्थान' : 'My Current Location',
        });
        setLocating(false);
        setLocationStatus(lang === 'hi' ? 'जीपीएस स्थान प्राप्त हुआ' : 'GPS location acquired');
      },
      (error) => {
        setLocating(false);
        setLocationStatus(
          lang === 'hi' 
            ? 'जीपीएस अनुमति नहीं मिली, डिफ़ॉल्ट पटना/रांची इस्तेमाल हो रहा है' 
            : 'GPS permission denied, using default regional fallback'
        );
        // Fallback location: Patna (25.5941, 85.1376)
        setUserLocation({
          lat: 25.5941,
          lng: 85.1376,
          name: 'Patna (District Fallback)',
        });
      },
      { timeout: 8000 }
    );
  };

  // Base coordinates for distance calculation (Default: Patna)
  const refLat = userLocation?.lat || 25.5941;
  const refLng = userLocation?.lng || 85.1376;

  // Enrich mandis with dynamic distance and net profit
  const enrichedMandis = ALL_INDIA_MANDI_LOCATIONS.map(m => {
    const dist = calculateHaversineDistance(refLat, refLng, m.lat, m.lng);
    const transportEst = Math.round(dist * costPerKm);
    const net = m.modalPrice - transportEst;
    return {
      ...m,
      distanceKm: dist,
      transportCostEstimate: transportEst,
      netReturn: net,
    };
  });

  // Identify the highest profit mandi
  const maxNetReturn = Math.max(...enrichedMandis.map(m => m.netReturn));
  const mandisWithBestFlag = enrichedMandis.map(m => ({
    ...m,
    isBest: m.netReturn === maxNetReturn,
  }));

  const filteredMandis = selectedStateFilter === 'ALL'
    ? mandisWithBestFlag
    : mandisWithBestFlag.filter(m => m.state === selectedStateFilter);

  const sortedMandis = [...filteredMandis].sort((a, b) => {
    if (sortField === 'distanceKm') return a.distanceKm - b.distanceKm;
    if (sortField === 'modalPrice') return b.modalPrice - a.modalPrice;
    return b.netReturn - a.netReturn;
  });

  const availableStates = ['ALL', 'Jharkhand', 'Bihar', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Maharashtra', 'Madhya Pradesh', 'Rajasthan'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl glass-panel bg-slate-900/85 border border-emerald-500/25 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>All-India Mandi Geo-Mapping (8 States)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            {lang === 'hi' ? 'अखिल भारतीय मंडी नक्शा व परिवहन विश्लेषण' : 'All-India Mandi GIS Map & Profit Route'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {lang === 'hi' 
              ? 'बिहार, यूपी, झारखंड, पंजाब, हरियाणा, महाराष्ट्र, मध्य प्रदेश व राजस्थान की मंडियों का लाइव नक्शा।' 
              : 'Interactive GIS map covering regulated APMC mandis across 8 states with dynamic net profit calculation.'}
          </p>
        </div>

        {/* GPS Location & Transport Rate Tools */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGetLocation}
            disabled={locating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <LocateFixed className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'GPS खोज रहा है...' : 'मेरा GPS स्थान'}</span>
          </button>

          {/* Transport Cost Editor */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel bg-black/40 border border-emerald-500/30 text-xs">
            <Fuel className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">किराया: ₹</span>
            <input
              type="number"
              step="0.5"
              value={costPerKm}
              onChange={(e) => setCostPerKm(Number(e.target.value) || 1)}
              className="w-12 bg-transparent text-emerald-400 font-extrabold focus:outline-none"
            />
            <span className="text-slate-400">/किमी</span>
          </div>
        </div>
      </div>

      {/* State Filter Buttons Strip */}
      <div className="p-3 rounded-2xl glass-panel bg-black/30 border border-emerald-500/20 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <Filter className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">राज्य:</span>
        {availableStates.map(st => (
          <button
            key={st}
            onClick={() => setSelectedStateFilter(st)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedStateFilter === st
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 border border-emerald-400/40'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {st === 'ALL' ? 'सभी राज्य (All States)' : st}
          </button>
        ))}
      </div>

      {locationStatus && (
        <div className="text-xs px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>{locationStatus}</span>
          {userLocation?.name && <span className="font-bold text-white">({userLocation.name})</span>}
        </div>
      )}

      {/* Map and Table Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* All-India Leaflet Map */}
        <div className="lg:col-span-7 h-[420px] lg:h-[540px] rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl relative z-10">
          <MapContainer center={[23.8, 82.5]} zoom={5} scrollWheelZoom={true} className="h-full w-full">
            <MapInvalidator center={[23.8, 82.5]} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredMandis.map((m) => (
              <Marker key={m.id} position={[m.lat, m.lng]} icon={createCustomMandiIcon(m.isBest)}>
                <Popup>
                  <div className="text-xs p-1 space-y-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {m.state}
                    </span>
                    <strong className="text-sm block text-slate-900 mt-1">{m.name}</strong>
                    <div className="text-emerald-700 font-extrabold text-base">₹{m.modalPrice} / quintal</div>
                    <div className="text-slate-600">दूरी: {m.distanceKm} किमी | भाड़ा: ~₹{m.transportCostEstimate}</div>
                    <div className="text-emerald-800 font-bold">शुद्ध मुनाफा: ₹{m.netReturn}/q</div>
                    {m.isBest && (
                      <div className="text-[10px] font-bold text-amber-600">★ सबसे अधिक मुनाफे वाली मंडी</div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Mandi Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[540px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Showing {filteredMandis.length} Mandis
            </span>
            <div className="flex rounded-xl p-1 glass-panel bg-white/40 dark:bg-slate-900/60 border border-white/20 text-xs">
              <button
                onClick={() => setSortField('netReturn')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sortField === 'netReturn' ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Net Profit
              </button>
              <button
                onClick={() => setSortField('distanceKm')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sortField === 'distanceKm' ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Distance
              </button>
              <button
                onClick={() => setSortField('modalPrice')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sortField === 'modalPrice' ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Top Rate
              </button>
            </div>
          </div>

          {sortedMandis.map((m) => (
            <GlassCard
              key={m.id}
              variant={m.isBest ? 'highlight' : 'default'}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    {m.state}
                  </span>
                  {m.isBest && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold uppercase">
                      <Award className="w-2.5 h-2.5" /> Best Profit (अधिकतम लाभ)
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                  {m.name}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>दूरी: <strong>{m.distanceKm} km</strong></span>
                  <span>•</span>
                  <span>भाड़ा: ~₹{m.transportCostEstimate}/q</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-slate-400">शुद्ध भाव (Net)</div>
                <div className="text-lg font-heading font-black text-emerald-400">
                  ₹{m.netReturn}
                </div>
                <div className="text-[10px] text-slate-500 line-through">मंडी: ₹{m.modalPrice}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
