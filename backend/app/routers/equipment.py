from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/equipment", tags=["Equipment"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE EQUIPMENT
@router.post("/", response_model=schemas.EquipmentOut)
def create_equipment(eq: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    # unique serial number
    if db.query(models.Equipment).filter_by(serial_number=eq.serial_number).first():
        raise HTTPException(status_code=400, detail="Serial number already exists")

    team = db.query(models.MaintenanceTeam).get(eq.maintenance_team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Maintenance team not found")

    if eq.default_technician_id:
        tech = db.query(models.User).get(eq.default_technician_id)
        if not tech:
            raise HTTPException(status_code=404, detail="Default technician not found")

    equipment = models.Equipment(**eq.dict())
    db.add(equipment)
    db.commit()
    db.refresh(equipment)
    return equipment


# LIST EQUIPMENT (FILTERING)
@router.get("/", response_model=list[schemas.EquipmentOut])
def list_equipment(
    department: Optional[str] = Query(None),
    owner_name: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Equipment)

    if department:
        query = query.filter(models.Equipment.department == department)

    if owner_name:
        query = query.filter(models.Equipment.owner_name == owner_name)

    return query.all()


# EQUIPMENT DETAILS
@router.get("/{equipment_id}", response_model=schemas.EquipmentOut)
def get_equipment(equipment_id: int, db: Session = Depends(get_db)):
    equipment = db.query(models.Equipment).get(equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment


# SMART BUTTON: MAINTENANCE
@router.get("/{equipment_id}/maintenance")
def equipment_maintenance(equipment_id: int, db: Session = Depends(get_db)):
    equipment = db.query(models.Equipment).get(equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    requests = (
        db.query(models.MaintenanceRequest)
        .filter(
            models.MaintenanceRequest.equipment_id == equipment_id,
            models.MaintenanceRequest.status.notin_(["repaired", "scrap"])
        )
        .all()
    )

    return {
        "equipment_id": equipment_id,
        "open_requests": len(requests),
        "requests": requests
    }
