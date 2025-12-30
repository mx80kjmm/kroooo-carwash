
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateFromWorksheet() {
    console.log('Reading worksheet...');
    const worksheetPath = "C:\\Users\\mx80k\\AI\\Management_Vault\\99_System\\AG_Task_Missing_Place_IDs.md";
    const content = fs.readFileSync(worksheetPath, 'utf-8');

    // Parse table rows
    // | `e99dba25` | Name | Address | URL |
    const regex = /\|\s*`([^`]+)`\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const id = match[1].trim();
        const name = match[2].trim();
        const address = match[3].trim();
        const urlField = match[4].trim();

        // 1. Check for "閉業"
        if (urlField.includes('閉業') || urlField.includes('該当なし')) {
            console.log(`Deactivating ${name} (${id})`);
            await supabase.from('carwash_locations').update({ is_active: false }).eq('id', id);
            continue;
        }

        // 2. Parse URL for coordinates
        // https://www.google.co.jp/maps/place/.../@34.9657874,135.7267672,17z/...
        const coordRegex = /@([\d.]+),([\d.]+)/;
        const coordMatch = urlField.match(coordRegex);

        let updates: any = {};

        if (coordMatch) {
            updates.latitude = parseFloat(coordMatch[1]);
            updates.longitude = parseFloat(coordMatch[2]);
            console.log(`Setting coords for ${name} (${id}): ${updates.latitude}, ${updates.longitude}`);
        }

        // 3. Rename check
        if (urlField.includes('ウォッシュザウルス豊里')) {
            updates.name = 'ウォッシュザウルス豊里';
            console.log(`Renaming ${name} to ウォッシュザウルス豊里`);
        }

        if (Object.keys(updates).length > 0) {
            const { error } = await supabase.from('carwash_locations').update(updates).eq('id', id);
            if (error) console.error(`Error updating ${id}:`, error);
        }
    }
}

updateFromWorksheet();
