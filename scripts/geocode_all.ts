
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const carWashes = JSON.parse(rawData);

async function geocodeAddress(address: string) {
    // Try HeartRails
    try {
        const url = `http://geoapi.heartrails.com/api/json?method=suggest&matching=like&keyword=${encodeURIComponent(address)}`;
        const res = await fetch(url);
        const data: any = await res.json();
        if (data?.response?.location?.[0]) {
            const loc = data.response.location[0];
            return { lat: parseFloat(loc.y), lng: parseFloat(loc.x), source: 'HeartRails' };
        }
    } catch (e) { /* ignore */ }

    // Try Nominatim (OSM)
    try {
        // User-Agent is required by Nominatim ToS
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        const res = await fetch(url, { headers: { 'User-Agent': 'KrooooDataImporter/1.0' } });
        const data: any = await res.json();
        if (data?.[0]) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), source: 'Nominatim' };
        }
    } catch (e) {
        console.error(`Nominatim Error: ${e}`);
    }

    return null;
}

async function main() {
    let updatedCount = 0;

    for (const item of carWashes) {
        // Force update if 0 or null
        const needsUpdate = !item.latitude || item.latitude === 0 || !item.longitude || item.longitude === 0;

        if (needsUpdate) {
            let searchAddress = item.address
                .replace(/（.*?）/g, '')
                .replace(/\(.*?\)/g, '')
                .trim();

            console.log(`Geocoding: ${item.name} -> '${searchAddress}'`);

            const result = await geocodeAddress(searchAddress);

            if (result) {
                item.latitude = result.lat;
                item.longitude = result.lng;
                updatedCount++;
                console.log(`  ✅ Found (${result.source}): ${result.lat}, ${result.lng}`);
            } else {
                // If fail, try removing the block/number for City level fallback
                const cityLevel = searchAddress.replace(/[0-9\-]+$/, '').trim();
                // Also remove last block if it looks like "SomeCity SomeTown 1-1" -> "SomeCity SomeTown"
                // Regex: remove "d-d-d" or "d-d" at end.

                if (cityLevel !== searchAddress && cityLevel.length > 3) {
                    console.log(`  Retrying City Level: '${cityLevel}'`);
                    const res2 = await geocodeAddress(cityLevel);
                    if (res2) {
                        item.latitude = res2.lat;
                        item.longitude = res2.lng;
                        updatedCount++;
                        console.log(`  ✅ Found (${res2.source} - CityLevel): ${res2.lat}, ${res2.lng}`);
                    } else {
                        console.log(`  ❌ Not Found.`);
                    }
                } else {
                    console.log(`  ❌ Not Found.`);
                }
            }
            // Polite delay
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    console.log(`Total Updated: ${updatedCount}`);
    fs.writeFileSync(dataPath, JSON.stringify(carWashes, null, 2), 'utf-8');
}

main();
