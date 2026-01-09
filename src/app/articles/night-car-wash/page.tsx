
import React from 'react';
import Link from 'next/link';

export default function NightCarWash() {
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">深夜の洗車場利用のマナー</h1>
                    <p className="lead text-gray-600 mb-8">
                        24時間営業の洗車場は便利ですが、近隣住民の方への配慮が欠かせません。トラブルを避け、気持ちよく利用するためのマナーを確認しましょう。
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">1. 騒音を出さない</h2>
                    <p>
                        深夜は音が響きやすい時間帯です。以下の行動は控えましょう。
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>大声での会話</li>
                        <li>カーステレオの音量を上げる</li>
                        <li>ドアの開閉音を極力静かに行う</li>
                        <li>空ぶかし（エンジンの回転数を上げる行為）</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">2. アイドリングストップ</h2>
                    <p>
                        拭き上げ中や休憩中にエンジンをかけっぱなしにするのは迷惑行為です。
                        特にディーゼル車やマフラーを交換している車は、低周波音が建物内に響くことがあります。
                        洗車機使用中以外はエンジンを切りましょう。
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">3. ゴミは持ち帰る</h2>
                    <p>
                        深夜に限ったことではありませんが、管理人が不在の時間帯にゴミを放置するのは厳禁です。
                        缶やペットボトル、拭き上げに使ったクロスのゴミなどは必ず持ち帰りましょう。
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">まとめ</h2>
                    <p>
                        洗車場が閉鎖される理由の多くは「騒音」や「マナー違反」による近隣トラブルです。
                        貴重な洗車場を守るためにも、ユーザー一人ひとりの心がけが大切です。
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
