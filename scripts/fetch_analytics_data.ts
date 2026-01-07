
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize client
// By default, it looks for GOOGLE_APPLICATION_CREDENTIALS environment variable
// pointing to the JSON key file.
const analyticsDataClient = new BetaAnalyticsDataClient();

async function runReport() {
    const propertyId = process.env.GA4_PROPERTY_ID;

    if (!propertyId) {
        console.error('❌ Error: GA4_PROPERTY_ID is not defined in .env.local');
        console.error('Please find your numeric Property ID in GA4 Admin settings.');
        process.exit(1);
    }

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn('⚠️ Warning: GOOGLE_APPLICATION_CREDENTIALS is not set.');
        console.warn('Ensure it points to your service-account.json file, or place the file in the default location.');
    }

    console.log(`Fetching data for Property ID: ${propertyId}...`);

    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                {
                    name: 'pagePath',
                },
            ],
            metrics: [
                {
                    name: 'screenPageViews', // or 'screenPageViews' for generic, 'activeUsers', 'sessions'
                },
                {
                    name: 'sessions',
                }
            ],
            orderBys: [
                {
                    metric: {
                        metricName: 'screenPageViews',
                    },
                    desc: true,
                }
            ]
        });

        console.log('Report result (Top Pages):');

        if (!response.rows || response.rows.length === 0) {
            console.log("No data found.");
        }

        response.rows?.forEach(row => {
            const pagePath = row.dimensionValues?.[0].value;
            const views = row.metricValues?.[0].value;
            const sessions = row.metricValues?.[1].value;
            console.log(`Page: ${pagePath}, Views: ${views}, Sessions: ${sessions}`);
        });

    } catch (error: any) {
        console.error('❌ Failed to fetch data:', error.message);
        if (error.message.includes('Project ID is not defined')) {
            console.error('Hint: Make sure GOOGLE_APPLICATION_CREDENTIALS points to a valid JSON key file.');
        }
    }
}

runReport();
