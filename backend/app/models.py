from sqlalchemy import Column, Integer, String, Date, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


# USER
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    teams = relationship("TeamMember", back_populates="user")



# MAINTENANCE TEAM
class MaintenanceTeam(Base):
    __tablename__ = "maintenance_teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    members = relationship("TeamMember", back_populates="team")

    equipment = relationship("Equipment", back_populates="maintenance_team")


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("maintenance_teams.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    team = relationship("MaintenanceTeam", back_populates="members")
    user = relationship("User", back_populates="teams")


# EQUIPMENT
class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    serial_number = Column(String, unique=True, nullable=False)
    department = Column(String)
    owner_name = Column(String)
    location = Column(String)
    purchase_date = Column(Date)
    warranty_expiry = Column(Date)
    is_scrapped = Column(Boolean, default=False)

    maintenance_team_id = Column(
        Integer,
        ForeignKey("maintenance_teams.id"),
        nullable=False
    )

    default_technician_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    maintenance_team = relationship("MaintenanceTeam", back_populates="equipment")
    maintenance_requests = relationship(
        "MaintenanceRequest",
        back_populates="equipment",
        cascade="all, delete"
    )


# MAINTENANCE REQUEST
class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)

    subject = Column(String, nullable=False)
    description = Column(String)
    request_type = Column(String, nullable=False)
    status = Column(String, default="new")       
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    maintenance_team_id = Column(Integer, ForeignKey("maintenance_teams.id"))
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    scheduled_date = Column(Date, nullable=True)
    duration_hours = Column(Float, nullable=True)

    equipment = relationship("Equipment", back_populates="maintenance_requests")
    maintenance_team = relationship("MaintenanceTeam")
    assigned_to = relationship("User")
