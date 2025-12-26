
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const dataPath = path.join(process.cwd(), 'data', 'all_carwashes.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const carWashes = JSON.parse(rawData);

const candidates = [
    // Tokyo
    { name: "カーシャインプラザ 北千住", address: "東京都足立区千住関屋町" },
    { name: "カーピカランド鹿浜", address: "東京都足立区鹿浜" },
    { name: "アクアランド 足立花畑店", address: "東京都足立区花畑" },
    { name: "ワニの洗車場", address: "東京都板橋区" },
    { name: "カーウォッシュかさい", address: "東京都江戸川区" },
    { name: "環七大杉コイン洗車場", address: "東京都江戸川区大杉" },
    { name: "オートクリーンプラザ奥戸", address: "東京都葛飾区奥戸" },
    { name: "ウォッシュクリーン大泉", address: "東京都練馬区大泉" },
    { name: "コインプラザ クリーンコスモ", address: "東京都練馬区" },
    { name: "ドルフィンパーク", address: "東京都世田谷区" },
    { name: "カーウォッシュ大井", address: "東京都品川区勝島" },
    { name: "洗車のジャバ 八王子松木店", address: "東京都八王子市松木" },
    { name: "クリーンプラザ 本町田", address: "東京都町田市本町田" },
    { name: "カーピカランド桔梗", address: "東京都調布市" },

    // Kanagawa
    { name: "WASH!PLAZA", address: "神奈川県横浜市金沢区鳥浜町" },
    { name: "じゃんぼ洗車センター横浜阿久和店", address: "神奈川県横浜市瀬谷区阿久和" },
    { name: "カーピカランドWINとつか", address: "神奈川県横浜市戸塚区" },
    { name: "カーピカランド長沢", address: "神奈川県横須賀市長沢" },
    { name: "カーピカランドたまプラーザ", address: "神奈川県横浜市青葉区" },
    { name: "洗車CLUB 川崎店", address: "神奈川県川崎市高津区" },
    { name: "アイウォッシュパーク大島", address: "神奈川県相模原市緑区大島" },
    { name: "アイウォッシュパーク湘南台", address: "神奈川県藤沢市湘南台" },
    { name: "カーウォッシュプラザ ブライトン", address: "神奈川県大和市上草柳" },
    { name: "コインプラザフレッシュ", address: "神奈川県茅ヶ崎市" },
    { name: "洗車エンジェルス", address: "神奈川県相模原市南区" },

    // Saitama
    { name: "ビッグトップ武里店", address: "埼玉県さいたま市岩槻区増長" },
    { name: "旭油業コイン洗車場", address: "埼玉県さいたま市緑区大門" },
    { name: "カーピカランド中央", address: "埼玉県加須市" },
    { name: "カーピカランド大久保", address: "埼玉県さいたま市桜区大久保" },
    { name: "クリーンプラザ堀兼 BIGTOP", address: "埼玉県狭山市" },

    // Chiba
    { name: "ウォッシュアイランド みつわ台店", address: "千葉県千葉市若葉区みつわ台" },
    { name: "ウォッシュアイランド 名戸ヶ谷店", address: "千葉県柏市名戸ヶ谷" },
    { name: "ハマちゃん", address: "千葉県船橋市" },
    { name: "洗車CLUB 鷺沼台", address: "千葉県習志野市鷺沼台" },
    { name: "カーピカランド岩戸", address: "千葉県印西市岩戸" },

    // Aichi
    { name: "洗車ランド晴丘", address: "愛知県尾張旭市" },
    { name: "クリーンランド虹", address: "愛知県名古屋市緑区" },
    { name: "りんくうコイン洗車場", address: "愛知県常滑市" },
    { name: "カーランドリートップ", address: "愛知県豊川市" },
    { name: "カーピカランド米津", address: "愛知県西尾市" },
    { name: "洗車ランドオアシス五反田", address: "愛知県名古屋市中川区" },
    { name: "きらり洗車村", address: "愛知県名古屋市名東区" },
    { name: "カーピカランド ドンコ", address: "愛知県名古屋市港区" },
    { name: "洗車場 ゲー洗", address: "愛知県春日井市" },
    { name: "カーピカランド ピットイン", address: "愛知県安城市" },
    { name: "WASH GARAGE", address: "愛知県名古屋市南区" },

    // Shizuoka
    { name: "シャワーBOY渡瀬", address: "静岡県浜松市南区渡瀬" },
    { name: "Top", address: "静岡県富士市柚木" },
    { name: "カーシャンランドアーク", address: "静岡県静岡市清水区" },
    { name: "カーウォッシュSUN", address: "静岡県御殿場市" },
    { name: "コイン洗車城北", address: "静岡県静岡市葵区城北" },
    { name: "ウォッシャーランドKUNOU", address: "静岡県富士市柚木" },
    { name: "セルフ24 長泉なめり店", address: "静岡県駿東郡長泉町納米里" }
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

        const geo = await geocodeGoogle(item.address + " コイン洗車場"); // Trick to help google find specific place? Or just address
        // Try just address first, if fails try name
        let geoRes = await geocodeGoogle(item.address);

        // If address is vague (just city), try searching by Name
        if (!geoRes || item.address.split(/県|都|府/).length < 2) {
            const nameSearch = await geocodeGoogle(item.address + " " + item.name);
            if (nameSearch) geoRes = nameSearch;
        }

        if (geoRes) {
            lat = geoRes.lat;
            lng = geoRes.lng;
            console.log(`  -> Geocoded: ${lat}, ${lng} (${geoRes.formatted})`);
            if (geoRes.formatted.includes("日本") && geoRes.formatted.length > 10) {
                finalAddr = geoRes.formatted.replace(/^日本、/, '');
            }
        } else {
            // Try Name Only as fallback
            const nameOnlyGeo = await geocodeGoogle(item.name);
            if (nameOnlyGeo) {
                lat = nameOnlyGeo.lat;
                lng = nameOnlyGeo.lng;
                finalAddr = nameOnlyGeo.formatted.replace(/^日本、/, '');
                console.log(`  -> Geocoded by Name: ${lat}, ${lng} (${finalAddr})`);
            } else {
                console.log("  -> Geocode Failed");
            }
        }

        const newEntry = {
            name: item.name,
            address: finalAddr,
            hours: "不明",
            equipment: { high_pressure_washer: true },
            price_estimated: "不明",
            url: "",
            x_post_url: "",
            notes: "全国リサーチ追加 (首都圏・東海編)",
            latitude: lat,
            longitude: lng
        };

        carWashes.push(newEntry);
        addedCount++;

        await new Promise(r => setTimeout(r, 200));
    }

    if (addedCount > 0) {
        fs.writeFileSync(dataPath, JSON.stringify(carWashes, null, 2), 'utf-8');
        console.log(`✅ Added ${addedCount} new locations in Shutoken/Tokai.`);
    } else {
        console.log("No new locations added.");
    }
}

main();
