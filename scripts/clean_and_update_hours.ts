
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

function toHalfWidth(str: string): string {
    if (!str) return str;
    return str
        .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        .replace(/[－−]/g, "-") // Full-width hyphen/minus to ascii hyphen
        .replace(/　/g, " ");    // Full-width space to ascii space
}

async function cleanAndUpdate() {
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

    let updatedAddressCount = 0;
    let updatedHoursCount = 0;
    let errorCount = 0;

    for (const record of records as any[]) {
        const id = record.id;
        const csvAddress = record.address;
        const csvHours = record.business_hours;

        if (!id) continue;

        // 1. Clean Address
        const cleanedAddress = toHalfWidth(csvAddress);

        // Fetch current data from DB to compare
        const { data: currentData, error: fetchError } = await supabase
            .from("carwash_locations")
            .select("address, business_hours")
            .eq("id", id)
            .single();

        if (fetchError) {
            console.error(`Error fetching record ${id}:`, fetchError.message);
            errorCount++;
            continue;
        }

        if (!currentData) {
            console.warn(`Record with ID ${id} not found in DB. Skipping.`);
            continue;
        }

        const updates: any = {};
        let logMsg = `Check ID ${id}:`;
        let needsUpdate = false;

        // Compare Address (Cleaned vs Current DB)
        if (cleanedAddress !== currentData.address) {
            updates.address = cleanedAddress;
            logMsg += `\n  - Address: '${currentData.address}' -> '${cleanedAddress}'`;
            updatedAddressCount++;
            needsUpdate = true;
        }

        // Compare Business Hours
        // Handle null/undefined consistency
        const dbHours = currentData.business_hours || "";
        const targetHours = csvHours || "";

        if (dbHours !== targetHours) {
            updates.business_hours = targetHours;
            logMsg += `\n  - Hours:   '${dbHours}' -> '${targetHours}'`;
            updatedHoursCount++;
            needsUpdate = true;
        }

        if (needsUpdate) {
            updates.updated_at = new Date().toISOString();
            console.log(logMsg);

            const { error: updateError } = await supabase
                .from("carwash_locations")
                .update(updates)
                .eq("id", id);

            if (updateError) {
                console.error(`  ❌ Error updating ID ${id}:`, updateError.message);
                errorCount++;
                // Rollback counts if failed
                if (updates.address) updatedAddressCount--;
                if (updates.business_hours) updatedHoursCount--;
            } else {
                console.log(`  ✅ Update successful.`);
            }
        }
    }

    console.log("--------------------------------------------------");
    console.log(`Clean & Update process finished.`);
    console.log(`Addresses Updated (Half-width conversion): ${updatedAddressCount}`);
    console.log(`Business Hours Updated (Sync from CSV):    ${updatedHoursCount}`);
    console.log(`Errors: ${errorCount}`);
}

cleanAndUpdate();
