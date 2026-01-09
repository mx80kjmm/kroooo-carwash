
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGETS = [
    { name: "D-Wash 富山黒瀬", newAddress: "富山県富山市黒瀬北町2-10-3" },
    { name: "D-Wash 中環南茨木", newAddress: "大阪府茨木市沢良宜西2-6-15" },
    { name: "D-Wash 南町田", newAddress: "東京都町田市鶴間6-1-32" }
];

async function geocode(address: string) {
    // Try Google first if key exists
    if (googleApiKey) {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}&language=ja`;
            const res = await fetch(url);
            const data: any = await res.json();
            if (data.status === 'OK' && data.results.length > 0) {
                const loc = data.results[0].geometry.location;
                return { lat: loc.lat, lng: loc.lng, source: 'Google' };
            }
        } catch (e) {
            console.error("Google Geocode error:", e);
        }
    }

    // Fallback to Nominatim
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        const res = await fetch(url, { headers: { 'User-Agent': 'KrooooDataImporter/1.0' } });
        const data: any = await res.json();
        if (data?.[0]) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), source: 'Nominatim' };
        }
    } catch (e) {
        console.error("Nominatim error:", e);
    }
    return null;
}

async function main() {
    console.log(`Checking ${TARGETS.length} D-Wash targets...`);

    for (const target of TARGETS) {
        // Find by name
        const { data: records, error } = await supabase
            .from('carwash_locations')
            .select('*')
            .eq('name', target.name);

        if (error) {
            console.error(`Error finding ${target.name}:`, error);
            continue;
        }

        if (!records || records.length === 0) {
            console.warn(`❌ Not found: ${target.name}`);
            // Try fuzzy search?
            const { data: fuzzy } = await supabase.from('carwash_locations').select('*').ilike('name', `%${target.name}%`);
            if (fuzzy && fuzzy.length > 0) {
                console.log(`   Did you mean: ${fuzzy.map(f => f.name).join(', ')}?`);
            }
            continue;
        }

        const record = records[0];
        console.log(`Processing: ${record.name} (Current: ${record.address})`);

        let needsUpdate = false;
        if (record.address !== target.newAddress) {
            console.log(`  Need Address update: ${record.address} -> ${target.newAddress}`);
            needsUpdate = true;
        }
        if (!record.latitude || record.latitude === 0 || !record.longitude || record.longitude === 0) {
            console.log(`  Need Coords update (missing/zero).`);
            needsUpdate = true;
        }

        // Always check coords if Address changes, or if forcing check. 
        // Let's assume if address matches and coords exist, it's fine.
        if (!needsUpdate) {
            console.log(`  ✅ Already correct. Skipping.`);
            continue;
        }

        console.log(`  🔄 Updating...`);

        // Geocode
        const loc = await geocode(target.newAddress);
        if (loc) {
            console.log(`  📍 Geocoded (${loc.source}): ${loc.lat}, ${loc.lng}`);
            const { error: updateError } = await supabase
                .from('carwash_locations')
                .update({
                    address: target.newAddress,
                    latitude: loc.lat,
                    longitude: loc.lng
                })
                .eq('id', record.id);

            if (updateError) {
                console.error(`  ❌ Update failed:`, updateError);
            } else {
                console.log(`  ✅ Updated successfully.`);
            }
        } else {
            console.error(`  ❌ Geocoding failed for ${target.newAddress}`);
        }

        // Wait 1s
        await new Promise(r => setTimeout(r, 1000));
    }
}

main();
