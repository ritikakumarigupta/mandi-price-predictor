import os
import random
from datetime import datetime, timedelta
import pandas as pd

# All Major Agricultural States of India
STATES_DATA = [
    {
        "state": "Bihar",
        "districts": [
            {"district": "Patna", "market": "Patna City", "lat": 25.5941, "lon": 85.1376},
            {"district": "Patna", "market": "Khagaul", "lat": 25.5786, "lon": 85.0442},
            {"district": "Muzaffarpur", "market": "Muzaffarpur", "lat": 26.1209, "lon": 85.3647},
            {"district": "Gaya", "market": "Gaya", "lat": 24.7955, "lon": 84.9994},
        ]
    },
    {
        "state": "Uttar Pradesh",
        "districts": [
            {"district": "Varanasi", "market": "Varanasi Main Yard", "lat": 25.3176, "lon": 82.9739},
            {"district": "Lucknow", "market": "Lucknow APMC", "lat": 26.8467, "lon": 80.9462},
            {"district": "Gorakhpur", "market": "Gorakhpur Mandi", "lat": 26.7606, "lon": 83.3732},
        ]
    },
    {
        "state": "Madhya Pradesh",
        "districts": [
            {"district": "Indore", "market": "Indore Krishi Upaj", "lat": 22.7196, "lon": 75.8577},
            {"district": "Bhopal", "market": "Bhopal APMC", "lat": 23.2599, "lon": 77.4126},
        ]
    },
    {
        "state": "Punjab",
        "districts": [
            {"district": "Ludhiana", "market": "Ludhiana Dana Mandi", "lat": 30.9010, "lon": 75.8573},
            {"district": "Amritsar", "market": "Amritsar Bhagtanwala Mandi", "lat": 31.6340, "lon": 74.8723},
        ]
    },
    {
        "state": "Haryana",
        "districts": [
            {"district": "Karnal", "market": "Karnal New Grain Market", "lat": 29.6857, "lon": 76.9905},
            {"district": "Hisar", "market": "Hisar Mandi", "lat": 29.1492, "lon": 75.7217},
        ]
    },
    {
        "state": "Maharashtra",
        "districts": [
            {"district": "Nashik", "market": "Lasalgaon Onion Market", "lat": 20.1477, "lon": 74.2259},
            {"district": "Pune", "market": "Pune Gultekdi APMC", "lat": 18.5204, "lon": 73.8567},
        ]
    },
    {
        "state": "Rajasthan",
        "districts": [
            {"district": "Jaipur", "market": "Muhana Mandi Jaipur", "lat": 26.9124, "lon": 75.7873},
            {"district": "Kota", "market": "Kota Bhamashah Mandi", "lat": 25.2138, "lon": 75.8648},
        ]
    },
    {
        "state": "Jharkhand",
        "districts": [
            {"district": "Ranchi", "market": "Ranchi Pandra Krishi Bazar", "lat": 23.3728, "lon": 85.3216},
            {"district": "Dhanbad", "market": "Dhanbad APMC Bazar Samiti", "lat": 23.7957, "lon": 86.4304},
            {"district": "East Singhbhum", "market": "Jamshedpur Parsudih Mandi", "lat": 22.8046, "lon": 86.2029},
        ]
    }
]

CROPS = ["Wheat", "Paddy", "Onion", "Potato", "Mustard", "Maize"]

BASE_RATES = {
    "Wheat": 2450,
    "Paddy": 2280,
    "Onion": 1850,
    "Potato": 1420,
    "Mustard": 5350,
    "Maize": 2150,
}

def generate_all_india_mandi_data(days=365):
    records = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    print("Generating comprehensive multi-state Agmarknet time-series records...")

    current_date = start_date
    while current_date <= end_date:
        if current_date.weekday() != 6:  # Mandis closed on Sunday
            day_num = (current_date - start_date).days
            for st in STATES_DATA:
                state_name = st["state"]
                for mandi in st["districts"]:
                    for crop in CROPS:
                        base = BASE_RATES[crop]
                        # Seasonal fluctuations
                        seasonal = 140 * (day_num / 60) if crop == "Wheat" else 180 * (1 - (day_num % 120) / 120)
                        noise = random.randint(-40, 40)
                        modal = int(base + seasonal + noise)
                        min_p = modal - random.randint(50, 100)
                        max_p = modal + random.randint(60, 120)

                        records.append({
                            "state": state_name,
                            "district": mandi["district"],
                            "market": mandi["market"],
                            "commodity": crop,
                            "arrival_date": current_date.strftime("%d/%m/%Y"),
                            "min_price": min_p,
                            "max_price": max_p,
                            "modal_price": modal,
                        })
        current_date += timedelta(days=1)

    df = pd.DataFrame(records)
    out_path = os.path.join("data", "raw_agmarknet_all_states.csv")
    df.to_csv(out_path, index=False)
    print(f"Generated {len(df)} records across {len(STATES_DATA)} Indian states! Saved to {out_path}")

if __name__ == "__main__":
    generate_all_india_mandi_data()
