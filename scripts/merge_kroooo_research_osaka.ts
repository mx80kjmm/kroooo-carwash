
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const carWashes = JSON.parse(rawData);

const candidates = [
    { name: "洗車CLUB岸里", address: "大阪府大阪市西成区岸里2-13-1" },
    { name: "洗車のジャバ 京橋店", address: "大阪府大阪市都島区片町2-3" },
    { name: "カーピカランドK2", address: "大阪府大阪市平野区喜連西5-3-22" },
    { name: "コイン洗車大和川 (SELWASH大和川)", address: "大阪府大阪市平野区瓜破1-8" },
    { name: "SELWASHU富士", address: "大阪府大阪市此花区酉島5-6-26" },
    { name: "カーピカランド豊里", address: "大阪府大阪市東淀川区大道南1-3" },
    { name: "ウオッシュザウルス豊里", address: "大阪府大阪市東淀川区大道南1-5" },
    { name: "ウオッシュザウルス新大阪", address: "大阪府大阪市東淀川区宮原2-1" },
    { name: "カーピカランド木川", address: "大阪府大阪市淀川区木川西4-2-8" },
    { name: "カーピカランド巽", address: "大阪府大阪市生野区巽中2-277" },
    { name: "JAVA住之江", address: "大阪府大阪市住之江区平林南2-4-31" },
    { name: "Newカーピカランド住之江", address: "大阪府大阪市住之江区新北島3-3-19" },
    { name: "カーピカランドきづがわ", address: "大阪府大阪市浪速区木津川1-7-4" },
    { name: "カーピカランド東八田", address: "大阪府堺市中区東八田225" },
    { name: "洗車のジャバ 堺鳳店", address: "大阪府堺市西区上593-1" },
    { name: "カーウォッシュ21堺出島", address: "大阪府堺市堺区出島海岸通3-5" },
    { name: "洗車の王国 なかもず店", address: "大阪府堺市北区金岡町1377-6" },
    { name: "SELWASHU藤美", address: "大阪府東大阪市金岡4-15-28" },
    { name: "洗車のジャバ 枚方招提南店", address: "大阪府枚方市招提南町3-23" },
    { name: "カーピカランド藤阪", address: "大阪府枚方市藤阪東町4-7" },
    { name: "カーピカランド緑地北", address: "大阪府豊中市旭丘10" },
    { name: "ウォッシュザウルス新御堂", address: "大阪府吹田市（詳細住所要確認）" }, // Need geocode to find real Addr
];

async function geocodeGoogle(address: string) {
    if (!API_KEY) return null;
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}&language=ja`;
        const res = await fetch(url);
        const data: any = await res.json();
        if (data.status === 'OK' && data.results.length > 0) {
            const loc = data.results[0].geometry.location;
            const fmt = data.results[0].formatted_address;
            // Better address from Google?
            return { lat: loc.lat, lng: loc.lng, formatted: fmt };
        }
    } catch (e) { console.error(e); }
    return null;
}

async function main() {
    let addedCount = 0;

    for (const item of candidates) {
        // Check simple duplicates
        const existingName = carWashes.find((c: any) => c.name.includes(item.name) || item.name.includes(c.name));
        const existingAddr = carWashes.find((c: any) => c.address && item.address && (c.address.includes(item.address) || item.address.includes(c.address)));

        if (existingName) {
            console.log(`Skipping ${item.name} (Found Name match: ${existingName.name})`);
            continue;
        }
        if (existingAddr) {
            console.log(`Skipping ${item.name} (Found Address match: ${existingAddr.name} @ ${existingAddr.address})`);
            continue;
        }

        console.log(`Adding New: ${item.name} ...`);

        // Geocode
        let lat = 0, lng = 0;
        let finalAddr = item.address;

        const geo = await geocodeGoogle(item.address);
        if (geo) {
            lat = geo.lat;
            lng = geo.lng;
            console.log(`  -> Geocoded: ${lat}, ${lng} (${geo.formatted})`);
            // Use formatted address if it contains prefecture? 
            // Google formatted often includes "Japan, Zip...". 
            // Keep original candidate address or update if vague.
            if (item.address.includes("要確認")) {
                finalAddr = geo.formatted.replace(/^日本、/, '');
                console.log(`  -> Address Updated: ${finalAddr}`);
            }
        } else {
            console.log("  -> Geocode Failed");
        }

        const newEntry = {
            name: item.name,
            address: finalAddr,
            hours: "不明",
            equipment: { high_pressure_washer: true },
            price_estimated: "不明",
            url: "",
            x_post_url: "",
            notes: "全国リサーチ追加 (大阪編)",
            latitude: lat,
            longitude: lng
        };

        carWashes.push(newEntry);
        addedCount++;

        await new Promise(r => setTimeout(r, 200));
    }

    if (addedCount > 0) {
        fs.writeFileSync(dataPath, JSON.stringify(carWashes, null, 2), 'utf-8');
        console.log(`✅ Added ${addedCount} new locations in Osaka/Kansai.`);
    } else {
        console.log("No new locations added.");
    }
}

main();
