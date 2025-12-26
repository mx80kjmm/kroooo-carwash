export interface Article {
    slug: string;
    title: string;
    emoji: string;
    thumbnail: string;
    publishedAt: string;
    summary: string;
    content: string;
}

export const ARTICLES: Article[] = [
    {
        slug: '24h-car-wash-guide',
        title: '【完全版】24時間営業のコイン洗車場ガイド｜深夜・早朝でも使える洗車場の探し方',
        emoji: '🌙',
        thumbnail: '/images/articles/etiquette.png',
        publishedAt: '2025-12-27',
        summary: '仕事終わりの深夜や、出勤前の早朝でも利用できる24時間営業のコイン洗車場。そのメリット・デメリット、探し方のコツ、利用時のマナーまで徹底解説します。',
        content: '<img src="/images/articles/etiquette.png" alt="夜の洗車場" class="w-full rounded-2xl shadow-lg mb-8" /><p class="text-xl text-gray-700 leading-relaxed mb-8">「仕事が忙しくて、洗車する時間がない…」<br>そんな悩みを解決してくれるのが、<strong>24時間営業のコイン洗車場</strong>です。</p><h2 class="text-3xl font-bold mt-16 mb-6 pb-4 border-b-2 border-blue-500">メリット</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li>自分のスケジュールに合わせて洗車できる</li><li>夏場のウォータースポット対策に最適</li><li>混雑を避けてストレスフリー</li></ul><h2 class="text-3xl font-bold mt-16 mb-6 pb-4 border-b-2 border-blue-500">探し方</h2><p class="mb-6 leading-8"><strong>kroooo.com</strong>では、トップページの「🌙 24時間営業」フィルターで簡単に検索できます！</p>'
    },
    {
        slug: 'unlimited-water-car-wash',
        title: '【徹底解説】水道使い放題のコイン洗車場｜時間を気にせず洗える洗車場の魅力',
        emoji: '💧',
        thumbnail: '/images/articles/unlimited-water.png',
        publishedAt: '2025-12-27',
        summary: '追加料金なしで水を使い放題！焦らずじっくり洗車したい人に人気の「水道使い放題」タイプの洗車場について解説します。',
        content: '<img src="/images/articles/unlimited-water.png" alt="水道使い放題の洗車場" class="w-full rounded-2xl shadow-lg mb-8" /><p class="text-xl text-gray-700 leading-relaxed mb-8">「高圧洗浄機の時間制限が気になる…」<br>そんな方におすすめなのが、<strong>水道使い放題のコイン洗車場</strong>です。</p><h2 class="text-3xl font-bold mt-12 mb-6">メリット</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li>焦らずじっくり洗車できる</li><li>コスパが良い（長時間洗車する人向け）</li><li>手洗い洗車との相性抜群</li><li>大型車でも安心</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">料金相場</h2><p class="mb-6">20〜30分：400円〜600円<br>45〜60分：600円〜1,000円</p>'
    },
    {
        slug: 'black-car-wash-guide',
        title: '黒い車の洗車方法｜傷をつけずにピカピカに仕上げるコツ',
        emoji: '🖤',
        thumbnail: '/images/articles/black-car.png',
        publishedAt: '2025-12-27',
        summary: '黒い車は傷や汚れが目立ちやすい！正しい洗車方法と、艶を出すためのテクニックを解説します。',
        content: '<img src="/images/articles/black-car.png" alt="黒い車" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">黒い車が難しい理由</h2><p class="mb-6 leading-8">黒い車は、他のボディカラーに比べて<strong>傷・水垢・ホコリが目立ちやすい</strong>という特徴があります。特に洗車傷（スワールマーク）は太陽光の下で目立ってしまいます。</p><h2 class="text-3xl font-bold mt-12 mb-6">洗車のポイント</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>たっぷりの水で予洗い</strong>：砂やホコリを十分に流してからスポンジを使う</li><li><strong>柔らかいスポンジを使用</strong>：ムートングローブがおすすめ</li><li><strong>直射日光を避ける</strong>：曇りの日か日陰で洗車する</li><li><strong>すぐに拭き上げる</strong>：水滴が乾く前に拭き取る</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">おすすめの洗車場</h2><p class="mb-6">ノンブラシ洗車機がある洗車場なら、傷のリスクを最小限に抑えられます。kroooo.comで検索してみてください！</p>'
    },
    {
        slug: 'white-car-wash-guide',
        title: '白い車の洗車方法｜水垢・黄ばみを防いで白さをキープ',
        emoji: '🤍',
        thumbnail: '/images/articles/white-car.png',
        publishedAt: '2025-12-27',
        summary: '白い車は水垢や黄ばみが気になる！白さを長持ちさせる洗車テクニックを紹介します。',
        content: '<img src="/images/articles/white-car.png" alt="白い車" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">白い車の特徴</h2><p class="mb-6 leading-8">白い車は傷が目立ちにくい反面、<strong>水垢・黄ばみ・泥汚れ</strong>が目立ちやすいです。定期的な洗車で美しい白さを保ちましょう。</p><h2 class="text-3xl font-bold mt-12 mb-6">洗車のポイント</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>こまめな洗車</strong>：汚れを放置しない</li><li><strong>水垢除去剤を使う</strong>：頑固な水垢には専用クリーナー</li><li><strong>コーティングで保護</strong>：汚れがつきにくくなる</li></ul>'
    },
    {
        slug: 'coating-car-wash',
        title: 'ガラスコーティング車の洗車方法｜コーティングを長持ちさせるコツ',
        emoji: '💎',
        thumbnail: '/images/articles/coating.png',
        publishedAt: '2025-12-27',
        summary: 'ガラスコーティング施工車の正しい洗車方法。コーティングを傷めずに効果を長持ちさせるテクニックを解説。',
        content: '<img src="/images/articles/coating.png" alt="コーティング" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">コーティング車の洗車で気をつけること</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>ブラシ洗車機は避ける</strong>：コーティング被膜を傷つける恐れ</li><li><strong>ノンブラシ洗車機がおすすめ</strong>：水圧だけで優しく洗える</li><li><strong>研磨剤入りシャンプーはNG</strong>：コーティングを削ってしまう</li><li><strong>手洗いがベスト</strong>：優しく丁寧に洗う</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">洗車頻度</h2><p class="mb-6">コーティング車は汚れが落ちやすいですが、2週間に1回程度の洗車が理想です。</p>'
    },
    {
        slug: 'wash-frequency',
        title: '洗車頻度の目安｜どれくらいの間隔で洗車すべき？',
        emoji: '📅',
        thumbnail: '/images/articles/foam.png',
        publishedAt: '2025-12-27',
        summary: '洗車はどれくらいの頻度でするべき？季節や駐車環境別のおすすめ洗車頻度を解説します。',
        content: '<img src="/images/articles/foam.png" alt="洗車" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">基本的な目安</h2><p class="mb-6 leading-8">一般的には<strong>月に1〜2回</strong>の洗車が推奨されています。ただし、駐車環境や季節によって調整が必要です。</p><h2 class="text-3xl font-bold mt-12 mb-6">駐車環境別の目安</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>屋外駐車</strong>：2週間に1回</li><li><strong>屋根付き駐車場</strong>：月1回</li><li><strong>屋内ガレージ</strong>：月1回〜2ヶ月に1回</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">すぐに洗車すべき場面</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li>鳥のフンがついた</li><li>虫の死骸がついた</li><li>花粉・黄砂が付着した</li><li>海沿いを走った後</li></ul>'
    },
    {
        slug: 'wash-tools-guide',
        title: '洗車道具の選び方｜初心者が揃えるべき必須アイテム10選',
        emoji: '🧽',
        thumbnail: '/images/articles/tools.png',
        publishedAt: '2025-12-27',
        summary: '洗車に必要な道具を完全解説！初心者が最初に揃えるべきアイテムからプロ仕様まで紹介します。',
        content: '<img src="/images/articles/tools.png" alt="洗車道具" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">必須アイテム</h2><ol class="list-decimal pl-6 mb-6 space-y-2"><li><strong>カーシャンプー</strong>：中性タイプがおすすめ</li><li><strong>バケツ</strong>：大容量（15L以上）が便利</li><li><strong>洗車スポンジ</strong>：ボディ用とホイール用で2個</li><li><strong>マイクロファイバークロス</strong>：拭き上げ用に3枚以上</li><li><strong>ホイールブラシ</strong>：複雑な形状のホイールに</li></ol><h2 class="text-3xl font-bold mt-12 mb-6">あると便利なアイテム</h2><ol class="list-decimal pl-6 mb-6 space-y-2" start="6"><li><strong>脚立</strong>：SUVやミニバンの屋根洗いに</li><li><strong>コーティング剤</strong>：艶出し・保護に</li><li><strong>鉄粉除去剤</strong>：ザラつきの除去に</li><li><strong>水垢クリーナー</strong>：頑固な水垢対策</li><li><strong>セーム革</strong>：プロ仕様の吸水力</li></ol>'
    },
    {
        slug: 'wheel-tire-wash',
        title: 'ホイール・タイヤの洗い方｜足回りを綺麗に保つ方法',
        emoji: '🛞',
        thumbnail: '/images/articles/wheel.png',
        publishedAt: '2025-12-27',
        summary: 'ホイールとタイヤの正しい洗い方。ブレーキダストの落とし方からタイヤワックスの塗り方まで解説。',
        content: '<img src="/images/articles/wheel.png" alt="ホイール洗浄" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">ホイールが汚れる原因</h2><p class="mb-6 leading-8">ホイールの主な汚れは<strong>ブレーキダスト</strong>です。ブレーキをかけるたびに発生する金属粉が付着し、放置すると焼き付いて落ちにくくなります。</p><h2 class="text-3xl font-bold mt-12 mb-6">洗い方の手順</h2><ol class="list-decimal pl-6 mb-6 space-y-2"><li>ホイール全体を水で流す</li><li>専用クリーナーをスプレー</li><li>ブラシで隙間まで丁寧に洗う</li><li>しっかりすすいで拭き上げ</li></ol><h2 class="text-3xl font-bold mt-12 mb-6">タイヤのケア</h2><p class="mb-6">洗った後はタイヤワックスを塗ると、見た目が良くなるだけでなく、ゴムの劣化防止にも効果的です。</p>'
    },
    {
        slug: 'winter-car-wash',
        title: '冬の洗車ガイド｜凍結対策と融雪剤ダメージを防ぐ方法',
        emoji: '❄️',
        thumbnail: '/images/articles/winter.png',
        publishedAt: '2025-12-27',
        summary: '冬場の洗車は凍結や融雪剤との戦い。寒い季節ならではの洗車テクニックと注意点を解説します。',
        content: '<img src="/images/articles/winter.png" alt="冬の洗車" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">冬の洗車が重要な理由</h2><p class="mb-6 leading-8">冬場は道路に<strong>融雪剤（塩化カルシウム）</strong>が撒かれることがあります。これが車体に付着したまま放置すると、錆びの原因になります。</p><h2 class="text-3xl font-bold mt-12 mb-6">洗車のポイント</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>下回りを重点的に洗う</strong>：融雪剤が最も付着する場所</li><li><strong>気温5度以上の日を選ぶ</strong>：凍結を防ぐ</li><li><strong>日中の暖かい時間帯に</strong>：10時〜14時がベスト</li><li><strong>すぐに拭き上げる</strong>：水滴が凍る前に</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">凍結対策</h2><p class="mb-6">洗車後はドアの隙間やゴムパッキンの水分をしっかり拭き取りましょう。放置するとドアが凍りついて開かなくなることがあります。</p>'
    },
    {
        slug: 'summer-car-wash',
        title: '夏の洗車ガイド｜炎天下でやってはいけないNG行為',
        emoji: '☀️',
        thumbnail: '/images/articles/summer.png',
        publishedAt: '2025-12-27',
        summary: '夏場の洗車は時間帯と方法が重要！ウォータースポットを防ぎ、効率よく洗車するコツを紹介。',
        content: '<img src="/images/articles/summer.png" alt="夏の洗車" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">炎天下の洗車がNGな理由</h2><p class="mb-6 leading-8">夏の日差しの下で洗車すると、ボディが高温になっているため<strong>水滴がすぐに蒸発</strong>してしまいます。これが「ウォータースポット」（水垢のシミ）の原因になります。</p><h2 class="text-3xl font-bold mt-12 mb-6">夏の洗車ベストタイム</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>早朝（6時〜8時）</strong>：涼しくて快適</li><li><strong>夕方（17時以降）</strong>：日差しが弱まる</li><li><strong>曇りの日</strong>：最高のコンディション</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">24時間営業の洗車場を活用</h2><p class="mb-6">早朝や夕方に洗車したいなら、24時間営業の洗車場が便利です。kroooo.comで検索してみてください！</p>'
    },
    {
        slug: 'wax-vs-coating',
        title: 'ワックス vs コーティング｜違いと選び方を徹底比較',
        emoji: '⚡',
        thumbnail: '/images/articles/wax.png',
        publishedAt: '2025-12-27',
        summary: 'ワックスとコーティング、どっちがいい？それぞれの特徴・持続期間・費用を比較して解説します。',
        content: '<img src="/images/articles/wax.png" alt="ワックス" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">ワックスの特徴</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>メリット</strong>：安い、自分で塗れる、深い艶が出る</li><li><strong>デメリット</strong>：持続期間が短い（2週間〜1ヶ月）</li><li><strong>費用</strong>：1,000円〜3,000円（製品代のみ）</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">コーティングの特徴</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>メリット</strong>：持続期間が長い、傷がつきにくい、洗車が楽</li><li><strong>デメリット</strong>：高価、プロ施工推奨</li><li><strong>費用</strong>：3万円〜10万円（プロ施工の場合）</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">どっちを選ぶ？</h2><p class="mb-6 leading-8">愛車をいつもピカピカにしたい人には<strong>コーティング</strong>がおすすめ。手間を惜しまず自分でケアしたい人には<strong>ワックス</strong>が向いています。</p>'
    },
    {
        slug: 'non-brush-wash-benefits',
        title: 'ノンブラシ洗車機のメリットとは？愛車を傷つけずに洗う方法',
        emoji: '✨',
        thumbnail: '/images/articles/non-brush.png',
        publishedAt: '2025-12-25',
        summary: 'ブラシを使わない「ノンブラシ洗車機」が注目されています。高圧水流だけで汚れを落とす仕組みを解説。',
        content: '<img src="/images/articles/non-brush.png" alt="ノンブラシ洗車機" class="w-full rounded-2xl shadow-lg mb-8" /><h2>ノンブラシ洗車機とは？</h2><p>ノンブラシ洗車機とは、<strong>「ブラシを使わない」</strong>洗車機のことです。高圧の水流と特殊な洗剤で汚れを落とします。</p><h2>メリット</h2><ul><li>傷がつかない</li><li>コーティング車に最適</li><li>短時間で完了</li></ul>'
    },
    {
        slug: 'how-to-use-coin-wash',
        title: 'コイン洗車場の使い方ガイド！初心者でも安心なお作法',
        emoji: '🔰',
        thumbnail: '/images/articles/coin-wash.png',
        publishedAt: '2025-12-26',
        summary: '初めてコイン洗車場に行く人向けのマニュアル。小銭の用意から操作方法まで解説。',
        content: '<img src="/images/articles/coin-wash.png" alt="コイン洗車場" class="w-full rounded-2xl shadow-lg mb-8" /><h2>準備するもの</h2><ul><li>小銭（100円玉）</li><li>拭き上げ用タオル</li><li>カーシャンプー・スポンジ</li></ul><h2>洗車の流れ</h2><ol><li>洗車ブースに駐車</li><li>コインを投入してコース選択</li><li>洗車開始</li><li>拭き上げスペースで仕上げ</li></ol>'
    },
    {
        slug: 'self-wash-tips',
        title: 'プロ並みに仕上がる！セルフ洗車のコツ5選',
        emoji: '🧼',
        thumbnail: '/images/articles/foam.png',
        publishedAt: '2025-12-27',
        summary: '効率よく、かつピカピカに仕上げるためのプロのテクニックを紹介します。',
        content: '<img src="/images/articles/foam.png" alt="泡洗車" class="w-full rounded-2xl shadow-lg mb-8" /><h2>コツ5選</h2><ol><li><strong>足回りから洗う</strong>：泥はねを防ぐ</li><li><strong>たっぷりの泡で洗う</strong>：摩擦を減らす</li><li><strong>上から下へ</strong>：汚れを流す方向で</li><li><strong>一方向に拭く</strong>：傷を防ぐ</li><li><strong>ドア内側も忘れずに</strong>：仕上がりが違う</li></ol>'
    },
    {
        slug: 'high-pressure-vs-brush',
        title: '高圧洗浄機 vs ブラシ洗車機、どっちがいい？',
        emoji: '🆚',
        thumbnail: '/images/articles/comparison.png',
        publishedAt: '2025-12-27',
        summary: '手軽なブラシ洗車機と、こだわりの高圧洗浄機を徹底比較。',
        content: '<img src="/images/articles/comparison.png" alt="比較" class="w-full rounded-2xl shadow-lg mb-8" /><h2>ブラシ洗車機</h2><ul><li>メリット：楽、早い</li><li>デメリット：傷がつく可能性</li></ul><h2>高圧洗浄機</h2><ul><li>メリット：傷のリスクが低い、隅々まで洗える</li><li>デメリット：体力を使う、服が濡れる</li></ul>'
    },
    {
        slug: 'car-wash-etiquette',
        title: 'トラブル回避！コイン洗車場のマナーと注意点',
        emoji: '⚠️',
        thumbnail: '/images/articles/etiquette.png',
        publishedAt: '2025-12-27',
        summary: 'みんなで使う場所だからこそ、マナーを守って気持ちよく利用しましょう。',
        content: '<img src="/images/articles/etiquette.png" alt="マナー" class="w-full rounded-2xl shadow-lg mb-8" /><h2>守るべきマナー</h2><ul><li>洗車ブースでの拭き上げ禁止</li><li>ゴミは持ち帰る</li><li>騒音に注意（特に夜間）</li><li>水しぶきに配慮</li></ul>'
    },
    {
        slug: 'water-stain-removal',
        title: '水垢・ウォータースポットの落とし方｜頑固な汚れ対策',
        emoji: '💦',
        thumbnail: '/images/articles/white-car.png',
        publishedAt: '2025-12-27',
        summary: '洗車しても落ちない頑固な水垢やウォータースポット。原因と効果的な除去方法を解説。',
        content: '<img src="/images/articles/white-car.png" alt="水垢" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">水垢の原因</h2><p class="mb-6">水道水に含まれるカルシウムやミネラルが乾燥して残ったものが水垢です。放置すると固着して落ちにくくなります。</p><h2 class="text-3xl font-bold mt-12 mb-6">落とし方</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>軽度の場合</strong>：カーシャンプーで丁寧に洗う</li><li><strong>中程度の場合</strong>：水垢専用クリーナーを使用</li><li><strong>重度の場合</strong>：コンパウンドで研磨（プロ推奨）</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">予防方法</h2><p class="mb-6">洗車後はすぐに拭き上げる、コーティングを施工する、純水洗車を利用するなどの方法があります。</p>'
    },
    {
        slug: 'bug-bird-removal',
        title: '虫汚れ・鳥フンの正しい落とし方｜塗装を傷めない方法',
        emoji: '🐦',
        thumbnail: '/images/articles/coating.png',
        publishedAt: '2025-12-27',
        summary: '虫の死骸や鳥のフンは放置すると塗装にダメージを与えます。正しい除去方法を解説。',
        content: '<img src="/images/articles/coating.png" alt="汚れ除去" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">なぜ早く落とすべき？</h2><p class="mb-6">虫の死骸や鳥のフンには<strong>酸性成分</strong>が含まれています。放置すると塗装を侵食し、跡が残ってしまいます。</p><h2 class="text-3xl font-bold mt-12 mb-6">正しい落とし方</h2><ol class="list-decimal pl-6 mb-6 space-y-2"><li><strong>水で十分にふやかす</strong>：いきなりこすらない</li><li><strong>柔らかい布で優しく拭く</strong>：力を入れすぎない</li><li><strong>専用クリーナーを使う</strong>：頑固な汚れには</li><li><strong>すすいで仕上げる</strong></li></ol><h2 class="text-3xl font-bold mt-12 mb-6">予防策</h2><p class="mb-6">コーティングを施工しておくと汚れが付着しにくく、落としやすくなります。</p>'
    },
    {
        slug: 'beginner-complete-guide',
        title: '【永久保存版】洗車初心者ガイド｜ゼロから始める愛車ケア',
        emoji: '📚',
        thumbnail: '/images/articles/coin-wash.png',
        publishedAt: '2025-12-27',
        summary: '洗車の基本から応用まで、初心者が知っておくべき全てをまとめた完全ガイド。',
        content: '<img src="/images/articles/coin-wash.png" alt="洗車ガイド" class="w-full rounded-2xl shadow-lg mb-8" /><h2 class="text-3xl font-bold mt-12 mb-6">洗車の種類</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li><strong>手洗い洗車</strong>：丁寧に洗える、傷がつきにくい</li><li><strong>高圧洗浄機</strong>：コイン洗車場で手軽に</li><li><strong>ブラシ洗車機</strong>：最も手軽、時短</li><li><strong>ノンブラシ洗車機</strong>：コーティング車に最適</li></ul><h2 class="text-3xl font-bold mt-12 mb-6">基本の流れ</h2><ol class="list-decimal pl-6 mb-6 space-y-2"><li>水で予洗い（砂やホコリを流す）</li><li>シャンプーで洗う（上から下へ）</li><li>しっかりすすぐ</li><li>拭き上げる（水滴が乾く前に）</li></ol><h2 class="text-3xl font-bold mt-12 mb-6">近くの洗車場を探す</h2><p class="mb-6">kroooo.comで、現在地から近いコイン洗車場を簡単に検索できます！</p>'
    }
];

export function getArticle(slug: string) {
    return ARTICLES.find(a => a.slug === slug);
}
