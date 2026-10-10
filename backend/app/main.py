import os
import joblib
from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.app.database import get_db, MandiPriceRecord, PriceAlert

app = FastAPI(
    title="Mandi Price Predictor API",
    description="High-performance APMC Mandi rate forecasting and decision intelligence for farmers.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), "..", "models", "weights")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "SQLite (mandi.db connected)",
        "models_cached": len(os.listdir(WEIGHTS_DIR)) if os.path.exists(WEIGHTS_DIR) else 0,
        "service": "MandiSetu High-Performance ML Engine"
    }

@app.get("/api/metadata")
def get_metadata(db: Session = Depends(get_db)):
    """Returns dynamic available mandis, districts, and commodities straight from database."""
    records = db.query(
        MandiPriceRecord.state,
        MandiPriceRecord.district,
        MandiPriceRecord.market
    ).distinct().all()

    mandis = [{"state": r[0], "district": r[1], "market": r[2]} for r in records]
    
    crops = [c[0] for c in db.query(MandiPriceRecord.commodity).distinct().all()]

    return {
        "mandis": mandis,
        "crops": crops
    }

@app.get("/api/forecast")
def get_forecast(
    market: str = Query(..., description="Mandi Market name e.g. Patna City"),
    commodity: str = Query(..., description="Crop name e.g. Wheat"),
    db: Session = Depends(get_db)
):
    """
    Sub-10ms response endpoint serving pre-cached forecasting weights and database records.
    """
    key = f"{market.replace(' ', '_').lower()}__{commodity.replace(' ', '_').lower()}.pkl"
    cached_path = os.path.join(WEIGHTS_DIR, key)

    if not os.path.exists(cached_path):
        raise HTTPException(
            status_code=404,
            detail=f"Model for market '{market}' and crop '{commodity}' not found or insufficient historical records."
        )

    # Instant memory deserialization
    cached_result = joblib.load(cached_path)

    # Query latest record from DB
    latest_records = db.query(MandiPriceRecord).filter(
        MandiPriceRecord.market == market,
        MandiPriceRecord.commodity == commodity
    ).order_by(MandiPriceRecord.date.desc()).limit(2).all()

    if not latest_records:
        raise HTTPException(status_code=404, detail="No historical price found in database.")

    latest = latest_records[0]
    prev = latest_records[1] if len(latest_records) > 1 else latest
    change_pct = round(((latest.modal_price - prev.modal_price) / prev.modal_price) * 100, 2)

    return {
        "market": latest.market,
        "commodity": latest.commodity,
        "cached": True,
        "today": {
            "date": str(latest.date),
            "min_price": int(latest.min_price),
            "max_price": int(latest.max_price),
            "modal_price": int(latest.modal_price),
            "change_pct": change_pct,
        },
        "verdict": cached_result["verdict"],
        "benchmark": {
            "baseline_sma_mae": cached_result["baseline_metrics"]["mae"],
            "model_mae": cached_result["model_metrics"]["mae"],
            "model_mape": cached_result["model_metrics"]["mape"]
        },
        "forecast_7d": cached_result["forecast_7d"]
    }
