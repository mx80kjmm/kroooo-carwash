
import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const keyFileName = 'self-car-cleaning-fc945012f3ff.json';
const keyFilePath = path.join(process.cwd(), keyFileName);

async function fetchSearchConsoleData() {
    console.log("🚀 Starting Search Console Data Fetch...");

    // Authenticate
    const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });

    // Site URL (Try sc-domain:kroooo.com if it's a Domain Property, otherwise https://kroooo.com/)
    // Let's assume sc-domain:kroooo.com for now based on typical setup
    const siteUrl = 'sc-domain:kroooo.com';

    console.log(`Querying data for: ${siteUrl}`);

    try {
        const res = await searchconsole.searchanalytics.query({
            siteUrl: siteUrl,
            requestBody: {
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
                endDate: new Date().toISOString().split('T')[0], // Today
                dimensions: ['query', 'page'],
                rowLimit: 10,
                // ordering: [{ dimension: 'clicks', direction: 'DESCENDING' }] // this might be optional or typed strictly
            } as any,
        });

        const rows = res.data.rows;

        if (!rows || rows.length === 0) {
            console.log("⚠️ No data found. (Or maybe permissions issue?)");
            console.log("Check if the service account is added to the Search Console property.");
            return;
        }

        console.log("\n📊 Search Performance (Last 7 Days):");
        console.log("----------------------------------------------------------------");
        console.log(String("Query").padEnd(30) + String("Clicks").padEnd(10) + String("Imp.").padEnd(10) + String("CTR").padEnd(10) + String("Pos."));
        console.log("----------------------------------------------------------------");

        rows.forEach(row => {
            const query = (row.keys && row.keys[0]) ? row.keys[0] : '(anon)';
            const clicks = row.clicks || 0;
            const impressions = row.impressions || 0;
            const ctr = (row.ctr ? (row.ctr * 100).toFixed(2) + '%' : '0%');
            const position = row.position ? row.position.toFixed(1) : '-';

            // Truncate long queries
            const displayQuery = query.length > 28 ? query.substring(0, 25) + '...' : query;

            console.log(
                displayQuery.padEnd(30) +
                String(clicks).padEnd(10) +
                String(impressions).padEnd(10) +
                String(ctr).padEnd(10) +
                String(position)
            );
        });
        console.log("----------------------------------------------------------------");

    } catch (error: any) {
        console.error("❌ Error fetching data:", error.message);
        if (error.errors) {
            console.error("Details:", JSON.stringify(error.errors, null, 2));
        }

        if (error.code === 403) {
            console.error("\n💡 Hint: Permission denied. Please ensure the service account email is added to the Search Console property as a User.");
            console.error("Email: 713817588175-compute@developer.gserviceaccount.com");
        }
    }
}

fetchSearchConsoleData();
