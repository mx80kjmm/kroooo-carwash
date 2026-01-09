
import os
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)

# 認証設定
KEY_FILE_PATH = 'service-account.json'
# GA4 Property ID (User needs to replace this or we find it dynamically? Hardcode placeholder for now)
PROPERTY_ID = '517560444' 

def fetch_ga4_report():
    if not os.path.exists(KEY_FILE_PATH):
        print(f"Error: {KEY_FILE_PATH} not found.")
        return

    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = KEY_FILE_PATH

    client = BetaAnalyticsDataClient()

    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="city")],
        metrics=[Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
    )
    
    try:
        response = client.run_report(request)
        print("GA4 Report (Last 7 Days by City):")
        for row in response.rows:
            print(f"{row.dimension_values[0].value}: {row.metric_values[0].value}")
            
    except Exception as e:
        print(f"GA4 API Error: {e}")

if __name__ == '__main__':
    # Need to prompt user for Property ID if not set
    if PROPERTY_ID == 'YOUR_GA4_PROPERTY_ID':
         print("Please update PROPERTY_ID in the script.")
    else:
        fetch_ga4_report()
