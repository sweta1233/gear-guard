from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE MAINTENANCE REQUEST
@router.post("/", response_model=schemas.MaintenanceOut)
def create_request(req: schemas.MaintenanceCreate, db: Session = Depends(get_db)):
    equipment = db.query(models.Equipment).get(req.equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    if equipment.is_scrapped:
        raise HTTPException(status_code=400, detail="Equipment is scrapped")

    maintenance = models.MaintenanceRequest(
        subject=req.subject,
        description=req.description,
        request_type=req.request_type,
        equipment_id=req.equipment_id,
        maintenance_team_id=equipment.maintenance_team_id,
        scheduled_date=req.scheduled_date,
        status="new"
    )

    db.add(maintenance)
    db.commit()
    db.refresh(maintenance)
    return maintenance


# ASSIGN TECHNICIAN
@router.put("/{request_id}/assign")
def assign_technician(
    request_id: int,
    assign: schemas.MaintenanceAssign,
    db: Session = Depends(get_db)
):
    req = db.query(models.MaintenanceRequest).get(request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    # check technician exists
    technician = db.query(models.User).get(assign.technician_id)
    if not technician:
        raise HTTPException(status_code=404, detail="Technician not found")

    # check technician is part of team
    is_member = db.query(models.TeamMember).filter_by(
        team_id=req.maintenance_team_id,
        user_id=assign.technician_id
    ).first()

    if not is_member:
        raise HTTPException(
            status_code=403,
            detail="Technician not part of maintenance team"
        )

    req.assigned_to_id = assign.technician_id
    db.commit()
    return {"message": "Technician assigned"}


# UPDATE STATUS (KANBAN)
@router.put("/{request_id}/status")
def update_status(
    request_id: int,
    update: schemas.MaintenanceStatusUpdate,
    db: Session = Depends(get_db)
):
    req = db.query(models.MaintenanceRequest).get(request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = update.status

    if update.status == "repaired":
        req.duration_hours = update.duration_hours

    if update.status == "scrap":
        req.equipment.is_scrapped = True

    db.commit()
    return {"message": "Status updated"}



# LIST ALL (KANBAN BOARD)
@router.get("/", response_model=list[schemas.MaintenanceOut])
def list_requests(db: Session = Depends(get_db)):
    return db.query(models.MaintenanceRequest).all()


# CALENDAR VIEW (PREVENTIVE)
@router.get("/calendar", response_model=list[schemas.MaintenanceOut])
def preventive_calendar(db: Session = Depends(get_db)):
    return (
        db.query(models.MaintenanceRequest)
        .filter(models.MaintenanceRequest.request_type == "preventive")
        .all()
    )


#KANBAN
@router.get("/kanban", response_model=list[schemas.KanbanColumn])
def kanban_board(db: Session = Depends(get_db)):
    statuses = ["new", "in_progress", "repaired", "scrap"]
    result = []

    for status in statuses:
        items = (
            db.query(models.MaintenanceRequest)
            .filter(models.MaintenanceRequest.status == status)
            .all()
        )
        result.append({
            "status": status,
            "items": items
        })

    return result


@router.get("/overdue", response_model=list[schemas.OverdueOut])
def overdue_requests(db: Session = Depends(get_db)):
    today = date.today()

    overdue = (
        db.query(models.MaintenanceRequest)
        .filter(
            models.MaintenanceRequest.request_type == "preventive",
            models.MaintenanceRequest.scheduled_date < today,
            models.MaintenanceRequest.status.notin_(["repaired", "scrap"])
        )
        .all()
    )

    return overdue



@router.get("/calendar/range", response_model=list[schemas.MaintenanceOut])
def calendar_range(
    start: date,
    end: date,
    db: Session = Depends(get_db)
):
    return (
        db.query(models.MaintenanceRequest)
        .filter(
            models.MaintenanceRequest.request_type == "preventive",
            models.MaintenanceRequest.scheduled_date >= start,
            models.MaintenanceRequest.scheduled_date <= end
        )
        .all()
    )
