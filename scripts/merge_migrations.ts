
import fs from 'fs';
import path from 'path';

const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir);

// Group by version prefix
const versionMap: Record<string, string[]> = {};

files.forEach(f => {
    const match = f.match(/^(\d+)_/);
    if (match) {
        const version = match[1];
        if (!versionMap[version]) versionMap[version] = [];
        versionMap[version].push(f);
    }
});

Object.keys(versionMap).forEach(version => {
    const group = versionMap[version];
    if (group.length > 1) {
        console.log(`Merging version ${version}: ${group.join(', ')}`);

        // Read all content
        let combinedContent = '';
        group.forEach(file => {
            const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
            combinedContent += `-- Source: ${file}\n${content}\n\n`;
        });

        // Write to new merged file
        const newFilename = `${version}_merged.sql`;
        fs.writeFileSync(path.join(migrationsDir, newFilename), combinedContent);

        // Delete original files
        group.forEach(file => {
            fs.unlinkSync(path.join(migrationsDir, file));
        });

        console.log(`Created ${newFilename}`);
    } else {
        console.log(`Version ${version} has single file.`);
    }
});
