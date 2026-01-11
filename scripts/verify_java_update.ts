
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function verify() {
    // Check '洗車のジャバ 西成岸里店'
    const { data, error } = await supabase
        .from('carwash_locations')
        .select('*')
        .like('name', '%西成岸里%')
        .single();

    console.log(data || error);
}

verify();
