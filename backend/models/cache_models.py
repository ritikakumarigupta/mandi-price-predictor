import os
import joblib
import pandas as pd
from typing import Dict, Any
from backend.models.forecaster import MandiForecaster
from backend.app.database import SessionLocal, MandiPriceRecord

WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), "weights")
os.makedirs(WEIGHTS_DIR, exist_ok=True)

def train_and_cache_all_models():
    """
    Pre-trains forecasting models for all market-commodity pairs in the database.
    Saves trained parameters to disk so API response times drop from ~500ms to <10ms.
    """
    db = SessionLocal()
    records = db.query(MandiPriceRecord).all()
    db.close()

    if not records:
        print("No database records found to train on.")
        return

    df = pd.DataFrame([{
        "market": r.market,
        "commodity": r.commodity,
        "date": r.date,
        "modal_price": r.modal_price
    } for r in records])

    print(f"Loaded {len(df)} records from SQLite database.")

    forecaster = MandiForecaster(holdout_days=30)
    cached_count = 0

    for (mkt, cmd), group in df.groupby(["market", "commodity"]):
        group = group.sort_values(by="date")
        if len(group) >= 44:
            eval_result = forecaster.train_and_evaluate(group)
            
            # Key sanitized for filename
            key = f"{mkt.replace(' ', '_').lower()}__{cmd.replace(' ', '_').lower()}.pkl"
            save_path = os.path.join(WEIGHTS_DIR, key)
            
            joblib.dump(eval_result, save_path)
            cached_count += 1

    print(f"Successfully pre-trained and cached {cached_count} model weights into {WEIGHTS_DIR}!")

if __name__ == "__main__":
    train_and_cache_all_models()
