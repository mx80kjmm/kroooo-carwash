
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const outputFile = path.join(dataDir, 'all_carwashes.json');

// List of all known data files to merge
// We read directory to find them
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('_carwashes.json') && f !== 'all_carwashes.json');

console.log(`Found ${files.length} JSON files to merge:`, files);

let allData: any[] = [];

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(content);
        if (Array.isArray(json)) {
            console.log(`Loaded ${json.length} items from ${file}`);
            allData = allData.concat(json);
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e);
    }
});

// Deduplicate by Name and Address
const seen = new Set();
const dedupedData = [];

for (const item of allData) {
    const key = `${item.name}-${item.address}`;
    if (!seen.has(key)) {
        seen.add(key);

        // Normalize Data Structure
        const normalized = { ...item };

        // Ensure Equipment Object
        if (!normalized.equipment) {
            normalized.equipment = {
                non_brush_washing_machine: item.has_non_brush_washing_machine || item.has_auto_wash || false,
                high_pressure_washer: item.has_high_pressure_washer || item.has_self_wash || false,
                vacuum_cleaner: item.has_vacuum || false,
                mat_cleaner: item.has_mat_cleaner || item.has_mat_wash || false,
                roofed_spray_area: item.has_roofed_spray_area || false
            };
        }

        // Ensure Lat/Lon (null if missing)
        if (normalized.latitude === undefined) normalized.latitude = null;
        if (normalized.longitude === undefined) normalized.longitude = null;

        // Ensure new fields
        if (normalized.x_post_url === undefined) normalized.x_post_url = "";
        if (normalized.url === undefined) normalized.url = "";
        if (normalized.notes === undefined) normalized.notes = "";

        dedupedData.push(normalized);
    } else {
        // console.log(`Duplicate skipped: ${item.name}`);
    }
}

console.log(`Total unique items: ${dedupedData.length}`);

fs.writeFileSync(outputFile, JSON.stringify(dedupedData, null, 2), 'utf-8');
console.log(`Written to ${outputFile}`);
