
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticle, ARTICLES } from '@/data/articles';
import { Metadata } from 'next';

export function generateStaticParams() {
    return ARTICLES.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const article = getArticle(resolvedParams.slug);
    if (!article) return {};

    return {
        title: `${article.title} | krooooコラム`,
        description: article.summary,
        openGraph: {
            title: article.title,
            description: article.summary,
            type: 'article',
            publishedTime: article.publishedAt,
        }
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = getArticle(resolvedParams.slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Nav */}
            <header className="bg-white border-b sticky top-0 z-50/ shadow-sm">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/articles" className="text-gray-500 hover:text-gray-900 text-sm font-bold flex items-center gap-1">
                        ← コラム一覧
                    </Link>
                    <Link href="/" className="text-blue-600 font-bold text-lg">kroooo</Link>
                </div>
            </header>

            <article className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Article Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 md:p-12 text-center">
                        <div className="text-6xl mb-6">{article.emoji}</div>
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                            {article.title}
                        </h1>
                        <time className="text-gray-500 font-medium">{article.publishedAt}</time>
                    </div>

                    {/* Content */}
                    <div
                        className="p-8 md:p-12 prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-p:text-gray-600 prose-p:leading-8 prose-li:text-gray-600"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* CTA */}
                <div className="mt-12 bg-blue-600 rounded-2xl p-8 text-center text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-2">早速実践してみませんか？</h3>
                    <p className="mb-6 text-blue-100">近くのノンブラシ洗車機を探して、愛車をピカピカにしましょう！</p>
                    <Link
                        href="/"
                        className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow hover:bg-gray-100 transition transform hover:scale-105"
                    >
                        近くの洗車場を探す
                    </Link>
                </div>
            </article>
        </div>
    );
}
