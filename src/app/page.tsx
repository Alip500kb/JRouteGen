'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ── Types ── */
type Point = { lat: number; lng: number };
type RouteResult = {
  distanceKm: number;
  durationMin: number;
  geometry: Point[];
  stops: { name: string; lat: number; lng: number }[];
  roadWarning: boolean;
};
type POIItem = { id: number; lat: number; lng: number; name: string; category: string };

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { L: any }
}

/* ── Constants ── */
const REGIONS: Record<string, { label: string; center: Point; places: string[] }> = {
  jawaBarat: {
    label: 'Jawa Barat',
    center: { lat: -6.9175, lng: 107.6191 },
    places: ['Dago Atas', 'Punclut', 'Lembang', 'Tebing Keraton', 'Kawah Putih', 'Ciwidey', 'Maribaya', 'Tangkuban Perahu'],
  },
  jakarta: {
    label: 'DKI Jakarta',
    center: { lat: -6.2088, lng: 106.8456 },
    places: ['Kota Tua', 'Ancol', 'Menteng', 'Sudirman', 'Monas', 'Kemang', 'PIK', 'TMII'],
  },
  bali: {
    label: 'Bali',
    center: { lat: -8.4095, lng: 115.1889 },
    places: ['Ubud', 'Tegallalang', 'Sanur', 'Canggu', 'Seminyak', 'Uluwatu', 'Kintamani', 'Nusa Dua'],
  },
  jogja: {
    label: 'DI Yogyakarta',
    center: { lat: -7.7972, lng: 110.3688 },
    places: ['Malioboro', 'Prambanan', 'Parangtritis', 'Kaliurang', 'Kotagede', 'Taman Sari', 'Alun-Alun Kidul'],
  },
  surabaya: {
    label: 'Surabaya',
    center: { lat: -7.2575, lng: 112.7521 },
    places: ['Tugu Pahlawan', 'Kenjeran', 'Suramadu', 'House of Sampoerna', 'Pantai Ria', 'Pakuwon Mall'],
  },
};

const DISTANCE_PRESETS = [
  { value: 5, label: '5 km', caption: 'Santai' },
  { value: 10, label: '10 km', caption: 'Ringkas' },
  { value: 15, label: '15 km', caption: 'Sedang' },
  { value: 25, label: '25 km', caption: 'Eksplor' },
  { value: 40, label: '40 km', caption: 'Seharian' },
];

const POI_CATEGORIES = [
  { key: 'fuel', label: 'SPBU', icon: '⛽', query: 'amenity=fuel' },
  { key: 'mosque', label: 'Masjid', icon: '🕌', query: 'amenity=place_of_worship][religion=muslim' },
  { key: 'restaurant', label: 'Restoran', icon: '🍽️', query: 'amenity=restaurant' },
  { key: 'cafe', label: 'Kafe', icon: '☕', query: 'amenity=cafe' },
  { key: 'atm', label: 'ATM', icon: '🏧', query: 'amenity=atm' },
  { key: 'hospital', label: 'RS/Klinik', icon: '🏥', query: 'amenity=hospital' },
  { key: 'parking', label: 'Parkir', icon: '🅿️', query: 'amenity=parking' },
  { key: 'hotel', label: 'Hotel', icon: '🏨', query: 'tourism=hotel' },
];

/* ── Helpers ── */
function loadLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.L) { resolve(); return; }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Leaflet gagal dimuat'));
    document.head.appendChild(script);
  });
}

function offsetPoint(center: Point, distanceKm: number, angle: number): Point {
  const d = Math.max(0.05, distanceKm);
  return {
    lat: center.lat + (d * Math.cos(angle)) / 111,
    lng: center.lng + (d * Math.sin(angle)) / (111 * Math.cos((center.lat * Math.PI) / 180)),
  };
}

function buildGoogleMapsUrl(stops: { lat: number; lng: number }[]): string {
  if (stops.length < 2) return '';
  const origin = `${stops[0].lat},${stops[0].lng}`;
  const dest = `${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`;
  const waypoints = stops.slice(1, -1).map((s) => `${s.lat},${s.lng}`).join('|');
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  return url;
}

