const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// .env.local をロード
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function seedRealData() {
    console.log("🚀 Starting data seeding with CORRECT schema...");

    const jsonPath = path.join(process.cwd(), "data", "real_carwashes.json");
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const rawCarWashes = JSON.parse(rawData);

    // 全件削除（安全のため、UUIDダミーを使用）
    await supabase
        .from("carwash_locations")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

    console.log("🗑️ Cleared existing data.");

    const dbData = rawCarWashes.map(shop => {
        // 住所パース (簡易版)
        const match = shop.address.match(/(.+?[都道府県])(.+?[市区町村])/);
        const prefecture = match ? match[1] : "東京都";
        const city = match ? match[2] : "";

        // 24時間判定
        const is24h = shop.opening_hours.includes("24時間");

        // 料金抽出 (数値のみ)
        let price = null;
        if (shop.notes) {
            const priceMatch = shop.notes.match(/(\d{3,})/);
            if (priceMatch) price = parseInt(priceMatch[1]);
        }

        return {
            name: shop.name,
            address: shop.address,
            prefecture: prefecture,
            city: city,
            latitude: shop.latitude,
            longitude: shop.longitude,
            opening_hours: shop.opening_hours,
            is_24h: is24h,
            has_high_pressure: shop.has_high_pressure_washer || false,
            has_auto_gate_nonbrush: shop.has_non_brush_washing_machine || false,
            has_vacuum: shop.has_vacuum || false,
            has_foam: false, // 不明なのでfalse
            has_wax: false,  // 不明なのでfalse
            has_air_gun: false, // 不明なのでfalse
            base_price: price,
            payment_methods: shop.payment_methods ? shop.payment_methods.split(",").map(s => s.trim()) : [],
            // URLなどは入れる場所がないので省略（スキーマ拡張が必要だが今回は既存スキーマに合わせる）
        };
    });

    const { error } = await supabase.from("carwash_locations").insert(dbData);

    if (error) {
        console.error("❌ Insert Error:", error);
    } else {
        console.log(`✅ Inserted ${dbData.length} records.`);
    }
}

seedRealData();
