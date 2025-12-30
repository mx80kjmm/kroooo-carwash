
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !googleMapsApiKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fetchGoogleReviews() {
    console.log('Fetching Google Reviews...');

    // Get locations with place_id but no reviews (or update all if needed)
    // For now, let's fetch all active locations with a place_id
    const { data: locations, error } = await supabase
        .from('carwash_locations')
        .select('id, name, google_place_id')
        .not('google_place_id', 'is', null)
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching locations:', error);
        return;
    }

    console.log(`Found ${locations.length} locations with Place IDs.`);

    let validCount = 0;

    for (const [index, loc] of locations.entries()) {
        if (!loc.google_place_id) continue;

        console.log(`[${index + 1}/${locations.length}] Fetching reviews for ${loc.name}...`);

        // Google Place Details API
        // fields=reviews to get up to 5 reviews
        // language=ja
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${loc.google_place_id}&fields=reviews&language=ja&key=${googleMapsApiKey}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.status === 'OK') {
                const reviews = data.result.reviews || [];

                if (reviews.length > 0) {
                    console.log(`   -> Found ${reviews.length} reviews.`);

                    // Update DB
                    const { error: updateError } = await supabase
                        .from('carwash_locations')
                        .update({ google_reviews: reviews })
                        .eq('id', loc.id);

                    if (updateError) {
                        console.error('   -> DB Update Failed:', updateError);
                    } else {
                        validCount++;
                    }
                } else {
                    console.log('   -> No reviews found.');
                }
            } else {
                console.error(`   -> API Error: ${data.status}`, data.error_message);
            }

        } catch (fetchError) {
            console.error('   -> Fetch Error:', fetchError);
        }

        // Small delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`Done! Updated reviews for ${validCount} locations.`);
}

fetchGoogleReviews();
