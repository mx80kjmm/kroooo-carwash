
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CarwashLocation } from '@/types/carwash';
import FavoriteButton from '@/components/FavoriteButton';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesPage() {
    const { favorites, isLoaded } = useFavorites();
    const [locations, setLocations] = useState<CarwashLocation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoaded) return;

        if (favorites.length === 0) {
            setLocations([]);
            setLoading(false);
            return;
        }

        const fetchFavorites = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('carwash_locations')
                .select('*')
                .in('id', favorites);

            setLocations(data || []);
            setLoading(false);
        };

        fetchFavorites();
    }, [favorites, isLoaded]);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
                    <Link href="/" className="text-gray-500 hover:text-gray-900">
                        ← ホームに戻る
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">お気に入り洗車場</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : locations.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <p className="text-xl text-gray-500 mb-4">お気に入りはまだありません</p>
                        <p className="text-gray-400 mb-6">気になった洗車場の「❤️」を押して保存しましょう。</p>
                        <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            洗車場を探す
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locations.map((location) => (
                            <div
                                key={location.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group relative border border-gray-100 p-6"
                            >
                                <Link href={`/location/${location.id}`} className="absolute inset-0 z-0"></Link>

                                <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors pointer-events-auto">
                                        {location.name}
                                    </h3>
                                    <div className="pointer-events-auto">
                                        <FavoriteButton locationId={location.id} />
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4 text-sm flex items-center gap-2 pointer-events-none">
                                    <span>📍</span> {location.address}
                                </p>

                                <div className="flex flex-wrap gap-2 pointer-events-none">
                                    {location.has_non_brush && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-bold">
                                            ✨ ノンブラシ
                                        </span>
                                    )}
                                    {location.has_self_wash && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            💦 セルフ
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
