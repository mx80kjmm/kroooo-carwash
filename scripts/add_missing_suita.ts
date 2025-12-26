
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const carWashes = JSON.parse(rawData);

const newItems = [
    {
        name: "コイン洗車場 (山田南)",
        address: "大阪府吹田市山田南38",
        hours: "不明",
        equipment: {
            high_pressure_washer: true, // Assuming standard
        },
        price_estimated: "不明",
        url: "",
        x_post_url: "",
        notes: "ユーザー指摘による追加 (無名)"
    },
    {
        name: "カーピカランド南吹田",
        address: "大阪府吹田市南吹田1-20",
        hours: "5:00 - 22:00", // Found in search snippet
        equipment: {
            high_pressure_washer: true
        },
        price_estimated: "不明",
        url: "",
        x_post_url: "",
        notes: "ユーザー指摘による追加"
    }
];

async function geocodeGoogle(address: string) {
    if (!API_KEY) return null;
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}&language=ja`;
        const res = await fetch(url);
        const data: any = await res.json();
        if (data.status === 'OK' && data.results.length > 0) {
            const loc = data.results[0].geometry.location;
            return { lat: loc.lat, lng: loc.lng };
        }
    } catch (e) { console.error(e); }
    return null;
}

async function main() {
    for (const item of newItems) {
        console.log(`Adding ${item.name}...`);

        // Geocode
        const loc = await geocodeGoogle(item.address);
        if (loc) {
            (item as any).latitude = loc.lat;
            (item as any).longitude = loc.lng;
            console.log(`  -> ${loc.lat}, ${loc.lng}`);
        } else {
            console.log("  -> Geocode failed");
            (item as any).latitude = 0;
            (item as any).longitude = 0;
        }

        // Check duplicate?
        const exists = carWashes.find((c: any) => c.name === item.name);
        if (!exists) {
            carWashes.push(item);
        } else {
            console.log("  -> Already exists, skipping");
        }
    }

    fs.writeFileSync(dataPath, JSON.stringify(carWashes, null, 2), 'utf-8');
    console.log(`Added missing items. Total: ${carWashes.length}`);
}

main();
