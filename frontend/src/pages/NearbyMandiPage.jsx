import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GlassCard } from '../components/common/GlassCard';
import { Navigation, Award, Fuel, Filter, MapPin, LocateFixed, Edit3 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

// Custom Pin Icon
const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Navigation className="w-3.5 h-3.5" />
            <span>All-India Mandi Geo-Mapping (8 States)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
            {t.nav.nearby}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Interactive GIS map covering mandis in Jharkhand, Bihar, UP, Punjab, Haryana, Maharashtra, MP & Rajasthan.
          </p>
        </div>

        {/* State Filter Pills & GPS Geolocation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={handleGetLocation}
            disabled={locating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-all cursor-pointer shrink-0"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'खोज रहा है...' : 'मेरा GPS स्थान'}</span>
          </button>

          {/* Transport Cost Editor */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl glass-panel bg-white/10 border border-white/10 text-xs">
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">किराया: ₹</span>
            <input
              type="number"
              step="0.5"
              value={costPerKm}
              onChange={(e) => setCostPerKm(Number(e.target.value) || 1)}
              className="w-12 bg-transparent text-emerald-400 font-bold focus:outline-none"
            />
            <span className="text-slate-400">/किमी</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <Filter className="w-4 h-4 text-emerald-500 shrink-0 mr-1" />
            {availableStates.map(st => (
              <button
                key={st}
                onClick={() => setSelectedStateFilter(st)}
                className={`px-3 py-1 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedStateFilter === st
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'glass-panel bg-white/40 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                {st === 'ALL' ? 'All States (सभी)' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {locationStatus && (
        <div className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{locationStatus}</span>
          {userLocation?.name && <span className="font-bold">({userLocation.name})</span>}
        </div>
      )}

      {/* Map and Table Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* All-India Leaflet Map */}
        <div className="lg:col-span-7 h-[420px] lg:h-[540px] rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl relative z-10">
          <MapContainer center={[23.8, 82.5]} zoom={5} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredMandis.map((m) => (
              <Marker key={m.id} position={[m.lat, m.lng]} icon={pinIcon}>
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
