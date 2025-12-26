
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const carWashes = JSON.parse(rawData);

const targetName = "D-Wash 中環南茨木";
const newAddress = "大阪府茨木市沢良宜西2-6-15";

const target = carWashes.find((c: any) => c.name === targetName);

if (target) {
    console.log(`Found ${targetName}. Address: ${target.address} -> ${newAddress}`);
    target.address = newAddress;

    // Explicitly reset lat/lon to force re-geocode?
    // geocode_google.ts re-geocodes everyone anyway.

    fs.writeFileSync(dataPath, JSON.stringify(carWashes, null, 2), 'utf-8');
    console.log("✅ JSON updated.");
} else {
    console.error(`❌ Could not find ${targetName}`);
}
