from sqlalchemy import Column, Integer, String, Date, Boolean, Float, ForeignKey
from .database import Base
from sqlalchemy.orm import relationship

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    serial_number = Column(String, unique=True, nullable=False)
    department = Column(String)
    location = Column(String)
    purchase_date = Column(Date)
    warranty_expiry = Column(Date)
    is_scrapped = Column(Boolean, default=False)


class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False)
    description = Column(String)
    request_type = Column(String)
    status = Column(String, default="new")
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    scheduled_date = Column(Date, nullable=True)
    duration_hours = Column(Float, nullable=True)

    equipment = relationship("Equipment")