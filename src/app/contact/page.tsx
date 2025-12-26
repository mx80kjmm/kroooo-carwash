export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">お問い合わせ</h1>
          <p className="text-cyan-200 mt-2">
            <a href="/" className="hover:underline">← トップに戻る</a>
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none text-white/90">
            <h2 className="text-2xl font-bold text-white mb-6">
              洗車場情報の掲載・修正について
            </h2>

            <p className="mb-6">
              kroooo.comをご利用いただき、ありがとうございます。
              洗車場情報の掲載リクエストや、既存情報の修正依頼は以下のメールアドレスまでお願いいたします。
            </p>

            <div className="bg-white/10 rounded-xl p-6 mb-8">
              <p className="text-lg font-semibold text-cyan-300 mb-2">メールアドレス</p>
              <p className="text-2xl font-bold text-white">
                info@kroooo.com
              </p>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">ご連絡いただく際に記載いただきたい内容</h3>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>洗車場の名称</li>
              <li>住所（できるだけ詳細に）</li>
              <li>営業時間</li>
              <li>設備情報（ノンブラシ、セルフ、掃除機など）</li>
              <li>料金帯（分かる範囲で）</li>
              <li>その他特記事項</li>
            </ul>

            <p className="text-white/70 text-sm mt-8 p-4 bg-white/5 rounded-lg">
              ※ 頂いた情報は、内容を確認の上、サイトに反映させていただきます。
              ※ お返事までに数日かかる場合がございますので、予めご了承ください。
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/60">
            © 2025 kroooo.com - 全国コイン洗車場データベース
          </p>
          <div className="mt-4 space-x-4">
            <a href="/privacy" className="text-cyan-300 hover:underline">プライバシーポリシー</a>
            <a href="/contact" className="text-cyan-300 hover:underline">お問い合わせ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
