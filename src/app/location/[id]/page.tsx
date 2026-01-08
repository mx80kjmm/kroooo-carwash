import { Tweet } from 'react-tweet';
import { supabase } from '@/lib/supabase';
import { CarwashLocation } from '@/types/carwash';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReportModal from '@/components/ReportModal';
import FavoriteButton from '@/components/FavoriteButton';
import CarWashMap from '@/components/CarWashMapWrapper';
import ReportButton from '@/components/ReportButton';
import WeatherForecast from '@/components/WeatherForecast';

interface Props {
    params: Promise<{ id: string }>;
}

// Generate Static Params for all locations (SSG)
export async function generateStaticParams() {
    const { data: locations } = await supabase
        .from('carwash_locations')
        .select('id');

    return locations?.map((loc) => ({
        id: loc.id,
    })) || [];
}

export const revalidate = 3600; // Revalidate every hour

async function getLocation(id: string): Promise<CarwashLocation | null> {
    const { data, error } = await supabase
        .from('carwash_locations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

export default async function LocationDetail({ params }: Props) {
    const { id } = await params;
    const location = await getLocation(id);

    if (!location) {
        notFound();
    }

    // 内部管理用の文言を削除するフィルター
    const cleanText = (text: string | undefined): string => {
        if (!text) return '';
        return text
            .replace(/\(無名\)/g, '')
            .replace(/（無名）/g, '')
            .replace(/ユーザー指摘による追加/g, '')
            .replace(/※/g, '')
            .trim();
    }

    // 表示用にテキストを整形
    location.name = cleanText(location.name);
    location.notes = cleanText(location.notes);
    location.description = cleanText(location.description);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AutoWash',
        name: location.name,
        address: {
            '@type': 'PostalAddress',
            streetAddress: location.address,
            addressCountry: 'JP'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: location.latitude,
            longitude: location.longitude
        },
        url: `https://kroooo.com/location/${location.id}`,
        priceRange: location.price_range || '不明',
        openingHours: location.business_hours, // Need simple format? schema.org likes "Mo-Fr 09:00-17:00". Our string is free text.
        // If equipment exists, add 'amenityFeature'?
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* ヘッダー */}
            <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2 block w-fit">
                        Kroooo
                    </Link>
                    <Link
                        href="/"
                        className="text-cyan-300 hover:text-white transition-colors flex items-center gap-2"
                    >
                        ← 一覧に戻る
                    </Link>
                    <h1 className="text-3xl font-bold text-white mt-4 flex items-center gap-3">
                        <span className="text-4xl">🚗</span>
                        {location.name}
                        <FavoriteButton locationId={location.id} className="bg-white/90 shadow text-gray-800" />
                    </h1>
                </div>
            </header>

            {/* 詳細 */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                    {/* 基本情報 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-2">
                            📍 基本情報
                        </h2>
                        <div className="space-y-3">
                            <p className="text-white/90 flex items-start gap-3">
                                <span className="text-cyan-400 w-20 shrink-0">住所</span>
                                <span>{location.address}</span>
                            </p>
                            {location.phone && (
                                <p className="text-white/90 flex items-start gap-3">
                                    <span className="text-cyan-400 w-20 shrink-0">電話</span>
                                    <a href={`tel:${location.phone}`} className="hover:text-cyan-300 transition-colors">
                                        {location.phone}
                                    </a>
                                </p>
                            )}

                            {location.business_hours && (
                                <p className="text-white/90 flex items-start gap-3">
                                    <span className="text-cyan-400 w-20 shrink-0">営業時間</span>
                                    <span className="whitespace-pre-wrap leading-relaxed">{location.business_hours}</span>
                                </p>
                            )}
                            {location.price_range && (
                                <p className="text-white/90 flex items-start gap-3">
                                    <span className="text-cyan-400 w-20 shrink-0">料金目安</span>
                                    <span>{location.price_range}</span>
                                </p>
                            )}
                            {location.google_rating && (
                                <p className="text-white/90 flex items-start gap-3">
                                    <span className="text-cyan-400 w-20 shrink-0">Google評価</span>
                                    <span className="flex items-center gap-2 flex-wrap">
                                        <span className="text-yellow-400 font-bold text-lg">★ {location.google_rating}</span>
                                        <span className="text-white/60 text-sm">({location.google_user_ratings_total}件のクチコミ)</span>
                                        {location.google_place_id && (
                                            <a
                                                href={`https://search.google.com/local/reviews?placeid=${location.google_place_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-cyan-300 transition-colors"
                                            >
                                                クチコミを見る
                                            </a>
                                        )}
                                    </span>
                                </p>
                            )}
                        </div>
                        {/* 紹介文 */}
                        {location.description && (
                            <div className="mb-8 p-6 bg-blue-900/40 rounded-xl border border-blue-400/30">
                                <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center gap-2">
                                    🤖 AIロボットの紹介
                                </h3>
                                <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                                    {location.description}
                                </p>
                            </div>
                        )}


                        <div className="mt-4 pt-4 border-t border-white/10">
                            <ReportButton locationId={location.id} locationName={location.name} />
                        </div>
                    </section>

                    {/* 天気予報 */}
                    <section className="mb-8">
                        <WeatherForecast lat={location.latitude} lng={location.longitude} />
                    </section>

                    {/* 地図 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-2">
                            🗺️ アクセス
                        </h2>
                        <div className="bg-white rounded-xl overflow-hidden border-2 border-white/20 h-[400px]">
                            <CarWashMap locations={[location]} height="400px" />
                        </div>
                    </section>

                    {/* 設備 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-2">
                            🛠️ 設備・サービス
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl border ${location.has_non_brush ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/50' : 'bg-gray-800/30 border-white/5 opacity-50'}`}>
                                <p className={`font-bold ${location.has_non_brush ? 'text-yellow-300' : 'text-gray-400 line-through'}`}>
                                    ✨ ノンブラシ
                                </p>
                                <p className="text-sm text-white/40 mt-1">{location.has_non_brush ? 'コーティング車対応' : '非対応'}</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${location.has_self_wash ? 'bg-cyan-500/20 border-cyan-400/50' : 'bg-gray-800/30 border-white/5 opacity-50'}`}>
                                <p className={`font-bold ${location.has_self_wash ? 'text-cyan-300' : 'text-gray-400 line-through'}`}>
                                    🚿 セルフ洗車
                                </p>
                                <p className="text-sm text-white/40 mt-1">{location.has_self_wash ? '高圧洗浄機' : '非対応'}</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${location.has_auto_wash ? 'bg-blue-500/20 border-blue-400/50' : 'bg-gray-800/30 border-white/5 opacity-50'}`}>
                                <p className={`font-bold ${location.has_auto_wash ? 'text-blue-300' : 'text-gray-400 line-through'}`}>
                                    🤖 自動洗車機
                                </p>
                                <p className="text-sm text-white/40 mt-1">{location.has_auto_wash ? '門型洗車機' : '非対応'}</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${location.has_vacuum ? 'bg-purple-500/20 border-purple-400/50' : 'bg-gray-800/30 border-white/5 opacity-50'}`}>
                                <p className={`font-bold ${location.has_vacuum ? 'text-purple-300' : 'text-gray-400 line-through'}`}>
                                    🧹 掃除機
                                </p>
                                <p className="text-sm text-white/40 mt-1">{location.has_vacuum ? '車内清掃用' : '非対応'}</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${location.has_mat_wash ? 'bg-green-500/20 border-green-400/50' : 'bg-gray-800/30 border-white/5 opacity-50'}`}>
                                <p className={`font-bold ${location.has_mat_wash ? 'text-green-300' : 'text-gray-400 line-through'}`}>
                                    🧽 マット洗い
                                </p>
                                <p className="text-sm text-white/40 mt-1">{location.has_mat_wash ? 'フロアマット' : '非対応'}</p>
                            </div>
                        </div>
                    </section>

                    {/* 備考 */}
                    {location.notes && (
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-2">
                                📝 備考
                            </h2>
                            <p className="text-white/80 whitespace-pre-wrap">{location.notes}</p>
                        </section>
                    )}

                    {/* X Post Embed */}
                    {location.x_post_url && (
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-2">
                                🐦 最新の投稿 (X/Twitter)
                            </h2>
                            <div className="flex justify-center bg-white/5 rounded-xl p-4 light-theme">
                                {(() => {
                                    const match = location.x_post_url?.match(/status\/(\d+)/);
                                    if (match) {
                                        return <Tweet id={match[1]} />;
                                    }
                                    return <a href={location.x_post_url} target="_blank" className="text-cyan-300 hover:text-white">Twitterを開く</a>;
                                })()}
                            </div>
                        </section>
                    )}

                    {/* Google Map リンク */}
                    <section>
                        <a
                            href={location.google_place_id
                                ? `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${location.google_place_id}`
                                : `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg"
                        >
                            🗺️ Google マップで開く
                        </a>
                    </section>
                </div>
            </main >

            {/* フッター */}
            < footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8 mt-8" >
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-white/60">
                        © 2025 kroooo.com - 全国コイン洗車場データベース
                    </p>
                </div>
            </footer >
        </div >
    );
}
