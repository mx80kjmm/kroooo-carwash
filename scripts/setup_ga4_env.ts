
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Configure paths
const envPath = path.join(process.cwd(), '.env.local');
const keyFileName = 'self-car-cleaning-fc945012f3ff.json';
const keyFilePath = path.join(process.cwd(), keyFileName);

// Load current env
dotenv.config({ path: envPath });

async function setup() {
    console.log("🚀 Starting GA4 Setup...");

    if (!fs.existsSync(keyFilePath)) {
        console.error(`❌ Key file not found at: ${keyFilePath}`);
        process.exit(1);
    }

    // 1. Update .env.local with Credentials path if missing
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
    let updatedEnv = false;

    if (!envContent.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
        console.log("📝 Adding GOOGLE_APPLICATION_CREDENTIALS to .env.local...");
        // Use relative path for portability or absolute? Absolute is safer for scripts run from anywhere.
        // But .env usually likes relative? standard is often relative to app root.
        // Let's use "./filename" as it is in root.
        envContent += `\nGOOGLE_APPLICATION_CREDENTIALS="./${keyFileName}"\n`;
        updatedEnv = true;
    }

    // Temporarily set for this process
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;

    // 2. Find Property ID
    console.log("🔍 Searching for GA4 Properties...");
    const adminClient = new AnalyticsAdminServiceClient();

    let foundPropertyId = '';

    try {
        // listAccountSummaries gives us Account -> Property summaries
        const [response] = await adminClient.listAccountSummaries({
            pageSize: 100
        });

        console.log(`Found ${response.length} accounts/summaries.`);

        for (const summary of response) {
            console.log(`Account: ${summary.displayName} (${summary.name})`);
            if (summary.propertySummaries) {
                for (const prop of summary.propertySummaries) {
                    // prop.property is like "properties/123456789"
                    const pId = prop.property?.split('/').pop();
                    console.log(`  - Property: ${prop.displayName} (ID: ${pId})`);

                    // Identify the right one? 
                    // If multiple, maybe pick the one matching "kroooo.com" or just the first?
                    // Or "kroooo"
                    if (!foundPropertyId) {
                        foundPropertyId = pId || '';
                    }
                    if (prop.displayName?.toLowerCase().includes('kroooo')) {
                        foundPropertyId = pId || foundPropertyId;
                    }
                }
            }
        }
    } catch (error: any) {
        console.error("❌ Failed to list properties:", error.message);
        console.log("Please ensure the Service Account email is added to the GA4 Property user management.");
    }

    // 3. Update .env.local with Property ID
    if (foundPropertyId) {
        console.log(`✅ Identified Property ID: ${foundPropertyId}`);
        if (!envContent.includes('GA4_PROPERTY_ID')) {
            console.log("📝 Adding GA4_PROPERTY_ID to .env.local...");
            envContent += `GA4_PROPERTY_ID="${foundPropertyId}"\n`;
            updatedEnv = true;
        } else {
            // Maybe verify it matches?
            console.log("ℹ️ GA4_PROPERTY_ID already exists in .env.local. Skipping update.");
        }
    } else {
        console.warn("⚠️ No Property ID found or accessible. Please add the service account email to GA4 Admin.");
    }

    if (updatedEnv) {
        fs.writeFileSync(envPath, envContent, 'utf-8');
        console.log("💾 .env.local updated.");
    } else {
        console.log("No changes needed for .env.local.");
    }
}

setup();
