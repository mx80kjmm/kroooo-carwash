
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
let carWashes = JSON.parse(rawData);

const targetName = "ウォッシュザウルス新御堂";
const initialCount = carWashes.length;

carWashes = carWashes.filter((c: any) => c.name !== targetName);

if (carWashes.length < initialCount) {
    fs.writeFileSync(dataPath, JSON.stringify(carWashes, null, 2), 'utf-8');
    console.log(`Deleted ${targetName}. Count: ${initialCount} -> ${carWashes.length}`);
} else {
    console.log(`${targetName} not found.`);
}
