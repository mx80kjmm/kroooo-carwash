// サイトのお知らせ・更新情報
export interface NewsItem {
    date: string;
    content: string;
    isNew?: boolean;
}

export const NEWS: NewsItem[] = [
    {
        date: '2025-12-27',
        content: '🎉 サイトをリニューアルしました！ノンブラシ・24時間営業・水道使い放題のフィルター機能を追加しました。',
        isNew: true
    },
    {
        date: '2025-12-27',
        content: '📝 洗車コラムを20記事追加しました。洗車のコツやマナーなど、役立つ情報満載です！',
        isNew: true
    },
    {
        date: '2025-12-26',
        content: '🗺️ 全国の洗車場データを大幅に追加しました。',
    },
];
