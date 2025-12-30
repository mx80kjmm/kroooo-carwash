
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteDuplicates() {
    console.log('Deleting duplicate records...');

    // These locations failed update because a record with the same Place ID already exists.
    // We will delete these 'incomplete' records (which have no Place ID) in favor of the existing ones.
    const duplicatesToDelete = [
        'カーピカランド緑地北',
        'シャワーBOY渡瀬'
    ];

    for (const name of duplicatesToDelete) {
        // Find the record with this name AND no google_place_id
        const { data: records, error: fetchError } = await supabase
            .from('carwash_locations')
            .select('id, name')
            .eq('name', name)
            .is('google_place_id', null);

        if (fetchError) {
            console.error(`Error fetching ${name}:`, fetchError);
            continue;
        }

        if (records && records.length > 0) {
            for (const record of records) {
                console.log(`Deleting duplicate: ${record.name} (ID: ${record.id})`);
                const { error: deleteError } = await supabase
                    .from('carwash_locations')
                    .delete()
                    .eq('id', record.id);

                if (deleteError) {
                    console.error(`Failed to delete ${record.id}:`, deleteError);
                } else {
                    console.log(`Deleted ${record.id}`);
                }
            }
        } else {
            console.log(`No incomplete duplicate found for ${name}`);
        }
    }
}

deleteDuplicates();
