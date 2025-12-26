
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'kroooo - 全国コイン洗車場検索',
        short_name: 'kroooo',
        description: '近くのコイン洗車場をカンタン検索。ノーブラシ洗車機対応店舗も充実。',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6', // blue-500
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
