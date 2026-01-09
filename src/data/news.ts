// サイトのお知らせ・更新情報
export interface NewsItem {
    date: string;
    content: string;
    isNew?: boolean;
}

export const NEWS: NewsItem[] = [
    {
        date: '2026.01.10',
        content: '🚀 サイトリニューアル！TOPページが使いやすくなり、洗車予報・コラム機能が追加されました。',
        isNew: true
    },
    {
        date: '2026.01.07',
        content: '🙇 データ修正中：現在、住所情報の誤りを順次修正しています。ご不便をおかけして申し訳ありません！',
        isNew: false
    },
    {
        date: '2025.12.31',
        content: '🎉 サイトをリニューアル！地図機能の強化・修正を行いました。',
        isNew: false
    },
    {
        date: '2025.12.31',
        content: '🚗 掲載店舗数が大幅増加！全国の洗車場情報が充実しました。',
        isNew: false
    },
    {
        date: '2025.12.30',
        content: '🤖 AIキャラクター「洗太郎」による紹介文が追加されました！',
    },
    {
        date: '2025.12.27',
        content: '📝 洗車コラムを20記事追加しました。',
    },
];
