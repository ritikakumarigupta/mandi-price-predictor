import os
import random
from datetime import datetime, timedelta
import pandas as pd

CROPS = ["Wheat", "Paddy(Dhan)(Common)", "Onion", "Potato"]
MANDIS = [
    {"state": "Bihar", "district": "Patna", "market": "Patna City", "lat": 25.5941, "lon": 85.1376},
    {"state": "Bihar", "district": "Patna", "market": "Khagaul", "lat": 25.5786, "lon": 85.0442},
    {"state": "Bihar", "district": "Muzaffarpur", "market": "Muzaffarpur", "lat": 26.1209, "lon": 85.3647},
    {"state": "Bihar", "district": "Gaya", "market": "Gaya", "lat": 24.7955, "lon": 84.9994},
]

BASE_RATES = {
    "Wheat": 2400,
    "Paddy(Dhan)(Common)": 2250,
    "Onion": 1800,
    "Potato": 1400,
}

def generate_historical_mandi_data(days=365):
    """
    Simulates raw data.gov.in / Agmarknet API records including realistic artifacts:
    - closed Sundays (missing days)
    - price seasonal trends
    - slight variations across mandis
    """
    records = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    current_date = start_date
    while current_date <= end_date:
        # APMC mandis are closed on Sunday
        if current_date.weekday() != 6:
            day_num = (current_date - start_date).days
            for mandi in MANDIS:
                for crop in CROPS:
                    base = BASE_RATES[crop]
                    # Seasonality wave
                    seasonal = 150 * (day_num / 60) if crop == "Wheat" else 200 * (1 - (day_num % 120) / 120)
                    noise = random.randint(-40, 40)
                    modal = int(base + seasonal + noise)
                    min_p = modal - random.randint(50, 100)
                    max_p = modal + random.randint(60, 120)
                    
                    records.append({
                        "state": mandi["state"],
                        "district": mandi["district"],
                        "market": mandi["market"],
                        "commodity": crop,
                        "variety": "Other",
                        "arrival_date": current_date.strftime("%d/%m/%Y"),
                        "min_price": min_p,
                        "max_price": max_p,
                        "modal_price": modal
                    })
        current_date += timedelta(days=1)

    df = pd.DataFrame(records)
    out_path = os.path.join("data", "raw_agmarknet_bihar.csv")
    df.to_csv(out_path, index=False)
    print(f"Generated {len(df)} raw records saved to {out_path}")

if __name__ == "__main__":
    generate_historical_mandi_data()
