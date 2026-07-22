'use client';

import { useEffect, useRef, useState } from 'react';

type Point = { lat: number; lng: number };
type RouteResult = {
  distanceKm: number;
  durationMin: number;
  geometry: Point[];
  stops: string[];
};
type LeafletMap = {
  setView: (center: [number, number], zoom: number) => LeafletMap;
  invalidateSize: () => LeafletMap;
  fitBounds: (bounds: unknown, options?: { padding: [number, number] }) => LeafletMap;
  on: (event: string, callback: (event: { latlng: Point }) => void) => void;
  remove: () => void;
};
type LeafletLayer = { remove: () => void };
type LeafletApi = {
  map: (element: HTMLDivElement, options?: { zoomControl: boolean }) => LeafletMap;
  tileLayer: (url: string, options: Record<string, string | number>) => { addTo: (map: LeafletMap) => void };
  polyline: (points: [number, number][], options: Record<string, string | number | boolean>) => LeafletLayer & { addTo: (map: LeafletMap) => LeafletLayer };
  circleMarker: (point: [number, number], options: Record<string, string | number>) => LeafletLayer & { addTo: (map: LeafletMap) => LeafletLayer };
  layerGroup: (layers: LeafletLayer[]) => LeafletLayer & { addTo: (map: LeafletMap) => LeafletLayer };
  latLngBounds: (points: [number, number][]) => unknown;
};

declare global {
  interface Window {
    L?: LeafletApi;
  }
}

const REGIONS: Record<string, { label: string; center: Point; places: string[] }> = {
  jawaBarat: {
    label: 'Jawa Barat',
    center: { lat: -6.9175, lng: 107.6191 },
    places: ['Dago Atas', 'Punclut', 'Lembang', 'Tebing Keraton'],
  },
  jakarta: {
    label: 'DKI Jakarta',
    center: { lat: -6.2088, lng: 106.8456 },
    places: ['Kota Tua', 'Ancol', 'Menteng', 'Sudirman'],
  },
  bali: {
    label: 'Bali',
    center: { lat: -8.4095, lng: 115.1889 },
    places: ['Ubud', 'Tegallalang', 'Sanur', 'Canggu'],
  },
};

const TARGETS = [
  { value: 4, label: '4 km', caption: 'Santai' },
  { value: 8, label: '8 km', caption: 'Ringkas' },
  { value: 12, label: '12 km', caption: 'Seimbang' },
  { value: 20, label: '20 km', caption: 'Eksplor' },
  { value: 30, label: '30 km', caption: 'Seharian' },
];

function loadLeaflet() {
  return new Promise<void>((resolve, reject) => {
    if (window.L) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Leaflet tidak dapat dimuat'));
    document.head.appendChild(script);
  });
}

function offsetPoint(center: Point, distanceKm: number, angle: number): Point {
  const safeDist = Math.max(0.05, distanceKm);
  const lat = center.lat + (safeDist * Math.cos(angle)) / 111;
  const lng = center.lng + (safeDist * Math.sin(angle)) / (111 * Math.cos((center.lat * Math.PI) / 180));
  return { lat, lng };
}

function fallbackGeometry(points: Point[], targetKm: number) {
  const geometry: Point[] = [];
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    geometry.push(point);
    for (let step = 1; step < 9; step += 1) {
      const t = step / 9;
      geometry.push({ lat: point.lat + (next.lat - point.lat) * t, lng: point.lng + (next.lng - point.lng) * t });
    }
  });
  return { geometry, distanceKm: targetKm, durationMin: Math.max(8, Math.round(targetKm * 4.2)) };
}

