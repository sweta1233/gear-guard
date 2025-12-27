from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models import Equipment
from app.schemas import EquipmentCreate, EquipmentResponse

router = APIRouter(prefix="/equipment", tags=["Equipment"])

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE equipment
@router.post("/", response_model=EquipmentResponse)
def create_equipment(equipment: EquipmentCreate, db: Session = Depends(get_db)):
    db_equipment = Equipment(**equipment.dict())
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

# LIST equipment
@router.get("/", response_model=List[EquipmentResponse])
def list_equipment(db: Session = Depends(get_db)):
    return db.query(Equipment).all()
