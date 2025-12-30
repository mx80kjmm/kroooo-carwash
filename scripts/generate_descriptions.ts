import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

// admin権限でクライアント作成 (更新のため)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateDescriptions() {
    console.log('🤖 AI洗太郎が紹介文を作成しに行くぜ！');

    // 1. データ取得
    const { data: locations, error } = await supabase
        .from('carwash_locations')
        .select('*')
    // .is('description', null); // descriptionが未設定のものだけ対象にするならコメントアウト解除

    if (error) {
        console.error('データ取得失敗だぜ...', error);
        return;
    }

    console.log(`${locations.length}件の洗車場データを見つけたぜ。`);

    let count = 0;

    for (const loc of locations) {
        // 既にdescriptionがある場合はスキップ (強制上書きしたい場合はここを調整)
        if (loc.description && loc.description.length > 10) {
            continue;
        }

        const description = generateText(loc);

        // DB更新
        const { error: updateError } = await supabase
            .from('carwash_locations')
            .update({ description: description })
            .eq('id', loc.id);

        if (updateError) {
            console.error(`更新失敗: ${loc.name}`, updateError);
        } else {
            console.log(`✅ 作成完了: ${loc.name}`);
            console.log(`   "${description.substring(0, 30)}..."`);
            count++;
        }
    }

    console.log(`\n🎉 合計 ${count} 件の紹介文を作成したぜ！任務完了だ！`);
}

function generateText(loc: any): string {
    const parts = [];

    // 導入
    const intros = [
        `おっ、ここは${extractCity(loc.address)}にある「${loc.name}」だな！`,
        `愛車をピカピカにするなら、${extractCity(loc.address)}の「${loc.name}」はどうだ？`,
        `噂の洗車場、「${loc.name}」を紹介するぜ！場所は${extractCity(loc.address)}だ。`,
    ];
    parts.push(getRandom(intros));

    // 設備の特徴
    const features = [];
    if (loc.has_non_brush) features.push('なんと**ノンブラシ洗車機**があるんだ！ブラシ傷を気にせず、コーティング車も安心して洗えるぜ。');
    if (loc.has_self_wash) features.push('**高圧洗浄機完備**のセルフ洗車スペースがあるから、自分の手で納得いくまで綺麗にできるな。');
    if (loc.has_auto_wash) features.push('**門型自動洗車機**があるから、手軽にサッと汚れを落としたい時にも便利だ。');
    if (loc.has_vacuum) features.push('掃除機もあるから、車内のゴミも一掃できるぞ。');
    if (loc.has_unlimited_water) features.push('嬉しいのが**水道使い放題**って点だ！バケツ洗車派にはたまらないよな。');

    if (features.length > 0) {
        parts.push(features.join(' '));
    } else {
        parts.push('基本的な設備はしっかり揃っているみたいだぜ。');
    }

    // 営業時間・利便性
    if (loc.is_24h) {
        parts.push('しかも**24時間営業**！深夜のドライブついでや、早朝の空いている時間にゆっくり洗車できるのは最高だよな。');
    } else if (loc.business_hours) {
        parts.push(`営業時間は${loc.business_hours}だ。時間内に行ってくれよな！`);
    }

    // 独自のコメント (Notesがあれば)
    if (loc.notes && loc.notes.length > 5) {
        parts.push(`ちなみに、${loc.notes} という情報もあるみたいだ。`);
    }

    // 結び
    const endings = [
        '愛車が綺麗になると気分も上がるよな！ぜひ行ってみてくれ！',
        '近くに行ったら寄ってみてくれよな！',
        '週末の洗車はここに決まりだな！',
        '洗車ライフを楽しんでくれよな！'
    ];
    parts.push(getRandom(endings));

    return parts.join('\n\n');
}

function extractCity(address: string): string {
    if (!address) return 'このエリア';
    // 簡易的な住所抽出 (埼玉県さいたま市... -> さいたま市)
    const match = address.match(/(?:都|道|府|県)(.+?[市区郡])/);
    return match ? match[1] : 'この街';
}

function getRandom(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

generateDescriptions();
