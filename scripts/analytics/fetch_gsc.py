
import os
import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
import pandas as pd

# 認証設定
KEY_FILE_PATH = 'service-account.json'
SITE_URL = 'https://kroooo.com/'

def get_gsc_service():
    if not os.path.exists(KEY_FILE_PATH):
        print(f"Error: {KEY_FILE_PATH} not found.")
        return None
    try:
        creds = service_account.Credentials.from_service_account_file(
            KEY_FILE_PATH, scopes=['https://www.googleapis.com/auth/webmasters.readonly']
        )
        return build('searchconsole', 'v1', credentials=creds)
    except Exception as e:
        print(f"Auth Error: {e}")
        return None

def fetch_search_analytics(days=3):
    service = get_gsc_service()
    if not service:
        return None

    end_date = datetime.date.today() - datetime.timedelta(days=2) # GSC data availability lag
    start_date = end_date - datetime.timedelta(days=days)
    
    request = {
        'startDate': start_date.strftime('%Y-%m-%d'),
        'endDate': end_date.strftime('%Y-%m-%d'),
        'dimensions': ['query'],
        'rowLimit': 20
    }

    try:
        response = service.searchanalytics().query(siteUrl=SITE_URL, body=request).execute()
        rows = response.get('rows', [])
        
        if not rows:
            print("No GSC data found.")
            return []
            
        return rows
    except Exception as e:
        print(f"GSC API Error: {e}")
        return []

def main():
    print("Fetching GSC Data...")
    data = fetch_search_analytics()
    if data:
        df = pd.DataFrame(data)
        print(df[['keys', 'clicks', 'impressions', 'ctr', 'position']].to_markdown())

if __name__ == '__main__':
    main()
