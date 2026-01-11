
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

async function exportOsakaDataV3() {
    console.log('Fetching Osaka records (V3)...');

    // Fetch all columns needed
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
            has_pure_water,
            has_subscription,
            wash_course_info,
            max_vehicle_size
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
        let subscription = row.has_subscription; // new
        let supplies = row.has_supplies_vending;
        let courseInfo = row.wash_course_info;

        // Staff & Pure Water (same as V2)
        if (staff === null) {
            if (row.name.includes('ジャバ')) staff = true;
            else if (row.name.includes('カーピカランド')) staff = false;
        }

        if (pureWater === null) {
            if (row.name.includes('レインボー')) pureWater = true;
        }

        // Specific Store Overrides (Research Results)
        // Note: Prices are simplified summaries

        // Nishinari (西成岸里)
        if (row.name.includes('西成岸里店')) {
            // Subscription: Not mentioned
            courseInfo = "門型:900円~1600円, スプレー:700円~1200円";
        }

        // Kyobashi (京橋)
        if (row.name.includes('京橋店')) {
            subscription = true;
            courseInfo = "門型全自動:1200円~1600円, 手洗い:1800円~2000円, スプレー:600円~1300円";
        }

        // Suminoe (住之江)
        if (row.name.includes('住之江店')) {
            subscription = true;
            courseInfo = "門型全自動:1000円~1400円, 手洗い:1600円~1800円, スプレー:600円~1100円";
        }

        // Sakai Otori (堺鳳)
        if (row.name.includes('堺鳳店')) {
            // Subscription: No
            courseInfo = "門型全自動:1000円~1400円, 手洗い:1600円~1800円, スプレー:600円~1100円";
        }

        // Higashiosaka (東大阪)
        if (row.name.includes('東大阪店')) {
            supplies = true; // "洗車用品自販機あり" found
            courseInfo = "門型全自動:1000円~1400円, 手洗い:1600円~1800円, スプレー:600円~1100円";
        }

        return {
            ...row,
            has_staff: staff,
            has_pure_water: pureWater,
            has_subscription: subscription,
            has_supplies_vending: supplies,
            wash_course_info: courseInfo
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
        '純水対応',             // has_pure_water
        '定額洗車',             // has_subscription (NEW)
        '洗車コース料金/情報',   // wash_course_info (NEW)
        '最大車両サイズ'        // max_vehicle_size (NEW)
    ].join(',');

    // Helper to format Boolean/3-state
    const fmtBool = (val: boolean | null | undefined) => {
        if (val === true) return 'TRUE';
        if (val === false) return 'FALSE';
        return '未確認';
    };

    const fmtText = (val: string | null | undefined) => {
        if (!val || val === 'unconfirmed') return '未確認';
        if (val === 'none') return '無し';
        if (val === 'cold') return '有り(常温)';
        if (val === 'hot') return '有り(温水)';
        if (val === 'free') return '無料';
        if (val === 'paid') return '有料';
        return val;
    };

    // Empty text formatter (returns "未確認" if empty, but for free text like course info, maybe empty string is better? User said he will Edit. Blank is easier to fill. But consistency...)
    // Let's use blank for free text fields if undefined, unless "unconfirmed" logic.
    const fmtFreeText = (val: string | null | undefined) => {
        return `"${(val || '').replace(/"/g, '""')}"`;
    }

    const rows = processedData.map(row => {
        return [
            row.id,
            `"${row.name.replace(/"/g, '""')}"`,
            `"${row.address.replace(/"/g, '""')}"`,
            fmtBool(row.has_manual_spray_wash),
            fmtBool(row.has_gantry_wash),
            fmtBool(row.has_non_brush),
            fmtBool(row.has_vacuum),
            fmtBool(row.is_24h),
            fmtText(row.water_sink_status),
            fmtText(row.water_sink_fee_type),
            fmtFreeText(row.water_sink_fee_info),
            fmtBool(row.has_supplies_vending),
            fmtBool(row.has_staff),
            fmtBool(row.has_pure_water),
            fmtBool(row.has_subscription), // NEW
            fmtFreeText(row.wash_course_info), // NEW
            fmtFreeText(row.max_vehicle_size) // NEW
        ].join(',');
    });

    const csvContent = [header, ...rows].join('\n');
    const outputPath = path.join(process.cwd(), 'osaka_carwash_features_v3.csv');

    fs.writeFileSync(outputPath, csvContent, 'utf-8');
    console.log(`Exported V3 to ${outputPath}`);
}

exportOsakaDataV3();
