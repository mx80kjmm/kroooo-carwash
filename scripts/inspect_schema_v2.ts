
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function inspectSchemaV2() {
    console.log("🔍 Starting schema inspection V2...");

    // Test 1: JSON Keys (without dummy 'heading')
    const jsonKeysData = {
        name: "Test JSON Keys",
        address: "Test Addr",
        latitude: 35.0,
        longitude: 139.0,
        // JSONにあるキー名
        has_non_brush_washing_machine: true,
        has_high_pressure_washer: true,
        has_vacuum: true,
        has_mat_cleaner: true,
        // has_free_wiping_space: true, // これもJSONにある
        // has_hot_water: false,        // これも
    };

    console.log("\n--- Test 1: JSON Keys ---");
    const { error: error1 } = await supabase.from("carwash_locations").insert([jsonKeysData]);

    if (error1) {
        console.log("Result: ERROR");
        console.log("Message:", error1.message);
        console.log("Code:", error1.code);
    } else {
        console.log("Result: SUCCESS (Inserted)");
    }

    // Test 2: TS Keys
    const tsKeysData = {
        name: "Test TS Keys",
        address: "Test Addr",
        latitude: 35.0,
        longitude: 139.0,
        has_non_brush: true,
        has_self_wash: true
    };

    console.log("\n--- Test 2: TS Keys ---");
    const { error: error2 } = await supabase.from("carwash_locations").insert([tsKeysData]);

    if (error2) {
        console.log("Result: ERROR");
        console.log("Message:", error2.message);
    } else {
        console.log("Result: SUCCESS");
    }
}

inspectSchemaV2();
