import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("🔍 Fetching existing data to check schema...");

    const { data, error } = await supabase
        .from("carwash_locations")
        .select("*")
        .limit(1);

    if (error) {
        console.error("❌ Failed to fetch data:", error);
    } else if (data && data.length > 0) {
        console.log("✅ Sample data:");
        console.log(JSON.stringify(data[0], null, 2));
        console.log("\n📋 Column names:");
        console.log(Object.keys(data[0]));
    } else {
        console.log("⚠️ No data found in table.");
    }
}

checkSchema();
