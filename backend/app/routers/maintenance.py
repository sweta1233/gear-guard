from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models import MaintenanceRequest, Equipment
from app.schemas import MaintenanceCreate, MaintenanceResponse, StatusUpdate

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



@router.patch("/{request_id}/status", response_model=MaintenanceResponse)
def update_status(
    request_id: int,
    data: StatusUpdate,
    db: Session = Depends(get_db)
):
    request = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.id == request_id
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    # Rule: new → repaired NOT allowed
    if request.status == "new" and data.status == "repaired":
        raise HTTPException(
            status_code=400,
            detail="Cannot directly move from NEW to REPAIRED"
        )

    # Rule: duration required for repaired
    if data.status == "repaired" and not data.duration_hours:
        raise HTTPException(
            status_code=400,
            detail="Duration hours required to close request"
        )

    request.status = data.status

    if data.duration_hours:
        request.duration_hours = data.duration_hours

    # SCRAP logic
    if data.status == "scrap":
        equipment = db.query(Equipment).filter(
            Equipment.id == request.equipment_id
        ).first()
        equipment.is_scrapped = True

    db.commit()
    db.refresh(request)
    return request
