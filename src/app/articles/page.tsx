
import Link from 'next/link';
import { ARTICLES } from '@/data/articles';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '洗車コラム・ガイド | kroooo.com',
    description: '洗車のコツやノンブラシ洗車機のメリット、コイン洗車場の使い方などを解説するお役立ちコラム集。',
};

export default function ArticlesIndex() {
    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
                    <Link href="/" className="text-gray-500 hover:text-gray-900">
                        ← ホームに戻る
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span>📚</span> 洗車コラム
                    </h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid gap-8">
                    {ARTICLES.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/articles/${article.slug}`}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 p-8 flex flex-col md:flex-row gap-6 items-start"
                        >
                            <div className="w-full md:w-48 h-48 md:h-32 shrink-0 relative overflow-hidden rounded-2xl">
                                <img
                                    src={article.thumbnail}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">
                                    {article.title}
                                </h2>
                                <p className="text-sm text-gray-400 mb-3">{article.publishedAt}</p>
                                <p className="text-gray-600 leading-relaxed">
                                    {article.summary}
                                </p>
                                <div className="mt-4 text-blue-600 font-bold text-sm flex items-center gap-1">
                                    続きを読む →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
