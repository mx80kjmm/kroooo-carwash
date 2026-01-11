
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CarwashLocation } from '@/types/carwash';
import CarWashMap from '@/components/CarWashMapWrapper';
import AddSpotButton from '@/components/AddSpotButton';
import FavoriteButton from '@/components/FavoriteButton';
import PrefectureList from '@/components/PrefectureList';
import { NEWS } from '@/data/news';
import JapanMap from '@/components/JapanMap';
import Sidebar from '@/components/Sidebar';



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
      (error) => {
        let errorMessage = '位置情報の取得に失敗しました';
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = '位置情報の利用が拒否されました。\n端末やブラウザの設定で位置情報の利用を許可してください。';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = '現在位置を特定できませんでした。\n電波の良い場所で再度お試しください。';
            break;
          case 3: // TIMEOUT
            errorMessage = '位置情報の取得に時間がかかりすぎました。\nもう一度お試しください。';
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true, // 高精度な位置情報を要求
        timeout: 10000,           // 10秒でタイムアウト
        maximumAge: 0             // キャッシュを使用しない
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterNonBrush, filter24h, filterUnlimitedWater, sortByDistance, userLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLocations();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header / Hero Section (Slimmer) */}
      <header className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-cyan-200 transition">
            Kroooo
          </Link>
          <div className="flex gap-3 text-sm">
            <AddSpotButton />
            <Link href="/favorites" className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition">
              ❤️ <span className="hidden sm:inline">お気に入り</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Column (Left) */}
          <div className="flex-1 space-y-8">

            {/* Hero Copy & News */}
            <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                このサイトは洗車難民による洗車難民のための情報サイトです
              </h1>
              <p className="text-gray-600 mb-6">
                全国のコイン洗車場を網羅的に検索できます。
              </p>

              {/* News Ticker Style */}
              <div className="bg-blue-50 rounded-lg p-3 flex flex-col sm:flex-row gap-2 text-sm text-blue-900">
                <span className="font-bold flex-shrink-0">📢 お知らせ:</span>
                <div className="flex-1 space-y-1">
                  {NEWS.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-blue-500 text-xs font-mono">{item.date}</span>
                      <span className="line-clamp-1">{item.content}</span>
                      {item.isNew && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">NEW</span>}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Interactive Japan Map */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🗺️ マップから探す
              </h2>
              <div className="h-[400px] md:h-[500px] w-full">
                <JapanMap className="h-full w-full" />
              </div>
            </section>

            {/* Search Results */}
            <section id="results">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  🚙 洗車場一覧
                </h2>
                {!loading && (
                  <span className="text-sm text-gray-500">
                    {locations.length} 件
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
                  <p>⚠️ {error}</p>
                </div>
              ) : locations.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
                  <p className="text-4xl mb-4">😢</p>
                  <p className="text-gray-600">条件に一致する洗車場が見つかりませんでした</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-cyan-200 group relative"
                    >
                      <Link href={`/location/${location.id}`} className="absolute inset-0 z-0"></Link>

                      <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-cyan-600 transition-colors pointer-events-auto line-clamp-1">
                          {location.name}
                        </h3>
                        <div className="pointer-events-auto flex-shrink-0 ml-2">
                          <FavoriteButton locationId={location.id} className="bg-gray-50 shadow-sm hover:bg-red-50" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3 text-sm">
                        {location.google_rating ? (
                          <>
                            <span className="text-yellow-500 font-bold">★ {location.google_rating}</span>
                            <span className="text-gray-400 text-xs">({location.google_user_ratings_total})</span>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs">評価なし</span>
                        )}
                      </div>

                      <p className="text-gray-500 mb-4 text-xs flex items-center gap-1 pointer-events-none line-clamp-1">
                        <span>📍</span> {location.address}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pointer-events-none">
                        {location.has_non_brush && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded text-[10px] font-bold">
                            ノンブラシ
                          </span>
                        )}
                        {location.has_self_wash && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded text-[10px]">
                            セルフ
                          </span>
                        )}
                        {location.is_24h && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 border border-purple-200 rounded text-[10px]">
                            24h
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Prefecture List (Bottom) */}
            <section className="pt-8 border-t border-gray-200">
              <PrefectureList />
            </section>
          </div>

          {/* Sidebar Column (Right) - Hidden on mobile initially, or stacked? Requirement said 2-column. */}
          {/* Using lg:block for desktop, standard flow for mobile (stacked below main content? No, usually stacked ABOVE or BELOW depending on importance.
              Search is important. Let's keep it in the flow. But typically sidebar is second on mobile.
              However, for usability, search might need to be accessible. 
              Let's put Sidebar logic: On mobile, it appears below "Hero" but above "Japan Map" if we reorder, but HTML structure dictates order.
              Flex-col-reverse on mobile? No, Content first is better for SEO. Sidebar (Search) might be better at top?
              Let's stick to standard ordering: Main Content then Sidebar on mobile, But Sidebar contains Search. 
              Wait, user might want to search immediately. 
              For now, standard layout: Left (Main) + Right (Sidebar). On mobile: Main then Sidebar.
              Actually, the mock showed "Search Widget" inside Sidebar. If mobile users scroll past map to find search, it's bad.
              Maybe I'll hide sidebar search on mobile and put a compact search bar in main? 
              Or just keep it simple: 2 column on desktop, 1 column on mobile.
          */}
          <Sidebar
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            filterNonBrush={filterNonBrush}
            setFilterNonBrush={setFilterNonBrush}
            filter24h={filter24h}
            setFilter24h={setFilter24h}
            filterUnlimitedWater={filterUnlimitedWater}
            setFilterUnlimitedWater={setFilterUnlimitedWater}
            onSearch={handleSearch}
            onNearMe={handleNearMe}
            sortByDistance={sortByDistance}
            currentLocation={userLocation}
          />

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 mb-4">
            © 2025 kroooo.com - 全国コイン洗車場データベース
          </p>
          <div className="flex justify-center gap-6 mb-6">
            <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 text-sm transition">
              プライバシーポリシー
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-cyan-400 text-sm transition">
              お問い合わせ
            </Link>
          </div>
          <p className="text-gray-600 text-xs">
            情報の掲載・修正のご依頼はお問い合わせフォームよりご連絡ください。
          </p>
        </div>
      </footer>
    </div>
  );
}
