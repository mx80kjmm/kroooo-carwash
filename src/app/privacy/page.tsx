export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">プライバシーポリシー</h1>
          <p className="text-cyan-200 mt-2">
            <a href="/" className="hover:underline">← トップに戻る</a>
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none text-white/90 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. 個人情報の取得について</h2>
              <p>
                当サイトでは、お問い合わせ時にメールアドレス等の個人情報を取得する場合があります。
                取得した個人情報は、お問い合わせに対する回答や必要な情報を提供する目的でのみ使用します。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. アクセス解析ツールについて</h2>
              <p>
                当サイトでは、Google Analyticsを使用してアクセス解析を行っています。
                Google Analyticsはトラフィックデータの収集のためにCookieを使用しています。
                このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
              </p>
              <p className="mt-2">
                Google Analyticsの詳細については、
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:underline"
                >
                  こちら
                </a>
                をご覧ください。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. 広告配信について</h2>
              <p>
                当サイトでは、第三者配信の広告サービス（Google AdSenseを含む）を利用しています。
                このような広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報 『Cookie』（氏名、住所、メール アドレス、電話番号は含まれません）を使用することがあります。
              </p>
              <p className="mt-2">
                またGoogleアドセンスに関して、このプロセスの詳細やこのような情報が広告配信事業者に使用されないようにする方法については、
                <a
                  href="https://policies.google.com/technologies/ads?hl=ja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:underline"
                >
                  Googleのポリシーと規約
                </a>
                をご覧ください。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. 免責事項</h2>
              <p>
                当サイトに掲載されている情報の正確性には万全を期していますが、
                利用者が当サイトの情報を用いて行う一切の行為について、
                当サイトは一切の責任を負いません。
              </p>
              <p className="mt-2">
                また、当サイトから外部サイトへのリンクが含まれている場合がありますが、
                リンク先のサイトにおける個人情報の取扱いについては、当サイトは責任を負いません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. プライバシーポリシーの変更</h2>
              <p>
                当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、
                本ポリシーの内容を適宜見直し、その改善に努めます。
                修正された最新のプライバシーポリシーは常に本ページにて開示されます。
              </p>
            </section>

            <section className="mt-8 pt-6 border-t border-white/20">
              <p className="text-white/60 text-sm">
                最終更新日: 2025年12月26日
              </p>
            </section>
          </div>
        </div>
      </div>

      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/60">
            © 2025 kroooo.com - 全国コイン洗車場データベース
          </p>
        </div>
      </footer>
    </div>
  );
}