async function getRoadRoute(points: Point[], targetKm: number) {
  const coordinates = points.map((point) => `${point.lng},${point.lat}`).join(';');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 7500);
  try {
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Routing unavailable');
    const payload = await response.json();
    const route = payload.routes?.[0];
    if (!route?.geometry?.coordinates?.length) throw new Error('Empty route');
    return {
      geometry: route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({ lat, lng })),
      distanceKm: route.distance / 1000,
      durationMin: Math.max(1, Math.round(route.duration / 60)),
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function Home() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routeLayers = useRef<LeafletLayer[]>([]);
  const [region, setRegion] = useState('jawaBarat');
  const [center, setCenter] = useState(REGIONS.jawaBarat.center);
  const [targetKm, setTargetKm] = useState(12);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [locationState, setLocationState] = useState('Lokasi belum dibagikan');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let active = true;
    let handleResize: (() => void) | null = null;
    loadLeaflet()
      .then(() => {
        if (!active || !mapElement.current || !window.L) return;
        const map = window.L.map(mapElement.current, { zoomControl: true, scrollWheelZoom: true }).setView([center.lat, center.lng], 12);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        handleResize = () => map.invalidateSize();
        window.addEventListener('resize', handleResize);

        map.on('click', (event) => {
          setCenter(event.latlng);
          setRoute(null);
          setSelecting(false);
          setLocationState('Titik awal dipilih di peta');
        });
        mapRef.current = map;
        setMapReady(true);
      })
      .catch(() => setLocationState('Peta offline, jalur tetap tersedia'));
    return () => {
      if (window.L && mapRef.current) {
        mapRef.current.remove();
      }
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      mapRef.current = null;
      active = false;
    };
  }, []);


  useEffect(() => {
    if (mapRef.current) mapRef.current.setView([center.lat, center.lng], 12);
  }, [center]);

  useEffect(() => {
    if (!mapRef.current || !window.L || !route) return;
    routeLayers.current.forEach((layer) => layer.remove());
    const path = route.geometry
      .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
      .map((point) => [point.lat, point.lng] as [number, number]);
    if (path.length < 2) return;
    const line = window.L.polyline(path, { color: '#e45f35', weight: 5, opacity: 0.9, lineCap: 'round', noClip: true }).addTo(mapRef.current);
    const origin = window.L.circleMarker([center.lat, center.lng], {
      radius: 9,
      color: '#fffaf3',
      weight: 3,
      fillColor: '#171714',
      fillOpacity: 1,
    }).addTo(mapRef.current);
    const stopLayers = route.stops.map((_, index) => {
      const point = path[Math.floor((index + 1) * (path.length - 1) / (route.stops.length + 1))];
      return window.L.circleMarker(point, {
        radius: 6,
        color: '#fffaf3',
        weight: 2,
        fillColor: '#e45f35',
        fillOpacity: 1,
      }).addTo(mapRef.current!);
    });
    routeLayers.current = [line, origin, ...stopLayers];
    mapRef.current?.invalidateSize();
  }, [center, route]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationState('Browser tidak mendukung Geolocation API');
      return;
    }
    setLocationState('Mencari lokasi...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCenter(next);
        setRoute(null);
        setLocationState('Lokasi aktif dari perangkat');
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationState('Akses lokasi ditolak. Izinkan di pengaturan browser.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationState('Lokasi tidak tersedia');
            break;
          case error.TIMEOUT:
            setLocationState('Waktu pencarian lokasi habis');
            break;
          default:
            setLocationState('Gagal mendapatkan lokasi');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  function handleRegionChange(nextRegion: string) {
    setRegion(nextRegion);
    setCenter(REGIONS[nextRegion].center);
    setRoute(null);
    setLocationState(`Titik awal: ${REGIONS[nextRegion].label}`);
  }

  async function generateRoute() {
    setLoading(true);
    const regionData = REGIONS[region];
    const candidateSeeds = [0.1, 1.2, 2.4, 3.6];
    const candidates = candidateSeeds.map((seed) => {
      const radius = Math.max(0.8, Math.min(10, targetKm / 3.55));
      const points = [
        center,
        offsetPoint(center, radius * 1.02, seed),
        offsetPoint(center, radius * 1.1, seed + 2.05),
        offsetPoint(center, radius * 0.85, seed + 4.15),
      ];
      return { points, seed };
    });
    const results = await Promise.all(
      candidates.map(async ({ points, seed }) => {
        try {
          return { ...(await getRoadRoute([...points, center], targetKm)), seed };
        } catch {
          return { ...fallbackGeometry(points, targetKm * (0.92 + seed / 20)), seed };
        }
      }),
    );
    const best = results.sort((a, b) => Math.abs(a.distanceKm - targetKm) - Math.abs(b.distanceKm - targetKm))[0];
    const names = [...regionData.places].sort(() => Math.random() - 0.5).slice(0, 3);
    setRoute({ ...best, stops: names });
    setLoading(false);
  }

  const activeTarget = TARGETS.find((item) => item.value === targetKm);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">R</div>
          <div>
            <p className="eyebrow">Jelajah Indonesia</p>
            <h1>RuteRasa</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <span className={`map-status ${mapReady ? 'is-ready' : ''}`}><i /> {mapReady ? 'Peta online' : 'Menyiapkan peta'}</span>
          <button className="icon-button" type="button" onClick={useMyLocation} aria-label="Gunakan lokasi saya" title="Gunakan lokasi saya">⌖</button>
          <div className="avatar">AR</div>
        </div>
      </header>

      <section className="workspace">
        <aside className="control-panel">
          <div className="panel-heading">
            <p className="eyebrow">Rute spontan</p>
            <h2>Temukan jalan<br /><em>yang belum kamu coba.</em></h2>
            <p className="panel-copy">Atur jarak, pilih area, lalu biarkan kami merangkai putaran baru di sekitarmu.</p>
          </div>

          <div className="form-stack">
            <label className="field-label" htmlFor="region">Area perjalanan</label>
            <div className="select-wrap">
              <select id="region" value={region} onChange={(event) => handleRegionChange(event.target.value)}>
                {Object.entries(REGIONS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
              </select>
              <span>⌄</span>
            </div>

            <div className="field-row">
              <div>
                <span className="field-label">Titik awal</span>
                <button type="button" className={`location-choice ${selecting ? 'is-selecting' : ''}`} onClick={() => setSelecting((value) => !value)}>
                  <span className="location-dot" /> {selecting ? 'Klik titik di peta' : 'Sekitar lokasimu'}
                </button>
              </div>
              <button type="button" className="use-location" onClick={useMyLocation}>Gunakan lokasi</button>
            </div>
            <span className="location-state">{locationState}</span>

            <div className="distance-header">
              <span className="field-label">Jarak tempuh</span>
              <strong>{activeTarget?.label}</strong>
            </div>
            <div className="distance-grid">
              {TARGETS.map((item) => (
                <button key={item.value} type="button" className={`distance-option ${targetKm === item.value ? 'is-active' : ''}`} onClick={() => { setTargetKm(item.value); setRoute(null); }}>
                  <strong>{item.label}</strong><small>{item.caption}</small>
                </button>
              ))}
            </div>

            <button type="button" className="generate-button" onClick={generateRoute} disabled={loading}>
              <span>{loading ? 'Merangkai rute...' : 'Generate rute baru'}</span><b>↗</b>
            </button>
          </div>

          <div className="algorithm-note"><span>✦</span><p><b>Algoritma adaptif</b><br />Mencari kombinasi jalan yang mendekati jarak pilihanmu, lalu menyusunnya sebagai putaran.</p></div>
        </aside>

        <section className="map-stage" aria-label="Peta rute wisata">
          <div ref={mapElement} className="map-canvas" />
          <div className="map-overlay top-left"><span className="map-chip"><i /> {REGIONS[region].label}</span></div>
          <div className="map-overlay bottom-left"><span className="map-hint">{selecting ? 'Klik pada peta untuk memindahkan titik awal' : 'Geser peta untuk melihat sekitar'}</span></div>
          {route && (
            <div className="route-card">
              <div className="route-card-top"><span className="route-pill">Rute pilihan</span><span className="route-time">Hari ini · fleksibel</span></div>
              <h3>Putaran {REGIONS[region].label}</h3>
              <div className="route-metrics"><div><b>{route.distanceKm.toFixed(1)}</b><span>km</span></div><div><b>{route.durationMin}</b><span>menit</span></div><div><b>{route.stops.length}</b><span>titik singgah</span></div></div>
              <div className="route-line" />
              <div className="stop-list">{route.stops.map((stop, index) => <div key={stop}><span>{String(index + 1).padStart(2, '0')}</span>{stop}</div>)}</div>
            </div>
          )}
        </section>
      </section>

      <footer className="bottom-strip">
        <div><span className="footer-label">Mode</span><b>Putaran eksplorasi</b></div>
        <div><span className="footer-label">Kondisi rute</span><b><i className="green-dot" /> Mengikuti jalan umum</b></div>
        <div><span className="footer-label">Teknologi</span><b>OpenStreetMap · OSRM</b></div>
        <div className="footer-tip">Rute dibuat untuk inspirasi perjalanan. Selalu cek kondisi jalan sebelum berangkat.</div>
      </footer>
    </main>
  );
}
