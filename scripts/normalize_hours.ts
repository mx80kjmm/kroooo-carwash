
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

// Utility to format time token
// Input: "1000" -> "10:00", "2359" -> "24:00", "07" -> "07:00"
function formatTimeToken(token: string): string {
    if (!token) return "";
    let clean = token.trim();

    // User specific rule: 2359 -> 24:00
    if (clean === "2359") return "24:00";
    if (clean === "2400") return "24:00";

    // "07" -> "07:00"
    if (clean.length === 2 && !isNaN(Number(clean))) {
        return `${clean}:00`;
    }

    // "1000" -> "10:00"
    if (clean.length === 4 && !isNaN(Number(clean))) {
        const h = clean.substring(0, 2);
        const m = clean.substring(2, 4);
        return `${h}:${m}`;
    }

    return clean; // Fallback
}

// Parse a single day's cell content
function parseCell(cell: string): { type: 'time' | 'closed' | '24h' | 'unknown', text: string } {
    if (!cell) return { type: 'unknown', text: "" };
    const c = cell.trim();
    if (c === "定休日") return { type: 'closed', text: "定休日" };
    if (c === "24時間") return { type: '24h', text: "24時間" };
    if (c === "不明" || c === "該当なし") return { type: 'unknown', text: "不明" };

    // Check for numeric patterns
    // 8 digits: 10002000 -> 10:00 - 20:00
    // 4 digits: 0721 -> 07:00 - 21:00 (Assume start/end hours) OR 0000 (Maybe unknown/24h)

    if (/^\d{8}$/.test(c)) {
        if (c === "00000000") {
            // Ambiguous. 00:00-00:00. Could be 24h or unknown.
            // Check context later or map to "24時間" if that's the convention, 
            // but strict reading is 00:00-00:00.
            return { type: '24h', text: "24時間" };
        }
        const start = c.substring(0, 4);
        const end = c.substring(4, 8);
        return {
            type: 'time',
            text: `${formatTimeToken(start)} - ${formatTimeToken(end)}`
        };
    }

    if (/^\d{4}$/.test(c)) {
        if (c === "0000") {
            // Ambiguous. Treat as unknown to be safe, unless we want to assume 24h.
            return { type: 'unknown', text: "不明" };
        }
        // Assume HH HH format for 4 digits (e.g., 0721 -> 07:00 - 21:00)
        const start = c.substring(0, 2);
        const end = c.substring(2, 4);
        return {
            type: 'time',
            text: `${formatTimeToken(start)} - ${formatTimeToken(end)}`
        };
    }

    // Fallback
    return { type: 'unknown', text: c };
}

async function normalizeHours() {
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

    for (const record of records as any[]) {
        const id = record.id;
        if (!id) continue;

        const days = ['月', '火', '水', '木', '金', '土', '日'];
        const dayKeys = days.map(d => `営業時間_${d}`);

        const parsedDays = dayKeys.map(key => {
            return { key, ...parseCell(record[key]) };
        });

        // Analyze logic
        let normalizedStr = "不明";

        // Check if all known are the same
        const textValues = parsedDays.map(p => p.type !== 'unknown' ? p.text : null).filter(t => t !== null);
        const uniqueTexts = Array.from(new Set(textValues));

        if (uniqueTexts.length === 0) {
            normalizedStr = "不明";
        } else if (uniqueTexts.length === 1 && uniqueTexts[0] === "24時間") {
            // Special case for 24h all days
            normalizedStr = "24時間";
        } else {
            // Build multiline string
            // Format: "月: 09:00 - 18:00\n火: ..."
            const lines = parsedDays.map(p => {
                return `${p.key.replace("営業時間_", "")}: ${p.text}`;
            });
            normalizedStr = lines.join("\n");
        }


        // Compare with current DB value
        const { data: currentData } = await supabase
            .from("carwash_locations")
            .select("business_hours")
            .eq("id", id)
            .single();

        if (currentData) {
            const current = currentData.business_hours;

            // Should we update? 
            // Only update if current is "不明" or if the new one is clearly parsed and different.
            // User request is to normalize. So we should overwrite if we successfully parsed something meaningful.

            if (normalizedStr !== "不明" && normalizedStr !== current) {
                console.log(`Updating ID ${id} Hours:`);
                console.log(`  Current: ${current}`);
                console.log(`  New:     ${normalizedStr}`);

                const { error } = await supabase
                    .from("carwash_locations")
                    .update({
                        business_hours: normalizedStr,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", id);

                if (!error) updatedCount++;
                else console.error(`  Error: ${error.message}`);
            } else {
                skippedCount++;
            }
        }
    }

    console.log("--------------------------------------------------");
    console.log(`Normalization process finished.`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
}

normalizeHours();
