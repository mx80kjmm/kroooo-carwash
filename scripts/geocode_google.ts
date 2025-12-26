
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
    console.error("❌ Missing Google Maps API Key");
    process.exit(1);
}

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const carWashes = JSON.parse(rawData);

async function geocodeGoogle(address: string) {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}&language=ja`;
        const res = await fetch(url);
        const data: any = await res.json();

        if (data.status === 'OK' && data.results.length > 0) {
            const loc = data.results[0].geometry.location;
            return { lat: loc.lat, lng: loc.lng };
        } else {
            console.error(`  ⚠️ Error for ${address}: ${data.status} - ${data.error_message || ''}`);
            return null;
        }
    } catch (e) {
        console.error(`  ❌ Network Error for ${address}:`, e);
        return null;
    }
}

async function main() {
    console.log(`🚀 Starting Google Geocoding for ${carWashes.length} items...`);
    let updatedCount = 0;

    for (const item of carWashes) {
        // We re-geocode EVERYTHING or just missing/sea ones?
        // User complained about accuracy. We should re-geocode ALL to be safe.
        // Or at least "HeartRails" ones.
        // Let's re-geocode ALL to ensure "Google Quality". 165 reqs is fine.

        // Clean address
        let searchAddress = item.address
            .replace(/（.*?）/g, '')
            .replace(/\(.*?\)/g, '')
            .trim();

        console.log(`📍 Geocoding: ${item.name} (${searchAddress})...`);
        const result = await geocodeGoogle(searchAddress);

        if (result) {
            // Check if significantly different? No, just update.
            item.latitude = result.lat;
            item.longitude = result.lng;
            updatedCount++;
            // console.log(`  -> ${result.lat}, ${result.lng}`);
        }

        // Throttle (100ms)
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`✅ Updated ${updatedCount}/${carWashes.length} locations with Google API.`);
    fs.writeFileSync(dataPath, JSON.stringify(carWashes, null, 2), 'utf-8');
}

main();
