const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkSchema() {
    // 1件取得して構造を見る
    const { data, error } = await supabase
        .from("carwash_locations")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Data structure:", data);
    }
}

checkSchema();
