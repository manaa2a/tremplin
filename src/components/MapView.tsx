import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Offer } from '../types';
import { HOME } from '../data/mock';

/** Square home marker. */
const homeIcon = L.divIcon({
  className: '',
  html: '<div class="pin-home"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

/** Truck-in-a-square offer pin, coloured by whether it's within the radius. */
function offerIcon(inRange: boolean): L.DivIcon {
  const color = inRange ? 'var(--color-accent)' : 'var(--color-neutral-400)';
  return L.divIcon({
    className: '',
    html: `<div class="pin-offer">
        <div class="pin-head" style="background:${color}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M4 6h11v9H4zM15 9h4l2 3v3h-6z"/>
          </svg>
        </div>
        <div class="pin-stem" style="background:${color}"></div>
      </div>`,
    iconSize: [26, 32],
    iconAnchor: [13, 32],
  });
}

/** Keeps the map framed on the home + radius as the slider changes.
 *  Zoom is derived from the radius (bigger radius → zoom out). Guarded so a
 *  transient Leaflet state can never take down the screen. */
function FitRadius({ distanceKm }: { distanceKm: number }) {
  const map = useMap();
  useEffect(() => {
    const zoom = Math.max(8, Math.min(14, Math.round(13.3 - Math.log2(distanceKm))));
    const id = requestAnimationFrame(() => {
      try {
        map.invalidateSize();
        map.setView([HOME.lat, HOME.lng], zoom, { animate: true });
      } catch {
        /* map not ready yet — ignore */
      }
    });
    return () => cancelAnimationFrame(id);
  }, [distanceKm, map]);
  return null;
}

interface Props {
  offers: Offer[];
  distanceKm: number;
  onSelect: (id: string) => void;
}

export function MapView({ offers, distanceKm, onSelect }: Props) {
  return (
    <div className="map-surface">
      <MapContainer
        center={[HOME.lat, HOME.lng]}
        zoom={12}
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          className="grayscale-tiles"
        />
        <Circle
          center={[HOME.lat, HOME.lng]}
          radius={distanceKm * 1000}
          pathOptions={{
            color: 'var(--color-accent)',
            weight: 2,
            dashArray: '6 6',
            fillColor: 'var(--color-accent)',
            fillOpacity: 0.06,
          }}
        />
        <Marker position={[HOME.lat, HOME.lng]} icon={homeIcon} />
        {offers.map((o) => (
          <Marker
            key={o.id}
            position={[o.lat, o.lng]}
            icon={offerIcon(o.distanceKm <= distanceKm)}
            eventHandlers={{ click: () => onSelect(o.id) }}
          />
        ))}
        <FitRadius distanceKm={distanceKm} />
      </MapContainer>
    </div>
  );
}
