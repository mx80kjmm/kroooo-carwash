
import pandas as pd


file_path = 'data/carwash_db_export.csv'

# Try to detect encoding or just read with Shift-JIS
try:
    df = pd.read_csv(file_path, encoding='utf-8')
    print("Successfully read with UTF-8")
    print("Columns:", df.columns.tolist())
    if '営業時間_月' in df.columns:
        print("営業時間_月 found in columns")
        print("First row '営業時間_月':", df.iloc[0]['営業時間_月'])
    else:
        print("営業時間_月 NOT found in columns")
except Exception as e:
    print("Failed with UTF-8:", e)


