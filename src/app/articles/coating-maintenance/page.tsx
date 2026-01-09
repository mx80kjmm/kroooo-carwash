
import React from 'react';
import Link from 'next/link';

export default function CoatingMaintenance() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <header className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link href="/" className="text-2xl font-bold tracking-tight hover:text-cyan-200 transition">
                        Kroooo
                    </Link>
                </div>
            </header>
            <main className="max-w-3xl mx-auto px-4 py-8">
                <article className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 prose prose-blue max-w-none">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">コーティング車のメンテナンス方法</h1>
                    <p className="lead text-gray-600 mb-8">
                        「コーティングしているから洗車しなくていい」は大きな間違いです！コーティングの効果を長持ちさせるためには、適切なメンテナンス（定期的な洗車）が必要です。
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">なぜメンテナンスが必要？</h2>
                    <p>
                        コーティング被膜の上に、大気中の汚れやミネラル分が蓄積すると、撥水効果が低下したり、艶が失われたりします。
                        この「汚れの膜」を取り除くのがメンテナンス洗洗車の目的です。
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">NGな洗い方</h2>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>コンパウンド（研磨剤）入りのシャンプーを使う</strong>：コーティング被膜を削ってしまいます。</li>
                        <li><strong>洗車機に通す（ブラシあり）</strong>：硬いブラシは被膜に傷をつける可能性があります（ノンブラシなら比較的安全です）。</li>
                        <li><strong>井戸水での洗車を放置</strong>：ミネラル分が多く、頑固なシミの原因になります。</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">おすすめのメンテナンス</h2>
                    <p>
                        基本は「水洗い」または「コーティング施工車対応（中性・ノーコンパウンド）シャンプー」での手洗いです。
                        1ヶ月に1回程度、メンテナンス剤（オーバーコート）を使用すると、撥水性や艶が復活し、犠牲被膜として本コーティングを守ってくれます。
                    </p>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
                            ← TOPページに戻る
                        </Link>
                    </div>
                </article>
            </main>
        </div>
    );
}
