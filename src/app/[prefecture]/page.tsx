
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getPrefecture, PREFECTURES } from '@/lib/prefectures';
import CarWashMap from '@/components/CarWashMapWrapper';
import Link from 'next/link';

// Static Params Generation (SSG)
export function generateStaticParams() {
    return PREFECTURES.map((p) => ({
        prefecture: p.id,
    }));
}

// Metadata
export async function generateMetadata({ params }: { params: { prefecture: string } }) {
    const pref = getPrefecture(params.prefecture);
    if (!pref) return {};

    return {
        title: `${pref.name}のコイン洗車場一覧 (${pref.region}) | Kroooo`,
        description: `${pref.name}内のコイン洗車場・ノーブラシ洗車機・高圧洗浄機があるスポットを検索。${pref.name}の洗車場マップ。`,
        openGraph: {
            title: `${pref.name}のコイン洗車場一覧 | Kroooo`,
            description: `${pref.name}の洗車場を地図から探せます。`,
            url: `https://kroooo.com/${params.prefecture}`,
            type: 'website',
        },
    };
}

export default async function PrefecturePage({ params }: { params: Promise<{ prefecture: string }> }) {
    const resolvedParams = await params;
    const pref = getPrefecture(resolvedParams.prefecture);

    if (!pref) {
        notFound();
    }

    // SSR or SSG Fetch? Since it uses supabase client (client/server), for SSG we usually use createClient from utils/supabase/client? 
    // No, for SSG generation (build time), we need to fetch data.
    // If we use 'use client', it's client side.
    // But we want SEO (Server/Build side).
    // So we should fetch in this Server Component.

    // NOTE: Using the simple singleton client from '@/lib/supabase' might be better for Public Data Fetching in SSG?
    // Using '@/lib/supabase' (anon key).
    const { supabase } = await import('@/lib/supabase'); // Import the existing singleton

    const { data: locations, error } = await supabase
        .from('carwash_locations')
        .select('*')
        .like('address', `${pref.name}%`)
        .eq('is_active', true)
        .order('id');

    if (error) {
        console.error(error);
        return <div>Error loading data</div>;
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${pref.name}のコイン洗車場一覧`,
        description: `${pref.name}にある${locations?.length || 0}件の洗車場情報`,
        url: `https://kroooo.com/${pref.id}`,
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: locations?.map((loc, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://kroooo.com/location/${loc.id}`,
                name: loc.name
            }))
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white pt-24 pb-12 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="text-sm text-blue-100 mb-2">
                        <Link href="/" className="hover:text-white hover:underline">ホーム</Link>
                        {' > '}
                        <span>{pref.name}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {pref.name}のコイン洗車場一覧
                    </h1>
                    <p className="text-lg text-blue-100">
                        {locations?.length || 0}件のスポットが見つかりました
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 -mt-8">
                {/* Map */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-12 border border-gray-200 h-[500px]">
                    {locations && locations.length > 0 ? (
                        <CarWashMap locations={locations} zoom={9} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            マップデータがありません
                        </div>
                    )}
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations?.map((loc) => (
                        <Link
                            key={loc.id}
                            href={`/location/${loc.id}`}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition block overflow-hidden border border-gray-100"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{loc.name}</h3>
                                {loc.google_rating && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-yellow-500 font-bold text-sm">★ {loc.google_rating}</span>
                                        <span className="text-gray-500 text-xs">({loc.google_user_ratings_total})</span>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500 mb-4">{loc.address}</p>
                                <div className="flex flex-wrap gap-2">
                                    {loc.has_non_brush && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-bold">
                                            ✨ ノンブラシ
                                        </span>
                                    )}
                                    {loc.has_self_wash && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            💦 セルフ
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
