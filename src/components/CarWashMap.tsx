
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface Location {
    id: string;
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
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
                <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-sm mb-1">{loc.name}</h3>
                            <p className="text-xs mb-2 text-gray-600">{loc.address}</p>
                            <a
                                href={`/location/${loc.id}`}
                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                            >
                                詳細を見る
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
