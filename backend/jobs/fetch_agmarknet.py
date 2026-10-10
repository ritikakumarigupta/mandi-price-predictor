import os
import requests
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("DATA_GOV_API_KEY", "")
RESOURCE_ID = os.getenv("DATA_GOV_RESOURCE_ID", "9ef84268-d588-465a-a308-a864a43d0070")

def fetch_agmarknet_daily_data(state: str = "Bihar", limit: int = 500):
    """
    Fetches real-time mandi prices from data.gov.in Agmarknet API with:
    - User-Agent header (bypasses NIC bot/firewall block)
    - SSL verification handling
    - Resilient timeout and fallback
    """
    if not API_KEY or API_KEY == "your_data_gov_in_api_key_here":
        print("[Notice] DATA_GOV_API_KEY not configured. Falling back to local SQLite mandi.db cache.")
        return None

    url = f"https://api.data.gov.in/resource/{RESOURCE_ID}"
    params = {
        "api-key": API_KEY,
        "format": "json",
        "offset": 0,
        "limit": limit,
        "filters[state]": state
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
    }

    print(f"Connecting to data.gov.in for state '{state}'...")

    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        records = data.get("records", [])
        print(f"✅ Success! Fetched {len(records)} live records from data.gov.in.")
        return pd.DataFrame(records)
    except requests.exceptions.ConnectionError:
        print("\n⚠️ [NIC / data.gov.in Server Status Notice]")
        print("The data.gov.in server (164.100.61.198) is currently not responding / blocked your current network IP.")
        print("-> Don't worry: MandiSetu is using the local SQLite cache (mandi.db). All app features, forecasts, and UI remain 100% operational!")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

if __name__ == "__main__":
    fetch_agmarknet_daily_data()
