
export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-12 px-4 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">利用規約</h1>
                    <p className="text-blue-100">
                        <a href="/" className="hover:underline">← トップに戻る</a>
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">1. 総則</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                本利用規約（以下「本規約」）は、kroooo.com（以下「当サイト」）の利用条件を定めるものです。
                                ユーザーの皆様には、本規約に従って当サイトをご利用いただきます。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">2. 免責事項</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                当サイトは、掲載内容の正確性・完全性について細心の注意を払っておりますが、その内容を保証するものではありません。
                                当サイトの利用によって生じた損害等について、運営者は一切の責任を負いません。
                                洗車場の営業時間や料金等は変更される場合があるため、必ず現地で最新情報をご確認ください。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">3. クッキー（Cookie）の利用</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                当サイトでは、Google AnalyticsやGoogle AdSense等のサービスを利用するためにCookieを使用しています。
                                Cookieの利用に関する詳細は、プライバシーポリシーをご確認ください。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">4. 禁止事項</h2>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                <li>法令または公序良俗に違反する行為</li>
                                <li>当サイトの運営を妨害するおそれのある行為</li>
                                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                                <li>その他、運営者が不適切と判断する行為</li>
                            </ul>
                        </section>

                        <section className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-gray-500 text-sm">
                                制定日: 2025年12月31日
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
