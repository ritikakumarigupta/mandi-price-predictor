import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Date, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mandi.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class MandiPriceRecord(Base):
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(50), index=True)
    district = Column(String(50), index=True)
    market = Column(String(100), index=True)
    commodity = Column(String(50), index=True)
    date = Column(Date, index=True)
    min_price = Column(Float)
    max_price = Column(Float)
    modal_price = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String(50))
    market = Column(String(100))
    target_price = Column(Float)
    condition = Column(String(10)) # 'above' or 'below'
    active = Column(Integer, default=1)
    chat_id = Column(String(50), nullable=True) # Telegram chat ID
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
