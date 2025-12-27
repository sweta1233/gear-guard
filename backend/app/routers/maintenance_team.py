from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/teams", tags=["Maintenance Teams"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE TEAM
@router.post("/", response_model=schemas.MaintenanceTeamOut)
def create_team(team: schemas.MaintenanceTeamCreate, db: Session = Depends(get_db)):
    if db.query(models.MaintenanceTeam).filter_by(name=team.name).first():
        raise HTTPException(status_code=400, detail="Team already exists")

    new_team = models.MaintenanceTeam(name=team.name)
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team


# LIST TEAMS
@router.get("/", response_model=list[schemas.MaintenanceTeamOut])
def list_teams(db: Session = Depends(get_db)):
    return db.query(models.MaintenanceTeam).all()


# ADD USER TO TEAM
@router.post("/{team_id}/members")
def add_team_member(team_id: int, user_id: int, db: Session = Depends(get_db)):
    team = db.query(models.MaintenanceTeam).get(team_id)
    user = db.query(models.User).get(user_id)

    if not team or not user:
        raise HTTPException(status_code=404, detail="Team or User not found")

    existing = db.query(models.TeamMember).filter_by(
        team_id=team_id,
        user_id=user_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already in team")

    member = models.TeamMember(team_id=team_id, user_id=user_id)
    db.add(member)
    db.commit()

    return {"message": "User added to team"}
