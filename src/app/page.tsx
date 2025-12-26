
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CarwashLocation } from '@/types/carwash';
import CarWashMap from '@/components/CarWashMapWrapper';
import AddSpotButton from '@/components/AddSpotButton';
import FavoriteButton from '@/components/FavoriteButton';

export default function Home() {
  const [locations, setLocations] = useState<CarwashLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterNonBrush, setFilterNonBrush] = useState(false);
  const [filter24h, setFilter24h] = useState(false);
  const [filterUnlimitedWater, setFilterUnlimitedWater] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  // 2点間の距離を計算 (Haversine formula)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert('お使いのブラウザは位置情報をサポートしていません');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setSortByDistance(true);
      },
      () => {
        alert('位置情報の取得に失敗しました');
      }
    );
  };


  // データ取得
  const fetchLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('carwash_locations')
        .select('*')
        .order('created_at', { ascending: false });

      // フィルター適用
      if (filterNonBrush) {
        query = query.eq('has_non_brush', true);
      }
      if (filter24h) {
        query = query.eq('is_24h', true);
      }
      if (filterUnlimitedWater) {
        query = query.eq('has_unlimited_water', true);
      }

      // キーワード検索
      if (searchKeyword) {
        query = query.or(`name.ilike.%${searchKeyword}%,address.ilike.%${searchKeyword}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLocations(data || []);

      if (sortByDistance && userLocation) {
        setLocations(prev => {
          return [...prev].sort((a, b) => {
            const distA = getDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
            const distB = getDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
            return distA - distB;
          });
        });
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [filterNonBrush, filter24h, filterUnlimitedWater, sortByDistance, userLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLocations();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-20">
          <Link href="/favorites" className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white hover:bg-white/30 transition">
            ❤️ お気に入り
          </Link>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 drop-shadow-2xl">
            Kroooo
          </h1>
          <p className="text-cyan-200 mt-2">kroooo.com - 洗車場を探そう</p>
          <div className="mt-6 flex justify-center md:justify-start">
            <AddSpotButton />
          </div>
        </div>
      </section>

      {/* 検索エリア */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="地名・施設名で検索..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 text-lg"
            />
            <button
              type="button"
              onClick={handleNearMe}
              className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${sortByDistance ? 'bg-green-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
            >
              📍 現在地から近い順
            </button>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-cyan-500/30"
            >
              🔍 検索
            </button>
          </form>

          {/* フィルター */}
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-white cursor-pointer group bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition">
              <input
                type="checkbox"
                checked={filterNonBrush}
                onChange={(e) => setFilterNonBrush(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-500"
              />
              <span className="group-hover:text-cyan-300 transition-colors">
                ✨ ノンブラシ
              </span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer group bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition">
              <input
                type="checkbox"
                checked={filter24h}
                onChange={(e) => setFilter24h(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-500"
              />
              <span className="group-hover:text-cyan-300 transition-colors">
                🌙 24時間営業
              </span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer group bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition">
              <input
                type="checkbox"
                checked={filterUnlimitedWater}
                onChange={(e) => setFilterUnlimitedWater(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-500"
              />
              <span className="group-hover:text-cyan-300 transition-colors">
                💧 水道使い放題
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* マップエリア */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-white/20">
          {!loading && locations.length > 0 && <CarWashMap locations={locations} center={[35.0116, 135.7681]} zoom={8} />}
        </div>
      </section>

      {/* 結果エリア */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 backdrop-blur rounded-xl p-6 text-white text-center">
            <p className="text-xl">⚠️ {error}</p>
            <p className="mt-2 text-white/70">Supabase との接続を確認してください</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="bg-white/10 backdrop-blur rounded-xl p-12 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-white text-xl">洗車場が見つかりませんでした</p>
            <p className="text-white/60 mt-2">検索条件を変更してお試しください</p>
          </div>
        ) : (
          <>
            <p className="text-cyan-200 mb-4">
              {locations.length} 件の洗車場が見つかりました
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-[1.02] hover:shadow-2xl group relative"
                >
                  <Link href={`/location/${location.id}`} className="absolute inset-0 z-0"></Link>

                  <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors pointer-events-auto">
                      {location.name}
                    </h3>
                    <div className="pointer-events-auto">
                      <FavoriteButton locationId={location.id} className="bg-white shadow-sm" />
                    </div>
                  </div>

                  <p className="text-cyan-50 mb-4 text-sm flex items-center gap-2 pointer-events-none">
                    <span>📍</span> {location.address}
                  </p>
                  <div className="flex flex-wrap gap-2 pointer-events-none">
                    {location.has_non_brush && (
                      <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 rounded-full text-xs font-bold">
                        ✨ ノンブラシ
                      </span>
                    )}
                    {location.has_self_wash && (
                      <span className="px-3 py-1 bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 rounded-full text-xs">
                        💦 セルフ
                      </span>
                    )}
                    {location.has_auto_wash && (
                      <span className="px-3 py-1 bg-purple-500/30 text-purple-300 border border-purple-400/30 rounded-full text-xs">
                        🤖 全自動
                      </span>
                    )}
                    {location.has_vacuum && (
                      <span className="px-3 py-1 bg-purple-500/30 text-purple-200 text-xs rounded-full border border-purple-400/30">
                        掃除機
                      </span>
                    )}
                  </div>

                  {location.business_hours && (
                    <p className="text-white/60 mt-3 text-sm flex items-center gap-2">
                      <span>🕐</span>
                      <span>{location.business_hours}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* フッター */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/60">
            © 2025 kroooo.com - 全国コイン洗車場データベース
          </p>
          <div className="mt-4 space-x-4">
            <a href="/privacy" className="text-cyan-300 hover:underline text-sm">
              プライバシーポリシー
            </a>
            <a href="/contact" className="text-cyan-300 hover:underline text-sm">
              お問い合わせ
            </a>
          </div>
          <p className="text-white/40 text-sm mt-2">
            情報の掲載・修正のご依頼はお問い合わせください
          </p>
        </div>
      </footer>
    </div>
  );
}
