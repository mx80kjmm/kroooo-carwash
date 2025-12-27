
import Link from 'next/link';
import { PREFECTURES } from '@/lib/prefectures';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-xl font-bold text-white mb-4">kroooo.com</h2>
                        <p className="text-sm text-gray-400 mb-4">
                            全国のコイン洗車場・セルフ洗車場を検索できるデータベースサイトです。
                            ノンブラシ洗車機や高圧洗浄機など、こだわりの設備条件で絞り込み検索が可能です。
                        </p>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p>運営者: kroooo</p>
                            <p>お問い合わせ: <a href="mailto:contact@kroooo.com" className="text-cyan-400 hover:underline">contact@kroooo.com</a></p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <h3 className="text-sm font-bold text-gray-400 mb-4">都道府県から探す</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        {PREFECTURES.map((pref) => (
                            <Link
                                key={pref.id}
                                href={`/${pref.id}`}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                {pref.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <div className="flex gap-4 mb-4 md:mb-0">
                        <Link href="/favorites" className="hover:text-white font-bold text-yellow-500">❤️ お気に入り</Link>
                        <Link href="/articles" className="hover:text-white">📝 洗車コラム</Link>
                        <Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link>
                        {/* <Link href="/terms" className="hover:text-white">利用規約</Link> */}
                    </div>
                    <p>&copy; {new Date().getFullYear()} kroooo.com All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
