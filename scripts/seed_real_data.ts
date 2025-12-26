import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// .env.local をロード
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    const carWashes = rawCarWashes.map((item: any) => ({
        name: item.name,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
        business_hours: item.opening_hours,
        has_self_wash: item.has_high_pressure_washer || false,
        has_auto_wash: item.has_non_brush_washing_machine || false,
        has_non_brush: item.has_non_brush_washing_machine || false,
        has_vacuum: item.has_vacuum || false,
        has_mat_wash: item.has_mat_cleaner || false,
        notes: item.notes || null,
        price_range: null, // JSONにないので空
    }));

    // 既存データの削除（オプション：全削除してから入れるか、追加するか）
    // とりあえず今回は「全削除して再投入」にする（重複防止のため）
    const { error: deleteError } = await supabase
        .from("carwash_locations")
        .delete()
        .neq("id", 0); // 全件削除ハック

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
    } else {
        console.log(`✅ Successfully inserted ${carWashes.length} car washes!`);
    }
}

seedRealData();