function fallbackGeometry(points: Point[], targetKm: number) {
  const geometry: Point[] = [];
  points.forEach((point, i) => {
    const next = points[(i + 1) % points.length];
    geometry.push(point);
    for (let s = 1; s < 9; s++) {
      const t = s / 9;
      geometry.push({ lat: point.lat + (next.lat - point.lat) * t, lng: point.lng + (next.lng - point.lng) * t });
    }
  });
  return { geometry, distanceKm: targetKm, durationMin: Math.max(8, Math.round(targetKm * 4.2)) };
}

async function getRoadRoute(points: Point[]) {
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(';');
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`,
      { signal: ctrl.signal },
    );
    if (!res.ok) throw new Error('Routing unavailable');
    const json = await res.json();
    const route = json.routes?.[0];
    if (!route?.geometry?.coordinates?.length) throw new Error('Empty route');
    const geometry = route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({ lat, lng }));
    let hasLowQualityRoad = false;
    for (const leg of route.legs || []) {
      for (const step of leg.steps || []) {
        const ref = (step.name || '').toLowerCase();
        if (ref.includes('track') || ref.includes('path') || step.maneuver?.modifier === 'uturn') {
          hasLowQualityRoad = true;
        }
      }
    }
    return { geometry, distanceKm: route.distance / 1000, durationMin: Math.max(1, Math.round(route.duration / 60)), roadWarning: hasLowQualityRoad };
  } finally {
    window.clearTimeout(timer);
  }
}

async function fetchPOI(center: Point, radiusM: number, category: string, query: string): Promise<POIItem[]> {
  const overpassQuery = `[out:json][timeout:10];node[${query}](around:${radiusM},${center.lat},${center.lng});out body 30;`;
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`, { signal: ctrl.signal });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.elements || []).map((el: any) => ({
      id: el.id,
      lat: el.lat,
      lng: el.lon,
      name: el.tags?.name || el.tags?.brand || category,
      category,
    }));
  } catch {
    return [];
  } finally {
    window.clearTimeout(timer);
  }
}

