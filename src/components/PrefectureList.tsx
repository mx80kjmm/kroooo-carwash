
import Link from 'next/link';
import { PREFECTURES } from '@/lib/prefectures';

type Region = '北海道' | '東北' | '関東' | '中部' | '近畿' | '中国' | '四国' | '九州';

const REGIONS: Region[] = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州'];

export default function PrefectureList() {
    // 人口順（概算）のソート用マップ
    const PREF_ORDER = [
        '東京都', '神奈川県', '大阪府', '愛知県', '埼玉県', '千葉県', '兵庫県', '北海道', '福岡県', '静岡県',
        '茨城県', '広島県', '京都府', '宮城県', '新潟県', '長野県', '岐阜県', '群馬県', '栃木県', '岡山県',
        '福島県', '三重県', '熊本県', '鹿児島県', '沖縄県', '滋賀県', '愛媛県', '長崎県', '奈良県', '青森県',
        '岩手県', '石川県', '大分県', '山形県', '宮崎県', '富山県', '秋田県', '和歌山県', '香川県', '三重県',
        '佐賀県', '山口県', '徳島県', '福井県', '島根県', '高知県', '鳥取県', '山梨県'
    ];

    const grouped = PREFECTURES.reduce((acc, pref) => {
        const region = pref.region as Region;
        if (!acc[region]) acc[region] = [];
        acc[region].push(pref);
        return acc;
    }, {} as Record<Region, typeof PREFECTURES>);

    // 各地域内でソート
    Object.keys(grouped).forEach((region) => {
        grouped[region as Region].sort((a, b) => {
            const orderA = PREF_ORDER.indexOf(a.name);
            const orderB = PREF_ORDER.indexOf(b.name);
            // リストにない場合は後ろへ
            if (orderA === -1) return 1;
            if (orderB === -1) return -1;
            return orderA - orderB;
        });
    });

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                🗾 都道府県から探す
            </h2>
            <div className="space-y-6">
                {REGIONS.map((region) => (
                    <div key={region}>
                        <h3 className="text-cyan-300 font-bold mb-3 pl-2 border-l-4 border-cyan-400">
                            {region}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {grouped[region]?.map((pref) => (
                                <Link
                                    key={pref.id}
                                    href={`/${pref.id}`}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/20 rounded-lg text-white/90 text-sm transition-all hover:scale-105"
                                >
                                    {pref.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
