import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local を読み込む
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !googleMapsApiKey) {
    console.error('Missing environment variables');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
    console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:', !!googleMapsApiKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fetchPlaceId(name: string, address: string, latitude?: number, longitude?: number) {
    // 住所と名前で検索（住所を先にすることで精度向上を期待）
    const query = `${address} ${name}`;
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${googleMapsApiKey}&language=ja`;

    if (latitude && longitude) {
        url += `&location=${latitude},${longitude}&radius=50`;
        console.log(`Using location bias: ${latitude}, ${longitude}`);
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            // 最も関連性の高い結果を採用
            const place = data.results[0];
            return {
                place_id: place.place_id,
                rating: place.rating,
                user_ratings_total: place.user_ratings_total,
            };
        } else {
            console.warn(`No results for: ${name} (Status: ${data.status})`);
            if (data.error_message) {
                console.error(`API Error: ${data.error_message}`);
            }
            return null;
        }
    } catch (error) {
        console.error(`Error fetching place for ${name}:`, error);
        return null;
    }
}

async function main() {
    console.log('Fetching locations without google_place_id...');

    // google_place_id が未設定のレコードを取得
    const { data: locations, error } = await supabase
        .from('carwash_locations')
        .select('id, name, address, latitude, longitude')
        .is('google_place_id', null);

    if (error) {
        console.error('Error fetching locations:', error);
        return;
    }

    if (!locations || locations.length === 0) {
        console.log('No locations found needing update.');
        return;
    }

    console.log(`Found ${locations.length} locations to update.`);

    let successCount = 0;
    let failureCount = 0;

    for (const location of locations) {
        console.log(`Processing [${successCount + failureCount + 1}/${locations.length}]: ${location.name}...`);
        const placeData = await fetchPlaceId(location.name, location.address, location.latitude, location.longitude);

        if (placeData) {
            const { error: updateError } = await supabase
                .from('carwash_locations')
                .update({
                    google_place_id: placeData.place_id,
                    google_rating: placeData.rating,
                    google_user_ratings_total: placeData.user_ratings_total,
                })
                .eq('id', location.id);

            if (updateError) {
                console.error(`Failed to update ${location.name}:`, updateError);
                failureCount++;
            } else {
                console.log(`  -> Updated: Rating ${placeData.rating} (${placeData.user_ratings_total} reviews)`);
                successCount++;
            }
        } else {
            failureCount++;
        }

        // APIレートリミット考慮 (連続アクセスを防ぐ)
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('------------------------------------------------');
    console.log(`Processing Complete.`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed/Not Found: ${failureCount}`);
}

main();
