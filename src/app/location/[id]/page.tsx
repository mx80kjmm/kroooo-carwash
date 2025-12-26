import { supabase } from '@/lib/supabase';
import { CarwashLocation } from '@/types/carwash';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
            {/* ヘッダー */}
            <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link
                        href="/"
                        className="text-cyan-300 hover:text-white transition-colors flex items-center gap-2"
                    >
                        ← 一覧に戻る
                    </Link>
                    <h1 className="text-3xl font-bold text-white mt-4 flex items-center gap-3">
                        <span className="text-4xl">🚗</span>
                        {location.name}
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
                                    <span>{location.business_hours}</span>
                                </p>
                            )}
                            {location.price_range && (
                                <p className="text-white/90 flex items-start gap-3">
                                    <span className="text-cyan-400 w-20 shrink-0">料金目安</span>
                                    <span>{location.price_range}</span>
                                </p>
                            )}
                        </div>
                    </section>

                    {/* 設備 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-2">
                            🛠️ 設備・サービス
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl border ${location.has_non_brush ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/50' : 'bg-white/5 border-white/10'}`}>
                                <p className={`font-bold ${location.has_non_brush ? 'text-yellow-300' : 'text-white/40'}`}>
                                    ✨ ノンブラシ
                                </p>
                                <p className="text-sm text-white/60 mt-1">コーティング車対応</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${location.has_self_wash ? 'bg-cyan-500/20 border-cyan-400/50' : 'bg-white/5 border-white/10'}`}>
                                <p className={`font-bold ${location.has_self_wash ? 'text-cyan-300' : 'text-white/40'}`}>
                                    🚿 セルフ洗車
                                </p>
                                <p className="text-sm text-white/60 mt-1">高圧洗浄機</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${location.has_auto_wash ? 'bg-blue-500/20 border-blue-400/50' : 'bg-white/5 border-white/10'}`}>
                                <p className={`font-bold ${location.has_auto_wash ? 'text-blue-300' : 'text-white/40'}`}>
                                    🤖 自動洗車機
                                </p>
                                <p className="text-sm text-white/60 mt-1">門型洗車機</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${location.has_vacuum ? 'bg-purple-500/20 border-purple-400/50' : 'bg-white/5 border-white/10'}`}>
                                <p className={`font-bold ${location.has_vacuum ? 'text-purple-300' : 'text-white/40'}`}>
                                    🧹 掃除機
                                </p>
                                <p className="text-sm text-white/60 mt-1">車内清掃用</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${location.has_mat_wash ? 'bg-green-500/20 border-green-400/50' : 'bg-white/5 border-white/10'}`}>
                                <p className={`font-bold ${location.has_mat_wash ? 'text-green-300' : 'text-white/40'}`}>
                                    🧽 マット洗い
                                </p>
                                <p className="text-sm text-white/60 mt-1">フロアマット</p>
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

                    {/* Google Map リンク */}
                    <section>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg"
                        >
                            🗺️ Google マップで開く
                        </a>
                    </section>
                </div>
            </main>

            {/* フッター */}
            <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8 mt-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-white/60">
                        © 2025 kroooo.com - 全国コイン洗車場データベース
                    </p>
                </div>
            </footer>
        </div>
    );
}
