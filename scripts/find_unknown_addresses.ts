
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const carWashes = JSON.parse(rawData);

const unknowns = carWashes.filter((c: any) =>
    c.address.includes('詳細要確認') ||
    c.address.includes('住所不明') ||
    c.address.length < 8 // Aggressive check for vague addresses
);

console.log(`Found ${unknowns.length} items to fix:`);
unknowns.forEach((c: any) => {
    console.log(`- ${c.name} (${c.address})`);
});
