import pandas as pd
import numpy as np
from datetime import datetime

# Standardization dictionary for inconsistent crop names
COMMODITY_MAPPING = {
    "wheat": "Wheat",
    "gehun": "Wheat",
    "paddy(dhan)(common)": "Paddy",
    "paddy": "Paddy",
    "rice": "Paddy",
    "dhan": "Paddy",
    "onion": "Onion",
    "pyaj": "Onion",
    "potato": "Potato",
    "aloo": "Potato"
}

MARKET_MAPPING = {
    "patna city": "Patna City",
    "patna": "Patna City",
    "khagaul": "Khagaul",
    "muzaffarpur": "Muzaffarpur",
    "gaya": "Gaya",
}

def clean_and_impute_mandi_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw Agmarknet records according to project requirements:
    1. Standardize text cases and mappings for crops & mandis.
    2. Convert arrival_date to standard datetime.
    3. Filter out invalid/negative/zero prices.
    4. Remove duplicate entries.
    5. Handle missing days (e.g. closed Sundays/holidays) via continuous forward-fill imputation.
    """
    df = df.copy()

    # 1. Clean strings
    df["commodity_clean"] = df["commodity"].astype(str).str.strip().str.lower().map(COMMODITY_MAPPING).fillna(df["commodity"])
    df["market_clean"] = df["market"].astype(str).str.strip().str.lower().map(MARKET_MAPPING).fillna(df["market"])

    # 2. Date parsing
    df["date"] = pd.to_datetime(df["arrival_date"], format="%d/%m/%Y", errors="coerce")
    df = df.dropna(subset=["date"])

    # 3. Numeric price validation
    for col in ["min_price", "max_price", "modal_price"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    
    # Drop rows where modal_price <= 0 or NaN
    df = df[df["modal_price"] > 0]
    
    # Min should not exceed Max; correct if flipped
    df["valid_min"] = np.minimum(df["min_price"], df["max_price"])
    df["valid_max"] = np.maximum(df["min_price"], df["max_price"])
    df["min_price"] = df["valid_min"]
    df["max_price"] = df["valid_max"]
    df = df.drop(columns=["valid_min", "valid_max"])

    # 4. Remove duplicate date-mandi-commodity records
    df = df.sort_values(by=["date"]).drop_duplicates(subset=["date", "market_clean", "commodity_clean"], keep="last")

    # 5. Continuous time-series imputation per (market, commodity) pair
    cleaned_groups = []
    for (mkt, cmd), group in df.groupby(["market_clean", "commodity_clean"]):
        group = group.set_index("date").sort_index()
        # Create full continuous daily range
        full_idx = pd.date_range(start=group.index.min(), end=group.index.max(), freq="D")
        group_reindexed = group.reindex(full_idx)
        
        # Forward fill modal price for closed days (Sundays/holidays)
        group_reindexed["modal_price"] = group_reindexed["modal_price"].ffill().bfill()
        group_reindexed["min_price"] = group_reindexed["min_price"].ffill().bfill()
        group_reindexed["max_price"] = group_reindexed["max_price"].ffill().bfill()
        
        group_reindexed["market_clean"] = mkt
        group_reindexed["commodity_clean"] = cmd
        group_reindexed["state"] = group["state"].iloc[0]
        group_reindexed["district"] = group["district"].iloc[0]
        
        group_reindexed = group_reindexed.reset_index().rename(columns={"index": "date"})
        cleaned_groups.append(group_reindexed)

    result_df = pd.concat(cleaned_groups, ignore_index=True)
    return result_df

if __name__ == "__main__":
    raw = pd.read_csv("data/raw_agmarknet_bihar.csv")
    cleaned = clean_and_impute_mandi_data(raw)
    cleaned.to_csv("data/cleaned_mandi_data.csv", index=False)
    print(f"Cleaned dataset created with {len(cleaned)} continuous daily observations.")
