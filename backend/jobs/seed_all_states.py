import os
import pandas as pd
from datetime import datetime
from backend.app.database import engine, init_db, MandiPriceRecord, SessionLocal
from backend.jobs.cleaner import clean_and_impute_mandi_data

def populate_all_india_database():
    init_db()
    raw_path = os.path.join("data", "raw_agmarknet_all_states.csv")
    raw_df = pd.read_csv(raw_path)
    
    print("Cleaning and standardizing all states...")
    cleaned_df = clean_and_impute_mandi_data(raw_df)
    cleaned_df.to_csv(os.path.join("data", "cleaned_mandi_data.csv"), index=False)
    
    cleaned_df["date"] = pd.to_datetime(cleaned_df["date"]).dt.date

    db = SessionLocal()
    # Clear old single-state records
    db.query(MandiPriceRecord).delete()
    db.commit()

    print(f"Inserting {len(cleaned_df)} continuous records for all states into SQLite mandi.db...")
    records = []
    for _, row in cleaned_df.iterrows():
        records.append(
            MandiPriceRecord(
                state=row["state"],
                district=row["district"],
                market=row["market_clean"],
                commodity=row["commodity_clean"],
                date=row["date"],
                min_price=float(row["min_price"]),
                max_price=float(row["max_price"]),
                modal_price=float(row["modal_price"]),
            )
        )

    db.bulk_save_objects(records)
    db.commit()
    print("SUCCESS: All states successfully seeded into SQLite!")
    db.close()

if __name__ == "__main__":
    populate_all_india_database()
