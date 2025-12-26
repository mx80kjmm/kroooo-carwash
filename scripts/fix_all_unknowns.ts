
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const replacements: Record<string, string> = {
    "洗神（アラジン）洗車場": "愛知県額田郡幸田町坂崎祐金7-5",
    "超純水洗車アライグマ": "静岡県富士市柚木169-1",
    "のんびりパーク": "岐阜県郡上市八幡町初納1430-2",
    "ピカピカラボ": "三重県伊勢市小俣町湯田1516-1",
    "Whitepit 南区東海通店": "愛知県名古屋市南区戸部下1-2-1",
    "Whitepit 和歌山大浦店": "和歌山県和歌山市湊御殿2-3-6",
    "Whitepit 紀三井寺店": "和歌山県和歌山市紀三井寺539-7",
    "Whitepit 松原セブンパーク天美前店": "大阪府松原市天美東2-208",
    "Whitepit 府中中須店": "広島県府中市中須町81-3",
    "Whitepit 三谷店": "愛知県蒲郡市三谷北通1-90",
    "Whitepit 尼崎玉江橋店": "兵庫県尼崎市東難波町5-31-8",
    "Whitepit 高松鶴市店": "香川県高松市鶴市町62-1",
    "Whitepit 京都伏見本店": "京都府京都市伏見区南寝小屋町14",
    "カーピカランド レインボー 岩倉店": "愛知県岩倉市稲荷町高畑54",
    "カーピカランド レインボー 猿海道店": "愛知県一宮市猿海道1-2-1",
    "カーピカランド レインボー 開明店": "愛知県一宮市開明郷東28-1",
    "カーピカランド レインボー 今伊勢店": "愛知県一宮市今伊勢町本神戸中町21",
    "カーピカランド レインボー 高蔵寺店": "愛知県春日井市中央台1-1-5",
    "カーピカランド レインボー 名古屋なかがわ店": "愛知県名古屋市中川区小城町1-90",
    "カーピカランド レインボー 多加木店": "愛知県一宮市多加木2-11-3",
    "名古屋城プライベートセルフ洗車場（名城公園北）": "愛知県名古屋市北区金城2-5-3",
    "カーピカランド 中丸": "神奈川県相模原市南区下溝236",
    "カーピカランド問屋町店": "栃木県宇都宮市石井町3431-27",
    "カーピカランド楠": "愛知県名古屋市北区若鶴町342"
};

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const carWashes = JSON.parse(rawData);

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
    let count = 0;

    for (const item of carWashes) {
        if (replacements[item.name]) {
            const newAddr = replacements[item.name];
            // Only update if different (ignoring old 'details required')
            if (item.address !== newAddr) {
                console.log(`Fixing ${item.name}: ${newAddr}`);
                item.address = newAddr;

                // Re-geocode
                const loc = await geocodeGoogle(newAddr);
                if (loc) {
                    item.latitude = loc.lat;
                    item.longitude = loc.lng;
                    console.log(`  -> New Coords: ${loc.lat}, ${loc.lng}`);
                    count++;
                }

                await new Promise(r => setTimeout(r, 200));
            }
        }
    }

    if (count > 0) {
        console.log(`Updated ${count} items.`);
        fs.writeFileSync(dataPath, JSON.stringify(carWashes, null, 2), 'utf-8');
    } else {
        console.log("No items needed update.");
    }
}

main();
