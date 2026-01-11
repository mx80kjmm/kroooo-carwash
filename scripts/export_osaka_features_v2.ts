
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

async function exportOsakaDataV2() {
    console.log('Fetching Osaka records (V2)...');

    const { data, error } = await supabase
        .from('carwash_locations')
        .select(`
            id,
            name,
            address,
            has_manual_spray_wash,
            has_gantry_wash,
            has_non_brush,
            has_vacuum,
            is_24h,
            water_sink_status,
            water_sink_fee_type,
            water_sink_fee_info,
            has_supplies_vending,
            has_staff,
            has_pure_water
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

    // Heuristics Logic
    const processedData = data.map(row => {
        let staff = row.has_staff;
        let pureWater = row.has_pure_water;

        // Apply Heuristics if null
        if (staff === null) {
            if (row.name.includes('ジャバ')) staff = true;
            else if (row.name.includes('カーピカランド')) staff = false;
        }

        if (pureWater === null) {
            if (row.name.includes('レインボー')) pureWater = true;
            // Java usually implies no brush, but not necessarily pure water.
        }

        return {
            ...row,
            has_staff: staff,
            has_pure_water: pureWater
        };
    });


    // Define CSV Header (Japanese)
    const header = [
        'id',
        'name',
        'address',
        '手動高圧スプレーガン', // has_manual_spray_wash
        '門型自動洗車機',      // has_gantry_wash
        'ノンブラシ洗車機',    // has_non_brush
        '掃除機',              // has_vacuum
        '24時間営業',          // is_24h
        '水道シンク設備(状況)', // water_sink_status
        '水道シンク設備(料金)', // water_sink_fee_type
        '水道シンク設備(詳細)', // water_sink_fee_info
        '洗車用品自動販売機',   // has_supplies_vending
        'スタッフ常駐',         // has_staff
        '純水対応'             // has_pure_water
    ].join(',');

    // Helper to format Boolean/3-state
    const fmtBool = (val: boolean | null) => {
        if (val === true) return 'TRUE'; // 対応
        if (val === false) return 'FALSE'; // 非対応
        return '未確認'; // unconfirmed
    };

    const fmtText = (val: string | null) => {
        if (!val || val === 'unconfirmed') return '未確認';
        if (val === 'none') return '無し';
        if (val === 'cold') return '有り(常温)';
        if (val === 'hot') return '有り(温水)';
        if (val === 'free') return '無料';
        if (val === 'paid') return '有料';
        return val;
    };

    const rows = processedData.map(row => {
        return [
            row.id,
            `"${row.name.replace(/"/g, '""')}"`,
            `"${row.address.replace(/"/g, '""')}"`,
            fmtBool(row.has_manual_spray_wash),
            fmtBool(row.has_gantry_wash),
            fmtBool(row.has_non_brush),
            fmtBool(row.has_vacuum),
            fmtBool(row.is_24h), // Updated by 24h script
            fmtText(row.water_sink_status),
            fmtText(row.water_sink_fee_type),
            `"${(row.water_sink_fee_info || '').replace(/"/g, '""')}"`,
            fmtBool(row.has_supplies_vending), // Default null -> 未確認
            fmtBool(row.has_staff), // Heuristics applied
            fmtBool(row.has_pure_water) // Heuristics applied
        ].join(',');
    });

    const csvContent = [header, ...rows].join('\n');
    const outputPath = path.join(process.cwd(), 'osaka_carwash_features_v2.csv');

    fs.writeFileSync(outputPath, csvContent, 'utf-8');
    console.log(`Exported V2 to ${outputPath}`);
}

exportOsakaDataV2();
