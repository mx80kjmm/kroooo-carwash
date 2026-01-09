
import sys
import os

# Ensure we can import from the same directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import fetch_gsc
    import fetch_ga4
except ImportError:
    print("Module import failed. Run from root or check paths.")

def generate_site_report():
    print("=== Kroooo.com Site Report ===\n")
    
    # GSC
    print("--- Search Performance (Last 3 Days) ---")
    fetch_gsc.main()
    print("\n")

    # GA4
    print("--- User Activity (Last 7 Days) ---")
    fetch_ga4.main()
    print("\n")
    
    print("=== End of Report ===")

if __name__ == '__main__':
    generate_site_report()
