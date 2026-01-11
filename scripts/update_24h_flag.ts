
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function update24hFlag() {
    console.log('Fetching records to check business hours...');

    // Fetch all rows
    const { data, error } = await supabase
        .from('carwash_locations')
        .select('id, name, business_hours, is_24h');

    if (error) {
        console.error('Error fetching data:', error.message);
        return;
    }

    if (!data) return;

    console.log(`Checking ${data.length} records...`);
    let updatedCount = 0;

    for (const row of data) {
        const hours = row.business_hours || '';
        // "24時間営業" Logic
        // Keywords: "24時間", "0:00～24:00", "00:00～24:00", "終日"
        const is24h = /24時間|0:00～24:00|00:00～24:00|終日/.test(hours);

        // Update if different from current
        // Note: is_24h might be null now if migration didn't set default? 
        // Migration didn't modify default, but existing data was boolean.
        // We set new logic: True if matches, False if not.

        if (row.is_24h !== is24h) {
            console.log(`Updating ${row.name}: ${row.is_24h} -> ${is24h} (Hours: ${hours})`);
            const { error: updateError } = await supabase
                .from('carwash_locations')
                .update({ is_24h: is24h })
                .eq('id', row.id);

            if (updateError) console.error(`Failed to update ${row.id}:`, updateError.message);
            else updatedCount++;
        }
    }

    console.log(`Update complete. Updated: ${updatedCount}`);
}

update24hFlag();
