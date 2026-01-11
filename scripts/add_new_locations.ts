
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface TargetLocation {
    name: string;
    address: string;
    prefecture: string;
    city: string;
    has_non_brush: boolean;
    has_self_wash: boolean;
    is_24h: boolean;
    has_unlimited_water?: boolean;
}

const TARGETS: TargetLocation[] = [
    {
        name: "カーウォッシュ（瑞浪）",
        address: "岐阜県瑞浪市土岐町7429-1",
        prefecture: "岐阜県",
        city: "瑞浪市",
        has_non_brush: false,
        has_self_wash: true,
        is_24h: true
    },
    {
        name: "洗車ひろば 海津店",
        address: "岐阜県海津市平田町三郷690",
        prefecture: "岐阜県",
        city: "海津市",
        has_non_brush: false,
        has_self_wash: true,
        is_24h: true
    },
    {
        name: "KOMACHI 岐南八剣店",
        address: "岐阜県羽島郡岐南町八剣北7丁目113-1",
        prefecture: "岐阜県",
        city: "羽島郡岐南町",
        has_non_brush: false,
        has_self_wash: true,
        is_24h: false
    },
    {
        name: "のんびりパーク 郡上店",
        address: "岐阜県郡上市八幡町初納1430-2",
        prefecture: "岐阜県",
        city: "郡上市",
        has_non_brush: false,
        has_self_wash: true,
        has_unlimited_water: true,
        is_24h: false
    },
    {
        name: "Kireine 野洲店",
        address: "滋賀県野洲市野洲913-3",
        prefecture: "滋賀県",
        city: "野洲市",
        has_non_brush: true,
        has_self_wash: true,
        is_24h: false
    }
];

async function geocode(address: string) {
    if (googleApiKey) {
        try {
            console.log(`  Querying Google Maps for: ${address}`);
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}&language=ja`;
            const res = await fetch(url);
            const data: any = await res.json();
            if (data.status === 'OK' && data.results.length > 0) {
                const loc = data.results[0].geometry.location;
                return { lat: loc.lat, lng: loc.lng, source: 'Google' };
            }
        } catch (e) { console.error(e); }
    }
    // Fallback
    try {
        console.log(`  Querying Nominatim for: ${address}`);
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        const res = await fetch(url, { headers: { 'User-Agent': 'KrooooDataImporter/1.0' } });
        const data: any = await res.json();
        if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), source: 'Nominatim' };
    } catch (e) { console.error(e); }
    return null;
}

async function main() {
    console.log(`Creating/Updating ${TARGETS.length} locations...`);

    for (const target of TARGETS) {
        const { data: existing } = await supabase.from('carwash_locations').select('id, name').eq('name', target.name).single();
        if (existing) {
            console.log(`⚠️  Already exists: ${target.name}. Skipping.`);
            continue;
        }

        console.log(`🆕 Processing: ${target.name}`);
        const loc = await geocode(target.address);
        if (!loc) { console.error("Skipping due to geocode fail"); continue; }

        console.log(`   📍 Coords: ${loc.lat}, ${loc.lng}`);

        const { data, error } = await supabase.from('carwash_locations').insert({
            name: target.name,
            address: target.address,
            prefecture: target.prefecture,
            city: target.city,
            latitude: loc.lat,
            longitude: loc.lng,
            has_non_brush: target.has_non_brush || false,
            has_self_wash: target.has_self_wash || false,
            has_auto_gate_nonbrush: false,
            has_auto_wash: false,
            has_vacuum: true,
            has_mat_wash: false,
            has_unlimited_water: target.has_unlimited_water || false,
            is_24h: target.is_24h || false,
            description: "AIによる自動登録",
            is_active: true
        }).select();

        if (error) {
            console.error(`   ❌ DB Insert Error:`, error);
        } else {
            console.log(`   ✅ Inserted successfully:`, data);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
}

main();
