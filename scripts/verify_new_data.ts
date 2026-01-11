
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
    const names = [
        "カーウォッシュ（瑞浪）",
        "洗車ひろば 海津店",
        "KOMACHI 岐南八剣店",
        "のんびりパーク 郡上店",
        "Kireine 野洲店"
    ];

    console.log("Checking for existence of new locations...");
    const { data, error } = await supabase
        .from('carwash_locations')
        .select('id, name, address, is_active, created_at')
        .in('name', names);

    if (error) {
        console.error("DB Error:", error);
    } else {
        console.log(`Found ${data?.length} / ${names.length} records:`);
        data?.forEach(d => console.log(` - [${d.is_active ? 'ACTIVE' : 'INACTIVE'}] ${d.name} (${d.address})`));
    }

    // Also check the verify query logic for Shiga
    console.log("\nChecking Shiga Query Logic...");
    const { data: shigaData, error: shigaError } = await supabase
        .from('carwash_locations')
        .select('name')
        .like('address', '滋賀県%')
        .eq('is_active', true);

    if (shigaError) console.error("Shiga Query Error:", shigaError);
    else console.log(`Query "address like '滋賀県%'" returns ${shigaData?.length} records.`);
}

main();
