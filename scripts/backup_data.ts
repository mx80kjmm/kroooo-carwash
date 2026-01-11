
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { format } from 'date-fns';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backupData() {
    console.log('Fetching all records for backup...');

    // Fetch all rows
    const { data, error } = await supabase
        .from('carwash_locations')
        .select('*');

    if (error) {
        console.error('Error fetching data:', error.message);
        return;
    }

    if (!data) {
        console.log('No data found.');
        return;
    }

    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const filename = `carwash_backup_${timestamp}.json`;
    const backupPath = path.join(process.cwd(), 'backups');

    if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath);
    }

    const fullPath = path.join(backupPath, filename);

    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Backup saved to ${fullPath}`);
    console.log(`Total records: ${data.length}`);
}

backupData();
