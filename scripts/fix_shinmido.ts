
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const carWashes = JSON.parse(rawData);

const targetName = "ウォッシュザウルス新御堂";
const newAddress = "大阪府吹田市垂水町1-56-23";

const item = carWashes.find((c: any) => c.name === targetName);

async function geocodeGoogle(address: string) {
    if (!API_KEY) return null;
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}&language=ja`;
        const res = await fetch(url);
        const data: any = await res.json();
        if (data.status === 'OK' && data.results.length > 0) {
            return data.results[0].geometry.location;
        }
    } catch (e) { console.error(e); }
    return null;
}

async function main() {
    if (item) {
        console.log(`Fixing ${targetName}...`);
        item.address = newAddress;

        const loc = await geocodeGoogle(newAddress);
        if (loc) {
            item.latitude = loc.lat;
            item.longitude = loc.lng;
            console.log(`  -> Fixed Coords: ${loc.lat}, ${loc.lng}`);
        }

        fs.writeFileSync(dataPath, JSON.stringify(carWashes, null, 2), 'utf-8');
        console.log("✅ JSON Updated.");
    } else {
        console.log("Target not found.");
    }
}

main();
