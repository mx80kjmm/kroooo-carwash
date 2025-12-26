
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

    // JSONファイルの読み込み (all_carwashes.json)
    const jsonPath = path.join(process.cwd(), "data", "all_carwashes.json");
    // Ensure file exists
    if (!fs.existsSync(jsonPath)) {
        console.error(`File not found: ${jsonPath}`);
        console.error("Please run 'npx ts-node scripts/consolidate_data.ts' first.");
        process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const rawCarWashes = JSON.parse(rawData);

    console.log(`📦 Found ${rawCarWashes.length} car washes in JSON.`);

    // Mapping
    const carWashes = rawCarWashes.map((item: any) => ({
        name: item.name,
        address: item.address,
        prefecture: item.address.match(/^(.{2,3}[都道府県])/)?.[0] || '不明',
        city: item.address.match(/(?:[都道府県])(.+?[市区町村])/)?.[1] || '不明',
        latitude: item.latitude || 0, // Default to 0 if missing (will be updated via geocoding later)
        longitude: item.longitude || 0,
        business_hours: item.hours || item.opening_hours || item.business_hours || "不明", // Normalize

        // Payment Methods (Handle array or string or missing)
        payment_methods: Array.isArray(item.payment_methods)
            ? item.payment_methods
            : (typeof item.payment_methods === 'string' ? item.payment_methods.split(/[,、]/).map((s: string) => s.trim()) : []),

        // Equipment Mapping
        has_self_wash: item.equipment?.high_pressure_washer || item.has_high_pressure_washer || false,
        has_auto_wash: item.equipment?.car_washing_machine || item.has_car_washing_machine || false,
        has_non_brush: item.equipment?.non_brush_washing_machine || item.has_non_brush_washing_machine || false,
        has_vacuum: item.equipment?.vacuum_cleaner || item.has_vacuum || false,
        has_mat_wash: item.equipment?.mat_cleaner || item.has_mat_cleaner || false,

        notes: item.notes || null,
        url: item.url || null,
        x_post_url: item.x_post_url || null,
    }));

    // Clear Table
    const { error: deleteError } = await supabase
        .from("carwash_locations")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

    if (deleteError) {
        console.error("❌ Failed to clear table:", deleteError);
    } else {
        console.log("🗑️ Cleared existing car wash data.");
    }

    // Insert
    const { error: insertError } = await supabase
        .from("carwash_locations")
        .insert(carWashes);

    if (insertError) {
        console.error("❌ Failed to insert data:", insertError);
        // @ts-ignore
        if (insertError.details) console.error("Details:", insertError.details);
        console.error("Full Error:", JSON.stringify(insertError, null, 2));
    } else {
        console.log(`✅ Successfully inserted ${carWashes.length} car washes!`);
    }
}

seedRealData();