/* ── Component ── */
export default function Home() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const routeLayerGroup = useRef<any>(null);
  const poiLayerGroup = useRef<any>(null);
  const pinMarker = useRef<any>(null);

  const [region, setRegion] = useState('jawaBarat');
  const [center, setCenter] = useState(REGIONS.jawaBarat.center);
  const [targetKm, setTargetKm] = useState(15);
  const [customInput, setCustomInput] = useState('15');
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [locationState, setLocationState] = useState('Lokasi belum dibagikan');
  const [mapReady, setMapReady] = useState(false);
  const [enabledPOI, setEnabledPOI] = useState<string[]>([]);
  const [poiItems, setPOIItems] = useState<POIItem[]>([]);
  const [poiLoading, setPOILoading] = useState(false);
  const [copied, setCopied] = useState('');
  const [showPOIPanel, setShowPOIPanel] = useState(false);

  /* ── Map init ── */
  useEffect(() => {
    let active = true;
    let resizeHandler: (() => void) | null = null;
    loadLeaflet()
      .then(() => {
        if (!active || !mapEl.current || !window.L) return;
        const L = window.L;
        const map = L.map(mapEl.current, { zoomControl: true, scrollWheelZoom: true }).setView([center.lat, center.lng], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(map);

        routeLayerGroup.current = L.layerGroup().addTo(map);
        poiLayerGroup.current = L.layerGroup().addTo(map);

        resizeHandler = () => map.invalidateSize();
        window.addEventListener('resize', resizeHandler);

        map.on('click', (e: any) => {
          setCenter({ lat: e.latlng.lat, lng: e.latlng.lng });
          setRoute(null);
          setSelecting(false);
          setLocationState(`Titik dipilih: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
        });

        mapRef.current = map;
        setMapReady(true);
      })
      .catch(() => setLocationState('Peta offline'));
    return () => {
      active = false;
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  /* ── Pan to center ── */
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    if (!Number.isFinite(center.lat) || !Number.isFinite(center.lng)) return;
    mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom());
    if (pinMarker.current) pinMarker.current.remove();
    const L = window.L;
    const icon = L.divIcon({ className: 'pin-icon', html: '<div class="pin-pulse"></div><div class="pin-dot"></div>', iconSize: [24, 24], iconAnchor: [12, 12] });
    pinMarker.current = L.marker([center.lat, center.lng], { icon }).addTo(mapRef.current);
  }, [center]);

  /* ── Draw route ── */
  useEffect(() => {
    if (!mapRef.current || !window.L || !routeLayerGroup.current) return;
    if (!mapReady) return;
    routeLayerGroup.current.clearLayers();
    if (!route) return;
    const L = window.L;
    const path = route.geometry
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map((p) => [p.lat, p.lng] as [number, number]);
    if (path.length < 2) return;

    try {
      L.polyline(path, { color: '#e45f35', weight: 5, opacity: 0.85, smoothFactor: 1.5, noClip: true }).addTo(routeLayerGroup.current);

      route.stops.forEach((stop, i) => {
        if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return;
        const icon = L.divIcon({
          className: 'stop-icon',
          html: `<div class="stop-marker"><span>${i + 1}</span></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(routeLayerGroup.current);
        marker.bindPopup(`<div class="popup-content"><b>${stop.name}</b><br/><code>${stop.lat.toFixed(5)}, ${stop.lng.toFixed(5)}</code></div>`);
      });

      const bounds = L.latLngBounds(path);
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    } catch {
      routeLayerGroup.current.clearLayers();
    }
  }, [route, mapReady]);

  /* ── POI fetch ── */
  useEffect(() => {
    if (!enabledPOI.length || !mapRef.current || !window.L || !poiLayerGroup.current) {
      if (poiLayerGroup.current) poiLayerGroup.current.clearLayers();
      setPOIItems([]);
      return;
    }
    let cancelled = false;
    setPOILoading(true);
    const radiusM = Math.max(2000, targetKm * 500);
    let routeCenter = center;
    if (route && route.geometry && route.geometry.length > 1) {
      const mid = Math.floor(route.geometry.length / 2);
      const clat = (route.geometry[0].lat + route.geometry[mid].lat) / 2;
      const clng = (route.geometry[0].lng + route.geometry[mid].lng) / 2;
      if (Number.isFinite(clat) && Number.isFinite(clng)) {
        routeCenter = { lat: clat, lng: clng };
      }
    }

    Promise.all(
      enabledPOI.map((key) => {
        const cat = POI_CATEGORIES.find((c) => c.key === key);
        if (!cat) return Promise.resolve([]);
        return fetchPOI(routeCenter, radiusM, cat.key, cat.query);
      }),
    ).then((results) => {
      if (cancelled) return;
      const all = results.flat();
      setPOIItems(all);
      poiLayerGroup.current.clearLayers();
      const L = window.L;
      all.forEach((poi) => {
        if (!Number.isFinite(poi.lat) || !Number.isFinite(poi.lng)) return;
        const cat = POI_CATEGORIES.find((c) => c.key === poi.category);
        const icon = L.divIcon({ className: 'poi-icon', html: `<span>${cat?.icon || '📍'}</span>`, iconSize: [28, 28], iconAnchor: [14, 14] });
        const m = L.marker([poi.lat, poi.lng], { icon }).addTo(poiLayerGroup.current);
        m.bindPopup(`<div class="popup-content"><b>${poi.name}</b><br/><small>${cat?.label}</small><br/><code>${poi.lat.toFixed(5)}, ${poi.lng.toFixed(5)}</code></div>`);
      });
      setPOILoading(false);
    });
    return () => { cancelled = true; };
  }, [enabledPOI, route, center, targetKm]);

  /* ── Actions ── */
  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) { setLocationState('Browser tidak mendukung lokasi'); return; }
    setLocationState('Mencari lokasi...');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setRoute(null); setLocationState('Lokasi aktif dari perangkat'); },
      () => setLocationState('Izin lokasi ditolak'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  function handleRegionChange(key: string) {
    setRegion(key);
    setCenter(REGIONS[key].center);
    setRoute(null);
    setLocationState(`Area: ${REGIONS[key].label}`);
  }

  function handleDistanceChange(val: number) {
    const clamped = Math.max(1, Math.min(100, val));
    setTargetKm(clamped);
    setCustomInput(String(clamped));
    setRoute(null);
  }

  async function generateRoute() {
    setLoading(true);
    const regionData = REGIONS[region];
    const seeds = [0.3, 1.4, 2.6, 3.8, 5.1];
    const candidates = seeds.map((seed) => {
      const radius = Math.max(0.8, Math.min(15, targetKm / 3.2));
      return {
        points: [
          center,
          offsetPoint(center, radius * 1.05, seed),
          offsetPoint(center, radius * 1.15, seed + 1.9),
          offsetPoint(center, radius * 0.9, seed + 3.8),
        ],
        seed,
      };
    });
    const results = await Promise.all(
      candidates.map(async ({ points, seed }) => {
        try {
          return { ...(await getRoadRoute([...points, center])), seed };
        } catch {
          return { ...fallbackGeometry(points, targetKm * (0.9 + seed / 25)), roadWarning: false, seed };
        }
      }),
    );
    const best = results.sort((a, b) => Math.abs(a.distanceKm - targetKm) - Math.abs(b.distanceKm - targetKm))[0];

    const shuffled = [...regionData.places].sort(() => Math.random() - 0.5);
    const stopCount = Math.min(Math.max(2, Math.floor(targetKm / 5)), 5);
    const stopNames = shuffled.slice(0, stopCount);
    const stops = stopNames.map((name, i) => {
      const idx = Math.floor(((i + 1) * (best.geometry.length - 1)) / (stopCount + 1));
      const pt = best.geometry[idx];
      return { name, lat: pt.lat, lng: pt.lng };
    });

    setRoute({ ...best, stops });
    setLoading(false);
  }

  function copyCoord(lat: number, lng: number, label: string) {
    navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  }

  function togglePOI(key: string) {
    setEnabledPOI((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  }

  const gmapsUrl = route ? buildGoogleMapsUrl([{ lat: center.lat, lng: center.lng }, ...route.stops, { lat: center.lat, lng: center.lng }]) : '';

  return (
    <main className={`app-shell ${selecting ? 'is-picking' : ''}`}>
      {/* ── Header ── */}
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">R</div>
          <div>
            <p className="eyebrow">Jelajah Indonesia</p>
            <h1>RuteRasa</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <span className={`map-status ${mapReady ? 'is-ready' : ''}`}>{mapReady ? 'Peta online' : 'Menyiapkan...'}</span>
          <button className="icon-button" type="button" onClick={useMyLocation} title="Gunakan lokasi saya">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
          </button>
        </div>
      </header>

      <section className="workspace">
        {/* ── Sidebar ── */}
        <aside className="control-panel">
          <div className="panel-heading">
            <p className="eyebrow">Rute Spontan</p>
            <h2>Temukan jalan<br /><em>yang belum kamu coba.</em></h2>
          </div>

          <div className="form-stack">
            {/* Region */}
            <div className="field-group">
              <label className="field-label" htmlFor="region">Area perjalanan</label>
              <div className="select-wrap">
                <select id="region" value={region} onChange={(e) => handleRegionChange(e.target.value)}>
                  {Object.entries(REGIONS).map(([key, r]) => <option key={key} value={key}>{r.label}</option>)}
                </select>
                <svg className="select-arrow" width="12" height="12" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
              </div>
            </div>

            {/* Origin */}
            <div className="field-group">
              <span className="field-label">Titik awal</span>
              <div className="origin-row">
                <button type="button" className={`origin-btn ${selecting ? 'is-active' : ''}`} onClick={() => setSelecting((v) => !v)}>
                  <span className="origin-dot" />
                  {selecting ? 'Klik di peta...' : `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`}
                </button>
                <button type="button" className="btn-outline" onClick={useMyLocation}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
                  GPS
                </button>
              </div>
              <span className="field-hint">{locationState}</span>
            </div>

            {/* Distance */}
            <div className="field-group">
              <div className="distance-header">
                <span className="field-label">Jarak tempuh</span>
                <div className="distance-input-wrap">
                  <input
                    type="number"
                    className="distance-input"
                    value={customInput}
                    min={1}
                    max={100}
                    step={0.5}
                    onChange={(e) => {
                      setCustomInput(e.target.value);
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v) && v >= 1 && v <= 100) { setTargetKm(v); setRoute(null); }
                    }}
                    onBlur={() => { setCustomInput(String(targetKm)); }}
                  />
                  <span className="distance-unit">km</span>
                </div>
              </div>
              <input
                type="range"
                className="distance-slider"
                min={1}
                max={100}
                step={0.5}
                value={targetKm}
                onChange={(e) => handleDistanceChange(parseFloat(e.target.value))}
              />
              <div className="preset-row">
                {DISTANCE_PRESETS.map((p) => (
                  <button key={p.value} type="button" className={`preset-chip ${targetKm === p.value ? 'is-active' : ''}`} onClick={() => handleDistanceChange(p.value)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button type="button" className="generate-btn" onClick={generateRoute} disabled={loading || !mapReady}>
              {loading ? (
                <><span className="spinner" /> Merangkai rute...</>
              ) : (
                <>Generate rute baru <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></>
              )}
            </button>

            {/* POI Toggle */}
            <div className="field-group">
              <button type="button" className="poi-toggle-header" onClick={() => setShowPOIPanel((v) => !v)}>
                <span className="field-label" style={{marginBottom:0}}>Tempat sekitar (POI)</span>
                <svg className={`chevron ${showPOIPanel ? 'is-open' : ''}`} width="14" height="14" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>
              {showPOIPanel && (
                <div className="poi-grid">
                  {POI_CATEGORIES.map((cat) => (
                    <label key={cat.key} className={`poi-chip ${enabledPOI.includes(cat.key) ? 'is-active' : ''}`}>
                      <input type="checkbox" checked={enabledPOI.includes(cat.key)} onChange={() => togglePOI(cat.key)} />
                      <span>{cat.icon}</span>
                      {cat.label}
                    </label>
                  ))}
                </div>
              )}
              {poiLoading && <span className="field-hint">Memuat POI...</span>}
              {poiItems.length > 0 && <span className="field-hint">{poiItems.length} tempat ditemukan</span>}
            </div>
          </div>

          <div className="sidebar-footer">
            <span>OpenStreetMap &middot; OSRM &middot; Overpass</span>
          </div>
        </aside>

        {/* ── Map ── */}
        <section className="map-stage">
          <div ref={mapEl} className="map-canvas" />

          <div className="map-overlay top-left">
            <span className="map-chip">{REGIONS[region].label}</span>
          </div>

          <div className="map-overlay bottom-left">
            <span className="map-hint">{selecting ? '📌 Klik peta untuk pilih titik awal' : 'Geser peta untuk melihat sekitar'}</span>
          </div>

          {/* Route Card */}
          {route && (
            <div className="route-card">
              <div className="route-card-head">
                <span className="route-badge">Rute ditemukan</span>
                {route.roadWarning && <span className="road-warn">⚠️ Ada jalan kecil</span>}
              </div>
              <h3>Putaran {REGIONS[region].label}</h3>
              <div className="route-stats">
                <div><b>{route.distanceKm.toFixed(1)}</b><small>km</small></div>
                <div><b>{route.durationMin}</b><small>menit</small></div>
                <div><b>{route.stops.length}</b><small>checkpoint</small></div>
              </div>

              <div className="route-divider" />

              <div className="checkpoint-list">
                {route.stops.map((stop, i) => (
                  <div key={`${stop.name}-${i}`} className="checkpoint-item">
                    <span className="checkpoint-num">{i + 1}</span>
                    <div className="checkpoint-info">
                      <span className="checkpoint-name">{stop.name}</span>
                      <code className="checkpoint-coord">{stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}</code>
                    </div>
                    <button type="button" className="copy-btn" onClick={() => copyCoord(stop.lat, stop.lng, stop.name)} title="Salin koordinat">
                      {copied === stop.name ? '✓' : '📋'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="route-actions">
                <a href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="gmaps-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                  Buka di Google Maps
                </a>
                <button type="button" className="btn-outline" onClick={generateRoute}>🔄 Rute lain</button>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
