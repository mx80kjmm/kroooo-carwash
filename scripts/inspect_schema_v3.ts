
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function inspectSchemaV3() {
    console.log("🔍 Starting schema inspection V3...");

    // Check optional columns check
    // 1回に1個ずつチェックしないと、どれがダメかわからない (All or Nothing)
    // しかし面倒なので、一つずつ試す関数を作る

    const checkColumn = async (colName: string, value: any) => {
        const data: any = {
            name: "Col Check " + colName,
            address: "Addr",
            latitude: 0,
            longitude: 0
        };
        data[colName] = value;

        const { error } = await supabase.from("carwash_locations").insert([data]);

        if (error) {
            // RLSエラーなら存在するとみなす
            if (error.code === '42501' || error.message.includes("row-level security")) {
                console.log(`✅ Column '${colName}' EXISTS (RLS Hit).`);
            } else if (error.code === 'PGRST204') {
                console.log(`❌ Column '${colName}' MISSING.`);
            } else {
                console.log(`❓ Column '${colName}' UNKNOWN ERROR: ${error.message} (${error.code})`);
            }
        } else {
            console.log(`✅ Column '${colName}' EXISTS (Inserted).`);
        }
    };

    await checkColumn("business_hours", "09:00-18:00");
    await checkColumn("opening_hours", "09:00-18:00"); // JSON key check
    await checkColumn("url", "https://example.com");
    await checkColumn("website", "https://example.com");
    await checkColumn("phone", "03-0000-0000");
    await checkColumn("notes", "Some notes");
    await checkColumn("price_range", "1000円");
    await checkColumn("payment_methods", "Cash"); // JSON key
}

inspectSchemaV3();
