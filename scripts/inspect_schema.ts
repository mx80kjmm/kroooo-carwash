
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// .env.local をロード
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    console.log("🔍 Starting schema inspection...");

    // 1. DELETE test (UUID check)
    // UUIDの最小値を使って全削除を試みる
    // Note: RLSが有効だと削除できない可能性あり
    /*
    const { error: deleteError } = await supabase
        .from("carwash_locations")
        .delete()
        .gte("id", "00000000-0000-0000-0000-000000000000"); // UUID format

    if (deleteError) {
        console.log("❌ Delete failed (Expected if table empty or RLS):", deleteError.message);
    } else {
        console.log("✅ Delete command valid (UUID verified).");
    }
    */

    // 2. Insert Test with JSON keys
    // JSONのキー形式そのままで1件入れてみる
    const testDataJsonStyle = {
        name: "Test Carwash JSON Style",
        address: "Test Address",
        latitude: 35.0,
        longitude: 139.0,
        has_non_brush_washing_machine: true, // JSON key
        has_high_pressure_washer: true,      // JSON key
        has_vacuum: true,
        has_mat_cleaner: true,
        heading: "Test", // 存在しなさそうな適当なキー
    };

    console.log("Testing Insert with JSON keys...");
    const { error: errorJson } = await supabase
        .from("carwash_locations")
        .insert([testDataJsonStyle]); // 配列で渡す

    if (errorJson) {
        console.log("❌ Insert with JSON keys failed:", errorJson.message);
        // エラーメッセージに "Could not find the 'heading' column" があれば、heading以外は合ってる可能性が高い
    } else {
        console.log("✅ Insert with JSON keys SUCCESS! Schema matches JSON keys.");
    }

    // 3. Insert Test with TS keys
    const testDataTsStyle = {
        name: "Test Carwash TS Style",
        address: "Test Address 2",
        latitude: 35.1,
        longitude: 139.1,
        has_non_brush: true, // TS key
        has_self_wash: true, // TS key
    };
    
    console.log("Testing Insert with TS keys...");
    const { error: errorTs } = await supabase
        .from("carwash_locations")
        .insert([testDataTsStyle]);

    if (errorTs) {
        console.log("❌ Insert with TS keys failed:", errorTs.message);
    } else {
        console.log("✅ Insert with TS keys SUCCESS!");
    }
    
    // 4. Try minimal insert
    const minimalData = {
        name: "Minimal Test",
        address: "Min Address",
        latitude: 0,
        longitude: 0
    };
    console.log("Testing Minimal Insert...");
    const { error: minError } = await supabase.from("carwash_locations").insert([minimalData]);
    if (minError) {
        console.log("❌ Minimal insert failed:", minError.message);
    } else {
        console.log("✅ Minimal insert SUCCESS.");
    }

}

inspectSchema();
