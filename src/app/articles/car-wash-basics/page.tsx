
import React from 'react';
import Link from 'next/link';

export default function CarWashBasics() {
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">初心者向け！正しい手洗い洗車の手順</h1>
                    <p className="lead text-gray-600 mb-8">
                        愛車を長く綺麗に保つためには、正しい手順での手洗い洗車が欠かせません。ここでは、初心者の方でも失敗しない、基本的な洗車の手順を解説します。
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">1. 足回りの洗浄</h2>
                    <p>
                        まずはタイヤやホイールから洗い始めましょう。ボディを先に洗っても、足回りの汚れが飛び散ってしまい、二度手間になることがあります。
                        ブレーキダストなどの鉄粉は強力なので、専用のクリーナーを使うのがおすすめです。
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">2. 全体に水をかける</h2>
                    <p>
                        いきなりスポンジで擦るのはNGです！ボディ表面には砂や埃が付着しており、そのまま擦るとヤスリがけをしているのと同じになってしまいます。
                        たっぷりの水で、表面の汚れを洗い流しましょう。上から下へと流すのがポイントです。
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">3. シャンプー洗車</h2>
                    <p>
                        バケツでしっかりと泡立てたシャンプーを使います。スポンジにたっぷりと泡を含ませ、優しく滑らせるように洗います。
                        力を入れる必要はありません。泡の力で汚れを浮かせることが重要です。天井→ボンネット→サイド→リアの順で洗うと効率的です。
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">4. すすぎと拭き上げ</h2>
                    <p>
                        シャンプーが乾く前に、しっかりと水で洗い流します。その後、マイクロファイバークロスなどで水分を拭き取ります。
                        水分が残ると「イオンデポジット（水シミ）」の原因になるので、素早く丁寧に行いましょう。
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
