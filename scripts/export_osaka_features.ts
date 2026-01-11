
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportOsakaData() {
    console.log('Fetching Osaka records...');

    // Filter by address containing "大阪"
    const { data, error } = await supabase
        .from('carwash_locations')
        .select(`
            id,
            name,
            address,
            has_self_wash,
            has_auto_wash,
            has_non_brush,
            has_vacuum,
            has_mat_wash,
            is_24h,
            has_unlimited_water
        `)
        .like('address', '%大阪%')
        .order('id');

    if (error) {
        console.error('Error fetching data:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No records found for Osaka.');
        return;
    }

    console.log(`Found ${data.length} records.`);

    // Define CSV Header with Japanese names
    const header = [
        'id',
        'name',
        'address',
        'セルフ洗車',      // has_self_wash
        '門型洗車機',      // has_auto_wash
        'ノンブラシ洗車機', // has_non_brush
        '掃除機',          // has_vacuum
        'マット洗い機',    // has_mat_wash
        '24時間営業',      // is_24h
        '水道使い放題'      // has_unlimited_water
    ].join(',');

    // Map rows to CSV strings
    const rows = data.map(row => {
        return [
            row.id,
            `"${row.name.replace(/"/g, '""')}"`, // Escape quotes
            `"${row.address.replace(/"/g, '""')}"`,
            row.has_self_wash ? 'TRUE' : 'FALSE',
            row.has_auto_wash ? 'TRUE' : 'FALSE',
            row.has_non_brush ? 'TRUE' : 'FALSE',
            row.has_vacuum ? 'TRUE' : 'FALSE',
            row.has_mat_wash ? 'TRUE' : 'FALSE',
            row.is_24h ? 'TRUE' : 'FALSE',
            row.has_unlimited_water ? 'TRUE' : 'FALSE'
        ].join(',');
    });

    const csvContent = [header, ...rows].join('\n');
    const outputPath = path.join(process.cwd(), 'osaka_carwash_features.csv');

    fs.writeFileSync(outputPath, csvContent, 'utf-8');
    console.log(`Exported to ${outputPath}`);
}

exportOsakaData();
