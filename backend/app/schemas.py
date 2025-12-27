from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import date

# USER
class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


# MAINTENANCE TEAM
class MaintenanceTeamCreate(BaseModel):
    name: str


class MaintenanceTeamOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class TeamMemberOut(BaseModel):
    user_id: int
    team_id: int


# EQUIPMENT
class EquipmentCreate(BaseModel):
    name: str
    serial_number: str
    department: Optional[str] = None
    owner_name: Optional[str] = None
    location: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    maintenance_team_id: int
    default_technician_id: Optional[int] = None


class EquipmentOut(BaseModel):
    id: int
    name: str
    serial_number: str
    department: Optional[str]
    owner_name: Optional[str]
    location: Optional[str]
    purchase_date: Optional[date]
    warranty_expiry: Optional[date]
    is_scrapped: bool
    maintenance_team_id: int
    default_technician_id: Optional[int]

    class Config:
        from_attributes = True


# MAINTENANCE REQUEST
class MaintenanceCreate(BaseModel):
    subject: str
    description: Optional[str] = None
    request_type: str             
    equipment_id: int
    scheduled_date: Optional[date] = None


    @validator("request_type")
    def validate_request_type(cls, v):
        if v not in ["corrective", "preventive"]:
            raise ValueError("request_type must be 'corrective' or 'preventive'")
        return v

    @validator("scheduled_date", always=True)
    def validate_scheduled_date(cls, v, values):
        if values.get("request_type") == "preventive" and not v:
            raise ValueError("Preventive maintenance requires scheduled_date")
        return v


class MaintenanceAssign(BaseModel):
    technician_id: int


class MaintenanceStatusUpdate(BaseModel):
    status: str
    duration_hours: Optional[float] = None

    @validator("status")
    def validate_status(cls, v):
        allowed = ["new", "in_progress", "repaired", "scrap"]
        if v not in allowed:
            raise ValueError(f"status must be one of {allowed}")
        return v

    @validator("duration_hours", always=True)
    def validate_duration(cls, v, values):
        if values.get("status") == "repaired" and v is None:
            raise ValueError("duration_hours required when status is 'repaired'")
        return v


class MaintenanceOut(BaseModel):
    id: int
    subject: str
    description: Optional[str]
    request_type: str
    status: str
    equipment_id: int
    maintenance_team_id: int
    assigned_to_id: Optional[int]
    scheduled_date: Optional[date]
    duration_hours: Optional[float]

    class Config:
        from_attributes = True


# SMART BUTTON / REPORTING
class EquipmentMaintenanceSummary(BaseModel):
    equipment_id: int
    open_requests: int


# KANBAN / CALENDAR HELPERS
class KanbanColumn(BaseModel):
    status: str
    items: list[MaintenanceOut]


class OverdueOut(BaseModel):
    id: int
    subject: str
    equipment_id: int
    scheduled_date: date
    assigned_to_id: int | None