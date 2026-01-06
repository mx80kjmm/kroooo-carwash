
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportData() {
    console.log("Fetching data from Supabase...");
    const { data, error } = await supabase
        .from("carwash_locations")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("No data found.");
        return;
    }

    console.log(`Found ${data.length} records.`);

    // Extract headers
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header];
            if (val === null || val === undefined) return "";

            // Handle arrays (e.g. payment_methods)
            if (Array.isArray(val)) {
                // Join with pipe or comma, but inside quotes
                return `"${val.join("|")}"`;
            }

            // Handle strings (escape quotes and wrap in quotes)
            if (typeof val === "string") {
                // Replace line breaks with space to keep it one line per record if desired, 
                // or just keep them inside quotes. Excel handles newlines in quotes usually.
                // Let's replace newlines just in case for simpler viewing.
                const valClean = val.replace(/\n/g, " ").replace(/"/g, '""');
                return `"${valClean}"`;
            }

            // Numbers / Booleans
            return val;
        });
        csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const outputPath = path.join(process.cwd(), "data", "latest_carwash_export_20260107.csv");

    fs.writeFileSync(outputPath, csvContent, "utf-8"); // "utf-8" with BOM is better for Excel? 
    // Usually adding BOM \uFEFF helps Excel open UTF-8 CSVs correctly.
    const bom = "\uFEFF";
    fs.writeFileSync(outputPath, bom + csvContent, "utf-8");

    console.log(`Exported CSV to: ${outputPath}`);
}

exportData();
