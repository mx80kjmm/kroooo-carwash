
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv'; // Load environment variables

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findMissingPlaceIds() {
    console.log('Searching for locations with missing google_place_id...');

    const { data: locations, error } = await supabase
        .from('carwash_locations')
        .select('id, name, address, latitude, longitude') // Fetch lat/long to help identification
        .is('google_place_id', null);

    if (error) {
        console.error('Error fetching locations:', error);
        return;
    }

    if (!locations || locations.length === 0) {
        console.log('No locations found without google_place_id.');
        return;
    }

    console.log(`Found ${locations.length} locations without Place ID.`);

    const reportPath = path.join(process.cwd(), 'missing_place_ids_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(locations, null, 2));
    console.log(`Report saved to ${reportPath}`);

    // CSV format for easier reading?
    const csvContent = ['id,name,address,latitude,longitude', ...locations.map(l => `${l.id},"${l.name}","${l.address}",${l.latitude},${l.longitude}`)].join('\n');
    const csvPath = path.join(process.cwd(), 'missing_place_ids_report.csv');
    fs.writeFileSync(csvPath, csvContent);
    console.log(`CSV Report saved to ${csvPath}`);
}

findMissingPlaceIds();
