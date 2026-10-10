import os
import pandas as pd
from datetime import datetime
from backend.app.database import engine, init_db, MandiPriceRecord, SessionLocal

def seed_database_from_cleaned_csv():
    init_db()
    csv_path = os.path.join("data", "cleaned_mandi_data.csv")
    if not os.path.exists(csv_path):
        print(f"File {csv_path} does not exist.")
        return

    df = pd.read_csv(csv_path)
    df["date"] = pd.to_datetime(df["date"]).dt.date

    db = SessionLocal()
    # Check if records already exist
    existing_count = db.query(MandiPriceRecord).count()
    if existing_count > 0:
        print(f"Database already populated with {existing_count} records.")
        db.close()
        return

    records = []
    for _, row in df.iterrows():
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
    print(f"Successfully seeded database with {len(records)} continuous mandi records into SQLite/mandi.db!")
    db.close()

if __name__ == "__main__":
    seed_database_from_cleaned_csv()
