
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDescriptions() {
    const { count, error } = await supabase
        .from('carwash_locations')
        .select('*', { count: 'exact', head: true })
        .not('description', 'is', null);

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Locations with description: ${count}`);

    // Check total
    const { count: total } = await supabase
        .from('carwash_locations')
        .select('*', { count: 'exact', head: true });

    console.log(`Total locations: ${total}`);
}

checkDescriptions();
