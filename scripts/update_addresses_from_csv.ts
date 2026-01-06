
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { parse } from 'csv-parse/sync';

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAddresses() {
    const csvPath = path.join(process.cwd(), "data", "carwash_db_export.csv");

    if (!fs.existsSync(csvPath)) {
        console.error(`CSV file not found at ${csvPath}`);
        return;
    }

    console.log(`Reading CSV from ${csvPath}...`);
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    console.log(`Found ${records.length} records in CSV.`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;


    // Cast records to any[] or define a type, but for simple script any is fine or handle the implicit any if possible (but we got an error).
    // The parse function returns any (or Record<string, any>[] if typed but Sync version might default to any).
    // Let's explicitly say records is an array of any.
    for (const record of records as any[]) {

        const id = record.id;
        const newAddress = record.address;

        if (!id || !newAddress) {
            console.warn(`Skipping record with missing ID or address: ${JSON.stringify(record)}`);
            continue;
        }

        // Fetch current address from DB
        const { data: currentData, error: fetchError } = await supabase
            .from("carwash_locations")
            .select("address")
            .eq("id", id)
            .single();

        if (fetchError) {
            console.error(`Error fetching record containing ID ${id}:`, fetchError.message);
            errorCount++;
            continue;
        }

        if (!currentData) {
            console.warn(`Record with ID ${id} not found in DB. Skipping.`);
            skippedCount++;
            continue;
        }

        const currentAddress = currentData.address;

        // Normalize for comparison (optional, but good practice)
        // Adjust normalization as needed (e.g. half-width/full-width conversion)
        if (currentAddress !== newAddress) {
            console.log(`Updating ID ${id}:`);
            console.log(`  Current: ${currentAddress}`);
            console.log(`  New:     ${newAddress}`);

            const { error: updateError } = await supabase
                .from("carwash_locations")
                .update({
                    address: newAddress,
                    updated_at: new Date().toISOString()
                })
                .eq("id", id);

            if (updateError) {
                console.error(`  Error updating ID ${id}:`, updateError.message);
                errorCount++;
            } else {
                console.log(`  ✅ Update successful.`);
                updatedCount++;
            }
        } else {
            // console.log(`Skipping ID ${id} (Address matches).`);
            skippedCount++;
        }
    }

    console.log("--------------------------------------------------");
    console.log(`create-update-script process finished.`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (Match/Not Found): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
}

updateAddresses();
