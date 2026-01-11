
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for writes

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function extractCoordsFromUrl(url: string): { lat: number, lng: number } | null {
    if (!url) return null;
    // Format: /@35.7873784,137.0086331,
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
        return {
            lat: parseFloat(match[1]),
            lng: parseFloat(match[2])
        };
    }
    return null;
}

async function applyFixes() {
    const csvPath = path.join(process.cwd(), 'missing_place_ids_report.csv');
    if (!fs.existsSync(csvPath)) {
        console.error('CSV File not found:', csvPath);
        return;
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // The CSV might have Japanese columns, so we map them or rely on column order?
    // User file header: id,name,address,latitude,longitude,googlemap:URL,備考
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true // Sometimes helpful with messy user data
    }) as any[];

    console.log(`Processing ${records.length} records...`);

    let updated = 0;
    let inserted = 0;
    let deleted = 0;
    let skipped = 0;

    for (const row of records) {
        const id = row['id'];
        const name = row['name'];
        const address = row['address'];
        const url = row['googlemap:URL'] || '';
        const remarks = row['備考'] || '';

        // Check for deletion signals
        const comments = (url + ' ' + remarks).toLowerCase();
        const shouldDelete = comments.includes('削除') || comments.includes('閉業') || comments.includes('duplicates');

        if (id !== '新規' && shouldDelete) {
            console.log(`🗑️ Deleting ${name} (${id})...`);
            const { error } = await supabase.from('carwash_locations').delete().eq('id', id);
            if (error) console.error('  Failed to delete:', error.message);
            else deleted++;
            continue;
        }

        // Extract coords
        const coords = extractCoordsFromUrl(url);
        // Fallback to CSV lat/long if valid and URL coords missing
        let lat = coords ? coords.lat : parseFloat(row['latitude']);
        let lng = coords ? coords.lng : parseFloat(row['longitude']);

        if (isNaN(lat)) lat = 0; // Or null, but table might expect numeric
        if (isNaN(lng)) lng = 0;

        // Clean up data
        const cleanAddress = address.replace('（詳細要確認）', '').trim();

        if (id === '新規') {
            console.log(`🆕 Inserting New: ${name}...`);

            // Extract prefecture from address (Simple regex)
            const prefMatch = cleanAddress.match(/^(.*?[都道府県])/);
            const prefecture = prefMatch ? prefMatch[1] : '';

            // Extract city (Simple regex, imperfect but works for many)
            const restAddress = cleanAddress.substring(prefecture.length);
            const cityMatch = restAddress.match(/^(.+?[市区町村])/);
            const city = cityMatch ? cityMatch[1] : '';

            const { error } = await supabase.from('carwash_locations').insert({
                name: name,
                address: cleanAddress,
                latitude: lat,
                longitude: lng,
                prefecture: prefecture,
                city: city, // Required field
                description: remarks
            });

            if (error) console.error('  Failed to insert:', error.message);
            else inserted++;

        } else if (id && id.length > 10) { // UUID check roughly
            console.log(`📝 Updating: ${name} (${id})...`);

            const updateData: any = {
                name: name,
                address: cleanAddress,
            };

            // Only update lat/long if we found valid ones logic? 
            // If CSV has same lat/long, no change. 
            // If URL provided new coords, update.
            if (coords) {
                updateData.latitude = coords.lat;
                updateData.longitude = coords.lng;
            }

            const { error } = await supabase
                .from('carwash_locations')
                .update(updateData)
                .eq('id', id);

            if (error) console.error('  Failed to update:', error.message);
            else updated++;
        } else {
            console.warn(`⚠️ Skipped row: ID='${id}', Name='${name}'`);
            skipped++;
        }
    }

    console.log('----------------------------');
    console.log(`Deletion: ${deleted}`);
    console.log(`Updates : ${updated}`);
    console.log(`Inserts : ${inserted}`);
    console.log(`Skipped : ${skipped}`);
}

applyFixes();
