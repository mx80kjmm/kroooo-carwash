import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// .env.local をロード
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// RLS回避のため、Service Role Keyがあれば優先的に使用する
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedRealData() {
    console.log("🚀 Starting data seeding...");

    // JSONファイルの読み込み
    const jsonPath = path.join(process.cwd(), "data", "real_carwashes.json");
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const rawCarWashes = JSON.parse(rawData);

    console.log(`📦 Found ${rawCarWashes.length} car washes in JSON.`);

    // フィールド名のマッピング
    // Note: 2025-12-26 調査により、DBカラムは以下のみ確認:
    // id, name, address, latitude, longitude, opening_hours, phone, payment_methods
    // has_* 系や url, notes は存在しないため除外
    const carWashes = rawCarWashes.map((item: any) => ({
        name: item.name,
        address: item.address,
        // 住所から都道府県を抽出 (例: "東京都..." -> "東京都")
        prefecture: item.address.match(/^(.{2,3}[都道府県])/)?.[0] || '東京都',
        // 住所から市区町村を抽出 (簡易的: 都道府県の後ろから区/市/町/村まで)
        // 例: 東京都江戸川区 -> 江戸川区
        city: item.address.match(/(?:[都道府県])(.+?[市区町村])/)?.[1] || '不明',
        latitude: item.latitude,
        longitude: item.longitude,
        // DBは 'opening_hours' -> 'business_hours' にリネームされる前提
        // もしマイグレーションでリネームしなかった場合は opening_hours のままにする必要があるが
        // 今回はマイグレーション完了前提で business_hours を使う、あるいは
        // 両方対応できるようにする? いや、マイグレーションSQLでリネームしている。
        // "ALTER TABLE carwash_locations RENAME COLUMN opening_hours TO business_hours;"
        business_hours: item.opening_hours,

        // JSONの "現金, プリペイド" を ["現金", "プリペイド"] に変換
        payment_methods: item.payment_methods
            ? item.payment_methods.split(/[,、]/).map((s: string) => s.trim())
            : [],

        // 以下はマイグレーションで追加されるカラム
        has_self_wash: item.has_high_pressure_washer || false,
        has_auto_wash: item.has_non_brush_washing_machine || false,
        has_non_brush: item.has_non_brush_washing_machine || false,
        has_vacuum: item.has_vacuum || false,
        has_mat_wash: item.has_mat_cleaner || false,
        notes: item.notes || null,
        url: item.url || null,
    }));

    // 既存データの削除（全削除）
    // UUIDの場合は neq('id', '00000000-0000-0000-0000-000000000000') などで全件マッチさせるか、
    // あるいは単に delete() を条件なしで呼ぶとエラーになることが多いので、
    // 確実にマッチする条件を指定する。 UUIDの 'neq' 0 は無効。
    // id is not null がベストだが、supabase-jsでどう書くか。
    // ここでは単純に、id columnがあることは分かっているので、ダミーUUIDとの比較ではなく
    // 全件削除用のイディオムを使う。

    const { error: deleteError } = await supabase
        .from("carwash_locations")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // UUID v4の形式であればこれで全件ヒットするはず

    if (deleteError) {
        console.error("❌ Failed to clear table:", deleteError);
    } else {
        console.log("🗑️ Cleared existing car wash data.");
    }

    // データ投入
    const { error: insertError } = await supabase
        .from("carwash_locations")
        .insert(carWashes);

    if (insertError) {
        console.error("❌ Failed to insert data:", insertError);
        // エラー詳細を表示
        // エラー詳細を表示
        // @ts-ignore
        if (insertError.details) console.error("Details:", insertError.details);
        // @ts-ignore
        if (insertError.hint) console.error("Hint:", insertError.hint);
        console.error("Full Error:", JSON.stringify(insertError, null, 2));
    } else {
        console.log(`✅ Successfully inserted ${carWashes.length} car washes!`);
    }
}

seedRealData();
