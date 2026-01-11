
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    console.log(`Checking for records created on or after ${today}...`);

    // We'll just check for anything created recently, e.g. last 2 hours.
    // Tokyo time is 2026-01-10T06... so UTC is 2026-01-09T21...
    // Let's just check the last 10 records.

    const { data, error } = await supabase
        .from('carwash_locations')
        .select('id, name, address, created_at, is_active, prefecture')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error("DB Error:", error);
    } else {
        console.log(`Found ${data?.length} recent records:`);
        data?.forEach(d => console.log(` - [${d.created_at}] ${d.name} (${d.address}) PREF:${d.prefecture}`));
    }
}

main();
