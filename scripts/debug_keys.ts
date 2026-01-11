
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
    const { data } = await supabase.from('carwash_locations').select('*').limit(1);
    if (data && data[0]) {
        console.log("COLUMNS:\n" + Object.keys(data[0]).join("\n"));
    } else {
        console.log("No data found to infer schema.");
    }
}
main();
