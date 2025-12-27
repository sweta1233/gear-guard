from pydantic import BaseModel
from datetime import date
from typing import Optional

class EquipmentCreate(BaseModel):
    name: str
    serial_number: str
    department: Optional[str] = None
    location: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None

class EquipmentResponse(EquipmentCreate):
    id: int
    is_scrapped: bool

    class Config:
        from_attributes = True



class MaintenanceCreate(BaseModel):
    subject: str
    description: Optional[str] = None
    request_type: str  # corrective / preventive
    equipment_id: int
    scheduled_date: Optional[date] = None

class MaintenanceResponse(MaintenanceCreate):
    id: int
    status: str
    duration_hours: Optional[float]

    class Config:
        from_attributes = True