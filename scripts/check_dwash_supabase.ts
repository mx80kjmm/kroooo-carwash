
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkDWash() {
    const { data: locations, error } = await supabase
        .from('carwash_locations')
        .select('id, name, address, latitude, longitude')
        .ilike('name', '%D-Wash%');

    if (error) {
        console.error(error);
        return;
    }

    console.log(JSON.stringify(locations, null, 2));
}

checkDWash();
