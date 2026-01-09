
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBadData() {
    console.log("Checking for bad location data...");

    // Fetch all records
    const { data, error } = await supabase
        .from("carwash_locations")
        .select("id, name, address, latitude, longitude");

    if (error) {
        console.error("Error:", error);
        return;
    }

    if (!data) return;

    const badRecords = data.filter(r =>
        !r.latitude || r.latitude === 0 ||
        !r.longitude || r.longitude === 0 ||
        // Check for coordinates outside Japan roughly (Lat 20-46, Lng 122-154)
        r.latitude < 20 || r.latitude > 46 ||
        r.longitude < 122 || r.longitude > 154
    );

    console.log(`Total Records: ${data.length}`);
    console.log(`Bad Records: ${badRecords.length}`);

    if (badRecords.length > 0) {
        console.log("--- Bad Records ---");
        badRecords.forEach(r => {
            console.log(`[${r.id}] ${r.name} (${r.address}) -> Lat: ${r.latitude}, Lng: ${r.longitude}`);
        });
    }
}

checkBadData();
