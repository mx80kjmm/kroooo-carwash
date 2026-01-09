"use client";

import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const geoUrl = "/data/japan.topojson";

interface JapanMapProps {
    onPrefectureSelect?: (prefectureName: string) => void;
    className?: string;
}

const REGIONS = {
    Hokkaido: ["Hokkai Do"],
    Tohoku: ["Aomori Ken", "Iwate Ken", "Miyagi Ken", "Akita Ken", "Yamagata Ken", "Fukushima Ken"],
    Kanto: ["Ibaraki Ken", "Tochigi Ken", "Gunma Ken", "Saitama Ken", "Chiba Ken", "Tokyo To", "Kanagawa Ken"],
    Chubu: ["Niigata Ken", "Toyama Ken", "Ishikawa Ken", "Fukui Ken", "Yamanashi Ken", "Nagano Ken", "Gifu Ken", "Shizuoka Ken", "Aichi Ken"],
    Kansai: ["Mie Ken", "Shiga Ken", "Kyoto Fu", "Osaka Fu", "Hyogo Ken", "Nara Ken", "Wakayama Ken"],
    Chugoku: ["Tottori Ken", "Shimane Ken", "Okayama Ken", "Hiroshima Ken", "Yamaguchi Ken"],
    Shikoku: ["Tokushima Ken", "Kagawa Ken", "Ehime Ken", "Kochi Ken"],
    Kyushu: ["Fukuoka Ken", "Saga Ken", "Nagasaki Ken", "Kumamoto Ken", "Oita Ken", "Miyazaki Ken", "Kagoshima Ken", "Okinawa Ken"],
};

export default function JapanMap({ onPrefectureSelect, className = "" }: JapanMapProps) {
    const router = useRouter();
    const [position, setPosition] = useState({ coordinates: [138, 38], zoom: 1.5 });
    const [hoveredPrefecture, setHoveredPrefecture] = useState<string | null>(null);

    const handleZoomIn = () => {
        if (position.zoom >= 4) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
    };

    const handleZoomOut = () => {
        if (position.zoom <= 1) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
    };

    const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
        setPosition(position);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePrefectureClick = (geo: any) => {
        const prefectureName = geo.properties.nam_ja;
        if (onPrefectureSelect) {
            onPrefectureSelect(prefectureName);
        } else {
            // Navigate to prefecture page (logic can be adjusted)
            // router.push(`/${prefectureName}`); 
            // For now, let's filter by it or just log it.
            console.log("Clicked:", prefectureName);
        }
    };

    return (
        <div className={`relative bg-blue-50/50 rounded-xl overflow-hidden shadow-inner border border-blue-100 ${className}`}>
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                <button
                    onClick={handleZoomIn}
                    className="bg-white p-2 rounded shadow hover:bg-gray-100 text-gray-700 font-bold"
                    aria-label="Zoom In"
                >
                    +
                </button>
                <button
                    onClick={handleZoomOut}
                    className="bg-white p-2 rounded shadow hover:bg-gray-100 text-gray-700 font-bold"
                    aria-label="Zoom Out"
                >
                    -
                </button>
            </div>

            {hoveredPrefecture && (
                <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded shadow text-sm font-bold text-blue-900 pointer-events-none z-10">
                    {hoveredPrefecture}
                </div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
            >
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 1800,
                        center: [137, 38],
                    }}
                    className="w-full h-full"
                >
                    <ZoomableGroup
                        zoom={position.zoom}
                        center={position.coordinates as [number, number]}
                        onMoveEnd={handleMoveEnd}
                        maxZoom={10}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const isHovered = hoveredPrefecture === geo.properties.nam_ja;
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onMouseEnter={() => setHoveredPrefecture(geo.properties.nam_ja)}
                                            onMouseLeave={() => setHoveredPrefecture(null)}
                                            onClick={() => handlePrefectureClick(geo)}
                                            style={{
                                                default: {
                                                    fill: "#D1D5DB",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 0.5,
                                                    outline: "none",
                                                },
                                                hover: {
                                                    fill: "#3B82F6",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                    cursor: "pointer",
                                                },
                                                pressed: {
                                                    fill: "#1D4ED8",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 1,
                                                    outline: "none",
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </motion.div>
        </div>
    );
}
