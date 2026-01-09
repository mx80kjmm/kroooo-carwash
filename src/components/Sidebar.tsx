"use client";

import React from "react";
import Link from "next/link";
import WeatherForecast from "./WeatherForecast";

interface SidebarProps {
    searchKeyword: string;
    setSearchKeyword: (val: string) => void;
    filterNonBrush: boolean;
    setFilterNonBrush: (val: boolean) => void;
    filter24h: boolean;
    setFilter24h: (val: boolean) => void;
    filterUnlimitedWater: boolean;
    setFilterUnlimitedWater: (val: boolean) => void;
    onSearch: (e: React.FormEvent) => void;
    onNearMe: () => void;
    sortByDistance: boolean;
    currentLocation?: { lat: number; lng: number } | null;
}

export default function Sidebar({
    searchKeyword,
    setSearchKeyword,
    filterNonBrush,
    setFilterNonBrush,
    filter24h,
    setFilter24h,
    filterUnlimitedWater,
    setFilterUnlimitedWater,
    onSearch,
    onNearMe,
    sortByDistance,
    currentLocation,
}: SidebarProps) {
    // Default to Tokyo if no location provided
    const targetLocation = currentLocation || { lat: 35.6812, lng: 139.7671 };

    return (
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Search Widget */}
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    🔍 条件で探す
                </h3>
                <form onSubmit={onSearch} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="地名・施設名..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                            <input
                                type="checkbox"
                                checked={filterNonBrush}
                                onChange={(e) => setFilterNonBrush(e.target.checked)}
                                className="w-5 h-5 rounded accent-cyan-500"
                            />
                            <span className="text-gray-700">✨ ノンブラシ洗車機</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                            <input
                                type="checkbox"
                                checked={filter24h}
                                onChange={(e) => setFilter24h(e.target.checked)}
                                className="w-5 h-5 rounded accent-cyan-500"
                            />
                            <span className="text-gray-700">🌙 24時間営業</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                            <input
                                type="checkbox"
                                checked={filterUnlimitedWater}
                                onChange={(e) => setFilterUnlimitedWater(e.target.checked)}
                                className="w-5 h-5 rounded accent-cyan-500"
                            />
                            <span className="text-gray-700">💧 水道使い放題</span>
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onNearMe}
                            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${sortByDistance
                                    ? "bg-green-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            📍 近くの洗車場
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                        >
                            検索
                        </button>
                    </div>
                </form>
            </div>

            {/* Weather Forecast Widget */}
            <div className="rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                <WeatherForecast lat={targetLocation.lat} lng={targetLocation.lng} />
                <div className="bg-white px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-100">
                    {currentLocation ? '📍 現在地周辺の予報' : '📍 東京の予報 (位置情報ONで周辺を表示)'}
                </div>
            </div>

            {/* Blog/News Links */}
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                    📚 洗車コラム
                </h3>
                <ul className="space-y-3">
                    <li>
                        <Link href="/articles/car-wash-basics" className="text-sm text-gray-700 hover:text-cyan-600 hover:underline block">
                            🧴 初心者向け！正しい手洗い洗車の手順
                        </Link>
                    </li>
                    <li>
                        <Link href="/articles/coating-maintenance" className="text-sm text-gray-700 hover:text-cyan-600 hover:underline block">
                            ✨ コーティング車のメンテナンス方法
                        </Link>
                    </li>
                    <li>
                        <Link href="/articles/night-car-wash" className="text-sm text-gray-700 hover:text-cyan-600 hover:underline block">
                            🌙 深夜の洗車場利用のマナー
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
