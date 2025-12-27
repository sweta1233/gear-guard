from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models import MaintenanceRequest, Equipment
from app.schemas import MaintenanceCreate, MaintenanceResponse

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE maintenance request
@router.post("/", response_model=MaintenanceResponse)
def create_request(data: MaintenanceCreate, db: Session = Depends(get_db)):
    equipment = db.query(Equipment).filter(Equipment.id == data.equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    request = MaintenanceRequest(
        subject=data.subject,
        description=data.description,
        request_type=data.request_type,
        equipment_id=data.equipment_id,
        scheduled_date=data.scheduled_date,
        status="new"
    )

    db.add(request)
    db.commit()
    db.refresh(request)
    return request

# LIST all requests
@router.get("/", response_model=List[MaintenanceResponse])
def list_requests(db: Session = Depends(get_db)):
    return db.query(MaintenanceRequest).all()
