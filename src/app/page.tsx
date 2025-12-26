'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CarwashLocation } from '@/types/carwash';

export default function Home() {
  const [locations, setLocations] = useState<CarwashLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterNonBrush, setFilterNonBrush] = useState(false);

  // データ取得
  const fetchLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('carwash_locations')
        .select('*')
        .order('created_at', { ascending: false });

      // ノンブラシフィルター
      if (filterNonBrush) {
        query = query.eq('has_non_brush', true);
      }

      // キーワード検索
      if (searchKeyword) {
        query = query.or(`name.ilike.%${searchKeyword}%,address.ilike.%${searchKeyword}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLocations(data || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [filterNonBrush]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLocations();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
      {/* ヘッダー */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">🚗</span>
            全国コイン洗車場データベース
          </h1>
          <p className="text-cyan-200 mt-2">kroooo.com - 洗車場を探そう</p>
        </div>
      </header>

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
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-cyan-500/30"
            >
              🔍 検索
            </button>
          </form>

          {/* フィルター */}
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-white cursor-pointer group">
              <input
                type="checkbox"
                checked={filterNonBrush}
                onChange={(e) => setFilterNonBrush(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-500"
              />
              <span className="group-hover:text-cyan-300 transition-colors">
                ✨ ノンブラシ（コーティング車対応）のみ
              </span>
            </label>
          </div>
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
                <a
                  key={location.id}
                  href={`/location/${location.id}`}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-[1.02] hover:shadow-2xl group cursor-pointer block"
                >
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {location.name}
                  </h3>
                  <p className="text-white/70 mt-2 flex items-start gap-2">
                    <span>📍</span>
                    <span>{location.address}</span>
                  </p>

                  {/* 設備タグ */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {location.has_non_brush && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold rounded-full">
                        ✨ ノンブラシ
                      </span>
                    )}
                    {location.has_self_wash && (
                      <span className="px-3 py-1 bg-cyan-500/30 text-cyan-200 text-sm rounded-full border border-cyan-400/30">
                        セルフ
                      </span>
                    )}
                    {location.has_auto_wash && (
                      <span className="px-3 py-1 bg-blue-500/30 text-blue-200 text-sm rounded-full border border-blue-400/30">
                        自動
                      </span>
                    )}
                    {location.has_vacuum && (
                      <span className="px-3 py-1 bg-purple-500/30 text-purple-200 text-sm rounded-full border border-purple-400/30">
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
                </a>
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
          <p className="text-white/40 text-sm mt-2">
            情報の掲載・修正のご依頼はお問い合わせください
          </p>
        </div>
      </footer>
    </div>
  );
}
