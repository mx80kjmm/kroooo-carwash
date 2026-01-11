
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir);

const versions = files
    .filter(f => f.match(/^\d+_/))
    .map(f => f.split('_')[0])
    .filter(v => v !== '20260111111637'); // Exclude the new one

console.log(`Found ${versions.length} migrations to repair...`);

versions.forEach(version => {
    try {
        console.log(`Repairing ${version}...`);
        execSync(`npx supabase migration repair --status applied ${version} --linked`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to repair ${version}`);
    }
});

console.log('Repair complete.');
