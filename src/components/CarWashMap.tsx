
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for standard Leaflet markers in Next.js
const fixLeafletIcon = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

function MapUpdater({ locations }: { locations: Location[] }) {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
            if (locations.length > 0) {
                if (locations.length === 1) {
                    const loc = locations[0];
                    map.setView([loc.latitude, loc.longitude], 15);
                } else {
                    const bounds = L.latLngBounds(locations.map(l => [l.latitude, l.longitude]));
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            } else {
                // Default view if no locations
            }
        }, 100); // 100ms delay to ensure container is ready
        return () => clearTimeout(timer);
    }, [map, locations]);
    return null;
}

interface Location {
    id: string | number;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    has_non_brush?: boolean;
}

interface CarWashMapProps {
    locations: Location[];
    center?: [number, number];
    zoom?: number;
    height?: string;
}

export default function CarWashMap({ locations, center = [35.6812, 139.7671], zoom = 5, height = '500px' }: CarWashMapProps) {

    useEffect(() => {
        fixLeafletIcon();
    }, []);

    // If only one location, center on it
    const activeCenter: [number, number] = locations.length === 1
        ? [locations[0].latitude, locations[0].longitude]
        : center;

    const activeZoom = locations.length === 1 ? 15 : zoom;

    return (
        <MapContainer center={activeCenter} zoom={activeZoom} style={{ height: height, width: '100%', borderRadius: '12px', zIndex: 0 }}>
            <MapUpdater locations={locations} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
                <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-sm mb-1">
                                {loc.name.replace(/\(無名\)/g, '').replace(/（無名）/g, '').replace(/ユーザー指摘による追加/g, '').trim()}
                            </h3>
                            <p className="text-xs mb-2 text-gray-600">{loc.address}</p>
                            <a
                                href={`/location/${loc.id}`}
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: '#2563eb',
                                    color: '#ffffff',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    textDecoration: 'none'
                                }}
                            >
                                詳細を見る →
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
